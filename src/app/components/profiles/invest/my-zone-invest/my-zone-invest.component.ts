import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AdviserService} from "../../../../services/adviser.service";
import {CatalogsService} from "../../../../services/catalogs.service";
import {ExportService} from "../../../../services/export.service";
import {ExcelJson} from "../../../../interfaces/excel-json";
import {ProductosService} from "../../../../services/productos.service";
import {LineasInvestigacionService} from "../../../../services/lineas-investigacion.service";
import {PaisesService} from "../../../../services/paises.service";
import {TiposDeProductoService} from "../../../../services/tipos-de-producto.service";

@Component({
  selector: 'app-my-zone-invest',
  templateUrl: './my-zone-invest.component.html',
  styleUrls: ['./my-zone-invest.component.css']
})
export class MyZoneInvestComponent implements OnInit {

  id: any;

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'myzone';
  institutionName = '';

  anios = "";
  idsProductos = "";
  idsInstituciones = "";
  idsPaises = "";
  idsLineas = "";
  idsColegios = "";
  idsCampus = "";
  idsInvestigadores = ""
  idsInvestigadoresArray: Array<any> = []
  search = "";
  doaj = false;
  scopus = false;
  jcr = false;
  scielo = false;
  conacyt = false;
  otros = false;
  showDoaj = false;
  showScopus = false;
  showJcr = false;
  showScielo = false;
  showConacyt = false;
  showOtros = false;

  orderByTitle = false;
  orderByType = false;

  dataSource: any[] = [];
  years: any[] = [];
  productTypes: any[] = [];
  lineasInvestigacion: any[] = [];
  countries: any[] = [];
  instituciones: any[] = [];
  investigadores: any[] = [];
  colegios: any[] = [];
  campus: any[] = [];
  responsive = true;
  showLoadingBar = false;
  countriesShortList: any[] = [
    {
      "ISO_3166_1_num": 144,
      "ISO_3166_1_alfa2": "MX",
      "nombre": "Mexico"
    },
    {
      "ISO_3166_1_num": 209,
      "ISO_3166_1_alfa2": "ES",
      "nombre": "España"
    },
    {
      "ISO_3166_1_num": 236,
      "ISO_3166_1_alfa2": "US",
      "nombre": "United States"
    },
    {
      "ISO_3166_1_num": 178,
      "ISO_3166_1_alfa2": "PT",
      "nombre": "Portugal"
    },
    {
      "ISO_3166_1_num": 46,
      "ISO_3166_1_alfa2": "CN",
      "nombre": "China"
    }
  ];

  criteria = ``;
  order = "";

  constructor(private activatedRoute: ActivatedRoute,
              private adviserService: AdviserService,
              private catalogsService: CatalogsService,
              private exportService: ExportService,
              private productosService: ProductosService,
              private lineasInvestigacionService: LineasInvestigacionService,
              private paisesService: PaisesService,
              private tiposDeProductoService: TiposDeProductoService) {
    this.idsInvestigadores = this.activatedRoute.snapshot.paramMap.get('id');
    this.idsInvestigadoresArray.push(this.idsInvestigadores)
  }

  ngOnInit(): void {
    this.loadVisibilidades()
    this.loadYears();
    this.loadProductTypes();
    this.loadLines();
    this.loadCountries();
    this.loadInstitutions();
    this.loadData();
  }

  loadData = () => {
    this.dataSource = [];
    this.totalItems = 0;
    this.showLoadingBar = true;
    this.criteria = `myzone/productos?page=${this.pageNumber}&page_size=${this.pageSize}&anios=${this.anios}&search=${this.search}&idsPaises=${this.idsPaises}&idsLineas=${this.idsLineas}&idsTiposProducto=${this.idsProductos}&idsInstituciones=${this.idsInstituciones}&idsColegios=${this.idsColegios}&idsCampus=${this.idsCampus}&idsInvestigadores=${this.idsInvestigadores}`;
    this.criteria = this.order ? this.criteria.concat('&' + this.order) : this.criteria
    this.criteria = this.doaj ? this.criteria.concat('&doaj=') : this.criteria.replace('&doaj=', '');
    this.criteria = this.scopus ? this.criteria.concat('&scopus=') : this.criteria.replace('&scopus=', '');
    this.criteria = this.jcr ? this.criteria.concat('&jcr=') : this.criteria.replace('&jcr=', '');
    this.criteria = this.scielo ? this.criteria.concat('&scielo=') : this.criteria.replace('&scielo=', '');
    this.criteria = this.conacyt ? this.criteria.concat('&conacyt=') : this.criteria.replace('&conacyt=', '');
    this.criteria = this.otros ? this.criteria.concat('&otros=') : this.criteria.replace('&otros=', '');

    this.adviserService.getMyZoneData(this.criteria).subscribe((result: any) => {
      this.dataSource = result.data;
      this.loadCoautores();
      this.totalItems = result.total;
      this.showLoadingBar = false;
    });
  }

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

