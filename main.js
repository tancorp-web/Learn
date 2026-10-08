
import { calculateSuriyayatra } from './js/astronomy/suriyayatra-engine.js';
import { calculateSuriyayatraAscendant, calculateAscendantBoundaryTimes } from './js/astronomy/ascendant-geometry.js';

// HORA v5.3 main.js - Thai Suriyayat calculation engine integrated
// ใช้สูตรสุริยยาตร์ integer engine + อันโตนาทีสามัญจริงจากโมดูล

// Dropdown/date validation: day count follows selected BE year/month; leap years handled by Gregorian conversion.
// เมษอยู่บน 12 นาฬิกา
// หมายเหตุ: เมนูสูตรเป็น Master Specification; ห้ามถือข้อความใน UI แทนสูตรที่ยังไม่พิสูจน์
// ===== HORA DEBUG / COPY ERROR =====
window.__HORA_LOGS__ = window.__HORA_LOGS__ || [];
function horaLog(type, detail, extra){
  const row={time:new Date().toISOString(),type,detail:String(detail||''),extra:extra||null};
  window.__HORA_LOGS__.push(row);
  try{console.log('[HORA]',row.type,row.detail,row.extra||'');}catch(_){}
  const box=document.getElementById('errorLog');
  if(box){
    const pre=box.querySelector('pre');
    if(pre) pre.textContent=window.__HORA_LOGS__.map(x=>JSON.stringify(x)).join('\n');
    box.style.display='block';
  }
}
window.addEventListener('error',e=>horaLog('WINDOW_ERROR',e.message||'Unknown error',{file:e.filename||'',line:e.lineno||0,column:e.colno||0,stack:e.error&&e.error.stack||''}));
window.addEventListener('unhandledrejection',e=>horaLog('UNHANDLED_REJECTION',e.reason&&e.reason.message||String(e.reason||'Unknown rejection'),{stack:e.reason&&e.reason.stack||''}));
window.__HORA_DEBUG_INSTALLED__=true;

const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const signs=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน'];
const thaiMonths=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const GOLDEN={date:'1975-10-14',time:'01:05',asc:90+23+51/60,planets:{'อาทิตย์':150+25+48/60,'จันทร์':270+15+35/60,'อังคาร':60+8+13/60,'พุธ':150+8+39/60,'พฤหัสบดี':330+27+12/60,'ศุกร์':120+14+28/60,'เสาร์':90+5+28/60,'ราหู':180+29+21/60,'เกตุ':0+6+53/60,'มฤตยู':180+4+30/60}};

const PROVINCES=[
{id:1,name:'กรุงเทพมหานคร',lat:13.752555,lon:100.494066,districts:['พระนคร','ดุสิต','หนองจอก','บางรัก','บางเขน','บางกะปิ','ปทุมวัน','ป้อมปราบศัตรูพ่าย','พระโขนง','มีนบุรี','ลาดกระบัง','ยานนาวา','สัมพันธวงศ์','พญาไท','ธนบุรี','บางกอกใหญ่','ห้วยขวาง','คลองสาน','ตลิ่งชัน','บางกอกน้อย','บางขุนเทียน','ภาษีเจริญ','หนองแขม','ราษฎร์บูรณะ','บางพลัด','ดินแดง','บึงกุ่ม','สาทร','บางซื่อ','จตุจักร','บางคอแหลม','ประเวศ','คลองเตย','สวนหลวง','จอมทอง','ดอนเมือง','ราชเทวี','ลาดพร้าว','วัฒนา','บางแค','หลักสี่','สายไหม','คันนายาว','สะพานสูง','วังทองหลาง','คลองสามวา','บางนา','ทวีวัฒนา','ทุ่งครุ','บางบอน']},
{id:2,name:'นนทบุรี',lat:13.8621,lon:100.5143,districts:['เมืองนนทบุรี','บางกรวย','บางใหญ่','บางบัวทอง','ไทรน้อย','ปากเกร็ด']},
{id:3,name:'เชียงใหม่',lat:18.7883,lon:98.9853,districts:['เมืองเชียงใหม่','จอมทอง','แม่แจ่ม','เชียงดาว','ดอยสะเก็ด','แม่แตง','แม่ริม','สะเมิง','ฝาง','แม่อาย','พร้าว','สันป่าตอง','สันกำแพง','สันทราย','หางดง','ฮอด','ดอยเต่า','อมก๋อย','สารภี','เวียงแหง','ไชยปราการ','แม่วาง','แม่ออน','ดอยหล่อ']},
{id:4,name:'ชลบุรี',lat:13.3611,lon:100.9847,districts:['เมืองชลบุรี','บางละมุง','ศรีราชา','สัตหีบ','บ้านบึง','พนัสนิคม']},
{id:5,name:'ภูเก็ต',lat:7.8804,lon:98.3923,districts:['เมืองภูเก็ต','กะทู้','ถลาง']},
{id:6,name:'ขอนแก่น',lat:16.4322,lon:102.8236,districts:['เมืองขอนแก่น','บ้านฝาง','พระยืน','หนองเรือ','ชุมแพ','สีชมพู','น้ำพอง','อุบลรัตน์','กระนวน','บ้านไผ่','เปือยน้อย','พล','แวงใหญ่','แวงน้อย','หนองสองห้อง','ภูเวียง','มัญจาคีรี','ชนบท','เขาสวนกวาง','ภูผาม่าน','ซำสูง','โคกโพธิ์ไชย','หนองนาคำ','บ้านแฮด','โนนศิลา']}
];

