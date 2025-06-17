import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import * as moment from "moment";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {TypesPaymentsService} from "../../../../../services/scicom/types-payments.service";

@Component({
  selector: 'app-event-payments',
  templateUrl: './event-payments.component.html',
  styleUrls: ['./event-payments.component.css']
})
export class EventPaymentsComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  nombre:string="";
  tipo:number;
  estatus:string="";

  fechaInicioEval:any="";
  fechaFinalEval:any="";
  showFechaInicioEval:any="";
  showFechaFinalEval:any="";
  fechaInicioValid:any="";
  fechaFinalValid:any="";
  showFechaInicioValid:any="";
  showFechaFinalValid:any="";

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageStart:number = 0;
  pageEnd:number = 0;
  pageSize:number = 10;
  totalItems:number = 0;
  labelPagination:string = '';

  fechasAsign1:any[]=[];
  fechasAsign2:any[]=[];

  estatusEventos:any=[];
  eventosPagos:any=[];

  instituciones:any=[];
  institucion:number=this.cordId;
  institucionNombre:string="";

  payments:any[]=[];
  paymentsAsing:any[]=[];
  paymentsNoAsing:any[]=[];

  paymentSelected:number=0;
  payMonto:any;

  mensaje1:any=1;
  mensaje2:any=1;
  mensaje3:any=1;
  mensaje4:any=1;
  mensaje5:any=1;
  mensaje6:any=1;

  rangoEventoId:number = 0;
  fechaInicioEvento:string = '';
  fechaFinalEvento:string = '';
  showFechaInicioEvento:string = '';
  showFechaFinalEvento:string = '';

  loadingCount: number = 0; //cuenta el número de elementos cargando

  titulo:boolean = false;
  flagUpdate:boolean = false;

  fechaId1:number = 0;
  fechaId2:number = 0;

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              public permisosScicomService: PermisosScicomService,
              public tiposPagos: TypesPaymentsService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadTitle();
    this.loadEventos();
    this.loadRangeEvent();
    this.loadPayments();
  }

  loadTitle = () => {
    if(this.router.url.includes('/event-update/')){
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
      for(let pagos of res){
        for(let pay of pagos.tipos_de_pago){
          this.eventosPagos = [pay.pivot];
        }
      }
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
    this.eventService.getRangeEventByEvents(this.eventoId,5).subscribe((res: any) => {
      this.loadingCount--
      this.fechasAsign1 = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas de pago del evento especificado'});
      console.error(err)
    });
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId,6).subscribe((res: any) => {
      this.loadingCount--
      this.fechasAsign2 = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas de pago del evento especificado'});
      console.error(err)
    });
  }

  loadPayments = () => {
    this.loadingCount++
    this.tiposPagos.getPaymentsList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.payments = res ;
      this.loadingCount++
      this.tiposPagos.getPaymentsAsign(this.pageNumber,this.pageSize,this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.paymentsAsing = res.data ;
        this.paymentsNoAsing = [];
        this.paymentsNoAsing = this.payments;
        for(let camp of this.paymentsAsing){
          this.paymentsNoAsing = this.paymentsNoAsing.filter( ({ id }) => id != camp.id );
        }
        this.totalItems=res.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las datos de pago del evento especificado'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de pago'});
      console.error(err)
    });
  }

  asingPayments(isUpdating: boolean) {
    this.loadingCount++
    this.eventService.addPaymentsToEvent(this.paymentSelected,this.eventoId,this.payMonto).subscribe((res: any) => {
      this.loadingCount--
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        const tiposDePago = JSON.parse(JSON.stringify(res[0].tipos_de_pago.map((value: any) => {
          return {
            id_tipo_pago: value.pivot.id_tipo_pago,
            id_tipo_pago_evento: value.pivot.id,
          }
        })))
        //console.warn(tiposDePago)
        const idTipoPagoEventoDeTipoPagoScicom = tiposDePago.filter(
          (value: any) => value.id_tipo_pago == this.paymentSelected
        ).pop().id_tipo_pago_evento
        //console.warn(idTipoPagoEventoDeTipoPagoScicom)
        let rango1Agregado = false
        let rango2Agregado = false
        this.loadingCount++
        this.eventService.addDateRangeEvent(this.fechaInicioEval,this.fechaFinalEval, this.eventoId,
          5,0,idTipoPagoEventoDeTipoPagoScicom).subscribe((resI: any) =>
        {
          this.loadingCount--
          this.pageNumber = 1;
          rango1Agregado = true
          if (rango1Agregado && rango2Agregado) {
            this.loadEventos();
            this.loadRangeEvent();
            this.loadPayments();
            Swal.fire({icon: 'success',text: 'El tipo de pago se agregó'});
          }
          console.log("se guardo la fecha de ejecucion");
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al guardar las fechas de ejecución de pago del evento especificado'});
          console.error(err)
        });
        this.loadingCount++
        this.eventService.addDateRangeEvent(this.fechaInicioValid,this.fechaFinalValid, this.eventoId, 6,
          0,idTipoPagoEventoDeTipoPagoScicom).subscribe((resI: any) =>
        {
          this.loadingCount--
          this.pageNumber = 1;
          rango2Agregado = true
          console.log("Se guardo la fecha de validación");
          if (rango1Agregado && rango2Agregado) {
            this.loadEventos();
            this.loadRangeEvent();
            this.loadPayments();
            Swal.fire({icon: 'success',text: 'El tipo de pago se agregó'});
          }
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al guardar las fechas de validación de pago del evento especificado'});
          console.error(err)
        });
      }, (err) => {
        this.loadingCount--
        console.error(err);
        Swal.fire({icon: 'error',text: 'Error al consultar los tipos de pago permitidos en el evento'});
      })

      if (isUpdating) {
        this.loadingCount++
        this.notificacionesScicomService.sendNotificationEditTipPagEvento(this.eventoId,this.paymentSelected).subscribe((res:any) => {
          this.loadingCount--
          console.info("NotificationEditTipPagEvento")
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
        });
      } else  {
        this.loadingCount++
        this.notificacionesScicomService.sendNotificationAddTipPagEvento(this.eventoId,this.paymentSelected).subscribe((res:any) => {
          this.loadingCount--
          console.info("NotificationAddTipPagEvento")
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
        });
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al guardar la configuración de pagos del evento especificado. Intente nuevamente'});
      console.error(err)
    });
  }

  removePayments(paymentsId:number,rangoId1:number,rangoId2:number) {
    Swal.fire({
      title: '¿Deseas eliminar <br>el tipo de pago?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventService.removePaymentsToEvent(paymentsId,this.eventoId).subscribe((res: any) => {
          this.loadingCount--
          this.pageNumber = 1;

          this.loadingCount++
          this.notificacionesScicomService.sendNotificationDelTipPagEvento(this.eventoId,paymentsId).subscribe((res:any) => {
            this.loadingCount--
            console.info("NotificationDelTipPagEvento")
          }, (err:any) =>{
            this.loadingCount--
            console.error(err)
          });

          this.loadRangeEvent();
          this.loadPayments();
            console.log("pago eliminado");
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se elimino pago del evento especificado'});
          console.error(err)
        });
      }
    })
  }

  cleanValues = () => {
    this.flagUpdate = false;
    this.paymentSelected = 0;
    this.fechaInicioEval = "";
    this.fechaFinalEval  = "";
    this.fechaInicioValid = "";
    this.fechaFinalValid  = "";
    this.showFechaInicioEval = "";
    this.showFechaFinalEval  = "";
    this.showFechaInicioValid = "";
    this.showFechaFinalValid  = "";
    this.fechaId1 = 0;
    this.fechaId2 = 0;
    this.payMonto = '';
    this.mensaje1=1;
    this.mensaje2=1;
    this.mensaje3=1;
    this.mensaje4=1;
    this.mensaje5=1;
    this.mensaje6=1;
  }

  updateModal(pay:any,fechaId1:any,fechaId2:any) {
    this.flagUpdate = true;
    this.paymentSelected = pay.id;
    this.fechaId1 = fechaId1;
    this.fechaId2 = fechaId2;
    for(let tipPay of this.eventosPagos){
      if(pay.id==tipPay.id_tipo_pago){
        this.payMonto = tipPay.monto;
      }
    }
    this.loadingCount++
    this.eventService.getRangeEventById(fechaId1).subscribe((res: any) => {
      this.loadingCount--
      for(let fecha of res){
        this.showFechaInicioEval = moment(res[0].tiempo_inicio,'yyyy-MM-DD').format('DD-MM-yyyy');
        this.showFechaFinalEval = moment(res[0].tiempo_final,'yyyy-MM-DD').format('DD-MM-yyyy');
        this.fechaInicioEval = this.dateStringToIso8601Start(this.showFechaInicioEval);
        this.fechaFinalEval = this.dateStringToIso8601End(this.showFechaFinalEval);
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas especificadas'});
      console.error(err)
    });
    this.loadingCount++
    this.eventService.getRangeEventById(fechaId2).subscribe((res: any) => {
      this.loadingCount--
      for(let fecha of res){
        this.showFechaInicioValid = moment(res[0].tiempo_inicio,'yyyy-MM-DD').format('DD-MM-yyyy');
        this.showFechaFinalValid = moment(res[0].tiempo_final,'yyyy-MM-DD').format('DD-MM-yyyy');
        this.fechaInicioValid = this.dateStringToIso8601Start(this.showFechaInicioValid);
        this.fechaFinalValid = this.dateStringToIso8601End(this.showFechaFinalValid);
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas especificadas'});
      console.error(err)
    });
    this.mensaje1=1;
    this.mensaje2=1;
    this.mensaje3=1;
    this.mensaje4=1;
    this.mensaje5=1;
    this.mensaje6=1;
  }

  updatePayments(){
    this.loadingCount++
    this.eventService.deleteRangeEvent(this.fechaId2).subscribe((res: any) => {
      this.loadingCount--
      this.loadingCount++
      this.eventService.deleteRangeEvent(this.fechaId1).subscribe((res: any) => {
        this.loadingCount--
        this.loadingCount++
        this.eventService.removePaymentsToEvent(this.paymentSelected,this.eventoId).subscribe((res: any) => {
          this.loadingCount--



          console.log("pago eliminado");
          this.asingPayments(true)
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al actualizar el tipo de pago del evento especificado (rPFEvent)'});
          console.error(err)
        });
        console.log("fecha 1 eliminada");
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al actualizar las fechas del tipo de pago especificado (dRE1)'});
        console.error(err)
      });
      console.log("fecha 2 eliminada");
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al actualizar las fechas del tipo de pago especificado (dRE2)'});
      console.error(err)
    });
    //this.loadRangeEvent();
    //this.loadPayments();
  }

  validateInput = (validate?:string) => {
    if(validate=="all"){
      this.mensaje1=1;
      this.mensaje2=1;
      this.mensaje3=1;
      this.mensaje4=1;
      this.mensaje5=1;
    }else if(validate=="fechas1"){
      this.mensaje1=1;
      if(this.fechaInicioEvento <= this.fechaInicioEval && this.fechaInicioEval <= this.fechaFinalEvento){
        if(this.fechaInicioEval==''){this.mensaje1=2}
        if(this.fechaFinalEval!=''){
          if(this.fechaInicioEval>=this.fechaFinalEval){this.mensaje1=3}
          if(this.fechaInicioEval==this.fechaFinalEval){this.mensaje1=1}
        }
      }else{
        this.mensaje1=5;
      }
      this.mensaje2=1;
      if(this.fechaInicioEvento <= this.fechaFinalEval && this.fechaFinalEval<= this.fechaFinalEvento){
        if(this.fechaFinalEval==''){this.mensaje2=2}
        if(this.fechaInicioEval!=''){
          if(this.fechaFinalEval<=this.fechaInicioEval){this.mensaje2=3}
          if(this.fechaInicioEval==this.fechaFinalEval){this.mensaje2=1}
        }else{
          this.mensaje2=4;
        }
      }else{
        this.mensaje2=5;
      }
    }else if(validate=="fechas2"){
      this.mensaje3=1;
      if(this.fechaInicioEvento <= this.fechaInicioValid && this.fechaInicioValid <= this.fechaFinalEvento){
        if(this.fechaInicioValid==''){this.mensaje3=2}
        if(this.fechaFinalValid!=''){
          if(this.fechaInicioValid>=this.fechaFinalValid){this.mensaje3=3}
          if(this.fechaInicioValid==this.fechaFinalValid){this.mensaje3=1}
        }
      }else{
        this.mensaje3=5;
      }
      this.mensaje4=1;
      if(this.fechaInicioEvento <= this.fechaFinalValid && this.fechaFinalValid <= this.fechaFinalEvento){
        if(this.fechaFinalValid==''){this.mensaje4=2}
        if(this.fechaInicioValid!=''){
          if(this.fechaFinalValid<=this.fechaInicioValid){this.mensaje4=3}
          if(this.fechaInicioValid==this.fechaFinalValid){this.mensaje4=1}
        }else{
          this.mensaje4=4;
        }
      }else{
        this.mensaje4=5;
      }
    }else if(validate=='monto'){
      this.mensaje5=1;
      if(this.payMonto==''){
        this.mensaje5=2;
      }
    }else if(validate=='pago'){
      this.mensaje6=1;
      if(this.paymentSelected==0){
        this.mensaje6=2;
      }
    }
  }

  setFechaInicioEval(fecha: any) {
    this.showFechaInicioEval = fecha;
    this.fechaInicioEval = this.dateStringToIso8601Start(fecha);
  }

  setFechaFinalEval(fecha: any) {
    this.showFechaFinalEval = fecha;
    this.fechaFinalEval = this.dateStringToIso8601End(fecha);
  }

  setFechaInicioValid(fecha: any) {
    this.showFechaInicioValid = fecha;
    this.fechaInicioValid = this.dateStringToIso8601Start(fecha);
  }

  setFechaFinalValid(fecha: any) {
    this.showFechaFinalValid = fecha;
    this.fechaFinalValid = this.dateStringToIso8601End(fecha);
  }

  dateStringToIso8601Start(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').startOf('day').valueOf())).toISOString()
  }

  dateStringToIso8601End(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').endOf('day').valueOf())).toISOString()
  }

  getFirstRangeIdByRangeType(rangeType: any, ranges: any[]) {
    for (let f1 of ranges) {
      if (f1.id_tipo_rango == rangeType)
        return f1.id
    }
  }

  cambiarPagina(event?:number){
    this.pageNumber = event
    this.loadPayments()
  }

}