  /**
   * Carga las visibilidades que deben mostrarse como opciones en los filtros de visbilidad
   */
  loadVisibilidades() {
    this.productosService.getVisibilidadesConProductos(this.idsInvestigadoresArray)
      .subscribe((data: any) =>
      {
        console.debug('Visibilidades productivas cargados en mi producción de investigador: ' + data)
        this.showScopus = data.scopus
        this.showScielo = data.scielo
        this.showConacyt = data.conacyt
        this.showDoaj = data.doaj
        this.showJcr = data.jcr
        this.showOtros = data.otros
      },() => {
        console.error('Error al cargar las visibilidades productivas en mi producción de coordinador')
      })
  }

  handlePageChange(event: any) {
    this.pageNumber = event;
    this.loadData();
  }

  loadYears = () => {
    this.years = [];
    this.productosService.getAniosProductivos(null, null, this.idsInvestigadoresArray).subscribe((anios: any) => {
      console.debug('Anios productivos cargados en mi producción de investigador: ' + anios)
      for(let a of anios) {this.years.push({year:a,checked:''});}
    },() => {
      console.error('Error al cargar los años productivos en mi producción de investigador')
    })
  }

  loadLines = () => {
    this.lineasInvestigacion = [];
    this.lineasInvestigacionService.get(null, null, this.idsInvestigadoresArray, null, null,
      null, null, null, true).subscribe(
      (result: any) => {
        console.debug('Cargadas líneas de investigación para filtrar en mi producción de investigador')
        this.lineasInvestigacion = result;
      },
      (err: any) => {
        console.error(err)
      })
  }

  loadCountries = () => {
    this.countries = [];
    this.paisesService.get(true, false, null, null, null,
      this.idsInvestigadoresArray, null, null).subscribe(
      (result: any) => {
        this.countries = result;
        for(let c of this.countries){ c.checked=""; }
      },
      (err: any) => {
        console.error(err)
      }
    );
  }

  loadProductTypes = () => {
    this.tiposDeProductoService.get(true, false, this.idsInvestigadoresArray, null).subscribe(
      (result: any) => {
        this.productTypes = result;
      },
      (err: any) => {
        console.error(err)
      }
    );
  }

  loadInstitutions = () => {
    this.instituciones = [];
    this.catalogsService.getAllRors(null, null, null, this.idsInvestigadoresArray,
      null, null, null, null, null,
      null, true).subscribe(
      (result: any) => {
        this.instituciones = result;
        for(let i of this.instituciones){ i.checked=""; }
      },
      (err: any) => {
        console.error(err)
      }
    );
  }

  selectYear = (year: string) => {
    for(let anio of this.years){
      if(anio.year == year){
        if(anio.checked == "checked") {
          anio.checked = "";
        }else{
          anio.checked = "checked";
        }
      }
    }
    this.anios="";
    for(let anio of this.years){
      if(anio.checked == "checked") { this.anios = this.anios.concat(' ' + anio.year); }
    }
    this.loadData();
  }

  selectLine = (lineId: any) => {
    if (!this.idsLineas.includes(lineId.toString())) {
      this.idsLineas = this.idsLineas.concat(' ' + lineId);
    } else {
      this.idsLineas = this.idsLineas.replace(' ' + lineId, '');
    }
    this.loadData();
  }

  selectProductType = (productTypeId: any) => {
    if (!this.idsProductos.includes(productTypeId.toString())) {
      this.idsProductos = this.idsProductos.concat(' ' + productTypeId);
    } else {
      this.idsProductos = this.idsProductos.replace(' ' + productTypeId, '');
    }
    this.loadData();
  }

  selectInstituciones = (institucionesId: any) => {
    for(let insti of this.instituciones){
      if(insti.id == institucionesId){
        if(insti.checked == "checked") {
          insti.checked = "";
        }else{
          insti.checked = "checked";
        }
      }
    }
    this.idsInstituciones="";
    for(let insti of this.instituciones){
      if(insti.checked == "checked") { this.idsInstituciones = this.idsInstituciones.concat(' ' + insti.id); }
    }
    this.loadData();
  }

  selectCountry = (countryId: any) => {
    for(let count of this.countries){
      if(count.ISO_3166_1_num == countryId){
        if(count.checked == "checked") {
          count.checked = "";
        }else{
          count.checked = "checked";
        }
      }
    }
    this.idsPaises="";
    for(let count of this.countries){
      if(count.checked == "checked") { this.idsPaises = this.idsPaises.concat(' ' + count.ISO_3166_1_num); }
    }
    this.loadData();
  }

  doajChange(): void {
    if (this.doaj) {
      this.criteria = this.criteria.concat('&doaj=');
    } else {
      this.criteria = this.criteria.replace('&doaj=', '');
    }
    this.loadData();
  }

