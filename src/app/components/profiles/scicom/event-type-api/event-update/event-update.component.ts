import {Component, OnInit} from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {EventService} from "../../../../../services/event.service";
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.css']
})
export class EventUpdateComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?:number = Number(this.route.snapshot.paramMap.get('idevent'));

  nombre:string="";
  tipo:any=0;
  descripcion:string="";
  lema:string="";
  objetivo:string="";
  estatus:number=1;
  fechaInicio:any="";
  fechaFinal:any="";
  showFechaInicio:any="";
  showFechaFinal:any="";

  institucion:number=this.cordId;
  instituciones:any=[];

  estatusEventos:any=[];
  tiposEvento: any = []

  seccion:any = 1;

  mensaje1:any=1;
  mensaje2:any=1;
  mensaje3:any=1;
  mensaje4:any=1;
  mensaje5:any=1;
  mensaje6:any=1;
  mensaje7:any=1;

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
    this.loadRangeEvent();
    this.loadEventos();
    this.loadTiposDeEvento()
  }

  loadStatusEvent(){
    this.loadingCount++
    this.eventService.getStatusEventByTipoEvent(1).subscribe((res: any) => {
      this.loadingCount--
      this.estatusEventos = res;
      console.log("this.estatusEventos",this.estatusEventos)
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

  /**
   * Carga los tipos de eventos scicom permitidos
   */
  loadTiposDeEvento() {
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

  loadSecccion = () => {
    if(this.router.url.includes('/event-details/')){
      this.seccion = 1;
    }else if(this.router.url.includes('/event-campus')){
      this.seccion = 2;
    }else if(this.router.url.includes('/event-evaluation')){
      this.seccion = 3;
    }else if(this.router.url.includes('/event-payments')){
      this.seccion = 4;
    }else if(this.router.url.includes('/event-type-participations')){
      this.seccion = 5;
    }else if(this.router.url.includes('/event-work')){
      this.seccion = 6;
    }else if(this.router.url.includes('/event-files')){
      this.seccion = 7;
    }else if(this.router.url.includes('/event-collaborators')){
      this.seccion = 8;
    }
  }

  loadEventos = () => {
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.nombre = res[0].nombre;
      this.tipo = res[0].id_tipo_evento;
      this.descripcion = res[0].descripcion ;
      this.lema = res[0].lema
      this.objetivo = res[0].objetivo
      this.estatus = res[0].id_estatus_evento;
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron datos del evento especificado'});
      console.error(err)
    })
  }

  loadRangeEvent = () => {
    this.loadingCount++
    this.eventService.getRangeEventList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      for(let fech of res ){
        if(fech.id_tipo_rango == 1){
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

  saveEvent() {
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId,1).subscribe((res: any) => {
      this.loadingCount--
      this.validateInput("all");
      if(this.nombre!=''){
        if(this.tipo!=0){
          if(this.fechaInicio!=''){
            if(this.fechaFinal!=''){
              if(this.descripcion==null){
                this.descripcion='';
              }
              if(this.lema==null){
                this.lema='';
              }
              if(this.objetivo==null){
                this.objetivo='';
              }
              if(this.fechaInicio <= this.fechaFinal){
                if(this.fechaFinal >= this.fechaInicio){
                  console.log("// evento actuializado",this.eventoId);
                  this.loadingCount++
                  this.eventService.updateEvent(this.eventoId,this.nombre,this.tipo,this.descripcion,this.lema,this.objetivo,this.estatus).subscribe((res: any) => {
                    this.loadingCount--
                    this.sendEventUpdateNotif(this.eventoId)
                    console.log("// evento actuializado");
                  }, (err) => {
                    this.loadingCount--
                    Swal.fire({icon: 'error',text: 'Error al actualizar metadatos del evento especificado'});
                    console.error(err)
                  });
                  this.loadingCount++
                  this.eventService.updateDateEvent(res[0].id,this.fechaInicio,this.fechaFinal,1).subscribe((resI: any) => {
                    this.loadingCount--
                    this.sendEventUpdateFechasDurNotif(this.eventoId)
                    console.log("// fechas actualizadas");
                  }, (err) => {
                    this.loadingCount--
                    Swal.fire({icon: 'error',text: 'Error al actualizar las fechas globales de duración del evento especificado'});
                    console.error(err)
                  });
                  Swal.fire({icon: 'success',text: 'Se actualizaron los datos generales del evento'});
                }
              }
            }
          }
        }
      }
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las fechas globales del evento especificado'});
      console.error(err)
    })
    return 1
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


  validateInput = (validate?:string) => {
    if(validate=="all"){
      this.mensaje1=1;
      this.mensaje2=1;
      this.mensaje3=1;
      this.mensaje4=1;
      if(this.nombre==''){this.mensaje1=2}
      if(this.tipo==0){this.mensaje2=2}
      if(this.fechaInicio==''){this.mensaje3=2}else{this.mensaje3=1;}
      if(this.fechaFinal!=''){
        if(this.fechaInicio >= this.fechaFinal){this.mensaje3=3}
        if(this.fechaInicio == this.fechaFinal){this.mensaje3=1}
      }
      if(this.fechaFinal==''){this.mensaje4=2}else{this.mensaje4=1}
      if(this.fechaInicio!=''){
        if(this.fechaFinal <= this.fechaInicio){this.mensaje4=3}
        if(this.fechaInicio == this.fechaFinal){this.mensaje4=1}
      }else{
        this.mensaje4=4;
      }
    }else if(validate=="nombre"){
      this.mensaje1=1;
      if(this.nombre==''){this.mensaje1=2}
    }else if(validate=="tipo"){
      this.mensaje2=1;
      if(this.tipo==0){this.mensaje2=2}
    }else if(validate=="fecha"){
      if(this.fechaInicio==''){this.mensaje3=2}else{this.mensaje3=1;}
      if(this.fechaFinal!=''){
        if(this.fechaInicio >= this.fechaFinal){this.mensaje3=3}
        if(this.fechaInicio == this.fechaFinal){this.mensaje3=1}
      }
      if(this.fechaFinal==''){this.mensaje4=2}else{this.mensaje4=1}
      if(this.fechaInicio!=''){
        if(this.fechaFinal <= this.fechaInicio){this.mensaje4=3}
        if(this.fechaInicio == this.fechaFinal){this.mensaje4=1}
      }else{
        this.mensaje4=4;
      }
    }else if(validate=="desc"){
      if(this.descripcion.length >= 500){
        this.mensaje5 = 2;
      }else if(this.descripcion.length < 500){
        this.mensaje5 = 0;
      }
    }
    else if(validate=="lema"){
      if(this.lema.length >= 200){
        this.mensaje6 = 2;
      }else if(this.lema.length < 200){
        this.mensaje6 = 0;
      }
    }
    else if(validate=="objetivos"){
      if(this.objetivo.length >= 500){
        this.mensaje7 = 2;
      }else if(this.objetivo.length < 500){
        this.mensaje7 = 0;
      }
    }
  }

  setFechaInicio(fecha: any) {
    this.showFechaInicio = fecha;
    this.fechaInicio = this.dateStringToIso8601Start(fecha);
  }

  setFechaFinal(fecha: any) {
    this.showFechaFinal = fecha;
    this.fechaFinal = this.dateStringToIso8601End(fecha);
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
