import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SourceQuartilsService} from "../../../../../services/source-quartils.service";
import {SourceLifetimesService} from "../../../../../services/source-lifetimes.service";
import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: 'app-source-lifetimes',
  templateUrl: './source-lifetimes.component.html',
  styleUrls: ['./source-lifetimes.component.css']
})
export class SourceLifetimesComponent implements OnInit , OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;

  listaItems:any[]=[];
  listaAnios:any=[]
  itemsGuardados:boolean=false;

  v_id:number=0;
  v_anio:number=0;
  v_anio_save:number=0;
  v_scopus:boolean=false;
  v_scimago:boolean=false;
  v_woscc:boolean=false;
  v_jcr:boolean=false;
  v_scielo:boolean=false;
  v_conacyt:boolean=false;
  v_perm_scopus:boolean=false;
  v_perm_scimago:boolean=false;

  visualizar:boolean=false;

  similar_titulo_modal:string="";
  similar_btn_modal:string="";

  datosVigencia:any=[];

  pageNumber:number=1;
  totalItems:number=0;

  loadingCount:number=0;

  constructor(public quartilesService: SourceQuartilsService,
              public vigenciasService: SourceLifetimesService) { }


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
      this.vigenciasService.getLifetimesBySouerce(this.id,this.pageNumber).subscribe((resConsulta: any) => {
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
        this.listaItems = this.listaItems.sort((a,b)=>b.year-a.year);
        //console.log("this.listaItems",this.listaItems)
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las vigencias de la fuente'});
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
      this.similar_titulo_modal="Agregar una vigencia";
      this.similar_btn_modal="nuevo";
      this.v_id=0;
      this.v_anio=0;
      this.v_anio_save=0;
      this.v_scopus=false;
      this.v_scimago=false;
      this.v_woscc=false;
      this.v_jcr=false;
      this.v_scielo=false;
      this.v_conacyt=false;
      this.v_perm_scopus=false;
      this.v_perm_scimago=false;
      this.datosVigencia=[];
      this.visualizar=true;
    }else if(accion=='agregar'){
      this.agregarItem();
      this.visualizar=false;
    }else if(accion=='editar'){
      this.getListaAnios();
      this.similar_titulo_modal="Editar una vigencia";
      this.similar_btn_modal="editar";
      this.v_id=item.id;
      this.v_anio=item.year;
      this.v_anio_save=item.year;
      if(item.scopus==null){ this.v_scopus=false; }else{ this.v_scopus=item.scopus; }
      if(item.scimago==null){ this.v_scimago=false; }else{ this.v_scimago=item.scimago; }
      if(item.woscc==null){ this.v_woscc=false; }else{ this.v_woscc=item.woscc; }
      if(item.jcr==null){ this.v_jcr=false; }else{ this.v_jcr=item.jcr; }
      if(item.scielo==null){ this.v_scielo=false; }else{ this.v_scielo=item.scielo; }
      if(item.conacyt==null){ this.v_conacyt=false; }else{ this.v_conacyt=item.conacyt; }
      if(item.allow_scopus_modification==null){ this.v_perm_scopus=false; }else{ this.v_perm_scopus=item.allow_scopus_modification; }
      if(item.allow_scimago_modification==null){ this.v_perm_scimago=false; }else{ this.v_perm_scimago=item.allow_scimago_modification; }
      this.visualizar=true;
    }else if(accion=='actualizar'){
      this.actualizarItem();
      this.visualizar=false;
    }else if(accion=='ver'){
      this.similar_titulo_modal="Ver información de la vigencia";
      this.similar_btn_modal="ver";
      this.datosVigencia=item;
      this.visualizar=true;
    }else if(accion=='limpiar'){
      this.similar_titulo_modal="";
      this.similar_btn_modal="";
      this.visualizar=false;
      this.v_id=0;
      this.v_anio=0;
      this.v_anio_save=0;
      this.v_scopus=false;
      this.v_scimago=false;
      this.v_woscc=false;
      this.v_jcr=false;
      this.v_scielo=false;
      this.v_conacyt=false;
      this.v_perm_scopus=false;
      this.v_perm_scimago=false;
      this.datosVigencia=[];
    }
  }

  getListaAnios() {
    this.listaAnios=[];
    let anio:any = moment(new Date(), 'yyyy').format('yyyy');
    this.listaAnios = [(anio - 1)+2, (anio - 1)+1, anio - 1, anio - 2, anio - 3, anio - 4, anio - 5, anio - 6, anio - 7, anio - 8, anio - 9, anio - 10];
    for(let li of this.listaItems){
      this.listaAnios = this.listaAnios.filter((item:number) => item != li.year);
    }
  }

  agregarItem(){
    const fecha = moment(new Date(), 'DD-MM-yyyy').format('yyyyMMDDhhmmss');
    this.listaItems.push({
      "id":fecha,
      "year":this.v_anio,
      "scopus": this.v_scopus,
      "scimago": this.v_scimago,
      "woscc": this.v_woscc,
      "jcr": this.v_jcr,
      "scielo": this.v_scielo,
      "conacyt": this.v_conacyt,
      "allow_scopus_modification": this.v_perm_scopus,
      "allow_scimago_modification": this.v_perm_scimago,
      "accion":"nuevo"});
    this.listaAnios = this.listaAnios.filter((item:number) => item != this.v_anio);
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
      if(lc.id==this.v_id){
        if(lc.accion=="agregado"){
          lc.accion="editar";
          lc.year=this.v_anio;
          lc.scopus=this.v_scopus;
          lc.scimago=this.v_scimago;
          lc.woscc=this.v_woscc;
          lc.jcr=this.v_jcr;
          lc.scielo=this.v_scielo;
          lc.conacyt=this.v_conacyt;
          lc.allow_scopus_modification=this.v_perm_scopus;
          lc.allow_scimago_modification=this.v_perm_scimago;
        }else{
          lc.year=this.v_anio;
          lc.scopus=this.v_scopus;
          lc.scimago=this.v_scimago;
          lc.woscc=this.v_woscc;
          lc.jcr=this.v_jcr;
          lc.scielo=this.v_scielo;
          lc.conacyt=this.v_conacyt;
          lc.allow_scopus_modification=this.v_perm_scopus;
          lc.allow_scimago_modification=this.v_perm_scimago;
        }
      }
    }
    //console.log("this.listaItems",this.listaItems)
  }

  guardarCambios(){
    for(let lc of this.listaItems){
      if(lc.accion=="nuevo"){
        this.asociarQuartilFuente(
          lc.year,
          lc.scopus,
          lc.scimago,
          lc.woscc,
          lc.jcr,
          lc.scielo,
          lc.conacyt,
          lc.allow_scopus_modification,
          lc.allow_scimago_modification
        )
      }
      if(lc.accion=="editar"){
        this.actualizarQuartilFuente(
          lc.id,
          lc.year,
          lc.scopus,
          lc.scimago,
          lc.woscc,
          lc.jcr,
          lc.scielo,
          lc.conacyt,
          lc.allow_scopus_modification,
          lc.allow_scimago_modification
        )
      }
      if(lc.accion=="eliminar"){ this.desasociarQuartilFuente(lc.id) }
    }
    this.salvar=0;
  }

  asociarQuartilFuente(year:number,scopus:boolean,scimago:boolean,woscc:boolean,jcr:boolean,scielo:boolean,conacyt:boolean,allow_scopus_modification:boolean,allow_scimago_modification:boolean){
    this.loadingCount++
    this.vigenciasService.addLifetimesToSource(this.id,year).subscribe((res:any) => {
      this.loadingCount--
      this.actualizarQuartilFuente(res,year,scopus,scimago,woscc,jcr,scielo,conacyt,allow_scopus_modification,allow_scimago_modification);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció la vigencia a la fuente'});
      console.error(err)
    });
  }

  actualizarQuartilFuente(
    id:number,
    year:number,
    scopus:boolean,
    scimago:boolean,
    woscc:boolean,
    jcr:boolean,
    scielo:boolean,
    conacyt:boolean,
    allow_scopus_modification:boolean,
    allow_scimago_modification:boolean
  ){
    this.loadingCount++
    this.vigenciasService.updateLifetimesToSource(
      id,
      year,
      scopus,
      scimago,
      woscc,
      jcr,
      scielo,
      conacyt,
      allow_scopus_modification,
      allow_scimago_modification
    ).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se aztualizo la vigencia de la fuente'});
      console.error(err)
    });
  }

  desasociarQuartilFuente(id:number){
    this.loadingCount++
    this.vigenciasService.removeLifetimesToSource(id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció la vigencia a la fuente'});
      console.error(err)
    });
  }

  cambiarPagina(valor:number){
    this.pageNumber=valor;
    this.obtenerItems();
  }

}




