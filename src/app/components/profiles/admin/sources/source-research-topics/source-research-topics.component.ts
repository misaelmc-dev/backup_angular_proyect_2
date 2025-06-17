import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SchoolsService} from "../../../../../services/schools.service";
import {SourcesService} from "../../../../../services/sources.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-source-research-topics',
  templateUrl: './source-research-topics.component.html',
  styleUrls: ['./source-research-topics.component.css']
})
export class SourceResearchTopicsComponent implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;
  @Input() metadata : any = [];

  listaItems:any[]=[];
  itemSeleccionado:any="";
  itemsGuardados:boolean=false;

  loadingCount:number=0;

  constructor(public colegiosService: SchoolsService,
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
    this.fuentesService.getAllResearchTopics().subscribe((resConsultaTotal: any) => {
      this.loadingCount--
      this.listaItems=resConsultaTotal;
      for(let lct of this.listaItems){
        lct.accion="no agregado";
      }
      if(this.id!=0){
        this.obtenerItems();
      }
      //console.log("this.listaItems",this.listaItems);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargarón los research topics'});
      console.error(err)
    });
  }

  obtenerItems(){
    if(this.metadata.length!=0){
      //console.log("this.metadata",this.metadata)
      //console.log("this.metadata.research_topics",this.metadata.research_topics)
      if(this.metadata.research_topics.length!=0){
        for(let li of this.listaItems){
          for(let rci of this.metadata.research_topics){
            if(li.topic==rci.topic){
              li.accion="agregado";
              li.id=rci.id;
            }
          }
        }
        this.itemsGuardados=true;
      }
    }
    //console.log("this.listaItems",this.listaItems)
  }

  agregarItem(){
    //console.log("this.itemSeleccionado",this.itemSeleccionado.toString())
    let flag:number=0;
    for(let lc of this.listaItems){
      if(lc.topic==this.itemSeleccionado.toString()){
        flag++
        if(lc.accion=="eliminar"){
          lc.accion="agregado";
        }else{
          lc.accion="agregar";
        }
      }
    }
    if(flag==0){
      this.listaItems.push({
      "topic":this.itemSeleccionado.toString(),
      "id_scimago":0,
      "id_scimago_area":0,
      "accion":"agregar"})
    }
    this.itemSeleccionado="";
    console.log("this.listaItems",this.listaItems)
  }

  removerItem(id:any){
    for(let lc of this.listaItems){
      if(lc.topic==id){
        if(lc.accion=="agregado"){
          lc.accion="eliminar";
        }else{
          lc.accion="no agregado";
        }
      }
    }
    this.itemSeleccionado="";
  }

  guardarCambios(){
    for(let lc of this.listaItems){
      if(lc.accion=="agregar"){ this.asociarItemInvestigador(lc.topic,lc.id_scimago,lc.id_scimago_area) }
      if(lc.accion=="eliminar"){ this.desasociarItemInvestigador(lc.id) }
    }
    this.salvar=0;
  }

  asociarItemInvestigador(topic:string,simago:number,area:number){
    this.loadingCount++
    this.fuentesService.addResearchTopicToSource(this.id,topic,simago,area).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asoció el topic a la fuente'});
      console.error(err)
    });
  }

  desasociarItemInvestigador(id:number){
    //console.log("idSource",id)
    this.loadingCount++
    this.fuentesService.removeResearchTopicToSource(id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasoció el topic a la fuenter'});
      console.error(err)
    });
  }

}



