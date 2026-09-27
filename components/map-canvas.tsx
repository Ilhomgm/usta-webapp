'use client'
import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'
export type Point={latitude:number;longitude:number}
type Pin={id:string;name:string;location:Point}
export default function MapCanvas({center,pins=[],selected,onPick,onMove,onSelect,height=440}:{center:Point;pins?:Pin[];selected?:string|null;onPick?:(point:Point)=>void;onMove?:(point:Point)=>void;onSelect?:(id:string)=>void;height?:number}){
 const container=useRef<HTMLDivElement>(null)
 const map=useRef<L.Map|null>(null)
 const layer=useRef<L.LayerGroup|null>(null)
 const callbacks=useRef({onPick,onMove,onSelect})
 callbacks.current={onPick,onMove,onSelect}
 const start=useRef(center)
 const [ready,setReady]=useState(false)
 const [tileError,setTileError]=useState(false)
 useEffect(()=>{
  if(!container.current)return
  const instance=L.map(container.current,{center:[start.current.latitude,start.current.longitude],zoom:12,scrollWheelZoom:false,maxZoom:18})
  map.current=instance
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})
  tiles.on('tileerror',()=>setTileError(true))
  tiles.addTo(instance)
  layer.current=L.layerGroup().addTo(instance)
  instance.on('click',(event:L.LeafletMouseEvent)=>callbacks.current.onPick?.({latitude:event.latlng.lat,longitude:event.latlng.lng}))
  instance.on('moveend',()=>{const p=instance.getCenter();callbacks.current.onMove?.({latitude:p.lat,longitude:p.lng})})
  const observer=new ResizeObserver(()=>instance.invalidateSize())
  observer.observe(container.current)
  setReady(true)
  return()=>{observer.disconnect();instance.remove();map.current=null;layer.current=null}
 },[])
 useEffect(()=>{if(ready)map.current?.panTo([center.latitude,center.longitude])},[center.latitude,center.longitude,ready])
 useEffect(()=>{const pin=pins.find(p=>p.id===selected);if(ready&&pin)map.current?.panTo([pin.location.latitude,pin.location.longitude])},[selected,pins,ready])
 useEffect(()=>{
  if(!ready||!layer.current)return
  layer.current.clearLayers()
  L.circleMarker([center.latitude,center.longitude],{radius:8,color:'#fff',weight:3,fillColor:'#3774c3',fillOpacity:1}).addTo(layer.current).bindTooltip('Точка поиска / выбранная точка')
  pins.forEach((pin,index)=>{
   const marker=L.marker([pin.location.latitude,pin.location.longitude],{title:pin.name,alt:pin.name,keyboard:true,zIndexOffset:selected===pin.id?1000:0,icon:L.divIcon({className:`usta-map-pin ${selected===pin.id?'selected':''}`,html:String(index+1),iconSize:[32,32],iconAnchor:[16,16]})})
   const label=document.createElement('span');label.textContent=pin.name
   marker.bindTooltip(label).on('click',()=>callbacks.current.onSelect?.(pin.id)).addTo(layer.current!)
  })
 },[center.latitude,center.longitude,pins,selected,ready])
 return <div className="usta-map-frame"><div ref={container} style={{height}} aria-label="Интерактивная карта. Точки также доступны в списке рядом."/>{tileError&&<div className="usta-map-warning" role="status">Не удалось загрузить часть карты. Проверьте интернет; список рядом остаётся доступен.</div>}</div>
}
