
function slotTimeFormatConvertor(sTime){
  if(sTime.slice(2,3)!==':'){
    stTime='0'+sTime
  }
  let stTime=sTime.slice(0,11);
  let enTime=sTime.slice(12)
  enTime=('0'+enTime).slice(-11)
  return stTime.slice(0,5)+stTime.slice(-2)+'-'+(enTime.slice(0,5)+enTime.slice(-2));
}
console.log(slotTimeFormatConvertor("13:15:00 PM-14:00:00 PM"));