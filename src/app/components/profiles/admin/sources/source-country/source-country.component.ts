import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CountriesService} from "../../../../../services/countries.service";
import {SourcesService} from "../../../../../services/sources.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-source-country',
  templateUrl: './source-country.component.html',
  styleUrls: ['./source-country.component.css']
})
export class SourceCountryComponent  implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;
  @Input() metadata : any = [];

  listaItems:any[]=[];
  itemSeleccionado:number=0;
  itemsGuardados:boolean=false;

  loadingCount:number=0;

  constructor(public paisesService: CountriesService,
              public fuentesService: SourcesService) { }

  ngOnInit(): void {
    this.obtenerTodosItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.salvar!=0){
      this.guardarCambios()
    }else{
      this.obtenerTodosItems()
    }
  }

  obtenerTodosItems(){
    this.listaItems=[];
    this.loadingCount++
    this.paisesService.getAllCountries().subscribe((resConsultaTotal: any) => {
      this.loadingCount--
      this.listaItems=resConsultaTotal;
      for(let lct of this.listaItems){
        lct.accion="no agregado";
      }
      if(this.id!=0){
        this.obtenerItems();
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargarón los paises'});
      console.error(err)
    });
  }

  obtenerItems(){
    if(this.metadata.length!=0){
      //console.log("this.metadata",this.metadata)
      //console.log("this.metadata.idiomas",this.metadata.idiomas)
      if(this.metadata.paises.length!=0){
        for(let li of this.listaItems){
          for(let rci of this.metadata.paises){
            if(li.ISO_3166_1_num==rci.ISO_3166_1_num){
              li.accion="agregado";
            }
          }
        }
        this.itemsGuardados=true;
      }
    }
    //console.log("this.listaItems",this.listaItems)
  }

  agregarItem(){
    for(let lc of this.listaItems){
      if(lc.ISO_3166_1_num==this.itemSeleccionado){
        if(lc.accion=="eliminar"){
          lc.accion="agregado";
        }else{
          lc.accion="agregar";
        }
      }
    }
    this.itemSeleccionado=0;
  }

  removerItem(id:any){
    for(let lc of this.listaItems){
      if(lc.ISO_3166_1_num==id){
        if(lc.accion=="agregado"){
          lc.accion="eliminar";
        }else{
          lc.accion="no agregado";
        }
      }
    }
    this.itemSeleccionado=0;
  }

  guardarCambios(){
    for(let lc of this.listaItems){
      if(lc.accion=="agregar"){ this.asociarItemInvestigador(lc.ISO_3166_1_num) }
      if(lc.accion=="eliminar"){ this.desasociarItemInvestigador(lc.ISO_3166_1_num) }
    }
    this.salvar=0;
  }

  asociarItemInvestigador(id:number){
    this.loadingCount++
    this.fuentesService.addCountryToSource(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció el pais a la fuente'});
      console.error(err)
    });
  }

  desasociarItemInvestigador(id:number){
    this.loadingCount++
    this.fuentesService.removeCountryToSource(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció el pais a la fuente'});
      console.error(err)
    });
  }

}