function formatInSign(lon){const d=((lon%360)+360)%360%30;return pad(Math.floor(d))+'° '+pad(Math.floor((d%1)*60))+"''";}
function formatFull(lon){const d=((lon%360)+360)%360;return Math.floor(d)+'° '+pad(Math.floor((d%1)*60))+"''";}
function signOf(lon){return {name:signs[Math.floor(((lon%360)+360)%360/30)], idx:Math.floor(((lon%360)+360)%360/30)};}
function houseFromAsc(lon,asc){return Math.floor((((lon-asc)%360+360)%360/30)+1);}
function getWeekdayThai(beY,m,d,h){const ad=beY-543;let dt=new Date(ad,m-1,d);const isBefore6=h<6;if(isBefore6)dt=new Date(dt.getTime()-24*3600*1000);return {weekday:dt.getDay(),isBefore6};}
function calcThaksa(wd){const map={0:['อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์'],1:['จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์'],2:['อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์'],3:['พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร'],4:['พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์'],5:['ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู'],6:['เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ']};const pls=map[wd];const r={};['บริวาร','อายุ','เดช','ศรี','มูลละ','อุตสาหะ','มนตรี','กาลกิณี'].forEach((k,i)=>r[k]=pls[i]);return r;}
function parseLocalDate(dateStr,timeStr){
  const [y,m,d]=dateStr.split('-').map(Number);
  const [hh,mm]=timeStr.split(':').map(Number);
  return new Date(Date.UTC(y,m-1,d,hh,mm)-7*60*60*1000);
}
function signObj(lon){
  const n=((lon%360)+360)%360;
  const idx=Math.floor(n/30);
  return {name:signs[idx],idx};
}
function calcAt(dateStr,timeStr,isBirth,location){
  const hh=parseInt(timeStr.split(':')[0],10);
  const mm=parseInt(timeStr.split(':')[1],10);
  const beY=parseInt(dateStr.split('-')[0],10)+543;
  const month=parseInt(dateStr.split('-')[1],10),day=parseInt(dateStr.split('-')[2],10);
  const loc=location||{lat:13.752555,lon:100.494066,timezone:7};

  const engine=calculateSuriyayatra({date:dateStr,time:timeStr});
  const ascDate=parseLocalDate(dateStr,timeStr);
  const sun=engine.planets.find(p=>p.name==='อาทิตย์');
  if(!sun)throw new Error('SURIYAYATRA_SUN_MISSING');

  let asc=calculateSuriyayatraAscendant({
      date:ascDate,
      latitude:Number(loc.lat),
      longitude:Number(loc.lon),
      suriyayatraSunLongitude:Number(sun.longitude),
      timezone:Number(loc.timezone??7)
    });

  const planets=engine.planets.map(p=>({
    id:p.id,name:p.name,
    longitude:((Number(p.longitude)%360)+360)%360,
    sign:signObj(p.longitude),
    house:isBirth?houseFromAsc(p.longitude,asc):0,
    retrograde:Boolean(p.retrograde)
  }));
  const wd=getWeekdayThai(beY,month,day,hh);
  return {
    date:dateStr,time:timeStr,asc,
    planets,weekday:wd.weekday,weekdayInfo:wd,
    ascSign:signObj(asc),thaksa:calcThaksa(wd.weekday),
    metadata:{...engine,location:{lat:Number(loc.lat),lon:Number(loc.lon),sunLongitude:Number(sun.longitude)}}
  };
}
function goldenQA(natal,input){
  if(input.date!==GOLDEN.date||input.time!==GOLDEN.time)return {applicable:false,pass:true,deltas:{}};
  const deltas={};
  let pass=true;
  const ascDelta=Math.abs(((natal.asc-GOLDEN.asc+540)%360)-180);
  deltas['ลัคนา']=ascDelta;
  if(ascDelta>0.02)pass=false;
  for(const p of natal.planets){
    if(GOLDEN.planets[p.name]===undefined)continue;
    const d=Math.abs(((p.longitude-GOLDEN.planets[p.name]+540)%360)-180);
    deltas[p.name]=d;
    if(d>0.02)pass=false;
  }
  return {applicable:true,pass,deltas};
}
function planetNo(n){return{'อาทิตย์':'๑','จันทร์':'๒','อังคาร':'๓','พุธ':'๔','พฤหัสบดี':'๕','ศุกร์':'๖','เสาร์':'๗','ราหู':'๘','เกตุ':'๙','มฤตยู':'๐'}[n]||'';}

