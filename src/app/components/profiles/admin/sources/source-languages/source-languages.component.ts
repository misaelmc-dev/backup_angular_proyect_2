import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LanguagesService} from "../../../../../services/languages.service";
import {SourcesService} from "../../../../../services/sources.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-source-languages',
  templateUrl: './source-languages.component.html',
  styleUrls: ['./source-languages.component.css']
})
export class SourceLanguagesComponent implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;
  @Input() metadata : any = [];


  listaItems:any[]=[];
  itemSeleccionado:number=0;
  itemsGuardados:boolean=false;

  loadingCount:number=0;

  constructor(public idiomasService: LanguagesService,
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
    this.idiomasService.getAllLanguages().subscribe((resLang: any) => {
      this.loadingCount--
      this.listaItems=resLang;
      for(let lct of this.listaItems){
        lct.accion="no agregado";
      }
      if(this.id!=0){
        this.obtenerItems();
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargarón los idiomas'});
      console.error(err)
    });
  }

  obtenerItems(){
    if(this.metadata.length!=0){
      //console.log("this.metadata",this.metadata)
      //console.log("this.metadata.idiomas",this.metadata.idiomas)
      if(this.metadata.idiomas.length!=0){
        for(let li of this.listaItems){
          for(let rci of this.metadata.idiomas){
            if(li.id==rci.id){
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
      if(lc.id==this.itemSeleccionado){
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
      if(lc.id==id){
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
      if(lc.accion=="agregar"){ this.asociarItemInvestigador(lc.id) }
      if(lc.accion=="eliminar"){ this.desasociarItemInvestigador(lc.id) }
    }
    this.salvar=0;
  }

  asociarItemInvestigador(id:number){
    this.loadingCount++
    this.fuentesService.addLanguageToSource(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció el idioma a la fuente'});
      console.error(err)
    });
  }

  desasociarItemInvestigador(id:number){
    this.loadingCount++
    this.fuentesService.removeLanguageToSource(this.id,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció el idioma a la fuente'});
      console.error(err)
    });
  }

}




