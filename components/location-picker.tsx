'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Point } from './map-canvas'
const MapCanvas=dynamic(()=>import('./map-canvas'),{ssr:false,loading:()=> <p role="status">Загружаем карту…</p>})
export const DEFAULT_CENTER:Point={latitude:41.3111,longitude:69.2797}
export function requestPosition(onSuccess:(point:Point)=>void,onError:(message:string)=>void){
 if(!navigator.geolocation){onError('Геолокация недоступна. Выберите точку на карте.');return}
 navigator.geolocation.getCurrentPosition(p=>onSuccess({latitude:p.coords.latitude,longitude:p.coords.longitude}),e=>onError(e.code===1?'Доступ к местоположению не разрешён. Выберите точку вручную.':'Не удалось определить местоположение. Выберите точку вручную.'),{enableHighAccuracy:false,timeout:12000,maximumAge:60000})
}
export default function LocationPicker({initialCenter}:{initialCenter?:Point|null}){
 const [open,setOpen]=useState(false)
 const [latitude,setLatitude]=useState('')
 const [longitude,setLongitude]=useState('')
 const [viewCenter,setViewCenter]=useState(initialCenter||DEFAULT_CENTER)
 const [error,setError]=useState('')
 const [locating,setLocating]=useState(false)
 const point=latitude!==''&&longitude!==''&&Number.isFinite(Number(latitude))&&Number.isFinite(Number(longitude))&&Math.abs(Number(latitude))<=85&&Math.abs(Number(longitude))<=180?{latitude:Number(latitude),longitude:Number(longitude)}:null
 const pick=(p:Point)=>{setLatitude(p.latitude.toFixed(6));setLongitude(p.longitude.toFixed(6));setError('')}
 return <div className="usta-location-picker"><div className="usta-picker-title"><strong>Место выполнения на карте</strong><button type="button" className="usta-text-button" onClick={()=>setOpen(!open)}>{open?'Свернуть карту':'Указать точку'}</button></div><p>{point?'Точка выбрана. Другие мастера увидят только примерный район.':'Без точки заказ появится в ленте, но не в поиске на карте.'}</p>{open&&<><div className="usta-map-actions"><button type="button" disabled={locating} className="usta-button secondary small" onClick={()=>{setLocating(true);requestPosition(p=>{pick(p);setLocating(false)},message=>{setError(message);setLocating(false)})}}>{locating?'Определяем…':'Моё местоположение'}</button><button type="button" className="usta-text-button" onClick={()=>pick(viewCenter)}>Выбрать центр карты</button></div><MapCanvas center={point||initialCenter||DEFAULT_CENTER} onPick={pick} onMove={setViewCenter} height={250}/><p>Нажмите на нужное место или переместите карту и выберите её центр.</p></>}{error&&<p role="alert" className="usta-map-error">{error}</p>}<div className={open?'usta-two-fields':'usta-coordinates-hidden'}><label>Широта<input name="latitude" type={open?'number':'hidden'} step="any" min={-85} max={85} value={latitude} onChange={e=>setLatitude(e.target.value)}/></label><label>Долгота<input name="longitude" type={open?'number':'hidden'} step="any" min={-180} max={180} value={longitude} onChange={e=>setLongitude(e.target.value)}/></label></div>{point&&<button type="button" className="usta-text-button" onClick={()=>{setLatitude('');setLongitude('')}}>Убрать точку</button>}</div>
}
