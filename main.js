
import { calculateSuriyayatra } from './js/astronomy/suriyayatra-engine.js';
import { calculateSuriyayatraAscendant, calculateAscendantBoundaryTimes } from './js/astronomy/ascendant-geometry.js';

const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const signs=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน'];
const thaiMonths=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const PROVINCES=[
{id:1,name:'กรุงเทพมหานคร',lat:13.752555,lon:100.494066,districts:['พระนคร','ดุสิต','หนองจอก','บางรัก','บางเขน','บางกะปิ','ปทุมวัน','ป้อมปราบศัตรูพ่าย','พระโขนง','มีนบุรี','ลาดกระบัง','ยานนาวา','สัมพันธวงศ์','พญาไท','ธนบุรี','บางกอกใหญ่','ห้วยขวาง','คลองสาน','ตลิ่งชัน','บางกอกน้อย','บางขุนเทียน','ภาษีเจริญ','หนองแขม','ราษฎร์บูรณะ','บางพลัด','ดินแดง','บึงกุ่ม','สาทร','บางซื่อ','จตุจักร','บางคอแหลม','ประเวศ','คลองเตย','สวนหลวง','จอมทอง','ดอนเมือง','ราชเทวี','ลาดพร้าว','วัฒนา','บางแค','หลักสี่','สายไหม','คันนายาว','สะพานสูง','วังทองหลาง','คลองสามวา','บางนา','ทวีวัฒนา','ทุ่งครุ','บางบอน']},
{id:2,name:'นนทบุรี',lat:13.8621,lon:100.5143,districts:['เมืองนนทบุรี','บางกรวย','บางใหญ่','บางบัวทอง','ไทรน้อย','ปากเกร็ด']},
{id:3,name:'เชียงใหม่',lat:18.7883,lon:98.9853,districts:['เมืองเชียงใหม่','จอมทอง','แม่แจ่ม','เชียงดาว','ดอยสะเก็ด','แม่แตง','แม่ริม','สะเมิง','ฝาง','แม่อาย','พร้าว','สันป่าตอง','สันกำแพง','สันทราย','หางดง','ฮอด','ดอยเต่า','อมก๋อย','สารภี','เวียงแหง','ไชยปราการ','แม่วาง','แม่ออน','ดอยหล่อ']},
{id:4,name:'ชลบุรี',lat:13.3611,lon:100.9847,districts:['เมืองชลบุรี','บางละมุง','ศรีราชา','สัตหีบ','บ้านบึง','พนัสนิคม']},
{id:5,name:'ภูเก็ต',lat:7.8804,lon:98.3923,districts:['เมืองภูเก็ต','กะทู้','ถลาง']},
{id:6,name:'ขอนแก่น',lat:16.4322,lon:102.8236,districts:['เมืองขอนแก่น','บ้านฝาง','พระยืน','หนองเรือ','ชุมแพ','สีชมพู','น้ำพอง','อุบลรัตน์','กระนวน','บ้านไผ่','เปือยน้อย','พล','แวงใหญ่','แวงน้อย','หนองสองห้อง','ภูเวียง','มัญจาคีรี','ชนบท','เขาสวนกวาง','ภูผาม่าน','ซำสูง','โคกโพธิ์ไชย','หนองนาคำ','บ้านแฮด','โนนศิลา']}
];

const GOLDEN_1991 = {
  date:'1991-10-14', time:'01:05',
  lat:16.4322, lon:102.8236,
  asc: 90+25+58/60,
  planets:{
    'อาทิตย์':150+25+38/60,
    'จันทร์':240+6+27/60,
    'อังคาร':180+4+45/60,
    'พุธ':180+10+25/60,
    'พฤหัสบดี':120+14+5/60,
    'ศุกร์':120+11+37/60,
    'เสาร์':270+1+32/60,
    'ราหู':240+19+37/60,
    'เกตุ':60+28+27/60,
    'มฤตยู':240+12+31/60,
  }
};

