import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-filtro-avanzado',
  templateUrl: './filtro-avanzado.component.html',
  styleUrls: ['./filtro-avanzado.component.css']
})
export class FiltroAvanzadoComponent implements OnInit, OnChanges {

  //parámtros externos
  @Input() textoSinFiltroSeleccionado:string = 'Selecciona...'
  @Input() optionStringSize: number = 30;
  @Input() searchBarPlaceholder: string = 'Buscar...';
  @Input() pageSize: number = 25
  @Input() minCharactersToSearch = 3;
  @Input() iconFilter: string = 'fal fa-save';
  @Input() update: number = 0;
  @Input() dataLoadFunction = function (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                               loadingItems: boolean[], totalItems: number[])
  {
    lista = [{"id":1,"texto":'Test1'},{"id":2,"texto":'Test2'}];
  }
  @Output() backFilter = new EventEmitter<number>();

  //parámetros internos
  totalItems : number[] = [0]
  currentPage : number = 1
  loadingItems :boolean[] = [false]
  lista : any = []
  lista1 : any = [{"id":1,"texto":'Test1'}];
  campoBusquedaFiltro : string = ''
  showFiltro : boolean = false
  opcionSeleccionada : number = 0
  lastSearchFieldTextLength : number = 0
  filtroSelecionado : boolean = false

  constructor() { }

  ngOnInit(): void {
    this.loadData()
  }

  ngOnChanges(changes:SimpleChanges): void {
    //console.log("changes",changes);
    if(changes.update){
      if(changes.update.currentValue>0){
        this.loadData()
      }else if(changes.update.currentValue==0){
        this.loadDataClean()
        this.opcionSeleccionada = 0
      }
    }
  }

  buscarListaFiltro(){
    if (this.campoBusquedaFiltro.length >= this.minCharactersToSearch || this.campoBusquedaFiltro == '') {
      this.loadData()
    }
  }

  loadData() {
    this.lista = [];
    this.currentPage = 1;
    this.dataLoadFunction(this.pageSize, this.currentPage, this.campoBusquedaFiltro, this.lista,
      this.loadingItems, this.totalItems)
  }

  loadDataClean() {
    this.campoBusquedaFiltro = "";
    this.opcionSeleccionada = 0;
    this.showFiltro = false;
    this.loadData()
  }

  seleccionarFiltro(optionIndex :number){
    this.showFiltro = false;
    this.opcionSeleccionada = optionIndex;
    //console.log("optionIndex",optionIndex);
    this.backFilter.emit(optionIndex)
    //console.warn('showFiltro: ' +this.showFiltro)
  }

  loadMoreItems() {
    //console.warn('loadMoreItems')
    //console.warn('totalitems: ' + this.totalItems[0] + ' pageSize: ' + this.pageSize + ' currentPage: ' + this.currentPage);
    const height = document.getElementById("filtro").scrollHeight-184;
    const avanceScroll = Math.round(document.getElementById("filtro").scrollTop);
    //console.warn("avanceScroll",avanceScroll,"height",height)
    if(avanceScroll>=height){
      if((this.currentPage)<(this.totalItems[0]/this.pageSize)){
        this.currentPage++
        this.loadingItems[0]=true;
        this.dataLoadFunction(this.pageSize, this.currentPage, this.campoBusquedaFiltro, this.lista,
          this.loadingItems, this.totalItems)
      }
    }
  }

  /*
  filtro3DataLoad = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                     loadingItems: boolean[], totalItems: number[]) =>
  {
    this.studentsService.getAllStudents(currentPage,pageSize, searchTerm).subscribe((resAlum: any) => {
      for (let item of resAlum.data){
        lista.push(item.nombre);
      }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resAlum.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los alumnos'});
      console.error(err)
    });
  }
  */
}
