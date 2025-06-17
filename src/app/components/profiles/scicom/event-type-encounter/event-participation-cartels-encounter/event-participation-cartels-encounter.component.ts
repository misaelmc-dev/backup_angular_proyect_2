import {Component, OnInit, Input, SecurityContext} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import Swal from "sweetalert2";
import * as moment from "moment/moment";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-event-participation-cartels-encounter',
  templateUrl: './event-participation-cartels-encounter.component.html',
  styleUrls: ['./event-participation-cartels-encounter.component.css']
})
export class EventParticipationCartelsEncounterComponent implements OnInit {

  @Input('eventoId') eventoId: number = 0;
  @Input('participacionId') participacionId: number = 0;

  eventoTipo: number = 4;
  cartelesTiposIds: any[] = [5,6];

  idRorCord: any = 0;

  areasConocimientoList: any[] = [];

  carteles: any[] = [];
  cartelesTipos: any[] = [];
  cartelesMetadatos: any[] = [];
  cartelesProgramasEstudio: any[] = [];
  cartelesProgramasEstudioList: any[] = [];
  cartelesProgramasEstudioTot: any[] = [];

  cartelId: number = 0;
  cartelTipoSelected: number = 0;
  cartelMetadatosId: number = 0;
  cartelTitulo: string;
  cartelDescripcion: string;
  cartelUrl: string;
  cartelAreaSelected: number = 0;
  cartelAreasDisponibles: any[] = [];
  cartelAreasGuardado: any[] = [];
  cartelAreas: any[] = [];
  cartelODSList: any[] = [];
  cartelODSSelected: number = 0;
  cartelODSDisponibles: any[] = [];
  cartelODSGuardado: any[] = [];
  cartelODS: any[] = [];
  cartelLugar: string;
  cartelAutores: any[] = [];
  cartelAutoresGuardado: any[] = [];
  cartelAutoresList: any[] = [];
  cartelAutorId: number = 0;
  cartelAutorNombre: string = '';
  cartelAutorCorreo: string = '';
  cartelAutorCarreraSearch: any = '';
  cartelAutorCarreraSelected: any = '';
  cartelAutorCarreraNombre: any[] = [];
  cartelAutorNumberSemestre: any = '';
  cartelAutorGenero: any = 'notsaid';
  cartelAutorPuesto: string = '';
  cartelAutorAfiliacionSearch: string = '';
  cartelAutorAfiliacionSelected: number = 0;
  cartelAutorAfiliacionesList: any[] = [];
  cartelAutorAfiliaciones: any[] = [];
  cartelAfiliacionesList: any[] = [];
  cartelAutorFecha: any = '';

  validCartelTipo: number = 0;
  validCartelTitulo: number = 0;

  paso:number=1;

  archivoTipo:number=0;
  archivoNombre:string="";
  archivoDescripcion:string="";
  archivoFile:any="";
  archivosTipos: any[] = [];
  archivosParticipaciones: any[] = [];

  cartelArchivosGuardados: any[] = [];
  cartelArchivos: any[] = [];

  validCartelNombre: number = 0;
  validCartelCorreo: number = 0;
  validCartelCarrera: number = 0;
  validCartelSemestre: number = 0;

  guardarAutoresTotal:number=0;
  guardarAutores:number=0;
  guardarArchivosTotal:number=0;
  guardarArchivos:number=0;

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageNumbersArrayActive:any=[];
  pageSize:number = 10;
  totalItems:number = 0;
  labelPagination:string = '';

  loadingCount: number = 0;

  constructor(private eventService: EventService,
              private domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.loadEvento();
    this.loadTrabajoTipos();
    this.loadAreasConocimiento();
    this.loadODS();
    this.loadTipoArchivos()
    this.loadWork()
  }

