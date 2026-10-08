import { HORAEngine } from './js/core/hora-engine.js';
import { createSnapshot, saveSnapshot } from './js/debug/calculation-snapshot.js';
import { formatDeg } from './js/core/geometry.js';

const engine=new HORAEngine();
const $=id=>document.getElementById(id);
let provinces=[];
const thaiMonths=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
function pad(n){return String(n).padStart(2,'0');}
function initBirthSelectors(){
  for(let d=1;d<=31;d++) $('day').insertAdjacentHTML('beforeend',`<option value="${d}">${d}</option>`);
  thaiMonths.forEach((m,i)=>$('month').insertAdjacentHTML('beforeend',`<option value="${i+1}">${m}</option>`));
  for(let y=2600;y>=2300;y--) $('year').insertAdjacentHTML('beforeend',`<option value="${y}">${y} พ.ศ.</option>`);
  for(let h=0;h<24;h++) $('hour').insertAdjacentHTML('beforeend',`<option value="${h}">${pad(h)}</option>`);
  for(let m=0;m<60;m++) $('minute').insertAdjacentHTML('beforeend',`<option value="${m}">${pad(m)}</option>`);
  $('day').value='1';$('month').value='1';$('year').value='2533';$('hour').value='12';$('minute').value='00';
}
async function loadProvinces(){provinces=await fetch('/static/data/provinces.json').then(r=>r.json());selectProvince(provinces.find(p=>p.name==='กรุงเทพมหานคร'));}
function selectProvince(p){if(!p)return;$('province').value=p.name;$('lat').value=p.lat;$('lon').value=p.lon;$('provinceSearch').value=p.name;$('selectedProvince').textContent=`${p.name} · ${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`;$('provinceList').hidden=true;}
function renderProvinceList(q=''){
 const s=q.trim().toLowerCase(); const arr=provinces.filter(p=>!s||p.name.toLowerCase().includes(s)||p.en.toLowerCase().includes(s)).slice(0,12);
 $('provinceList').innerHTML=arr.map(p=>`<button type="button" class="suggestion" data-name="${p.name}"><b>${p.name}</b><small>${p.en}</small></button>`).join('') || '<div class="no-result">ไม่พบจังหวัด</div>';
 $('provinceList').hidden=false;
 $('provinceList').querySelectorAll('.suggestion').forEach(b=>b.addEventListener('click',()=>selectProvince(provinces.find(p=>p.name===b.dataset.name))));
}
function input(){const be=Number($('year').value),ad=be-543;const date=`${ad}-${pad($('month').value)}-${pad($('day').value)}`;return {date,time:`${pad($('hour').value)}:${pad($('minute').value)}`,province:$('province').value,latitude:Number($('lat').value),longitude:Number($('lon').value),timezone:7,ayanamsa:$('ayan').value,thaiDayBoundary:'06:00'};}
function renderWheel(r){const size=500,c=250,rad=215;let s=`<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="HORA Zodiac Wheel"><circle cx="250" cy="250" r="215" fill="none" stroke="#55627c"/><circle cx="250" cy="250" r="150" fill="none" stroke="#33405a"/>`;for(let i=0;i<12;i++){const a=(i*30-90)*Math.PI/180,x=250+rad*Math.cos(a),y=250+rad*Math.sin(a);s+=`<line x1="250" y1="250" x2="${x}" y2="${y}" stroke="#33405a"/><text x="${250+(rad-25)*Math.cos((i*30+15-90)*Math.PI/180)}" y="${250+(rad-25)*Math.sin((i*30+15-90)*Math.PI/180)}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#d8b36a">${['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน'][i]}</text>`}s+=`<circle cx="250" cy="250" r="4" fill="#d8b36a"/>`;for(const p of r.planets){const a=(p.longitude-90)*Math.PI/180,x=250+125*Math.cos(a),y=250+125*Math.sin(a);s+=`<circle cx="${x}" cy="${y}" r="10" fill="#131a2c" stroke="#d8b36a"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="9">${p.name[0]}</text>`}s+='</svg>';$('wheel').innerHTML=s;}
function render(r){$('asc').innerHTML=`<b>${r.ascendant.sign.name}</b> ${formatDeg(r.ascendant.longitude)} <span class="muted">(${r.ascendant.navamsa.signName})</span>`;$('sunrise').textContent=`อาทิตย์อุทัยจริง: ${r.sunrise??'ไม่พบ'} · เส้นแบ่งวันทักษา: 06:00 น. ท้องถิ่น`;$('meta').innerHTML=`Engine ${r.metadata.engineVersion}<br>Ephemeris ${r.metadata.ephemeris}<br>Ayanamsa ${r.metadata.ayanamsa}<br>Ruleset ${r.metadata.rulesetVersion}`;$('thaksa').innerHTML=Object.entries(r.thaksa.roles).map(([a,b])=>`<span class="pill">${a}: ${b}</span>`).join('');$('planets').innerHTML=r.planets.map(p=>`<div class="planet"><span>${p.name}</span><span>${p.sign.name} ${formatDeg(p.longitude)} · เรือน ${p.house} ${p.retrograde?'· ม':''}</span></div>`).join('');$('houses').innerHTML=r.houses.map(h=>`<div class="planet"><span>${h.number}. ${h.name}</span><span>${h.sign.name} ${formatDeg(h.cusp)}</span></div>`).join('');renderWheel(r);const snap=createSnapshot(input(),r);saveSnapshot(snap);$('debug').textContent=JSON.stringify(snap,null,2);}
$('provinceSearch').addEventListener('focus',()=>renderProvinceList($('provinceSearch').value));$('provinceSearch').addEventListener('input',e=>renderProvinceList(e.target.value));$('provinceClear').addEventListener('click',()=>{ $('provinceSearch').value='';renderProvinceList('');$('provinceSearch').focus();});document.addEventListener('click',e=>{if(!e.target.closest('.combo'))$('provinceList').hidden=true;});
$('calc').addEventListener('click',async()=>{ $('msg').textContent='กำลังคำนวณ…';try{const r=await engine.calculate(input());render(r);$('msg').innerHTML='<span class="ok">PASS — Calculation Complete</span>';}catch(e){$('msg').innerHTML=`<span class="error">FAIL — ${e.message}</span>`;}});
initBirthSelectors();loadProvinces().then(()=>$('calc').click());