function houseFromAscSign(lon,asc){
  const si=Math.floor((((lon%360)+360)%360)/30);
  const ai=Math.floor((((asc%360)+360)%360)/30);
  return ((si-ai+12)%12)+1;
}
function thaiDateTimeLabel(dateObj){
  const y=dateObj.getUTCFullYear()+543,m=dateObj.getUTCMonth()+1,d=dateObj.getUTCDate();
  const hh=pad(dateObj.getUTCHours()),mm=pad(dateObj.getUTCMinutes());
  return d+'/'+m+'/'+y+' '+hh+':'+mm+' น.';
}
function localDateObj(dateStr,timeStr){
  const [y,m,d]=dateStr.split('-').map(Number);
  const [hh,mi]=timeStr.split(':').map(Number);
  // เก็บเวลาท้องถิ่นเป็น wall-clock UTC เพื่อให้ +07:00 ถูกเติมครั้งเดียวตอนส่งเข้า engine
  return new Date(Date.UTC(y,m-1,d,hh,mi));
}
function localDateTimeString(dateObj){
  return dateObj.getUTCFullYear()+'-'+pad(dateObj.getUTCMonth()+1)+'-'+pad(dateObj.getUTCDate())+' '+pad(dateObj.getUTCHours())+':'+pad(dateObj.getUTCMinutes());
}
function transitPlanetLongitudeAt(planetName,dateObj){
  const utc7=new Date(dateObj.getTime()+7*60*60*1000);
  const ds=utc7.getUTCFullYear()+'-'+pad(utc7.getUTCMonth()+1)+'-'+pad(utc7.getUTCDate());
  const ts=pad(utc7.getUTCHours())+':'+pad(utc7.getUTCMinutes());
  const e=calculateSuriyayatra({date:ds,time:ts});
  const p=e.planets.find(x=>x.name===planetName);
  return p?Number(p.longitude):null;
}
function findHouseBoundary(planetName,startDate,asc,dir){
  const step=12*60*60*1000;
  let cur=new Date(startDate.getTime());
  let prevLon=transitPlanetLongitudeAt(planetName,cur);
  if(prevLon===null)return null;
  let prevHouse=houseFromAscSign(prevLon,asc);
  for(let i=1;i<=760;i++){
    const next=new Date(startDate.getTime()+dir*i*step);
    const nextLon=transitPlanetLongitudeAt(planetName,next);
    if(nextLon===null)continue;
    const nextHouse=houseFromAscSign(nextLon,asc);
    if(nextHouse!==prevHouse){
      let lo=new Date(cur.getTime()),hi=new Date(next.getTime());
      for(let k=0;k<10;k++){
        const mid=new Date((lo.getTime()+hi.getTime())/2);
        const midLon=transitPlanetLongitudeAt(planetName,mid);
        const midHouse=houseFromAscSign(midLon,asc);
        if(midHouse===prevHouse)lo=mid;else hi=mid;
      }
      return dir>0?hi:lo;
    }
    cur=next;prevHouse=nextHouse;
  }
  return null;
}
function showTransitPlanetPopup(planet,natal,transit){
  const old=$('planetPopup');if(old)old.remove();
  const currentHouse=houseFromAscSign(planet.longitude,natal.asc);
  const now=localDateObj(transit.date,transit.time);
  const enter=findHouseBoundary(planet.name,now,natal.asc,-1);
  const exit=findHouseBoundary(planet.name,now,natal.asc,1);
  const popup=document.createElement('div');
  popup.id='planetPopup';
  popup.className='planet-popup';
  popup.innerHTML='<div class="planet-popup-title">'+planetNo(planet.name)+' '+planet.name+' <span>ดาวจร</span></div>'+
    '<div><b>ตำแหน่งปัจจุบัน:</b> '+planet.sign.name+' '+formatInSign(planet.longitude)+'</div>'+
    '<div><b>ภพ:</b> '+houseNamesGlobal[currentHouse-1]+'</div>'+
    '<div><b>ว/ด/ป เวลา ย้ายเข้า:</b> '+(enter?thaiDateTimeLabel(enter):'เกินช่วงคำนวณ')+'</div>'+
    '<div><b>ว/ด/ป เวลา ย้ายออก:</b> '+(exit?thaiDateTimeLabel(exit):'เกินช่วงคำนวณ')+'</div>'+
    '<div class="hint">คำนวณจากจุดเปลี่ยนราศี/ภพของดาวจรจริง · Whole Sign ตามลัคนาเกิด</div>';
  const host=$('wheel').parentElement;
  host.style.position='relative';
  host.appendChild(popup);
}
const houseNamesGlobal=['ตนุ','กดุมภะ','สหัชชะ','พันธุ','ปุตตะ','อริ','ปัตนิ','มรณะ','ศุภะ','กัมมะ','ลาภะ','วินาศ'];

function wheelAngleDeg(longitude){
  // WHEEL GEOMETRY LOCK: calculation remains 0°-based; this is display-only.
  // 15° Aries is at 12 o'clock; 0°/30° are sector boundaries.
  return -(longitude-15)-90;
}

