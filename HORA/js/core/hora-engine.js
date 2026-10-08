import { validateChartInput } from './validation.js';
export class HORAEngine {
 constructor(config={}){this.config={baseUrl:'',...config};}
 async calculate(input){validateChartInput(input);const r=await fetch(`${this.config.baseUrl}/api/chart`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});if(!r.ok)throw new Error(await r.text());return r.json();}
 async transit(input){const q=new URLSearchParams(input).toString();const r=await fetch(`${this.config.baseUrl}/api/transit?${q}`);if(!r.ok)throw new Error(await r.text());return r.json();}
}