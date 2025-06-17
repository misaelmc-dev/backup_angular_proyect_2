import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {QuotePageable} from "../../../../interfaces/quote";
import {SharedService} from "../../../../services/shared.service";
import {ResearcherService} from "../../../../services/researcher.service";
import {QuoteService} from "../../../../services/quote.service";
import {Router} from "@angular/router";
import {ExportService} from "../../../../services/export.service";
import {map, tap} from "rxjs/operators";
import {ExcelJson} from "../../../../interfaces/excel-json";
import * as _ from "lodash";

@Component({
  selector: 'app-impact',
  templateUrl: './impact.component.html',
  styleUrls: ['./impact.component.css']
})
export class ImpactComponent implements OnInit {

  @Input() id!: string;
  metadata!: QuotePageable;
  @ViewChild('input') input!: ElementRef;

  typeMode: string = 'asc';
  titleMode: string = 'asc';
  dateMode: string = 'asc';

  since!: number;
  to!: number;
  sinceYear: number[] = [];
  toYear: number[] = [];
  dataSource: any[] = [];

  correo!: string;
  orcid_id!: string;
  cargo!: string;
  url_foto!: string;
  nombre!: string;

  filter = '';
  criteria!: string;
  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'impactPagination';
  responsive = true;

  showLoadingBar = false;

  constructor(
    private sharedService: SharedService,
    private quoteService: QuoteService,
    private router: Router,
    private researcherService: ResearcherService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.getDataLayout();
    this.loadAllData();
  }
  sendEmitter(value: any) {
    this.sharedService.emitChange(value);
  }

  getDataLayout(): void {
    this.researcherService
      .getResearcherBannerData(this.id)
      .subscribe((data: any) => {
        this.correo = data.correo;
        this.orcid_id = data.orcid_id;
        this.cargo = data.cargo;
        this.url_foto = data.url_foto;
        this.nombre = data.nombre;
        this.sendEmitter({
          rol: 'researcher',
          id: this.id,
          correo: this.correo,
          orcid_id: this.orcid_id,
          cargo: this.cargo,
          url_foto: this.url_foto,
          nombre: this.nombre,
        });
      });
  }

  loadAllData = () => {
    this.criteria = `investigador/${this.id}/citas?s=${encodeURIComponent(this.filter)}&page=${this.pageNumber}&page_size=${this.pageSize}`;
    this.quoteService
      .findQuotesByPage(this.criteria)
      .pipe(
        /*tap((result: any) => console.log(result)),*/
        map((result: any) => {
          this.metadata = result;
          this.dataSource = this.metadata.data;
          this.totalItems = this.metadata.total;
        })
      )
      .subscribe((response: any) => {
        const minimumYear = _.min(this.metadata.data.map((item) => item.anio));
        if (minimumYear) {
          this.setSinceYear(minimumYear);
        } else {
          this.setSinceYear(2000);
        }
      });
  };

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadAllData();
  }

  orderDataByType() {
    this.typeMode =
      this.typeMode === 'asc'
        ? (this.typeMode = 'desc')
        : (this.typeMode = 'asc');
    this.dateMode = 'asc';
    this.titleMode = 'asc';
    this.quoteService
      .orderDataByType(this.id, this.typeMode, this.pageNumber, this.pageSize)
      .pipe(
        map((result: any) => {
          this.metadata = result;
        })
      )
      .subscribe();
  }

  orderDataByDate() {
    this.dateMode =
      this.dateMode === 'asc'
        ? (this.dateMode = 'desc')
        : (this.dateMode = 'asc');
    this.typeMode = 'asc';
    this.titleMode = 'asc';
    this.quoteService
      .orderDataByDate(this.id, this.dateMode, this.pageNumber, this.pageSize)
      .pipe(
        map((result: any) => {
          this.metadata = result;
        })
      )
      .subscribe();
  }

  orderDataByTitle() {
    this.titleMode =
      this.titleMode === 'asc'
        ? (this.titleMode = 'desc')
        : (this.titleMode = 'asc');
    this.dateMode = 'asc';
    this.typeMode = 'asc';
    this.quoteService
      .orderDataByTitle(this.id, this.titleMode, this.pageNumber, this.pageSize)
      .pipe(
        map((result: any) => {
          this.metadata = result;
        })
      )
      .subscribe();
  }

  setSinceYear(startYear: number) {
    //let start = parseInt(startYear);
    this.sinceYear = [];
    let nextYear = new Date().getFullYear() + 1;
    for (let index = startYear; index < nextYear; index++) {
      this.sinceYear.push(index);
    }
  }

  setToYear() {
    this.toYear = [];
    let nextYear = new Date().getFullYear() + 1;
    for (let index = this.since; index < nextYear; index++) {
      this.toYear.push(index);
    }
  }

  getProductByRangeYear() {
    this.quoteService
      .getProductByRangeYear(this.id, this.since, this.to, this.pageNumber, this.pageSize)
      .subscribe((result: any) => {
        this.metadata = result;
      });
  }

  exportToExcel = () => {
    this.showLoadingBar = true;
    this.quoteService.dataImpactQuotes(this.id).subscribe((result: any) => {
      //console.log(result);

      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          {
            A: 'Título',
            B: 'DOI',
            C: 'Url',
            D: 'Año',
            E: 'Autocita_Autor',
            F: 'Autocita_Journal',
            G: 'Journal',
            H: 'Nombre_Tipo',
            I: 'Id_Tipo',
            J: 'Producto',
            K: 'Coautores',
            L: 'Fuente'
          }, // table header
        ],
        skipHeader: true,
      };
      result.forEach((item: any) => {
        udt.data.push({
          A: item.titulo,
          B: item.DOI,
          C: item.url,
          D: item.anio,
          E: item.autocita_autor,
          F: item.autocita_journal,
          G: item.journal,
          H: item.nombreTipo,
          I: item.idTipo,
          J: item.producto,
          K: item.coautores.join(','),
          L: item.fuente
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcel(edata, 'impacto');
      this.showLoadingBar = false;
    });
  }

  exportToCsv = () => {
    this.showLoadingBar = true;
    this.quoteService.dataImpactQuotes(this.id).subscribe((result: any) => {
      this.exportService.exportToCsv(result, 'impacto', ['titulo', 'DOI', 'url', 'anio', 'autocita_autor', 'autocita_journal', 'journal', 'nombreTipo', 'idTipo', 'producto', 'coautores', 'fuente']);
      this.showLoadingBar = false;
    });
  }

}
