import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'firstLetterWord'
})

export class FirstLetterWordPipe implements PipeTransform{
  transform(value: any, ...args: any[]) {
    var str = value;
    var matches = str.match(/\b(\w)/g);
    var acronym = matches.join('');
      return acronym;
  }
}
