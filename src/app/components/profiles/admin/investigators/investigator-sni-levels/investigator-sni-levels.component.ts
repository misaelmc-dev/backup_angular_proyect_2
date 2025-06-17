import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SniLevelsService} from "../../../../../services/sni-levels.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-investigator-sni-levels',
  templateUrl: './investigator-sni-levels.component.html',
  styleUrls: ['./investigator-sni-levels.component.css']
})
export class InvestigatorSniLevelsComponent  implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;

  listaItems:any[]=[];
  itemSeleccionado:number=0;
  permisoAgregar:boolean=false;

  loadingCount:number=0;

  constructor(public sniLevelsService: SniLevelsService) { }

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
    this.sniLevelsService.getAllLevels().subscribe((resConsultaTotal: any) => {
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
      Swal.fire({icon: 'error',text: 'No se cargarón los niveles sni'});
      console.error(err)
    });
  }

  obtenerItems(){
    this.loadingCount++
    this.sniLevelsService.getLevelsByInvestigator(this.id).subscribe((resConsultaInv: any) => {
      this.loadingCount--
      for(let li of this.listaItems){
        for(let rci of resConsultaInv){
          if(li.id==rci.id){ li.accion="agregado"; }
        }
      }
      if(resConsultaInv.length>=1){ this.permisoAgregar=true; }
      if(resConsultaInv.length==0){ this.permisoAgregar=false; }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los niveles sni del investigador'});
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
    this.obtenerTodosItems();
  }

  asociarItemInvestigador(id:number){
    this.loadingCount++
    this.sniLevelsService.addLevelToInvestigador(this.id,id).subscribe((addItem: any) => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció el nivel sni al investigador'});
      console.error(err)
    });
  }

  desasociarItemInvestigador(id:number){
    this.loadingCount++
    this.sniLevelsService.removeLevelToInvestigador(this.id,id).subscribe((rmvItem: any) => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció el nivel sni del investigador'});
      console.error(err)
    });
  }

}
