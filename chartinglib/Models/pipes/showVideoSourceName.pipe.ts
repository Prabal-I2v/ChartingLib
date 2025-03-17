import { Pipe, PipeTransform } from '@angular/core';
import { CustomFilterValueModel } from '../Widget';

@Pipe({
  name: 'showVideoSourceName'
})
export class ShowVideoSourceNamePipe implements PipeTransform {
  transform(value: CustomFilterValueModel[]): string[] {
    if (!value || value.length == 0) {
      return ["No videosources"];
    }
    
    var res = value.map(x => x.displayName)
    return res;
  }
}