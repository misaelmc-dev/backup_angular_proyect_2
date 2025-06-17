import {Component, Input, OnInit, SecurityContext} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TrabajoScicomService} from "../../../../services/scicom/trabajo-scicom.service";
import {EvaluacionScicomService} from "../../../../services/scicom/evaluacion-scicom.service";
import {ParticipacionScicomService} from "../../../../services/scicom/participacion-scicom.service";
import {FuentesScicomService} from "../../../../services/scicom/fuentes-scicom.service";
import {EventService} from "../../../../services/event.service";
import {ArchivoScicomService} from "../../../../services/scicom/archivo-scicom.service";
import {DomSanitizer} from "@angular/platform-browser";
import Swal from "sweetalert2";
import * as moment from 'moment';
import {PagosScicomService} from "../../../../services/scicom/pagos-scicom.service";
import {NotificacionesScicomService} from "../../../../services/scicom/notificaciones-scicom.service";

@Component({
  selector: 'app-work-payments',
  templateUrl: './work-payments.component.html',
  styleUrls: ['./work-payments.component.css']
})
export class WorkPaymentsComponent implements OnInit {
  eventoId = Number(this.route.snapshot.paramMap.get('idevent'));

  idTipoEvaluacion = 2;

  eventoNombre:string = '';
  eventoTipo:number = 0;
  eventoTipoNombre:string = '';
  eventoPagoMonto:number = 0;

  fechaInicioEjecucion:string = '';
  fechaFinalEjecucion:string = '';
  fechaInicioValidacion:string = '';
  fechaFinalValidacion:string = '';

  periodoEjecucion:boolean = true;
  periodoValidacion:boolean = true;

  tipoPagoNombre:string = '';
  tipoPagoDescripcion:string = '';

  trabajosAprobados:any = [];

  trabajos:any = [];
  listaTrabajos:any = [];
  trabajosMetadatos:any = [];
  trabajosTitulos:any = [];

  eventoParticipaciones:any = [];
  eventoFuentes:any = [];
  eventoUsuarios:any = [];
  eventoAreasConocimiento:any = [];

  tiposParticipaciones:any = [];
  tiposTrabajo:any = [];

  listaTiposParticipaciones:any = [];
  listaTiposTrabajo:any = [];
  listaAreasConocimiento:any = [];

  autoresEvento:any = [];
  evaluacionesTrabajos:any = [];
  prevaluacionesTrabajos:any = [];
  trabajosSinEvaluar:any = [];

  selectedCampus:number = 0;
  campusEvento:any = [];

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageStart:number = 0;
  pageEnd:number = 0;
  pageSize:number = 3;
  totalItems:number = 0;
  labelTotalItems:string = '';
  labelTotalPagination:string = '';
  limitStartPage:number = 0;
  limitEndPage:number = 0;

  search:string = '';
  selectedAreaConocimiento:number = 0;
  selectedTipoParticipacion:number = 0;
  selectedTipoTrabajo:number = 0;
  selectedPago:number = 0;

  items: Array<any> = []; //items a tener en memoria
  itemsToShow: Array<any> = []; //items a mostrar

  loadingCount: number = 0; //cuenta el número de elementos cargando

  errorOnSaveFlag:boolean = false;

  nombreArchivo:string = '';
  descripcionArchivo:string = '';
  tipoArchivoSelected:any = 0;

  archivoVacio = '';
  archivosPagos:any[] = [];
  archivoTrabajo:any;

  modalDisabled:boolean = false;
  idTrabajoGuardar:number = 0;
  evaluacionTrue:boolean = false;
  evaluacionFalse:boolean = false;
  dictamen:string = '';

  usuariosEvaluadores: any = [];

  formasPagos: any = [];

  selectedFormaPago:number = 0;
  montoPago:number = 0;

  constructor(private trabajosScicomService: TrabajoScicomService,
              private notificacionesScicomService: NotificacionesScicomService,
              private evaluacionesService: EvaluacionScicomService,
              private participacionesService: ParticipacionScicomService,
              private pagosService: PagosScicomService,
              private fuentesService: FuentesScicomService,
              private eventService: EventService,
              private archivoService: ArchivoScicomService,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer,
              private router: Router) { }

