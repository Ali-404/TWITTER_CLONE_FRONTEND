var months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
var months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(date){
    const theDate = new Date(date)
    return `${theDate.getDay()} ${months_short[theDate.getMonth()]} ${theDate.getFullYear()} `
}   