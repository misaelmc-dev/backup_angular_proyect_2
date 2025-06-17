import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SniAreasService} from "../../../../../services/sni-areas.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-investigator-sni-areas',
  templateUrl: './investigator-sni-areas.component.html',
  styleUrls: ['./investigator-sni-areas.component.css']
})
export class InvestigatorSniAreasComponent implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;

  listaItems:any[]=[];
  itemSeleccionado:number=0;
  permisoAgregar:boolean=false;

  loadingCount:number=0;

  constructor(public sniAreasService: SniAreasService) { }

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
    this.sniAreasService.getAllAreas().subscribe((resConsultaTotal: any) => {
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
      Swal.fire({icon: 'error',text: 'No se cargarón las areas sni'});
      console.error(err)
    });
  }

  obtenerItems(){
    this.loadingCount++
    this.sniAreasService.getAreasByInvestigator(this.id).subscribe((resConsultaInv: any) => {
      this.loadingCount--
      for(let li of this.listaItems){
        for(let rci of resConsultaInv){
          if(li.id==rci.id){
            li.accion="agregado";
          }
        }
      }
      if(resConsultaInv.length>=1){ this.permisoAgregar=true; }
      if(resConsultaInv.length==0){ this.permisoAgregar=false; }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las areas sni del investigador'});
      console.error(err)
    });
  }

  agregarItem(){
    for(let lc of this.listaItems){
      if(lc.id==this.itemSeleccionado){
        if(lc.accion=="eliminar"){
          lc.accion="agregado";
        }else{
          lc.accion="agregar";
        }
      }
    }
    this.itemSeleccionado=0;
    this.permisoAgregar=true;
  }

  removerItem(id:any){
    for(let lc of this.listaItems){
      if(lc.id==id){
        if(lc.accion=="agregado"){
          lc.accion="eliminar";
        }else{
          lc.accion="no agregado";
        }
      }
    }
    this.itemSeleccionado=0;
    this.permisoAgregar=false;
  }

  guardarCambios(){
    for(let lc of this.listaItems){
      if(lc.accion=="agregar"){ this.asociarItemInvestigador(lc.id) }
      if(lc.accion=="eliminar"){ this.desasociarItemInvestigador(lc.id) }
    }
    this.salvar=0;
  }

  asociarItemInvestigador(id:number){
    this.loadingCount++
    this.sniAreasService.addAreaToInvestigador(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció el area sni al investigador'});
      console.error(err)
    });
  }

  desasociarItemInvestigador(id:number){
    this.loadingCount++
    this.sniAreasService.removeAreaToInvestigador(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció el area sni del investigador'});
      console.error(err)
    });
  }

}