  loadEvento(){
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.idRorCord = res[0].rors_editoras.filter((value: any) => value.pivot.creador == true)[0].id;
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  loadTrabajoTipos() {
    if (this.eventoId != 0 && this.eventoTipo != 0) {
      this.loadingCount++
      this.eventService.getWorkTypeList(this.eventoId, this.eventoTipo).subscribe((resTrabTip: any) => {
        this.loadingCount--;
        let auxTiposTrabajos = [];
        for(let tt of resTrabTip){
          for(let ct of this.cartelesTiposIds){
            if(tt.id == ct){
              auxTiposTrabajos.push(tt)
            }
          }
        }
        this.cartelesTipos=auxTiposTrabajos
        //console.log("this.cartelesTipos",this.cartelesTipos)
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron los tipos de trabajo del evento'});
        console.error(err)
      });
    }
  }

  loadAreasConocimiento() {
    this.loadingCount++
    this.eventService.getArea().subscribe((resAreas: any) => {
      this.loadingCount--
      this.areasConocimientoList = resAreas;
      //console.log("resAreas",resAreas)
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron las areas de conocimiento del sistema'});
      console.error(err)
    });
  }

  loadODS() {
    this.loadingCount++
    this.eventService.getODS().subscribe((resODS: any) => {
      this.loadingCount--
      this.cartelODSList = resODS;
      //console.log("resODS",resODS)
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron lOS ODS del sistema'});
      console.error(err)
    });
  }

  loadWork() {
    if (this.eventoId != 0 && this.eventoTipo != 0) {
      this.loadingCount++
      this.eventService.getWorkByPart(this.eventoId, this.participacionId).subscribe((resTrab: any) => {
        this.loadingCount--
        let auxCarteles = []
        for(let rt of resTrab){
          for(let ct of this.cartelesTiposIds)
          if(rt.id_tipo_trabajo==ct){
            auxCarteles.push(rt);
          }
        }
        this.carteles = auxCarteles;
        //console.log("this.carteles",this.carteles)
        if(resTrab.length>0){
          this.loadDatos();
          this.loadAutores();
          this.loadArchivosParticipaciones();
          this.loadPagination(1,this.carteles)
        }
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron los carteles del evento especificado'});
        console.error(err)
      });
    }
  }

  loadDatos() {
    if (this.carteles.length > 0) {
      const idsCarteles: string = this.carteles.map((value: any) => value.id).join(' ');
      //console.log("idsConf", idsConf)
      const idsIdiomas: string = "150"
      this.loadingCount++
      this.eventService.getMetadatosByWorksAndIdiomId(this.eventoId, idsCarteles, idsIdiomas).subscribe((resMeta: any) => {
        this.loadingCount--
        //console.log("resMeta",resMeta)
        this.cartelesMetadatos = resMeta;
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron los trabajos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadAutores(){
    if(this.carteles.length>0){
      const idsCarteles = this.carteles.map((value: any) => value.id).join(' ');
      this.loadingCount++
      this.eventService.getAuthorByWorks(this.eventoId,idsCarteles).subscribe((resAutores: any) => {
        this.loadingCount--
        this.cartelAutoresList = resAutores;
        //console.log("resAutores",resAutores)
        this.orderByAut(this.cartelAutoresList)
        if(this.cartelAutoresList.length>0){
          const arrIdsAutoresTrab = this.cartelAutoresList.map((value: any) => value.id).join(' ');
          this.loadingCount++
          this.eventService.getRorsByAuthor(arrIdsAutoresTrab).subscribe((resAfil: any) => {
            this.loadingCount--
            this.cartelAfiliacionesList = resAfil;
            //console.log("this.conferenciaAfiliaciones",this.conferenciaAfiliaciones)
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se cargaron los datos de la institución especificada'});
            console.error(err)
          });
          const idsProgramas = this.cartelAutoresList.map((value: any) => value.id_programa_estudio);
          this.loadingCount++
          this.eventService.getProgramasEstudioByIds([this.idRorCord],idsProgramas).subscribe((resProg: any) => {
            this.loadingCount--
            this.cartelesProgramasEstudioList = resProg
            for(let pe of this.cartelesProgramasEstudioList){
              this.cartelesProgramasEstudioTot.push(pe)
            }
            //console.log("this.cartelesProgramasEstudioList",this.cartelesProgramasEstudioList)
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
            console.error(err)
          });
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los autores del evento especificado'});
        console.error(err)
      });
    }
  }

  loadTipoArchivos(){
    this.loadingCount++
    this.eventService.getFileTypeListByEventType(this.eventoTipo).subscribe((resTipArch: any) => {
      this.loadingCount--
      let auxTiposArchivo:any=[];
      for(let ta of resTipArch){
        if(ta.codigo_interno=="cartelUvmUtecTrab" ||
          ta.codigo_interno=="reconocTrab" ||
          ta.codigo_interno=="trabajo"){
          auxTiposArchivo.push(ta);
        }
      }
      this.archivosTipos = auxTiposArchivo;
      for(let at of this.archivosTipos){
        if(at.codigo_interno=="cartelUvmUtecTrab"){at.real="CV ejecutivo del ponente"}
        if(at.codigo_interno=="reconocTrab"){at.real="Reconocimiento a trabajo"}
        if(at.codigo_interno=="trabajo"){at.real="Otro"}
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de archivo'});
      console.error(err)
    });
  }

  loadArchivosParticipaciones(){
    let idsCarteles = this.carteles.map((value: any) => value.id)
    this.loadingCount++
    this.eventService.getFileListByWork(this.eventoId,idsCarteles).subscribe((resArchPart: any) => {
      this.loadingCount--
      this.archivosParticipaciones = resArchPart;
      //console.log("resArchPart",resArchPart)
      //this.loadPagination2(1,resArchPart);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los archivos de la participacion'});
      console.error(err)
    });
  }

  searchCarrera(){
    if(this.cartelAutorCarreraSearch && this.cartelAutorCarreraSearch!='') {
      this.loadingCount++
      this.eventService.getProgramasEstudioByRors([this.idRorCord],this.cartelAutorCarreraSearch).subscribe((resProg: any) => {
        this.loadingCount--
        this.cartelesProgramasEstudio = resProg.slice(0, 50)
        for(let pe of this.cartelesProgramasEstudio){
          this.cartelesProgramasEstudioTot.push(pe)
        }
        //console.log("this.cartelesProgramasEstudio",this.cartelesProgramasEstudio)
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
        console.error(err)
      });
    }
  }

  searchAfiliaciones(){
    if(this.cartelAutorAfiliacionSearch!='') {
      this.loadingCount++
      this.eventService.searchRor(this.cartelAutorAfiliacionSearch).subscribe((resAfil: any) => {
        this.loadingCount--
        this.cartelAutorAfiliacionesList = resAfil.slice(0, 50);
        let afiliacionesDisponibles = this.cartelAutorAfiliacionesList;
        for (let al of this.cartelAutorAfiliaciones) {
          afiliacionesDisponibles = afiliacionesDisponibles.filter((afil: any) => afil.id != al.id)
        }
        this.cartelAutorAfiliacionesList = afiliacionesDisponibles;
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron las posibles instituciones de afiliación'});
        console.error(err)
      });
    }
  }

  openNewCartelModal() {
    this.cartelId = 0;
    this.cartelTipoSelected = 0;
    this.cartelTitulo = "";
    this.cartelDescripcion = "";
    this.cartelUrl = "";
    this.cartelAreaSelected = 0;
    this.cartelAreasGuardado = [];
    this.cartelAreasDisponibles = this.areasConocimientoList;
    this.cartelAreas = [];
    this.cartelODSSelected = 0;
    this.cartelODSGuardado = [];
    this.cartelODSDisponibles = this.cartelODSList;
    this.cartelODS = [];
    this.cartelLugar = "";
    this.cartelAutores = [];
    this.cartelArchivos = [];
    this.validCartelTipo = 0;
    this.validCartelTitulo = 0;
  }

  openUpdateCartelModal(cartel:any){
    this.cartelId = null;
    this.cartelTipoSelected = null;
    this.cartelMetadatosId = null;
    this.cartelTitulo = null;
    this.cartelDescripcion = null;
    this.cartelUrl = null;
    this.cartelAreasDisponibles = [];
    this.cartelAreaSelected = 0;
    this.cartelAreasGuardado = [];
    this.cartelAreas = [];
    this.cartelAreasDisponibles = [];
    this.cartelODSDisponibles = [];
    this.cartelODSSelected = 0;
    this.cartelODSGuardado = [];
    this.cartelODS = [];
    this.cartelODSDisponibles = [];
    this.cartelLugar = null;
    this.cartelAutores = [];
    this.cartelArchivos = [];

    this.validCartelTitulo = 0;
    this.cartelId = cartel.id;
    this.cartelTipoSelected = cartel.id_tipo_trabajo;
    this.cartelMetadatosId = cartel.conjuntos_de_metadatos_de_trabajo[0]?.id;
    for(let cm of this.cartelesMetadatos){
      if(cartel.id==cm.id_trabajo){
        this.cartelTitulo = cm.titulo;
        this.cartelDescripcion = cm.resumen;
        this.cartelUrl = cm.url;
      }
    }
    this.cartelAreasDisponibles = this.areasConocimientoList;
    this.cartelAreaSelected = 0;
    this.cartelAreasGuardado = cartel.areas_de_conocimiento;
    this.cartelAreas = [];
    for(let cac of cartel.areas_de_conocimiento){
      for(let acl of this.areasConocimientoList){
        if(cac.id==acl.id){
          this.cartelAreas.push(acl);
          this.cartelAreasDisponibles = this.cartelAreasDisponibles.filter((area: any) => area.id != cac.id);
        }
      }
    }

    this.cartelODSDisponibles = this.cartelODSList;
    this.cartelODSSelected = 0;
    this.cartelODSGuardado = cartel.objetivos_de_desarrollo_sostenible;
    this.cartelODS = [];
    for(let cac of cartel.objetivos_de_desarrollo_sostenible){
      for(let acl of this.cartelODSList){
        if(cac.id==acl.id){
          this.cartelODS.push(acl);
          this.cartelODSDisponibles = this.cartelODSDisponibles.filter((area: any) => area.id != cac.id);
        }
      }
    }

    this.cartelLugar = cartel.lugar_obtenido_cartel_uvmunitec;

    this.cartelAutores = [];
    for(let cal of this.cartelAutoresList){
      if(cartel.id==cal.id_trabajo){
        this.cartelAutores.push(cal);
      }
    }
    this.reloadAutores();
    this.cartelArchivos = [];
    for(let ap of this.archivosParticipaciones){
      if(cartel.id==ap.id_trabajo){
        this.cartelArchivos.push(ap);
      }
    }
    this.reloadArchivos();
  }

  openViewCartelModal(cartel:any){
    this.cartelId = null
    this.cartelTipoSelected = null;
    this.cartelMetadatosId = null;
    this.cartelTitulo = null;
    this.cartelDescripcion = null;
    this.cartelUrl = null;
    this.cartelAreasDisponibles = [];
    this.cartelAreaSelected = null;
    this.cartelAreasGuardado = [];
    this.cartelAreas = [];
    this.cartelAreasDisponibles = [];
    this.cartelODSDisponibles = [];
    this.cartelODSSelected = 0;
    this.cartelODSGuardado = [];
    this.cartelODS = [];
    this.cartelODSDisponibles = [];
    this.cartelLugar = null;
    this.cartelAutores = [];

    this.validCartelTitulo = 0;
    this.cartelId = cartel.id;
    this.cartelTipoSelected = cartel.id_tipo_trabajo;
    this.cartelMetadatosId = cartel.conjuntos_de_metadatos_de_trabajo[0]?.id;
    for(let cm of this.cartelesMetadatos){
      if(cartel.id==cm.id_trabajo){
        this.cartelTitulo = cm.titulo;
        this.cartelDescripcion = cm.resumen;
        this.cartelUrl = cm.url;
      }
    }
    this.cartelAreasDisponibles = this.areasConocimientoList;
    this.cartelAreaSelected = 0;
    this.cartelAreasGuardado = cartel.areas_de_conocimiento;
    this.cartelAreas = [];
    for(let cac of cartel.areas_de_conocimiento){
      for(let acl of this.areasConocimientoList){
        if(cac.id==acl.id){
          this.cartelAreas.push(acl);
          this.cartelAreasDisponibles = this.cartelAreasDisponibles.filter((area: any) => area.id != cac.id);
        }
      }
    }

    this.cartelODSDisponibles = this.cartelODSList;
    this.cartelODSSelected = 0;
    this.cartelODSGuardado = cartel.objetivos_de_desarrollo_sostenible;
    this.cartelODS = [];
    for(let cac of cartel.objetivos_de_desarrollo_sostenible){
      for(let acl of this.cartelODSList){
        if(cac.id==acl.id){
          this.cartelODS.push(acl);
          this.cartelODSDisponibles = this.cartelODSDisponibles.filter((area: any) => area.id != cac.id);
        }
      }
    }

    this.cartelLugar = cartel.lugar_obtenido_cartel_uvmunitec;

    this.cartelAutores = [];
    for(let cal of this.cartelAutoresList){
      if(cartel.id==cal.id_trabajo){
        this.cartelAutores.push(cal);
      }
    }
    this.reloadAutores();
  }

  openNewAutoresModal() {
    this.cartelAutorId = 0;
    this.cartelAutorNombre = '';
    this.cartelAutorCorreo = '';
    this.cartelAutorCarreraSearch = '';
    this.cartelAutorCarreraSelected = 0;
    this.cartelAutorCarreraNombre = [];
    this.cartelesProgramasEstudio = [];
    this.cartelAutorNumberSemestre = '';
    this.cartelAutorGenero = 'notsaid';
    this.cartelAutorPuesto = '';
    this.cartelAutorAfiliacionSearch = '';
    this.cartelAutorAfiliacionesList = [];
    this.cartelAutorAfiliaciones = [];
    this.validCartelNombre = 0;
    this.validCartelCorreo = 0;
  }

  openViewAutoresModal(autor: any) {
    this.cartelAutorId = autor.id;
    this.cartelAutorNombre = autor.nombre;
    this.cartelAutorCorreo = autor.correo;
    this.cartelAutorFecha = autor.fecha;
    this.cartelAutorCarreraSearch = '';
    this.cartelAutorCarreraSelected = autor.idCarrera;
    this.cartelAutorCarreraNombre = autor.carrera;
    this.cartelesProgramasEstudio = [];
    this.cartelAutorNumberSemestre = autor.semestre;
    this.cartelAutorGenero = autor.genero;
    this.cartelAutorPuesto = autor.puesto;
    this.cartelAutorAfiliacionesList = [];
    this.cartelAutorAfiliacionSearch = '';
    this.cartelAutorAfiliaciones = autor.afiliaciones;
    this.validCartelNombre = 0;
    this.validCartelCorreo = 0;
  }

  openUpdateAutoresModal(autor: any) {
    this.cartelAutorId = autor.id;
    this.cartelAutorNombre = autor.nombre;
    this.cartelAutorCorreo = autor.correo;
    this.cartelAutorFecha = autor.fecha;
    this.cartelAutorCarreraSearch = '';
    this.cartelAutorCarreraSelected = autor.idCarrera;
    this.cartelAutorCarreraNombre = autor.carrera;
    this.cartelesProgramasEstudio = [];
    this.cartelAutorNumberSemestre = autor.semestre;
    this.cartelAutorGenero = autor.genero;
    this.cartelAutorPuesto = autor.puesto;
    this.cartelAutorAfiliacionesList = [];
    this.cartelAutorAfiliacionSearch = '';
    this.cartelAutorAfiliaciones = autor.afiliaciones;
    this.validCartelNombre = 0;
    this.validCartelCorreo = 0;
  }

  openNewArchivosModal(){
    this.paso=1;
    this.archivoTipo=0;
    this.archivoNombre="";
    this.archivoDescripcion="";
    this.archivoFile="";
  }

  cambiarPaso(cambio?:string){
    if(this.paso>=1 && this.paso<=2){
      if(cambio=="anterior"){
        this.paso--
      }else if(cambio=="siguiente"){
        this.paso++
      }
    }
  }

  cambiarTipo(){
    this.archivoNombre="";
    this.archivoDescripcion="";
    this.archivoFile="";
  }

  cambiarGeneroCartel(valor:string){
    if(this.cartelAutorGenero!=valor){
      this.cartelAutorGenero=valor;
      console.log("this.cartelAutorGenero",this.cartelAutorGenero)
    }
  }

  reloadAutores(){
    let auxCartelesAutores = [];
    let auxCartelesAutoresCarrera = [];
    var momento = new Date().getTime()
    //console.log("this.cartelAutores",this.cartelAutores)
    for(let ca of this.cartelAutores){
      let auxCartelesAfiliaciones = [];
      for(let a of ca.rors){
        for(let cal of this.cartelAfiliacionesList){
          if(a.id==cal.id){
            auxCartelesAfiliaciones.push(cal)
          }
        }
      }
      for(let pe of this.cartelesProgramasEstudioList){
        if(pe.id==ca.id_programa_estudio){
          auxCartelesAutoresCarrera=pe;
        }
      }
      momento++
      var autor = {
        id:ca.id,
        nombre: ca.nombre,
        correo: ca.correo,
        idCarrera: ca.id_programa_estudio,
        carrera: [auxCartelesAutoresCarrera],
        semestre: ca.semest_cuatrimest_uvmutec,
        genero: ca.genero,
        puesto: ca.puesto,
        afiliaciones: auxCartelesAfiliaciones,
        fecha: momento
      }
      auxCartelesAutores.push(autor)
    }
    this.cartelAutores=auxCartelesAutores;
    //console.log("this.cartelAutores",this.cartelAutores);
    this.orderBy(this.cartelAutores)
    this.cartelAutoresGuardado=this.newObjectReference(this.cartelAutores);
  }

  reloadArchivos(){
    let auxCartelArchivos = [];
    var momento = new Date().getTime()
    for(let ca of this.cartelArchivos){
      var tipo = "";
      //console.log("this.archivosTipos",this.archivosTipos)
      for(let ta of this.archivosTipos){if(ta.id==ca.id_tipo_archivo){tipo=ta.real;}}
      momento++
      var archivo:any = {
        id:ca.id,
        tipoId:ca.id_tipo_archivo,
        tipo:tipo,
        nombre:ca.nombre,
        descripcion:ca.descripcion,
        uri:ca.uri,
        fecha: momento
      }
      auxCartelArchivos.push(archivo)
      //console.log("archivo",archivo)
    }
    this.cartelArchivos=auxCartelArchivos;
    //console.log("auxConferenciaArchivos",auxConferenciaArchivos)
    this.orderByTipo(this.cartelArchivos)
    //console.log("this.conferenciaArchivos",this.conferenciaArchivos)
    this.cartelArchivosGuardados=this.newObjectReference(this.cartelArchivos);
  }

  addArea() {
    for (let a of this.cartelAreasDisponibles) {
      if (this.cartelAreaSelected == a.id) {
        this.cartelAreas.push(a);
      }
    }
    this.cartelAreasDisponibles = this.cartelAreasDisponibles.filter((area: any) => area.id != this.cartelAreaSelected);
    this.cartelAreaSelected = 0;
  }

  removeArea(areaId: number) {
    for (let a of this.cartelAreas) {
      if (areaId == a.id) {
        this.cartelAreasDisponibles.push(a);
      }
    }
    this.cartelAreas = this.cartelAreas.filter((area: any) => area.id != areaId);
    this.cartelAreaSelected = 0;
  }

  addODS() {
    for (let a of this.cartelODSDisponibles) {
      if (this.cartelODSSelected == a.id) {
        this.cartelODS.push(a);
      }
    }
    this.cartelODSDisponibles = this.cartelODSDisponibles.filter((ods: any) => ods.id != this.cartelODSSelected);
    this.cartelODSSelected = 0;
  }

  removeODS(ODSId: number) {
    for (let a of this.cartelODS) {
      if (ODSId == a.id) {
        this.cartelODSDisponibles.push(a);
      }
    }
    this.cartelODS = this.cartelODS.filter((ods: any) => ods.id != ODSId);
    this.cartelODSSelected = 0;
  }

  addAutor() {
    var carrera:any = "";
    for(let cpe of this.cartelesProgramasEstudio){
      if(cpe.id==this.cartelAutorCarreraSelected){
        carrera = cpe;
      }
    }
    var autor = {
      nombre: this.cartelAutorNombre,
      correo: this.cartelAutorCorreo,
      idCarrera: this.cartelAutorCarreraSelected,
      carrera: carrera,
      semestre: this.cartelAutorNumberSemestre,
      genero:this.cartelAutorGenero,
      puesto:this.cartelAutorPuesto,
      afiliaciones: this.cartelAutorAfiliaciones,
      fecha: moment(new Date()).format('YYYYMMDDHHmmss')
    }
    this.cartelAutores.push(autor);
    //console.log("this.cartelAutores",this.cartelAutores)
  }

  updateAutor() {
    this.cartelAutores = this.cartelAutores.filter((autor: any) => autor.fecha != this.cartelAutorFecha);
    var carrera:any = "";
    for(let cpe of this.cartelesProgramasEstudioTot){
      if(cpe.id==this.cartelAutorCarreraSelected){
        carrera = cpe;
      }
    }
    var autor = {
      id: this.cartelAutorId,
      nombre: this.cartelAutorNombre,
      correo: this.cartelAutorCorreo,
      idCarrera: this.cartelAutorCarreraSelected,
      carrera: carrera,
      semestre: this.cartelAutorNumberSemestre,
      genero:this.cartelAutorGenero,
      puesto:this.cartelAutorPuesto,
      afiliaciones: this.cartelAutorAfiliaciones,
      fecha: moment(new Date()).format('YYYYMMDDHHmmss')
    }
    this.cartelAutores.push(autor);
    this.orderBy(this.cartelAutores)
  }

  removeAutores(autorFecha: number){
    let auxAutores = this.cartelAutores;
    this.cartelAutores = auxAutores.filter((afil: any) => afil.fecha != autorFecha);
  }

  addAfiliaciones() {
    for (let caad of this.cartelAutorAfiliacionesList) {
      if (this.cartelAutorAfiliacionSelected == caad.id) {
        this.cartelAutorAfiliaciones.push(caad);
        this.cartelAutorAfiliacionesList = this.cartelAutorAfiliacionesList.filter((afil: any) => afil.id != caad.id);
      }
    }
    this.cartelAutorAfiliacionSelected = 0;
  }

  removeAfiliaciones(afilId: number) {
    var afilRev: any = [];
    for (let caad of this.cartelAutorAfiliaciones) {
      if (afilId == caad.id) {
        afilRev = caad;
      }
    }
    if (this.cartelAutorAfiliacionesList.length > 0) {
      this.cartelAutorAfiliaciones.push(afilRev);
    }
    this.cartelAutorAfiliaciones = this.cartelAutorAfiliaciones.filter((afil: any) => afil.id != afilId);
    this.cartelAutorAfiliacionSelected = 0;
    //console.log("this.conferenciaAutorAfiliaciones", this.conferenciaAutorAfiliaciones);
  }

  addArchivo(){
    var tipo = "";
    for(let ta of this.archivosTipos){if(ta.id==this.archivoTipo){tipo=ta.real;}}
    var archivo:any = {
      tipoId:this.archivoTipo,
      tipo:tipo,
      nombre:this.archivoNombre,
      descripcion:this.archivoDescripcion,
      archivo:this.archivoFile,
      fecha: moment(new Date()).format('YYYYMMDDHHmmss')
    }
    this.cartelArchivos.push(archivo);
    this.orderByTipo(this.cartelArchivos)
  }

  removeArchivo(fecha:any){
    let auxAutores = this.cartelArchivos;
    this.cartelArchivos = auxAutores.filter((afil: any) => afil.fecha != fecha);
  }

  viewArchivo(archivo:any){
    if(archivo.uri){
      this.loadingCount++
      this.eventService.viewEventFile(archivo.uri).subscribe((resfile: Blob) => {
        this.loadingCount--
        let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
        let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
        // @ts-ignore
        window.open(fileUrl.toString(), '_blank');
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se descargó el archivo especificado del evento'});
        console.error(err)
      });
    }else if(archivo.archivo){
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(archivo.archivo))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    }
  }

  extractFileFromEvent(event: any) {
    this.archivoFile = event.target.files[0]
  }

  validarTipo() {
    if (this.cartelTipoSelected==0) {
      this.validCartelTipo = 1;
    } else {
      this.validCartelTipo = 0;
    }
  }

  validarTitulo() {
    if (!this.cartelTitulo || this.cartelTitulo=="") {
      this.validCartelTitulo = 1;
    } else if (this.cartelTitulo == null) {
      this.validCartelTitulo = 1;
    } else {
      this.validCartelTitulo = 0;
    }
  }

  validarFormulario(){
    this.validarTipo();
    this.validarTitulo();
    if (this.validCartelTipo==0 && this.validCartelTitulo==0){
      if(this.cartelId==0){
        this.saveCartel();
      }else{
        this.updateCartel();
      }
    }
  }

  validarNombre() {
    if(!this.cartelAutorNombre || this.cartelAutorNombre==""){
      this.validCartelNombre = 1;
    }else{
      this.validCartelNombre = 0;
    }
  }

  validarCorreo() {
    if (/[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[a-zA-Z0-9]$/.test(this.cartelAutorCorreo)) {
      this.validCartelCorreo = 0;
    }else if(this.cartelAutorCorreo==""){
      this.validCartelCorreo = 0;
    }else if(!this.cartelAutorCorreo){
      this.validCartelCorreo = 0;
    }else {
      this.validCartelCorreo = 2;
    }
  }

  validarCarrera(){
    if (this.cartelAutorCarreraSelected==0) {
      this.validCartelCarrera = 1;
    } else {
      this.validCartelCarrera = 0;
    }
  }

  validarSemestre(){
    if (this.cartelAutorNumberSemestre==0) {
      this.validCartelSemestre = 1;
    } else {
      this.validCartelSemestre = 0;
    }
  }

  validarAutor() {
    this.validarNombre();
    this.validarCorreo();
    this.validarCarrera();
    this.validarSemestre();
    if (this.validCartelNombre==0 && this.validCartelCorreo==0 && this.validCartelCarrera==0 && this.validCartelSemestre==0) {
      if(this.cartelAutorId==0){
        this.addAutor();
      }else{
        this.updateAutor();
      }
    }
  }

  orderBy(sin_orden: any) {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1, n2) => {
      if (n1.nombre > n2.nombre) {
        return 1;
      }
      if (n1.nombre < n2.nombre) {
        return -1;
      }
      return 0;
    });
  }

  orderByAut(sin_orden: any) {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1, n2) => {
      if (n1.nombre > n2.nombre) {
        return 1;
      }
      if (n1.nombre < n2.nombre) {
        return -1;
      }
      return 0;
    });
  }

  orderByTipo(sin_orden: any) {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1, n2) => {
      if (n1.tipo > n2.tipo) {
        return 1;
      }
      if (n1.tipo < n2.tipo) {
        return -1;
      }
      return 0;
    });
  }

  getCommaSeparatedAuthorListHtml(idTrab: any) {
    return this.cartelAutoresList.filter((value) => { return value.id_trabajo == idTrab})
      .map((value: any) => {return value.nombre}).join(',<br>')
  }

  newObjectReference(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

  saveCartel() {
    this.loadingCount++
    this.eventService.addWorkToParticipation(this.participacionId, 1, this.cartelTipoSelected, 1).subscribe((res: any) => {
      this.loadingCount--
      this.cartelId = res;
      //console.log("se creo la conferencia");
      this.saveRefrendo();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se guardaron los datos del cartel especificado'});
      console.error(err)
    });
  }

  saveRefrendo() {
    var refrendo = 1;
    this.loadingCount++
    if(this.cartelLugar=='0'){this.cartelLugar=''}
    this.eventService.updateCartel(this.cartelId, refrendo,this.cartelLugar).subscribe((resUpCart: any) => {
      this.loadingCount--
      //console.log("se agrego el refrendo a la conferencia");
      this.saveMetadatos();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se actualizó el cartel especificado'});
      console.error(err)
    });
  }

  saveMetadatos() {
    if (this.cartelTitulo && this.cartelTitulo != "") {
      var idiomaId = 150;
      if (!this.cartelDescripcion){this.cartelDescripcion = ""}
      if (!this.cartelUrl){this.cartelUrl = ""}
      this.loadingCount++
      this.eventService.addMetadatos(this.cartelId, idiomaId, this.cartelTitulo, this.cartelDescripcion, this.cartelUrl).subscribe((res: any) => {
        this.loadingCount--
        this.saveArea();
        //console.log("se agregaron los metadatos de la conferencia");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregaron los metadatos al cartel especificado'});
        console.error(err)
      });
    }
  }

  saveArea(update?:boolean) {
    if (this.cartelAreas.length != 0) {
      let idsCarteles: any = this.cartelAreas.map(value => value.id).join(' ');
      this.loadingCount++
      this.eventService.addArea(this.cartelId, idsCarteles).subscribe((res: any) => {
        this.loadingCount--
        if(update){ this.updateODS() }else{ this.saveODS() }
        //console.log("Se agregaron áreas del conocimiento");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregaron las áreas de conocimiento al trabajo especificado'});
        console.error(err)
      });
    }else{
      if(update){ this.updateODS() }else{ this.saveODS() }
    }
  }

  saveODS(update?:boolean) {
    if (this.cartelODS.length != 0) {
      let idsODS: any = this.cartelODS.map(value => value.id).join(' ');
      this.loadingCount++
      this.eventService.addODS(this.cartelId, idsODS).subscribe((res: any) => {
        this.loadingCount--
        if(update){ this.updateAutoresCartel() }else{ this.saveAutores() }
        //console.log("Se agregaron áreas del conocimiento");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregaron las áreas de conocimiento al trabajo especificado'});
        console.error(err)
      });
    }else{
      if(update){ this.updateAutoresCartel() }else{ this.saveAutores() }
    }
  }

  saveAutores(){
    if(this.cartelAutores.length>0){
      //console.log("this.conferenciaAutores",this.conferenciaAutores)
      for(let a of this.cartelAutores){

        this.loadingCount++
        this.eventService.addWorkAuthor(this.cartelId,a.nombre,a.correo).subscribe((resAutor: any) => {
          this.loadingCount--

          var autorId = resAutor;
          var puesto = "";
          if(a.puesto){puesto=a.puesto}

          this.loadingCount++
          this.eventService.updateAuthorOfCartel(autorId,a.nombre,a.correo,a.idCarrera,a.semestre,a.genero,puesto).subscribe((resAutor: any) => {
            this.loadingCount--
            var autorId = resAutor;

            if(a.afiliaciones.length != 0) {
              var auxAfil: any[] = a.afiliaciones;
              const idsAfil: any = auxAfil.map(value => value.id).join(' ');
              //console.log("idsAfil",idsAfil)
              this.loadingCount++
              this.eventService.addInstitucionToAutor(autorId, idsAfil).subscribe((res: any) => {
                this.loadingCount--
                this.saveArchivos();
                //console.log("se agrego la institución al autor especificado");
              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se agregó la institución al autor especificado'});
                console.error(err)
              });
            }else{
              this.saveArchivos();
            }

          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se actualizaron los datos del autor especificado'});
            console.error(err)
          });

          //console.log("Se agrego autor", a.nombre)
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se agregó el autor al trabajo especificado'});
          console.error(err)
        });
      }
    }else{
      this.saveArchivos();
    }
  }

  saveArchivos(){
    if(this.cartelArchivos.length>0){
      //console.log("this.conferenciaArchivos",this.conferenciaArchivos)
      for(let ca of this.cartelArchivos){
        this.loadingCount++
        //console.log("datos",ca.nombre, ca.descripcion, this.eventoId, ca.tipoId, this.conferenciaId, ca.archivo)
        this.eventService.addFileWork(ca.nombre, ca.descripcion, this.eventoId, ca.tipoId, this.cartelId, ca.archivo).subscribe((res: any) => {
          this.loadingCount--
          console.log("se agrego el archivo a el cartel");
          this.loadWork();
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se agregó el archivo al trabajo especificado'});
          console.error(err)
        });
      }
    }else{
      this.loadWork();
    }
  }

  updateCartel(){
    if (this.cartelTitulo && this.cartelTitulo != "" && this.cartelTipoSelected!=0) {
      this.loadingCount++
      if(this.cartelLugar=='0'){this.cartelLugar=''}
      this.eventService.updateCartelLugar(this.cartelId,this.cartelLugar).subscribe((res: any) => {
        this.loadingCount--
        //console.log("se agrego el refrendo a la conferencia");
        this.updateMetadatos();
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se actualizó el cartel especificado'});
        console.error(err)
      });
    }
  }

  updateMetadatos(){
    if (!this.cartelDescripcion){this.cartelDescripcion = ""}
    if (!this.cartelUrl){this.cartelUrl = ""}
    this.loadingCount++
    this.eventService.updateMetadatos(this.cartelMetadatosId,this.cartelTitulo,this.cartelDescripcion,this.cartelUrl).subscribe((resMeta: any) => {
      this.loadingCount--
      this.updateArea();
      //console.log("se actualizaron los metadatos");
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se actualizaron los metadatos con el id especificado'});
      console.error(err)
    });
  }

  updateArea(){
    if (this.cartelAreasGuardado.length>0) {
      let idsAreas: any = this.cartelAreasGuardado.map(value => value.id).join(' ');
      //console.log("idsAreas",idsAreas)
      this.loadingCount++
      this.eventService.removeArea(this.cartelId, idsAreas).subscribe((res: any) => {
        this.loadingCount--
        this.saveArea(true);
        //console.log("se actualizaron areas del conocimiento");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se eliminó el area conocimiento trabajadpr especificado'});
        console.error(err)
      });
    }else{
      this.saveArea(true);
    }
  }

  updateODS(){
    if (this.cartelODSGuardado.length>0) {
      let idsODS: any = this.cartelODSGuardado.map(value => value.id).join(' ');
      //console.log("idsAreas",idsAreas)
      this.loadingCount++
      this.eventService.removeODS(this.cartelId, idsODS).subscribe((res: any) => {
        this.loadingCount--
        this.saveODS(true);
        //console.log("se actualizaron areas del conocimiento");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se eliminó el area conocimiento trabajadpr especificado'});
        console.error(err)
      });
    }else{
      this.saveODS(true);
    }
  }

  updateAutoresCartel(){
    let auxAutoresNoMover:any = [];
    for(let cag of this.cartelAutoresGuardado){
      for(let ca of this.cartelAutores){
        if(ca.id){
          if(cag.id==ca.id){
            auxAutoresNoMover.push(ca)
          }
        }
      }
    }
    let auxAutoresDel = this.cartelAutoresGuardado;
    for(let nm of auxAutoresNoMover){
      auxAutoresDel = auxAutoresDel.filter( (a:any) => a.id != nm.id)
    }
    let auxAutoresAdd = this.cartelAutores;
    for(let nm of this.cartelAutores){
      auxAutoresAdd = auxAutoresAdd.filter( (a:any) => !a.id)
    }

    this.guardarAutoresTotal=0;
    this.guardarAutores=1;
    if(auxAutoresNoMover.length>0){this.guardarAutoresTotal++}
    if(auxAutoresAdd.length>0){this.guardarAutoresTotal++}
    if(auxAutoresDel.length>0){this.guardarAutoresTotal++}
    //console.warn("this.guardarAutoresTotal",this.guardarAutoresTotal)

    if(auxAutoresNoMover.length>0){
      this.updateAutores(auxAutoresNoMover);
    }
    if(auxAutoresAdd.length>0){
      this.saveAutoresUpdate(auxAutoresAdd);
    }
    if(auxAutoresDel.length>0){
      this.deleteAutores(auxAutoresDel);
    }
    if(auxAutoresDel.length==0 && auxAutoresAdd.length==0 && auxAutoresNoMover.length==0){
      this.updateArchivos();
    }
  }

  saveAutoresUpdate(autores:any){
    var cont1=autores.length;
    var cont2=1;
    for(let a of autores){
      this.loadingCount++
      this.eventService.addWorkAuthor(this.cartelId, a.nombre, a.correo).subscribe((resAutor: any) => {
        this.loadingCount--
        var autorId = resAutor;

        var puesto = "";
        if(a.puesto){puesto=a.puesto}
        this.loadingCount++
        this.eventService.updateAuthorOfCartel(autorId,a.nombre,a.correo,a.idCarrera,a.semestre,a.genero,puesto).subscribe((resAutor: any) => {
          this.loadingCount--
          var autorId = resAutor;

          if(a.afiliaciones.length != 0) {
            var auxAfil: any[] = a.afiliaciones;
            const idsAfil: any = auxAfil.map(value => value.id).join(' ');
            this.loadingCount++
            this.eventService.addInstitucionToAutor(autorId, idsAfil).subscribe((res: any) => {
              this.loadingCount--

              if(cont1==cont2){
                if(this.guardarAutoresTotal==this.guardarAutores){
                  this.updateArchivos()
                  console.warn("se guardaron los autores")
                }else{
                  this.guardarAutores++
                }
              }else{
                cont2++
              }

            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error', text: 'No se agregó la institución al autor especificado'});
              console.error(err)
            });
          }else{
            if(cont1==cont2){
              if(this.guardarAutoresTotal==this.guardarAutores){
                this.updateArchivos()
                console.warn("se guardaron los autores")
              }else{
                this.guardarAutores++
              }
            }else{
              cont2++
            }
          }

        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se actualizaron los datos del autor especificado'});
          console.error(err)
        });

        //console.log("Se agrego autor", a.nombre)
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregó el autor al trabajo especificado'});
        console.error(err)
      });
    }
  }

  updateAutores(autores:any){
    var cont1=autores.length;
    var cont2=1;
    for(let a of autores){
      var puesto = "";
      if(a.puesto){puesto=a.puesto}
      this.loadingCount++
      this.eventService.updateAuthorOfCartel(a.id,a.nombre,a.correo,a.idCarrera,a.semestre,a.genero,puesto).subscribe((resAutor: any) => {
        this.loadingCount--

        let rorsDelete = [];
        for(let ca of this.cartelAutoresGuardado){
          if(ca.id==a.id){
            rorsDelete = ca.afiliaciones;
          }
        }

        let auxRorsNoMover:any = [];
        let auxRorsDel = rorsDelete;
        let auxRorsAdd = a.afiliaciones;


        if(rorsDelete.length>0 && a.afiliaciones.length>0){
          for(let af of a.afiliaciones){
            for(let rd of rorsDelete){
              if(rd.id){
                if(af.id==rd.id){
                  auxRorsNoMover.push(rd)
                }
              }
            }
          }
          for(let nm of auxRorsNoMover){
            auxRorsDel = auxRorsDel.filter( (a:any) => a.id != nm.id)
            auxRorsAdd = auxRorsAdd.filter( (a:any) => a.id != nm.id)
          }
        }

        //console.log("auxRorsNoMover",auxRorsNoMover)
        //console.log("auxRorsDel",auxRorsDel)
        //console.log("auxRorsAdd",auxRorsAdd)

        if(auxRorsDel.length>0){
          const idsRors = auxRorsDel.map((value: any) => value.id);
          //console.log("idsRors",idsRors)
          this.loadingCount++
          this.eventService.removeRorsToAutor(a.id, idsRors).subscribe((resAutRor: any) => {
            this.loadingCount--
            if(auxRorsAdd.length>0){
              const idsAfil = auxRorsAdd.map((value:any) => value.id);
              //console.log("idsAfil",idsAfil)
              this.loadingCount++
              this.eventService.addRorsToAutor(a.id, idsAfil).subscribe((resAutAfil: any) => {
                this.loadingCount--

                if(cont1==cont2){
                  if(this.guardarAutoresTotal==this.guardarAutores){
                    this.updateArchivos()
                    console.warn("se guardaron los autores")
                  }else{
                    this.guardarAutores++
                  }
                }else{
                  cont2++
                }

              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se agregó la institución al autor especificado'});
                console.error(err)
              });
            }else{
              if(cont1==cont2){
                if(this.guardarAutoresTotal==this.guardarAutores){
                  this.updateArchivos()
                  console.warn("se guardaron los autores")
                }else{
                  this.guardarAutores++
                }
              }else{
                cont2++
              }
            }
            //console.log("se elimino la institución espesificada del autor");
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se eliminó la institución al autor especificado'});
            console.error(err)
          });
        }else {
          if (auxRorsAdd.length > 0) {
            const idsAfil = auxRorsAdd.map((value: any) => value.id);
            //console.log("idsAfil",idsAfil)
            this.loadingCount++
            this.eventService.addRorsToAutor(a.id, idsAfil).subscribe((resAutAfil: any) => {
              this.loadingCount--

              if (cont1 == cont2) {
                if (this.guardarAutoresTotal == this.guardarAutores) {
                  this.updateArchivos()
                  console.warn("se guardaron los autores")
                } else {
                  this.guardarAutores++
                }
              } else {
                cont2++
              }

            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error', text: 'No se agregó la institución al autor especificado'});
              console.error(err)
            });
          } else {
            if (cont1 == cont2) {
              if (this.guardarAutoresTotal == this.guardarAutores) {
                this.updateArchivos()
                console.warn("se guardaron los autores")
              } else {
                this.guardarAutores++
              }
            } else {
              cont2++

            }
          }
        }
        //console.log("se actualizo el autor");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se actualizo el autor especificado'});
        console.error(err)
      });

    }
  }

  deleteAutores(autores:any){
    var cont1=autores.length;
    var cont2=1;
    for (let a of autores) {
      this.loadingCount++
      this.eventService.deleteAutorToWork(a.id).subscribe((res: any) => {
        this.loadingCount--
        if(cont1==cont2){
          if(this.guardarAutoresTotal==this.guardarAutores){
            this.updateArchivos()
            console.warn("se guardaron los autores")
          }else{
            this.guardarAutores++
          }
        }else{
          cont2++
        }
        //console.log("autor eliminado")
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se eliminó el autor especificado del trabajo'});
        console.error(err)
      });
    }
  }

  updateArchivos(){
    let auxArchivosNoMover:any = [];
    for(let cag of this.cartelArchivosGuardados){
      for(let ca of this.cartelArchivos){
        if(!ca.archivo){
          if(cag.id==ca.id){
            auxArchivosNoMover.push(cag)
          }
        }
      }
    }
    let auxArchivosDel = this.cartelArchivosGuardados;
    for(let nm of auxArchivosNoMover){
      auxArchivosDel = auxArchivosDel.filter( (a:any) => a.id != nm.id)
    }
    //console.log("auxArchivosDel",auxArchivosDel)
    let auxArchivosAdd = this.cartelArchivos;
    for(let nm of this.cartelArchivos){
      auxArchivosAdd = auxArchivosAdd.filter( (a:any) => a.archivo)
    }
    //console.log("auxArchivosAdd",auxArchivosAdd)

    this.guardarArchivosTotal=0;
    this.guardarArchivos=1;
    if(auxArchivosAdd.length>0){this.guardarArchivosTotal++}
    if(auxArchivosDel.length>0){this.guardarArchivosTotal++}
    //console.warn("this.guardarArchivosTotal",this.guardarArchivosTotal)

    if(auxArchivosAdd.length>0){
      this.saveArchivosUpdate(auxArchivosAdd);
    }
    if(auxArchivosDel.length>0){
      this.deleteArchivos(auxArchivosDel);
    }
    if(auxArchivosDel.length==0 && auxArchivosAdd.length==0){
      this.loadWork()
      console.warn("se guardaron los archivos")
    }
  }

  saveArchivosUpdate(archivos:any){
    var cont1 = archivos.length;
    var cont2 = 1;
    for(let a of archivos){
      this.loadingCount++
      this.eventService.addFileWork(a.nombre, a.descripcion, this.eventoId, a.tipoId, this.cartelId, a.archivo).subscribe((res: any) => {
        this.loadingCount--
        if(cont1==cont2){
          if(this.guardarArchivosTotal==this.guardarArchivos){
            this.loadWork()
            console.warn("se guardaron los archivos")
          }else{
            this.guardarArchivos++
          }
        }else{
          cont2++
        }
        console.log("se agrego el archivo a el trabajo");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregó el archivo al trabajo especificado'});
        console.error(err)
      });
    }
  }

  deleteArchivos(archivos:any){
    var cont1 = archivos.length;
    var cont2 = 1;
    for(let del of archivos){
      this.loadingCount++
      this.eventService.deleteEventFile(del.id).subscribe((res: any) => {
        this.loadingCount--
        if(cont1==cont2){
          if(this.guardarArchivosTotal==this.guardarArchivos){
            this.loadWork();
            console.warn("se guardaron los archivos")
          }else{
            this.guardarArchivos++
          }
        }else{
          cont2++
        }
        //console.log("autor eliminado");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se eliminó el archivo especificado del trabajo'});
        console.error(err)
      });
    }
  }

  deleteCartel(idWork:number){
    Swal.fire({
      title: '¿Deseas eliminar el cartel?',
      html: 'Al eliminar el cartel,<br> se eliminarán todos los datos asociados',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventService.deleteWork(idWork).subscribe((res: any) => {
          this.loadingCount--
          console.log("se elimino correctamente");
          this.loadWork();
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se eliminó la el cartel especificado'});
          console.error(err)
        });
      }
    })
  }

  loadPagination(pageValue?:any,listaArchivos?:any){
    this.totalItems = listaArchivos.length;
    this.pageNumbers = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbersArray = [];
    for(var i=1 ; i<= this.pageNumbers ; i++){
      this.pageNumbersArray.push({"id":i});
    }
    if(pageValue){
      if(pageValue=='prev'){
        this.pageNumber--;
      }else if(pageValue=='next'){
        this.pageNumber++;
      }else{
        this.pageNumber = pageValue;
      }
    }
    this.pageNumbersArrayActive = []
    var activePage:number = 0;
    activePage = this.pageNumber-2;
    if(activePage>0){this.pageNumbersArrayActive.push({"id":activePage});}
    activePage = this.pageNumber-1;
    if(activePage>0){this.pageNumbersArrayActive.push({"id":activePage});}
    this.pageNumbersArrayActive.push({"id":this.pageNumber});
    activePage = this.pageNumber+1;
    for(let i of this.pageNumbersArray){
      if(i.id==activePage){
        this.pageNumbersArrayActive.push({"id":activePage});
      }
    }
    activePage = this.pageNumber+2;
    for(let i of this.pageNumbersArray){
      if(i.id==activePage){
        this.pageNumbersArrayActive.push({"id":activePage});
      }
    }

    var pageEnd = this.pageNumber * this.pageSize;
    var pageStart = pageEnd - (this.pageSize - 1);
    if(this.pageNumber==this.pageNumbers){
      pageEnd = this.totalItems;
    }
    this.labelPagination = "Muestra listado de cartles del "+pageStart+" al "+pageEnd+", Total: "+this.totalItems;
  }
}
