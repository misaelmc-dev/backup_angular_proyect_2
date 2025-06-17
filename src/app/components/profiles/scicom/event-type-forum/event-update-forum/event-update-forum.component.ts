import {Component, OnInit} from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {EventService} from "../../../../../services/event.service";
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-update-forum',
  templateUrl: './event-update-forum.component.html',
  styleUrls: ['./event-update-forum.component.css']
})
export class EventUpdateForumComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?:number = Number(this.route.snapshot.paramMap.get('idevent'));

  tipoRangoTiempo:string='rangEvent';
  idtipoRangoTiempo:number=0;
  idTipoEvento:number=3;

  nombre:string="";
  validacionNombre:number=0;
  tiposEvento:any=[];
  tipo:any=3;
  descripcion:string="";
  validacionDescripcion:number=0;
  lema:string="";
  validacionLema:number=0;
  objetivo:string="";
  validacionObjetivo:number=0;
  estatusEventos:any=[];
  estatus:number=1;
  fechaInicio:any="";
  showFechaInicio:any="";
  validacionFechaInicio = 0;
  fechaFinal:any="";
  showFechaFinal:any="";
  validacionFechaFinal = 0;
  campus:any=[];
  campusSelected:number=0;
  eventoCampusId:number=0;
  validacionCampus:number=0;
  nivelDesarrollo:string="";
  validacionNivel:number=0;

  institucion:number=this.cordId;
  instituciones:any=[];

  seccion:any = 1;

  loadingCount: number = 0; //cuenta el número de elementos cargando

  constructor(private eventService: EventService,
              private domSanitizer: DomSanitizer,
              private notificacionesScicomService: NotificacionesScicomService,
              private route: ActivatedRoute,
              private router: Router,
              public permisosScicomService: PermisosScicomService) { }

  ngOnInit(): void {
    this.loadStatusEvent()
    this.loadSecccion();
    this.loadEventos();
    this.loadTiposDeEvento()
  }

  loadRangosTiempo(){
    this.loadingCount++
    this.eventService.consultaRangoTiempo(this.tipoRangoTiempo).subscribe((resRT: any) => {
      this.loadingCount--
      this.idtipoRangoTiempo=resRT[0].id
      this.loadRangeEvent()
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento'});
      console.error(err)
    });
  }

  loadStatusEvent(){
    this.loadingCount++
    console.log("this.tipo",this.tipo)
    this.eventService.getStatusEventByTipoEvent(this.tipo).subscribe((res: any) => {
      this.loadingCount--
      this.estatusEventos = res;
      console.warn("res",res)
      this.estatusEventos.sort((n1:any,n2:any) => {
        if(n1.orden>n2.orden){return 1;}
        if(n1.orden<n2.orden){return -1;}
        return 0;
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de estatus de evento'});
      console.error(err)
    });
  }

  loadTiposDeEvento(){
    this.loadingCount++
    this.eventService.getEventTypes(this.cordId).subscribe((res: any) => {
      this.loadingCount--
      this.tiposEvento = res;
    },(err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los tipos de evento'});
      console.error(err)
    })
  }

  loadSecccion(){
    if(this.router.url.includes('/event-details/')){
      this.seccion = 1;
    }else if(this.router.url.includes('/event-campus')){
      this.seccion = 2;
    }else if(this.router.url.includes('/event-ods')){
      this.seccion = 3;
    }else if(this.router.url.includes('/event-collaborators')){
      this.seccion = 4;
    }else if(this.router.url.includes('/event-files')){
      this.seccion = 5;
    }
  }

  loadEventos(){
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.nombre = res[0].nombre;
      this.tipo = res[0].id_tipo_evento;
      this.descripcion = res[0].descripcion ;
      this.lema = res[0].lema
      this.objetivo = res[0].objetivo
      this.estatus = res[0].id_estatus_evento;
      this.nivelDesarrollo = res[0].niv_desarr_for_enc_unit_uvm;
      this.loadRangosTiempo();
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron datos del evento especificado'});
      console.error(err)
    })
  }

  loadCampus(){
    this.loadingCount++
    this.eventService.getCampusList(this.cordId).subscribe((resCamp: any) => {
      this.loadingCount--
      this.campus=resCamp;
      this.loadCampusAsign()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus de la institución especificada'});
      console.error(err)
    });
  }

  loadCampusAsign(){
    this.loadingCount++
    this.eventService.getCampusSimplesAsign(this.eventoId).subscribe((resCampAsig: any) => {
      this.loadingCount--
      console.log("campus",resCampAsig)
      for(let ca of resCampAsig){
        this.campusSelected=ca.id
        this.eventoCampusId=ca.id
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus asociados al evento especificado'});
      console.error(err)
    });
  }

  loadRangeEvent(){
    console.log("this.idtipoRangoTiempo",this.idtipoRangoTiempo)
    this.loadingCount++
    this.eventService.getRangeEventList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      for(let fech of res ){
        if(fech.id_tipo_rango == this.idtipoRangoTiempo){
          this.showFechaInicio = moment(fech.tiempo_inicio,'yyyy-MM-DD').format('DD-MM-yyyy');
          this.showFechaFinal = moment(fech.tiempo_final,'yyyy-MM-DD').format('DD-MM-yyyy');
          this.fechaInicio = this.dateStringToIso8601Start(this.showFechaInicio);
          this.fechaFinal = this.dateStringToIso8601End(this.showFechaFinal);
        }
      }
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas del evento especificado'});
      console.error(err)
    })
  }


  validarNombre(){
    if(this.nombre==''){
      this.validacionNombre=1;
    }else{
      this.validacionNombre=0;
    }
  }

  validarDescripcion(){
    if(this.descripcion!=''){
      if(this.descripcion && this.descripcion.length >= 500){
        this.validacionDescripcion = 1;
      }else if(this.descripcion && this.descripcion.length < 500){
        this.validacionDescripcion = 0;
      }
    }
  }

  validarLema(){
    if(this.lema!=''){
      if(this.lema && this.lema.length >= 200){
        this.validacionLema = 1;
      }else if(this.lema && this.lema.length < 200){
        this.validacionLema = 0;
      }
    }
  }

  validarObjetivo(){
    if(this.objetivo!=''){
      if(this.objetivo && this.objetivo.length >= 500){
        this.validacionObjetivo = 1;
      }else if(this.objetivo && this.objetivo.length < 500){
        this.validacionObjetivo = 0;
      }
    }
  }

  validarFechas(){
    if (this.fechaInicio == '' && this.fechaFinal == '') {
      this.validacionFechaInicio = 1;
      this.validacionFechaFinal = 1;
    } else if (this.fechaInicio == '' && this.fechaFinal != '') {
      this.validacionFechaInicio = 1;
      this.validacionFechaFinal = 3;
    } else if (this.fechaInicio != '' && this.fechaFinal == '') {
      this.validacionFechaInicio = 0;
      this.validacionFechaFinal = 1;
    } else if (this.fechaInicio != '' && this.fechaFinal != '') {
      this.validacionFechaInicio = 0;
      this.validacionFechaFinal = 0;
      if (this.fechaInicio >= this.fechaFinal) {
        this.validacionFechaInicio = 2;
        this.validacionFechaFinal = 2;
      }
    }
  }

  validarCampus(){
    if(this.campusSelected!=0){
      this.validacionCampus = 0;
    }else{
      this.validacionCampus = 1;
    }
  }

  validarNivel(){
    if(this.nivelDesarrollo!=''){
      this.validacionNivel = 0;
    }else{
      this.validacionNivel = 1;
    }
  }

  validarFormulario(){
    this.validarNombre();
    this.validarDescripcion();
    this.validarLema();
    this.validarObjetivo();
    this.validarFechas();
    this.validarNivel();
    if(this.validacionNombre==0 &&
      this.validacionDescripcion==0 &&
      this.validacionLema==0 &&
      this.validacionObjetivo==0 &&
      this.validacionFechaInicio==0 &&
      this.validacionFechaFinal==0 &&
      this.validacionNivel==0
    ){
      this.updateEvent();
    }
  }

  ligarCampus(actualizar?:boolean){
    this.loadingCount++
    this.eventService.addCampusToEvent(this.campusSelected,this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      if(!actualizar){
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se agregó el campus al evento'});
      console.error(err)
    });
  }

  desliagarCampus(){
    this.loadingCount++
    this.eventService.removeCampusToEvent(this.eventoCampusId,this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.ligarCampus(true)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al eliminar el campus especificado del evento'});
      console.error(err)
    });
  }

  updateEvent(){
    console.warn("actualizar")
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId,this.idtipoRangoTiempo).subscribe((res: any) => {
      this.loadingCount--
      const ranges = res
      this.loadingCount++
      this.eventService.updateDateEvent(ranges[0].id,this.fechaInicio,this.fechaFinal,this.idtipoRangoTiempo).subscribe((resI: any) => {
        this.loadingCount--
        console.log("// fechas actualizadas");
        this.sendEventUpdateFechasDurNotif(this.eventoId)
        this.loadingCount++
        this.eventService.updateEvent(this.eventoId,this.nombre,this.tipo,this.descripcion,this.lema,this.objetivo,this.estatus,this.nivelDesarrollo).subscribe((res: any) => {
          this.loadingCount--
          console.log("// evento actuializado");
          this.sendEventUpdateNotif(this.eventoId)
        }, (err) => {
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al actualizar los datos del evento'});
          console.error(err)
        });
      }, (err) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al guardar las fechas de realización del evento especificado'});
        console.error(err)
      });
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las fechas de realización del evento especificado'});
      console.error(err)
    })
  }

  sendEventUpdateNotif(idEvento: any) {
    this.loadingCount++
    this.notificacionesScicomService.sendNotificationEditDatGenEvento(idEvento).subscribe(() => {
      this.loadingCount--
      console.info("NotificationEditDatGenEvento")
    }, (err:any) =>{
      this.loadingCount--
      console.error(err)
    });
  }

  sendEventUpdateFechasDurNotif(idEvento: any) {
    this.loadingCount++
    this.notificacionesScicomService.sendNotificationEditFechasDurEvento(idEvento).subscribe(() => {
      this.loadingCount--
      console.info("NotificationEditFechasDurEvento")
    }, (err:any) =>{
      this.loadingCount--
      console.error(err)
    });
  }

  setFechaInicio(fecha: any) {
    console.warn("fecha",fecha)
    if(fecha!=''){
      this.showFechaInicio = fecha;
      this.fechaInicio = this.dateStringToIso8601Start(fecha);
    }
  }

  setFechaFinal(fecha: any) {
    if(fecha!='') {
      this.showFechaFinal = fecha;
      this.fechaFinal = this.dateStringToIso8601End(fecha);
    }
  }

  dateStringToIso8601Start(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').startOf('day').valueOf())).toISOString()
  }

  dateStringToIso8601End(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').endOf('day').valueOf())).toISOString()
  }

  changeEstatus(stat:number){
    this.estatus = stat;
    this.loadStatusEvent();
  }

}
