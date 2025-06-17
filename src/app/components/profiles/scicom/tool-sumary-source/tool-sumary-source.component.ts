import { Component, OnInit } from '@angular/core';
import {FuentesScicomService} from "../../../../services/scicom/fuentes-scicom.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-tool-sumary-source',
  templateUrl: './tool-sumary-source.component.html',
  styleUrls: ['./tool-sumary-source.component.css']
})
export class ToolSumarySourceComponent implements OnInit {

  fuenteSelected:number=0;
  fuentesResumenSearch:string='';

  fuentesList:any[]=[];
  paisesList:any[]=[];
  idiomasList:any[]=[];
  areasList:any[]=[];
  subAreasList:any[]=[];
  areasListTot:any[]=[];
  subAreasListTot:any[]=[];

  fuentesSimilaresSearch:string='';
  paisSelected:number=0;
  idiomaSelected:number=0;
  areaSelected:number=0;
  subAreaSelected:number=0;
  cuartilSelected:number=0;
  accesoSelected:number=0;

  ordenCites:string='sorting';
  ordenCitesCount:number=0;
  ordenQuartil:string='sorting';
  ordenQuartilCount:number=0;
  ordenQuartilSc:string='sorting';
  ordenQuartilScCount:number=0;

  filtrosDisabled:boolean=true;
  sinResultados:boolean=false;

  loadingCount: number = 0; //cuenta el número de elementos cargando

  constructor(
    private fuentesService: FuentesScicomService
  ) { }

  ngOnInit(): void {
    this.loadPaises()
    this.loadIdiomas()
    this.loadAreas()
    this.loadSubAreas()
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
    this.filtrarFuentesSimilares()
  }

  filtrarFuentesSimilares(value?:string){
    if(value=='area'){
      this.subAreaSelected = 0;
    }
    if(this.fuentesResumenSearch!=''){
      this.loadingCount++
      this.fuentesService.getFuentesFiltradasByResumen(this.fuentesResumenSearch).subscribe((res: any) => {
        this.loadingCount--
         //console.log("res", res)
          const ids = res.data.map((value: any) => value.id).join(' ');
          //console.log("ids",ids)
          this.filtrosDisabled=false
          this.sinResultados=false
          var consulta = `&ids=`+ids;
          if(this.fuentesSimilaresSearch!=''){consulta = consulta+'&search='+this.fuentesSimilaresSearch}
          if(this.accesoSelected!=0){consulta = consulta+'&soloOpenaccess='}
          if(this.areaSelected!=0){
            consulta = consulta+'&idsScimagoAreaResTopic='+this.areaSelected
            console.log("this.areaSelected",this.areaSelected)
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
          if(this.cuartilSelected!=0){consulta = consulta+'&qScopus='+this.cuartilSelected}
          if(this.paisSelected!=0){consulta = consulta+'&idsPais='+this.paisSelected}
          if(this.idiomaSelected!=0){consulta = consulta+'&idsIdioma='+this.idiomaSelected}
          consulta = consulta+"&conFuentSimilares=";
          this.loadingCount++
          this.fuentesService.getFuentesFiltradas(consulta).subscribe((res: any) => {
            this.loadingCount--
            this.fuentesList = res.data
            if(this.fuentesList.length==0){
              this.sinResultados=true;
            }
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'Error al cargar la lista de fuentes con sus respectivos filtros'});
            console.error(err)
          });

      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar la lista de fuentes filtrada por resumen'});
        console.error(err)
      });
    }else{
      this.fuentesList=[]
      this.sinResultados=false
    }
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

  cleanOrigenFilters(){
    this.fuentesResumenSearch = ''
    this.fuenteSelected = 0
    this.filtrosDisabled=true;
    this.filtrarFuentesSimilares()
    this.cleanFilters()
  }

  cleanFilters(){
    this.fuentesSimilaresSearch = ''
    this.idiomaSelected = 0
    this.paisSelected = 0
    this.areaSelected = 0
    this.subAreaSelected = 0
    this.cuartilSelected = 0
    this.accesoSelected = 0

    this.ordenCites='sorting'
    this.ordenCitesCount=0
    this.ordenQuartil='sorting'
    this.ordenQuartilCount=0
    this.ordenQuartilSc='sorting'
    this.ordenQuartilScCount=0

    this.filtrarFuentesSimilares()
  }

}


