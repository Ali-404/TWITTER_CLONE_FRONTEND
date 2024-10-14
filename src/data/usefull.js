var months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
var months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(date){
    const theDate = new Date(date)
    return `${theDate.getDay()} ${months_short[theDate.getMonth()]} ${theDate.getFullYear()} `
}   



export function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? "a year ago" : `${interval} years ago`;
    }
  
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? "a month ago" : `${interval} months ago`;
    }
  
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? "a day ago" : `${interval} days ago`;
    }
  
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? "an hour ago" : `${interval} hours ago`;
    }
  
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? "a minute ago" : `${interval} minutes ago`;
    }
  
    return seconds < 10 ? "just now" : `${Math.floor(seconds)} seconds ago`;
  }
  
  // Example usage:
  