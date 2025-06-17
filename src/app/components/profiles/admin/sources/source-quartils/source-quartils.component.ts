import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SourceQuartilsService} from "../../../../../services/source-quartils.service";
import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: 'app-source-quartils',
  templateUrl: './source-quartils.component.html',
  styleUrls: ['./source-quartils.component.css']
})
export class SourceQuartilsComponent implements OnInit , OnChanges{

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;

  listaItems:any[]=[];
  listaAnios:any=[]
  itemsGuardados:boolean=false;

  q_id:number=0;
  q_anio:number=0;
  q_anio_save:number=0;
  q_scintra:string="";
  q_scimago:string="";
  visualizar:boolean=false;

  similar_titulo_modal:string="";
  similar_btn_modal:string="";

  datosQuartil:any=[];

  pageNumber:number=1;
  totalItems:number=0;

  loadingCount:number=0;

  constructor(public quartilesService: SourceQuartilsService) { }


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
    if(this.id!=0){
      this.listaItems=[];
      this.totalItems=0;
      this.loadingCount++
      this.quartilesService.getQuartilesBySouerce(this.id,this.pageNumber).subscribe((resConsulta: any) => {
        this.loadingCount--
        if(resConsulta.data.length!=0){
          this.listaItems=resConsulta.data;
          this.totalItems=resConsulta.total;
          for(let li of this.listaItems){
            li.accion="agregado";
          }
        }else{
          this.listaItems=[];
          this.totalItems=0;
          this.pageNumber=1;
        }
        //console.log("this.listaItems",this.listaItems)
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los quartiles'});
        console.error(err)
      });
    }else{
      this.listaItems=[];
      this.totalItems=0;
      this.pageNumber=1;
    }
  }

  mostrar(accion:string,item?:any){
    if(accion=='nuevo'){
      this.getListaAnios();
      this.similar_titulo_modal="Agregar un cuartil";
      this.similar_btn_modal="nuevo";
      this.q_id=0;
      this.q_anio=0;
      this.q_anio_save=0;
      this.q_scintra="";
      this.q_scimago="";
      this.datosQuartil=[];
      this.visualizar=true;
    }else if(accion=='agregar'){
      this.agregarItem();
      this.visualizar=false;
    }else if(accion=='editar'){
      this.getListaAnios();
      this.similar_titulo_modal="Editar cuartil";
      this.similar_btn_modal="editar";
      this.q_id=item.id;
      this.q_anio=item.anio;
      this.q_anio_save=item.anio;
      this.q_scintra=item.cuartil_scintra;
      this.q_scimago=item.cuartil_scimago;
      this.visualizar=true;
    }else if(accion=='actualizar'){
      this.actualizarItem();
      this.visualizar=false;
    }else if(accion=='ver'){
      this.similar_titulo_modal="Ver cuartil";
      this.similar_btn_modal="ver";
      this.datosQuartil=item;
      this.visualizar=true;
    }else if(accion=='limpiar'){
      this.similar_titulo_modal="";
      this.similar_btn_modal="";
      this.visualizar=false;
      this.q_id=0;
      this.q_anio=0;
      this.q_scintra="";
      this.q_scimago="";
      this.datosQuartil=[];
    }
  }

  getListaAnios() {
    this.listaAnios=[];
    let anio:any = moment(new Date(), 'yyyy').format('yyyy');
    this.listaAnios = [(anio - 1)+2, (anio - 1)+1, anio - 1, anio - 2, anio - 3, anio - 4, anio - 5, anio - 6, anio - 7, anio - 8, anio - 9, anio - 10];
    for(let li of this.listaItems){
      this.listaAnios = this.listaAnios.filter((item:number) => item != li.anio);
    }
  }

  agregarItem(){
    const fecha = moment(new Date(), 'DD-MM-yyyy').format('yyyyMMDDhhmmss');
    this.listaItems.push({"id":fecha,"anio":this.q_anio,"cuartil_scintra": this.q_scintra,"cuartil_scimago":this.q_scimago,"accion":"nuevo"});
    this.listaAnios = this.listaAnios.filter((item:number) => item != this.q_anio);
  }

  removerItem(id:any){
    for(let lc of this.listaItems){
      if(lc.id==id){
        if(lc.accion=="agregado" || lc.accion=="editar"){
          lc.accion="eliminar";
        }else{
          this.listaItems = this.listaItems.filter(item => item.id === id)
        }
      }
    }
    //console.log("this.listaItems",this.listaItems)
  }

  actualizarItem(){
    for(let lc of this.listaItems){
      if(lc.id==this.q_id){
        if(lc.accion=="agregado"){
          lc.accion="editar";
          lc.anio=this.q_anio;
          lc.cuartil_scintra=this.q_scintra;
          lc.cuartil_scimago=this.q_scimago;
        }else{
          lc.anio=this.q_anio;
          lc.cuartil_scintra=this.q_scintra;
          lc.cuartil_scimago=this.q_scimago;
        }
      }
    }
    //console.log("this.listaItems",this.listaItems)
  }

  guardarCambios(){
    for(let lc of this.listaItems){
      if(lc.accion=="nuevo"){ this.asociarQuartilFuente(lc.anio,lc.cuartil_scintra,lc.cuartil_scimago) }
      if(lc.accion=="editar"){ this.actualizarQuartilFuente(lc.id,lc.anio,lc.cuartil_scintra,lc.cuartil_scimago) }
      if(lc.accion=="eliminar"){ this.desasociarQuartilFuente(lc.id) }
    }
    this.salvar=0;
  }

  asociarQuartilFuente(anio:number,q_scintra:string,q_scimago:string){
    this.loadingCount++
    this.quartilesService.addQuartilToSource(this.id,anio,q_scintra,q_scimago).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció el cuartil a la fuente'});
      console.error(err)
    });
  }

  actualizarQuartilFuente(id:number,anio:number,q_scintra:string,q_scimago:string){
    this.loadingCount++
    this.quartilesService.updateQuartilToSource(id,anio,q_scintra,q_scimago).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se aztualizo el cuartil de la fuente'});
      console.error(err)
    });
  }

  desasociarQuartilFuente(id:number){
    this.loadingCount++
    this.quartilesService.removeQuartilToSource(id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció el cuartil a la fuente'});
      console.error(err)
    });
  }

  cambiarPagina(valor:number){
    this.pageNumber=valor;
    this.obtenerItems();
  }

}