  scopusChange(): void {
    if (this.scopus) {
      this.criteria = this.criteria.concat('&scopus=');
    } else {
      this.criteria = this.criteria.replace('&scopus=', '');
    }
    this.loadData();
  }

  jcrChange(): void {
    if (this.jcr) {
      this.criteria = this.criteria.concat('&jcr=');
    } else {
      this.criteria = this.criteria.replace('&jcr=', '');
    }
    this.loadData();
  }

  scieloChange(): void {
    if (this.scielo) {
      this.criteria = this.criteria.concat('&scielo=');
    } else {
      this.criteria = this.criteria.replace('&scielo=', '');
    }
    this.loadData();
  }

  conacytChange(): void {
    if (this.conacyt) {
      this.criteria = this.criteria.concat('&conacyt=');
    } else {
      this.criteria = this.criteria.replace('&conacyt=', '');
    }
    this.loadData();
  }

  otrosChange(): void {
    if (this.otros) {
      this.criteria = this.criteria.concat('&otros=');
    } else {
      this.criteria = this.criteria.replace('&otros=', '');
    }
    this.loadData();
  }

  clearFilter = () => {
    window.location.reload();
  }

  orderEvent = (param: string) => {
    this.order = param;
    this.loadData();
  }

  exportToExcel(): void {
    this.showLoadingBar = true;
    const excelCriteria = this.criteria.concat('&no_paginate');
    this.adviserService.getMyZoneData(excelCriteria).subscribe((result: any) => {
      //console.log(result);
      const excelData = result;
      for(let ds of excelData){
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
            F: 'Link de la cita',
            G: 'Id Investigador',
            H: 'Investigador',
            I: 'Id tipo',
            J: 'Nombre del tipo',
            K: 'Citas',
            L: 'Coautores',
            M: 'Fuente',
            N: 'Líneas de investigación'
          }, // table header
        ],
        skipHeader: true,
      };
      excelData.forEach((item: any) => {
        var temp_titulo = "";
        var temp_doi = "";
        var temp_url = "";
        var temp_publisher = "";
        var temp_anio = "";
        var temp_linkCitas = "";
        var temp_id_investigador = "";
        var temp_nombreInvest = "";
        var temp_idTipo = "";
        var temp_nombreTipo = "";
        var temp_citedby = "";
        var temp_coautores = "";
        var temp_fuente = "";
        var temp_lineas = item.lineas_investigacion.map((x: any) => { return x.nombre}).join(', ');
        if(item.titulo==='' || item.titulo===null){temp_titulo=" ";}else{temp_titulo = item.titulo;}
        if(item.DOI==='' || item.DOI===null){temp_doi=" ";}else{temp_doi = item.DOI;}
        if(item.url==='' || item.url===null){temp_url=" ";}else{temp_url = item.url;}
        if(item.publisher==='' || item.publisher===null){temp_publisher=" ";}else{temp_publisher = item.publisher;}
        if(item.anio==='' || item.anio===null){temp_anio=" ";}else{temp_anio = item.anio;}
        if(item.linkCitas==='' || item.linkCitas===null){temp_linkCitas=" ";}else{temp_linkCitas = item.linkCitas;}
        if(item.id_investigador==='' || item.id_investigador===null){temp_id_investigador=" ";}else{temp_id_investigador = item.id_investigador;}
        if(item.nombreInvest==='' || item.nombreInvest===null){temp_nombreInvest=" ";}else{temp_nombreInvest = item.nombreInvest;}
        if(item.idTipo==='' || item.idTipo===null){temp_idTipo=" ";}else{temp_idTipo = item.idTipo;}
        if(item.nombreTipo==='' || item.nombreTipo===null){temp_nombreTipo=" ";}else{temp_nombreTipo = item.nombreTipo;}
        if(item.citedby==='' || item.citedby===null){temp_citedby=" ";}else{temp_citedby = item.citedby;}
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
        if(item.fuente==='' || item.fuente===null){temp_fuente=" ";}else{temp_fuente = item.fuente;}
        if(item.lineas_investigacion==[] || item.lineas_investigacion==undefined){
          temp_lineas=" ";
        }else{
          temp_lineas = item.lineas_investigacion.map((x: any) => { return x.nombre}).join(', ');
        }
        udt.data.push({
          A: temp_titulo ,
          B: temp_doi ,
          C: temp_url ,
          D: temp_publisher ,
          E: temp_anio ,
          F: temp_linkCitas ,
          G: temp_id_investigador ,
          H: temp_nombreInvest ,
          I: temp_idTipo ,
          J: temp_nombreTipo ,
          K: temp_citedby ,
          L: temp_coautores ,
          M: temp_fuente ,
          N: temp_lineas
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcelMyImpact(edata, 'My_Zone_Productos_Investigador');
      this.showLoadingBar = false;
    });
  }

}
