import {Component, OnInit, Input, SecurityContext} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import Swal from "sweetalert2";
import * as moment from "moment/moment";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-event-participation-works-encounter',
  templateUrl: './event-participation-works-encounter.component.html',
  styleUrls: ['./event-participation-works-encounter.component.css']
})
export class EventParticipationWorksEncounterComponent implements OnInit {

  @Input('eventoId') eventoId: number = 0;
  @Input('participacionId') participacionId: number = 0;

  eventoTipo: number = 4;

  conferenciaMagistralId: number = 0;
  areasConocimientoList: any[] = [];

  conferencias: any[] = [];
  conferenciasMetadatos: any[] = [];

  conferenciaMetadatosId: number = 0;
  conferenciaTitulo: string;
  conferenciaDescripcion: string;
  conferenciaUrl: string;
  conferenciaAreaSelected: number = 0;
  conferenciaAreasDisponibles: any[] = [];
  conferenciaAreas: any[] = [];
  conferenciaAreasGuardado: any[] = [];
  conferenciaODSList: any[] = [];
  conferenciaODSSelected: number = 0;
  conferenciaODSDisponibles: any[] = [];
  conferenciaODSGuardado: any[] = [];
  conferenciaODS: any[] = [];
  conferenciaAutores: any[] = [];
  conferenciaAutoresGuardado: any[] = [];
  conferenciaAutoresList: any[] = [];
  conferenciaAutorId: number = 0;
  conferenciaAutorNombre: string = '';
  conferenciaAutorCorreo: string = '';
  conferenciaAutorGenero: any = 'notsaid';
  conferenciaAutorPuesto: string = '';
  conferenciaAutorAfiliacionSearch: string = '';
  conferenciaAutorAfiliacionSelected: number = 0;
  conferenciaAutorAfiliacionesList: any[] = [];
  conferenciaAutorAfiliaciones: any[] = [];
  conferenciaAfiliacionesList: any[] = [];
  conferenciaAutorFecha: any = '';

  conferenciaId: number = 0;

  validTitulo: number = 0;
  validNombre: number = 0;
  validCorreo: number = 0;

  paso:number=1;

