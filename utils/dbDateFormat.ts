export const dbDateFormat = (dateString:string) => 
{
    const dateValue = new Date(dateString)
    let year, month, day;
    year = String(dateValue.getFullYear());
    month = String(dateValue.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = String(dateValue.getDate());
    if (day.length == 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}