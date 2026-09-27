// Public positions are stable 0.01-degree cells (roughly 1 km), never exact homes.
export function readLocation(latitude, longitude) {
  const absent = value => value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
  if (absent(latitude) && absent(longitude)) return null;
  if (absent(latitude) || absent(longitude)) throw new Error('Укажите обе координаты');
  if (!['number','string'].includes(typeof latitude) || !['number','string'].includes(typeof longitude)) throw new Error('Некорректные координаты');
  const lat=Number(latitude),lng=Number(longitude);
  if (!Number.isFinite(lat)||!Number.isFinite(lng)||lat < -85||lat > 85||lng < -180||lng > 180) throw new Error('Координаты вне допустимого диапазона');
  return {latitude:lat,longitude:lng};
}
export function publicLocation(latitude,longitude) {
  const location=readLocation(latitude,longitude);
  return location ? {latitude:Math.round(location.latitude*100)/100,longitude:Math.round(location.longitude*100)/100,approximate:true} : null;
}
export function distanceKm(from,to) {
  const rad=value=>value*Math.PI/180;
  const dLat=rad(to.latitude-from.latitude),dLon=rad(to.longitude-from.longitude);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(from.latitude))*Math.cos(rad(to.latitude))*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(Math.min(1,a)),Math.sqrt(Math.max(0,1-a)));
}
