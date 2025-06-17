import {Component, OnInit, SecurityContext} from '@angular/core';
import {EventService} from "../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import * as moment from "moment/moment";
import {TrabajoScicomService} from "../../../../services/scicom/trabajo-scicom.service";
import {EvaluacionScicomService} from "../../../../services/scicom/evaluacion-scicom.service";
import {ParticipacionScicomService} from "../../../../services/scicom/participacion-scicom.service";
import {FuentesScicomService} from "../../../../services/scicom/fuentes-scicom.service";
import {ArchivoScicomService} from "../../../../services/scicom/archivo-scicom.service";
import {PagosScicomService} from "../../../../services/scicom/pagos-scicom.service";

@Component({
  selector: 'app-work-pay-detail',
  templateUrl: './work-pay-detail.component.html',
  styleUrls: ['./work-pay-detail.component.css']
})
export class WorkPayDetailComponent implements OnInit {

  trabajoId?:number = Number(this.route.snapshot.paramMap.get('trabajoId'));
  eventoId?:number = Number(this.route.snapshot.paramMap.get('eventoId'));
  idTipoEvaluacion?:number = 2;

  eventoNombre:string = '';
  eventoTipo:number = 0;
  eventoTipoNombre:string = ''

  instituciones:any=[];
  eventoInstitucionNombre:string="";

  periodoEvaluacion:boolean = true;

  tipoEvaluacionNombre:string = '';
  tipoEvaluacionDescripcion:string = '';

  archivos:any[]=[];

  fechaInicioEvento:string;
  fechaFinalEvento:string;

  trabajos:any = [];
  listaTrabajos:any = [];
  trabajosMetadatos:any = [];
  trabajosTitulos:any = [];

  eventoParticipaciones:any = [];
  eventoFuentes:any = [];
  eventoUsuarios:any = [];

  tiposParticipaciones:any = [];
  tiposTrabajo:any = [];

  listaTiposParticipaciones:any = [];
  listaTiposTrabajo:any = [];

  autoresEvento:any = [];
  evaluacionesTrabajos:any = [];
  trabajosSinEvaluar:any = [];

  participationEstatus:any[]=[];

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageStart:number = 0;
  pageEnd:number = 0;
  pageSize:number = 3;
  totalItems:number = 0;
  labelPagination:string = '';

  search:string = '';

  items: Array<any> = []; //items a tener en memoria
  itemsToShow: Array<any> = []; //items a mostrar

  archivosEvaluacion:any[] = [];

  eventoAreasConocimiento:any = [];
  listaAreasConocimiento:any = [];

  autoresAfiliaciones:any = [];

  campusTotalList:any[] = [];
  campus:any[] = [];

  loadingCount: number = 0; //cuenta el número de elementos cargando

  usuariosEvaluadores: any = [];

  tipoPagoNombre:string = '';
  tipoPagoDescripcion:string = '';

  formasPagos:any[]=[];

  fechaInicioEjecucion:string = '';
  fechaFinalEjecucion:string = '';
  fechaInicioValidacion:string = '';
  fechaFinalValidacion:string = '';

  eventoPagoMonto:number = 0;

  eventoPago:any = [];

  nowDate:any = null;

  constructor(private trabajosScicomService: TrabajoScicomService,
              private evaluacionesService: EvaluacionScicomService,
              private participacionesService: ParticipacionScicomService,
              private fuentesService: FuentesScicomService,
              private pagosService: PagosScicomService,
              private eventService: EventService,
              private archivoService: ArchivoScicomService,
              private route: ActivatedRoute)
  {
    moment().locale('es-mx')
    const auxNowDate = moment(new Date()).format('LLLL')
    this.nowDate = auxNowDate
  }