function renderWheel(natal,transit){
  const el=$('wheel');
  const c=300,rad=245,inner=72,planetInner=150;
  const planetOffset=15;
  const houseNames=houseNamesGlobal;
  const natalBg='#7c3aed', transitBg='#15803d';
  let svg='<svg viewBox="0 0 600 600" style="width:100%;max-width:680px;background:#fff">';
  svg+='<circle cx="'+c+'" cy="'+c+'" r="'+rad+'" fill="#fff" stroke="#1e293b" stroke-width="2"/>';
  svg+='<circle cx="'+c+'" cy="'+c+'" r="198" fill="'+natalBg+'" fill-opacity=".055" stroke="none"/>';
  svg+='<circle cx="'+c+'" cy="'+c+'" r="222" fill="none" stroke="'+transitBg+'" stroke-opacity=".055" stroke-width="40"/>';
  svg+='<circle cx="'+c+'" cy="'+c+'" r="'+inner+'" fill="#fff" stroke="#334155" stroke-width="1.2"/>';

  const sun=natal.planets.find(p=>p.name==='อาทิตย์');
  const transitSun=transit&&transit.planets?transit.planets.find(p=>p.name==='อาทิตย์'):null;
  const boundaryTimes=transit&&transit.metadata&&transit.metadata.location
    ? calculateAscendantBoundaryTimes({date:parseLocalDate(transit.date,transit.time),longitude:Number(transit.metadata.location.lon),suriyayatraSunLongitude:Number(transit.metadata.location.sunLongitude)})
    : (transit&&transit.planets?calculateAscendantBoundaryTimes({date:parseLocalDate(transit.date,transit.time),longitude:100.494066,suriyayatraSunLongitude:Number(transitSun?.longitude)}):[]);
  svg+='<text x="'+c+'" y="'+(c-6)+'" text-anchor="middle" font-size="18" font-weight="900" fill="#1e293b">'+(sun?formatInSign(sun.longitude):'')+'</text>';
  svg+='<text x="'+c+'" y="'+(c+14)+'" text-anchor="middle" font-size="9" fill="#6b7280">อาทิตย์ '+(sun?sun.sign.name:'')+'</text>';

  // Geometry ล็อก: ช่องราศีเมษ (0°–30°) อยู่กึ่งกลางที่ 12 นาฬิกา; 15° เมษ = 12 นาฬิกา. ใช้ transform เดียวกันกับราศี/ภพ/ดาว/ลัคนา
  const zodiacBoundaries=[];
  for(let i=0;i<12;i++){
    const boundaryDeg=i*30;
    zodiacBoundaries.push(boundaryDeg);
    const a=wheelAngleDeg(boundaryDeg)*Math.PI/180;
    const x1=c+inner*Math.cos(a),y1=c+inner*Math.sin(a);
    const x2=c+rad*Math.cos(a),y2=c+rad*Math.sin(a);
    svg+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#334155" stroke-width="1"/>';
    const bt=boundaryTimes.find(t=>t.sign===i);
    if(bt){ const tr=rad+20; const tx=c+tr*Math.cos(a),ty=c+tr*Math.sin(a); svg+='<text x="'+tx+'" y="'+(ty+3)+'" text-anchor="middle" font-size="8" fill="#0f766e" font-weight="800">'+bt.label+'</text>'; }
    const mid=i*30+15;
    const am=wheelAngleDeg(mid)*Math.PI/180;
    const labelR=rad+30;
    const lx=c+labelR*Math.cos(am),ly=c+labelR*Math.sin(am);
    svg+='<text x="'+lx+'" y="'+(ly+4)+'" text-anchor="middle" font-size="'+(i===0?16:13)+'" fill="'+(i===0?'#dc2626':'#92400e')+'" font-weight="800">'+signs[i]+(i===0?' ★':'')+'</text>';
  }

  // ภพอยู่ในวงกลมพื้นขาว: ไม่ใส่เลขภพ และแบ่งพื้นที่ 12 ช่องเพื่อไม่ให้ข้อความชนกัน
  function drawHouses(){
    const ascIdx=natal&&natal.ascSign?natal.ascSign.idx:Math.floor((((natal.asc%360)+360)%360)/30);
    const houseR=92;
    for(let h=1;h<=12;h++){
      // ใช้พิกัด "เส้นแบ่งราศี" เดียวกันโดยตรง ห้ามสร้างพิกัดเส้นภพอีกชุด
      const boundaryDeg=zodiacBoundaries[(ascIdx+(h-1))%12];
      const boundaryA=wheelAngleDeg(boundaryDeg)*Math.PI/180;
      const bx=c+rad*Math.cos(boundaryA),by=c+rad*Math.sin(boundaryA);
      // เส้นภพต้องต่อเนื่องกับเส้นแบ่งราศีจริงถึงขอบวงนอก ใช้มุมเดียวกันและจุดปลายเดียวกัน
      svg+='<line x1="'+c+'" y1="'+c+'" x2="'+bx+'" y2="'+by+'" stroke="#d6d3d1" stroke-width=".9"/>';
      // ชื่อภพต้องอยู่ "กึ่งกลางช่องภพ" ระหว่างเส้นแบ่งสองเส้นจริง
      // เส้นภพเริ่มที่ 0° และแต่ละช่องกว้าง 30° จึงใช้ +15° เฉพาะตำแหน่งตัวอักษร
      const midDeg=((ascIdx+(h-1))*30+15)%360;
      const a=wheelAngleDeg(midDeg)*Math.PI/180;
      const x=c+houseR*Math.cos(a),y=c+houseR*Math.sin(a);
      svg+='<text x="'+x+'" y="'+(y+3)+'" text-anchor="middle" font-size="7" fill="'+natalBg+'" font-weight="900">'+houseNames[h-1]+'</text>';
    }
  }
  drawHouses();

  function drawAsc(ascObj,isTransit){
    if(!ascObj||typeof ascObj.asc!=='number')return;
    const ascAngle=wheelAngleDeg(ascObj.asc)*Math.PI/180;
    const rr=isTransit?238:192;
    const ax=c+rr*Math.cos(ascAngle),ay=c+rr*Math.sin(ascAngle);
    const color=isTransit?'#b45309':'#dc2626';
    const stroke=isTransit?'#92400e':'#991b1b';
    svg+='<circle cx="'+ax+'" cy="'+ay+'" r="14" fill="'+color+'" stroke="'+stroke+'" stroke-width="2"/>';
    svg+='<text x="'+ax+'" y="'+(ay+5)+'" text-anchor="middle" font-size="11" fill="#fff" font-weight="900">@</text>';
    // Keep ascendant labels outside the planet-degree ring so they never cover degrees/planets.
    const labelR=isTransit?270:260;
    const lx=c+labelR*Math.cos(ascAngle),ly=c+labelR*Math.sin(ascAngle);
    const label='@ '+(isTransit?'ลัคนาจร ':'ลัคนา ')+ascObj.ascSign.name+' '+formatInSign(ascObj.asc);
    const w=isTransit?118:108;
    const h=17;
    svg+='<rect x="'+(lx-w/2)+'" y="'+(ly-h/2)+'" width="'+w+'" height="'+h+'" rx="4" fill="#fff" fill-opacity=".97" stroke="'+color+'" stroke-width="1"/>';
    svg+='<text x="'+lx+'" y="'+(ly+3)+'" text-anchor="middle" font-size="9" fill="'+color+'" font-weight="900">'+label+'</text>';
  }
  drawAsc(natal,false);
  if(transit)drawAsc(transit,true);

  function draw(list,isTransit){
    if(!list||!list.planets)return;
    const ps=list.planets.slice().sort((a,b)=>a.longitude-b.longitude);
    const lanes=isTransit?[207,222,237]:[112,130,148,166,184];
    ps.forEach((p,j)=>{
      const angle=wheelAngleDeg(p.longitude)*Math.PI/180;
      const rr=lanes[j%lanes.length];
      const x=c+rr*Math.cos(angle),y=c+rr*Math.sin(angle);
      const color=isTransit?transitBg:natalBg;
      const stroke=isTransit?'#22c55e':'#c4b5fd';
      const cls=isTransit?'transit-planet':'natal-planet';
      svg+='<g class="'+cls+'" data-planet="'+p.name+'"><title>'+(isTransit?'ดาวจร':'ดาวเกิด')+' '+p.name+' '+formatInSign(p.longitude)+' '+p.sign.name+'</title>';
      svg+='<circle cx="'+x+'" cy="'+y+'" r="13" fill="'+color+'" stroke="'+stroke+'" stroke-width="2"/>';
      svg+='<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="12" fill="#fff" font-weight="900">'+planetNo(p.name)+'</text>';
      // Degree labels sit in dedicated lanes between planet and outer time ring.
      const labelR=rr+(j%2===0?10:-10);
      const tx=c+labelR*Math.cos(angle),ty=c+labelR*Math.sin(angle);
      svg+='<text x="'+tx+'" y="'+(ty+3)+'" text-anchor="middle" font-size="8" fill="'+color+'" font-weight="700">'+formatInSign(p.longitude)+'</text>';
      svg+='</g>';
    });
  }
  draw(natal,false);
  if(transit)draw(transit,true);
  svg+='<circle cx="'+c+'" cy="'+c+'" r="'+planetInner+'" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="3 4"/>';
  svg+='</svg>';
  el.innerHTML=svg;
  el.querySelectorAll('.transit-planet').forEach(g=>g.addEventListener('click',()=>{
    const name=g.getAttribute('data-planet');
    const p=transit&&transit.planets.find(x=>x.name===name);
    if(p)showTransitPlanetPopup(p,natal,transit);
  }));
}function renderSquare(natal,transit){
  const el=$('squareChart');
  const layout=[{r:0,c:1,s:1},{r:0,c:2,s:0},{r:0,c:3,s:11},{r:1,c:3,s:10},{r:2,c:3,s:9},{r:3,c:3,s:8},{r:3,c:2,s:7},{r:3,c:1,s:6},{r:3,c:0,s:5},{r:2,c:0,s:4},{r:1,c:0,s:3},{r:0,c:0,s:2}];
  const mapN={},mapT={};layout.forEach(p=>{mapN[p.s]=[];mapT[p.s]=[];});
  natal.planets.forEach(p=>{const s=Math.floor(p.longitude/30);if(mapN[s]!==undefined)mapN[s].push(p);});
  if(transit) transit.planets.forEach(p=>{const s=Math.floor(p.longitude/30);if(mapT[s]!==undefined)mapT[s].push(p);});
  const ascS=Math.floor(natal.asc/30);
  const sun=natal.planets.find(p=>p.name==='อาทิตย์');
  let html='<div class="square">';
  for(let r=0;r<4;r++){for(let c=0;c<4;c++){
    if(r===1&&c===1){html+='<div class="center"><div style="font-size:12px;font-weight:800">ลัคนา '+natal.ascSign.name+'</div><div style="font-size:18px;font-weight:900">'+formatInSign(natal.asc)+'</div><div style="font-size:11px">อาทิตย์ '+(sun?formatInSign(sun.longitude):'')+'</div><div style="font-size:9px;color:#6b7280">เมษบน ★ '+signs[ascS]+' ลัคนา</div></div>';continue;}
    if(r===1&&c===2)continue;if(r===2&&c===1)continue;if(r===2&&c===2)continue;
    const pos=layout.find(p=>p.r===r&&p.c===c);if(!pos){html+='<div></div>';continue;}
    const si=pos.s;const nats=mapN[si]||[];const trans=mapT[si]||[];const isA=si===ascS;
    html+='<div class="cell" style="'+(isA?'background:#fffbeb':'')+'"><div class="zodiac">'+(si+1)+' '+signs[si]+(isA?' ★':'')+(si===0?' (บน)':'')+'</div><div style="margin-top:14px">'+nats.map(p=>'<div style="color:#111827;font-weight:600">'+planetNo(p.name)+p.name+' '+formatInSign(p.longitude)+'</div>').join('')+trans.map(p=>'<div style="color:#15803d;font-weight:600">'+planetNo(p.name)+p.name+' '+formatInSign(p.longitude)+' (จร)</div>').join('')+(nats.length===0&&trans.length===0?'<span style="color:#aaa">—</span>':'')+'</div></div>';
  }}html+='</div>';el.innerHTML=html;
}

