import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SourcesService} from "../../../../../services/sources.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-source-similar',
  templateUrl: './source-similar.component.html',
  styleUrls: ['./source-similar.component.css']
})
export class SourceSimilarComponent implements OnInit , OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;
  @Input() metadata:any = [];

  listaItems:any[]=[];
  listaItemsFiltrados:any[]=[];
  itemSeleccionado:number=0;
  itemsGuardados:boolean=false;

  criterioBusqueda:string="";
  similitud:any="";
  visualizar:boolean=false;

  similar_titulo_modal:string="";
  similar_btn_modal:string="";

  datosFuente:any=[];

  pageNumber:number=1;
  loadingCount:number=0;

  constructor(public fuentesService: SourcesService) { }

  ngOnInit(): void {
    this.obtenerItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.salvar!=0){
      this.guardarCambios()
    }else{
      this.obtenerItems()
    }
  }

  obtenerItems(){
    if(this.metadata.length!=0){
      if(this.metadata.fuentes_similares.length!=0){
        this.obtenerTodosItems(this.metadata.fuentes_similares)
      }
    }
  }

  obtenerTodosItems(items:any){
    this.itemsGuardados=true;
    let idsFuentesGuardadas = items.map((value: any) => value.pivot.id_fuente_similar)
    this.loadingCount++
    this.fuentesService.getSourcesByIds(idsFuentesGuardadas).subscribe((resConsultaSourceSave: any) => {
      this.loadingCount--
      this.listaItems=resConsultaSourceSave;
      for(let li of this.listaItems){
        li.accion="agregado";
        for(let i of items){
          if(li.id==i.id){
            li.similarity=i.pivot.similarity;
          }
        }
      }
      //console.log("this.listaItems",this.listaItems)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fuentes'});
      console.error(err)
    });
  }

  buscarItems(){
    this.loadingCount++
    this.fuentesService.getSourceSearch(this.criterioBusqueda).subscribe((resSearchSource: any) => {
      this.loadingCount--
      //console.log("resSearchSource",resSearchSource)
      this.listaItemsFiltrados=resSearchSource;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los paises de la fuente'});
      console.error(err)
    });
  }

  mostrar(accion:string,item?:any){
    if(accion=='nuevo'){
      this.similar_titulo_modal="Agregar una fuente similar";
      this.similar_btn_modal="nuevo";
      this.visualizar=true;
      this.itemSeleccionado=0;
      this.criterioBusqueda="";
      this.similitud="";
      this.listaItemsFiltrados=[];
    }else if(accion=='agregar'){
      this.agregarItem();
      this.visualizar=false;
    }else if(accion=='editar'){
      this.similar_titulo_modal="Editar fuente similar";
      this.similar_btn_modal="editar";
      this.visualizar=true;
      this.itemSeleccionado=0;
      this.criterioBusqueda="";
      this.similitud="";
      this.listaItemsFiltrados=[];
    }else if(accion=='actualizar'){
      this.visualizar=false;
    }else if(accion=='ver'){
      this.similar_titulo_modal="Ver fuente similar";
      this.similar_btn_modal="ver";
      this.datosFuente=item;
      this.visualizar=true;
    }else if(accion=='limpiar'){
      this.similar_titulo_modal="";
      this.similar_btn_modal="";
      this.datosFuente=[];
      this.visualizar=false;
    }
  }

  agregarItem(){
    for(let li of this.listaItemsFiltrados){
      if(li.id==this.itemSeleccionado){
        li.accion="nuevo";
        li.similarity=this.similitud/100;
        this.listaItems.push(li);
      }
    }
    //console.log("this.listaItems",this.listaItems)
    this.itemSeleccionado=0;
  }

  removerItem(id:any){
    for(let lc of this.listaItems){
      if(lc.id==id){
        if(lc.accion=="agregado"){
          lc.accion="eliminar";
        }else{
          this.listaItems = this.listaItems.filter(item => item.id === id)
        }
      }
    }
    //console.log("this.listaItems",this.listaItems)
    this.itemSeleccionado=0;
  }

  guardarCambios(){
    for(let lc of this.listaItems){
      if(lc.accion=="nuevo"){ this.asociarSimilarFuenteFuente(lc.id,lc.similarity) }
      if(lc.accion=="eliminar"){ this.desasociarSimilarFuenteFuente(lc.id) }
    }
    this.salvar=0;
  }

  asociarSimilarFuenteFuente(id:number,similitud:number){
    this.loadingCount++
    this.fuentesService.addSimilarSourceToSource(this.id,id,similitud).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció la fuente similar a la fuente'});
      console.error(err)
    });
  }

  desasociarSimilarFuenteFuente(id:number){
    this.loadingCount++
    this.fuentesService.removeSimilarSourceToSource(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció la fuente similar a la fuente'});
      console.error(err)
    });
  }

}



