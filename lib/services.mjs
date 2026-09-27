export const services = [
 {code:'tap_replace',label:'Замена одного смесителя',category:'Сантехника',unit:'шт.'},
 {code:'drain_clear',label:'Прочистка одного слива',category:'Сантехника',unit:'шт.'},
 {code:'outlet_replace',label:'Замена одной розетки',category:'Электрика',unit:'шт.'},
 {code:'light_install',label:'Установка одного светильника',category:'Электрика',unit:'шт.'},
 {code:'ac_clean',label:'Чистка одного кондиционера',category:'Техника',unit:'шт.'},
 {code:'washer_diagnosis',label:'Диагностика стиральной машины',category:'Техника',unit:'выезд'},
 {code:'cleaning_hour',label:'Обычная уборка',category:'Уборка',unit:'час'},
 {code:'other',label:'Другая / комплексная работа',category:null,unit:'заказ'},
];
export const cityKey = value => {
 const key=String(value).trim().toLowerCase().replace(/\s+/g,' ');
 return ['tashkent','toshkent','тошкент','ташкент'].includes(key)?'ташкент':key;
};
// A descriptive sample, never a verdict about a professional's honesty.
export function priceSummary(rows, quote=null) {
 const unique=new Map();
 for(const row of rows) {
  const key=`${row.client_id}:${row.pro_id}`;
  if(!unique.has(key))unique.set(key,row);
 }
 const sample=[...unique.values()];
 const count=sample.length;
 const sufficient=count>=5 && new Set(sample.map(r=>r.pro_id)).size>=3 && new Set(sample.map(r=>r.client_id)).size>=3;
 if(!sufficient)return {status:'insufficient',count,minimum:5,mean:null,median:null,low:null,high:null,comparison:null};
 const prices=sample.map(r=>r.agreed_price/r.quantity).sort((a,b)=>a-b);
 const quantile=p=>{const index=(prices.length-1)*p;const lower=Math.floor(index);return Math.round(prices[lower]+(prices[Math.ceil(index)]-prices[lower])*(index-lower))};
 const low=quantile(.25),high=quantile(.75),median=quantile(.5);
 return {status:'available',count,minimum:5,mean:Math.round(prices.reduce((a,b)=>a+b,0)/count),median,low,high,
  comparison:Number.isFinite(quote)&&quote>0?(quote>high?'above':quote<low?'below':'within'):null};
}
