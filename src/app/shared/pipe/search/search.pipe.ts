import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: Array<any>, person: string): Array<any> {
    if(!person){
      return value;
    }
    if(!value){
      return [];
    }
    return value.filter(name => JSON.stringify(name).toLowerCase().includes(person.toLowerCase()))
  }

}
