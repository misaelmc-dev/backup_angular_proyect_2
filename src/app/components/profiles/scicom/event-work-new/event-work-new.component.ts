import {Component, EventEmitter, Input, OnInit, Output, SecurityContext} from '@angular/core';
import {EventService} from "../../../../services/event.service";
import {EvaluacionScicomService} from "../../../../services/scicom/evaluacion-scicom.service";
import Swal from "sweetalert2";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment/moment";
import {PagosScicomService} from "../../../../services/scicom/pagos-scicom.service";

@Component({
  selector: 'app-event-work-new',
  templateUrl: './event-work-new.component.html',
  styleUrls: ['./event-work-new.component.css']
})
export class EventWorkNewComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));

  @Input('eventoId') eventoId:number = 0;
  @Input('participationId') participationId:number = 0;
  @Output('permitirFinalizar') permitirFinalizarEmitter = new EventEmitter<boolean>()

  eventNombre:string = '';
  eventTipo:string = '';
  eventEstatus:string = '';

  metadatos:any[] = [];
  metadatosTitulos:any[] = [];

  trabajoId:number = 0;
  trabajos:any[] = [];

  areaSelected:number=0;
  areasConocimientoList:any[] = [];
  areasConocimientoTot:any[] = [];
  areasConocimiento:any[] = [];

  typeWorkSelected:number=0;
  typeWork:any[]=[];
  typeWorkAsing:any[]=[];
  typeWorkNoAsing:any[]=[];

  datosTitulo1:string = '';
  datosTitulo2:string = '';
  datosresumen1:string = '';
  datosresumen2:string = '';
  datosUrl1:string = '';
  datosUrl2:string = '';

  fuentesSelected:number = 0;
  fuentes:any[] = [];
  fuentesCarga:any[] = [];
  fuentesList:any[] = [];

  autorId:number = 0;
  autores:any[] = [];
  autoresList:any[] = [];
  autoresListDisplay:any[] = [];
  autorNombre:string = '';
  autorCorreo:string = '';
  autorORCID:string = '';

  autorDatos:any[] = [];
  autorDatosCampus:any[] = [];
  autorDatosInstituciones:any[] = [];
  autorDatosNombre:string = '';
  autorDatosCorreo:string = '';
  autorDatosOrcid:string = '';

  afiliacionesList:any = [];
  afiliaciones:any[] = [];
  afiliacionesAsing:any[] = [];
  afiliacionSelected:number = 0;

  campusEvent:any[] = [];
  campusTotalList:any[] = [];
  campusList:any[] = [];
  campus:any[] = [];
  campusSelected:number = 0;

  estatusWork:any[]=[];

  datosWorkId:any = 0;
  datosWorkFuente:number = 0;
  datosWorkFuenteNombre:string = '';
  datosWorkTipo:number = 0;
  datosWorkEstatus:number = 0;
  datosWorkAreas:any[]=[];

  idMetaEspanol:number = 0;
  idMetaIngles:number = 0;

  search1:string = '';
  search2:string = '';

  loadingCount: number = 0;

  cont:number = 0;

  valid1:boolean = false;
  valid2:boolean = false;
  valid3:boolean = false;
  valid4:boolean = false;
  valid5:boolean = false;

  validTitulo1:boolean = false;
  validTitulo2:boolean = false;
  validResumen1:boolean = false;
  validResumen2:boolean = false;
  validTotal:boolean = false;

  validOrcid:boolean = false;
  validEmail:boolean = false;

  areasOld:any[]=[];
  autoresOld:any[]=[];

  afiliacionesDatos:any[]=[];

  errorOnSaveFlag:boolean = false;
  saveAutorFlag:boolean = false;
  dontSaveAutorFlag:boolean = false;

  contentPopOverInnerHtml: string = '';
  tituloPopOverInnerHtml: string = '';
  autorPopover:any[]=[];

  /** texto variables de archivos **/

  nombreArchivo:string = '';
  descripcionArchivo:string = '';
  tipoArchivoSelected:any = 0;

  archivoVacio = '';
  archivosTrabajos:any[] = [];
  archivosTrabajosOld:any[] = [];
  archivoTrabajo:any;

  evaluacionesTrabajos:any = [];
  trabajosPagos:any = [];

  trabajoRefrendoTrue:boolean = false;
  trabajoRefrendoFalse:boolean = false;

  datosWorkRefrendo:boolean = false;

  constructor(private eventService: EventService,
              private evaluacionesService: EvaluacionScicomService,
              private pagosService: PagosScicomService,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.permitirFinalizarEmitter.emit(false)
    this.loadEvento();
    this.loadWork();
    this.loadWorkType();
    this.loadWorkEstatus();
    this.loadAreasConocimiento();
  }

  loadEvento(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.eventNombre = res[0].nombre;
        this.eventTipo = res[0].id_tipo_evento;
        this.eventEstatus = res[0].id_estatus_evento;
        this.campusEvent = res[0].campus;
        const idRorCoord = res[0].rors_editoras.filter((value: any) => value.pivot.creador == true)[0].id
        this.loadingCount++
        if (idRorCoord) {
          this.eventService.getInstitucionList([idRorCoord]).subscribe((res: any) => {
            this.loadingCount--
            this.cordId = res[0].id
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'Error al cargar la institución creadora del evento'});
            console.error(err)
          });
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los datos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadWork(){
    this.loadingCount++
    this.eventService.getWorkByPart(this.eventoId,this.participationId).subscribe((res: any) => {
      this.loadingCount--
      this.trabajos = res;
      if(this.trabajos.length!=0){
        this.permitirFinalizarEmitter.emit(true)
        this.loadDatos();
        this.loadFuentes();
        this.loadAutores();
        this.loadEvaluaciones();
        this.loadPagos();
      } else {
        this.permitirFinalizarEmitter.emit(false)
      }
    }, (err:any) =>{
      this.permitirFinalizarEmitter.emit(false)
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los trabajos del evento especificado'});
      console.error(err)
    });
  }

  loadDatos(){
    const ids = this.trabajos.map((value: any) => value.id).join(' ');
    this.loadingCount++
    this.eventService.getMetadatosByWorkIds(this.eventoId,ids).subscribe((res: any) => {
      this.loadingCount--
      this.metadatos = res;

      let auxMetadatos:any = [];
      for(let tm of this.metadatos){
        if(tm.id_idioma == 150){
          if(tm.titulo!=null){
            auxMetadatos = auxMetadatos.filter((value: any) => value.id_trabajo != tm.id_trabajo);
            auxMetadatos.push(tm)
          }
        }else if(tm.id_idioma == 41){
          if(tm.titulo!=null){ auxMetadatos.push(tm) }
        }
      }
      this.metadatosTitulos = auxMetadatos;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los trabajos del evento especificado'});
      console.error(err)
    });
  }

  loadFuentes(){
    const ids = this.trabajos.map((value: any) => value.id).join(' ');
    this.fuentesCarga = [];
    this.loadingCount++
    this.eventService.getFontsByWorks(ids).subscribe((res: any) => {
      this.loadingCount--
      this.fuentesCarga = res ;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fuentes especificadas'});
      console.error(err)
    });
  }

  loadWorkType(){
    this.loadingCount++
    this.eventService.getWorkList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.typeWork = res;
      this.loadingCount++
      this.eventService.getWorkAsign(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.typeWorkAsing = res ;
        this.typeWorkNoAsing = this.typeWork;
        for(let camp of this.typeWorkAsing){
          this.typeWorkNoAsing = this.typeWorkNoAsing.filter( (tw:any) => tw.id != camp.id );
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los tipos de trabajo asignados al evento especificado'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de trabajos'});
      console.error(err)
    });
  }

  loadWorkEstatus(){
    this.loadingCount++
    this.eventService.getWorkEstausList().subscribe((res: any) => {
      this.loadingCount--
      this.estatusWork = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los estatus de trabajo del sistema'});
      console.error(err)
    });
  }

  loadAutores(){
    const ids = this.trabajos.map((value: any) => value.id).join(' ');
    if(ids && ids != ''){
      this.loadingCount++
      this.eventService.getAuthorByWorks(this.eventoId,ids).subscribe((res: any) => {
        this.loadingCount--
        this.autoresList = res;
        this.orderBy(this.autoresList,'id','asc')
        this.afiliacionesDatos = [];
        const arrIdsAutoresTrab = res.map((value: any) => value.id).join(' ');
        if(arrIdsAutoresTrab && arrIdsAutoresTrab!=''){
          this.loadingCount++
          this.eventService.getRorsByAuthor(arrIdsAutoresTrab).subscribe((res: any) => {
            this.loadingCount--
            this.afiliacionesDatos = res;
            this.loadCampus();
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

  orderBy = (sin_orden:any,campo:string,orden:string) => {
    let con_orden:any[]=sin_orden;
    con_orden.sort((n1,n2) => {
      if(campo=='nombre'){
        if(orden=='asc'){
          if(n1.nombre>n2.nombre){return 1;}
          if(n1.nombre<n2.nombre){return -1;}
        }else if(orden=='desc'){
          if(n1.nombre<n2.nombre){return 1;}
          if(n1.nombre>n2.nombre){return -1;}
        }
      }
      if(campo=='id'){
        if(orden=='asc'){
          if(n1.id>n2.id){return 1;}
          if(n1.id<n2.id){return -1;}
        }else if(orden=='desc'){
          if(n1.id<n2.id){return 1;}
          if(n1.id>n2.id){return -1;}
        }
      }
      return 0;
    });
  }

  loadEvaluaciones(){
    this.evaluacionesTrabajos = [];
    let arrayTiposEvaluaciones =  [1,2];
    let pSuscripcion = this.evaluacionesService.getEvaluaciones(this.eventoId,arrayTiposEvaluaciones);
    this.loadingCount++
    pSuscripcion.subscribe((res:any) => {
      this.loadingCount--
      this.evaluacionesTrabajos = res;
      let auxEvaluaciones = this.newObjectReference(this.evaluacionesTrabajos);
      //console.warn("auxEvaluaciones",auxEvaluaciones)
      for(let e1 of this.evaluacionesTrabajos){
        for(let e2 of this.evaluacionesTrabajos){
          if(e1.id_trabajo == e2.id_trabajo){
            if(e1.id_tipo_evaluacion == e2.id_tipo_evaluacion){
              if(moment(e1.update_time) == moment(e2.update_time)){
              }else if(moment(e1.update_time) < moment(e2.update_time)){
                auxEvaluaciones = auxEvaluaciones.filter((value: any) => value.id != e1.id);
              }else if(moment(e1.update_time) > moment(e2.update_time)){
                auxEvaluaciones = auxEvaluaciones.filter((value: any) => value.id != e2.id);
              }
            }
          }
        }
      }
      this.evaluacionesTrabajos = auxEvaluaciones;
      for(let t of this.trabajos){
        for(let et of this.evaluacionesTrabajos){
          if(t.id == et.id_trabajo){
            if(et.id_tipo_evaluacion == 1){
              if(et.aprobatoria){
                t.evaluacion='Preaprobado';
              }else{
                t.evaluacion='No preaprobado';
              }
            }
            if(et.id_tipo_evaluacion == 2){
              if(et.aprobatoria){
                t.evaluacion='Aprobado';
              }else{
                t.evaluacion='No aprobado';
              }
            }
          }
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus de la institución especificada'});
      console.error(err)
    });
  }

  loadInformacionPopover(){
    this.loadingCount++
    this.eventService.getAuthorByWorks(this.eventoId,this.datosWorkId).subscribe((res: any) => {
      this.loadingCount--
      this.autoresListDisplay = res;

      this.autorPopover = [];
      for(let aut of this.autoresListDisplay){
        this.tituloPopOverInnerHtml = '' +
          '<div class="row">\n' +
          '  <div class="col-2">\n' +
          '    <h2><i class="fal fa-user mr-2"></i></h2>\n' +
          '  </div>\n' +
          '  <div class="col">\n' +
          '    <span style="margin:-2px;font-size:5px;">'+aut.nombre+'</span><br>\n' +
          '    <span style="margin:-2px;font-size:5px;">'+aut.correo+'</span><br>\n';
        if(aut.orcid && aut.orcid!='' && aut.orcid!=null){
          this.tituloPopOverInnerHtml +=
            '  <span style="margin:-2px;font-size:5px;"><a href="https://orcid.org/'+aut.orcid+'" target="_blank">'+aut.orcid+'</a></span><br>\n';
        }
        this.tituloPopOverInnerHtml +=
          '  </div>\n' +
          '</div>';
        this.contentPopOverInnerHtml = '<h6><b>Afiliaciones</b></h6>';
        if(aut.rors.length!=0){
          for(let dat of aut.rors){
            for(let afi of this.afiliacionesDatos){
              if(dat.id==afi.id){
                this.contentPopOverInnerHtml += '<h6>* '+afi.institution_name+'</h6>';
              }
            }
          }
        }else{
          this.contentPopOverInnerHtml += '<h6>No hay afiliaciones asignadas</h6>';
        }
        this.contentPopOverInnerHtml += '<h6><b>Campus</b></h6>';
        if(aut.campus.length!=0){
          for(let camp of aut.campus){
            for(let cam of this.campusTotalList){
              if(camp.id==cam.id){
                this.contentPopOverInnerHtml += '<h6>* '+cam.nombre+'</h6>';
              }
            }
          }
        }else{
          this.contentPopOverInnerHtml += '<h6>No hay campus asignados</h6>';
        }
        this.autorPopover.push({id:aut.id,titulo:this.tituloPopOverInnerHtml,contenido:this.contentPopOverInnerHtml});
      }

    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los autores del evento especificado'});
      console.error(err)
    });
  }

  loadAreasConocimiento(){
    this.loadingCount++
    this.eventService.getArea().subscribe((res: any) => {
      this.loadingCount--
      this.areasConocimientoList = res;
      this.areasConocimientoTot = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las areas de conocimiento del sistema'});
      console.error(err)
    });
  }

  loadCampus() {
    this.campusList=[];
    this.loadingCount++
    this.eventService.getCampusList(this.cordId).subscribe((res: any) => {
      this.loadingCount--
      this.campusTotalList = res;
      let auxCampusList = [];
      for(let campus1 of res){
        for(let campus2 of this.campusEvent){
          if(campus1.id==campus2.id){
            auxCampusList.push(campus1);
          }
        }
      }
      this.campusList = auxCampusList;
      this.campusTotalList = this.newObjectReference(this.campusList);
      this.loadCampusDisponibles();
      this.loadCampusNoDisponibles();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus de la institución especificada'});
      console.error(err)
    });
  }

  loadCampusDisponibles(){
    if(this.campus.length!=0){
      let campustemporal:any = [];
      for(let campus1 of this.campus){
        for(let campus2 of this.campusTotalList){
          if(campus1.id == campus2.id){
            campustemporal.push(campus2);
          }
        }
      }
      this.campus = campustemporal;
    }
  }

  loadCampusNoDisponibles(){
    if(this.campus.length!=0) {
      let campustemporal2: any = this.campusList;
      for (let campus1 of this.campus) {
        for (let campus2 of this.campusList) {
          if (campus1.id == campus2.id) {
            campustemporal2 = campustemporal2.filter((ca2: any) => ca2.id != campus1.id)
          }
        }
      }
      this.campusList = campustemporal2;
    }
  }

  asignarCampus(){
    for(let camp of this.campusList){
      if(camp.id==this.campusSelected){
        this.campus.push(camp);
        this.campusList = this.campusList.filter( (ca1) => ca1.id != this.campusSelected);
        this.campusSelected = 0;
      }
    }
    this.loadCampus();
  }

  removeCampus = (idcamp:number) => {
    this.campus = this.campus.filter( (camp:any) => camp.id != idcamp)
    this.loadCampus();
    this.campusSelected = 0;
  }

  searchAfiliaciones(){
    if(this.search2!=''){
      this.loadingCount++
      this.eventService.searchRor(this.search2).subscribe((res: any) => {
        this.loadingCount--
        this.afiliacionesList = res.slice(0,50);
        let afiliacionesDisponibles = this.afiliacionesList;
        for(let al of this.afiliacionesList){
          for(let a of this.afiliaciones){
            afiliacionesDisponibles = afiliacionesDisponibles.filter( (camp:any) => camp.id != a.id)
          }
        }
        this.afiliacionesList = afiliacionesDisponibles;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las posibles instituciones de afiliación'});
        console.error(err)
      });
    }
    /*
    if(this.afiliaciones.length!=0){
      this.loadRor();
    }*/
  }

  loadRor(){
    if(this.afiliaciones.length!=0){
      this.afiliacionesAsing = [];
      for(let afil of this.afiliaciones){
        this.loadingCount++
        this.eventService.getRorById(afil.id).subscribe((res: any) => {
          this.loadingCount--
          if(res.length!=0){
            this.afiliacionesAsing.push(res);
          }
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se cargaron los datos de la institución de afiliación especificada'});
          console.error(err)
        });
      }
      this.afiliaciones = this.afiliacionesAsing ;
    }
  }

  asignarRor () {
    for(let afil of this.afiliacionesList){
      if(afil.id==this.afiliacionSelected){
        this.afiliaciones.push(afil);
        this.afiliacionesList = this.afiliacionesList.filter( (af1:any) => af1.id != this.afiliacionSelected);
        this.afiliacionSelected = 0;
      }
    }
  }

  removeRor = (idror:number) => {
    this.afiliaciones = this.afiliaciones.filter( (af:any) => af.id != idror)
    this.searchAfiliaciones();
    this.afiliacionSelected = 0;
  }

  searchFuentes(){
    this.loadingCount++
    this.eventService.searchFonts(this.search1).subscribe((res: any) => {
      this.loadingCount--
      this.fuentesList = res.slice(0,50);
      this.datosWorkFuente = 0;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se buscaron las fuentes del sistema'});
      console.error(err)
    });
  }

  asignarAutor(){
    this.validacion();
    if(this.autorNombre!=''){
      if(this.autorCorreo!=''){
        let repeatedEmail = this.autores.map(value => value.correo).filter(value => value == this.autorCorreo).length != 0
        if(!repeatedEmail){
          this.autores.push({id_trabajo:1,nombre:this.autorNombre,correo:this.autorCorreo,orcid:this.autorORCID,rors:this.afiliaciones,campus:this.campus});
          this.saveAutorFlag = true;
          let timerInterval
          Swal.fire({
            timer: 5000,
            backdrop:`
            rgba(0,0,0,0.0)
          `,
            didOpen: () => {
              timerInterval = setInterval(() => {
              }, 200)
            },
            willClose: () => {
              this.saveAutorFlag = false;
            }
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              this.saveAutorFlag = false;
            }
          })
        }else{
          this.dontSaveAutorFlag = true;
          let timerInterval
          Swal.fire({
            timer: 5000,
            backdrop:`
            rgba(0,0,0,0.0)
          `,
            didOpen: () => {
              timerInterval = setInterval(() => {
              }, 200)
            },
            willClose: () => {
              this.dontSaveAutorFlag = false;
            }
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              this.dontSaveAutorFlag = false;
            }
          })
        }
      }
    }
  }

  removeAutor(autor:string,correo:string){
    autor.trim()
    this.autores = this.autores.filter( (au:any) => au.correo != correo);
  }

  updateAutor(){
    let email = this.autores.map(value => value.correo).filter(value => value == this.autorCorreo).length != 0
    if(email){
      let autores = this.autores;
      this.autores=[];
      for(let a of autores){
        if(a.correo==this.autorCorreo){
          a.orcid = this.autorORCID;
          a.rors = this.afiliaciones;
          a.campus = this.campus;
        }
      }
      this.autores = this.newObjectReference(autores);
    }
  }

  agregarArea(){
    for(let a of this.areasConocimientoList){
      if(this.areaSelected==a.id){
        this.areasConocimiento.push(a);
        this.areasConocimientoList = this.areasConocimientoList.filter( (area:any) => area.id != a.id );
        this.areaSelected = 0;
      }
    }
  }

  removeArea(idAutor:number){
    for(let a of this.areasConocimiento){
      if(idAutor==a.id){
        this.areasConocimientoList.push(a);
        this.areasConocimiento = this.areasConocimiento.filter( (area:any) => area.id != a.id );
        this.areaSelected = 0;
      }
    }
  }

  saveWork(){
    this.validateMetaSection();
    if(this.validTotal == false){
      this.loadingCount++
      this.eventService.addWorkToParticipation(this.participationId,1,this.typeWorkSelected,1).subscribe((res: any) => {
        this.loadingCount--
        this.trabajoId = res;
        //console.log("se creo el trabajo");
        let refrendo = 0;
        if(this.trabajoRefrendoTrue){
          refrendo = 1;
        }
        this.loadingCount++
        this.eventService.updateWorkWithRefrendo(this.trabajoId,this.fuentesSelected,refrendo).subscribe((res: any) => {
          this.loadingCount--
          /** se guardan los metadatos en español INICIO **/
          if(this.errorOnSaveFlag == false){
            this.loadingCount++
            this.eventService.addMetadatos(this.trabajoId,150,this.datosTitulo1,this.datosresumen1,this.datosUrl1).subscribe((res: any) => {
              this.loadingCount--
              //console.log("se agregaron metadatos en español");
            }, (err:any) =>{
              this.loadingCount--
              Swal.fire({icon: 'error',text: 'No se agregaron los metadatos en español al trabajo especificado'});
              this.errorOnSaveFlag = true;
              console.error(err)
            });
          }
          /** se guardan los metadatos en español FIN**/
          /** se guardan los metadatos en ingles INICIO**/
          if(this.errorOnSaveFlag == false){
            this.loadingCount++
            this.eventService.addMetadatos(this.trabajoId,41,this.datosTitulo2,this.datosresumen2,this.datosUrl2).subscribe((res: any) => {
              this.loadingCount--
              console.log("se agregaron metadatos en ingles");
            }, (err:any) =>{
              this.loadingCount--
              Swal.fire({icon: 'error',text: 'No se agregaron los metadatos en ingles al trabajo especificado'});
              this.errorOnSaveFlag = true;
              console.error(err)
            });
          }
          /** se guardan los metadatos en ingles FIN**/
          /** se guardan las areas de conocimiento INICIO**/
          if(this.errorOnSaveFlag == false){
            if(this.areasConocimiento.length!=0){
              let ids:any = this.areasConocimiento.map(value => value.id).join(' ');
              this.loadingCount++
              this.eventService.addArea(this.trabajoId,ids).subscribe((res: any) => {
                this.loadingCount--
                this.loadWork();
                console.log("Se agregaron áreas del conocimiento en inglés");
              }, (err:any) =>{
                this.loadingCount--
                Swal.fire({icon: 'error',text: 'No se agregaron las áreas de conocimiento al trabajo especificado'});
                this.errorOnSaveFlag = true;
                console.error(err)
              });
            }
          }
          /** se guardan las areas FIN**/
          /** se guardan las autores INICIO**/
          if(this.errorOnSaveFlag == false){
            for(let a of this.autores){
              this.loadingCount++
              this.eventService.addAuthor(this.trabajoId,a.nombre,a.correo,a.orcid).subscribe((res: any) => {
                this.loadingCount--
                this.autorId = res;
                if(this.errorOnSaveFlag == false){
                  if(a.rors.length!=0){
                    let instituciones:any[] =  a.rors;
                    let ids:any = instituciones.map(value => value.id).join(' ');
                    this.loadingCount++
                    this.eventService.addInstitucionToAutor(this.autorId,ids).subscribe((res: any) => {
                      this.loadingCount--
                      console.log("se agrego la institución a el autor especificado");
                    }, (err:any) =>{
                      this.loadingCount--
                      Swal.fire({icon: 'error',text: 'No se agregó la institución al autor especificado'});
                      this.errorOnSaveFlag = true;
                      console.error(err)
                    });
                  }
                }
                if(this.errorOnSaveFlag == false){
                  if(a.campus.length!=0){
                    let campus:any[] =  a.campus;
                    let ids:any = campus.map(value => value.id).join(' ');
                    this.loadingCount++
                    this.eventService.addCampusToAutor(this.autorId,ids).subscribe((res: any) => {
                      this.loadingCount--
                      console.log("se agrego el campus al autor");
                    }, (err:any) =>{
                      this.loadingCount--
                      Swal.fire({icon: 'error',text: 'No se agregó el campus al autor especificado'});
                      this.errorOnSaveFlag = true;
                      console.error(err)
                    });
                  }
                }
                console.log("se creo el autor en el trabajo especificado");
              }, (err:any) =>{
                this.loadingCount--
                Swal.fire({icon: 'error',text: 'No se agregó el autor al trabajo especificado'});
                this.errorOnSaveFlag = true;
                console.error(err)
              });
            }
          }
          /** se guardan los autores FIN**/
          /** se guardan las archivos INICIO**/
          if(this.errorOnSaveFlag == false) {
            if (this.archivosTrabajos.length != 0) {
              for (let a of this.archivosTrabajos) {
                if(!a.id){
                  this.saveFileToWork(a.nombre, a.descripcion,this.trabajoId, a.file)
                }
              }
            }
          }
          /** se guardan los archivos FIN**/
          this.loadWork();
          console.log("se agrego la fuente");
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se actualizó la fuente del trabajo especificado'});
          this.errorOnSaveFlag = true;
          console.error(err)
        });

        if(this.errorOnSaveFlag == true){
          this.loadingCount++
          this.eventService.deleteWork(this.trabajoId).subscribe((res: any) => {
            this.loadingCount--
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se pudo eliminar el trabajo indicado'});
            console.error(err)
          });
        }

      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se guardaron los datos del trabajo especificado'});
        console.error(err)
      });
    }
  }

  updateWork(){
    this.validateMetaSection();
    if(this.validTotal == false) {
      /** Se actualizan los metadatos en español o se agregan si no existen INICIO **/
      //console.log("this.idMetaEspañol", this.idMetaEspanol)
      if (this.idMetaEspanol != 0) {
        this.loadingCount++
        this.eventService.updateMetadatos(this.idMetaEspanol, this.datosTitulo1, this.datosresumen1, this.datosUrl1).subscribe((res: any) => {
          this.loadingCount--
          this.loadDatos()
          console.log("se actualizaron los metadatos en español");
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se actualizaron los metadatos con el id especificado'});
          console.error(err)
        });
      } else {
        this.loadingCount++
        this.eventService.addMetadatos(this.trabajoId, 150, this.datosTitulo1, this.datosresumen1, this.datosUrl1).subscribe((res: any) => {
          this.loadingCount--
          this.loadDatos()
          console.log("se agregaron metadatos en español");
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se agregaron los metadatos en español al trabajo especificado'});
          this.errorOnSaveFlag = true;
          console.error(err)
        });

      }
      /** Se actualizan los metadatos en español o se agregan si no existen FIN **/
      /** Se actualizan los metadatos en ingles o se agregan si no existen INICIO **/
      console.log("this.idMetaIngles", this.idMetaIngles)
      if (this.idMetaIngles != 0) {
        this.loadingCount++
        this.eventService.updateMetadatos(this.idMetaIngles, this.datosTitulo2, this.datosresumen2, this.datosUrl2).subscribe((res: any) => {
          this.loadingCount--
          this.loadDatos()
          console.log("se actualizaron los metadatos en ingles");
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se actualizaron los metadatos con el id especificado'});
          console.error(err)
        });
      } else {
        if (this.errorOnSaveFlag == false) {
          this.loadingCount++
          this.eventService.addMetadatos(this.trabajoId, 41, this.datosTitulo2, this.datosresumen2, this.datosUrl2).subscribe((res: any) => {
            this.loadingCount--
            this.loadDatos()
            console.log("se agregaron metadatos en ingles");
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se agregaron los metadatos en ingles al trabajo especificado'});
            this.errorOnSaveFlag = true;
            console.error(err)
          });
        }
      }
      /** Se actualizan los metadatos en ingles o se agregan si no existen FIN **/
      /** Se actualizan los metadatos en ingles o se agregan si no existen INICIO **/
      if (this.fuentesSelected != 0) {
        let refrendo = 0;
        if(this.trabajoRefrendoTrue){
          refrendo = 1;
        }
        this.loadingCount++
        this.eventService.updateWorkWithRefrendo(this.trabajoId, this.fuentesSelected,refrendo).subscribe((res: any) => {
          this.loadingCount--
          this.loadWork();
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se actualizo la fuente del trabajo especificado'});
          console.error(err)
        });
      }
      /** Se actualizan los metadatos en ingles o se agregan si no existen FIN **/
      /** Se actualizan las areas de conocimiento de el evento INICIO **/
      if (this.areasOld.length == 0) {
        if (this.areasConocimiento.length != 0) {
          let ids: any = this.areasConocimiento.map(value => value.id).join(' ');
          this.loadingCount++
          this.eventService.addArea(this.trabajoId, ids).subscribe((res: any) => {
            this.loadingCount--
            this.loadWork();
            console.log("area agregada");
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se agregó el area conocimiento al trabajo especificado'});
            console.error(err)
          });
        }
      } else if (this.areasConocimiento.length == 0) {
        if (this.areasOld.length != 0) {
          let ids: any = this.areasOld.map(value => value.id).join(' ');
          this.loadingCount++
          this.eventService.removeArea(this.trabajoId, ids).subscribe((res: any) => {
            this.loadingCount--
            this.loadWork();
            //console.log("campus eliminado");
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se eliminó el area conocimiento trabajadpr especificado'});
            console.error(err)
          });
        }
      } else {
        let add2: any[] = this.areasConocimiento;
        for (let area1 of this.areasOld) {
          for (let area2 of this.areasConocimiento) {
            if (area1.id == area2.id) {
              add2 = add2.filter((area: any) => area.id != area1.id)
            }
          }
        }
        if (add2.length != 0) {
          let ids: any = add2.map(value => value.id).join(' ');
          this.loadingCount++
          this.eventService.addArea(this.trabajoId, ids).subscribe((res: any) => {
            this.loadingCount--
            this.loadWork();
            console.log("campus agregado");
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se agregó el area de conocimiento al trabajo especificado'});
            console.error(err)
          });
        }
        let del2: any[] = this.areasOld;
        for (let area1 of this.areasOld) {
          for (let area2 of this.areasConocimiento) {
            if (area1.id == area2.id) {
              del2 = del2.filter((area: any) => area.id != area2.id)
            }
          }
        }
        if (del2.length != 0) {
          let ids: any = del2.map(value => value.id).join(' ');
          this.loadingCount++
          this.eventService.removeArea(this.trabajoId, ids).subscribe((res: any) => {
            this.loadingCount--
            this.loadWork();
            console.log("campus desasignado");
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se eliminó el area de conocimiento de el trabajo especificado'});
            console.error(err)
          });
        }
      }
      /** Se actualizan las areas de conocimiento de el evento FIN **/
      /** Se actualizan los usuarios del trabajo INICIO **/
      if (this.autoresOld.length == 0) {
        for (let a of this.autores) {
          this.loadingCount++
          this.eventService.addAuthor(this.trabajoId, a.nombre, a.correo, a.orcid).subscribe((res: any) => {
            this.loadingCount--
            this.autorId = res;
            if (this.errorOnSaveFlag == false) {
              if (a.rors.length != 0) {
                let instituciones: any[] = a.rors;
                let ids: any = instituciones.map(value => value.id).join(' ');
                this.loadingCount++
                this.eventService.addInstitucionToAutor(this.autorId, ids).subscribe((res: any) => {
                  this.loadingCount--
                  this.loadAutores()
                  console.log("se agrego la institución al autor especificado");
                }, (err: any) => {
                  this.loadingCount--
                  Swal.fire({icon: 'error', text: 'No se agregó la institución al autor especificado'});
                  this.errorOnSaveFlag = true;
                  console.error(err)
                });
              }
            }
            if (this.errorOnSaveFlag == false) {
              if (a.campus.length != 0) {
                let campus: any[] = a.campus;
                let ids: any = campus.map(value => value.id).join(' ');
                this.loadingCount++
                this.eventService.addCampusToAutor(this.autorId, ids).subscribe((res: any) => {
                  this.loadingCount--
                  this.loadAutores()
                  console.log("se agrego el campus al autor");
                }, (err: any) => {
                  this.loadingCount--
                  Swal.fire({icon: 'error', text: 'No se agregó el campus al autor especificado'});
                  this.errorOnSaveFlag = true;
                  console.error(err)
                });
              }
            }
            console.log("se creo el autor en el trabajo especificado");
            this.loadWork();
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se agregó el autor al trabajo especificado'});
            this.errorOnSaveFlag = true;
            console.error(err)
          });
        }
      } else if (this.autores.length == 0) {
        for (let d of this.autoresOld) {
          this.loadingCount++
          this.eventService.deleteAutorToWork(d.id).subscribe((res: any) => {
            this.loadingCount--
            this.loadAutores()
            console.log("autor eliminado");
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se eliminó el autor especificado del trabajo'});
            console.error(err)
          });
        }
      } else {
        let add2: any[] = this.autores;
        for (let area1 of this.autoresOld) {
          for (let area2 of this.autores) {
            if (area1.id == area2.id) {
              add2 = add2.filter((area: any) => area.id != area1.id)
            }
          }
        }
        console.log("agregar", add2)
        if (add2.length != 0) {
          for (let a of add2) {
            this.loadingCount++
            this.eventService.addAuthor(this.trabajoId, a.nombre, a.correo, a.orcid).subscribe((res: any) => {
              this.loadingCount--
              this.autorId = res;
              if (this.errorOnSaveFlag == false) {
                if (a.rors.length != 0) {
                  let instituciones: any[] = a.rors;
                  let ids: any = instituciones.map(value => value.id).join(' ');
                  this.loadingCount++
                  this.eventService.addInstitucionToAutor(this.autorId, ids).subscribe((res: any) => {
                    this.loadingCount--
                    this.loadAutores();
                    console.log("se agrego la institución al autor especificado");
                  }, (err: any) => {
                    this.loadingCount--
                    Swal.fire({icon: 'error', text: 'No se agregó la institución al autor especificado'});
                    this.errorOnSaveFlag = true;
                    console.error(err)
                  });
                }
              }
              if (this.errorOnSaveFlag == false) {
                if (a.campus.length != 0) {
                  let campus: any[] = a.campus;
                  let ids: any = campus.map(value => value.id).join(' ');
                  this.loadingCount++
                  this.eventService.addCampusToAutor(this.autorId, ids).subscribe((res: any) => {
                    this.loadingCount--
                    this.loadAutores();
                    console.log("se agrego el campus al autor");
                  }, (err: any) => {
                    this.loadingCount--
                    Swal.fire({icon: 'error', text: 'No se agregó el campus al autor especificado'});
                    this.errorOnSaveFlag = true;
                    console.error(err)
                  });
                }
              }
              this.loadWork();
              console.log("se creo el autor en el trabajo especificado");
            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error', text: 'No se agregó el autor al trabajo especificado'});
              this.errorOnSaveFlag = true;
              console.error(err)
            });
          }
        }
        let del2: any[] = this.autoresOld;
        for (let area1 of this.autoresOld) {
          for (let area2 of this.autores) {
            if (area1.id == area2.id) {
              del2 = del2.filter((area: any) => area.id != area2.id)
            }
          }
        }
        console.log("eliminar", del2)
        if (del2.length != 0) {
          for (let d of del2) {
            this.loadingCount++
            this.eventService.deleteAutorToWork(d.id).subscribe((res: any) => {
              this.loadingCount--
              console.log("autor eliminado");
              this.loadWork();
            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error', text: 'No se eliminó el autor especificado del trabajo'});
              console.error(err)
            });
          }
        }
        let editOld: any[] = [];
        let edit: any[] = [];
        for (let ao of this.autoresOld) {
          for (let a of this.autores) {
            if (ao.id == a.id) {
              editOld.push(ao);
              edit.push(a);
            }
          }
        }
        console.log("editar", edit)
        if (edit.length != 0 && editOld.length != 0) {

          for (let a of editOld) {

            let rorsids: any = a.rors;
            let idsr: any = rorsids.map((value: any) => value.id).join(' ');
            if (idsr && idsr != '') {
              this.loadingCount++
              this.eventService.removeInstitucionToAutor(a.id, idsr).subscribe((res: any) => {
                this.loadingCount--
                console.log("se elimino la institución espesificada del autor");
              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se eliminó la institución al autor especificado'});
                this.errorOnSaveFlag = true;
                console.error(err)
              });
            }

            let campusids: any = a.campus;
            let idsc: any = campusids.map((value: any) => value.id).join(' ');
            if (idsc && idsc != '') {
              this.loadingCount++
              this.eventService.removeCampusToAutor(a.id, idsc).subscribe((res: any) => {
                this.loadingCount--
                console.log("se elimino el campus especificado del autor");
              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se eliminó el campus al autor especificado'});
                this.errorOnSaveFlag = true;
                console.error(err)
              });
            }
          }
          for (let a of edit) {

            let rorsids: any = a.rors;
            let idsr: any = rorsids.map((value: any) => value.id).join(' ');
            if (idsr && idsr != '') {
              this.loadingCount++
              this.eventService.addInstitucionToAutor(a.id, idsr).subscribe((res: any) => {
                this.loadingCount--
                console.log("se agrego la institucion a el autor");
              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se agregó el campus al autor especificado'});
                this.errorOnSaveFlag = true;
                console.error(err)
              });
            }

            let campusids: any = a.campus;
            let idsc: any = campusids.map((value: any) => value.id).join(' ');
            if (idsc && idsc != '') {
              this.loadingCount++
              this.eventService.addCampusToAutor(a.id, idsc).subscribe((res: any) => {
                this.loadingCount--
                console.log("se agrego el campus al autor");
              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se agregó la institución al autor especificado'});
                this.errorOnSaveFlag = true;
                console.error(err)
              });
            }

            this.loadingCount++
            this.eventService.updateAutorWork(a.id, a.orcid).subscribe((res: any) => {
              this.loadingCount--
              this.loadAutores();
              console.log("se agrego el campus a el autor");
            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error', text: 'No se agregó el campus al autor especificado'});
              this.errorOnSaveFlag = true;
              console.error(err)
            });

          }
        }
      }
      /** Se actualizan las areas de conocimiento de el evento FIN **/
      /** Se actualizan los archivos INICIO **/
      if (this.archivosTrabajosOld.length == 0) {
        if (this.archivosTrabajos.length != 0) {
          for(let a of this.archivosTrabajos){
            this.saveFileToWork(a.nombre, a.descripcion,this.trabajoId, a.file)
          }
        }
      } else if (this.archivosTrabajos.length == 0) {
        if (this.archivosTrabajosOld.length != 0) {
          for(let ato of this.archivosTrabajosOld){
            this.deleteFileToWork(ato.id)
          }
        }
      } else {
        for(let a of this.archivosTrabajos){
          if(!a.id){
            this.saveFileToWork(a.nombre, a.descripcion,this.trabajoId, a.file)
          }
        }
        let del: any[] = this.archivosTrabajosOld;
        for (let arch1 of this.archivosTrabajosOld) {
          for (let arch2 of this.archivosTrabajos) {
            if (arch2.id) {
              if (arch1.id == arch2.id) {
                del = del.filter((arch: any) => arch.id != arch2.id)
              }
            }
          }
        }
        console.log("delete",del);
        if (del.length != 0) {
          for(let d of del){
            if(d.id) {
              this.deleteFileToWork(d.id)
            }
          }
        }
      }
      /** Se actualizan las archivos FIN **/
    }
  }

  deleteWork(idWork:number){
    Swal.fire({
      title: '¿Deseas eliminar el trabajo?',
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
          Swal.fire({icon: 'error',text: 'No se eliminó el trabajo especificado'});
          console.error(err)
        });
      }
    })
  }

  openModalAutor(){
    this.search2 = '';
    this.autorNombre = '';
    this.autorCorreo = '';
    this.autorORCID = '';
    this.afiliacionesList = [];
    this.afiliaciones = [];
    this.campusList = [];
    this.campus = [];
    this.loadCampus();
    this.valid1 = false
    this.valid2 = false
    this.valid3 = false
    this.valid4 = false
    this.valid5 = false
    this.validEmail = false
    this.validOrcid = false
  }

  workDetailsModal(datos:any){
    this.datosWorkId = datos.id;
    this.datosWorkRefrendo = datos.refrendado_api_uvmunitec;
    this.datosWorkFuente = datos.id_fuente;
    this.datosWorkTipo = datos.id_tipo_trabajo;
    this.datosWorkEstatus = datos.id_estatus_trabajo;
    this.datosWorkAreas = datos.areas_de_conocimiento;
    this.loadInformacionPopover();
    this.loadArchivosByWork(this.datosWorkId);
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

  workUpdateModal(datos:any){
    this.validTitulo1 = false;
    this.validResumen1 = false;
    this.validTitulo2 = false;
    this.validResumen2 = false;
    this.validTotal = false;

    this.datosWorkId = datos.id;
    this.trabajoId = datos.id;

    this.datosWorkFuente = datos.id_fuente;
    this.datosWorkEstatus = datos.id_estatus_trabajo;
    this.datosWorkAreas = datos.areas_de_conocimiento;
    this.typeWorkSelected = datos.id_tipo_trabajo;

    if(datos.refrendado_api_uvmunitec){
      this.trabajoRefrendoTrue = true;
      this.trabajoRefrendoFalse = false;
    }else{
      this.trabajoRefrendoTrue = false;
      this.trabajoRefrendoFalse = true;
    }

    for(let met of this.metadatos){
      if(this.datosWorkId==met.id_trabajo && met.id_idioma==150){
        this.idMetaEspanol = met.id;
        if(met.titulo && met.titulo!=''){this.datosTitulo1 = met.titulo;}
        if(met.resumen && met.resumen!=''){this.datosresumen1 = met.resumen;}
        if(met.url && met.url!=''){this.datosUrl1 = met.url;}
      }
      if(this.datosWorkId==met.id_trabajo && met.id_idioma==41){
        this.idMetaIngles = met.id;
        if(met.titulo && met.titulo!=''){this.datosTitulo2 = met.titulo;}
        if(met.resumen && met.resumen!=''){this.datosresumen2 = met.resumen;}
        if(met.url && met.url!=''){this.datosUrl2 = met.url;}
      }
    }
    this.search1 = '';
    this.fuentesSelected = 0;
    this.fuentesList = [];
    for (let fc of this.fuentesCarga){
      if(this.datosWorkFuente==fc.id){
        this.datosWorkFuenteNombre = fc.titulo+" - "+fc.publisher;
        this.fuentesSelected = this.datosWorkFuente;
      }
    }

    this.areasConocimiento = [];
    this.areasConocimientoList = this.newObjectReference(this.areasConocimientoTot);
    for(let d of this.datosWorkAreas){
      for(let a of this.areasConocimientoList){
        if(d.id==a.id){
          this.areasConocimiento.push(a);
        }
      }
    }
    for(let a of this.areasConocimiento){
      this.areasConocimientoList = this.areasConocimientoList.filter((area:any) => area.id != a.id)
    }
    this.areasOld = this.newObjectReference(datos.areas_de_conocimiento);
    this.autores = this.autoresList;
    this.autores = this.autores.filter( (ca2: any) => ca2.id_trabajo == this.datosWorkId)
    this.autoresOld = this.newObjectReference(this.autores);

    this.loadArchivosByWork(this.datosWorkId);


  }

  autorDetails(datos:any){
    this.autorDatos = datos;
    this.autorDatosNombre = datos.nombre;
    this.autorDatosCorreo = datos.correo;
    this.autorDatosOrcid = datos.orcid;
    this.search2 = '';
    this.afiliacionesList= '';

    let clase = 0;
    for(let dr of datos.rors){
      if(dr.institution_name){
        clase = 1;
      }
    }

    this.autorDatosInstituciones = [];
    if(clase == 0){
      let igualarAfiliaciones = [];
      for(let dr of datos.rors){
        for(let af of this.afiliacionesDatos){
          if(dr.id==af.id){
            igualarAfiliaciones.push(af);
          }
        }
      }
      this.autorDatosInstituciones = igualarAfiliaciones;
    }else if(clase==1){
      this.autorDatosInstituciones = datos.rors;
    }

    this.autorDatosCampus = [];
    var igualarCampus = [];
    for(let dc of datos.campus){
      for(let ctl of this.campusTotalList){
        if(dc.id==ctl.id){
          igualarCampus.push(ctl);
        }
      }
    }
    this.autorDatosCampus = igualarCampus;
  }

  autorUpdateModal(datos:any){
    this.autorDatos = datos;
    this.autorNombre = datos.nombre;
    this.autorCorreo = datos.correo;
    if(datos.orcid && datos.orcid!=null){
      this.autorORCID = datos.orcid;
    }else{
      this.autorORCID = '';
    }
    let clase = 0;
    for (let dr of datos.rors) {
      if (dr.institution_name) {
        clase = 1;
      }
    }

    this.afiliaciones = [];
    if (clase == 0) {
      let igualarAfiliaciones = [];
      for (let dr of datos.rors) {
        for (let af of this.afiliacionesDatos) {
          if (dr.id == af.id) {
            igualarAfiliaciones.push(af);
          }
        }
      }
      this.afiliaciones = igualarAfiliaciones;
    } else if (clase == 1) {
      this.afiliaciones = datos.rors;
    }

    this.campus = [];
    var igualarCampus = [];
    for (let dc of datos.campus) {
      for (let ctl of this.campusTotalList) {
        if (dc.id == ctl.id) {
          igualarCampus.push(ctl);
        }
      }
    }
    this.campus = igualarCampus;

    this.campusList = [];
    let listaDisponibles = this.campusTotalList;
    for(let c of datos.campus){
      listaDisponibles = listaDisponibles.filter( (cl: any) => cl.id != c.id)
    }
    this.campusList = listaDisponibles;

    if(datos.campus.length==0){
      this.campusList = this.campusTotalList;
    }

    this.valid1 = false
    this.valid2 = false
    this.valid3 = false
    this.valid4 = false
    this.valid5 = false
    this.validEmail = false
    this.validOrcid = false

  }

  clearValues(){
    this.datosTitulo1 = '';
    this.datosTitulo2 = '';
    this.datosresumen1 = '';
    this.datosresumen2 = '';
    this.datosUrl1 = '';
    this.datosUrl2 = '';
    this.validTitulo1 = false;
    this.validResumen1 = false;
    this.validTitulo2 = false;
    this.validResumen2 = false;
    this.validTotal = false;
    this.typeWorkSelected = 0;
    this.search1 = '';
    this.search2 = '';
    this.fuentesSelected = 0;
    this.fuentesList = [];
    this.areasConocimiento = [];
    this.autores = [];
    this.loadAreasConocimiento();
    this.archivosTrabajos = [];
    this.trabajoRefrendoFalse = false;
    this.trabajoRefrendoTrue = false;
  }

  validacion(){
    if(this.autorNombre==''){
      this.valid1=true;
    }else{
      this.valid1=false;
    }
    if(this.autorCorreo==''){
      this.validEmail=true;
      this.valid2=true;
    }else{
      if(/[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[a-zA-Z0-9]$/.test(this.autorCorreo)){
        this.validEmail = false;
        this.valid2=false;
      }else{
        this.validEmail = true;
        this.valid2=false;
      }
    }
    if(this.autorORCID==''){
      this.validOrcid=true;
      this.valid4=true;
      this.valid5=false;
    }else{
      if(/^(\d{4}-){3}\d{3}(\d|X)$/.test(this.autorORCID)){
        this.validOrcid=false;
        this.valid4=false;
        this.valid5=false;
      }else{
        this.validOrcid=true;
        this.valid5=true;//formato incorrecto
        this.valid4=false;
      }
    }
    if(this.autores.length==0){
      this.valid3=true;
    }else{
      this.valid3=false;
    }
  }

  /**
   * Valida la sección de metadatos de un trabajo
   */
  validateMetaSection() {
    this.resetConjMetaSectionValidation()
    //validTotal == true es form no válido, false es form valido
    let espaniolVacio = this.isMetaSetEmpty(this.datosTitulo1, this.datosresumen1, this.datosUrl1);
    let inglesVacio = this.isMetaSetEmpty(this.datosTitulo2, this.datosresumen2, this.datosUrl2);
    let hayAlgunIdioma = false
    if (!espaniolVacio) {
      const aux = this.validateMetaSet(this.datosTitulo1, this.datosresumen1, this.datosUrl1)
      this.validTotal = !aux[0]
      this.validTitulo1 = !aux[1]
      this.validResumen1 = !aux[2]
      hayAlgunIdioma = true
    }
    if (!inglesVacio) {
      const aux = this.validateMetaSet(this.datosTitulo2, this.datosresumen2, this.datosUrl2)
      this.validTotal = this.validTotal || !aux[0]
      this.validTitulo2 = !aux[1]
      this.validResumen2 = !aux[2]
      hayAlgunIdioma = true
    }
    if (!hayAlgunIdioma) {
      this.validTotal = true
      this.validTitulo1 = true
      this.validTitulo2 = true
      this.validResumen1 = true
      this.validResumen2 = true
    }
  }

  /**
   * Evalúa la validez de los 3 campos de un conjunto de metadatos de manera independiente de los demás
   * @param titulo
   * @param resumen
   * @param url
   */
  validateMetaSet(titulo: string, resumen: string, url: string) {
    let validTitle = !(titulo == '')
    let validResumen = !(resumen == '')
    let validUrl = true
    let valid = (validTitle && validResumen && validUrl)
    return [valid, validTitle, validResumen, validUrl]
  }

  /**
   * Comprueba si un conjunto de metadatos está vacío
   * @param titulo
   * @param resumen
   * @param url
   */
  isMetaSetEmpty(titulo: string, resumen: string, url: string) {
    return titulo == '' && resumen == '' && url == ''
  }

  /**
   * Resetea las validaciones de la sección de conjunto de metadatos
   */
  resetConjMetaSectionValidation() {
    this.validTitulo1 = false;
    this.validTitulo2 = false;
    this.validResumen1 = false;
    this.validResumen2 = false;
    this.validTotal = false;
  }

  compareArray(a:any, b:any) {
    if(!Array.isArray(a) || !Array.isArray(b)) return false;
    let sorted_a = [ ...a ].sort();
    let sorted_b = [ ...b ].sort();
    return (
      sorted_a.length === sorted_b.length &&
      sorted_a.every((element, index) => element === sorted_b[index])
    );
  }

  newFileModal(){
    this.tipoArchivoSelected = 7;
    this.nombreArchivo = '';
    this.descripcionArchivo = '';
    this.archivoTrabajo = null;
    this.archivoVacio = '';
  }

  loadArchivosByWork(workId:number) {
    if(workId && workId!=0){
      this.loadingCount++
      this.eventService.getFilesByWork(this.eventoId,7,workId).subscribe((res: any) => {
        this.loadingCount--
        this.archivosTrabajos=res;
        this.archivosTrabajosOld=res;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los archivos del evento especificado'});
        console.error(err)
      });
    }
  }

  agregarArchivo(){
    const timestamp = Date.now();
    this.archivosTrabajos.push({nombre:this.nombreArchivo,descripcion:this.descripcionArchivo,file:this.archivoTrabajo,clave:timestamp})
  }

  removeArchivoById(id:any){
    this.archivosTrabajos = this.archivosTrabajos.filter( (af:any) => af.id != id)
  }

  removeArchivoByClave(clave:any){
    this.archivosTrabajos = this.archivosTrabajos.filter( (af:any) => af.clave != clave)
  }

  viewFileSaved(archivourl:string){
    this.loadingCount++
    this.eventService.viewEventFile(archivourl).subscribe((resfile: Blob) => {
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
  }

  viewFileNew(file: string){
    let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file))
    let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
    // @ts-ignore
    window.open(fileUrl.toString(), '_blank');
  }

  saveFileToWork(nombre:string,descripcion:string,trabajoId:number,file:any) {
    this.loadingCount++
    this.eventService.addFileWork(nombre, descripcion, this.eventoId, 7, trabajoId, file).subscribe((res: any) => {
      this.loadingCount--
      console.log("se agrego el archivo a el trabajo");
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se agregó el archivo al trabajo especificado'});
      this.errorOnSaveFlag = true;
      console.error(err)
    });
  }

  deleteFileToWork(archivo:any) {
    this.loadingCount++
    this.eventService.deleteEventFile(archivo).subscribe((resDelete: any) => {
      this.loadingCount--
      console.log("Archivo eliminado");
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se eliminó el archivo especificado'});
      console.error(err)
    });
  }

  extractFileFromEvent(event: any) {
    this.archivoTrabajo = event.target.files[0]
  }

  trackByFn = (index: number, item: any) => {
    return index
  }

  getCommaSeparatedAuthorListHtml(idTrab: any) {
    return this.autoresList.filter((value) => { return value.id_trabajo == idTrab})
      .map((value: any) => {return value.nombre}).join(',<br>')
  }

  cargarPagosSuscripcion(idEvento: number,idsTrabajos: Array<number>) {
    return this.pagosService.getPayments(idEvento,idsTrabajos)
  }

  loadPagos(){
    let idsTrabajos = this.trabajos.map((value: any) => value.id);
    this.loadingCount++
    const pagosSuscripcion = this.cargarPagosSuscripcion(this.eventoId,idsTrabajos);
    pagosSuscripcion.subscribe((res:any) => {
      this.loadingCount--
      this.trabajosPagos = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los autores de los trabajos especificados'});
      console.error(err)
    });
  }

  filterPagos(idTrab: any) {
    let auxPagos = this.trabajosPagos.filter((value: any) => value.id_trabajo == idTrab)
    if(auxPagos.length!=0){
      return true
    }else{
      return false
    }
  }

  activeRefrendo(active:string){
    if(active=='true'){
      this.trabajoRefrendoTrue = true;
      this.trabajoRefrendoFalse = false;
    }else{
      this.trabajoRefrendoTrue = false;
      this.trabajoRefrendoFalse = true;
    }
  }

}
