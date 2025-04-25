import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {transform(value: string | Date | number, format: string = 'yyyy-MM-dd h:mm:ss a'): string {
  if (!value) {
    return '';
  }
  
  // Convert input to Date object
  const date = value instanceof Date ? value : new Date(value);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Format date based on the requested format
  // if (format === 'h:mm a') {
  //   // Format for time with AM/PM
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   const ampm = hours >= 12 ? 'PM' : 'AM';
  //   const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
  //   return `${displayHours}:${minutes} ${ampm}`;
  // } else 
  // {
    // Default format: YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${day}/${month}/${year} - ${displayHours}:${minutes}:${seconds} ${ampm}`;
  // }
}
}