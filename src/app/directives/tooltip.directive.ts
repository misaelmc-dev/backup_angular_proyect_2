import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
declare let $: any;

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  jq: any
  template: string
  @Input('texto') texto: string = ''
  @Input('colorClass') colorClass: string = ''

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    if(this.texto.length >200){
      this.texto = this.texto.slice(0,200)+'...';
    }
    this.jq= $(this.el.nativeElement);
    this.template =
      ((this.colorClass == 'success')
      ? `<div class="popover border-success" role=tooltip>`
      : ((this.colorClass == 'danger')
        ? `<div class="popover border-danger" role=tooltip>`
          : ((this.colorClass == 'warning')
          ? `<div class="popover border-warning" role=tooltip>`
            : `<div class="popover border-secondary" role=tooltip>`)))
    this.template += `
                        <div class="arrow">
                        </div>
                        <h3 class="popover-header bg-transparent text-white"></h3>
                        <div class="popover-body text-black justify-text">${this.texto}</div>
                      </div>`

    let datepickerReference = this.jq.tooltip({
      title: 'Título',
      html:true,
      template: this.template,
      trigger: 'hover'
    })
  }

  @HostListener('mouseover')
  mouseover() {

  }

}
