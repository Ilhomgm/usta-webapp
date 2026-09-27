import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { readLocation, publicLocation, distanceKm } from './geo.mjs';
import { services, cityKey, priceSummary } from './services.mjs';

export const categories = ['Сантехника', 'Электрика', 'Ремонт', 'Уборка', 'Техника', 'Другие услуги'];
export class DomainError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const fail = (message, status) => { throw new DomainError(message, status); };
const text = (value, min, max, label) => {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) fail(`${label}: от ${min} до ${max} символов`);
  return value.trim();
};
const money = value => {
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount < 1000 || amount > 100000000) fail('Укажите сумму от 1 000 до 100 000 000 сум');
  return amount;
};
const digest = token => createHash('sha256').update(token).digest('hex');

export function createMarketplace(filename = process.env.USTA_DB_PATH || resolve('data/usta.sqlite')) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('client','pro')), salt TEXT NOT NULL, password TEXT NOT NULL, city TEXT NOT NULL, specialty TEXT NOT NULL DEFAULT '', bio TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, client_id TEXT NOT NULL REFERENCES users(id), pro_id TEXT REFERENCES users(id), title TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, city TEXT NOT NULL, address TEXT NOT NULL, budget INTEGER NOT NULL, agreed_price INTEGER, status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS offers (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), pro_id TEXT NOT NULL REFERENCES users(id), price INTEGER NOT NULL, note TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(order_id,pro_id));
    CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), user_id TEXT NOT NULL REFERENCES users(id), body TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS reviews (order_id TEXT PRIMARY KEY REFERENCES orders(id), client_id TEXT NOT NULL REFERENCES users(id), pro_id TEXT NOT NULL REFERENCES users(id), rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), body TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), actor_id TEXT NOT NULL REFERENCES users(id), action TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS admin_actions (id TEXT PRIMARY KEY, target_id TEXT NOT NULL, action TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS orders_client ON orders(client_id);
    CREATE INDEX IF NOT EXISTS orders_pro ON orders(pro_id);
    CREATE INDEX IF NOT EXISTS messages_order ON messages(order_id,created_at);
  `);
  if (!db.prepare('PRAGMA table_info(users)').all().some(column => column.name === 'blocked')) db.exec('ALTER TABLE users ADD COLUMN blocked INTEGER NOT NULL DEFAULT 0');
  for (const [table,columns] of Object.entries({users:{latitude:'REAL',longitude:'REAL',map_visible:'INTEGER NOT NULL DEFAULT 0'},orders:{latitude:'REAL',longitude:'REAL',preferred_pro_id:'TEXT REFERENCES users(id)'}})) {
    const existing=new Set(db.prepare(`PRAGMA table_info(${table})`).all().map(column=>column.name));
    for(const [name,definition] of Object.entries(columns))if(!existing.has(name))db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
  }
  const orderColumns=new Set(db.prepare('PRAGMA table_info(orders)').all().map(c=>c.name));
  for(const [column,type] of Object.entries({service_code:"TEXT NOT NULL DEFAULT 'other'",quantity:'INTEGER NOT NULL DEFAULT 1',price_basis:"TEXT NOT NULL DEFAULT 'unknown'",price_opt_in:'INTEGER NOT NULL DEFAULT 0',completed_at:'TEXT'}))if(!orderColumns.has(column))db.exec(`ALTER TABLE orders ADD COLUMN ${column} ${type}`);
  db.exec('CREATE TABLE IF NOT EXISTS ai_usage (user_id TEXT NOT NULL, day TEXT NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(user_id,day)); PRAGMA user_version=4');
  const now = () => new Date().toISOString();
  const tx = fn => { db.exec('BEGIN IMMEDIATE'); try { const value = fn(); db.exec('COMMIT'); return value; } catch (e) { db.exec('ROLLBACK'); throw e; } };
  const publicUser = u => u && ({ id:u.id, email:u.email, name:u.name, role:u.role, city:u.city, specialty:u.specialty, bio:u.bio, location:readLocation(u.latitude,u.longitude),mapVisible:Boolean(u.map_visible) });
  const locationInput = data => {try{return readLocation(data.latitude,data.longitude)}catch(error){fail(error.message)}};
  const event = (order, actor, action) => db.prepare('INSERT INTO events VALUES (?,?,?,?,?)').run(randomUUID(),order,actor,action,now());
  const requireUser = user => { if (!user) fail('Войдите в аккаунт',401); };
  const getOrder = id => { const o = db.prepare('SELECT * FROM orders WHERE id=?').get(id); if (!o) fail('Заказ не найден',404); return o; };
  const participant = (user, order) => user.id === order.client_id || user.id === order.pro_id;
  function limit(key, maximum = 10) {
    tx(() => {
      const time = Date.now();
      db.prepare('DELETE FROM rate_limits WHERE expires_at<?').run(time);
      const row = db.prepare('SELECT * FROM rate_limits WHERE key=?').get(key);
      if (row && row.count >= maximum) fail('Слишком много попыток. Повторите через 15 минут',429);
      db.prepare('INSERT INTO rate_limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key,time+900000);
    });
  }
  function login(data) {
    const email = text(data.email,3,254,'Email').toLowerCase();
    const password = text(data.password,10,128,'Пароль');
    limit(`login:${email}`);
    const user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
    const candidate = scryptSync(password,user?.salt || 'usta-dummy-salt',64);
    if (!user || !timingSafeEqual(candidate,Buffer.from(user.password,'hex'))) fail('Неверный email или пароль',401);
    if (user.blocked) fail('Аккаунт заблокирован администратором',403);
    const token = randomBytes(32).toString('hex');
    db.prepare('DELETE FROM sessions WHERE expires_at<?').run(Date.now());
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(digest(token),user.id,Date.now()+604800000);
    return { token, user:publicUser(user) };
  }
  function register(data) {
    const name = text(data.name,2,80,'Имя');
    const email = text(data.email,3,254,'Email').toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Укажите корректный email');
    const password = text(data.password,10,128,'Пароль');
    const city = text(data.city,2,80,'Город');
    if (!['client','pro'].includes(data.role)) fail('Выберите роль');
    const specialty = data.role === 'pro' ? text(data.specialty,2,80,'Специализация') : '';
    if (specialty && !categories.includes(specialty)) fail('Неизвестная специализация');
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password,salt,64).toString('hex');
    try { db.prepare('INSERT INTO users (id,email,name,role,salt,password,city,specialty,created_at) VALUES (?,?,?,?,?,?,?,?,?)').run(randomUUID(),email,name,data.role,salt,hash,city,specialty,now()); }
    catch(e) { if (e.message.includes('UNIQUE')) fail('Этот email уже зарегистрирован',409); throw e; }
    return login({email,password});
  }
  function authenticate(token) {
    if (!token || typeof token !== 'string') return null;
    return publicUser(db.prepare('SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token=? AND s.expires_at>? AND u.blocked=0').get(digest(token),Date.now())) || null;
  }
  function state(user) {
    requireUser(user);
    const orders = user.role === 'client'
      ? db.prepare('SELECT * FROM orders WHERE client_id=? ORDER BY created_at DESC').all(user.id)
      : db.prepare("SELECT * FROM orders WHERE pro_id=? OR (status='open' AND (preferred_pro_id IS NULL OR preferred_pro_id=?)) ORDER BY created_at DESC").all(user.id,user.id);
    return { user, categories, orders:orders.map(o => {
      const own = participant(user,o);
      const offers = db.prepare('SELECT f.*,u.name AS pro_name FROM offers f JOIN users u ON u.id=f.pro_id WHERE f.order_id=?').all(o.id).filter(f => o.client_id === user.id || f.pro_id === user.id);
      const location=own?readLocation(o.latitude,o.longitude):publicLocation(o.latitude,o.longitude);
      const {latitude:_latitude,longitude:_longitude,...fields}=o;
      return { ...fields,location, address:own?o.address:null, client_id:own?o.client_id:null,
        offers, messages:own?db.prepare('SELECT m.*,u.name FROM messages m JOIN users u ON u.id=m.user_id WHERE order_id=? ORDER BY created_at').all(o.id):[],
        events:own?db.prepare("SELECT action,created_at FROM events WHERE order_id=? UNION ALL SELECT 'Администратор: ' || reason AS action,created_at FROM admin_actions WHERE target_id=? ORDER BY created_at").all(o.id,o.id):[],
        review:db.prepare('SELECT rating,body FROM reviews WHERE order_id=?').get(o.id) || null };
    }), professionals:db.prepare("SELECT u.id,u.name,u.city,u.specialty,u.bio,ROUND(AVG(r.rating),1) AS rating,COUNT(r.order_id) AS review_count FROM users u LEFT JOIN reviews r ON r.pro_id=u.id WHERE u.role='pro' AND u.blocked=0 GROUP BY u.id ORDER BY review_count DESC LIMIT 100").all() };
  }
  function mutate(user, action, data) {
    requireUser(user);
    return tx(() => {
      if (action === 'createOrder') {
        if (user.role !== 'client') fail('Создавать заказы может клиент',403);
        const id=randomUUID();
        if (!categories.includes(data.category)) fail('Выберите категорию');
        const location=locationInput(data);
        const preferred=data.preferredProId?text(data.preferredProId,1,80,'Мастер'):null;
        if(preferred&&!db.prepare("SELECT id FROM users WHERE id=? AND role='pro' AND blocked=0").get(preferred))fail('Мастер недоступен',404);
        db.prepare('INSERT INTO orders (id,client_id,title,description,category,city,address,budget,created_at,latitude,longitude,preferred_pro_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(id,user.id,text(data.title,5,120,'Название'),text(data.description,10,4000,'Описание'),data.category,text(data.city,2,80,'Город'),text(data.address,5,300,'Адрес'),money(data.budget),now(),location?.latitude??null,location?.longitude??null,preferred);
        const service=services.find(s=>s.code===(data.serviceCode||'other'));
        if(!service || (service.category&&service.category!==data.category))fail('Вид работы не соответствует категории');
        const quantity=Number(data.quantity||1);
        if(!Number.isSafeInteger(quantity)||quantity<1||quantity>1000)fail('Количество: от 1 до 1000');
        const basis=data.priceBasis||'unknown';
        if(!['labor','total','unknown'].includes(basis))fail('Укажите состав цены');
        db.prepare('UPDATE orders SET service_code=?,quantity=?,price_basis=?,price_opt_in=? WHERE id=?').run(service.code,quantity,basis,data.priceOptIn===true||data.priceOptIn==='on'?1:0,id);
        event(id,user.id,'Заказ создан'); return {id};
      }
      if (action === 'profile') {
        db.prepare('UPDATE users SET name=?,bio=? WHERE id=?').run(text(data.name,2,80,'Имя'),text(data.bio || '',0,1000,'О себе'),user.id); return {};
      }
      if(action==='mapLocation'){
        const location=locationInput(data);
        if(typeof data.visible!=='boolean')fail('Укажите настройку видимости');
        if(data.visible&&user.role!=='pro')fail('Клиенты отображаются только через свои заявки',403);
        if(data.visible&&!location)fail('Выберите район работы на карте');
        db.prepare('UPDATE users SET latitude=?,longitude=?,map_visible=? WHERE id=?').run(location?.latitude??null,location?.longitude??null,data.visible?1:0,user.id);
        return {};
      }
      const order=getOrder(text(data.orderId,1,80,'Заказ'));
      if (action === 'offer') {
        if (user.role !== 'pro' || order.status !== 'open' || (order.preferred_pro_id&&order.preferred_pro_id!==user.id)) fail('Отклик недоступен',403);
        try { db.prepare('INSERT INTO offers VALUES (?,?,?,?,?,?)').run(randomUUID(),order.id,user.id,money(data.price),text(data.note,5,1000,'Предложение'),now()); }
        catch(e) { if (e.message.includes('UNIQUE')) fail('Вы уже откликнулись на этот заказ',409); throw e; }
        event(order.id,user.id,'Получено предложение'); return {};
      }
      if (!participant(user,order)) fail('Нет доступа к заказу',403);
      if (action === 'accept') {
        if (order.client_id !== user.id || order.status !== 'open') fail('Выбор мастера недоступен',409);
        const offer = db.prepare('SELECT f.* FROM offers f JOIN users u ON u.id=f.pro_id WHERE f.id=? AND f.order_id=? AND u.blocked=0').get(String(data.offerId),order.id);
        if (!offer) fail('Предложение не найдено',404);
        db.prepare("UPDATE orders SET pro_id=?, agreed_price=?, status='assigned' WHERE id=?").run(offer.pro_id,offer.price,order.id);
        event(order.id,user.id,'Мастер выбран, цена согласована'); return {};
      }
      if (action === 'message') {
        if (!order.pro_id || ['cancelled','completed'].includes(order.status)) fail('Чат доступен во время выполнения заказа',409);
        db.prepare('INSERT INTO messages VALUES (?,?,?,?,?)').run(randomUUID(),order.id,user.id,text(data.body,1,2000,'Сообщение'),now()); return {};
      }
      if (action === 'transition') {
        const allowed = {
          assigned: order.pro_id===user.id ? 'in_progress' : null,
          in_progress: order.pro_id===user.id ? 'awaiting_confirmation' : null,
          awaiting_confirmation: order.client_id===user.id ? 'completed' : null,
        };
        const cancel = data.status==='cancelled' && order.client_id===user.id && ['open','assigned'].includes(order.status);
        if (!cancel && (!allowed[order.status] || data.status!==allowed[order.status])) fail('Этот переход статуса недоступен',409);
        db.prepare('UPDATE orders SET status=? WHERE id=?').run(data.status,order.id);
        if(data.status==='completed')db.prepare('UPDATE orders SET completed_at=? WHERE id=?').run(now(),order.id);
        event(order.id,user.id,`Статус: ${data.status}`); return {};
      }
      if (action === 'review') {
        if (order.client_id!==user.id || order.status!=='completed') fail('Отзыв доступен после подтверждения выполнения',403);
        const rating = Number(data.rating);
        if (!Number.isInteger(rating) || rating<1 || rating>5) fail('Оценка от 1 до 5');
        try { db.prepare('INSERT INTO reviews VALUES (?,?,?,?,?,?)').run(order.id,user.id,order.pro_id,rating,text(data.body,3,1000,'Отзыв'),now()); }
        catch(e) { if (e.message.includes('UNIQUE')) fail('Отзыв уже оставлен',409); throw e; }
        event(order.id,user.id,'Клиент оставил отзыв'); return {};
      }
      fail('Неизвестное действие');
    });
  }
  function nearby(user,data){
    requireUser(user);
    const center=locationInput(data);
    if(!center)fail('Выберите точку поиска');
    const radius=Number(data.radius??10);
    if(!Number.isFinite(radius)||radius<1||radius>100)fail('Радиус поиска — от 1 до 100 км');
    const category=data.category||'';
    if(category&&!categories.includes(category))fail('Неизвестная категория');
    let rows;
    if(user.role==='client'){
      rows=db.prepare("SELECT u.id,u.name,u.city,u.specialty AS category,u.bio,u.latitude,u.longitude,ROUND(AVG(r.rating),1) AS rating,COUNT(r.order_id) AS reviewCount FROM users u LEFT JOIN reviews r ON r.pro_id=u.id WHERE u.role='pro' AND u.blocked=0 AND u.map_visible=1 AND u.latitude IS NOT NULL GROUP BY u.id").all();
    }else{
      rows=db.prepare("SELECT o.id,o.title AS name,o.city,o.category,o.budget,o.latitude,o.longitude FROM orders o JOIN users u ON u.id=o.client_id WHERE o.status='open' AND u.blocked=0 AND o.latitude IS NOT NULL AND (o.preferred_pro_id IS NULL OR o.preferred_pro_id=?)").all(user.id);
    }
    const items=rows.filter(row=>!category||row.category===category).map(row=>{
      const location=publicLocation(row.latitude,row.longitude);
      const {latitude:_latitude,longitude:_longitude,...safe}=row;
      return {...safe,type:user.role==='client'?'professional':'order',location,distanceKm:distanceKm(center,location)};
    }).filter(item=>item.distanceKm<=radius).sort((a,b)=>a.distanceKm-b.distanceKm||a.id.localeCompare(b.id));
    return {items:items.slice(0,100).map(item=>({...item,distanceKm:Math.round(item.distanceKm*10)/10})),total:items.length,radius,approximate:true};
  }
  function consumeAI(user) {
    requireUser(user);
    const day=now().slice(0,10);
    const cap=Number(process.env.USTA_AI_DAILY_LIMIT)||25;
    const globalCap=Number(process.env.USTA_AI_GLOBAL_DAILY_LIMIT)||250;
    tx(()=>{
      db.prepare('DELETE FROM ai_usage WHERE day<?').run(day);
      const own=db.prepare('SELECT count FROM ai_usage WHERE user_id=? AND day=?').get(user.id,day)?.count||0;
      const all=db.prepare('SELECT SUM(count) AS count FROM ai_usage WHERE day=?').get(day).count||0;
      if(own>=cap||all>=globalCap)fail('Дневной лимит ИИ исчерпан. Карта и обычные заказы доступны.',429);
      db.prepare('INSERT INTO ai_usage VALUES (?,?,1) ON CONFLICT(user_id,day) DO UPDATE SET count=count+1').run(user.id,day);
    });
  }
  function priceStats(user,data) {
    requireUser(user);
    const service=services.find(s=>s.code===data.serviceCode);
    if(!service)fail('Выберите вид работы');
    const city=text(data.city,2,80,'Город');
    const basis=data.priceBasis||'labor';
    if(!['labor','total'].includes(basis))fail('Выберите состав цены');
    const quantity=Number(data.quantity||1);
    if(!Number.isSafeInteger(quantity)||quantity<1||quantity>1000)fail('Некорректное количество');
    const quote=data.quote===undefined||data.quote===''?null:money(data.quote)/quantity;
    const since=new Date(Date.now()-180*86400000).toISOString();
    const rows=service.code==='other'?[]:db.prepare("SELECT o.agreed_price,o.quantity,o.client_id,o.pro_id,o.city FROM orders o JOIN users p ON p.id=o.pro_id JOIN users c ON c.id=o.client_id WHERE o.status='completed' AND o.price_opt_in=1 AND o.service_code=? AND o.price_basis=? AND o.completed_at>=? AND o.agreed_price>0 AND p.blocked=0 AND c.blocked=0 ORDER BY o.completed_at DESC").all(service.code,basis,since).filter(row=>cityKey(row.city)===cityKey(city));
    return {...priceSummary(rows,quote),service,city,priceBasis:basis,days:180,source:'Согласованные суммы завершённых заказов USTA; оплата отдельно не проверялась.'};
  }
  function matches(user,data) {
    requireUser(user);
    const category=text(data.category,2,80,'Категория');
    if(!categories.includes(category))fail('Неизвестная категория');
    const city=cityKey(text(data.city,2,80,'Город'));
    const center=locationInput(data);
    const candidates=db.prepare("SELECT u.id,u.name,u.city,u.specialty,u.latitude,u.longitude,u.map_visible,ROUND(AVG(r.rating),1) AS rating,COUNT(r.order_id) AS review_count FROM users u LEFT JOIN reviews r ON r.pro_id=u.id WHERE u.role='pro' AND u.blocked=0 AND u.specialty=? GROUP BY u.id").all(category).filter(p=>cityKey(p.city)===city);
    return {items:candidates.map(p=>({id:p.id,name:p.name,city:p.city,category:p.specialty,rating:p.rating,reviewCount:p.review_count,distanceKm:center&&p.map_visible&&p.latitude!==null?Math.round(distanceKm(center,publicLocation(p.latitude,p.longitude))*10)/10:null})).sort((a,b)=>(a.distanceKm??Infinity)-(b.distanceKm??Infinity)||(b.rating||0)-(a.rating||0)||b.reviewCount-a.reviewCount||a.id.localeCompare(b.id)).slice(0,5),availabilityConfirmed:false};
  }
  // These functions are only exposed by the independently authenticated admin route.
  function adminState() {
    return {
      users: db.prepare('SELECT id,email,name,role,city,specialty,blocked,created_at FROM users ORDER BY created_at DESC').all(),
      orders: db.prepare('SELECT o.*,c.name AS client_name,p.name AS pro_name FROM orders o JOIN users c ON c.id=o.client_id LEFT JOIN users p ON p.id=o.pro_id ORDER BY o.created_at DESC').all(),
      reviews: db.prepare('SELECT r.*,c.name AS client_name,p.name AS pro_name FROM reviews r JOIN users c ON c.id=r.client_id JOIN users p ON p.id=r.pro_id ORDER BY r.created_at DESC').all(),
      audit: db.prepare('SELECT * FROM admin_actions ORDER BY created_at DESC LIMIT 200').all(),
    };
  }
  function moderate(action,data) {
    return tx(() => {
      const reason=text(data.reason,5,1000,'Причина');
      const id=text(data.id,1,80,'Идентификатор');
      if (action==='cancelOrder') {
        const order=getOrder(id);
        if (['completed','cancelled'].includes(order.status)) fail('Заказ уже закрыт',409);
        db.prepare("UPDATE orders SET status='cancelled' WHERE id=?").run(id);
      } else if (action==='blockUser' || action==='unblockUser') {
        if (!db.prepare('SELECT id FROM users WHERE id=?').get(id)) fail('Аккаунт не найден',404);
        db.prepare('UPDATE users SET blocked=? WHERE id=?').run(action==='blockUser'?1:0,id);
        db.prepare('DELETE FROM sessions WHERE user_id=?').run(id);
      } else fail('Неизвестное действие');
      db.prepare('INSERT INTO admin_actions VALUES (?,?,?,?,?)').run(randomUUID(),id,action,reason,now());
      return {ok:true};
    });
  }
  return { register,login,authenticate,state,mutate,nearby,priceStats,matches,consumeAI,limit,adminState,moderate,logout:token=>db.prepare('DELETE FROM sessions WHERE token=?').run(digest(token)),close:()=>db.close() };
}
