export const stripHtml = (str:String) => 
{
  let stValue = str.replaceAll(/<\/?[^>]+(>|$)/gi, '')
  return stValue.replace(/\&nbsp;/gi, ' ');
}