  archivoTipo:number=0;
  archivoNombre:string="";
  archivoDescripcion:string="";
  archivoFile:any="";
  archivosTipos: any[] = [];
  archivosParticipaciones: any[] = [];
  conferenciaArchivosGuardados: any[] = [];
  conferenciaArchivos: any[] = [];

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
    this.loadTrabajoTipos();
    this.loadTipoArchivos()
    this.loadAreasConocimiento();
    this.loadODS();
    this.loadWork();
  }

  loadTrabajoTipos() {
    if (this.eventoId != 0 && this.eventoTipo != 0) {
      this.loadingCount++
      this.eventService.getWorkTypeList(this.eventoId, this.eventoTipo).subscribe((resTrabTip: any) => {
        this.loadingCount--;
        for (let tt of resTrabTip) {
          if (tt.nombre == "Conferencia Magistral encuentro UNITEC") {
            this.conferenciaMagistralId = tt.id
          }
        }
        //console.log("this.conferenciaMagistralId",this.conferenciaMagistralId)
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
      this.conferenciaODSList = resODS;
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
        //console.log("resTrab",resTrab)
        let auxConferencias = []
        for(let rt of resTrab){
            if(rt.id_tipo_trabajo==this.conferenciaMagistralId){
              auxConferencias.push(rt);
            }
        }
        this.conferencias = auxConferencias;
        //console.log("this.conferencias",this.conferencias)
        if(resTrab.length>0){
          this.loadDatos();
          this.loadAutores();
          this.loadArchivosParticipaciones();
          this.loadPagination(1,this.conferencias)
        }
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron las conferencias del evento especificado'});
        console.error(err)
      });
    }
  }

  loadDatos() {
    if (this.conferencias.length > 0) {
      const idsConf: string = this.conferencias.map((value: any) => value.id).join(' ');
      //console.log("idsConf", idsConf)
      const idsIdiomas: string = "150"
      this.loadingCount++
      this.eventService.getMetadatosByWorksAndIdiomId(this.eventoId, idsConf, idsIdiomas).subscribe((resMeta: any) => {
        this.loadingCount--
        //console.log("resMeta",resMeta)
        this.conferenciasMetadatos = resMeta;
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron los trabajos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadAutores(){
    if(this.conferencias.length>0){
      const idsConf = this.conferencias.map((value: any) => value.id).join(' ');
      this.loadingCount++
      this.eventService.getAuthorByWorks(this.eventoId,idsConf).subscribe((resAutores: any) => {
        this.loadingCount--
        this.conferenciaAutoresList = resAutores;
        this.orderByAut(this.conferenciaAutoresList)
        if(this.conferenciaAutoresList.length>0){
          const arrIdsAutoresTrab = this.conferenciaAutoresList.map((value: any) => value.id).join(' ');
          this.loadingCount++
          this.eventService.getRorsByAuthor(arrIdsAutoresTrab).subscribe((resAfil: any) => {
            this.loadingCount--
            this.conferenciaAfiliacionesList = resAfil;
            //console.log("this.conferenciaAfiliaciones",this.conferenciaAfiliaciones)
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se cargaron los datos de la institución especificada'});
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
      //console.log("resTipArch",resTipArch)
      let auxTiposArchivo:any=[];
      for(let ta of resTipArch){
        if(ta.codigo_interno=="cvEjecAutTrabTrab" ||
          ta.codigo_interno=="fotoTrab" ||
          ta.codigo_interno=="presSlidesTrab" ||
          ta.codigo_interno=="trabajo"){
          auxTiposArchivo.push(ta);
        }
      }
      this.archivosTipos = auxTiposArchivo;
      for(let at of this.archivosTipos){
        if(at.codigo_interno=="cvEjecAutTrabTrab"){at.real="CV ejecutivo del ponente"}
        if(at.codigo_interno=="fotoTrab"){at.real="Fotografías"}
        if(at.codigo_interno=="presSlidesTrab"){at.real="Presentación usada en la conferencia "}
        if(at.codigo_interno=="trabajo"){at.real="Otros"}
      }
      //console.log("this.archivosTipos",this.archivosTipos)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de archivo'});
      console.error(err)
    });
  }

  loadArchivosParticipaciones(){
    let idsConferencias = this.conferencias.map((value: any) => value.id)
    this.loadingCount++
    this.eventService.getFileListByWork(this.eventoId,idsConferencias).subscribe((resArchPart: any) => {
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

  searchAfiliaciones(){
    if(this.conferenciaAutorAfiliacionSearch!='') {
      this.loadingCount++
      this.eventService.searchRor(this.conferenciaAutorAfiliacionSearch).subscribe((resAfil: any) => {
        this.loadingCount--
        this.conferenciaAutorAfiliacionesList = resAfil.slice(0, 50);
        let afiliacionesDisponibles = this.conferenciaAutorAfiliacionesList;
        for (let al of this.conferenciaAutorAfiliaciones) {
          afiliacionesDisponibles = afiliacionesDisponibles.filter((afil: any) => afil.id != al.id)
        }
        this.conferenciaAutorAfiliacionesList = afiliacionesDisponibles;
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron las posibles instituciones de afiliación'});
        console.error(err)
      });
    }
  }

  openNewConferenciaModal() {
    this.conferenciaId = 0;
    this.conferenciaTitulo = "";
    this.conferenciaDescripcion = "";
    this.conferenciaUrl = "";
    this.conferenciaAreaSelected = 0;
    this.conferenciaAreasDisponibles = this.areasConocimientoList;
    this.conferenciaAreas = [];
    this.conferenciaODSSelected = 0;
    this.conferenciaODSGuardado = [];
    this.conferenciaODSDisponibles = this.conferenciaODSList;
    this.conferenciaODS = [];
    this.conferenciaAutores = [];
    this.conferenciaArchivos = [];
    this.validTitulo = 0;
  }

  openUpdateConferenciaModal(conferencia:any){
    this.validTitulo = 0;
    this.conferenciaId = conferencia.id;
    this.conferenciaMetadatosId = conferencia.conjuntos_de_metadatos_de_trabajo[0].id;
    for(let cm of this.conferenciasMetadatos){
      if(conferencia.id==cm.id_trabajo){
        this.conferenciaTitulo = cm.titulo;
        this.conferenciaDescripcion = cm.resumen;
        this.conferenciaUrl = cm.url;
      }
    }
    this.conferenciaAreasDisponibles = this.areasConocimientoList;
    this.conferenciaAreaSelected = 0;
    this.conferenciaAreas = [];
    this.conferenciaAreasGuardado = conferencia.areas_de_conocimiento;
    for(let cac of conferencia.areas_de_conocimiento){
      for(let acl of this.areasConocimientoList){
        if(cac.id==acl.id){
          this.conferenciaAreas.push(acl);
          this.conferenciaAreasDisponibles = this.conferenciaAreasDisponibles.filter((area: any) => area.id != cac.id);
        }
      }
    }
    this.conferenciaODSDisponibles = this.conferenciaODSList;
    this.conferenciaODSSelected = 0;
    this.conferenciaODSGuardado = conferencia.objetivos_de_desarrollo_sostenible;
    this.conferenciaODS = [];
    for(let cac of conferencia.objetivos_de_desarrollo_sostenible){
      for(let acl of this.conferenciaODSList){
        if(cac.id==acl.id){
          this.conferenciaODS.push(acl);
          this.conferenciaODSDisponibles = this.conferenciaODSDisponibles.filter((area: any) => area.id != cac.id);
        }
      }
    }
    this.conferenciaAutores = [];
    for(let cal of this.conferenciaAutoresList){
      if(conferencia.id==cal.id_trabajo){
        this.conferenciaAutores.push(cal);
      }
    }
    this.reloadAutores();
    this.conferenciaArchivos = [];
    for(let ap of this.archivosParticipaciones){
      if(conferencia.id==ap.id_trabajo){
        this.conferenciaArchivos.push(ap);
      }
    }
    this.reloadArchivos();
  }

  openViewConferenciaModal(conferencia:any){
    this.validTitulo = 0;
    this.conferenciaId = conferencia.id;
    this.conferenciaMetadatosId = conferencia.conjuntos_de_metadatos_de_trabajo[0].id;
    for(let cm of this.conferenciasMetadatos){
      if(conferencia.id==cm.id_trabajo){
        this.conferenciaTitulo = cm.titulo;
        this.conferenciaDescripcion = cm.resumen;
        this.conferenciaUrl = cm.url;
      }
    }
    this.conferenciaAreasDisponibles = this.areasConocimientoList;
    this.conferenciaAreaSelected = 0;
    this.conferenciaAreas = [];
    this.conferenciaAreasGuardado = conferencia.areas_de_conocimiento;
    for(let cac of conferencia.areas_de_conocimiento){
      for(let acl of this.areasConocimientoList){
        if(cac.id==acl.id){
          this.conferenciaAreas.push(acl);
          this.conferenciaAreasDisponibles = this.conferenciaAreasDisponibles.filter((area: any) => area.id != cac.id);
        }
      }
    }
    this.conferenciaODSDisponibles = this.conferenciaODSList;
    this.conferenciaODSSelected = 0;
    this.conferenciaODSGuardado = conferencia.objetivos_de_desarrollo_sostenible;
    this.conferenciaODS = [];
    for(let cac of conferencia.objetivos_de_desarrollo_sostenible){
      for(let acl of this.conferenciaODSList){
        if(cac.id==acl.id){
          this.conferenciaODS.push(acl);
          this.conferenciaODSDisponibles = this.conferenciaODSDisponibles.filter((area: any) => area.id != cac.id);
        }
      }
    }
    this.conferenciaAutores = [];
    for(let cal of this.conferenciaAutoresList){
      if(conferencia.id==cal.id_trabajo){
        this.conferenciaAutores.push(cal);
      }
    }
    this.reloadAutores();
    this.conferenciaArchivos = [];
    for(let ap of this.archivosParticipaciones){
      if(conferencia.id==ap.id_trabajo){
        this.conferenciaArchivos.push(ap);
      }
    }
    this.reloadArchivos();
  }

  openNewAutoresModal() {
    this.conferenciaAutorId = 0;
    this.conferenciaAutorNombre = '';
    this.conferenciaAutorCorreo = '';
    this.conferenciaAutorGenero = 'notsaid';
    this.conferenciaAutorPuesto = '';
    this.conferenciaAutorAfiliacionSearch = '';
    this.conferenciaAutorAfiliacionesList = [];
    this.conferenciaAutorAfiliaciones = [];
    this.validNombre = 0;
    this.validCorreo = 0;
  }

  openViewAutoresModal(autor: any){
    this.conferenciaAutorId = 0;
    this.conferenciaAutorNombre = autor.nombre;
    this.conferenciaAutorCorreo = autor.correo;
    this.conferenciaAutorFecha = '';
    this.conferenciaAutorGenero = autor.genero;
    this.conferenciaAutorPuesto = autor.puesto;
    this.conferenciaAutorAfiliaciones = autor.afiliaciones;
  }

  openUpdateAutoresModal(autor: any) {
    this.conferenciaAutorId = autor.id;
    this.conferenciaAutorNombre = autor.nombre;
    this.conferenciaAutorCorreo = autor.correo;
    this.conferenciaAutorFecha = autor.fecha;
    this.conferenciaAutorGenero = autor.genero;
    this.conferenciaAutorPuesto = autor.puesto;
    this.conferenciaAutorAfiliacionesList = [];
    this.conferenciaAutorAfiliacionSearch = '';
    this.conferenciaAutorAfiliaciones = autor.afiliaciones;
    this.validNombre = 0;
    this.validCorreo = 0;
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

  cambiarGenero(valor:string){
    if(this.conferenciaAutorGenero!=valor){
      this.conferenciaAutorGenero=valor;
      //console.log("this.conferenciaAutorGenero",this.conferenciaAutorGenero)
    }
  }

  reloadAutores(){
    let auxConferenciaAutores = [];
    var momento = new Date().getTime()
    for(let ca of this.conferenciaAutores){
      let auxConferenciaAfiliaciones = [];
      for(let a of ca.rors){
        for(let cal of this.conferenciaAfiliacionesList){
          if(a.id==cal.id){
            auxConferenciaAfiliaciones.push(cal)
          }
        }
      }
      momento++
      var autor = {
        id: ca.id,
        nombre: ca.nombre,
        correo: ca.correo,
        genero: ca.genero,
        puesto: ca.puesto,
        afiliaciones: auxConferenciaAfiliaciones,
        fecha: momento
      }
      auxConferenciaAutores.push(autor)
    }
    this.conferenciaAutores=auxConferenciaAutores;
    //console.log("this.conferenciaAutores",this.conferenciaAutores);
    this.orderBy(this.conferenciaAutores)
    this.conferenciaAutoresGuardado=this.newObjectReference(this.conferenciaAutores);
  }

  reloadArchivos(){
    let auxConferenciaArchivos = [];
    var momento = new Date().getTime()
    for(let ca of this.conferenciaArchivos){
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
      auxConferenciaArchivos.push(archivo)
      //console.log("archivo",archivo)
    }
    this.conferenciaArchivos=auxConferenciaArchivos;
    //console.log("auxConferenciaArchivos",auxConferenciaArchivos)
    this.orderByTipo(this.conferenciaArchivos)
    //console.log("this.conferenciaArchivos",this.conferenciaArchivos)
    this.conferenciaArchivosGuardados=this.newObjectReference(this.conferenciaArchivos);
  }

  addArea() {
    for (let a of this.conferenciaAreasDisponibles) {
      if (this.conferenciaAreaSelected == a.id) {
        this.conferenciaAreas.push(a);
      }
    }
    this.conferenciaAreasDisponibles = this.conferenciaAreasDisponibles.filter((area: any) => area.id != this.conferenciaAreaSelected);
    this.conferenciaAreaSelected = 0;
  }

  removeArea(areaId: number) {
    for (let a of this.conferenciaAreas) {
      if (areaId == a.id) {
        this.conferenciaAreasDisponibles.push(a);
      }
    }
    this.conferenciaAreas = this.conferenciaAreas.filter((area: any) => area.id != areaId);
    this.conferenciaAreaSelected = 0;
  }

  addODS() {
    for (let a of this.conferenciaODSDisponibles) {
      if (this.conferenciaODSSelected == a.id) {
        this.conferenciaODS.push(a);
      }
    }
    this.conferenciaODSDisponibles = this.conferenciaODSDisponibles.filter((ods: any) => ods.id != this.conferenciaODSSelected);
    this.conferenciaODSSelected = 0;
  }

  removeODS(ODSId: number) {
    for (let a of this.conferenciaODS) {
      if (ODSId == a.id) {
        this.conferenciaODSDisponibles.push(a);
      }
    }
    this.conferenciaODS = this.conferenciaODS.filter((ods: any) => ods.id != ODSId);
    this.conferenciaODSSelected = 0;
  }

  addAutores() {
    var autor = {
      nombre: this.conferenciaAutorNombre,
      correo: this.conferenciaAutorCorreo,
      genero: this.conferenciaAutorGenero,
      puesto: this.conferenciaAutorPuesto,
      afiliaciones: this.conferenciaAutorAfiliaciones,
      fecha: moment(new Date()).format('YYYYMMDDHHmmss')
    }
    this.conferenciaAutores.push(autor);
    //console.log(this.conferenciaAutores)
  }

  updateAutor() {
    this.conferenciaAutores = this.conferenciaAutores.filter((afil: any) => afil.fecha != this.conferenciaAutorFecha);
    var autor = {
      id: this.conferenciaAutorId,
      nombre: this.conferenciaAutorNombre,
      correo: this.conferenciaAutorCorreo,
      genero: this.conferenciaAutorGenero,
      puesto: this.conferenciaAutorPuesto,
      afiliaciones: this.conferenciaAutorAfiliaciones,
      fecha: moment(new Date()).format('YYYYMMDDHHmmss')
    }
    this.conferenciaAutores.push(autor);
    this.orderBy(this.conferenciaAutores)
  }

  removeAutores(autorFecha: number){
    let auxAutores = this.conferenciaAutores;
    this.conferenciaAutores = auxAutores.filter((afil: any) => afil.fecha != autorFecha);
  }

  addAfiliaciones() {
    for (let caad of this.conferenciaAutorAfiliacionesList) {
      if (this.conferenciaAutorAfiliacionSelected == caad.id) {
        this.conferenciaAutorAfiliaciones.push(caad);
        this.conferenciaAutorAfiliacionesList = this.conferenciaAutorAfiliacionesList.filter((afil: any) => afil.id != caad.id);
      }
    }
    this.conferenciaAutorAfiliacionSelected = 0;
  }

  removeAfiliaciones(afilId: number) {
    var afilRev: any = [];
    for (let caad of this.conferenciaAutorAfiliaciones) {
      if (afilId == caad.id) {
        afilRev = caad;
      }
    }
    if (this.conferenciaAutorAfiliacionesList.length > 0) {
      this.conferenciaAutorAfiliaciones.push(afilRev);
    }
    this.conferenciaAutorAfiliaciones = this.conferenciaAutorAfiliaciones.filter((afil: any) => afil.id != afilId);
    this.conferenciaAutorAfiliacionSelected = 0;
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
    this.conferenciaArchivos.push(archivo);
    this.orderByTipo(this.conferenciaArchivos)
  }

  removeArchivo(fecha:any){
    let auxAutores = this.conferenciaArchivos;
    this.conferenciaArchivos = auxAutores.filter((afil: any) => afil.fecha != fecha);
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

  validarNombre() {
    if (!this.conferenciaAutorNombre || this.conferenciaAutorNombre=="") {
      this.validNombre = 1;
    } else if (this.conferenciaAutorNombre == null) {
      this.validNombre = 1;
    } else {
      this.validNombre = 0;
    }
  }

  validarCorreo() {
    if (/[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[a-zA-Z0-9]$/.test(this.conferenciaAutorCorreo)) {
      this.validCorreo = 0;
    }else if(this.conferenciaAutorCorreo==""){
      this.validCorreo = 0;
    }else if(this.conferenciaAutorCorreo==null){
      this.validCorreo = 0;
    }else if(!this.conferenciaAutorCorreo){
      this.validCorreo = 0;
    }else {
      this.validCorreo = 2;
    }
  }

  validarAutor() {
    this.validarNombre();
    this.validarCorreo();
    if (this.validNombre==0 && this.validCorreo==0) {
      this.addAutores();
    }
  }

  validarTitulo() {
    if (!this.conferenciaTitulo || this.conferenciaTitulo=="") {
      this.validTitulo = 1;
    } else if (this.conferenciaTitulo == null) {
      this.validTitulo = 1;
    } else {
      this.validTitulo = 0;
    }
  }

  validarFormulario(){
    this.validarTitulo();
    if (this.validTitulo==0){
      if(this.conferenciaId==0){
        this.saveConferencia();
      }else{
        this.upadateConferencia();
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
    return this.conferenciaAutoresList.filter((value) => { return value.id_trabajo == idTrab})
      .map((value: any) => {return value.nombre}).join(',<br>')
  }

  newObjectReference(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

  saveConferencia() {
    this.loadingCount++
    this.eventService.addWorkToParticipation(this.participacionId, 1, this.conferenciaMagistralId, 1).subscribe((res: any) => {
      this.loadingCount--
      this.conferenciaId = res;
      //console.log("se creo la conferencia");
      this.saveRefrendo();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se guardaron los datos de la conferencia especificada'});
      console.error(err)
    });
  }

  saveRefrendo() {
    var refrendo = 1;
    this.loadingCount++
    this.eventService.updateConfWithRefrendo(this.conferenciaId, refrendo).subscribe((res: any) => {
      this.loadingCount--
      //console.log("se agrego el refrendo a la conferencia");
      this.saveMetadatos();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se actualizo la conferencia con refrendo'});
      console.error(err)
    });
  }

  saveMetadatos() {
    if (this.conferenciaTitulo && this.conferenciaTitulo != "") {
      var idiomaId = 150;
      if (!this.conferenciaDescripcion){this.conferenciaDescripcion = ""}
      if (!this.conferenciaUrl){this.conferenciaUrl = ""}
      this.loadingCount++
      this.eventService.addMetadatos(this.conferenciaId, idiomaId, this.conferenciaTitulo, this.conferenciaDescripcion, this.conferenciaUrl).subscribe((res: any) => {
        this.loadingCount--
        this.saveArea();
        //console.log("se agregaron los metadatos de la conferencia");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregaron los metadatos a la conferencia especificada'});
        console.error(err)
      });
    }
  }

  saveArea(update?:boolean) {
    if (this.conferenciaAreas.length != 0) {
      let ids: any = this.conferenciaAreas.map(value => value.id).join(' ');
      this.loadingCount++
      this.eventService.addArea(this.conferenciaId, ids).subscribe((res: any) => {
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
    if (this.conferenciaODS.length != 0) {
      let idsODS: any = this.conferenciaODS.map(value => value.id).join(' ');
      this.loadingCount++
      this.eventService.addODS(this.conferenciaId, idsODS).subscribe((res: any) => {
        this.loadingCount--
        if(update){ this.updateAutoresConferencia() }else{ this.saveAutores() }
        //console.log("Se agregaron áreas del conocimiento");
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregaron las áreas de conocimiento al trabajo especificado'});
        console.error(err)
      });
    }else{
      if(update){ this.updateAutoresConferencia() }else{ this.saveAutores() }
    }
  }

  saveAutores(){
    if(this.conferenciaAutores.length>0){
      //console.log("this.conferenciaAutores",this.conferenciaAutores)
      for(let a of this.conferenciaAutores){
        this.loadingCount++
        this.eventService.addWorkAuthor(this.conferenciaId, a.nombre, a.correo).subscribe((resAutor: any) => {
          this.loadingCount--
          var autorId = resAutor;
          //console.log("resAutor",resAutor)
          //console.log("a.afiliaciones",a.afiliaciones)

          var puesto = "";if(a.puesto){puesto=a.puesto}
          var correo = "";if(a.correo){correo=a.correo}

          this.loadingCount++
          this.eventService.updateAuthorOfConferencia(autorId,a.nombre,correo,a.genero,puesto).subscribe((resAutor: any) => {
            this.loadingCount--
            var autorId = resAutor;

            if(a.afiliaciones.length != 0) {
              var auxAfil: any[] = a.afiliaciones;
              const idsAfil: any = auxAfil.map(value => value.id).join(' ');
              //console.log("idsAfil",idsAfil)
              this.loadingCount++
              this.eventService.addInstitucionToAutor(autorId, idsAfil).subscribe((res: any) => {
                this.loadingCount--
                this.saveArchivos()
                //console.log("se agrego la institución al autor especificado");
              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se agregó la institución al autor especificado'});
                console.error(err)
              });
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
      this.saveArchivos()
    }
  }

  saveArchivos(){
    if(this.conferenciaArchivos.length>0){
      //console.log("this.conferenciaArchivos",this.conferenciaArchivos)
      for(let ca of this.conferenciaArchivos){
        this.loadingCount++
        console.log("datos",ca.nombre, ca.descripcion, this.eventoId, ca.tipoId, this.conferenciaId, ca.archivo)
        this.eventService.addFileWork(ca.nombre, ca.descripcion, this.eventoId, ca.tipoId, this.conferenciaId, ca.archivo).subscribe((res: any) => {
          this.loadingCount--
          console.log("se agrego el archivo a el trabajo");
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

  upadateConferencia(){
    if (this.conferenciaTitulo && this.conferenciaTitulo != "") {
      this.updateMetadatos();
    }
  }

  updateMetadatos(){
    if (!this.conferenciaDescripcion){this.conferenciaDescripcion = ""}
    if (!this.conferenciaUrl){this.conferenciaUrl = ""}
    this.loadingCount++
    this.eventService.updateMetadatos(this.conferenciaMetadatosId,this.conferenciaTitulo,this.conferenciaDescripcion,this.conferenciaUrl).subscribe((resMeta: any) => {
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
    if (this.conferenciaAreasGuardado.length>0) {
      let idsAreas: any = this.conferenciaAreasGuardado.map(value => value.id).join(' ');
      this.loadingCount++
      this.eventService.removeArea(this.conferenciaId, idsAreas).subscribe((res: any) => {
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
    if (this.conferenciaODSGuardado.length>0) {
      let idsODS: any = this.conferenciaODSGuardado.map(value => value.id).join(' ');
      //console.log("idsAreas",idsAreas)
      this.loadingCount++
      this.eventService.removeODS(this.conferenciaId, idsODS).subscribe((res: any) => {
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

  updateAutoresConferencia(){
    let auxAutoresNoMover:any = [];
    let auxAutoresDel = this.conferenciaAutoresGuardado;
    let auxAutoresAdd = this.conferenciaAutores;

    for(let cag of this.conferenciaAutoresGuardado){
      for(let ca of this.conferenciaAutores){
        if(ca.id){
          if(cag.id==ca.id){
            auxAutoresNoMover.push(ca)
          }
        }
      }
    }
    for(let nm of auxAutoresNoMover){
      auxAutoresDel = auxAutoresDel.filter( (a:any) => a.id != nm.id)
      auxAutoresAdd = auxAutoresAdd.filter( (a:any) => a.id != nm.id)
    }

    //console.log("auxAutoresNoMover",auxAutoresNoMover)
    //console.log("auxAutoresDel",auxAutoresDel)
    //console.log("auxAutoresAdd",auxAutoresAdd)

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
      console.warn("se guardaron los autores")
    }
  }

  saveAutoresUpdate(autores:any){
    var cont1=autores.length;
    var cont2=1;
    for(let a of autores){
      this.loadingCount++
      this.eventService.addWorkAuthor(this.conferenciaId, a.nombre, a.correo).subscribe((resAutor: any) => {
        this.loadingCount--
        var autorId = resAutor;

        var puesto = "";if(a.puesto){puesto=a.puesto}
        var correo = "";if(a.correo){correo=a.correo}
        this.loadingCount++
        this.eventService.updateAuthorOfConferencia(autorId,a.nombre,correo,a.genero,puesto).subscribe((resAutor: any) => {
          this.loadingCount--
          var autorId = resAutor


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
          }

          //console.log("Se agrego autor", a.nombre)
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se agregó el autor al trabajo especificado'});
          console.error(err)
        })

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
      var puesto = "";if(a.puesto){puesto=a.puesto}
      var correo = "";if(a.correo){correo=a.correo}
      this.loadingCount++
      this.eventService.updateAuthorOfConferencia(a.id,a.nombre,correo,a.genero,puesto).subscribe((resAutor: any) => {
        this.loadingCount--

        let rorsDelete = [];
        for(let ca of this.conferenciaAutoresGuardado){
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
        }else{
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
    for(let cag of this.conferenciaArchivosGuardados){
      for(let ca of this.conferenciaArchivos){
        if(!ca.archivo){
          if(cag.id==ca.id){
            auxArchivosNoMover.push(cag)
          }
        }
      }
    }
    let auxArchivosDel = this.conferenciaArchivosGuardados;
    for(let nm of auxArchivosNoMover){
      auxArchivosDel = auxArchivosDel.filter( (a:any) => a.id != nm.id)
    }
    //console.log("auxArchivosDel",auxArchivosDel)
    let auxArchivosAdd = this.conferenciaArchivos;
    for(let nm of this.conferenciaArchivos){
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
      this.eventService.addFileWork(a.nombre, a.descripcion, this.eventoId, a.tipoId, this.conferenciaId, a.archivo).subscribe((res: any) => {
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

  deleteConferencia(idWork:number){
    Swal.fire({
      title: '¿Deseas eliminar la conferencia?',
      html: 'Al eliminar la conferencia,<br> se eliminarán todos los datos asociados',
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
          Swal.fire({icon: 'error',text: 'No se eliminó la conferencia especificada'});
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
    this.labelPagination = "Muestra listado de conferencias del "+pageStart+" al "+pageEnd+", Total: "+this.totalItems;
  }
}
