import { Component, OnInit } from '@angular/core';
import {FuentesScicomService} from "../../../../services/scicom/fuentes-scicom.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-tool-source',
  templateUrl: './tool-source.component.html',
  styleUrls: ['./tool-source.component.css']
})
export class ToolSourceComponent implements OnInit {

  fuentesList:any[]=[];
  paisesList:any[]=[];
  idiomasList:any[]=[];
  areasList:any[]=[];
  subAreasList:any[]=[];
  areasListTot:any[]=[];
  subAreasListTot:any[]=[];

  fuentesSearch:string='';
  paisSelected:number=0;
  idiomaSelected:number=0;
  areaSelected:number=0;
  subAreaSelected:number=0;
  cuartilSelected:number=0;
  accesoSelected:number=0;

  fuenteDetalle:any[]=[];


  ordenCites:string='sorting';
  ordenCitesCount:number=0;
  ordenQuartil:string='sorting';
  ordenQuartilCount:number=0;
  ordenQuartilSc:string='sorting';
  ordenQuartilScCount:number=0;

  loadingCount: number = 0; //cuenta el número de elementos cargando

  constructor(
    private fuentesService: FuentesScicomService
  ) { }

  ngOnInit(): void {
    this.loadFuentes()
  }

  loadFuentes() {
    this.loadingCount++
    this.fuentesService.getFuentes().subscribe((res: any) => {
      this.loadingCount--
      this.fuentesList = res.data
      this.loadPaises()
      this.loadIdiomas()
      this.loadAreas()
      this.loadSubAreas()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de fuentes'});
      console.error(err)
    });
  }

