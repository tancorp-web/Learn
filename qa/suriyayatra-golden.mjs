import assert from 'node:assert/strict';
import { calculateSuriyayatra } from '../js/astronomy/suriyayatra-engine.js';

const r=calculateSuriyayatra({date:'1975-10-14',time:'01:05'});
const expected={
  planets:{
    'อาทิตย์':175.80,
    'จันทร์':285.583333,
    'อังคาร':68.216667,
    'พุธ':158.65,
    'พฤหัสบดี':357.20,
    'ศุกร์':134.466667,
    'เสาร์':95.466667
  }
};
const delta=(a,b)=>Math.abs(((a-b+180)%360)-180);
for(const [name,lon] of Object.entries(expected.planets)){
  const p=r.planets.find(x=>x.name===name);
  assert.ok(p,'missing '+name);
  assert.ok(delta(p.longitude,lon)<=0.02,name+' '+p.longitude+' expected '+lon);
}
console.log(JSON.stringify({engine:r.engineVersion,calendar:r.calendar,planetRegression:r.planets},null,2));

// CI regression covers confirmed planetary Golden Case; ascendant is browser adapter validation.