function daysInMonthBE(beYear,month){
  const adYear=Number(beYear)-543;
  return new Date(adYear,Number(month),0).getDate();
}
function fillDayOptions(prefix,keepDay){
  const dayEl=$(prefix+'Day');
  const monthEl=$(prefix+'Month');
  const yearEl=$(prefix+'Year');
  if(!dayEl||!monthEl||!yearEl)return;
  const max=daysInMonthBE(yearEl.value,monthEl.value);
  const wanted=Math.min(Number(keepDay||dayEl.value||1),max);
  dayEl.innerHTML='';
  for(let d=1;d<=max;d++)dayEl.innerHTML+='<option value="'+d+'">'+d+'</option>';
  dayEl.value=String(wanted);
}
function initDropdowns(){
  thaiMonths.forEach((m,i)=>{
    $('bMonth').innerHTML+='<option value="'+(i+1)+'">'+m+'</option>';
    $('fMonth').innerHTML+='<option value="'+(i+1)+'">'+m+'</option>';
  });
  // พ.ศ. 2300-2600 ครอบคลุมวันเกิดย้อนหลังและวันจรปัจจุบัน โดยค่าที่เลือกตรงกับ พ.ศ.
  for(let y=2600;y>=2300;y--){
    $('bYear').innerHTML+='<option value="'+y+'">'+y+' พ.ศ.</option>';
    $('fYear').innerHTML+='<option value="'+y+'">'+y+' พ.ศ.</option>';
  }
  for(let h=0;h<24;h++){
    $('bHour').innerHTML+='<option value="'+h+'">'+pad(h)+'</option>';
    $('fHour').innerHTML+='<option value="'+h+'">'+pad(h)+'</option>';
  }
  for(let m=0;m<60;m++){
    $('bMinute').innerHTML+='<option value="'+m+'">'+pad(m)+'</option>';
    $('fMinute').innerHTML+='<option value="'+m+'">'+pad(m)+'</option>';
  }
  PROVINCES.forEach(p=>{
    $('bProvince').innerHTML+='<option value="'+p.id+'">'+p.name+'</option>';
    $('fProvince').innerHTML+='<option value="'+p.id+'">'+p.name+'</option>';
  });

  $('bDay').innerHTML='';$('fDay').innerHTML='';
  $('bMonth').value='10';$('bYear').value='2518';$('bHour').value='1';$('bMinute').value='5';
  fillDayOptions('b',14);

  const now=new Date();
  $('fMonth').value=String(now.getMonth()+1);
  $('fYear').value=String(now.getFullYear()+543);
  $('fHour').value=String(now.getHours());
  $('fMinute').value=String(now.getMinutes());
  fillDayOptions('f',now.getDate());

  $('bProvince').value='1';$('fProvince').value='1';
  populate('b','พระนคร');populate('f','พระนคร');
  update('b');update('f');
}
function populate(prefix,preferredDistrict){
  const prov=PROVINCES.find(p=>String(p.id)===String($(prefix+'Province').value));
  const el=$(prefix+'District');
  el.innerHTML='';
  if(!prov)return;
  prov.districts.forEach(d=>el.innerHTML+='<option value="'+d+'">'+d+'</option>');
  if(preferredDistrict && prov.districts.includes(preferredDistrict)) el.value=preferredDistrict;
}
function update(prefix){
  const prov=PROVINCES.find(p=>String(p.id)===String($(prefix+'Province').value));
  if(!prov)return;
  $(prefix+'Lat').value=prov.lat.toFixed(6);
  $(prefix+'Lon').value=prov.lon.toFixed(6);
  $(prefix+'Place').textContent=prov.name+' · '+($(prefix+'District').value||'')+' · '+prov.lat.toFixed(6)+', '+prov.lon.toFixed(6)+' UTC+7';
}
$('bProvince').addEventListener('change',function(){populate('b');update('b');});
$('fProvince').addEventListener('change',function(){populate('f');update('f');});
$('bDistrict').addEventListener('change',function(){update('b');});
$('fDistrict').addEventListener('change',function(){update('f');});
$('bMonth').addEventListener('change',function(){fillDayOptions('b');});
$('bYear').addEventListener('change',function(){fillDayOptions('b');});
$('fMonth').addEventListener('change',function(){fillDayOptions('f');});
$('fYear').addEventListener('change',function(){fillDayOptions('f');});

