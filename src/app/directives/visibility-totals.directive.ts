import {AfterViewInit, Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';
import {floor, head} from "lodash";

@Directive({
  selector: '[appVisibilityTotals]'
})
export class VisibilityTotalsDirective implements OnChanges {

  @Input() data: string | number = '';
  @Input() header = '';

  /*@HostBinding('class') margenSegunCifrasNumeros(className: any) {
    if (this.data && this.type) {
      elementClass = 'ml-10';
    }
  }*/

  constructor(private el: ElementRef) {
  }


  ngAfterViewInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data !== null && this.header && !isNaN(Number(String(this.data)))) {
      //console.log(String(this.data) + 'bla bla bnla')
      this.el.nativeElement.style
        .setProperty('margin-left', this.calculateMargin(this.header.length, String(this.data).length) + 'rem')
      //console.warn(this.calculateMargin(this.header.length, String(this.data).length) + 'rem')
    }
  }

  //calculates margin to give to number respecting to header (scopus 23, etc)
  calculateMargin (headerLength: number, dataLength: number ) {
    const baseRem = 0.30 //base rem as for bootstrap m-... classes
    if (headerLength > dataLength)
      return floor((headerLength - dataLength + 1) / 2) * baseRem
    if (headerLength < dataLength) {
      //console.log(floor((dataLength - headerLength + 1) / 2) * (-1) * baseRem)
      return floor((dataLength - headerLength + 1) / 2) * (-1) * baseRem
    }
    //console.log('sdsd')
    return 0
  }

}


