import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SourceHistoryService} from "../../../../../services/source-history.service";
import {SourceLifetimesService} from "../../../../../services/source-lifetimes.service";
import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: 'app-source-history',
  templateUrl: './source-history.component.html',
  styleUrls: ['./source-history.component.css']
})
export class SourceHistoryComponent implements OnInit , OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;

  listaItems:any[]=[];
  listaAnios:any=[]
  itemsGuardados:boolean=false;

  id_history:any=0;
  year:any=0;
  year_save:any=0;
  sjr:any=0;
  docs:any=0;
  cites_last_3_years:any=0;
  self_cites_last_3_years:any=0;
  cited_docs_ratio_last_3_years:any=0;
  uncited_docs_ratio_last_3_years:any=0;
  citable_docs_ratio_last_3_years:any=0;
  non_citable_docs_ratio_last_3_years:any=0;
  cites_per_doc_last_4_years:any=0;
  cites_per_doc_last_3_years:any=0;
  cites_per_doc_last_2_years:any=0;
  external_cites_per_doc_last_3_years:any=0;
  international_colab_percent:any=0;

  visualizar:boolean=false;

  similar_titulo_modal:string="";
  similar_btn_modal:string="";

  datosHistory:any=[];

  pageNumber:number=1;
  totalItems:number=0;

  loadingCount:number=0;

  constructor(public vigenciasService: SourceLifetimesService,
              public historialService: SourceHistoryService) { }


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
      //console.log("this.id",this.id);
      this.loadingCount++
      this.historialService.getHistoryBySource(this.id,this.pageNumber).subscribe((resConsulta: any) => {
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
        this.listaItems = this.listaItems.sort((a,b)=>a.year-b.year);
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargó el historial scimago de la fuente'});
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
      this.similar_titulo_modal="Agregar un histórico Scimago";
      this.similar_btn_modal="nuevo";
      this.id_history=0;
      this.year=0;
      this.year_save="";
      this.sjr="";
      this.docs="";
      this.cites_last_3_years="";
      this.self_cites_last_3_years="";
      this.cited_docs_ratio_last_3_years="";
      this.uncited_docs_ratio_last_3_years="";
      this.citable_docs_ratio_last_3_years="";
      this.non_citable_docs_ratio_last_3_years="";
      this.cites_per_doc_last_4_years="";
      this.cites_per_doc_last_3_years="";
      this.cites_per_doc_last_2_years="";
      this.external_cites_per_doc_last_3_years="";
      this.international_colab_percent="";
      this.datosHistory=[];
      this.visualizar=true;
    }else if(accion=='agregar'){
      this.agregarItem();
      this.visualizar=false;
    }else if(accion=='editar'){
      this.getListaAnios();
      this.similar_titulo_modal="Editar un histórico Scimago";
      this.similar_btn_modal="editar";
      this.id_history=item.id;
      this.year=item.year;
      this.year_save=item.year;
      this.sjr=item.sjr;
      this.docs=item.docs;
      this.cites_last_3_years=item.cites_last_3_years;
      this.self_cites_last_3_years=item.self_cites_last_3_years;
      this.cited_docs_ratio_last_3_years=item.cited_docs_ratio_last_3_years;
      this.uncited_docs_ratio_last_3_years=item.uncited_docs_ratio_last_3_years;
      this.citable_docs_ratio_last_3_years=item.citable_docs_ratio_last_3_years;
      this.non_citable_docs_ratio_last_3_years=item.non_citable_docs_ratio_last_3_years;
      this.cites_per_doc_last_4_years=item.cites_per_doc_last_4_years;
      this.cites_per_doc_last_3_years=item.cites_per_doc_last_3_years;
      this.cites_per_doc_last_2_years=item.cites_per_doc_last_2_years;
      this.external_cites_per_doc_last_3_years=item.external_cites_per_doc_last_3_years;
      this.international_colab_percent=item.international_colab_percent;
      this.visualizar=true;
    }else if(accion=='actualizar'){
      this.actualizarItem();
      this.visualizar=false;
    }else if(accion=='ver'){
      this.similar_titulo_modal="Ver información de histórico Scimago";
      this.similar_btn_modal="ver";
      this.datosHistory=item;
      this.visualizar=true;
    }else if(accion=='limpiar'){
      this.similar_titulo_modal="";
      this.similar_btn_modal="";
      this.visualizar=false;
      this.id_history=0;
      this.year=0;
      this.year_save="";
      this.sjr="";
      this.docs="";
      this.cites_last_3_years="";
      this.self_cites_last_3_years="";
      this.cited_docs_ratio_last_3_years="";
      this.uncited_docs_ratio_last_3_years="";
      this.citable_docs_ratio_last_3_years="";
      this.non_citable_docs_ratio_last_3_years="";
      this.cites_per_doc_last_4_years="";
      this.cites_per_doc_last_3_years="";
      this.cites_per_doc_last_2_years="";
      this.external_cites_per_doc_last_3_years="";
      this.international_colab_percent="";
      this.datosHistory=[];
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
      "year":this.year,
      "sjr":this.sjr,
      "docs":this.docs,
      "cites_last_3_years":this.cites_last_3_years,
      "self_cites_last_3_years":this.self_cites_last_3_years,
      "cited_docs_ratio_last_3_years":this.cited_docs_ratio_last_3_years,
      "uncited_docs_ratio_last_3_years":this.uncited_docs_ratio_last_3_years,
      "citable_docs_ratio_last_3_years":this.citable_docs_ratio_last_3_years,
      "non_citable_docs_ratio_last_3_years":this.non_citable_docs_ratio_last_3_years,
      "cites_per_doc_last_4_years":this.cites_per_doc_last_4_years,
      "cites_per_doc_last_3_years":this.cites_per_doc_last_3_years,
      "cites_per_doc_last_2_years":this.cites_per_doc_last_2_years,
      "external_cites_per_doc_last_3_years":this.external_cites_per_doc_last_3_years,
      "international_colab_percent":this.international_colab_percent,
      "accion":"nuevo"
    });
    //console.log("this.listaItems",this.listaItems);
    this.listaAnios = this.listaAnios.filter((item:number) => item != this.year);
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
      if(lc.id==this.id_history){
        if(lc.accion=="agregado"){
          lc.accion="editar";
        }
        lc.year=this.year;
        lc.sjr=this.sjr;
        lc.docs=this.docs;
        lc.cites_last_3_years=this.cites_last_3_years;
        lc.self_cites_last_3_years=this.self_cites_last_3_years;
        lc.cited_docs_ratio_last_3_years=this.cited_docs_ratio_last_3_years;
        lc.uncited_docs_ratio_last_3_years=this.uncited_docs_ratio_last_3_years;
        lc.citable_docs_ratio_last_3_years=this.citable_docs_ratio_last_3_years;
        lc.non_citable_docs_ratio_last_3_years=this.non_citable_docs_ratio_last_3_years;
        lc.cites_per_doc_last_4_years=this.cites_per_doc_last_4_years;
        lc.cites_per_doc_last_3_years=this.cites_per_doc_last_3_years;
        lc.cites_per_doc_last_2_years=this.cites_per_doc_last_2_years;
        lc.external_cites_per_doc_last_3_years=this.external_cites_per_doc_last_3_years;
        lc.international_colab_percent=this.international_colab_percent;
      }
    }
    //console.log("this.listaItems",this.listaItems)
  }

  guardarCambios(){
    for(let lc of this.listaItems){
      if(lc.accion=="nuevo"){
        this.asociarHistoryFuente(
          lc.year,
          lc.sjr,
          lc.docs,
          lc.cites_last_3_years,
          lc.self_cites_last_3_years,
          lc.cited_docs_ratio_last_3_years,
          lc.uncited_docs_ratio_last_3_years,
          lc.citable_docs_ratio_last_3_years,
          lc.non_citable_docs_ratio_last_3_years,
          lc.cites_per_doc_last_4_years,
          lc.cites_per_doc_last_3_years,
          lc.cites_per_doc_last_2_years,
          lc.external_cites_per_doc_last_3_years,
          lc.international_colab_percent
        )
      }
      if(lc.accion=="editar"){
        this.actualizarHistoryFuente(
          lc.id,
          lc.year,
          lc.sjr,
          lc.docs,
          lc.cites_last_3_years,
          lc.self_cites_last_3_years,
          lc.cited_docs_ratio_last_3_years,
          lc.uncited_docs_ratio_last_3_years,
          lc.citable_docs_ratio_last_3_years,
          lc.non_citable_docs_ratio_last_3_years,
          lc.cites_per_doc_last_4_years,
          lc.cites_per_doc_last_3_years,
          lc.cites_per_doc_last_2_years,
          lc.external_cites_per_doc_last_3_years,
          lc.international_colab_percent
        )
      }
      if(lc.accion=="eliminar"){ this.desasociarHistoryFuente(lc.id) }
    }
    this.salvar=0;
  }

  asociarHistoryFuente(year:number,
                       sjr:number,
                       docs:number,
                       cites_last_3_years:number,
                       self_cites_last_3_years:number,
                       cited_docs_ratio_last_3_years:number,
                       uncited_docs_ratio_last_3_years:number,
                       citable_docs_ratio_last_3_years:number,
                       non_citable_docs_ratio_last_3_years:number,
                       cites_per_doc_last_4_years:number,
                       cites_per_doc_last_3_years:number,
                       cites_per_doc_last_2_years:number,
                       external_cites_per_doc_last_3_years:number,
                       international_colab_percent:number){
    this.loadingCount++
    //console.log("this.id",this.id,"year",year);
    this.historialService.addHistoryToSource(this.id,year).subscribe((res:any) => {
      this.loadingCount--
      this.actualizarHistoryFuente(res,
                                  year,
                                  sjr,
                                  docs,
                                  cites_last_3_years,
                                  self_cites_last_3_years,
                                  cited_docs_ratio_last_3_years,
                                  uncited_docs_ratio_last_3_years,
                                  citable_docs_ratio_last_3_years,
                                  non_citable_docs_ratio_last_3_years,
                                  cites_per_doc_last_4_years,
                                  cites_per_doc_last_3_years,
                                  cites_per_doc_last_2_years,
                                  external_cites_per_doc_last_3_years,
                                  international_colab_percent);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció el historial scimago de la fuente'});
      console.error(err)
    });
  }

  actualizarHistoryFuente(
    id:number,
    year:number,
    sjr:number,
    docs:number,
    cites_last_3_years:number,
    self_cites_last_3_years:number,
    cited_docs_ratio_last_3_years:number,
    uncited_docs_ratio_last_3_years:number,
    citable_docs_ratio_last_3_years:number,
    non_citable_docs_ratio_last_3_years:number,
    cites_per_doc_last_4_years:number,
    cites_per_doc_last_3_years:number,
    cites_per_doc_last_2_years:number,
    external_cites_per_doc_last_3_years:number,
    international_colab_percent:number
  ){
    this.loadingCount++
    this.historialService.updateHistoryToSource(
      id,
      year,
      sjr,
      docs,
      cites_last_3_years,
      self_cites_last_3_years,
      cited_docs_ratio_last_3_years,
      uncited_docs_ratio_last_3_years,
      citable_docs_ratio_last_3_years,
      non_citable_docs_ratio_last_3_years,
      cites_per_doc_last_4_years,
      cites_per_doc_last_3_years,
      cites_per_doc_last_2_years,
      external_cites_per_doc_last_3_years,
      international_colab_percent
    ).subscribe(() => {
      this.loadingCount--
      this.obtenerItems();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se actualizó  el historial scimago de la fuente'});
      console.error(err)
    });
  }

  desasociarHistoryFuente(id:number){
    this.loadingCount++
    this.historialService.removeHistoryToSource(id).subscribe(() => {
      this.loadingCount--
      this.obtenerItems();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció el historial scimago de la fuente'});
      console.error(err)
    });
  }

  cambiarPagina(valor:number){
    this.pageNumber=valor;
    this.obtenerItems();
  }

}
