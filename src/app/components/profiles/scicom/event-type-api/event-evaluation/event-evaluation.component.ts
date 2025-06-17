import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import * as moment from "moment";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {TypesEvaluationService} from "../../../../../services/scicom/types-evaluation.service";

@Component({
  selector: 'app-event-evaluation',
  templateUrl: './event-evaluation.component.html',
  styleUrls: ['./event-evaluation.component.css']
})
export class EventEvaluationComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  nombre:string="";
  tipo:number;
  estatus:string="";

  fechaInicio:any="";
  fechaFinal:any="";
  showFechaInicio:any="";
  showFechaFinal:any="";

  pageNumber:number = 1;
  pageSize:number = 10;
  totalItems:number = 0;

  evaluation:any[]=[];
  evaluationAsing:any[]=[];
  evaluationNoAsing:any[]=[];

  evaluationSelected:number;

  fechaInicioEvento:any="";
  fechaFinalEvento:any="";
  showFechaInicioEvento:any="";
  showFechaFinalEvento:any="";

  fechasAsign:any[]=[];

  mensaje3:any=1;
  mensaje4:any=1;

  loadingCount: number = 0; //cuenta el número de elementos cargando

  titulo:boolean = false;

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              public permisosScicomService: PermisosScicomService,
              public tiposEvalucionService: TypesEvaluationService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadTitle();
    this.loadEventos();
    this.loadEvaluation();
    this.loadRangeEvent();
  }

  loadTitle = () => {
    if(this.router.url.includes('/event-update/')){
      this.titulo = true;
    }
  }

  loadEventos = () => {
    if(this.eventoId!=0){
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
  }

  loadEvaluation = () => {
    this.loadingCount++
    this.tiposEvalucionService.getTypesEvalList([this.eventoId]).subscribe((res: any) => {
      this.loadingCount--
      this.evaluation = res ;
      this.loadingCount++
      this.tiposEvalucionService.getTypesEvalByEvent(this.pageNumber,this.pageSize,[this.eventoId]).subscribe((res: any) => {
        this.loadingCount--
        this.evaluationAsing = res.data ;
        this.totalItems = res.total ;
        this.evaluationNoAsing = this.evaluation;
        for(let camp of this.evaluationAsing){
          this.evaluationNoAsing = this.evaluationNoAsing.filter( ({ id }) => id != camp.id );
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las tipos de evaluación del permitidos en el evento especificado'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de evaluación del sistema scicom'});
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
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas del evento especificado'});
      console.error(err)
    });
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId,3).subscribe((res: any) => {
      this.loadingCount--
      this.fechasAsign = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas de evaluaciones del evento especificado'});
      console.error(err)
    });
  }

  asingEvaluation = () => {
    if(this.evaluationSelected!=0){
      this.loadingCount++
      this.eventService.addEvaluationToEvent(this.evaluationSelected,this.eventoId).subscribe((res: any) => {
        this.loadingCount--

        if(this.fechaInicio <= this.fechaFinal){
          if(this.fechaFinal >= this.fechaInicio){
            this.loadingCount++
            this.eventService.addDateRangeEvent(this.fechaInicio,
              this.fechaFinal, this.eventoId, 3,this.evaluationSelected).subscribe((resI: any) =>
            {
              this.loadingCount--
              this.pageNumber = 1;
              this.loadRangeEvent();
              this.loadEvaluation();
              Swal.fire({icon: 'success',text: 'El tipo de evaluación se agregó'});
            }, (err:any) =>{
              this.loadingCount--
              Swal.fire({icon: 'error',text: 'Error al guardar las fechas de evaluación del evento '
                  +'especificado. Elimine el tipo de evaluación de la lista e intente agregarlo nuevamente'});
              console.error(err)
            });
          }
        }

        this.loadingCount++
        this.notificacionesScicomService. sendNotificationAddTipEvalEvento(this.eventoId,this.evaluationSelected).subscribe((res:any) => {
          this.loadingCount--
          console.info(" sendNotificationAddTipEvalEvento")
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
        });

      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al agregar el tipo de evaluación permitido al evento especificado'});
        console.error(err)
      });
    }
  }

  removeEvaluation(evaluationId:number) {
    Swal.fire({
      title: '¿Deseas eliminar el tipo de evaluacion?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        var rangoId = 0;
        for(let fa of this.fechasAsign){
          if(evaluationId==fa.id_tipo_evaluacion){
            rangoId = fa.id;
          }
        }
        this.loadingCount++
        this.eventService.removeEvaluationToEvent(evaluationId, this.eventoId).subscribe((res: any) => {
          this.loadingCount--
          this.pageNumber = 1;

          this.loadingCount++
          this.notificacionesScicomService.sendNotificationDelTipEvalEvento(this.eventoId,evaluationId).subscribe((res:any) => {
            this.loadingCount--
            console.info("NotificationDelTipEvalEvento")
          }, (err:any) =>{
            this.loadingCount--
            console.error(err)
          });

          this.loadEvaluation();
          console.log("evaluacion eliminada");
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al eliminar el tipo de evaluación permitido del evento'});
          console.error(err)
        });
      }
    })
  }

  cleanValues = () => {
    this.evaluationSelected = 0;
    this.fechaInicio = "";
    this.fechaFinal  = "";
    this.showFechaInicio = "";
    this.showFechaFinal  = "";
    this.mensaje3=1;
    this.mensaje4=1;
  }

  validateInput = (validate?:string) => {
    if(validate=="all"){
      this.mensaje3=1;
      this.mensaje4=1;
    }else if(validate=="fecha"){
      this.mensaje3=1;
      if(this.fechaInicioEvento <= this.fechaInicio && this.fechaInicio <= this.fechaFinalEvento)
      {
        if(this.fechaInicio==''){this.mensaje3=2}
        if(this.fechaFinal!=''){
          if(this.fechaInicio >= this.fechaFinal){this.mensaje3=3}
          if(this.fechaInicio == this.fechaFinal){this.mensaje3=1}
        }
      }else{
        this.mensaje3=5;
      }
      this.mensaje4=1;
      if(this.fechaInicioEvento <= this.fechaFinal && this.fechaFinal <= this.fechaFinalEvento){
        if(this.fechaFinal==''){this.mensaje4=2}
        if(this.fechaInicio!=''){
          if(this.fechaInicio >= this.fechaFinal){this.mensaje4=3}
          if(this.fechaInicio == this.fechaFinal){this.mensaje4=1}
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
    this.loadEvaluation()
  }

}
