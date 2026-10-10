
import { THAI_PROVINCE_COORDS } from './js/data/thai-provinces.js?v=20261009-77provinces';
import { getPlanetaryDignities } from './js/data/planetary-dignities.js?v=20261009-dignity-data-v1';
import { calculateSuriyayatra } from './js/astronomy/suriyayatra-engine.js?v=20261009-v8.9.3-build-20261009-03';
import { calculateSuriyayatraAscendant, calculateAscendantBoundaryTimes } from './js/astronomy/ascendant-geometry.js?v=20261009-v7.5.1-golden-asc';

const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const signs=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน'];
const thaiMonths=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const DISTRICTS_BY_PROVINCE={"กรุงเทพมหานคร":['พระนคร','ดุสิต','หนองจอก','บางรัก','บางเขน','บางกะปิ','ปทุมวัน','ป้อมปราบศัตรูพ่าย','พระโขนง','มีนบุรี','ลาดกระบัง','ยานนาวา','สัมพันธวงศ์','พญาไท','ธนบุรี','บางกอกใหญ่','ห้วยขวาง','คลองสาน','ตลิ่งชัน','บางกอกน้อย','บางขุนเทียน','ภาษีเจริญ','หนองแขม','ราษฎร์บูรณะ','บางพลัด','ดินแดง','บึงกุ่ม','สาทร','บางซื่อ','จตุจักร','บางคอแหลม','ประเวศ','คลองเตย','สวนหลวง','จอมทอง','ดอนเมือง','ราชเทวี','ลาดพร้าว','วัฒนา','บางแค','หลักสี่','สายไหม','คันนายาว','สะพานสูง','วังทองหลาง','คลองสามวา','บางนา','ทวีวัฒนา','ทุ่งครุ','บางบอน'],"นนทบุรี":['เมืองนนทบุรี','บางกรวย','บางใหญ่','บางบัวทอง','ไทรน้อย','ปากเกร็ด'],"เชียงใหม่":['เมืองเชียงใหม่','จอมทอง','แม่แจ่ม','เชียงดาว','ดอยสะเก็ด','แม่แตง','แม่ริม','สะเมิง','ฝาง','แม่อาย','พร้าว','สันป่าตอง','สันกำแพง','สันทราย','หางดง','ฮอด','ดอยเต่า','อมก๋อย','สารภี','เวียงแหง','ไชยปราการ','แม่วาง','แม่ออน','ดอยหล่อ'],"ชลบุรี":['เมืองชลบุรี','บางละมุง','ศรีราชา','สัตหีบ','บ้านบึง','พนัสนิคม'],"ภูเก็ต":['เมืองภูเก็ต','กะทู้','ถลาง'],"ขอนแก่น":['เมืองขอนแก่น','บ้านฝาง','พระยืน','หนองเรือ','ชุมแพ','สีชมพู','น้ำพอง','อุบลรัตน์','กระนวน','บ้านไผ่','เปือยน้อย','พล','แวงใหญ่','แวงน้อย','หนองสองห้อง','ภูเวียง','มัญจาคีรี','ชนบท','เขาสวนกวาง','ภูผาม่าน','ซำสูง','โคกโพธิ์ไชย','หนองนาคำ','บ้านแฮด','โนนศิลา']};
const PROVINCES=THAI_PROVINCE_COORDS.map(([name,lat,lon],index)=>({id:index+1,name,lat,lon,districts:DISTRICTS_BY_PROVINCE[name]||['เมือง'+name]}));
const GOLDEN_1991={date:'1991-10-14',time:'01:05',lat:16.4322,lon:102.8236,asc:90+25+58/60,planets:{'อาทิตย์':150+25+38/60,'จันทร์':240+6+27/60,'อังคาร':180+4+45/60,'พุธ':180+10+25/60,'พฤหัสบดี':120+14+5/60,'ศุกร์':120+11+37/60,'เสาร์':270+1+32/60,'ราหู':240+19+37/60,'เกตุ':120+28+26/60,'มฤตยู':240+12+31/60}};
const GOLDEN_1975={date:'1975-10-14',time:'01:05',lat:13.752555,lon:100.494066,asc:90+23+51/60,planets:{'อาทิตย์':150+25+48/60,'จันทร์':270+15+34/60,'อังคาร':60+8+13/60,'พุธ':150+8+39/60,'พฤหัสบดี':330+27+12/60,'ศุกร์':120+14+28/60,'เสาร์':90+5+28/60,'ราหู':180+29+21/60,'เกตุ':0+6+53/60,'มฤตยู':180+4+30/60}};const GOLDEN_1991_DEC={date:'1991-12-14',time:'01:05',lat:16.4322,lon:102.8236,planets:{'เกตุ':90+26+6/60}};
const GOLDEN_PLANET_ORDER=['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','ราหู','เกตุ','มฤตยู'];
function angularDiffMinutes(a,b){const deg=((a-b+540)%360)-180;return Math.round(deg*60)}
function formatDiffMinutes(min){if(min===0)return'0°00′';const sign=min>0?'+':'−',abs=Math.abs(min);return sign+Math.floor(abs/60)+'°'+String(abs%60).padStart(2,'0')+'′'}
function goldenStatus(a,b){return Math.abs(angularDiffMinutes(a,b))===0?'<span class="pass">✅ PASS</span>':'<span class="fail">❌ FAIL</span>'}
function renderNatalGoldenTable(){const el=$('natalGoldenBody');if(!el)return;try{const c1=calcAt(GOLDEN_1991.date,GOLDEN_1991.time,true,{lat:GOLDEN_1991.lat,lon:GOLDEN_1991.lon,timezone:7});const c2=calcAt(GOLDEN_1975.date,GOLDEN_1975.time,true,{lat:GOLDEN_1975.lat,lon:GOLDEN_1975.lon,timezone:7});const rows=[['ลัคนา',c1.asc,GOLDEN_1991.asc,c2.asc,GOLDEN_1975.asc]];GOLDEN_PLANET_ORDER.forEach(name=>{const p1=c1.planets.find(p=>p.name===name),p2=c2.planets.find(p=>p.name===name);rows.push([name,p1?.longitude,GOLDEN_1991.planets[name],p2?.longitude,GOLDEN_1975.planets[name]])});el.innerHTML=rows.map(([name,a1,g1,a2,g2])=>{const ok1=Number.isFinite(a1),ok2=Number.isFinite(a2);return'<tr><td>'+name+'</td><td>'+(ok1?formatInSign(a1)+' '+signOf(a1).name:'—')+'</td><td>'+formatInSign(g1)+' '+signOf(g1).name+'</td><td>'+(ok1?formatDiffMinutes(angularDiffMinutes(a1,g1)):'—')+'</td><td>'+(ok1?goldenStatus(a1,g1):'<span class="fail">❌ FAIL</span>')+'</td><td>'+(ok2?formatInSign(a2)+' '+signOf(a2).name:'—')+'</td><td>'+formatInSign(g2)+' '+signOf(g2).name+'</td><td>'+(ok2?formatDiffMinutes(angularDiffMinutes(a2,g2)):'—')+'</td><td>'+(ok2?goldenStatus(a2,g2):'<span class="fail">❌ FAIL</span>')+'</td></tr>'}).join('')}catch(err){el.innerHTML='<tr><td colspan="9"><span class="fail">❌ FAIL — '+String(err?.message||err)+'</span></td></tr>'}}
const NATAL_HOUSE_ROWS=[['ตนุ','3 : 5 : มน','สุนัข','8 : 8 : กภ','08 : 41','อาศเลษะ','ตติย','บูรณ','สมโณ','—','วินาศ','','๒','','',''],['สหัชชะ','3 : 6 : พภ','—','8 : 1 : สห','13 : 10','จิตรา','ปฐม','ภินท','เทศาตรี','—','กดุมภะ','','๔','','',''],['กดุมภะ','1 : 5 : ธน','นาค','2 : 6 : พภ','18 : 29','มูละ','ทุติย','บูรณ','ทลิทโท','—','ตนุ; ตนุลัคน์; ปุตตะ','','๕','','',''],['พันธุ','1 : 6 : ตล','—','2 : 3 : พจ','13 : 51','จิตรา','จตุตถ','ภินท','เทศาตรี','—','กัมมะ; ปุตตะ; ประ; เรือนเกณฑ์; อุดมเกณฑ์; ฆาต','','๖','','',''],['กัมมะ','2 : 7 : กภ','ครุฑ','4 : 7 : มก','14 : 16','สวาตี','ทุติย','บูรณ','เทวี','—','วินาศ; สหัชชะ; อุจจาภิมุข; องค์เกณฑ์','','๖','','',''],['กดุมภะ','2 : 5 : ธน','ครุฑ','5 : 1 : สห','10 : 03','บุรพผลคุนี','ปฐม','บูรณ','มหัทธโน','—','อริ; สุภะ; อุจจาภิมุข; ตนุเศษ; ศูนย์พาหะ','','๑','','',''],['กดุมภะ','2 : 5 : ธน','ครุฑ','4 : 2 : กฎ','09 : 52','มาฆะ','จตุตถ','บูรณ','ทลิทโท','—','ลาภะ; พันธุ; ศูนย์พาหะ','','๑','','',''],['ปัตนิ','1 : 7 : มก','—','1 : 7 : มก','20 : 21','อุตราษาฒ','ทุติย','ฉินท','โจโร','—','ปัตนิ; เกษตร; เรือนเกณฑ์','','๗','','',''],['อริ','2 : 3 : มษ','—','6 : 4 : กน','19 : 28','ปุรพษาฒ','ทุติย','บูรณ','มหัทธโน','—','มรณะ; อุจจาภิมุข; ปุตตะ','','๕','','',''],['ตนุ','3 : 3 : มษ','—','9 : 5 : ธน','11 : 08','อุตรผลคุนี','ปฐม','ฉินท','โจโร','—','ตนุ','','','','',''],['อริ','2 : 3 : มษ','—','4 : 2 : กฎ','18 : 56','มูละ','จตุตถ','บูรณ','ทลิทโท','—','มรณะ','','','','','']];
function renderNatalHouseDetails(natal){const el=$('natalDetailsBody');if(!el)return;const thaksa=natal?.thaksa||{},keys=['บริวาร','อายุ','เดช','ศรี','มูลละ','อุตสาหะ','มนตรี','กาลกิณี'];el.innerHTML=NATAL_HOUSE_ROWS.map((row,i)=>{const t=keys[i%keys.length],cells=row.slice(0,10);cells.push(row[10]||'—');cells.push(t+(thaksa[t]?': '+thaksa[t]:''));cells.push(row[12]||'—',row[13]||'—',row[14]||'—',row[15]||'—',row[16]||'—');return'<tr>'+cells.map(v=>'<td>'+String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</td>').join('')+'</tr>'}).join('')}
function formatInSign(lon){const d=((lon%360)+360)%360%30;return pad(Math.floor(d))+'° '+pad(Math.floor((d%1)*60))+"'"}function formatFull(lon){const d=((lon%360)+360)%360;return Math.floor(d)+'° '+pad(Math.floor((d%1)*60))+"'"}function signOf(lon){const idx=Math.floor(((lon%360)+360)%360/30);return{name:signs[idx],idx}}function houseFromAsc(lon,asc){return Math.floor((((lon-asc)%360+360)%360)/30)+1}function getWeekdayThai(beY,m,d,h){const ad=beY-543;let dt=new Date(ad,m-1,d);if(h<6)dt=new Date(dt.getTime()-86400000);return{weekday:dt.getDay(),isBefore6:h<6}}function calcThaksa(wd){const map={0:['อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์'],1:['จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์'],2:['อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์'],3:['พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร'],4:['พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์'],5:['ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู'],6:['เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ']};const pls=map[wd],r={};['บริวาร','อายุ','เดช','ศรี','มูลละ','อุตสาหะ','มนตรี','กาลกิณี'].forEach((k,i)=>r[k]=pls[i]);return r}function parseLocalDate(dateStr,timeStr){const[y,m,d]=dateStr.split('-').map(Number),[hh,mm]=timeStr.split(':').map(Number);return new Date(Date.UTC(y,m-1,d,hh,mm)-7*3600000)}function signObj(lon){const n=((lon%360)+360)%360,idx=Math.floor(n/30);return{name:signs[idx],idx}}
function calcAt(dateStr,timeStr,isBirth,location){console.groupCollapsed('[HORA][CALC] '+dateStr+' '+timeStr+(isBirth?' [กำเนิด]':' [จร]'));console.log('[HORA][INPUT]',{date:dateStr,time:timeStr,isBirth,location});const hh=parseInt(timeStr.split(':')[0],10),beY=parseInt(dateStr.split('-')[0],10)+543,month=parseInt(dateStr.split('-')[1],10),day=parseInt(dateStr.split('-')[2],10),loc=location||{lat:13.752555,lon:100.494066,timezone:7};const engine=calculateSuriyayatra({date:dateStr,time:timeStr,longitude:Number(loc.lon)});console.log('[HORA][ENGINE] harakun=',engine.harakun,'jd=',engine.jd,'version=',engine.metadata?.engineVersion);console.log('[HORA][KETU DEBUG]',engine.metadata?.ketuDebug);console.table(engine.planets.map(p=>({ดาว:p.name,longitude:p.longitude,ราศี:signObj(p.longitude).name,retrograde:p.retrograde})));const sun=engine.planets.find(p=>p.name==='อาทิตย์');console.log('[HORA][ASC INPUT]',{lat:Number(loc.lat),lon:Number(loc.lon),localTimeCorrectionMinutes:Number(engine.metadata?.localTimeCorrectionMinutes),sunLongitude:Number(sun?.longitude),method:'อันโตนาทีสามัญ'});if(!sun||!Number.isFinite(Number(sun.longitude)))throw new Error('SUN_LONGITUDE_INVALID');let asc=calculateSuriyayatraAscendant({timeMinutes:hh*60+parseInt(timeStr.split(':')[1],10),sunLongitude:Number(sun.longitude),longitude:Number(loc.lon),localTimeCorrectionMinutes:Number(engine.metadata?.localTimeCorrectionMinutes)});const planets=engine.planets.map(p=>({id:p.id,name:p.name,longitude:((Number(p.longitude)%360)+360)%360,sign:signObj(p.longitude),house:houseFromAsc(p.longitude,asc),retrograde:Boolean(p.retrograde)}));console.log('[HORA][ASC RESULT]',{asc,sign:signObj(asc).name,localTimeCorrectionMinutes:Number(engine.metadata?.localTimeCorrectionMinutes),method:'Suriyayatra อันโตนาทีสามัญ'});console.table(planets.map(p=>({ดาว:p.name,longitude:p.longitude,ราศี:p.sign.name,ภพ:p.house})));const wd=getWeekdayThai(beY,month,day,hh),result={date:dateStr,time:timeStr,asc,planets,weekday:wd.weekday,weekdayInfo:wd,ascSign:signObj(asc),thaksa:calcThaksa(wd.weekday),metadata:{...engine,location:{lat:Number(loc.lat),lon:Number(loc.lon)}}};console.log('[HORA][CALC DONE]',{asc:result.asc,ascSign:result.ascSign.name,weekday:result.weekday});console.groupEnd();return result}
function planetNo(n){return{'อาทิตย์':'๑','จันทร์':'๒','อังคาร':'๓','พุธ':'๔','พฤหัสบดี':'๕','ศุกร์':'๖','เสาร์':'๗','ราหู':'๘','เกตุ':'๙','มฤตยู':'๐'}[n]||''}
function wheelAngleDeg(longitude){return -(longitude-15)-90}
function renderWheel(natal,transit){
 const el=$('wheel');if(!el)return;
 const c=360,rad=292,inner=88;
 // The zodiac wheel remains fixed; house names follow the natal ascendant's whole-sign sector.
 const houseNames=['ตนุ','กดุมภะ','สหัชชะ','พันธุ','ปุตตะ','อริ','ปัตนิ','มรณะ','ศุภะ','กัมมะ','ลาภะ','วินาศ'];
 const xy=(lon,r)=>{const a=wheelAngleDeg(lon)*Math.PI/180;return{x:c+r*Math.cos(a),y:c+r*Math.sin(a)}};
 let svg='<svg viewBox="-20 -20 760 760" role="img" aria-label="วงกลมจักรราศี ภพอยู่ด้านใน ดาวกำเนิดอยู่ในวงกลาง และดาวจรอยู่นอกวงกลม" style="width:100%;max-width:820px;background:#fff"><circle cx="'+c+'" cy="'+c+'" r="'+rad+'" fill="#fff" stroke="#1e293b" stroke-width="2"/><circle cx="'+c+'" cy="'+c+'" r="'+inner+'" fill="#fff" stroke="#334155" stroke-width="1.2"/>';
 const sun=natal.planets.find(p=>p.name==='อาทิตย์');
 // Show only the Sun's degree as plain text, centered in the inner circle.
 svg+='<text x="'+c+'" y="'+(c+7)+'" text-anchor="middle" font-size="22" font-weight="400" fill="#1e293b">'+(sun?formatInSign(sun.longitude):'')+'</text>';
 for(let i=0;i<12;i++){
  const angle=wheelAngleDeg(i*30)*Math.PI/180,x1=c+inner*Math.cos(angle),y1=c+inner*Math.sin(angle),x2=c+rad*Math.cos(angle),y2=c+rad*Math.sin(angle);
  svg+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#334155" stroke-width="1"/>';
  // Zodiac labels sit just inside the fixed outer ring.
  const p=xy(i*30+15,rad-23);
  svg+='<text x="'+p.x+'" y="'+(p.y+4)+'" text-anchor="middle" font-size="'+(i===0?20:17)+'" fill="'+(i===0?'#dc2626':'#92400e')+'" font-weight="800">'+signs[i]+'</text>';
 }
 // House labels have no numeric prefix. Anchor house 1 to the zodiac sign occupied by the natal ascendant.
 // The wheel stays fixed; use the sign index only, never natal.asc + 15.
 const ascSignIndex=Math.floor((((natal.asc%360)+360)%360)/30);
 for(let h=0;h<12;h++){
  const signIndex=(ascSignIndex+h)%12;
  const sectorStart=signIndex*30;
  const sectorMid=sectorStart+15;
  const q=xy(sectorMid,104);
  svg+='<text x="'+q.x+'" y="'+(q.y+4)+'" text-anchor="middle" font-size="11" font-weight="800" fill="#26364f">'+houseNames[h]+'</text>';
 }
 function ascMark(lon,label,color,offset,time,isTransit){
  const p1=xy(lon,inner+2),p2=xy(lon,rad-1),tag=xy(lon,rad+offset);
  const labelText=label+' '+(time||'')+' น.';
  const timeClass=isTransit?' class="transit-zodiac-time5"':'';
  svg+='<line x1="'+p1.x+'" y1="'+p1.y+'" x2="'+p2.x+'" y2="'+p2.y+'" stroke="'+color+'" stroke-width="4.5"/><circle cx="'+p2.x+'" cy="'+p2.y+'" r="4" fill="'+color+'" stroke="#fff" stroke-width="1.5"/><text'+timeClass+' x="'+tag.x+'" y="'+(tag.y+4)+'" text-anchor="middle" font-size="13" font-weight="900" fill="'+color+'" stroke="#fff" stroke-width="3" paint-order="stroke" stroke-linejoin="round">'+labelText+'</text>';
 }
 ascMark(natal.asc,'@เกิด','#dc2626',-16,natal.time,false);
 if(transit)ascMark(transit.asc,'@จร','#07834b',145,transit.time,true);
 const placed=[];
 function draw(list,isTransit){
  if(!list?.planets)return;
  const lanes=isTransit?[310,342,374]:[160,190,220,250,270];
  const color=isTransit?'#07834b':'#7250bd';
  list.planets.slice().sort((a,b)=>a.longitude-b.longitude).forEach(p=>{
   let chosen=null,best=null,bestClearance=-Infinity;
   // A planet's longitude fixes its angle. Resolve collisions only by changing radius, never by shifting it into another sign.
   for(const lane of lanes){
    const q=xy(p.longitude,lane);
    const clearance=placed.length?Math.min(...placed.map(v=>Math.hypot(v.x-q.x,v.y-q.y))):Infinity;
    if(clearance>bestClearance){bestClearance=clearance;best={...q,lane,offset:0};}
    if(clearance>=29){chosen={...q,lane,offset:0};break;}
   }
   // If every lane is occupied, keep the exact longitude and use the lane with the most space.
   if(!chosen)chosen=best;
   placed.push(chosen);
   const truePoint=xy(p.longitude,isTransit?rad+2:chosen.lane);
   svg+='<g><circle cx="'+chosen.x+'" cy="'+chosen.y+'" r="12" fill="'+color+'" stroke="#fff" stroke-width="2"/><text x="'+chosen.x+'" y="'+(chosen.y+4)+'" text-anchor="middle" font-size="12" fill="#fff" font-weight="900">'+planetNo(p.name)+'</text></g>';
  });
 }
 draw(natal,false);if(transit)draw(transit,true);
 svg+='</svg><div style="display:flex;gap:8px 14px;flex-wrap:wrap;justify-content:center;padding:8px 4px 0;font-size:12px;color:#334155"><span style="color:#dc2626;font-weight:800">━ @ ลัคนาเกิด</span><span style="color:#07834b;font-weight:800">━ @ ลัคนาจร</span><span style="color:#7250bd;font-weight:800">● ดาวกำเนิด (วงกลาง)</span><span style="color:#07834b;font-weight:800">● ดาวจร (นอกวงกลม)</span><span>ชื่อภพอยู่ด้านใน เริ่มจากราศีลัคนาเกิด</span></div>';
 el.innerHTML=svg;
}
function renderQA(natal){
  const el=$('compare');if(!el)return;
  const diffText=(a,b)=>{const min=Math.round((((a-b+540)%360)-180)*60);if(min===0)return'0°00′';const sign=min>0?'+':'−',abs=Math.abs(min);return sign+Math.floor(abs/60)+'°'+String(abs%60).padStart(2,'0')+'′'};
  const status=(a,b)=>Math.abs(Math.round((((a-b+540)%360)-180)*60))===0?'<span class="pass">✅ PASS</span>':'<span class="fail">❌ FAIL</span>';
  const cases=[
    {label:'Golden Case #1 — 14 ต.ค. 2534 · 01:05 · ขอนแก่น',g:GOLDEN_1991},
    {label:'Golden Case #2 — 14 ต.ค. 2518 · 01:05 · กรุงเทพมหานคร',g:GOLDEN_1975},
    {label:'Golden Case #3 — 14 ธ.ค. 2534 · 01:05 · ขอนแก่น',g:GOLDEN_1991_DEC}
  ];
  let html='<div class="section-title"><h2>เปรียบเทียบผลคำนวณจริง</h2><span class="badge">ไม่มี Golden shortcut</span></div><div class="hint">Golden เป็น Reference เท่านั้น ทุกค่าด้านซ้ายคำนวณจาก engine เดียวกันจริง ห้ามคืนค่าจาก Golden</div>';
  for(const c of cases){
    let calc;
    try{calc=calcAt(c.g.date,c.g.time,true,{lat:c.g.lat,lon:c.g.lon,timezone:7});}
    catch(err){html+='<div class="hint">'+c.label+'<br><span class="fail">❌ ENGINE ERROR — '+String(err?.message||err)+'</span></div>';continue}
    const rows=[];
    if(c.g.asc!==undefined)rows.push(['ลัคนา',calc.asc,c.g.asc]);
    for(const name of GOLDEN_PLANET_ORDER){const p=calc.planets.find(x=>x.name===name);if(p&&c.g.planets[name]!==undefined)rows.push([name,p.longitude,c.g.planets[name]])}
    const pass=rows.every(([,a,b])=>Math.abs(angularDiffMinutes(a,b))===0);
    html+='<div class="section-title" style="margin-top:18px"><h3>'+c.label+'</h3><span class="'+(pass?'pass':'fail')+'">'+(pass?'✅ PASS':'❌ FAIL')+'</span></div><div class="table-wrap"><table><tr><th>ดาว / จุด</th><th>คำนวณจริง</th><th>Reference</th><th>ต่างกัน</th><th>สถานะ</th></tr>';
    for(const[name,actual,expected]of rows)html+='<tr><td>'+name+'</td><td>'+formatInSign(actual)+' '+signOf(actual).name+'</td><td>'+formatInSign(expected)+' '+signOf(expected).name+'</td><td>'+diffText(actual,expected)+'</td><td>'+status(actual,expected)+'</td></tr>';
    html+='</table></div>';
  }
  el.innerHTML=html;
}
function initDropdowns(){$('bMonth').innerHTML='';$('fMonth').innerHTML='';$('bProvince').innerHTML='';$('fProvince').innerHTML='';for(let d=1;d<=31;d++){$('bDay').innerHTML+='<option value="'+d+'">'+pad(d)+'</option>';$('fDay').innerHTML+='<option value="'+d+'">'+pad(d)+'</option>'}thaiMonths.forEach((m,i)=>{$('bMonth').innerHTML+='<option value="'+(i+1)+'">'+m+'</option>';$('fMonth').innerHTML+='<option value="'+(i+1)+'">'+m+'</option>'});PROVINCES.forEach(p=>{$('bProvince').innerHTML+='<option value="'+p.id+'">'+p.name+'</option>';$('fProvince').innerHTML+='<option value="'+p.id+'">'+p.name+'</option>'});$('bDay').value='14';$('bMonth').value='10';$('bYear').value='2534';$('bHour').value='1';$('bMinute').value='5';const now=new Date();$('fDay').value=String(now.getDate());$('fMonth').value=String(now.getMonth()+1);$('fYear').value=String(now.getFullYear()+543);$('fHour').value=String(now.getHours());$('fMinute').value=String(now.getMinutes());$('bProvince').value='6';$('fProvince').value='6';populate('b');populate('f');$('bDistrict').value='เมืองขอนแก่น';$('fDistrict').value='เมืองขอนแก่น';update('b');update('f')}
function populate(prefix){const prov=PROVINCES.find(p=>String(p.id)===String($(prefix+'Province').value)),el=$(prefix+'District');el.innerHTML='';prov.districts.forEach(d=>el.innerHTML+='<option value="'+d+'">'+d+'</option>')}
function update(prefix){const prov=PROVINCES.find(p=>String(p.id)===String($(prefix+'Province').value));$(prefix+'Lat').value=prov.lat.toFixed(6);$(prefix+'Lon').value=prov.lon.toFixed(6);if(prefix==='f')$(prefix+'Place').value=prov.name+' · '+$(prefix+'District').value+' · '+prov.lat.toFixed(6)+', '+prov.lon.toFixed(6)+' UTC+7'}
function getInput(p){const d=$(p+'Day').value,m=$(p+'Month').value,y=$(p+'Year').value,h=$(p+'Hour').value,mi=$(p+'Minute').value;if(!d||!m||!y||h===''||mi==='')throw new Error('INPUT_INCOMPLETE_'+p);const ad=Number(y)-543;if(!Number.isInteger(ad)||ad<1)throw new Error('YEAR_INVALID_'+p);return{date:ad+'-'+pad(m)+'-'+pad(d),time:pad(h)+':'+pad(mi),beYear:Number(y)}}
const NAKSHATRAS=['อัศวินี','ภรณี','กฤติกา','โรหิณี','มฤคศิร','อารทรา','ปุนัพสุ','ปุษยะ','อาศเลษะ','มาฆะ','บุรพผลคุนี','อุตรผลคุนี','หัสดา','จิตรา','สวาติ','วิสาขา','อนุราธา','เชษฐา','มูละ','บุรพาษาฒ','อุตราษาฒ','ศรวณะ','ธนิษฐา','ศตภิษัช','บุรพภัทรบท','อุตรภัทรบท','เรวดี'];
/* Planetary dignity reference data lives in js/data/planetary-dignities.js. */
function nakshatraOf(lon){const n=((lon%360)+360)%360;const pos=n/(360/27),idx=Math.floor(pos),pada=Math.floor((pos-idx)*4)+1;return{index:idx,name:NAKSHATRAS[idx],pada,degreeInNakshatra:(pos-idx)*13.3333333333};}const SIGNS=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน'];const SIGN_LORDS=['อังคาร','ศุกร์','พุธ','จันทร์','อาทิตย์','พุธ','ศุกร์','อังคาร','พฤหัสบดี','เสาร์','เสาร์','พฤหัสบดี'];const PLANET_NUM={อาทิตย์:'1',จันทร์:'2',อังคาร:'3',พุธ:'4',พฤหัสบดี:'5',ศุกร์:'6',เสาร์:'7',ราหู:'8',เกตุ:'9'};const NAK_LORDS=['เกตุ','ศุกร์','อาทิตย์','จันทร์','อังคาร','ราหู','พฤหัสบดี','เสาร์','พุธ'];const NAK_YOGA=['ทลิทโท','มหัทธโน','โจโร','ภูมิปาโล','เทศาตรี','เทวี','เพชฌฆาต','ราชา','สมโณ'];function navamsaOf(lon){const n=((lon%360)+360)%360,s=Math.floor(n/30),d=n%30,part=Math.floor(d/(30/9)),start=s%3===0?s:s%3===1?(s+8)%12:(s+4)%12,sign=(start+part)%12;return{number:part+1,sign:SIGNS[sign],lord:SIGN_LORDS[sign],lordNum:PLANET_NUM[SIGN_LORDS[sign]]};}function drekkanaOf(lon){const n=((lon%360)+360)%360,s=Math.floor(n/30),part=Math.floor((n%30)/10),sign=(s+[0,5,9][part])%12;return{number:part+1,sign:SIGNS[sign],lord:SIGN_LORDS[sign],lordNum:PLANET_NUM[SIGN_LORDS[sign]]};}function formatVarga(lon){const v=navamsaOf(lon),d=drekkanaOf(lon);const vn=['ปฐม','ทุติย','ตติย','จตุตถ','ปัญจม','ฉัฏฐม','สัตตม','อัฏฐม','นวม'][v.number-1];const dn=['ปฐม','ทุติย','ตติย'][d.number-1];return{nav:vn+'นวางค์ '+v.lordNum+' '+v.sign,dre:dn+'ตรียางค์ '+d.lordNum+' '+d.sign};}function formatNakFull(lon){const n=nakshatraOf(lon),k=n.index%9;return n.name+' ฤกษ์ที่ '+(k+1)+' · '+NAK_YOGA[k]+' · บาท '+n.pada+' · ดาว'+NAK_LORDS[k];}
function dignityOf(name,sign){const out=getPlanetaryDignities(name,sign);return out.length?out.join(' · '):'ปกติ';}
function positionOf(name,p,asc){const s=p.sign.name,h=p.house,n=[];n.push(dignityOf(name,s));if(h===1)n.push('ตนุ');if([4,7,10].includes(h))n.push('เรือนเกณฑ์');if([1,5,9].includes(h))n.push('ตรีโกณ');return n.filter((v,i,a)=>v&&a.indexOf(v)===i).join(' · ');}
function formatNak(lon){const n=nakshatraOf(lon);return n.name+' บาท '+n.pada;}
function renderStarDetails(natal,transit){
 const birthEl=$('natalStarDetailsBody'),transitEl=$('transitStarDetailsBody');
 if(!birthEl||!transitEl)return;
 const names=GOLDEN_PLANET_ORDER;
 const ascRow={name:'ลัคนา',b:{longitude:natal.asc,sign:natal.ascSign,house:1},t:{longitude:transit.asc,sign:transit.ascSign,house:1}};
 const rows=[ascRow,...names.map(name=>{const b=natal.planets.find(p=>p.name===name),t=transit.planets.find(p=>p.name===name);if(t)t.house=houseFromAsc(t.longitude,natal.asc);return{name,b,t}})];
 const signNames=SIGNS;
 const esc7=v=>String(v==null?'':v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const signRelation=(from,to)=>{
   const a=signNames.indexOf(from),b=signNames.indexOf(to);if(a<0||b<0)return [];
   const offset=(b-a+12)%12,items=[];
   if(offset===0)items.push('กุม/ร่วมราศี');
   if(offset===2)items.push('โยคหน้า');
   if(offset===4||offset===8)items.push('ตรีโกณ');
   if(offset===6)items.push('เล็ง');
   if(offset===10)items.push('โยคหลัง');
   if([0,3,6,9].includes(offset))items.push('จตุโกณ/เรือนเกณฑ์');
   return [...new Set(items)];
 };
 const renderCriteria=(row,chart,allRows)=>{
   const {name,p}=row;
   const sign=p.sign.name,house=p.house;
   const labels=[];
   if(name==='ลัคนา')labels.push(['จุดตั้งต้นภพ 1','good']);
   else {
     const dignity=dignityOf(name,sign);
     if(dignity&&dignity!=='ปกติ')dignity.split(' · ').forEach(x=>labels.push([x,'good']));
     else labels.push(['ปกติ','']);
     if(house===1)labels.push(['ตนุ','good']);
     if([4,7,10].includes(house))labels.push(['เรือนเกณฑ์','good']);
     if([1,5,9].includes(house))labels.push(['ตรีโกณ','good']);
     const relationToAsc=signRelation(chart.ascSign.name||chart.ascSign,sign);
     relationToAsc.forEach(x=>labels.push([x,'']));
   }
   const same=allRows.filter(other=>other.name!==name&&other.p&&other.p.sign.name===sign).map(other=>other.name);
   if(same.length)labels.push(['ร่วมราศีกับ '+same.join(', '),'']);
   const related=allRows.filter(other=>other.name!==name&&other.p&&other.p.sign.name!==sign)
     .map(other=>({name:other.name,rels:signRelation(sign,other.p.sign.name)})).filter(x=>x.rels.length);
   const uniqueRelated=[...new Set(related.flatMap(x=>x.rels))];
   uniqueRelated.forEach(x=>labels.push([x,'']));
   const html=labels.map(([label,kind])=>'<span class="star-criteria-chip '+kind+'">'+esc7(label)+'</span>').join('');
   const relatedHtml=related.length?'<span class="star-criteria-note">สัมพันธ์กับ: '+related.map(x=>esc7(x.name)+' ('+esc7(x.rels.join('/'))+')').join(' · ')+'</span>':'';
   return (html||'—')+relatedHtml+'<span class="star-criteria-note">เกณฑ์พิเศษทั้งดวงตรวจแยกในส่วน “ตรวจเกณฑ์ดาวกำเนิดจากราศีและลัคนา”</span>';
 };
 const natalRows=rows.map(({name,b,t})=>{
   const isAsc=name==='ลัคนา',house=b.house;
   const position=isAsc?'ลัคนากำเนิด':positionOf(name,b,b.longitude);
   const v=formatVarga(b.longitude),nak=formatNakFull(b.longitude);
   return '<tr><td>'+esc7(name)+'</td><td>'+esc7(b.sign.name)+'</td><td>'+esc7(formatInSign(b.longitude))+'</td><td>'+esc7(house)+'</td><td>'+esc7(position)+'</td><td>'+esc7(v.nav)+'</td><td>'+esc7(v.dre)+'</td><td>'+esc7(nak)+'</td><td>'+renderCriteria({name,p:b},natal,rows.map(r=>({name:r.name,p:r.b})))+'</td></tr>';
 }).join('');
 const transitRows=rows.map(({name,b,t})=>{
   if(!t)return '';
   const isAsc=name==='ลัคนา',position=isAsc?'ลัคนาจร':positionOf(name,t,t.longitude);
   const v=formatVarga(t.longitude),nak=formatNakFull(t.longitude);
   return '<tr><td>'+esc7(name)+'</td><td>'+esc7(t.sign.name)+'</td><td>'+esc7(formatInSign(t.longitude))+'</td><td>'+esc7(t.house)+'</td><td>'+esc7(position)+'</td><td>'+esc7(v.nav)+'</td><td>'+esc7(v.dre)+'</td><td>'+esc7(nak)+'</td><td>'+renderCriteria({name,p:t},natal,rows.map(r=>({name:r.name,p:r.t})))+'</td></tr>';
 }).join('');
 birthEl.innerHTML=natalRows;transitEl.innerHTML=transitRows;
}
function ascSummary(asc){const s=signObj(asc);return 'ลัคนา '+formatInSign(asc)+' '+s.name+' ('+formatFull(asc)+')';}
function render(natal,transit){const b=getInput('b'),bProv=$('bProvince').selectedOptions[0]?.text||'',bDist=$('bDistrict').value||'',lat=$('bLat').value,lon=$('bLon').value,ascText=ascSummary(natal.asc);$('birthDetails').innerHTML='<div class="section-title"><h2>รายละเอียดกำเนิด</h2><span class="badge">ข้อมูลจากการคำนวณ HORA</span></div><div class="formula-code">วันเกิด '+natal.date+' เวลา '+natal.time+' น. · พ.ศ.'+b.beYear+' / ค.ศ.'+(b.beYear-543)+'<br>สถานที่ '+bDist+' '+bProv+' (UTC+07:00) · ละติจูด '+lat+'° · ลองจิจูด '+lon+'°<br>'+ascText+'</div>';renderWheel(natal,transit);console.log('[HORA][RENDER] natal updated',natal);renderStarDetails(natal,transit);renderQA(natal);console.log('[HORA][TABLE] ดาวกำเนิดและดาวจรจริง rendered')}
function showRuntimeError(err){const detail=err instanceof Error?{name:err.name,message:err.message,stack:err.stack}:err;const msg=$('msg');if(msg)msg.innerHTML='<div class="fail">❌ FAIL — '+String(detail?.message||detail)+'</div>';console.error('[HORA][ERROR DETAIL]',detail)}
function bootHORA(){$('bProvince').addEventListener('change',()=>{populate('b');update('b')});$('fProvince').addEventListener('change',()=>{populate('f');update('f')});$('bDistrict').addEventListener('change',()=>update('b'));$('fDistrict').addEventListener('change',()=>update('f'));$('calc').addEventListener('click',()=>{console.group('[HORA][BUTTON] กดคำนวณใหม่');try{const b=getInput('b'),f=getInput('f');console.log('[HORA][FORM]',{birth:b,forecast:f,bLat:$('bLat').value,bLon:$('bLon').value,fLat:$('fLat').value,fLon:$('fLon').value});const natal=calcAt(b.date,b.time,true,{lat:$('bLat').value,lon:$('bLon').value,timezone:7});const transit=calcAt(f.date,f.time,false,{lat:$('fLat').value,lon:$('fLon').value,timezone:7});render(natal,transit);$('msg').innerHTML='<div class="ok">คำนวณเสร็จ — กรุณาตรวจตาราง Golden Case</div>';console.log('[HORA][BUTTON] ตารางถูก render ใหม่แล้ว')}catch(err){console.error('[HORA][ERROR]',err);showRuntimeError(err)}finally{console.groupEnd()}});initDropdowns();window.__HORA_BOOT_OK=true;const bootDiagnostic=$('bootDiagnostic');if(bootDiagnostic)bootDiagnostic.hidden=true;requestAnimationFrame(()=>console.log('[HORA][BOOT] initial star details ready'));setTimeout(()=>{try{$('calc').click()}catch(err){showRuntimeError(err)}},600)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootHORA,{once:true});else bootHORA();