  ngOnInit(): void {
    this.loadEvento();
    this.loadTrabajos();
    this.loadAreasDeConocimiento();
    this.loadParticipationEstatus();
    this.loadFormasPagos();
    this.loadRangoEvento();
    this.loadTipoPago();
    this.loadPagos();
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
      this.loadTipoEvento();
      this.loadRangoEvaluacionEvento();
      this.loadRangoEvento();
      this.loadInstitucionEvento(res[0].rors_editoras);
      this.loadTipoEvaluacion();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  loadTipoEvento(){
    this.loadingCount++
    this.eventService.getTypeEventById(this.eventoTipo).subscribe((res: any) => {
      this.loadingCount--
      this.eventoTipoNombre = res[0].nombre;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  loadRangoEvaluacionEvento(){
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId,3).subscribe((res: any) => {
      this.loadingCount--
      let rango = res.filter((value: any) => { return value.id_tipo_evaluacion == this.idTipoEvaluacion }).pop();
      this.fechaInicioEvento = rango.tiempo_inicio;
      this.fechaFinalEvento = rango.tiempo_final;
      const dateStart:any = moment(this.fechaInicioEvento).format('YYYY-MM-DD');
      const dateEnd:any = moment(this.fechaFinalEvento).format('YYYY-MM-DD');
      const nowDate:any = moment(new Date()).format('YYYY-MM-DD');
      if(dateStart<=nowDate && dateEnd>=nowDate){
        this.periodoEvaluacion = true;
      }else{
        this.periodoEvaluacion = false;
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas de duración de la evaluacion y del evento especificado'});
      console.error(err)
    });
  }

  loadInstitucionEvento(rorsEvento:any){
    const idRorInstitucionCreadoraEvento = rorsEvento.filter((value: any) => value.pivot.creador == true)
      .map((value: any) => value.id).pop()
    if (idRorInstitucionCreadoraEvento) {
      this.loadingCount++
      this.eventService.getInstitucionList([idRorInstitucionCreadoraEvento]).subscribe((res: any) => {
        this.loadingCount--
        this.eventoInstitucionNombre = res[0].razon_social
        this.loadingCount++
        this.eventService.getCampusList(res[0].id).subscribe((res: any) => {
          this.loadingCount--
          this.campusTotalList = res;
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se cargaron los campus de la institución especificada'});
          console.error(err)
        });

      }, (err) => {
        this.loadingCount--
        console.error(err)
        Swal.fire({icon: 'error',text: 'Error al cargar los datos de la institución creadora del evento'});
      })
    }
  }

  loadTipoEvaluacion(){
    this.loadingCount++
    this.eventService.getTypeEvaluationById(this.idTipoEvaluacion).subscribe((res: any) => {
      this.loadingCount--
      this.tipoEvaluacionNombre = res[0].nombre;
      this.tipoEvaluacionDescripcion = res[0].descripcion;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los datos del tipo de evaluacion especificado'});
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
      Swal.fire({icon: 'error',text: 'No se cargaron las areas de conocimiento'});
      console.error(err)
    });
  }

  loadParticipationEstatus(){
    this.loadingCount++
    this.eventService.getParticipationEstatus().subscribe((res: any) => {
      this.loadingCount--
      this.participationEstatus = res;
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las participaciones del evento especificado'});
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
      for(let rango of res){
        if(rango.id_tipo_rango == 5){
          this.fechaInicioEjecucion = moment(rango.tiempo_inicio).format('YYYY-MM-DD');
          this.fechaFinalEjecucion = moment(rango.tiempo_final).format('YYYY-MM-DD');
        }
        if(rango.id_tipo_rango == 6){
          this.fechaInicioValidacion = moment(rango.tiempo_inicio).format('YYYY-MM-DD');
          this.fechaFinalValidacion = moment(rango.tiempo_final).format('YYYY-MM-DD');
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

  loadPagos(){
    let idsTrabajos = [this.trabajoId];
    this.loadingCount++
    const pagosSuscripcion = this.cargarPagosSuscripcion(this.eventoId,idsTrabajos);
    pagosSuscripcion.subscribe((res:any) => {
      this.loadingCount--
      this.eventoPago = res;
      console.warn("this.eventoPago",this.eventoPago);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los autores de los trabajos especificados'});
      console.error(err)
    });
  }

  cargarPagosSuscripcion(idEvento: number,idsTrabajos: Array<number>) {
    return this.pagosService.getPayments(idEvento,idsTrabajos)
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
    return this.fuentesService.getFuentesDeTrabajo(idsTrabajos)
  }

  cargarTiposTrabajosSuscripcion(idsTiposTrabajos: Array<number>) {
    return this.trabajosScicomService.getTiposDeTrabajo(idsTiposTrabajos)
  }

  /**
   * Devuelve una suscripción para cargar metadatos de archivos scicom (filtro por trabajos, filtro por evaluación)
   */
  cargaArchivosEvaluacionSuscripcion(idEvento: number, idsTipsArch: Array<number> = undefined)
  {
    return this.archivoService.getArchivosEvaluacionesScicom(idEvento, idsTipsArch)
  }

  loadTrabajos() {
    let idTrabajo = [this.trabajoId];
    let suscripcionTrabajos = this.cargaTrabajosSuscripcion(this.eventoId,idTrabajo)
    this.loadingCount++
    suscripcionTrabajos.subscribe((res: any) => {
      this.loadingCount--
      this.trabajos = res;
      let items = this.newObjectReference(res)
      for (let item of items) {
        item.autores = []
        item.metadatos = []
      }
      this.items = items
      this.itemsToShow = this.items
      this.listaTrabajos = res;
      const idsPaticipaciones = this.trabajos.map((value: any) => value.id_participacion)
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
          Swal.fire({icon: 'error',text: 'No se cargaron las usuarios scicom de el evento y la participación especificada'});
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
          Swal.fire({icon: 'error',text: 'No se cargaron los tipos participaciones del evento y trabajos especificados'});
          console.error(err)
        });

      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las participaciones del evento y trabajos especificados\''});
        console.error(err)
      });

      const idsTrabajos = [this.trabajoId];;
      let suscripcionFuentes = this.cargarFuentesSuscripcion(idsTrabajos)
      this.loadingCount++
      suscripcionFuentes.subscribe((res:any) => {
        this.loadingCount--
        const data:any = res;
        this.eventoFuentes = data;
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
        Swal.fire({icon: 'error',text: 'No se cargaron las fuentes del los trabajos especificados'});
        console.error(err)
      });

      const idsTiposTrabajos = this.trabajos.map((value: any) => value.id_tipo_trabajo)
      let suscripcionTiposTrabajo = this.cargarTiposTrabajosSuscripcion(idsTiposTrabajos)
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
        Swal.fire({icon: 'error',text: 'No se cargaron los tipos de trabajos de los trabajos especificados'});
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
        Swal.fire({icon: 'error',text: 'No se cargaron los metadatos del evento y trabajos especificados'});
        console.error(err)
      });

      let arrayTiposEvaluaciones = [this.idTipoEvaluacion];
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
        /*this.evaluacionesTrabajos.sort((a: any, b: any) => {
          //todo si a es depues que b retorna un posi
        })*/
        for(let e1 of this.evaluacionesTrabajos){
          for(let e2 of this.evaluacionesTrabajos){
            if(e1.id_trabajo == e2.id_trabajo){
              if(moment(e1.update_time) == moment(e2.update_time)){
              }else if(moment(e1.update_time) < moment(e2.update_time)){
                auxEvaluaciones = auxEvaluaciones.filter((value: any) => value.id != e1.id);
              }else if(moment(e1.update_time) > moment(e2.update_time)){
                auxEvaluaciones = auxEvaluaciones.filter((value: any) => value.id != e2.id);
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
        Swal.fire({icon: 'error',text: 'No se cargaron las evaluaciones del evento, tipo y trabajos especificados'});
        console.error(err)
      });


      const AutoresDeTrabajoSuscripcion = this.cargaAutoresDeTrabajoSuscripcion(this.eventoId,idsTrabajos);
      this.loadingCount++
      AutoresDeTrabajoSuscripcion.subscribe((res:any) => {
        this.loadingCount--
        this.autoresEvento = res;
        this.orderBy(this.autoresEvento,'id','asc');
        let datosAfiliacion: any = []
        for(let aut of this.autoresEvento){
          if(aut.rors.length!=0){
            this.loadingCount++
            this.eventService.getRorById(aut.rors[0].id).subscribe((res: any) => {
              this.loadingCount--
              if (res.length != 0) {
                datosAfiliacion.push(res);
              }
            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error', text: 'No se cargaron los datos de la institución de afiliación especificada'});
              console.error(err)
            });
          }
        }
        this.autoresAfiliaciones = datosAfiliacion;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los autores del evento y trabajos especificados'});
        console.error(err)
      });

    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron trabajos del evento especificado'});
      console.error(err)
    });
  }

  newObjectReference(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

  printFichaEval() {
    /*let aixHtml = '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '  <head>\n' +
      '    <meta charset="UTF-8">\n' +
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '    <meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
      '    <title> ( título ) </title>\n' +
      '  </head>\n' +
      '  <body>\n' +
      '    <p>alejandro misael</p> \n' +
      '  </body>\n' +
      '</html>'
    let auxWindow = window.open('')
    auxWindow.document.write(document.getElementById('fichaEval').innerHTML)
    auxWindow.print()
    auxWindow.close()*/
//    new Document().s
    //console.warn(document.getElementById('fichaEval').innerHTML)

    /*let htmlDocument = document.implementation.createHTMLDocument('Ficha de evaluación')
    htmlDocument.body.parentElement.innerHTML = document.getElementById('fichaEval').innerHTML
    //htmlDocument.innerHTML = document.getElementById('fichaEval').innerHTML
    /*htmlDocument.open('text/html', 'replace')
    htmlDocument.write(document.getElementById('fichaEval').innerHTML)
    htmlDocument.close()*/
    // @ts-ignore
    //htmlDocument.ownerDocument.print()
    //document.getElementById('fichaEval').ownerDocument.defaultView.print()
    window.print()
  }

  loadUsuariosEvaluacion(evaluaciones:any){
    //inicia valida que los ids de usuarios en las evaluaciones no reciban id igual a null
    //todo si el id_usuario es nulo en una evaluación, el usuario que la creo tiene el rol de admin o cord
    let auxevaltrab:any = evaluaciones;
    auxevaltrab = auxevaltrab.filter((value: any) => value.id_usuario != null)
    //Fin valida que los ids de usuarios en las evaluaciones no reciban id igual a null
    const idsUsuarios = auxevaltrab.map((value: any) => value.id_usuario)
    console.warn("idsususarios",idsUsuarios)
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
        console.warn("this.usuariosEvaluadores",this.usuariosEvaluadores)
        console.warn("this.itemsToShow",this.itemsToShow)
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las usuarios scicom de el evento y la participación especificada'});
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
}

