import {Component,OnInit} from '@angular/core';
import {AdviserService} from 'src/app/services/adviser.service';
import {ActivatedRoute} from "@angular/router";
import {CommonService} from "../../../../services/common.service";
import {ExcelJson} from "../../../../interfaces/excel-json";
import {ExportService} from "../../../../services/export.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  id: any;
  dataSource: any[] = [];

  criteria = "";
  institutionName = '';

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'projects';
  showLoadingBar = false;

  search:string=""

  id_institucion = "";
  id_investigador = "";
  centros = "";
  lineas_invest = "";
  entidades_financ = "";
  alumnos = "";
  presupuestoDesde = "";
  presupuestoHasta = "";
  idsTiposProyecto = "";
  anios = "";
  responsive = true;
  selectedConvocatorias = ""



  currentYear = (new Date()).getFullYear();

  years: any[] = [];
  convocatorias: any[] = [];

  projectTypes: any[] = [];

  lineasInvestigacion: any[] = [];
  instituciones: any[] = [];
  investigadores: any[] = [];
  entidades_financiadoras: any[] = [];
  centros_investigacion: any[] = [];
  list_alumnos: any[] = [];

  mostrar:boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
              private adviserService: AdviserService,
              private commonService: CommonService,
              private exportService: ExportService) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.id) {
      this.id = 1;
    }
  }

  ngOnInit(): void {
    this.loadYears();
    this.loadConvocatorias()
    this.loadProjectTypes();
    this.loadLines();
    this.loadInstitutions();
    this.loadInvestigadores();
    this.loadCentrosInvestigacion();
    this.loadAlumnos();

    this.loadAdvisorInstitution()
    this.loadData();
  }

  loadData = () => {
    this.dataSource = [];
    this.totalItems = 0;
    this.showLoadingBar = true;
    this.criteria = `proyectos_invest?id_institucion=${this.id}`;
    if(this.id_investigador!=""){ this.criteria += "&id_investigador="+this.id_investigador }
    if(this.centros!=""){ this.criteria += "&centros="+this.centros }
    if(this.lineas_invest!=""){ this.criteria += "&lineas_invest="+this.lineas_invest }
    if(this.entidades_financ!=""){ this.criteria += "&entidades_financ="+this.entidades_financ }
    if(this.presupuestoDesde!=""){ this.criteria += "&presupuestoDesde="+this.presupuestoDesde }
    if(this.presupuestoHasta!=""){ this.criteria += "&presupuestoHasta=="+this.presupuestoHasta }
    if(this.idsTiposProyecto!=""){ this.criteria += "&idsTiposProyecto="+this.idsTiposProyecto }
    if(this.anios!=""){ this.criteria += "&anios=="+this.anios }
    if(this.selectedConvocatorias!=""){ this.criteria += "&convocatorias="+this.selectedConvocatorias }
    //console.log("this.criteria",this.criteria);
    this.adviserService.getProjectsData(this.criteria).subscribe((result: any) => {
      let pagination = this.commonService.paginateItems(result, this.pageNumber, this.pageSize);
      const buscar = this.search.toLowerCase()
      for(let item of pagination.data) {
        const nombre = item.nombre.toLowerCase()
        if(nombre.indexOf(buscar) !== -1) {
          this.dataSource.push(item)
        }
      }

      this.totalItems = this.dataSource.length;
      this.showLoadingBar = false;

    });
  }

  handlePageChange(event: any) {
    this.pageNumber = event;
    this.loadData();
  }

  loadYears = () => {
    this.years = [];
    let year = this.currentYear;
    let top = 2009;
    let checked = false;
    for (let i = year; i > top; i--) {
      this.years.push({year,checked});
      year--;
    }
    //console.log("years",this.years)
  }

  loadConvocatorias = () => {
    this.convocatorias = [];
    this.adviserService.getProjectsConvocatorias(this.id).subscribe(
      (result: any) => {
        for(let r of result){ this.convocatorias.push({id:r,checked:false}); }
      },
      (err: any) => {
        console.error(err)
      }
    );
  }

  loadLines = () => {
    this.lineasInvestigacion = [];
    this.adviserService.getLinesByAdviser(this.id).subscribe(
      (result: any) => {
        for(let r of result){ r.checked=false; }
        this.lineasInvestigacion = result;
      },
      (err: any) => {
      },
      () => {
      }
    );
  }

  loadInvestigadores = () => {
    this.investigadores = [];
    this.commonService.getInvestigadoresList(this.id).subscribe(
      (result: any) => {
        for(let r of result){ r.checked=false; }
        this.investigadores = result;
      },
      (err: any) => {
      },
      () => {
      }
    );
  }

  loadProjectTypes = () => {
    this.commonService.getTipoProyectos().subscribe(
      (result: any) => {
        for(let r of result){ r.checked=false; }
        this.projectTypes = result;
      },
      (err: any) => {
      },
      () => {
      }
    );
  }

  loadCentrosInvestigacion = () => {
    this.centros_investigacion = [];
    this.commonService.getCentrosInvestigacion(this.id).subscribe(
      (result: any) => {
        for(let r of result){ r.checked=false; }
        this.centros_investigacion = result;
      },
      (err: any) => {
      },
      () => {
      }
    );
  }

  loadAlumnos = () => {
    this.list_alumnos = [];
    this.commonService.getAlumnos(this.id).subscribe(
      (result: any) => {
        for(let r of result){ r.checked=false; }
        this.list_alumnos = result;
      },
      (err: any) => {
      },
      () => {
      }
    );
  }

  loadInstitutions = () => {
    this.instituciones = [];
    this.commonService.getInstitutions().subscribe(
      (result: any) => {
        for(let r of result){ r.checked=false; }
        this.instituciones = result;
      },
      (err: any) => {
      },
      () => {
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

  selectYear = (year: string) => {
    this.anios="";
    for(let item of this.years){
      if(item.year==year){
        if(item.checked){ item.checked=false; }else{ item.checked=true; }
      }
      if(item.checked){
        this.anios = this.anios.concat(item.year+' ');
      }
    }
    this.loadData();
  }

  selectConvocatoria = (convoc: string) => {
    this.selectedConvocatorias = "";
    for(let item of this.convocatorias){
      if(item.id==convoc){
        if(item.checked){ item.checked=false; }else{ item.checked=true; }
      }
      if(item.checked){
        this.selectedConvocatorias = this.selectedConvocatorias.concat(item.id+' ');
      }
    }
    //console.log("this.convocatorias",this.convocatorias)
    this.loadData();
  }

  selectLine = (lineId: any) => {
    this.lineas_invest = "";
    for(let item of this.lineasInvestigacion){
      if(item.id==lineId){
        if(item.checked){ item.checked=false; }else{ item.checked=true; }
      }
      if(item.checked){
        this.lineas_invest = this.lineas_invest.concat(item.id+' ');
      }
    }
    this.loadData();
  }

  selectInvestigadores = (investigadorId: any) => {
    this.id_investigador = "";
    for(let item of this.investigadores){
      if(item.id==investigadorId){
        if(item.checked){ item.checked=false; }else{ item.checked=true; }
      }
      if(item.checked){
        this.id_investigador = this.id_investigador.concat(item.id+' ');
      }
    }
    this.loadData();
  }

  selectProjectType = (projectTypeId: any) => {
    this.idsTiposProyecto = "";
    for(let item of this.projectTypes){
      if(item.id==projectTypeId){
        if(item.checked){ item.checked=false; }else{ item.checked=true; }
      }
      if(item.checked){
        this.idsTiposProyecto = this.idsTiposProyecto.concat(item.id+' ');
      }
    }
    this.loadData();
  }

  selectCentroInvestigacion = (centroInvestigacionId: any) => {
    this.centros = "";
    for(let item of this.centros_investigacion){
      if(item.id==centroInvestigacionId){
        if(item.checked){ item.checked=false; }else{ item.checked=true; }
      }
      if(item.checked){
        this.centros = this.centros.concat(item.id+' ');
      }
    }
    this.loadData();
  }

  selectAlumno = (alumnoId: any) => {
    this.alumnos = "";
    for(let item of this.list_alumnos){
      if(item.id==alumnoId){
        if(item.checked){ item.checked=false; }else{ item.checked=true; }
      }
      if(item.checked){
        this.alumnos = this.alumnos.concat(item.id+' ');
      }
    }
    this.loadData();
  }

  selectInstituciones = (institucionesId: any) => {
    if (!this.id_institucion.includes(institucionesId.toString())) {
      this.id_institucion = this.id_institucion.concat(' ' + institucionesId);
    } else {
      this.id_institucion = this.id_institucion.replace(' ' + institucionesId, '');
    }
    this.loadData();
  }

  clearFilter = () => {
    this.id_investigador="";
    this.centros="";
    this.lineas_invest="";
    this.entidades_financ="";
    this.alumnos="";
    this.presupuestoDesde="";
    this.presupuestoHasta="";
    this.idsTiposProyecto="";
    this.anios="";
    this.selectedConvocatorias="";
    this.ngOnInit();
  }

  exportToExcel = () => {
    this.criteria = `proyectos_invest?id_institucion=${this.id}&id_investigador=${this.id_investigador}&centros=${this.centros}&lineas_invest=${this.lineas_invest}&entidades_financ=${this.entidades_financ}&alumnos=${this.alumnos}&presupuestoDesde=${this.presupuestoDesde}&presupuestoHasta=${this.presupuestoHasta}&idsTiposProyecto=${this.idsTiposProyecto}&anios=${this.anios}&convocatorias=${this.selectedConvocatorias}`
    this.criteria += `&con_centros=&con_instituciones=&con_lineas_invest=&con_keywords=&con_estancias_invest=&con_productos=&con_colaboradores=&con_entidades_financ=`

    this.adviserService.getProjectsData(this.criteria).subscribe((result: any) => {

      const edata: Array<ExcelJson> = [];
      const udt: ExcelJson = {
        data: [
          {
            A: 'ID',
            B: 'Nombre',
            C: 'Tipo',
            D: 'Presupuesto',
            E: 'Objetivos',
            F: 'Número_Proyecto',
            G: 'Tipo_de_Financiamiento',
            H: 'Fecha_Inicio',
            I: 'Fecha_Fin',
            J: 'Duración_en_Dias',
            K: 'Monto_Beca',
            L: 'Num_convocatoria',
            M: 'Productos asociados',
            N: 'Alumnos',
            O: 'Colaboradores',
            P: 'Centros_Investigación',
            Q: 'Líneas_de_Investigación',
            R: 'Keywords',
            S: 'Estancias_de_Investigación',
            T: 'Entidades_financiadoras'

          }, // table header
        ],
        skipHeader: true,
      };
      result.forEach((item: any) => {
        let prodsScintra = item.productos_scintra.map((prodScintra: any) => { return prodScintra.titulo }).join(' ; ')
        let prodsNoScintra = item.productos_no_scintra.map((prodScintra: any) => { return prodScintra.titulo }).join(' ; ')
        let colaboradoresScintra = item.colaboradores.scintra.map((colab: any) => colab.nombre).join(' ; ')
        let colaboradoresNoScintra = item.colaboradores.no_scintra.map((colab: any) => colab.nombre).join(' ; ')

        udt.data.push({
          A: item.id,
          B: item.nombre,
          C: item.tipo,
          D: item.presupuesto,
          E: item.objetivos,
          F: item.num_proy,
          G: item.tipo_financ,
          H: item.fecha_inicio,
          I: item.fecha_fin,
          J: item.duracion_dias,
          K: item.monto_beca,
          L: item.num_convoc,
          M: prodsScintra
            + ((prodsScintra && prodsNoScintra) ? ' ; ' : '') + prodsNoScintra,
          N: item.alumnos.map((alum: any) => alum.nombre).join(' ; '),
          O: colaboradoresScintra
            + ((colaboradoresScintra && colaboradoresNoScintra) ? ' ; ' : '') + colaboradoresNoScintra,
          P: item.centros_de_investigacion.map((centro: any) => centro.nombre).join(' ; '),
          Q: item.lineas_de_investigacion.map((linea: any) => linea.nombre).join(' ; '),
          R: item.keywords.map((kw: any) => kw.keyword).join(' ; '),
          S: item.estancias_de_investigacion.map((est: any) => est.nombre).join(' ; '),
          T: item.entidades_financiadoras.map((ent: any) => ent.institution_name).join(' ; '),
        });
      });
      edata.push(udt);
      this.exportService.exportJsonToExcel(edata, 'Proyectos_' + this.institutionName);
      this.showLoadingBar = false;

    });
  }

  protected readonly length = length;

  mostrarFiltros(){
    if(this.mostrar){
      this.mostrar=false;
    }else{
      this.mostrar=true;
    }
  }

}
