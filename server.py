from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime,timedelta,timezone
import os,json,swisseph as swe
ROOT=os.path.dirname(os.path.abspath(__file__)); app=FastAPI(title='HORA Astrology API',version='1.0.0'); app.mount('/static',StaticFiles(directory=ROOT),name='static')
PLANETS={'sun':swe.SUN,'moon':swe.MOON,'mercury':swe.MERCURY,'venus':swe.VENUS,'mars':swe.MARS,'jupiter':swe.JUPITER,'saturn':swe.SATURN,'uranus':swe.URANUS,'rahu':swe.MEAN_NODE}
NAMES={'sun':'อาทิตย์','moon':'จันทร์','mercury':'พุธ','venus':'ศุกร์','mars':'อังคาร','jupiter':'พฤหัสบดี','saturn':'เสาร์','uranus':'มฤตยู','rahu':'ราหู','ketu':'เกตุ'}; SIGNS=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน']; HOUSES=['ตนุ','กดุมภะ','สหัสชะ','พันธุ','ปุตตะ','อริ','ปัตนิ','มรณะ','ศุภะ','กัมมะ','ลาภะ','วินาศ']
class ChartInput(BaseModel):
 date:str; time:str; province:str='Bangkok'; latitude:float=13.7563; longitude:float=100.5018; timezone:float=7; ayanamsa:str='lahiri'
def norm(x): return x%360
def deg_parts(x):
 x=norm(x); d=int(x); m=int((x-d)*60); return {'degree':d,'minute':m,'second':round((((x-d)*60)-m)*60),'decimal':round(x,10),'display':f"{d}° {m:02d}'"}