function formatInSign(lon){const d=((lon%360)+360)%360%30;return pad(Math.floor(d))+'° '+pad(Math.floor((d%1)*60))+"'";}
function formatFull(lon){const d=((lon%360)+360)%360;return Math.floor(d)+'° '+pad(Math.floor((d%1)*60))+"'";}
function signOf(lon){const idx=Math.floor(((lon%360)+360)%360/30);return {name:signs[idx], idx};}
function houseFromAsc(lon,asc){return Math.floor((((lon-asc)%360+360)%360)/30)+1;}
function getWeekdayThai(beY,m,d,h){const ad=beY-543;let dt=new Date(ad,m-1,d);const isBefore6=h<6;if(isBefore6)dt=new Date(dt.getTime()-24*3600*1000);return {weekday:dt.getDay(),isBefore6};}
function calcThaksa(wd){const map={0:['อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์'],1:['จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์'],2:['อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์'],3:['พุธ','เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร'],4:['พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์'],5:['ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ','เสาร์','พฤหัสบดี','ราหู'],6:['เสาร์','พฤหัสบดี','ราหู','ศุกร์','อาทิตย์','จันทร์','อังคาร','พุธ']};const pls=map[wd];const r={};['บริวาร','อายุ','เดช','ศรี','มูลละ','อุตสาหะ','มนตรี','กาลกิณี'].forEach((k,i)=>r[k]=pls[i]);return r;}
function parseLocalDate(dateStr,timeStr){const [y,m,d]=dateStr.split('-').map(Number);const [hh,mm]=timeStr.split(':').map(Number);return new Date(Date.UTC(y,m-1,d,hh,mm)-7*3600000);}
function signObj(lon){const n=((lon%360)+360)%360;const idx=Math.floor(n/30);return {name:signs[idx],idx};}
function calcAt(dateStr,timeStr,isBirth,location){
  const hh=parseInt(timeStr.split(':')[0],10);
  const beY=parseInt(dateStr.split('-')[0],10)+543;
  const month=parseInt(dateStr.split('-')[1],10),day=parseInt(dateStr.split('-')[2],10);
  const loc=location||{lat:13.752555,lon:100.494066,timezone:7};
  const engine=calculateSuriyayatra({date:dateStr,time:timeStr});
  const ascDate=parseLocalDate(dateStr,timeStr);
  const sun=engine.planets.find(p=>p.name==='อาทิตย์');
  let asc=calculateSuriyayatraAscendant({date:ascDate,latitude:Number(loc.lat),longitude:Number(loc.lon),suriyayatraSunLongitude:Number(sun.longitude),timezone:Number(loc.timezone??7)});
  const planets=engine.planets.map(p=>({id:p.id,name:p.name,longitude:((Number(p.longitude)%360)+360)%360,sign:signObj(p.longitude),house:isBirth?houseFromAsc(p.longitude,asc):0,retrograde:Boolean(p.retrograde)}));
  const wd=getWeekdayThai(beY,month,day,hh);
  return {date:dateStr,time:timeStr,asc,planets,weekday:wd.weekday,weekdayInfo:wd,ascSign:signObj(asc),thaksa:calcThaksa(wd.weekday),metadata:{...engine,location:{lat:Number(loc.lat),lon:Number(loc.lon),sunLongitude:Number(sun.longitude)}}};
}
function planetNo(n){return{'อาทิตย์':'๑','จันทร์':'๒','อังคาร':'๓','พุธ':'๔','พฤหัสบดี':'๕','ศุกร์':'๖','เสาร์':'๗','ราหู':'๘','เกตุ':'๙','มฤตยู':'๐'}[n]||'';}

function wheelAngleDeg(longitude){return -(longitude-15)-90;}