  ngOnInit(): void {
    this.loadEvento();
    this.loadTipoPago();
    this.loadTrabajosAprobados();
    this.loadAreasDeConocimiento();
    this.loadFormasPagos();
  }

  /**
   * Devuelve una suscripción para cargar trabajos (filtro por tipo de trabajo, filtro por tipos de trabajo,
   * filtro por áreas del conocimiento, filtro por ids de trabajo)
   */
  cargaTrabajosSuscripcion(idEvento: number, idsTrab: Array<number> = undefined,
                           idsTipoTrab: Array<number> = undefined,
                           idsAreasConoc: Array<number> = undefined,
                           idsTipoPart: Array<number> = undefined)
  {
    return this.trabajosScicomService.getTrabajos(idEvento, idsTrab, undefined, undefined,
      idsTipoTrab, undefined, idsAreasConoc, undefined, idsTipoPart, undefined,
      true)
  }

  /**
   * Devuelve una suscripción para cargar conjuntos de metadatos de trabajo (filtro por search)
   */
  cargarConjuntosDeMetadatosTrabajoSuscripcion(idEvento: number, idsConj: Array<number> = undefined,
                                               searchTerm: string = undefined ,
                                               idsTabajos: Array<number> = undefined,)
  {
    return this.trabajosScicomService.getConjuntosDeMetadatosDeTrabajo(idEvento, idsConj, idsTabajos,
      undefined, searchTerm)
  }

  /**
   * Devuelve suscripción para cargar evaluaciones (filtro por aprobado o no aprobado)
   */
  cargarEvaluacionesSuscripcion(idEvento: number, idsTipoEvaluacion:Array<number>, idsTrabajos: Array<number>, idsEval: Array<number> = undefined, soloAprobatorias: boolean = false,
                                soloNoAprob: boolean = false)
  {
    return this.evaluacionesService.getEvaluaciones(idEvento, idsTipoEvaluacion, idsTrabajos, soloAprobatorias, soloNoAprob)
  }

  /**
   * Devuelve una suscripción para cargar participaciones (filtro por participaciones específicas)
   */
  cargarParticipacionesSuscripcion(idEvento: number, idsPart: Array<number> = undefined) {
    return this.participacionesService.getParticipaciones(idEvento, idsPart)
  }

  /**
   * Devuelve una suscripción para cargar los tipos de participaciones (filtro por tipos participaciones específicas)
   */
  cargarTiposParticipacionesSuscripcion(idsTipPart: Array<number>) {
    return this.participacionesService.getTiposParticipaciones(idsTipPart)
  }

  /**
   * Devuelve una sucripción para cargar usuarios scicom (filtro por usuarios scicom específicos)
   */
  cargaUsuariosScicomSuscripcion(idEvento: number, idsUsuariosScicom: Array<number>) {
    return this.eventService.getUsuariosEvento(idEvento, undefined, idsUsuariosScicom)
  }

  /**
   * Devuelve una suscripción para cargar los autores de trabajo scicom (filtro por trabajos específicos)
   */
  cargaAutoresDeTrabajoSuscripcion(idEvento: number, idsTrab:Array<number> = undefined) {
    return this.trabajosScicomService.getAutoresDeTrabajo(idEvento, undefined, idsTrab)
  }

  cargarFuentesSuscripcion(idsTrabajos: Array<number> = undefined) {
    //console.warn('idsTrbajoascargarFuentesSuscripcion: ' + JSON.stringify(idsTrabajos))
    return this.fuentesService.getFuentesDeTrabajo(idsTrabajos)
  }

  cargarTiposTrabajosSuscripcion(idsTiposTrabajos: Array<number>) {
    return this.trabajosScicomService.getTiposDeTrabajo(idsTiposTrabajos)
  }

  cargarPagosSuscripcion(idEvento: number,idsTrabajos: Array<number>) {
    return this.pagosService.getPayments(idEvento,idsTrabajos)
  }

  /**
   * Devuelve una suscripción para cargar metadatos de archivos scicom (filtro por trabajos, filtro por evaluación)
   */
  cargaArchivosSuscripcion(idEvento: number, idsTipsArch: Array<number> = undefined, idsTrab: Array<number> = undefined,
                           idsEval: Array<number> = undefined)
  {
    return this.archivoService.getMetadatosDeArchivosScicom(idEvento, undefined, idsTipsArch, idsTrab,
      undefined, undefined, idsEval)
  }

