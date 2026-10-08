const roles=['บริวาร','อายุ','เดช','ศรี','มูลละ','อุตสาหะ','มนตรี','กาลี'];
const planets=['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','ราหู'];
export function thaksaForWeekday(weekday){const out={};for(let i=0;i<8;i++)out[roles[i]]=planets[(weekday+i)%8];return out;}