import { HOUSES, normalize360, signOf, houseFromAsc } from '../core/geometry.js';
export function buildHouses(asc){return Array.from({length:12},(_,i)=>{const cusp=normalize360(asc+i*30);return {number:i+1,name:HOUSES[i],cusp,sign:signOf(cusp)};});}
export function locatePlanet(lon,asc){return houseFromAsc(lon,asc);}