  cargaArchivosEvaluacionSuscripcion(idEvento: number, idsTipsArch: Array<number> = undefined)
  {
    return this.archivoService.getArchivosEvaluacionesScicom(idEvento, idsTipsArch)
  }

  cargarAreasDeConocimientoSuscripcion(idsTrabajos: Array<number> = undefined) {
    return this.fuentesService.getFuentesDeTrabajo(idsTrabajos)
  }

  loadTrabajosAprobados(){
    let suscripcionTrabajos = this.cargaTrabajosSuscripcion(this.eventoId)
    this.loadingCount++
    suscripcionTrabajos.subscribe((res: any) => {
      this.loadingCount--
      const idsTrabajos = res.map((value: any) => value.id)
      let arrayTiposprevaluaciones = [2];
      let preevaluacionesSuscripcion = this.cargarEvaluacionesSuscripcion(this.eventoId,arrayTiposprevaluaciones,idsTrabajos);
      this.loadingCount++
      preevaluacionesSuscripcion.subscribe((resPrev:any) => {
        this.loadingCount--
        this.trabajosAprobados = resPrev;
        let auxTrabajosAprob = this.newObjectReference(this.trabajosAprobados);
        for(let e1 of this.trabajosAprobados){
          for(let e2 of this.trabajosAprobados){
            if(e1.id_trabajo == e2.id_trabajo){
              if(moment(e1.update_time) == moment(e2.update_time)){
              }else if(moment(e1.update_time) < moment(e2.update_time)){
                auxTrabajosAprob = auxTrabajosAprob.filter((value: any) => value.id != e1.id);
              }else if(moment(e1.update_time) > moment(e2.update_time)){
                auxTrabajosAprob = auxTrabajosAprob.filter((value: any) => value.id != e2.id);
              }
            }
          }
        }
        auxTrabajosAprob = auxTrabajosAprob.filter((value: any) => { return value.aprobatoria == true})
        this.trabajosAprobados = auxTrabajosAprob;
        this.loadTrabajos();
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar las preeevaluaciones del evento especificado'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los trabajos del evento especificado'});
      console.error(err)
    });
  }

