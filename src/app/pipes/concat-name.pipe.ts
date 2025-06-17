import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concatName'
})
export class ConcatNamePipe implements PipeTransform {

  transform(array: any[]): string {
    let result: string = '';
    if (array.length > 0){
      let temp = array.map(a => a.nombre);
      result = temp.join();
    }
    return result;
  }

}
