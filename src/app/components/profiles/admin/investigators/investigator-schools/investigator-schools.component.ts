import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SchoolsService} from "../../../../../services/schools.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-investigator-schools',
  templateUrl: './investigator-schools.component.html',
  styleUrls: ['./investigator-schools.component.css']
})
export class InvestigatorSchoolsComponent  implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;
  @Input() idInstitucion = 0;
  @Output() backNotList = new EventEmitter<boolean>();

  listaItems:any[]=[];
  itemSeleccionado:number=0;
  itemsGuardados:boolean=false;

  loadingCount:number=0;

  constructor(public colegiosService: SchoolsService) { }

  ngOnInit(): void {
    this.obtenerTodosItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.salvar!=0){
      this.guardarCambios()
    }else{
      this.obtenerTodosItems()
    }
    if(this.idInstitucion!=0){
      this.desabilitarGuardado();
    }
  }

  obtenerTodosItems(){
    this.listaItems=[];
    this.loadingCount++
    this.colegiosService.getSchoolsList().subscribe((resConsultaTotal: any) => {
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
      Swal.fire({icon: 'error',text: 'No se cargarón los colegios'});
      console.error(err)
    });
  }

  obtenerItems(){
    this.loadingCount++
    this.colegiosService.getSchoolsByInvestigador(this.id).subscribe((resConsultaInv: any) => {
      this.loadingCount--
      for(let li of this.listaItems){
        for(let rci of resConsultaInv){
          if(li.id==rci.id){
            li.accion="agregado";
          }
        }
      }
      if(resConsultaInv.length!=0){ this.itemsGuardados=true;}
      this.desabilitarGuardado();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los colegios del investigador'});
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
    this.desabilitarGuardado();
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
    this.desabilitarGuardado();
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
    this.colegiosService.addSchoolsToInvestigador(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció el colegio al investigador'});
      console.error(err)
    });
  }

  desasociarItemInvestigador(id:number){
    this.loadingCount++
    this.colegiosService.removeSchoolsToInvestigador(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció el colegio al investigador'});
      console.error(err)
    });
  }

  desabilitarGuardado(){
    var itemDisabled = false;
    for(let item of this.listaItems){
      if(item.accion=="agregado" || item.accion=="agregar"){
        if(item.id_institucion!=this.idInstitucion){
          itemDisabled = true;
        }
      }
    }
    this.backNotList.emit(itemDisabled)
  }

}






