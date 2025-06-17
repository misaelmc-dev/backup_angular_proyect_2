import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {TypesParticipationService} from "../../../../../services/scicom/types-participation.service";

@Component({
  selector: 'app-event-type-participants',
  templateUrl: './event-type-participations.component.html',
  styleUrls: ['./event-type-participations.component.css']
})
export class EventTypeParticipationsComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  nombre:string="";
  tipo:number;
  estatus:string="";

  participationSelected:number = 0;
  participationDescripcion:string="";

  fechaInicio:any="";
  fechaFinal:any="";
  showFechaInicio:any="";
  showFechaFinal:any="";

  fechaInicioEvento:any="";
  fechaFinalEvento:any="";
  showFechaInicioEvento:any="";
  showFechaFinalEvento:any="";

  pageNumber:number = 1;
  pageSize:number = 10;
  totalItems:number = 0;

  participation:any[]=[];
  participationAsing:any[]=[];
  participationNoAsing:any[]=[];

  fechasAsign:any[]=[];

  mensaje1:any;
  mensaje3:any;
  mensaje4:any;

  loadingCount: number = 0; //cuenta el número de elementos cargando

  titulo:boolean = false;

  fechaid:number = 0;

  flagUpdate:boolean = false;

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              public permisosScicomService: PermisosScicomService,
              public tiposParticipacionService: TypesParticipationService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadTitle();
    this.loadEventos();
    this.loadRangeEvent();
    this.loadParticipation();
  }

  loadTitle = () => {
    if(this.router.url.includes('/event-type-participations')){
      this.titulo = true;
    }
  }

  loadEventos = () => {
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.nombre = res[0].nombre;
      this.tipo = res[0].id_tipo_evento;
      this.estatus = res[0].id_estatus_evento;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  loadRangeEvent = () => {
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId,1).subscribe((res: any) => {
      this.loadingCount--
      this.showFechaInicioEvento = moment(res[0].tiempo_inicio,'yyyy-MM-DD').format('DD-MM-yyyy');
      this.showFechaFinalEvento = moment(res[0].tiempo_final,'yyyy-MM-DD').format('DD-MM-yyyy');
      this.fechaInicioEvento = this.dateStringToIso8601Start(this.showFechaInicioEvento);
      this.fechaFinalEvento = this.dateStringToIso8601End(this.showFechaFinalEvento);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas de duración del evento especificado'});
      console.error(err)
    });
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId,2).subscribe((res: any) => {
      this.loadingCount--
      this.fechasAsign = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas de evaluación del evento especificado'});
      console.error(err)
    });
  }

  loadParticipation = () => {
    this.loadingCount++
    this.tiposParticipacionService.getTypeParticipationByEvent(this.eventoId).subscribe((resPart: any) => {
      this.loadingCount--
      this.participation = resPart ;
      this.loadingCount++
      this.eventService.getTypeParticipationByEventAsign(this.pageNumber,this.pageSize,this.eventoId).subscribe((resPartAsign: any) => {
        this.loadingCount--
        this.participationNoAsing = this.participation;
        for(let camp of resPartAsign.data[0].tipos_de_participacion){
          this.participationNoAsing = this.participationNoAsing.filter( (partNA:any) => partNA.id != camp.pivot.id_tipo_participacion );
        }
        this.participationAsing = this.participation;
        for(let camp of this.participationNoAsing){
          this.participationAsing = this.participationAsing.filter( (partA:any) => partA.id != camp.id );
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las participaciones asignadas del evento especificado'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de participaciones'});
      console.error(err)
    });
  }

  cleanValues = () => {
    this.flagUpdate = false;
    this.participationSelected = 0;
    this.fechaInicio = "";
    this.fechaFinal  = "";
    this.showFechaInicio = "";
    this.showFechaFinal = "";
    this.fechaid = 0;
    this.mensaje3=1;
    this.mensaje4=1;
  }

  updateModal = (part:any) => {
    this.flagUpdate = true;
    this.participationSelected = part.id;
    let rangoId:number = 0;
    let inicio:number = 0;
    let final:number = 0;
    for(let fa of this.fechasAsign){
      if(fa.id_tipo_rango == 2){
        rangoId = fa.id;
        inicio = fa.tiempo_inicio;
        final = fa.tiempo_final;
      }
    }
    this.fechaid = rangoId;
    this.showFechaInicio = moment(inicio,'yyyy-MM-DD').format('DD-MM-yyyy');
    this.showFechaFinal = moment(final,'yyyy-MM-DD').format('DD-MM-yyyy');
    this.fechaInicio = this.dateStringToIso8601Start(this.showFechaInicio);
    this.fechaFinal = this.dateStringToIso8601End(this.showFechaFinal);
    this.mensaje3=1;
    this.mensaje4=1;
  }

  updateParticipation(){
    if(this.fechaid!=0){
      this.loadingCount++
      this.eventService.updateDateEvent(this.fechaid,this.fechaInicio,this.fechaFinal).subscribe((resI: any) => {
        this.loadingCount--

        this.loadingCount++
        this.notificacionesScicomService.sendNotificationEditFechasRegPartConTrabEvento(this.eventoId).subscribe((res:any) => {
          this.loadingCount--
          console.info("NotificationEditFechasRegPartConTrabEvento")
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
        });

        console.log('Fecha actualizada');
        this.loadRangeEvent();
        this.loadParticipation();
        Swal.fire({icon: 'success', text: 'El tipo de participación se actualizó'});
      }, (err) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al actualizar las fechas de registro de participaciones'});
        console.error(err)
      });
    }else{
      console.warn(this.fechaFinal)
      const utcFinalTime = (new Date(moment.utc(this.fechaFinal, 'DD-MM-yyyy').endOf('day').valueOf())).toISOString()
      console.warn(utcFinalTime)
      this.eventService.addDateRangeEvent(this.fechaInicio, utcFinalTime, this.eventoId, 2).subscribe((resI: any) => {
        this.loadingCount--
        this.pageNumber = 1;

        this.loadingCount++
        this.notificacionesScicomService.sendNotificationEditFechasRegPartConTrabEvento(this.eventoId).subscribe((res:any) => {
          this.loadingCount--
          console.info("NotificationEditFechasRegPartConTrabEvento")
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
        });

        this.loadRangeEvent();
        this.loadParticipation();
        Swal.fire({icon: 'success', text: 'El tipo de participación se agregó'});
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se guardaron las fechas de evaluación del evento especificado'});
        console.error(err)
      });
    }
  }

  asingParticipation = () => {
    this.loadingCount++
    this.eventService.addParticipationToEvent(this.participationSelected,this.eventoId).subscribe((res: any) => {
      this.loadingCount--

      this.loadingCount++
      this.notificacionesScicomService.sendNotificationAddTipPartEvento(this.eventoId,this.participationSelected).subscribe((res:any) => {
        this.loadingCount--
        console.info("NotificationAddTipPartEvento")
      }, (err:any) =>{
        this.loadingCount--
        console.error(err)
      });

      if(this.fechaInicio <= this.fechaFinal){
        if(this.fechaFinal>= this.fechaInicio) {
          if(this.participationSelected==1) {
            this.loadingCount++
            this.eventService.addDateRangeEvent(this.fechaInicio, this.fechaFinal, this.eventoId, 2).subscribe((resI: any) => {
              this.loadingCount--
              this.pageNumber = 1;

              this.loadingCount++
              this.notificacionesScicomService.sendNotificationEditFechasRegPartConTrabEvento(this.eventoId).subscribe((res:any) => {
                this.loadingCount--
                console.info("NotificationEditFechasRegPartConTrabEvento")
              }, (err:any) =>{
                this.loadingCount--
                console.error(err)
              });

              this.loadRangeEvent();
              this.loadParticipation();
              Swal.fire({icon: 'success', text: 'El tipo de participación se agregó'});
            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error',text: 'No se guardaron las fechas de evaluación del evento especificado'});
              console.error(err)
            });
          }else{
            this.loadRangeEvent();
            this.loadParticipation();
            Swal.fire({icon: 'success', text: 'El tipo de participación se agregó'});
          }
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se guardo la participación del evento especificado'});
      console.error(err)
    });
  }

  removeParticipation = (partId:number) => {
    Swal.fire({
      title: '¿Deseas eliminar <br>el tipo de participación?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let rangoId:number = 0;
        for(let fa of this.fechasAsign){
          if(fa.id_tipo_rango == 2){
            rangoId = fa.id;
          }
        }
        if(rangoId!=0){
          this.loadingCount++
          this.eventService.deleteRangeEvent(rangoId).subscribe((res: any) => {
            this.loadingCount--
            console.log("fecha eliminada");
            this.loadingCount++
            this.eventService.removeParticipationToEvent(partId, this.eventoId).subscribe((res: any) => {
              this.loadingCount--
              this.pageNumber = 1;
              this.loadingCount++
              this.notificacionesScicomService.sendNotificationDelTipPartEvento(this.eventoId,partId).subscribe((res:any) => {
                this.loadingCount--
                console.info("NotificationDelTipPartEvento")
              }, (err:any) =>{
                this.loadingCount--
                console.error(err)
              });
              this.loadParticipation();
              console.log("participacion eliminada");
            }, (err:any) =>{
              this.loadingCount--
              Swal.fire({icon: 'error',text: 'No se eliminaron las participaciones del evento especificado'});
              console.error(err)
            });
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se eliminaron las fechas especificadas'});
            console.error(err)
          });
        }else{
          this.eventService.removeParticipationToEvent(partId, this.eventoId).subscribe((res: any) => {
            this.loadingCount--
            this.pageNumber = 1;
            this.loadingCount++
            this.notificacionesScicomService.sendNotificationDelTipPartEvento(this.eventoId,partId).subscribe((res:any) => {
              this.loadingCount--
              console.info("NotificationDelTipPartEvento")
            }, (err:any) =>{
              this.loadingCount--
              console.error(err)
            });
            this.loadParticipation();
            console.log("participacion eliminada");
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se eliminaron las participaciones del evento especificado'});
            console.error(err)
          });
        }
      }
    })
  }

  validateInput = (validate?:string) => {
    if(validate=="nombre"){
      if(this.nombre==''){
        this.mensaje1=2;
      }else{
        this.mensaje1=1;
      }
    }else if(validate=="fecha"){
      this.mensaje3=1;
      if(this.fechaInicioEvento <= this.fechaInicio && this.fechaInicio <= this.fechaFinalEvento){
        if(this.fechaInicio==''){this.mensaje3=2}
        if(this.fechaFinal!=''){
          if(this.fechaInicio>=this.fechaFinal){this.mensaje3=3}
          if(this.fechaInicio==this.fechaFinal){this.mensaje3=1}
        }
      }else{
        this.mensaje3=5;
      }
      this.mensaje4=1;
      if(this.fechaInicioEvento <= this.fechaFinal && this.fechaFinal <= this.fechaFinalEvento){
        if(this.fechaFinal==''){this.mensaje4=2}
        if(this.fechaInicio!=''){
          if(this.fechaFinal<=this.fechaInicio){this.mensaje4=3}
          if(this.fechaInicio==this.fechaFinal){this.mensaje4=1}
        }else{
          this.mensaje4=4;
        }
      }else{
        this.mensaje4=5;
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

  cambiarPagina(event?:number){
    this.pageNumber = event
    this.loadParticipation()
  }

}
