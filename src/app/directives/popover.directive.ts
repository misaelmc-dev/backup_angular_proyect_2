import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
declare let $: any;

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    let jq = $(this.el.nativeElement);

    let datepickerReference = jq.popover({
      html:true
    })

  }

}
