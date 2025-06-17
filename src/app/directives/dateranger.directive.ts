import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
declare let $: any;
import * as moment from "moment";

@Directive({
  selector: '[appDateranger]'
})
export class DaterangerDirective {
  @Output('cambioFecha') change: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {}


  ngAfterViewInit() {
    let jq = $(this.el.nativeElement);
    let directiveReference = this; //referencia de angular a la directiva

    var controls = {
      leftArrow: '<i class="fal fa-angle-left" style="font-size: 1.25rem"></i>',
      rightArrow: '<i class="fal fa-angle-right" style="font-size: 1.25rem"></i>'
    }

    $.fn.datepicker.dates['es'] = {
      days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
      months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: "Hoy",
      clear: "Limpiar",
      format: "dd-mm-yyyy",
      titleFormat: "MM yyyy",
      weekStart: 0
    }

    let datepickerReference = jq.datepicker({
      language: 'es',
      todayHighlight: true,
      orientation: "top right",
      templates: controls,
    })

    datepickerReference.on('changeDate', function () {
      //console.log('evento disparado desde jquery')
      //jq.trigger('change')
      let dateString = datepickerReference.val()
      directiveReference.change.emit(dateString)
    })
  }

}
