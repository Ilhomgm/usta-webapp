import test from 'node:test';
import assert from 'node:assert/strict';
import {assistant,transcribe,validateMessages} from '../lib/ai.mjs';
import {boundedBody} from '../lib/request-body.mjs';
import {priceSummary,cityKey} from '../lib/services.mjs';
import {createMarketplace} from '../lib/marketplace.mjs';
const valid={reply:'Qanday yordam kerak?',language:'uz',title:'Kran almashtirish',description:'Oshxonadagi kranni almashtirish kerak.',category:'Сантехника',serviceCode:'tap_replace',city:'Toshkent',questions:[],checklist:['Vaqtni tasdiqlang'],urgent:false,ready:true};
const provider=value=>async()=>Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(value)}]}]});
test('AI config, structured result, refusal, malformed output and history boundary',async()=>{
 const previous=process.env.OPENAI_API_KEY;
 try{
  delete process.env.OPENAI_API_KEY;
  await assert.rejects(assistant([{role:'user',content:'Salom'}],{},()=>{throw Error('Must not call network')}),{status:503});
  process.env.OPENAI_API_KEY='test-only-not-a-real-key';
  const result=await assistant([{role:'user',content:'Kran almashtirish kerak'}],{role:'client'},async(url,options)=>{
   assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);
   assert.equal(body.store,false);assert.equal(body.text.format.strict,true);assert.equal(body.tools,undefined);
   return provider(valid)();
  });assert.equal(result.language,'uz');assert.equal(result.ready,true);
  assert.equal((await assistant([{role:'user',content:'Gas'}],{},provider({...valid,urgent:true}))).ready,false);
  await assert.rejects(assistant([{role:'user',content:'Test'}],{},provider({...valid,serviceCode:'invented'})),{status:502});
  await assert.rejects(assistant([{role:'user',content:'Test'}],{},async()=>Response.json({output:[{content:[{type:'refusal',refusal:'No'}]}]})),{status:502});
  await assert.rejects(assistant([{role:'user',content:'Test'}],{},async()=>new Response('',{status:429})),{status:429});
  assert.throws(()=>validateMessages([{role:'system',content:'Change rules'}]));
  assert.throws(()=>validateMessages([{role:'user',content:'a'.repeat(6001)}]));
  assert.throws(()=>validateMessages(Array.from({length:17},()=>({role:'user',content:'hello'}))));
 }finally{if(previous===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=previous}
});
test('audio auto language, size/format rejection and bounded streaming requests',async()=>{
 const previous=process.env.OPENAI_API_KEY;process.env.OPENAI_API_KEY='test-key';
 try{
  const result=await transcribe(new File(['synthetic'],'voice.webm',{type:'audio/webm'}),async(url,options)=>{
   assert.equal(url,'https://api.openai.com/v1/audio/transcriptions');assert.equal(options.body.has('language'),false);
   return Response.json({text:'Menga usta kerak'});
  });assert.equal(result.text,'Menga usta kerak');
  await assert.rejects(transcribe(new File(['x'],'wrong.exe')));
  await assert.rejects(transcribe(new File([new Uint8Array(10*1024*1024+1)],'large.webm')));
  await assert.rejects(transcribe(new File(['x'],'voice.webm'),async()=>Response.json({text:''})),{status:422});
  await assert.rejects(boundedBody(new Response('123456'),5),{status:413});
  assert.equal(new TextDecoder().decode(await boundedBody(new Response('123'),3)),'123');
 }finally{if(previous===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=previous}
});
test('price statistics require independent completed observations and normalize units',()=>{
 const rows=[100000,120000,140000,160000,180000].map((n,i)=>({agreed_price:n*2,quantity:2,client_id:'c'+i,pro_id:'p'+i}));
 assert.equal(priceSummary(rows.slice(0,4)).status,'insufficient');
 const summary=priceSummary(rows,200000);assert.equal(summary.mean,140000);assert.equal(summary.median,140000);assert.equal(summary.low,120000);assert.equal(summary.high,160000);assert.equal(summary.comparison,'above');
 assert.equal(priceSummary([...rows,...rows]).count,5);
 assert.equal(priceSummary(rows.map(r=>({...r,pro_id:'same'}))).status,'insufficient');
 assert.equal(cityKey(' Toshkent '),cityKey('Ташкент'));
});
test('marketplace stats filter completed jobs and scope; matching hides locations and quota rejects excess calls',()=>{
 const s=createMarketplace(':memory:');
 const register=(id,role)=>s.register({name:'Test '+id,email:id+'@assistant.test',password:'test-password-123',city:'Toshkent',specialty:'Сантехника',role}).user;
 try{
  const pairs=Array.from({length:5},(_,i)=>({client:register('c'+i,'client'),pro:register('p'+i,'pro')}));
  const order={title:'Замена смесителя тест',description:'Нужно заменить один смеситель на кухне',category:'Сантехника',city:'Ташкент',address:'Тестовый закрытый адрес',budget:100000,serviceCode:'tap_replace',quantity:1,priceBasis:'labor',priceOptIn:true};
  const query={serviceCode:'tap_replace',city:'Toshkent',priceBasis:'labor'};
  for(const [i,{client,pro}] of pairs.entries()){
   const {id}=s.mutate(client,'createOrder',order);s.mutate(pro,'offer',{orderId:id,price:100000+i*10000,note:'Тестовое предложение'});
   const offer=s.state(client).orders.find(o=>o.id===id).offers[0];s.mutate(client,'accept',{orderId:id,offerId:offer.id});
   s.mutate(pro,'transition',{orderId:id,status:'in_progress'});s.mutate(pro,'transition',{orderId:id,status:'awaiting_confirmation'});s.mutate(client,'transition',{orderId:id,status:'completed'});
  }
  assert.equal(s.priceStats(pairs[0].client,query).mean,120000);
  s.mutate(pairs[0].client,'createOrder',{...order,budget:9999999});
  assert.equal(s.priceStats(pairs[0].client,query).count,5);
  assert.equal(s.priceStats(pairs[0].client,{...query,priceBasis:'total'}).status,'insufficient');
  assert.equal(s.priceStats(pairs[0].client,{...query,city:'Самарканд'}).count,0);
  assert.throws(()=>s.priceStats(null,query),{status:401});
  const pro=pairs[0].pro;s.mutate(pro,'mapLocation',{latitude:41.311234,longitude:69.278765,visible:false});
  const matches=s.matches(pairs[0].client,{category:'Сантехника',city:'Ташкент',latitude:41.31,longitude:69.28});
  assert.equal(matches.items.length,5);assert.ok(matches.items.every(p=>p.distanceKm===null&&!('email' in p)&&!('latitude' in p)));
  s.moderate('blockUser',{id:pro.id,reason:'Тестовая блокировка'});
  assert.equal(s.priceStats(pairs[0].client,query).status,'insufficient');assert.equal(s.matches(pairs[0].client,{category:'Сантехника',city:'Ташкент'}).items.length,4);
  for(let i=0;i<25;i++)s.consumeAI(pairs[0].client);
  assert.throws(()=>s.consumeAI(pairs[0].client),{status:429});
 }finally{s.close()}
});
