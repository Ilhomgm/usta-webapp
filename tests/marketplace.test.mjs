import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createMarketplace } from '../lib/marketplace.mjs';

const account = (store,role,id) => store.register({name:`User ${id}`,email:`${id}@test.example`,password:'test-password-1234',role,city:'Ташкент',specialty:'Сантехника'});
const orderData={title:'Заменить смеситель',description:'Нужно установить новый смеситель на кухне',category:'Сантехника',city:'Ташкент',address:'Тестовая улица, дом 10',budget:150000};
test('complete order lifecycle, privacy, permissions, chat and verified review',()=>{
 const s=createMarketplace(':memory:');
 try {
  const client=account(s,'client','client').user;
  const pro=account(s,'pro','pro').user;
  const stranger=account(s,'client','stranger').user;
  const second=account(s,'pro','second').user;
  const {id}=s.mutate(client,'createOrder',orderData);
  assert.equal(s.state(stranger).orders.length,0);
  assert.equal(s.state(pro).orders[0].address,null);
  assert.equal(s.state(pro).orders[0].client_id,null);
  assert.throws(()=>s.mutate(pro,'createOrder',orderData),/клиент/);
  assert.throws(()=>s.mutate(stranger,'message',{orderId:id,body:'test'}),/Нет доступа/);
  assert.throws(()=>s.mutate(client,'review',{orderId:id,rating:5,body:'great'}),/после/);
  s.mutate(pro,'offer',{orderId:id,price:125000,note:'Приеду завтра, установка включена'});
  assert.throws(()=>s.mutate(pro,'offer',{orderId:id,price:125000,note:'Повтор'}),/уже/);
  s.mutate(second,'offer',{orderId:id,price:130000,note:'Могу выполнить сегодня'});
  assert.equal(s.state(pro).orders[0].offers.length,1);
  const offers=s.state(client).orders[0].offers;
  s.mutate(client,'accept',{orderId:id,offerId:offers.find(o=>o.pro_id===pro.id).id});
  assert.throws(()=>s.mutate(client,'accept',{orderId:id,offerId:offers.find(o=>o.pro_id===second.id).id}),/недоступен/);
  assert.equal(s.state(pro).orders[0].address,orderData.address);
  assert.equal(s.state(pro).orders[0].agreed_price,125000);
  assert.equal(s.state(second).orders.length,0);
  assert.throws(()=>s.mutate(second,'message',{orderId:id,body:'hello'}),/Нет доступа/);
  assert.throws(()=>s.mutate(client,'transition',{orderId:id,status:'completed'}),/недоступен/);
  s.mutate(client,'message',{orderId:id,body:'Буду дома в 10 утра'});
  s.mutate(pro,'message',{orderId:id,body:'Хорошо, до встречи'});
  assert.equal(s.state(client).orders[0].messages.length,2);
  s.mutate(pro,'transition',{orderId:id,status:'in_progress'});
  assert.throws(()=>s.mutate(client,'transition',{orderId:id,status:'cancelled'}),/недоступен/);
  s.mutate(pro,'transition',{orderId:id,status:'awaiting_confirmation'});
  assert.throws(()=>s.mutate(pro,'transition',{orderId:id,status:'completed'}),/недоступен/);
  s.mutate(client,'transition',{orderId:id,status:'completed'});
  s.mutate(client,'review',{orderId:id,rating:5,body:'Работа выполнена аккуратно'});
  assert.throws(()=>s.mutate(client,'review',{orderId:id,rating:1,body:'Повторный отзыв'}),/уже/);
  assert.throws(()=>s.mutate(client,'message',{orderId:id,body:'after close'}),/во время/);
  const profile=s.state(client).professionals.find(p=>p.id===pro.id);
  assert.equal(profile.rating,5); assert.equal(profile.review_count,1);
  assert.equal(s.state(client).orders[0].events.length,8);
 } finally{s.close()}
});
test('accounts, sessions and orders survive reopening database; logout revokes token',()=>{
 const directory=mkdtempSync(join(tmpdir(),'usta-test-'));
 const path=join(directory,'db.sqlite');
 let s=createMarketplace(path);
 try {
  const {user,token}=account(s,'client','persistent');
  assert.equal(s.authenticate(token).id,user.id);
  assert.equal(s.authenticate('forged'),null);
  assert.throws(()=>s.login({email:user.email,password:'incorrect-password'}),/Неверный/);
  assert.throws(()=>account(s,'client','persistent'),/уже/);
  const {id}=s.mutate(user,'createOrder',orderData);
  s.close();s=createMarketplace(path);
  assert.equal(s.authenticate(token).id,user.id);
  assert.equal(s.state(user).orders[0].id,id);
  s.logout(token);assert.equal(s.authenticate(token),null);
  assert.throws(()=>s.state(null),/Войдите/);
 } finally{s.close();rmSync(directory,{recursive:true,force:true})}
});
test('validation and cancellation prevent invalid writes',()=>{
 const s=createMarketplace(':memory:');
 try {
  const client=account(s,'client','client').user;
  const pro=account(s,'pro','pro').user;
  for(const budget of [-1,0,1.5,NaN,100000001]) assert.throws(()=>s.mutate(client,'createOrder',{...orderData,budget}));
  assert.equal(s.state(client).orders.length,0);
  const {id}=s.mutate(client,'createOrder',orderData);
  s.mutate(client,'transition',{orderId:id,status:'cancelled'});
  assert.throws(()=>s.mutate(pro,'offer',{orderId:id,price:125000,note:'Test offer'}),/недоступен/);
  assert.equal(s.state(pro).orders.length,0);
  assert.equal(s.state(client).orders[0].status,'cancelled');
  for(let i=0;i<3;i++)s.limit('test-key',3);
  assert.throws(()=>s.limit('test-key',3),/Слишком много/);
 }finally{s.close()}
});
test('moderation revokes sessions, hides blocked masters, audits reasons and prevents closed-order edits',()=>{
 const s=createMarketplace(':memory:');
 try {
  const {user:client}=account(s,'client','moderation-client');
  const {user:pro,token}=account(s,'pro','moderation-pro');
  const {id}=s.mutate(client,'createOrder',orderData);
  s.mutate(pro,'offer',{orderId:id,price:125000,note:'Готов выполнить'});
  const offerId=s.state(client).orders[0].offers[0].id;
  assert.throws(()=>s.moderate('blockUser',{id:pro.id,reason:'x'}),/Причина/);
  s.moderate('blockUser',{id:pro.id,reason:'Проверка блокировки тестового аккаунта'});
  assert.equal(s.authenticate(token),null);
  assert.equal(s.state(client).professionals.length,0);
  assert.throws(()=>s.login({email:pro.email,password:'test-password-1234'}),/заблокирован/);
  assert.throws(()=>s.mutate(client,'accept',{orderId:id,offerId}),/не найдено/);
  s.moderate('unblockUser',{id:pro.id,reason:'Проверка разблокировки тестового аккаунта'});
  assert.equal(s.authenticate(token),null);
  assert.ok(s.login({email:pro.email,password:'test-password-1234'}).token);
  s.mutate(client,'accept',{orderId:id,offerId});
  s.moderate('cancelOrder',{id,reason:'Тестовая отмена администратором'});
  assert.equal(s.state(client).orders[0].status,'cancelled');
  assert.ok(s.state(client).orders[0].events.some(e=>e.action.includes('администратором')));
  assert.throws(()=>s.moderate('cancelOrder',{id,reason:'Повторная отмена'}),/уже закрыт/);
  const snapshot=s.adminState();
  assert.equal(snapshot.audit.length,3);
  assert.equal(snapshot.orders.length,1);
  assert.equal(snapshot.users.length,2);
  assert.ok(snapshot.users.every(u=>!('password' in u)&&!('salt' in u)));
 } finally{s.close()}
});