  loadTrabajos() {
    let suscripcionTrabajos = this.cargaTrabajosSuscripcion(this.eventoId)
    this.loadingCount++
    suscripcionTrabajos.subscribe((res: any) => {
      this.loadingCount--
      let items:any = [] ;
      if(this.trabajosAprobados.length!=0){
        let auxprev = this.trabajosAprobados;
        for (let item of res) {
          auxprev = this.trabajosAprobados.filter((value: any) => { return value.id_trabajo == item.id})
          if(auxprev.length!=0){
            item.aprobado = auxprev[0].aprobatoria;
          }
        }
        let auxPrev = res;
        for(let item of res){
          if(!item.aprobado){
            auxPrev = auxPrev.filter((value: any) => value.id != item.id);
          }
        }
        items = auxPrev;
      }else{
        items = [];
      }
      for (let item of items) {
        item.autores = []
        item.metadatos = []
      }
      this.items = items
      this.itemsToShow = this.items
      this.listaTrabajos = res;
      this.loadPagination()
      this.pageNumber = 1;
      const idsPaticipaciones = this.itemsToShow.map((value: any) => value.id_participacion)
      let suscripcionParticipaciones = this.cargarParticipacionesSuscripcion(this.eventoId,idsPaticipaciones)
      this.loadingCount++
      suscripcionParticipaciones.subscribe((res) => {
        this.loadingCount--
        this.eventoParticipaciones = res;
        //se asignan participaciones a trabajos
        for (let item of this.items) {
          for(let part of this.eventoParticipaciones) {
            if (item.id_participacion == part.id) {
              item.participacion = part;
              break;
            }
          }
        }
        //TERMINA se asignan participaciones a trabajos
        const idsPaticipaciones = this.eventoParticipaciones.map((value: any) => value.id_usuario)
        let suscripcionUsuarios = this.cargaUsuariosScicomSuscripcion(this.eventoId,idsPaticipaciones)
        this.loadingCount++
        suscripcionUsuarios.subscribe((res) => {
          this.loadingCount--
          this.eventoUsuarios = res;
          //se asignan usuarios a participaciones
          for (let item of this.items) {
            for(let usu of this.eventoUsuarios) {
              if (item.participacion.id_usuario == usu.id) {
                item.participacion.usuario = usu
                break
              }
            }
          }
          //TERMINA se asignan usuarios a participaciones
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al cargar los usuarios SCICOM del evento y participación especificados'});
          console.error(err)
        });

        const idsTiposPaticipaciones = this.eventoParticipaciones.map((value: any) => value.id_tipo_participacion)
        let suscripcionTiposParticipaciones = this.cargarTiposParticipacionesSuscripcion(idsTiposPaticipaciones)
        this.loadingCount++
        suscripcionTiposParticipaciones.subscribe((res) => {
          this.loadingCount--
          this.tiposParticipaciones = res;
          this.listaTiposParticipaciones = res;
          //se asignan tipos de participación a participaciones
          for (let item of this.items) {
            for(let tipPart of this.tiposParticipaciones) {
              if (item.participacion.id_tipo_participacion == tipPart.id) {
                item.participacion.tipPart = tipPart
                break
              }
            }
          }
          //TERMINA se asignan tipos de participación a participaciones
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al cargar los tipos de participación del evento y trabajo especificados'});
          console.error(err)
        });


      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar las participaciones del evento y trabajos especificados'});
        console.error(err)
      });

      const idsTrabajos = this.itemsToShow.map((value: any) => value.id)
      let suscripcionFuentes = this.cargarFuentesSuscripcion(idsTrabajos)
      this.loadingCount++
      suscripcionFuentes.subscribe((res:any) => {
        this.loadingCount--
        const data:any = res;
        this.eventoFuentes = data;
        //console.warn('fuentesBase: ', this.eventoFuentes)

        //se asignan fuentes a trabajos
        for (let item of this.items) {
          for(let fuent of this.eventoFuentes) {
            if (item.id_fuente == fuent.id) {
              item.fuente = fuent
              break
            }
          }
        }
        //TERMINA se asignan fuentes a trabajos
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar las fuentes de los trabajos especificados'});
        console.error(err)
      });

      const idsTiposTranajos = this.itemsToShow.map((value: any) => value.id_tipo_trabajo)
      let suscripcionTiposTrabajo = this.cargarTiposTrabajosSuscripcion(idsTiposTranajos)
      this.loadingCount++
      suscripcionTiposTrabajo.subscribe((res) => {
        this.loadingCount--
        this.tiposTrabajo = res;
        this.listaTiposTrabajo = res;
        //se asignan tipos de trabajo a trabajos
        for (let item of this.items) {
          for(let tipTrab of this.tiposTrabajo) {
            if (item.id_tipo_trabajo == tipTrab.id) {
              item.tipTrab = tipTrab
              break
            }
          }
        }
        //TERMINA se asignan tipos de trabajo a trabajos
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo de los trabajos especificados'});
        console.error(err)
      });

      let suscripcionConjuntoMetadatos = this.cargarConjuntosDeMetadatosTrabajoSuscripcion(this.eventoId,
        undefined,undefined,idsTrabajos);
      this.loadingCount++
      suscripcionConjuntoMetadatos.subscribe((res:any) => {
        this.loadingCount--
        this.trabajosMetadatos = res;
        let auxMetadatos:any = [];
        for(let tm of this.trabajosMetadatos){
          if(tm.id_idioma == 150){
            if(tm.titulo!=null){
              auxMetadatos = auxMetadatos.filter((value: any) => value.id_trabajo != tm.id_trabajo);
              auxMetadatos.push(tm)
            }
          }else if(tm.id_idioma == 41){
            if(tm.titulo!=null){ auxMetadatos.push(tm) }
          }
        }
        this.trabajosTitulos = auxMetadatos;
        //se asignan metadatos y titulos a trabajos
        for (let item of this.items) {
          item.metadatos = this.trabajosMetadatos.filter((value: any) => {return value.id_trabajo == item.id})
          item.trabTit = this.trabajosTitulos.filter((value: any) => {return value.id_trabajo == item.id})
        }
        // TERMINA se asignan metadatos y titulos a
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los metadatos de los trabajos especificados'});
        console.error(err)
      });

      let arrayTiposEvaluaciones = [2];
      let evaluacionesSuscripcion = this.cargarEvaluacionesSuscripcion(this.eventoId,arrayTiposEvaluaciones,idsTrabajos);
      this.loadingCount++
      evaluacionesSuscripcion.subscribe((res:any) => {
        this.loadingCount--
        this.evaluacionesTrabajos = res;
        let auxTrabajos = this.newObjectReference(this.trabajos);
        for(let t of this.trabajos){
          for(let et of this.evaluacionesTrabajos){
            if(t.id==et.id_trabajo){
              auxTrabajos = auxTrabajos.filter((value: any) => value.id != et.id_trabajo);
            }
          }
        }

        let auxEvaluaciones = this.newObjectReference(this.evaluacionesTrabajos);
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
        for(let t of this.items){
          for(let et of this.evaluacionesTrabajos){
            if(t.id == et.id_trabajo){
              if(et.id_tipo_evaluacion == 1){
                if(et.aprobatoria){
                  t.dictamen='Preaprobado';
                }else{
                  t.dictamen='No preaprobado';
                }
              }else if(et.id_tipo_evaluacion == 2){
                if(et.aprobatoria){
                  t.dictamen='Aprobado';
                }else{
                  t.dictamen='No aprobado';
                }
              }else {
                t.dictamen='Sin evaluar';
              }
            }
          }
        }
        this.trabajosSinEvaluar = auxTrabajos;
        this.evaluacionesTrabajos = auxEvaluaciones;
        for (let item of this.items) {
          item.evaluaciones = this.evaluacionesTrabajos.filter((value: any) => { return value.id_trabajo == item.id})
        }

        this.loadUsuariosEvaluacion(this.evaluacionesTrabajos);

      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar las evaluaciones de los trabajos especificados'});
        console.error(err)
      });

      this.loadingCount++
      const AutoresDeTrabajoSuscripcion = this.cargaAutoresDeTrabajoSuscripcion(this.eventoId,idsTrabajos);
      AutoresDeTrabajoSuscripcion.subscribe((res:any) => {
        this.loadingCount--
        this.autoresEvento = res;
        for (let item of this.items) {
          item.autores = this.autoresEvento.filter((value: any) => { return value.id_trabajo == item.id })
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los autores de los trabajos especificados'});
        console.error(err)
      });

      this.loadingCount++
      const pagosSuscripcion = this.cargarPagosSuscripcion(this.eventoId,idsTrabajos);
      pagosSuscripcion.subscribe((res:any) => {
        this.loadingCount--
        for (let item of this.items) {
          item.pagos = res.filter((value: any) => { return value.id_trabajo == item.id })
        }

        let arrayTiposArchivo = [5];
        let pagosArchivosSuscripcion = this.cargaArchivosEvaluacionSuscripcion(this.eventoId,arrayTiposArchivo);
        this.loadingCount++
        pagosArchivosSuscripcion.subscribe((res:any) => {
          this.loadingCount--
          for (let item of this.items) {
            if(item.pagos[0]){
              if(item.pagos[0].id){
                let auxArchivosEvaluacion = this.newObjectReference(res);
                item.archivosPagos = auxArchivosEvaluacion.filter((value: any) => { return value.id_pago == item.pagos[0].id })
              }
            }
          }
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al cargar los archivos de pagos de los trabajos especificados'});
          console.error(err)
        });

      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los autores de los trabajos especificados'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los trabajos del evento especificado'});
      console.error(err)
    });
  }

  loadUsuariosEvaluacion(evaluaciones:any){
    let auxevaltrab:any = evaluaciones;
    auxevaltrab = auxevaltrab.filter((value: any) => value.id_usuario != null)
    const idsUsuarios = auxevaltrab.map((value: any) => value.id_usuario)
    if(idsUsuarios.length != 0){
      let suscripcionUsuariosEvaluacion = this.cargaUsuariosScicomSuscripcion(this.eventoId,idsUsuarios)
      this.loadingCount++
      suscripcionUsuariosEvaluacion.subscribe((res) => {
        this.loadingCount--
        this.usuariosEvaluadores = res;
        let auxusuario = this.newObjectReference(res)
        for (let item of this.items) {
          for(let ev of item.evaluaciones){
            ev.userEval = auxusuario.filter((value: any) => value.id == ev.id_usuario)
          }
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los usuarios SCICOM de la participación especificada'});
        console.error(err)
      });
    }
  }

  loadEvento = () => {
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.eventoNombre = res[0].nombre;
      this.eventoTipo = res[0].id_tipo_evento;
      for(let pagos of res){
        for(let pay of pagos.tipos_de_pago){
          this.eventoPagoMonto = pay.pivot.monto;
        }
      }
      this.loadCampus();
      this.loadTipoEvento();
      this.loadRangoEvento();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento especificado'});
      console.error(err)
    });
  }

