import {
  Component,
  Input,
} from '@angular/core';
import { ResearcherService } from 'src/app/services/researcher.service';
import {
  ProductPageable,
} from 'src/app/interfaces/product-research';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ExportService } from 'src/app/services/export.service';
import { ExcelJson } from 'src/app/interfaces/excel-json';
import * as _ from 'lodash';


@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent implements OnInit {

  id!: string;
  metadata!: ProductPageable;

  typeMode: string = 'asc';
  citesMode: string = 'asc';
  dateMode: string = 'asc';

  since!: number;
  to!: number;
  sinceYear: number[] = [];
  toYear: number[] = [];
  dataSource: any[] = [];

  correo!: string;
  orcid_id!: string;
  cargo!: string
  url_foto!: string;
  nombre!: string;
  showLoadingBar = false;

  filter = '';
  criteria!: string;
  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'productionPagination';
  responsive = true;

  orden:string = "";

  constructor(
    private researcherService: ResearcherService,
    private changeDetectorRef: ChangeDetectorRef,
    private exportService: ExportService,
    private activatedRoute: ActivatedRoute,) {
  this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
}

  ngOnInit(): void {
    this.getDataLayout();
    this.changeDetectorRef.detectChanges();
    this.loadAllData();
  }

  getDataLayout(): void {
    this.researcherService.getResearcherBannerData(this.id).subscribe((data: any) => {
      this.correo = data.correo;
      this.orcid_id = data.orcid_id;
      this.cargo = data.cargo;
      this.url_foto = data.url_foto;
      this.nombre = data.nombre;
    });
  }

  loadAllData = () => {
    this.criteria = `investigador/${this.id}/productos?s=${encodeURIComponent(this.filter)}&page=${this.pageNumber}&page_size=${this.pageSize}`;
    if (this.since) {
      //console.log('hay anio desde')
      this.criteria += `&anioDesde=${this.since}`
    }
    if (this.to) {
      //console.log('hay anio hasta')
      this.criteria += `&anioHasta=${this.to}`
    }
    this.researcherService
      .getProductByResearcher(this.criteria)
      .subscribe((result: any) => {
        this.metadata = result;
        this.dataSource = this.metadata.data;
        this.loadCoautores();
        this.totalItems = this.metadata.total;
        const minimumYear = _.min(this.metadata.data.map(item => item.anio));
        //console.log(minimumYear);
        if (minimumYear) {
          this.setSinceYear(minimumYear);
        }else{
          this.setSinceYear('2000');
        }
      });
  };

  loadCoautores(){
    for(let ds of this.dataSource){
      ds.coautores_ordenados = ds.coautores_ordenados.sort((a:any,b:any)=>a.orden-b.orden);
      let auxCoautores = ds.coautores_ordenados;
      auxCoautores = auxCoautores.filter((item:any) => item.orden != null)
      for(let co of ds.coautores_ordenados){
        if(co.orden==null){ auxCoautores.push(co) }
      }
      ds.coautores_ordenados = auxCoautores;
    }
    //console.log("this.dataSource",this.dataSource)
  }

  orderDataByType() {
    this.typeMode = this.typeMode === 'asc' ? this.typeMode = 'desc' : this.typeMode = 'asc';
    this.orden="Tipo";
    this.researcherService
      .orderDataByType(this.id, this.typeMode)
      .subscribe((result: any) => {
        this.metadata = result;
        this.dataSource = this.metadata.data;
      });
  }

  orderDataByDate() {
    this.dateMode = this.dateMode === 'asc' ? this.dateMode = 'desc' : this.dateMode = 'asc';
    this.orden="Fecha";
    this.researcherService
      .orderDataByDate(this.id, this.dateMode)
      .subscribe((result: any) => {
        this.metadata = result;
        this.dataSource = this.metadata.data;
      });
  }

  orderDataByCites() {
    this.citesMode = this.citesMode === 'asc' ? this.citesMode = 'desc' : this.citesMode = 'asc';
    this.orden="Citas";
    this.researcherService
      .orderDataByCites(this.id, this.citesMode)
      .subscribe((result: any) => {
        this.metadata = result;
        this.dataSource = this.metadata.data;
      });
  }

  setSinceYear(startYear: string){
    let start = parseInt(startYear);
    this.sinceYear = [];
    let nextYear = (new Date()).getFullYear() + 1;
    for (let index = start; index < nextYear ; index++) {
      this.sinceYear.push(index);
    }
  }

  setToYear(){
    this.toYear = [];
    let nextYear = (new Date()).getFullYear() + 1;
    for (let index = this.since; index < nextYear ; index++) {
      this.toYear.push(index);
    }
  }

  getProductByRangeYear(){
    this.researcherService.getProductByRangeYear(this.id, this.since, this.to).subscribe((result: any) => {
      this.metadata = result;
      this.dataSource = this.metadata.data;
    });
  }

  exportToExcel(): void {
    this.showLoadingBar = true;
    this.criteria = `investigador/${this.id}/productos?no_paginate`;
    this.researcherService.getProductByResearcher(this.criteria).subscribe((result: any) => {
      for(let ds of result){
        ds.coautores_ordenados = ds.coautores_ordenados.sort((a:any,b:any)=>a.orden-b.orden);
        let auxCoautores = ds.coautores_ordenados;
        auxCoautores = auxCoautores.filter((item:any) => item.orden != null)
        for(let co of ds.coautores_ordenados){
          if(co.orden==null){ auxCoautores.push(co) }
        }
        ds.coautores_ordenados = auxCoautores;
      }
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          {
            A: 'Título',
            B: 'DOI',
            C: 'Url',
            D: 'Publisher',
            E: 'Año',
            F: 'Link_Citas',
            G: 'Id_Investigador',
            H: 'Id_Tipo',
            I: 'Nombre_Tipo',
            J: 'Citas',
            K: 'Nombre_Investigador',
            L: 'Coautores',
            M: 'Fuente'
          }, // table header
        ],
        skipHeader: true,
      };

      result.forEach((item: any) => {
        var temp_coautores = "";
        if(item.coautores_ordenados==[] || item.coautores_ordenados==undefined){
          temp_coautores=" ";
        }else{
          var cont = 0;
          for(let i of item.coautores_ordenados){
            if(cont!=0){ temp_coautores += ", "; }
            temp_coautores += i.nombre;
            cont++
          }
        }
        udt.data.push({
          A: item.titulo,
          B: item.DOI,
          C: item.url,
          D: item.publisher,
          E: item.anio,
          F: item.linkCitas,
          G: item.id_investigador,
          H: item.idTipo,
          I: item.nombreTipo,
          J: item.citedby,
          K: item.nombreInvest,
          L: temp_coautores,
          M: item.fuente
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcel(edata, 'Producción_' + this.nombre);
      this.showLoadingBar = false;
    });
  }

  exportToCsv(): void {
    this.showLoadingBar = true;
    this.criteria = `investigador/${this.id}/productos?no_paginate`;
    this.researcherService.getProductByResearcher(this.criteria).subscribe((result: any) => {
      for(let ds of result){
        ds.coautores_ordenados = ds.coautores_ordenados.sort((a:any,b:any)=>a.orden-b.orden);
        let auxCoautores = ds.coautores_ordenados;
        auxCoautores = auxCoautores.filter((item:any) => item.orden != null)
        for(let co of ds.coautores_ordenados){
          if(co.orden==null){ auxCoautores.push(co) }
        }
        ds.coautores_ordenados = auxCoautores;
      }
      this.exportService.exportToCsv(result, 'Producción_' + this.nombre, ['titulo', 'DOI', 'url', 'anio', 'autocita_autor', 'autocita_journal', 'journal', 'nombreTipo', 'idTipo', 'producto', 'coautores', 'fuente']);
      this.showLoadingBar = false;
    });
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadAllData();
  }

}