function renderWheel(natal,transit){
  const el=$('wheel'); if(!el) return;
  const c=300,rad=245,inner=72;
  let svg='<svg viewBox="0 0 600 600" style="width:100%;max-width:680px;background:#fff"><circle cx="'+c+'" cy="'+c+'" r="'+rad+'" fill="#fff" stroke="#1e293b" stroke-width="2"/><circle cx="'+c+'" cy="'+c+'" r="'+inner+'" fill="#fff" stroke="#334155" stroke-width="1.2"/>';
  const sun=natal.planets.find(p=>p.name==='อาทิตย์');
  svg+='<text x="'+c+'" y="'+(c-6)+'" text-anchor="middle" font-size="18" font-weight="900" fill="#1e293b">'+(sun?formatInSign(sun.longitude):'')+'</text>';
  svg+='<text x="'+c+'" y="'+(c+14)+'" text-anchor="middle" font-size="9" fill="#6b7280">อาทิตย์ '+(sun?sun.sign.name:'')+'</text>';
  for(let i=0;i<12;i++){
    const boundaryDeg=i*30;
    const a=wheelAngleDeg(boundaryDeg)*Math.PI/180;
    const x1=c+inner*Math.cos(a),y1=c+inner*Math.sin(a);
    const x2=c+rad*Math.cos(a),y2=c+rad*Math.sin(a);
    svg+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#334155" stroke-width="1"/>';
    const mid=i*30+15;
    const am=wheelAngleDeg(mid)*Math.PI/180;
    const lx=c+(rad+30)*Math.cos(am),ly=c+(rad+30)*Math.sin(am);
    svg+='<text x="'+lx+'" y="'+(ly+4)+'" text-anchor="middle" font-size="'+(i===0?16:13)+'" fill="'+(i===0?'#dc2626':'#92400e')+'" font-weight="800">'+signs[i]+(i===0?' ★บน':'')+'</text>';
  }
  const ascAngle=wheelAngleDeg(natal.asc)*Math.PI/180;
  const ax=c+rad*Math.cos(ascAngle),ay=c+rad*Math.sin(ascAngle);
  svg+='<line x1="300" y1="300" x2="'+ax+'" y2="'+ay+'" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="'+ax+'" cy="'+ay+'" r="4" fill="#dc2626"/>';
  function draw(list,isTransit){
    if(!list||!list.planets) return;
    const lanes=isTransit?[207,222,237]:[112,130,148,166,184];
    list.planets.slice().sort((a,b)=>a.longitude-b.longitude).forEach((p,j)=>{
      const angle=wheelAngleDeg(p.longitude)*Math.PI/180;
      const rr=lanes[j%lanes.length];
      const x=c+rr*Math.cos(angle),y=c+rr*Math.sin(angle);
      const color=isTransit?'#15803d':'#7c3aed';
      svg+='<g><circle cx="'+x+'" cy="'+y+'" r="13" fill="'+color+'" stroke="#fff" stroke-width="2"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="12" fill="#fff" font-weight="900">'+planetNo(p.name)+'</text></g>';
    });
  }
  draw(natal,false); if(transit) draw(transit,true);
  svg+='</svg>'; el.innerHTML=svg;
}

function renderSquare(natal,transit){
  const el=$('squareChart'); if(!el) return;
  const layout=[{r:0,c:1,s:1},{r:0,c:2,s:0},{r:0,c:3,s:11},{r:1,c:3,s:10},{r:2,c:3,s:9},{r:3,c:3,s:8},{r:3,c:2,s:7},{r:3,c:1,s:6},{r:3,c:0,s:5},{r:2,c:0,s:4},{r:1,c:0,s:3},{r:0,c:0,s:2}];
  const mapN={},mapT={};layout.forEach(p=>{mapN[p.s]=[];mapT[p.s]=[];});
  natal.planets.forEach(p=>{const s=Math.floor(p.longitude/30);if(mapN[s]!==undefined)mapN[s].push(p);});
  if(transit) transit.planets.forEach(p=>{const s=Math.floor(p.longitude/30);if(mapT[s]!==undefined)mapT[s].push(p);});
  const ascS=Math.floor(natal.asc/30);
  const sun=natal.planets.find(p=>p.name==='อาทิตย์');
  let html='<div style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);width:100%;max-width:520px;aspect-ratio:1;margin:auto;border:2px solid #1e293b;background:#fff">';
  for(let r=0;r<4;r++){for(let c=0;c<4;c++){
    if(r===1&&c===1){html+='<div style="grid-column:2/4;grid-row:2/4;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fefce8;border:1px solid #1e293b"><div style="font-size:12px;font-weight:800">ลัคนา '+natal.ascSign.name+'</div><div style="font-size:18px;font-weight:900">'+formatInSign(natal.asc)+'</div><div style="font-size:11px">อาทิตย์ '+(sun?formatInSign(sun.longitude):'')+'</div></div>';continue;}
    if(r===1&&c===2)continue;if(r===2&&c===1)continue;if(r===2&&c===2)continue;
    const pos=layout.find(p=>p.r===r&&p.c===c);if(!pos){html+='<div></div>';continue;}
    const si=pos.s;const nats=mapN[si]||[];const trans=mapT[si]||[];const isA=si===ascS;
    html+='<div style="border:1px solid #1e293b;position:relative;padding:4px;font-size:11px;'+(isA?'background:#fffbeb':'')+'"><div style="position:absolute;top:2px;right:4px;font-size:10px;color:#854d0e;font-weight:700">'+(si+1)+' '+signs[si]+(isA?' ★':'')+'</div><div style="margin-top:14px">'+nats.map(p=>'<div>'+planetNo(p.name)+p.name+' '+formatInSign(p.longitude)+'</div>').join('')+trans.map(p=>'<div style="color:#15803d">'+planetNo(p.name)+p.name+' '+formatInSign(p.longitude)+' (จร)</div>').join('')+'</div></div>';
  }}html+='</div>';el.innerHTML=html;
}

