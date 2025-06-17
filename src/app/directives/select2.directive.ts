import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
declare let $: any;

@Directive({
  selector: '[appSelect2]'
})
export class Select2Directive {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    let jq = $(this.el.nativeElement);

    let datepickerReference = jq.select2();

  }
}