  loadCampus(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getCampusSimplesAsign(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.campusEvento = res
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los campus asociados al evento especificado'});
        console.error(err)
      });
    }
  }

  loadTipoEvento(){
    this.loadingCount++
    this.eventService.getTypeEventById(this.eventoTipo).subscribe((res: any) => {
      this.loadingCount--
      this.eventoTipoNombre = res[0].nombre;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento especificado'});
      console.error(err)
    });
  }

  loadFormasPagos(){
    this.loadingCount++
    this.pagosService.getMethodsPayments(1).subscribe((res: any) => {
      this.loadingCount--
      this.formasPagos = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento especificado'});
      console.error(err)
    });
  }

  loadRangoEvento(){
    this.loadingCount++
    const idsRangos:any = '5 6';
    this.eventService.getRangeEventByEvents(this.eventoId,idsRangos).subscribe((res: any) => {
      this.loadingCount--
      const nowDate:any = moment(new Date()).format('YYYY-MM-DD');
      for(let rango of res){
        if(rango.id_tipo_rango == 5){
          this.fechaInicioEjecucion = moment(rango.tiempo_inicio).format('YYYY-MM-DD');
          this.fechaFinalEjecucion = moment(rango.tiempo_final).format('YYYY-MM-DD');
          if(this.fechaInicioEjecucion<=nowDate && this.fechaFinalEjecucion>=nowDate){
            this.periodoEjecucion = true;
          }else{
            this.periodoEjecucion = false;
          }
        }
        if(rango.id_tipo_rango == 6){
          this.fechaInicioValidacion = moment(rango.tiempo_inicio).format('YYYY-MM-DD');
          this.fechaFinalValidacion = moment(rango.tiempo_final).format('YYYY-MM-DD');
          const nowDate:any = moment(new Date()).format('YYYY-MM-DD');
          if(this.fechaInicioValidacion<=nowDate && this.fechaFinalValidacion>=nowDate){
            this.periodoValidacion = true;
          }else{
            this.periodoValidacion = false;
          }
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las fechas de evaluación del evento especificado'});
      console.error(err)
    });
  }

  loadTipoPago(){
    this.loadingCount++
    this.eventService.getPaymentsList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.tipoPagoNombre = res[0].nombre;
      this.tipoPagoDescripcion = res[0].descripcion;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar el tipo de evaluación especificado'});
      console.error(err)
    });
  }

  loadAreasDeConocimiento(){
    this.loadingCount++
    this.eventService.getArea().subscribe((res: any) => {
      this.loadingCount--
      this.eventoAreasConocimiento = res;
      this.listaAreasConocimiento = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las áreas de conocimiento'});
      console.error(err)
    });
  }

  loadPagination = (pageValue?:any) => {
    this.totalItems = this.itemsToShow.length;
    this.pageNumbers = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbersArray = [];
    for(var i=1 ; i<=this.pageNumbers ; i++){
      this.pageNumbersArray.push({"id":i});
    }
    if(pageValue){
      if(pageValue=='prev'){
        this.pageNumber = this.pageNumber-1;
      }else if(pageValue=='next'){
        this.pageNumber = this.pageNumber+1;
      }else{
        this.pageNumber = pageValue;
      }
    }
    this.pageEnd = this.pageNumber * this.pageSize;
    this.pageStart = this.pageEnd - (this.pageSize - 1);
    if(this.pageNumber==this.pageNumbers){
      this.pageEnd = this.totalItems;
    }
    if(this.pageNumber==0 || this.pageNumber==1 || this.pageNumber==2){this.limitStartPage=0}
    if(this.pageNumber>2){this.limitStartPage=this.pageNumber-3}
    if(this.pageNumbersArray.length == this.pageNumber){this.limitEndPage=this.pageNumber}
    if(this.pageNumbersArray.length >= this.pageNumber){this.limitEndPage=this.pageNumber+1}
    let auxPaginas = this.pageNumbersArray
    let auxPaginasShow = []
    var i = 0
    for(let page of this.pageNumbersArray){
      if(i >= this.limitStartPage && i <= this.limitEndPage){
        //console.log("i",i);
        auxPaginasShow.push(page)
      }
      i++
    }
    this.pageNumbersArray = auxPaginasShow
    var pageNumberSelected=this.pageNumber
    var totalPages = auxPaginas.length
    this.labelTotalItems = "Muestra eventos del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
    this.labelTotalPagination = "Página: "+pageNumberSelected+" de "+totalPages; }

  cleanFilters(){
    this.search = '';
    this.selectedAreaConocimiento = 0;
    this.selectedTipoParticipacion= 0;
    this.selectedTipoTrabajo = 0;
    this.selectedPago = 0;
    this.loadTrabajosAprobados()
  }

  newObjectReference(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

  filtrarTrabajos() {
    this.itemsToShow = this.newObjectReference(this.items)
    if(this.search != '') this.filtraPorSearchTerm(this.search) //hay filtro de búsqueda
    if(this.selectedPago != 0) this.filtraPorPago(this.selectedPago)
    //hay filtro por área del conocimiento
    if(this.selectedAreaConocimiento != 0) this.filtrarPorAreaConocimiento(this.selectedAreaConocimiento)
    //hay filtro por tipo de participación
    if(this.selectedTipoParticipacion != 0) this.filtrarPorTipoParticipacion(this.selectedTipoParticipacion)
    //hay filtro por tipo de trabajo
    if(this.selectedTipoTrabajo != 0) this.filtrarPorTipoTrabajo(this.selectedTipoTrabajo)
    if(this.selectedCampus != 0) this.filtrarPorCampus(this.selectedCampus)
    this.loadPagination()
    this.pageNumber = 1;
  }

  filtraPorSearchTerm(search: string) {
    const auxTrab = this.itemsToShow.filter((value: any) => {
      const metadatos = value.metadatos
      const aux = metadatos.filter((value: any) => {
        if (!value.titulo || !value.resumen)
          return false
        return (value.titulo.toLowerCase().includes(search.toLowerCase())
          || value.resumen.toLowerCase().includes(search.toLowerCase()))
      })
      return aux.length > 0
    })
    this.itemsToShow =this.newObjectReference(auxTrab)
  }

  filtraPorPago(dictamenId: any) {
    const auxTrab = this.itemsToShow.filter((value: any) => {
      if (dictamenId == '1') return (value.pagos.length == 0)
      const aux = value.pagos.filter((value: any) => {
        switch(dictamenId) {
          case '2': return value.id
        }
      })
      return aux.length > 0
    })
    this.itemsToShow =this.newObjectReference(auxTrab)
  }

  filtrarPorAreaConocimiento(areaId: any) {
    const auxTrab = this.itemsToShow.filter((value: any) => {
      const areas = value.areas_de_conocimiento
      const aux = areas.filter((value: any) => { return value.id == areaId })
      return aux.length > 0
    })
    this.itemsToShow =this.newObjectReference(auxTrab)
  }

  filtrarPorTipoParticipacion(tipoId: any) {
    const auxTrab = this.itemsToShow.filter((value: any) => { return value.participacion.tipPart.id == tipoId })
    this.itemsToShow =this.newObjectReference(auxTrab)
  }

  filtrarPorTipoTrabajo(tipoId: any) {
    const auxTrab = this.itemsToShow.filter((value: any) => { return value.tipTrab.id == tipoId })
    this.itemsToShow =this.newObjectReference(auxTrab)
  }

  filtrarPorCampus(campusId: any) {
    let auxTrab:any = [];
    for(let its of this.itemsToShow){
      var campusActivo:boolean = false;
      for(let c of its.participacion.usuario.campus) {
        if (c.id == campusId){
          campusActivo=true
        }
      }
      if(campusActivo){
        auxTrab.push(its)
      }
      console.info("auxTrab",auxTrab)
    }
    this.itemsToShow=this.newObjectReference(auxTrab)
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
      Swal.fire({icon: 'error',text: 'Error al descargar el archivo especificado'});
      console.error(err)
    });
  }

  agregarArchivo(){
    const timestamp = Date.now();
    this.archivosPagos.push({nombre:this.nombreArchivo,descripcion:this.descripcionArchivo,file:this.archivoTrabajo,clave:timestamp})
  }

  pendienteModal(id_trabajo:any){
    this.archivosPagos = [];
    this.idTrabajoGuardar = id_trabajo;
    this.modalDisabled = false;
    this.selectedFormaPago = 0;
  }

  pagadoModal(id_trabajo:any){
    this.archivosPagos = [];
    this.modalDisabled = true;
    this.evaluacionTrue = false;
    this.evaluacionFalse = false;
    for(let itemsts of this.itemsToShow){
      if(itemsts.id == id_trabajo){
        this.montoPago = itemsts.pagos[0].monto;
        this.selectedFormaPago = itemsts.pagos[0].id_forma_pago;
        this.archivosPagos = itemsts.archivosPagos;
      }
    }
  }

  savePago(){
    this.loadingCount++
    this.pagosService.addPagoToWork(this.eventoPagoMonto,1,this.selectedFormaPago,2,this.eventoId,this.idTrabajoGuardar).subscribe((res: any) => {
      this.loadingCount--

      this.loadingCount++
      this.notificacionesScicomService.sendNotificationAddPagoSalTrabEvento(this.eventoId,res).subscribe((res:any) => {
        this.loadingCount--
        console.info("NotificationAddPagoSalTrabEvento")
      }, (err:any) =>{
        this.loadingCount--
        console.error(err)
      });

      for(let archivo of this.archivosPagos){
        this.saveFileToPayments(archivo.nombre,archivo.descripcion,res,archivo.file)
        this.loadTrabajosAprobados();
      }
      //console.log("Pago Guardado");
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error guardar el pago al trabajo especificado'});
      console.error(err)
    });
  }

  newFileModal(){
    this.tipoArchivoSelected = 6;
    this.nombreArchivo = '';
    this.descripcionArchivo = '';
    this.archivoTrabajo = null;
    this.archivoVacio = '';
  }

  saveFileToPayments(nombre:string,descripcion:string,pagoId:number,file:any) {
    this.loadingCount++
    this.eventService.addFilePago(nombre, descripcion, this.eventoId, 5, pagoId, file).subscribe((res: any) => {
      this.loadingCount--
      //console.log("se agrego el archivo a la evaluación");
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'Error al agregar archivo a la evaluación especificada'});
      this.errorOnSaveFlag = true;
      console.error(err)
    });
  }

  removeArchivoByClave(clave:any){
    this.archivosPagos = this.archivosPagos.filter( (af:any) => af.clave != clave)
  }

  viewFileNew(file: string){
    let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file))
    let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
    // @ts-ignore
    window.open(fileUrl.toString(), '_blank');
  }

  extractFileFromEvent(event: any) {
    this.archivoTrabajo = event.target.files[0]
  }

  validarPeriodoEvaluacion(){
    //console.log("no evaluao")
    Swal.fire({icon: 'error', text: 'No se puede realizar la evaluación porque estás fuera del periodo evaluativo'});
  }

  getTitulo(datosTrabajo:any){
    var tituloTabajo = '';
    if(datosTrabajo.metadatos.length == 0){
      tituloTabajo = 'No hay titulo registrado'
    }else if(datosTrabajo.metadatos.length == 1){
      for(let dt of datosTrabajo.metadatos){
        if(dt.id_idioma==150){
          tituloTabajo = dt.titulo
        }
        if(dt.id_idioma==41 && tituloTabajo==''){
          tituloTabajo = dt.titulo
        }
      }
    }else if(datosTrabajo.metadatos.length <= 2){
      for(let dt of datosTrabajo.metadatos){
        if(dt.titulo!=null && dt.titulo!=''){
          if(dt.id_idioma==150){
            tituloTabajo = dt.titulo
          }
          if(dt.id_idioma==41 && tituloTabajo==''){
            tituloTabajo = dt.titulo
          }
        }
      }
    }
    return tituloTabajo
  }

}

