import {Component, Input, OnInit} from '@angular/core';
import {Quote} from "../../../../interfaces/quote";
import {Router} from "@angular/router";
import {ResearcherService} from "../../../../services/researcher.service";
import {ExportService} from "../../../../services/export.service";
import {ExcelJson} from "../../../../interfaces/excel-json";
import {CommonService} from "../../../../services/common.service";
import {AdviserService} from "../../../../services/adviser.service";

@Component({
  selector: 'app-quotes-b',
  templateUrl: './quotes-b.component.html',
  styleUrls: ['./quotes-b.component.css']
})
export class QuotesBComponent implements OnInit {

  dataSource: any[] = [];
  quoteData: any[] = [];
  id: any;
  @Input() productId: any;
  @Input() researchId: any;
  researcherName = '';
  researcherAffiliation = '';
  productTitle = '';
  showLoadingBar: boolean = false;

  typeMode: string = 'asc';
  titleMode: string = 'asc';
  dateMode: string = 'asc';

  since!: number;
  to!: number;
  sinceYear: number[] = [];
  toYear: number[] = [];

  filter = '';
  criteria!: string;
  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'quoteBPagination';
  responsive = true;
  researcherInstId: number = null;

  constructor(
    private router: Router,
    private researchService: ResearcherService,
    private exportService: ExportService,
    private adviserService: AdviserService
  ) {}

  ngOnInit(): void {
    this.getHeaderData();
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.quoteData = [];
    this.dataSource = [];
    //this.criteria = `productos/${this.productId}/citas?onlyCitesB&s=${this.filter}&page=${this.pageNumber}&page_size=${this.pageSize}`;
    this.criteria = `productos/${this.productId}/citas?onlyCitesB&s=${encodeURIComponent(this.filter)}`;
    this.researchService.getProductQuotesByResearcher(this.criteria).subscribe((quotes: any) => {
      this.dataSource = quotes.data;
      this.totalItems = quotes.total;
      //console.log('Quotes B: ', this.totalItems );
    });
  }

  getHeaderData() : void {
    this.researchService.getResearcherBannerData(this.researchId).subscribe((result: any) => {
      this.researcherInstId = result.id_institucion
      this.researcherName = result.nombre;
      this.researcherAffiliation = result.nombre_institucion;
      this.getProductData();
    });
  }

  redirectToResearch(): void {
    this.router.navigate(['/invest',  this.id]);
  }

  exportToExcel(): void {
    //console.log(result);
    this.showLoadingBar = true;
    const edata: Array<ExcelJson> = [];
    const udt: ExcelJson = {
      data: [
        {
          A: 'Título',
          B: 'DOI',
          C: 'Url',
          D: 'Año',
          E: 'Tipo',
          F: 'Id_tipo',
          G: 'Producto',
          H: 'Autores',
          I: 'Fuente'
        }, // table header
      ],
      skipHeader: true,
    };
    //console.log(this.dataSource)
    this.criteria = `productos/${this.productId}/citas?onlyCitesB&s=${encodeURIComponent(this.filter)}&no_paginate`;
    this.researchService.getProductQuotesByResearcher(this.criteria).subscribe((quotes: any) => {
      quotes.forEach((item: any) => {
        udt.data.push({
          A: item.titulo,
          B: item.DOI,
          C: item.url,
          D: item.anio,
          /*E: item.autocita_autor,
          F: item.autocita_journal,
          G: item.journal,*/
          E: item.nombreTipo,
          F: item.idTipo,
          G: this.productTitle,
          H: this.researcherName + ',' + item.coautores.join(','),
          I: item.fuente
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcel(edata, 'Citas_B_' + this.researcherName);
      this.showLoadingBar = false;
    }, () => {
      this.showLoadingBar = false;
    })
  }

  public exportToCsv() {
    const filename = 'Citas_B_' + this.researcherName
    this.showLoadingBar = true
    const separator = ','
    const keys = ['Titulo', 'DOI', 'Url', 'Anio', 'Tipo', 'Id_tipo', 'Producto', 'Autores', 'Fuente']
    this.criteria = `productos/${this.productId}/citas?onlyCitesB&s=${encodeURIComponent(this.filter)}&no_paginate`;
    this.researchService.getProductQuotesByResearcher(this.criteria).subscribe((dataSource: any) => {
      const csvContent =
        keys.join(separator) +
        '\n' +
        dataSource.map((row: any) => {
          return [row.titulo, row.DOI, row.url, row.anio, row.nombreTipo, row.idTipo, this.productTitle,
            this.researcherName + ',' + row.coautores.join(','), row.fuente].join(separator);
        }).join('\n');
      //console.log(csvContent);
      this.exportService.saveAsFile(csvContent, `${filename}${'.csv'}`, 'text/csv;charset=utf-8');
      this.showLoadingBar = false;
    }, () => {
      this.showLoadingBar = false;
    })
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadQuotes();
  }

  getProductData = () => {
    this.criteria = `myzone/productos?no_paginate&idsProductos=${this.productId}&idsInvestigadores=${this.researchId}&id_institucion=${this.researcherInstId}`;
    this.adviserService.getMyZoneData(this.criteria).subscribe((data:any)=>{
      this.productTitle = data[0].titulo;
    });
  }

}