def sign_of(lon): i=int(norm(lon)//30); return {'index':i,'name':SIGNS[i],'degree':deg_parts(lon-30*i)}
def jd_from_input(ci):
 dt=datetime.fromisoformat(f'{ci.date}T{ci.time}:00'); utc=dt-timedelta(hours=ci.timezone); return swe.julday(utc.year,utc.month,utc.day,utc.hour+utc.minute/60),utc
def setup_sidereal(name): swe.set_sid_mode({'lahiri':swe.SIDM_LAHIRI,'fagan_bradley':swe.SIDM_FAGAN_BRADLEY,'raman':swe.SIDM_RAMAN,'krishnamurti':swe.SIDM_KRISHNAMURTI}.get(name,swe.SIDM_LAHIRI))
def planet_calc(jd,key,body):
 vals,_=swe.calc_ut(jd,body,swe.FLG_SWIEPH|swe.FLG_SPEED|swe.FLG_SIDEREAL); lon,lat,dist,speed_lon,*_=vals
 return {'id':key,'name':NAMES[key],'longitude':norm(lon),'latitude':lat,'distance':dist,'speed':speed_lon,'retrograde':speed_lon<0,'sign':sign_of(lon)}
def sunrise_for_local_date(date_str,tz,lat,lon):
 d=datetime.fromisoformat(date_str).replace(tzinfo=timezone(timedelta(hours=tz))); u=d.astimezone(timezone.utc); jd=swe.julday(u.year,u.month,u.day,0)
 try: _,t=swe.rise_trans(jd-0.1,swe.SUN,swe.CALC_RISE|swe.BIT_DISC_CENTER|swe.BIT_NO_REFRACTION,(lon,lat,0)); return t[0]
 except Exception:return None
def jd_to_iso(jd,offset=7):
 if not jd:return None
 y,m,d,h=swe.revjul(jd,swe.GREG_CAL); hh=int(h); mm=int((h-hh)*60); ss=int(round((((h-hh)*60)-mm)*60)); return (datetime(y,m,d,hh,mm,ss,tzinfo=timezone.utc)+timedelta(hours=offset)).isoformat()
def weekday_thai(dt): return (dt.weekday()+1)%7
def thaksa(dt):
 wd=weekday_thai(dt); roles=['บริวาร','อายุ','เดช','ศรี','มูลละ','อุตสาหะ','มนตรี','กาลี']; ps=['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','ราหู']; mapping={r:ps[(wd+i)%8] for i,r in enumerate(roles)}; return {'weekday':wd,'roles':mapping,'planetRoles':{p:r for r,p in mapping.items()}}
def navamsa(lon):
 sign=int(norm(lon)//30); n=int((norm(lon)-sign*30)/(30/9)); start={0:0,1:8,2:4}[sign%3]; ns=(start+n)%12; return {'signIndex':ns,'signName':SIGNS[ns],'navamsa':n+1}
@app.get('/')
def index(): return FileResponse(os.path.join(ROOT,'index.html'))
@app.get('/api/health')
def health(): return {'status':'ok','engine':'HORA','version':'1.0.0','ephemeris':'Swiss Ephemeris'}
@app.post('/api/chart')
def chart(ci:ChartInput):
 setup_sidereal(ci.ayanamsa); jd,utc=jd_from_input(ci); dt=datetime.fromisoformat(f'{ci.date}T{ci.time}:00'); planets=[planet_calc(jd,k,b) for k,b in PLANETS.items()]; rahu=next(p for p in planets if p['id']=='rahu'); planets.append({'id':'ketu','name':NAMES['ketu'],'longitude':norm(rahu['longitude']+180),'latitude':0,'distance':0,'speed':rahu['speed'],'retrograde':rahu['retrograde'],'sign':sign_of(rahu['longitude']+180)})
 asc=norm(swe.houses_ex(jd,ci.latitude,ci.longitude,b'P',swe.FLG_SIDEREAL)[1][0]); mc=norm(swe.houses_ex(jd,ci.latitude,ci.longitude,b'P',swe.FLG_SIDEREAL)[1][1]); hs=[{'number':i+1,'name':HOUSES[i],'cusp':norm(asc+i*30),'sign':sign_of(asc+i*30)} for i in range(12)]
 for p in planets: p['house']=int(norm(p['longitude']-asc)//30)+1;p['navamsa']=navamsa(p['longitude'])
 sjd=sunrise_for_local_date(ci.date,ci.timezone,ci.latitude,ci.longitude); boundary=dt.replace(hour=6,minute=0,second=0,microsecond=0); tr=thaksa(dt if dt>=boundary else dt-timedelta(days=1))
 return {'metadata':{'engineVersion':'1.0.0','rulesetVersion':'1.0.0','ephemeris':'Swiss Ephemeris','ayanamsa':ci.ayanamsa,'coordinateSystem':'sidereal','houseModel':'whole-sign'},'input':ci.model_dump(),'utc':utc.isoformat(),'sunrise':jd_to_iso(sjd,ci.timezone),'ascendant':{'longitude':asc,'sign':sign_of(asc),'navamsa':navamsa(asc),'mc':mc},'planets':planets,'houses':hs,'thaksa':tr,'dignities':{'status':'PROVISIONAL','rules':{}}}
@app.get('/api/transit')
def transit(date:str,time:str='12:00',latitude:float=13.7563,longitude:float=100.5018,timezone_offset:float=7,ayanamsa:str='lahiri'):
 ci=ChartInput(date=date,time=time,latitude=latitude,longitude=longitude,timezone=timezone_offset,ayanamsa=ayanamsa);setup_sidereal(ayanamsa);jd,_=jd_from_input(ci);keys=['mars','mercury','jupiter','venus','saturn','uranus','rahu'];return {'datetime':f'{date}T{time}','planets':[planet_calc(jd,k,PLANETS[k]) for k in keys]}
@app.get('/api/config')
def config(): return json.load(open(os.path.join(ROOT,'data','rulesets','hora-standard.json'),encoding='utf8'))
if __name__=='__main__':
 import uvicorn;uvicorn.run(app,host='127.0.0.1',port=8000)