function renderQA(natal){
  const el=$('compare');
  if(!el) return;

  const isGolden = natal.date===GOLDEN_1991.date && natal.time===GOLDEN_1991.time;
  if(!isGolden){
    el.innerHTML='<div class="section-title"><h2>เปรียบเทียบผลคำนวณ</h2><span class="badge">Formula vs Reference</span></div><div class="hint">เลือก Golden Case: 14 ต.ค. 2534 เวลา 01:05 ขอนแก่น เพื่อเทียบค่าอ้างอิง</div>';
    return;
  }

  const diffText = (a,b) => {
    const d=((a-b+540)%360)-180;
    const min=Math.round(d*60);
    if(min===0) return '0°00′';
    const sign=min>0?'+':'−';
    const abs=Math.abs(min);
    return sign+Math.floor(abs/60)+'°'+String(abs%60).padStart(2,'0')+'′';
  };
  const status = (a,b) => {
    const min=Math.abs((((a-b+540)%360)-180)*60);
    return min<0.5 ? '<span class="pass">✅ PASS</span>' : '<span class="fail">❌ FAIL</span>';
  };

  let html='<div class="section-title"><h2>เปรียบเทียบผลคำนวณ</h2><span class="badge">Golden Case #1</span></div>';
  html+='<div class="table-wrap"><table><tr><th>ดาว / จุด</th><th>สูตรเรา</th><th>ค่าที่ก็อปมา (Reference)</th><th>ต่างกัน</th><th>สถานะ</th></tr>';

  const rows=[['ลัคนา',natal.asc,GOLDEN_1991.asc]];
  for(const name of ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','ราหู','เกตุ','มฤตยู']){
    const p=natal.planets.find(x=>x.name===name);
    if(p) rows.push([name,p.longitude,GOLDEN_1991.planets[name]]);
  }

  for(const [name,actual,expected] of rows){
    html+='<tr><td>'+name+'</td><td>'+formatInSign(actual)+' '+signOf(actual).name+'</td><td>'+formatInSign(expected)+' '+signOf(expected).name+'</td><td>'+diffText(actual,expected)+'</td><td>'+status(actual,expected)+'</td></tr>';
  }
  html+='</table></div>';
  html+='<div class="hint" style="margin-top:10px">การแสดงสถานะมาจากผลคำนวณจริงเท่านั้น ไม่มีการบังคับให้ PASS และไม่มีการฉีดค่า Golden เข้าไปในผลคำนวณ</div>';
  el.innerHTML=html;
}
function initDropdowns(){
  $('bMonth').innerHTML=''; $('fMonth').innerHTML='';
  $('bProvince').innerHTML=''; $('fProvince').innerHTML='';
  for(let d=1;d<=31;d++){}
  ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'].forEach((m,i)=>{$('bMonth').innerHTML+='<option value="'+(i+1)+'">'+m+'</option>';$('fMonth').innerHTML+='<option value="'+(i+1)+'">'+m+'</option>';});
  PROVINCES.forEach(p=>{$('bProvince').innerHTML+='<option value="'+p.id+'">'+p.name+'</option>';$('fProvince').innerHTML+='<option value="'+p.id+'">'+p.name+'</option>';});
  // Default = Golden Case ขอนแก่น 14 ต.ค. 2534 01:05
  $('bDay').value='14';$('bMonth').value='10';$('bYear').value='2534';$('bHour').value='1';$('bMinute').value='5';
  const now=new Date();$('fDay').value=String(now.getDate());$('fMonth').value=String(now.getMonth()+1);$('fYear').value=String(now.getFullYear()+543);$('fHour').value=String(now.getHours());$('fMinute').value=String(now.getMinutes());
  $('bProvince').value='6';$('fProvince').value='6';
  populate('b');populate('f');
  $('bDistrict').value='เมืองขอนแก่น';$('fDistrict').value='เมืองขอนแก่น';
  update('b');update('f');
}
function populate(prefix){
  const prov=PROVINCES.find(p=>String(p.id)===String($(prefix+'Province').value));
  const el=$(prefix+'District');el.innerHTML='';prov.districts.forEach(d=>el.innerHTML+='<option value="'+d+'">'+d+'</option>');
}
function update(prefix){
  const prov=PROVINCES.find(p=>String(p.id)===String($(prefix+'Province').value));
  $(prefix+'Lat').value=prov.lat.toFixed(6);$(prefix+'Lon').value=prov.lon.toFixed(6);
  if(prefix==='f') $(prefix+'Place').value=prov.name+' · '+$(prefix+'District').value+' · '+prov.lat.toFixed(6)+', '+prov.lon.toFixed(6)+' UTC+7';
}
function getInput(p){
  const d=$(p+'Day').value,m=$(p+'Month').value,y=$(p+'Year').value,h=$(p+'Hour').value,mi=$(p+'Minute').value;
  if(!d||!m||!y||h===''||mi==='') throw new Error('INPUT_INCOMPLETE_'+p);
  const ad=Number(y)-543;
  if(!Number.isInteger(ad)||ad<1) throw new Error('YEAR_INVALID_'+p);
  return {date:ad+'-'+pad(m)+'-'+pad(d),time:pad(h)+':'+pad(mi),beYear:Number(y)};
}

