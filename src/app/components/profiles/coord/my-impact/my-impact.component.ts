import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AdviserService} from "../../../../services/adviser.service";
import {CatalogsService} from "../../../../services/catalogs.service";
import {ExportService} from "../../../../services/export.service";
import {ExcelJson} from "../../../../interfaces/excel-json";
import {CitasService} from "../../../../services/citas.service";
import {LineasInvestigacionService} from "../../../../services/lineas-investigacion.service";
import {PaisesService} from "../../../../services/paises.service";
import {TiposDeProductoService} from "../../../../services/tipos-de-producto.service";
import {ColegiosService} from "../../../../services/colegios.service";
import {CampusService} from "../../../../services/campus.service";
import {ResearcherService} from "../../../../services/researcher.service";

@Component({
  selector: 'app-my-impact',
  templateUrl: './my-impact.component.html',
  styleUrls: ['./my-impact.component.css']
})
export class MyImpactComponent implements OnInit {

  id: any;

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'myzone';
  institutionName = '';

  anios = "";
  idsProductos = "";
  idsInstituciones = "";
  idsInstitucionesArray: Array<any> = []
  idsPaises = "";
  idsLineas = "";
  idsColegios = "";
  idsCampus = "";
  idsInvestigadores = ""
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
              private citasService: CitasService,
              private lineasInvestigacionService: LineasInvestigacionService,
              private paisesService: PaisesService,
              private tiposDeProductoService: TiposDeProductoService,
              private colegiosService: ColegiosService,
              private campusService: CampusService,
              private researchersService: ResearcherService) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.idsInstitucionesArray.push(this.id)
    if (!this.id) {
      this.id = 1;
    }
  }

  ngOnInit(): void {
    this.loadVisibilidades()
    this.loadYears();
    this.loadProductTypes();
    this.loadLines();
    this.loadCountries();
    this.loadInstitutions();
    this.loadColegios();
    this.loadCampus();
    this.loadData();
    this.loadAdvisorInstitution();
    this.loadResearchers();
  }

  ngAfterViewInit() {

  }

  loadData = () => {
    this.dataSource = [];
    this.totalItems = 0;
    this.showLoadingBar = true;
    this.criteria = `myzone/citas?id_institucion=${this.id}&page=${this.pageNumber}&page_size=${this.pageSize}&anios=${this.anios}&search=${this.search}&idsPaises=${this.idsPaises}&idsLineas=${this.idsLineas}&idsTiposProducto=${this.idsProductos}&idsInstituciones=${this.idsInstituciones}&idsColegios=${this.idsColegios}&idsCampus=${this.idsCampus}&idsInvestigadores=${this.idsInvestigadores}`;
    this.criteria = this.order ? this.criteria.concat('&' + this.order) : this.criteria
    this.criteria = this.doaj ? this.criteria.concat('&doaj=') : this.criteria.replace('&doaj=', '');
    this.criteria = this.scopus ? this.criteria.concat('&scopus=') : this.criteria.replace('&scopus=', '');
    this.criteria = this.jcr ? this.criteria.concat('&jcr=') : this.criteria.replace('&jcr=', '');
    this.criteria = this.scielo ? this.criteria.concat('&scielo=') : this.criteria.replace('&scielo=', '');
    this.criteria = this.conacyt ? this.criteria.concat('&conacyt=') : this.criteria.replace('&conacyt=', '');
    this.criteria = this.otros ? this.criteria.concat('&otros=') : this.criteria.replace('&otros=', '');

    //console.log("this.criteria",this.criteria);
    this.adviserService.getMyZoneData(this.criteria).subscribe((result: any) => {
      console.log("result",result)
      this.dataSource = result.data;
      this.loadCoautores();
      this.totalItems = result.total;
      this.showLoadingBar = false;
      //console.log("this.dataSource",this.dataSource);
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
    this.citasService.getVisibilidadesConCita(null, this.idsInstitucionesArray)
      .subscribe((data: any) =>
      {
        console.debug('Visibilidades de citas cargados en mi producción de coordinador: ' + data)
        this.showScopus = data.scopus
        this.showScielo = data.scielo
        this.showConacyt = data.conacyt
        this.showDoaj = data.doaj
        this.showJcr = data.jcr
        this.showOtros = data.otros
      },() => {
        console.error('Error al cargar las visibilidades de citas en mi producción de coordinador')
      })
  }

  handlePageChange(event: any) {
    this.pageNumber = event;
    this.loadData();
  }

  loadYears = () => {
    this.years = [];
    this.citasService.getAniosConCitasAsignadas(this.idsInstitucionesArray).subscribe((anios: any) => {
      //console.debug('Anios con cita asignada cargados en mi impacto de coordinador: ' + anios)
      for(let a of anios) {this.years.push({year:a,checked:''});}
    },() => {
      console.error('Error al cargar los años con cita asignada en mi impacto de coordinador')
    })
  }

  loadLines = () => {
    this.lineasInvestigacion = [];
    this.lineasInvestigacionService.get(null, null, null, null, null,
      [this.id], null, null, false, true).subscribe(
      (result: any) => {
        //console.debug('Cargadas líneas de investigación para filtrar en mi impacto de coordinador')
        this.lineasInvestigacion = result;
      },
      (err: any) => {
        console.error(err)
      })
  }

  loadCountries = () => {
    this.countries = [];
    this.paisesService.get(false, true, null, null, null,
      null, null, null, [this.id]).subscribe(
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
    this.tiposDeProductoService.get(false, true, null, null,
      null, null, [this.id]).subscribe(
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
    this.catalogsService.getAllRors(null, null, null, null,
      null, null, null, [this.id], null,
      null, false, true).subscribe(
      (result: any) => {
        this.instituciones = result;
        for(let i of this.instituciones){ i.checked=""; }
      },
      (err: any) => {
        console.error(err)
      }
    );
  }

  loadColegios = () => {
    this.colegios = [];
    this.colegiosService.get(this.id, null, null, null, null, null,
      null, null, null, null, null, null,
      false).subscribe(
      (result: any) => {
        this.colegios = result;
      },
      (err: any) => {
        console.error(err)
      },
    );
  }

  loadCampus = () => {
    this.campus = [];
    this.campusService.getSimples(this.id, null, null, null, null,
      null, null, null, null, null, false).subscribe(
      (result: any) => {
        this.campus = result;
        for(let c of this.campus){ c.checked=""; }
      },
      (err: any) => {
        console.error(err)
      }
    );
  }

  loadAdvisorInstitution = () => {
    this.adviserService.getAdviserBannerData(this.id).subscribe(
      (data: any) => {
        this.institutionName = data.institution.nombre;
      }, () => {
        console.warn('No se pudo recuperar nombre de institución de coordinador')
      }
    )
  }

  loadResearchers = () => {
    this.investigadores = [];
    this.researchersService.getSimple(this.id, null, null,
      null, false, true).subscribe(
      (result: any) => {
        this.investigadores = result;
      },
      (err: any) => {
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

  selectColegios = (colegioId: any) => {
    if (!this.idsColegios.includes(colegioId.toString())) {
      this.idsColegios = this.idsColegios.concat(' ' + colegioId);
    } else {
      this.idsColegios = this.idsColegios.replace(' ' + colegioId, '');
    }
    this.loadData();
  }

  selectCampus = (campusId: any) => {
    for(let camp of this.campus){
      if(camp.id == campusId){
        if(camp.checked == "checked") {
          camp.checked = "";
        }else{
          camp.checked = "checked";
        }
      }
    }
    this.idsCampus="";
    for(let camp of this.campus){
      if(camp.checked == "checked") { this.idsCampus = this.idsCampus.concat(' ' + camp.id); }
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

  selectResearcher = (id: any) => {
    if (!this.idsInvestigadores.includes(id.toString())) {
      this.idsInvestigadores = this.idsInvestigadores.concat(' ' + id);
    } else {
      this.idsInvestigadores = this.idsInvestigadores.replace(' ' + id, '');
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
      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          {
            A: 'Título',
            B: 'DOI',
            C: 'Url',
            D: 'Año',
            E: 'Id tipo',
            F: 'Tipo',
            G: 'Nombre investigador',
            I: 'Fuente'
          }, // table header
        ],
        skipHeader: true,
      };
      excelData.forEach((item: any) => {
        var temp_doi = ' ';
        var temp_anio = ' ';
        var temp_idtipo = ' ';
        var temp_nombtipo = ' ';
        var temp_fuente = ' ';
        if(item.DOI==='' || item.DOI===null){temp_doi=" ";}else{temp_doi=item.DOI;}
        if(item.anio==='' || item.anio===null){temp_anio=" ";}else{temp_anio=item.anio;}
        if(item.idTipo==='' || item.idTipo===null){temp_idtipo=" ";}else{temp_idtipo=item.idTipo;}
        if(item.nombreTipo==='' || item.nombreTipo===null){temp_nombtipo=" ";}else{temp_nombtipo=item.nombreTipo;}
        if(item.fuente==='' || item.fuente===null){temp_fuente=" ";}else{temp_fuente = item.fuente;}
        udt.data.push({
          A: item.titulo,
          B: temp_doi,
          C: item.url,
          D: temp_anio,
          E: temp_idtipo,
          F: temp_nombtipo,
          G: item.nombreInvest,
          I: temp_fuente
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcelMyZone(edata, 'My_Impact ' + this.institutionName);
      this.showLoadingBar = false;
    });
  }




}
