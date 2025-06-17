import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-filtro-checkbox',
  templateUrl: './filtro-checkbox.component.html',
  styleUrls: ['./filtro-checkbox.component.css']
})
export class FiltroCheckboxComponent implements OnInit, OnChanges {

  @Input() placeholder: string = 'Solo con'
  @Input() iconFilter : string = 'fal fa-save'
  //Valor asignable como elemento id
  @Input() numberOption : number = 1
  @Input() update : number = 1;
  @Output() backFilter = new EventEmitter<boolean>();

  checked :boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges): void {
    //console.log("changes",changes.cleanFilter.currentValue);
    if(changes.update){
      if(changes.update.currentValue==0){
        this.checked = false;
        //this.backClean.emit(false)
      }
    }
  }

  cambiarFiltroPositivo(valor:boolean){
    this.checked = valor;
    this.backFilter.emit(this.checked)
  }

  cambiarFiltroNegativo(valor:boolean){
    this.checked = valor;
    this.backFilter.emit(this.checked)
  }

}