  loadPaises() {
    this.loadingCount++
    this.fuentesService.getFuentesPaises().subscribe((res: any) => {
      this.loadingCount--
      this.paisesList = res.sort((a:any,b:any) => {
        if(a.nombre>b.nombre){return 1}
        if(a.nombre<b.nombre){ return -1}
        return 0
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de paises'});
      console.error(err)
    });
  }

  loadIdiomas() {
    this.loadingCount++
    this.fuentesService.getFuentesIdiomas().subscribe((res: any) => {
      this.loadingCount--
      this.idiomasList = res
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de idiomas'});
      console.error(err)
    });
  }

  loadAreas() {
    this.loadingCount++
    this.fuentesService.getFuentesAreasScimago().subscribe((res: any) => {
      this.loadingCount--
      this.areasListTot = res
      this.areasList = res
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de areas'});
      console.error(err)
    });
  }

  loadSubAreas() {
    this.loadingCount++
    this.fuentesService.getFuentesSubAreasScimago().subscribe((res: any) => {
      this.loadingCount--
      this.subAreasListTot = res
      this.subAreasList = res
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de sub areas'});
      console.error(err)
    });
  }

  selectPais(idPais:number){
    this.paisSelected=idPais
    this.filtrarFuentes()
  }

  filtrarFuentes(value?:string){
    if(value=='area'){
      this.subAreaSelected = 0;
    }
    var consulta = "";
    if(this.accesoSelected!=0){consulta = consulta+'&soloOpenaccess='}
    if(this.areaSelected!=0){
      consulta = consulta+'&idsScimagoAreaResTopic='+this.areaSelected
      let area:any = this.areasListTot.filter(value => value.id_scimago==this.areaSelected);
      let idArea:number = area[0].id;
      if(value=='area'){
        let listaSubareas:any = [];
        for(let tsa of this.subAreasListTot){
          if(tsa.id_subject_area_scimago==idArea){ listaSubareas.push(tsa) }
        }
        this.subAreasList = listaSubareas
      }
    }else{ this.subAreasList = this.subAreasListTot }
    if(this.subAreaSelected!=0){
      consulta = consulta+'&idsScimagoResTopic='+this.subAreaSelected
      let area:any = this.subAreasListTot.filter(value => value.id_scimago==this.subAreaSelected);
      let idArea:number = area[0].id_subject_area_scimago
      if(value=='subarea'){
        for(let ta of this.areasListTot){
          if(ta.id==idArea){
            this.areaSelected = ta.id_scimago
          }
        }
      }
    }
    if(this.fuentesSearch!=''){consulta = consulta+'&search='+encodeURIComponent(this.fuentesSearch)}
    if(this.cuartilSelected!=0){consulta = consulta+'&qScopus='+this.cuartilSelected}
    if(this.paisSelected!=0){consulta = consulta+'&idsPais='+this.paisSelected}
    if(this.idiomaSelected!=0){consulta = consulta+'&idsIdioma='+this.idiomaSelected}
    this.loadingCount++
    this.fuentesService.getFuentesFiltradas(consulta).subscribe((res: any) => {
      this.loadingCount--
      this.fuentesList = res.data
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de fuentes con sus respectivos filtros'});
      console.error(err)
    });
  }

  ordenarFuentes(value:string){
    if(this.fuentesList.length!=0){
      let auxFuentesList = this.fuentesList
      if(value=='cites'){
        if(this.ordenCitesCount==0){
          this.ordenCites='sorting_asc'
          auxFuentesList = auxFuentesList.sort((a,b)=>a.cites_score-b.cites_score);
          this.fuentesList = auxFuentesList.sort((a,b)=>{if(a.cites_score==null){return -1}return 0});
          this.ordenCitesCount=1
        }else{
          this.ordenCites='sorting_desc'
          auxFuentesList = auxFuentesList.sort((a,b)=>b.cites_score-a.cites_score);
          this.fuentesList = auxFuentesList.sort((a,b)=>{if(b.cites_score==null){return -1}return 0});
          this.ordenCitesCount=0
        }
        this.ordenQuartil='sorting'
        this.ordenQuartilCount=0
        this.ordenQuartilSc='sorting'
        this.ordenQuartilScCount=0
      }
      if(value=='quartil'){
        if(this.ordenQuartilCount==0){
          let auxValores:any = [];
          for(let f of auxFuentesList){if(f.scopus_q==null)auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q=='Q1')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q=='Q2')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q=='Q3')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q=='Q4')auxValores.push(f)}
          this.fuentesList = auxValores
          this.ordenQuartil='sorting_asc'
          this.ordenQuartilCount=1
        }else{
          let auxValores:any = [];
          for(let f of auxFuentesList){if(f.scopus_q=='Q4')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q=='Q3')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q=='Q2')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q=='Q1')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q==null)auxValores.push(f)}
          this.fuentesList = auxValores
          this.ordenQuartil='sorting_desc'
          this.ordenQuartilCount=0
        }
        this.ordenCites='sorting'
        this.ordenCitesCount=0
        this.ordenQuartilSc='sorting'
        this.ordenQuartilScCount=0
      }
      if(value=='quartilsc'){
        if(this.ordenQuartilScCount==0){
          let auxValores:any = [];
          for(let f of auxFuentesList){if(f.scopus_q_scintra==null)auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q_scintra=='Q1')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q_scintra=='Q2')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q_scintra=='Q3')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q_scintra=='Q4')auxValores.push(f)}
          this.fuentesList = auxValores
          this.ordenQuartilSc='sorting_asc'
          this.ordenQuartilScCount=1
        }else{
          let auxValores:any = [];
          for(let f of auxFuentesList){if(f.scopus_q_scintra=='Q4')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q_scintra=='Q3')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q_scintra=='Q2')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q_scintra=='Q1')auxValores.push(f)}
          for(let f of auxFuentesList){if(f.scopus_q_scintra==null)auxValores.push(f)}
          this.fuentesList = auxValores
          this.ordenQuartilSc='sorting_desc'
          this.ordenQuartilScCount=0
        }
        this.ordenCites='sorting'
        this.ordenCitesCount=0
        this.ordenQuartil='sorting'
        this.ordenQuartilCount=0
      }
    }
  }

  detailFontModal(fuente:any){
    let auxDetalle:any = []
    auxDetalle = auxDetalle.push(fuente)
    this.fuenteDetalle = auxDetalle
  }

  cleanFilters(){
    this.fuentesSearch = '';
    this.idiomaSelected = 0;
    this.paisSelected = 0;
    this.areaSelected = 0 ;
    this.subAreaSelected = 0 ;
    this.cuartilSelected = 0;
    this.accesoSelected = 0;

    this.ordenCites='sorting'
    this.ordenCitesCount=0
    this.ordenQuartil='sorting'
    this.ordenQuartilCount=0
    this.ordenQuartilSc='sorting'
    this.ordenQuartilScCount=0

    this.loadFuentes();
  }

}
