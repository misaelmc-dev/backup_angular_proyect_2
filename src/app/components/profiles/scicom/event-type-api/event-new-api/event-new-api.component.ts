import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-new-api',
  templateUrl: './event-new-api.component.html',
  styleUrls: ['./event-new-api.component.css']
})
export class EventNewApiComponent implements OnInit,OnChanges {

  @Input() flag = '';
  @Input() eventoId = 0;
  @Input() cordinadorId = 0;
  @Output() resultado = new EventEmitter<any>();

  regreso:string = '';

  eventoNombre:string='';
  validacionNombre:number=0;
  eventoDescripcion:string='';
  validacionDescripcion:number=0;
  eventoLema:string='';
  validacionLema:number=0;
  eventoObjetivo:string='';
  validacionObjetivo:number=0;
  eventoFechaInicio:string='';
  validacionFechaInicio:number=0;
  showFechaInicio:any='';
  eventoFechaFinal:string='';
  validacionFechaFinal:number=0;
  showFechaFinal:any='';
  loadingCount:number=0;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    if(this.eventoId!=0){
      this.loadEvento()
    }
  }

  ngOnChanges(changes:SimpleChanges){
    this.flag=changes['flag'].currentValue;
    console.log("flag:",this.flag);
    if(this.eventoId==0){
      this.validarFormulario()
    }
    if(this.flag=='actualizar'){
      this.validarFormulario()
    }
    if(this.flag=='actualizarCerrar'){
      this.validarFormulario()
    }
  }

  loadEvento(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        console.log("evento",res)
        this.eventoNombre=res[0].nombre;
        if(res[0].descripcion==null){this.eventoDescripcion=''}else{this.eventoDescripcion=res[0].descripcion}
        if(res[0].lema==null){this.eventoLema=''}else{this.eventoLema=res[0].lema}
        if(res[0].objetivo==null){this.eventoObjetivo=''}else{this.eventoObjetivo=res[0].objetivo}
        this.loadRangoEvent()
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento'});
        console.error(err)
      });
    }
  }

  loadRangoEvent(){
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId, 1).subscribe((res: any) => {
      this.loadingCount--
      var fecha1 = moment(res[0].tiempo_inicio, 'yyyy-MM-DD').format('DD-MM-yyyy')
      var fecha2 = moment(res[0].tiempo_final, 'yyyy-MM-DD').format('DD-MM-yyyy')
      this.setFechaInicio(fecha1.slice(0,10));
      this.setFechaFinal(fecha2.slice(0,10));
      this.validarFormulario()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los datos de calendario de eventos'});
      console.error(err)
    });
  }

  validarNombre(){
    if(this.eventoNombre==''){
      this.validacionNombre=1;
    }else{
      this.validacionNombre=0;
    }
  }

  validarDescripcion(){
    console.log("this.eventoDescripcion",this.eventoDescripcion)
    if(this.eventoDescripcion!=''){
      if(this.eventoDescripcion.length >= 500){
        this.validacionDescripcion = 2;
      }else if(this.eventoDescripcion.length < 500){
        this.validacionDescripcion = 0;
      }
    }
  }

  validarLema(){
    console.log("this.eventoLema",this.eventoLema)
    if(this.eventoLema!=''){
      if(this.eventoLema.length >= 200){
        this.validacionLema = 2;
      }else if(this.eventoLema.length < 200){
        this.validacionLema = 0;
      }
    }
  }

  validarObjetivo(){
    console.log("this.eventoObjetivo",this.eventoObjetivo)
    if(this.eventoObjetivo!=''){
      if(this.eventoObjetivo.length >= 500){
        this.validacionObjetivo = 2;
      }else if(this.eventoObjetivo.length < 500){
        this.validacionObjetivo = 0;
      }
    }
  }

  validarFechas(){
    if(this.eventoFechaInicio=='' && this.eventoFechaFinal==''){
      this.validacionFechaInicio=1;
      this.validacionFechaFinal=1;
    }else if(this.eventoFechaInicio=='' && this.eventoFechaFinal!=''){
      this.validacionFechaInicio=1;
      this.validacionFechaFinal=3;
    }else if(this.eventoFechaInicio!='' && this.eventoFechaFinal==''){
      this.validacionFechaInicio=0;
      this.validacionFechaFinal=1;
    }else if(this.eventoFechaInicio!='' && this.eventoFechaFinal!=''){
      this.validacionFechaInicio=0;
      this.validacionFechaFinal=0;
      if(this.eventoFechaInicio >= this.eventoFechaFinal){
        this.validacionFechaInicio=2;
        this.validacionFechaFinal=2;
      }
    }
  }

  validarFormulario(){
    console.log("llega a actualizar",this.flag)
    if(this.flag=='guardar' || this.flag=='guardarCerrar' || this.flag=='actualizar' || this.flag=='actualizarCerrar'){
      console.log("llega a actualizar3")
      this.validarNombre();
      this.validarDescripcion();
      this.validarLema();
      this.validarObjetivo();
      this.validarFechas();
      this.validacionCompleta();
    }
  }

  validacionCompleta(){
    if(this.validacionNombre==0 &&
      this.validacionDescripcion==0 &&
      this.validacionLema==0 &&
      this.validacionObjetivo==0 &&
      this.validacionFechaInicio==0 &&
      this.validacionFechaFinal==0
    ){
      if(this.flag=='guardar'){
        this.crearEvento()
      }else if(this.flag=='guardarCerrar'){
        this.crearEvento()
      }else if(this.flag=='actualizar'){
        this.actualizarEvento()
      }else if(this.flag=='actualizarCerrar'){
        this.actualizarEvento()
      }
    }else{
      this.regreso='NoValido'
      this.resultadoGuardar()
    }
  }

  setFechaInicio(fecha: any) {
    this.showFechaInicio = fecha;
    this.eventoFechaInicio = this.dateStringToIso8601Start(fecha);
  }

  setFechaFinal(fecha: any) {
    this.showFechaFinal = fecha;
    this.eventoFechaFinal = this.dateStringToIso8601End(fecha);
  }

  dateStringToIso8601Start(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').startOf('day').valueOf())).toISOString()
  }

  dateStringToIso8601End(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').endOf('day').valueOf())).toISOString()
  }

  crearEvento(){
    this.loadingCount++
    this.eventService.addEvent(this.eventoNombre,1,this.cordinadorId).subscribe((res: any) => {
      this.loadingCount--
      this.eventoId=res;
      console.log("//evento creado",res);
      const descripcion = this.eventoDescripcion.slice(0,500);
      const lema = this.eventoLema.slice(0,200);
      const objetivo = this.eventoObjetivo.slice(0,500);
      this.agregarDetallesEvento(res,this.eventoNombre,1,descripcion,lema,objetivo);
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error en la parametrización del evento'});
      console.error(err)
    });
  }

  agregarDetallesEvento(eventoid:number,nombre:string,tipo:number,descripcion:string,lema:string,objetivo:string){
    this.loadingCount++
    this.eventService.updateEvent(eventoid,nombre,tipo,descripcion,lema,objetivo).subscribe((res: any) => {
      this.loadingCount--
      this.agregarFechasEvento()
      console.log("// datos actuializado");
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error en guardado de datos detallados del evento especificado'});
      console.error(err)
      this.regreso='Error'
      this.resultadoGuardar()
    });
  }

  agregarFechasEvento(){
    if(this.eventoFechaInicio!='' && this.eventoFechaFinal!=''){
      this.loadingCount++
      this.eventService.addDateRangeEvent(this.eventoFechaInicio,this.eventoFechaFinal,this.eventoId,1).subscribe((resI: any) => {
        this.loadingCount--
        this.agregarPresentacionEvento()
      }, (err) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al fijar las fechas del evento especificado'});
        console.error(err)
        this.regreso='Error'
        this.resultadoGuardar()
      });
    }
  }

  agregarPresentacionEvento(){
    this.loadingCount++
    this.eventService.addPresentacion(this.eventoId,1).subscribe((res: any) => {
      this.loadingCount--
      console.log("// presentación asignada");
      this.regresarResultado();
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al definir los tipos de presentación del evento especificado'});
      console.error(err)
      this.regreso='Error'
      this.resultadoGuardar()
    });
  }

  actualizarEvento(){
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId,1).subscribe((res: any) => {
      this.loadingCount--
      const ranges = res
      this.loadingCount++
      this.eventService.updateDateEvent(ranges[0].id,this.eventoFechaInicio,this.eventoFechaFinal,1).subscribe((resI: any) => {
        this.loadingCount--
        console.log("// fechas actualizadas");

        console.log("datos",this.eventoDescripcion,this.eventoLema,this.eventoObjetivo);
        this.loadingCount++
        this.eventService.updateEvent(this.eventoId,this.eventoNombre,1,this.eventoDescripcion,this.eventoLema,this.eventoObjetivo).subscribe((res: any) => {
          this.loadingCount--
          console.log("// evento actuializado");

          this.regresarResultado()

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

  regresarResultado(){
    if(this.regreso!='Error'){
      if(this.flag=='guardar'){
        this.regreso='EventoCreado'
        this.resultadoGuardar()
      }else if(this.flag=='guardarCerrar'){
        this.regreso='EventoCreadoCerrar'
        this.resultadoGuardar()
      }else if(this.flag=='actualizar'){
        this.regreso='EventoActualizado'
        this.resultadoGuardar()
      }else if(this.flag=='actualizarCerrar'){
        this.regreso='EventoActualizadoCerrar'
        this.resultadoGuardar()
      }
    }
  }

  resultadoGuardar(){
    var resultado = [{mensaje:this.regreso,eventoId:this.eventoId}]
    this.resultado.emit(resultado);
    this.flag='';
  }

}
