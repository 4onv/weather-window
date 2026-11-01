export function classifyWeather(code) {
  if(code === 0) return {label:'Clear sky',scene:'clear',icon:'☀'};
  if([1,2].includes(code)) return {label:'Partly cloudy',scene:'clouds',icon:'⛅'};
  if(code === 3) return {label:'Overcast',scene:'clouds',icon:'☁'};
  if([45,48].includes(code)) return {label:'Fog',scene:'fog',icon:'≋'};
  if([51,53,55,56,57].includes(code)) return {label:'Drizzle',scene:'rain',icon:'☂'};
  if([61,63,65,66,67,80,81,82].includes(code)) return {label:'Rain',scene:'rain',icon:'☂'};
  if([71,73,75,77,85,86].includes(code)) return {label:'Snow',scene:'snow',icon:'❄'};
  if([95,96,99].includes(code)) return {label:'Thunderstorm',scene:'storm',icon:'ϟ'};
  return {label:'Conditions unavailable',scene:'clouds',icon:'○'};
}
export function temperature(value,unit='c') { return Number.isFinite(value) ? Math.round(unit==='f'?value*9/5+32:value)+'°' : '—'; }
export function forecastSlice(hourly,nowSeconds,count=6) {
  if(!hourly?.time) return [];
  return hourly.time.map((time,index)=>({time,temp:hourly.temperature_2m?.[index],code:hourly.weather_code?.[index],chance:hourly.precipitation_probability?.[index]})).filter(item=>item.time>=nowSeconds).slice(0,count);
}
export function validLocation(value) { return Boolean(value && typeof value.name==='string' && value.name.length && Number.isFinite(value.latitude) && value.latitude>=-90 && value.latitude<=90 && Number.isFinite(value.longitude) && value.longitude>=-180 && value.longitude<=180); }
export async function fetchJSON(url,signal) {
  const timeout=AbortSignal.timeout(12000);
  const combined=signal?AbortSignal.any([signal,timeout]):timeout;
  const response=await fetch(url,{signal:combined});
  if(!response.ok) throw new Error(`Weather service returned ${response.status}`);
  return response.json();
}
export function weatherURL(location) {
 const url=new URL('https://api.open-meteo.com/v1/forecast');
 url.search=new URLSearchParams({latitude:location.latitude,longitude:location.longitude,current:'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',hourly:'temperature_2m,weather_code,precipitation_probability',daily:'sunrise,sunset',timezone:'auto',timeformat:'unixtime',forecast_days:'2'});
 return url;
}
