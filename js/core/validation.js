export function validateChartInput(input){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new Error('วันที่ต้องเป็น YYYY-MM-DD');
 if(!/^\d{2}:\d{2}$/.test(input.time)) throw new Error('เวลาต้องเป็น HH:MM');
 const [h,m]=input.time.split(':').map(Number); if(h>23||m>59) throw new Error('เวลาไม่ถูกต้อง');
 if(!Number.isFinite(Number(input.latitude))||Math.abs(input.latitude)>90) throw new Error('ละติจูดไม่ถูกต้อง');
 if(!Number.isFinite(Number(input.longitude))||Math.abs(input.longitude)>180) throw new Error('ลองจิจูดไม่ถูกต้อง');
}