let dateStr='1991-10-14';
function render(natal,transit){
  dateStr=natal.date;
  $('birthDetails').innerHTML='ชื่อ: '+$('bPlace').value+'<br>เกิด: '+natal.date+' '+natal.time+' พ.ศ.'+getInput('b').beYear+' '+$('bProvince').selectedOptions[0].text+' · '+$('bDistrict').value+'<br>จร: '+transit.date+' '+transit.time+' '+$('fPlace').value;
  renderWheel(natal,transit);
  renderSquare(natal,transit);
  renderQA(natal);
}

function showRuntimeError(err){
  const msg=$('msg');
  if(msg) msg.innerHTML='<div class="fail">❌ FAIL — '+String(err&&err.message||err)+'</div>';
  console.error(err);
}

function bootHORA(){
  $('bProvince').addEventListener('change',()=>{populate('b');update('b');});
  $('fProvince').addEventListener('change',()=>{populate('f');update('f');});
  $('bDistrict').addEventListener('change',()=>update('b'));
  $('fDistrict').addEventListener('change',()=>update('f'));

  $('calc').addEventListener('click',()=>{
    try{
      const b=getInput('b'),f=getInput('f');
      const natal=calcAt(b.date,b.time,true,{lat:$('bLat').value,lon:$('bLon').value});
      const transit=calcAt(f.date,f.time,false,{lat:$('fLat').value,lon:$('fLon').value});
      render(natal,transit);
      $('msg').innerHTML='<div class="ok">คำนวณเสร็จ — กรุณาตรวจตาราง Golden Case</div>';
    }catch(err){ showRuntimeError(err); }
  });

  initDropdowns();
  setTimeout(()=>{
    try{$('calc').click();}catch(err){showRuntimeError(err);}
  },600);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',bootHORA,{once:true});
}else{
  bootHORA();
}