function getInput(p){const d=$(p+'Day').value,m=$(p+'Month').value,y=$(p+'Year').value,h=$(p+'Hour').value,mi=$(p+'Minute').value;const ad=Number(y)-543;return {date:ad+'-'+pad(m)+'-'+pad(d),time:pad(h)+':'+pad(mi),beYear:Number(y)};}

function render(natal,transit){
  const wdNames=['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
  $('asc').innerHTML='<b>ลัคนา '+natal.ascSign.name+' '+formatInSign(natal.asc)+' (เต็ม '+formatFull(natal.asc)+')</b> เมษอยู่บน 12 นาฬิกา';
  $('thaksa').innerHTML=Object.entries(natal.thaksa).map(function(kv){return '<span class="pill">'+kv[0]+': '+kv[1]+'</span>'}).join('');
  const sun=natal.planets.find(p=>p.name==='อาทิตย์');
  $('meta').innerHTML='วันโหร: '+wdNames[natal.weekday]+(natal.weekdayInfo.isBefore6?' ถอยวันก่อน 06:00':'')+'<br>กลาง: อาทิตย์ '+(sun?formatInSign(sun.longitude):'')+' เต็ม '+(sun?formatFull(sun.longitude):'')+' · องศาในราศี = เต็ม - (ราศี*30)';
  let html='<div style="display:grid;grid-template-columns:110px 1fr 1fr;gap:6px;font-weight:700;border-bottom:2px solid #1e293b;padding-bottom:4px;font-size:12px"><div>ดาว</div><div>เกิดดำ - ในราศี</div><div>จรเขียว - ในราศี</div></div>';
  natal.planets.forEach(function(np){const tp=transit?transit.planets.find(p=>p.name===np.name):null;html+='<div style="display:grid;grid-template-columns:110px 1fr 1fr;gap:6px;padding:6px 0;border-bottom:1px solid #eee;font-size:12px"><div>'+planetNo(np.name)+' '+np.name+'</div><div><span class="pill pill-natal">'+np.sign.name+' '+formatInSign(np.longitude)+'</span> '+formatFull(np.longitude)+'</div><div>'+(tp?'<span class="pill pill-transit">'+tp.sign.name+' '+formatInSign(tp.longitude)+'</span> '+formatFull(tp.longitude):'—')+'</div></div>';});
  $('compare').innerHTML=html;
  $('birthDetails').innerHTML='เกิด: '+natal.date+' '+natal.time+' พ.ศ.'+natal.beYear+' '+$('bPlace').textContent+'<br>จร: '+transit.date+' '+transit.time+' '+$('fPlace').textContent+'<br><b>ลัคนา '+natal.ascSign.name+' '+formatInSign(natal.asc)+'</b> เมษบน';
  renderWheel(natal,transit);
}

document.getElementById('calc').addEventListener('click',function(){
  horaLog('CALCULATE_START','เริ่มคำนวณ',{birth:getInput('b'),forecast:getInput('f')});
  const b=getInput('b'),f=getInput('f');
  let natal,transit;
  try{
    natal=calcAt(b.date,b.time,true,{lat:Number($('bLat').value),lon:Number($('bLon').value),timezone:7});natal.beYear=b.beYear;
      transit=calcAt(f.date,f.time,false,{lat:Number($('fLat').value),lon:Number($('fLon').value),timezone:7});
  }catch(err){
    horaLog('CALCULATE_ERROR',err&&err.message||String(err),{stack:err&&err.stack||''});
    $('msg').innerHTML='<div style="background:#fee2e2;color:#991b1b;padding:10px;border-radius:8px">❌ คำนวณไม่สำเร็จ — ดูกล่อง LOG ด้านล่าง แล้วกดคัดลอกข้อผิดพลาด</div>';
    return;
  }
  horaLog('CALCULATE_OK','คำนวณสำเร็จ',{asc:natal.asc,planets:natal.planets.map(p=>({name:p.name,longitude:p.longitude}))});
  const qa=goldenQA(natal,b);
  render(natal,transit);
  const sun=natal.planets.find(p=>p.name==='อาทิตย์');
  if(qa.applicable&&!qa.pass){
    const detail=Object.entries(qa.deltas).map(([n,d])=>n+': '+(d*60).toFixed(1)+'′').join(' · ');
    $('msg').innerHTML='<div style="background:#fee2e2;color:#991b1b;padding:8px;border-radius:8px">❌ GOLDEN CASE FAIL — '+detail+'</div>';
    console.error('GOLDEN_CASE_FAIL',qa);
    return;
  }
  $('msg').innerHTML='<div class="ok">✅ สูตรสุริยยาตร์ใหม่ทำงาน · เมษอยู่บน 12 นาฬิกา · '+(qa.applicable?'Golden Case PASS':'คำนวณสำเร็จ')+' · บริวาร '+natal.thaksa['บริวาร']+' · อาทิตย์ '+formatInSign(sun.longitude)+'</div>';
});

initDropdowns();
setTimeout(function(){$('calc').click();},700);


const MASTER_GOLDEN_ROWS = [
  ['ลัคนา','23°51′ กรกฎ','TODO','ตรวจอันโตนาทีสามัญ + longitude correction'],
  ['อาทิตย์','25°48′ กันย์','TODO','ตรวจสูตรสุริยยาตร์และ Golden Case conflict เดิม'],
  ['จันทร์','15°35′ มกร','LOCKED','ผ่านแล้ว ห้ามเปลี่ยนโดยไม่มีหลักฐาน'],
  ['อังคาร','08°13′ มิถุน','LOCKED','ผ่านแล้ว ห้ามเปลี่ยนโดยไม่มีหลักฐาน'],
  ['พุธ','08°39′ กันย์','TODO','ตรวจ มัธยมพระพุธ → มนทโกฏิ → ... → มหาสัมผุส'],
  ['พฤหัสบดี','27°12′ มีน','LOCKED','ผ่านแล้ว ห้ามเปลี่ยนโดยไม่มีหลักฐาน'],
  ['ศุกร์','14°28′ สิงห์','TODO','ตรวจ มัธยมศุกร์ → มนทโกฏิ → ... → มหาสัมผุส'],
  ['เสาร์','05°28′ กรกฎ','LOCKED','ผ่านแล้ว ห้ามเปลี่ยนโดยไม่มีหลักฐาน'],
  ['ราหู','29°21′ ตุล','TODO','ต้องยืนยัน Mean/True Node ตามสูตรที่ใช้'],
  ['เกตุ','06°53′ เมษ','TODO','ต้องสัมพันธ์กับราหู + 180°'],
  ['มฤตยู','04°30′ ตุล','TODO','ต้องยืนยันวิธีแปลงเข้าสุริยยาตร์']
];

function initMasterMenu(){
  const buttons=[...document.querySelectorAll('.menu-btn')];
  const panels={formula:$('formulaPanel'),golden:$('goldenPanel'),status:$('statusPanel')};
  function hidePanels(){Object.values(panels).forEach(p=>{if(p)p.style.display='none';});buttons.forEach(b=>b.classList.remove('active'));}
  buttons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const menu=btn.dataset.menu;
      if(menu==='calculate'){
        hidePanels();
        document.querySelector('.app').scrollIntoView({behavior:'smooth',block:'start'});
        return;
      }
      hidePanels();
      btn.classList.add('active');
      const panel=panels[menu];
      if(panel){panel.style.display='block';panel.scrollIntoView({behavior:'smooth',block:'start'});}
    });
  });

  const formula=$('formulaContent');
  if(formula) formula.innerHTML=
    '<p><b>หลักการ:</b> สูตรต้องเป็นผู้สร้างผลลัพธ์ ไม่ใช่ผลลัพธ์เป็นผู้สร้างสูตร</p>'+
    '<table class="master-table"><tr><th>ขั้น</th><th>หลักที่ต้องตรวจ</th></tr>'+
    '<tr><td>เวลา</td><td>Local Time → UTC → Local Mean Solar Time → อันโตนาทีสามัญ → Sidereal Time</td></tr>'+
    '<tr><td>ฐาน</td><td>หรคุณ → มัธยม → ส่วนแก้ → สัมผุส</td></tr>'+
    '<tr><td>ดาว</td><td>มนทโกฏิ → โกฏิผล → มนทเฉท → ผล → สิงฆโกฏิ → สิงฆผล → สัมผุสพยาสน์ → มหาผล → มหาสัมผุส</td></tr>'+
    '<tr><td>ลัคนา</td><td>ต้องคำนวณจากเวลา สถานที่ latitude longitude และอันโตนาทีสามัญ ห้าม flip 180°</td></tr>'+
    '<tr><td>QA</td><td>คำนวณจริง → เทียบ Golden Case ทุกดาว → Regression → LOCK</td></tr>'+
    '</table>'+
    '<p class="hint">ห้ามใช้ correction ปลายทางเพื่อให้ผ่าน Golden Case และห้ามเปลี่ยน Golden Case เอง</p>';

  const golden=$('goldenContent');
  if(golden) golden.innerHTML=
    '<p><b>Input:</b> 14 ตุลาคม 2518 / 14 Oct 1975 · 01:05 · กรุงเทพมหานคร เขตพระนคร · 13.752555, 100.494066 · UTC+7</p>'+
    '<table class="master-table"><tr><th>จุด</th><th>Golden Case</th><th>สถานะสูตร</th><th>หมายเหตุ</th></tr>'+
    MASTER_GOLDEN_ROWS.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td class="'+(r[2]==='LOCKED'?'master-ok':'master-todo')+'">'+r[2]+'</td><td>'+r[3]+'</td></tr>').join('')+
    '</table>'+
    '<p class="hint">Golden Case ล่าสุด: อาทิตย์ 25°48′ กันย์ = 175.80° · สูตรคำนวณมาจาก engine ไม่ hard-code ตำแหน่งผลลัพธ์</p>';

  const status=$('statusContent');
  if(status) status.innerHTML=
    '<div class="pill pill-natal">Engine/UI: HORA v5.3 · Suriyayat Integer Engine 1.2.0</div>'+
    '<div class="pill">Golden Case: '+GOLDEN.date+' '+GOLDEN.time+'</div>'+
    '<p><b>LOCKED:</b> จันทร์ 15°35′ มกร · อังคาร 08°13′ มิถุน · พฤหัสบดี 27°12′ มีน · เสาร์ 05°28′ กรกฎ</p>'+
    '<p><b>กำลังตรวจ:</b> ลัคนา · อาทิตย์ · พุธ · ศุกร์ · ราหู · เกตุ · มฤตยู</p>'+
    '<p class="hint">เครื่องคำนวณใช้ Suriyayat integer engine และ Antornatee Samanya จริง; Golden Case ใช้ตรวจผล ไม่ได้สร้างผลจาก Golden Case</p>';
}

initMasterMenu();
