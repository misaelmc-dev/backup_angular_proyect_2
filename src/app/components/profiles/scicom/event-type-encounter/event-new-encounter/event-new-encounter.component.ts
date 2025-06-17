import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import Swal from "sweetalert2";
import * as moment from "moment/moment";

@Component({
  selector: 'app-event-new-encounter',
  templateUrl: './event-new-encounter.component.html',
  styleUrls: ['./event-new-encounter.component.css']
})
export class EventNewEncounterComponent implements OnInit {

  @Input() variableEncuentro = '';
  @Input() eventoId = 0;
  @Input() cordinadorId = 0;
  @Output() resultado = new EventEmitter<any>();

  regreso:string = '';

  tipoRangoTiempo:string='rangEvent';
  idtipoRangoTiempo:number=0;
  idTipoEvento:number=4;

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
  campus:any[]=[];
  eventoCampusSelected:number=0;
  eventoCampusId:number=0;
  validacionCampus:number=0;
  eventoNivelDesarrollo:string='';
  validacionNivel:number=0;
  loadingCount:number=0;

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,) { }

  ngOnInit(): void {
    if(this.eventoId!=0){
      this.loadEvento()
    }
    this.loadCampus()
    this.loadRangosTiempo('sinGuardar')
  }

  ngOnChanges(changes:SimpleChanges){
    //console.log("changes",changes)
    this.variableEncuentro=changes['variableEncuentro'].currentValue;
    //console.log("Encuentro:",this.variableEncuentro);
    if(this.eventoId==0){
      this.validarFormulario()
    }
    if(this.variableEncuentro=='actualizar'){
      this.validarFormulario()
    }
    if(this.variableEncuentro=='actualizarCerrar'){
      this.validarFormulario()
    }
  }

  loadRangosTiempo(guardado?:string){
    this.loadingCount++
    this.eventService.consultaRangoTiempo(this.tipoRangoTiempo).subscribe((resRT: any) => {
      this.loadingCount--
      this.idtipoRangoTiempo=resRT[0].id
      if(guardado!='sinGuardar'){
        this.loadRangoEvent()
      }
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento'});
      console.error(err)
    });
  }

  loadEvento(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.eventoNombre=res[0].nombre;
        if(res[0].descripcion==null){this.eventoDescripcion=''}else{this.eventoDescripcion=res[0].descripcion}
        if(res[0].lema==null){this.eventoLema=''}else{this.eventoLema=res[0].lema}
        if(res[0].objetivo==null){this.eventoObjetivo=''}else{this.eventoObjetivo=res[0].objetivo}
        if(res[0].niv_desarr_for_enc_unit_uvm==null){this.eventoNivelDesarrollo=''}else{this.eventoNivelDesarrollo=res[0].niv_desarr_for_enc_unit_uvm}
        this.loadRangosTiempo()
        this.loadCampusAsign();
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento'});
        console.error(err)
      });
    }
  }

  loadCampus(){
    this.loadingCount++
    this.eventService.getCampusList(this.cordinadorId).subscribe((resCamp: any) => {
      this.loadingCount--
      this.campus=resCamp;
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
        this.eventoCampusSelected=ca.id
        this.eventoCampusId=ca.id
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus asociados al evento especificado'});
      console.error(err)
    });
  }

  loadRangoEvent(){
    console.log("this.idtipoRangoTiempo",this.idtipoRangoTiempo)
    this.loadingCount++
    this.eventService.getRangeEventByEvents(this.eventoId, this.idtipoRangoTiempo).subscribe((res: any) => {
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
    if(this.eventoDescripcion!=''){
      if(this.eventoDescripcion.length >= 500){
        this.validacionDescripcion = 2;
      }else if(this.eventoDescripcion.length < 500){
        this.validacionDescripcion = 0;
      }
    }
  }

  validarLema(){
    if(this.eventoLema!=''){
      if(this.eventoLema.length >= 200){
        this.validacionLema = 2;
      }else if(this.eventoLema.length < 200){
        this.validacionLema = 0;
      }
    }
  }

  validarObjetivo(){
    if(this.eventoObjetivo!=''){
      if(this.eventoObjetivo.length >= 500){
        this.validacionObjetivo = 2;
      }else if(this.eventoObjetivo.length < 500){
        this.validacionObjetivo = 0;
      }
    }
  }

  validarFechas(){
    if (this.eventoFechaInicio == '' && this.eventoFechaFinal == '') {
      this.validacionFechaInicio = 1;
      this.validacionFechaFinal = 1;
    } else if (this.eventoFechaInicio == '' && this.eventoFechaFinal != '') {
      this.validacionFechaInicio = 1;
      this.validacionFechaFinal = 3;
    } else if (this.eventoFechaInicio != '' && this.eventoFechaFinal == '') {
      this.validacionFechaInicio = 0;
      this.validacionFechaFinal = 1;
    } else if (this.eventoFechaInicio != '' && this.eventoFechaFinal != '') {
      this.validacionFechaInicio = 0;
      this.validacionFechaFinal = 0;
      if (this.eventoFechaInicio >= this.eventoFechaFinal) {
        this.validacionFechaInicio = 2;
        this.validacionFechaFinal = 2;
      }
    }
  }

  validarCampus(){
    if(this.eventoCampusSelected!=0){
      this.validacionCampus = 0;
    }else{
      this.validacionCampus = 1;
    }
  }

  validarNivel(){
    if(this.eventoNivelDesarrollo!=''){
      this.validacionNivel = 0;
    }else{
      this.validacionNivel = 1;
    }
  }

  validarFormulario(){
    if(this.variableEncuentro=='guardar' || this.variableEncuentro=='guardarCerrar' || this.variableEncuentro=='actualizar' || this.variableEncuentro=='actualizarCerrar'){
      this.validarNombre();
      this.validarDescripcion();
      this.validarLema();
      this.validarObjetivo();
      this.validarFechas();
      this.validarCampus();
      this.validarNivel();
      this.validacionCompleta();
    }
  }

  validacionCompleta(){
    if(this.validacionNombre==0 &&
      this.validacionDescripcion==0 &&
      this.validacionLema==0 &&
      this.validacionObjetivo==0 &&
      this.validacionFechaInicio==0 &&
      this.validacionFechaFinal==0 &&
      this.validacionNivel==0
    ){
      if(this.variableEncuentro=='guardar'){
        this.crearEvento()
      }else if(this.variableEncuentro=='guardarCerrar'){
        this.crearEvento()
      }else if(this.variableEncuentro=='actualizar'){
        this.actualizarEvento()
      }else if(this.variableEncuentro=='actualizarCerrar'){
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
    this.eventService.addEvent(this.eventoNombre,this.idTipoEvento,this.cordinadorId).subscribe((res: any) => {
      this.loadingCount--
      this.eventoId=res;
      //console.log("//evento creado",res);
      const descripcion = this.eventoDescripcion.slice(0,500);
      const lema = this.eventoLema.slice(0,200);
      const objetivo = this.eventoObjetivo.slice(0,500);
      this.agregarDetallesEvento(res,this.eventoNombre,this.idTipoEvento,descripcion,lema,objetivo);
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error en la parametrización del evento'});
      console.error(err)
    });
  }

  agregarDetallesEvento(eventoid:number,nombre:string,tipo:number,descripcion:string,lema:string,objetivo:string){
    this.loadingCount++
    this.eventService.updateEvent(eventoid,nombre,tipo,descripcion,lema,objetivo,0,this.eventoNivelDesarrollo).subscribe((res: any) => {
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
      this.eventService.addDateRangeEvent(this.eventoFechaInicio,this.eventoFechaFinal,this.eventoId,this.idtipoRangoTiempo).subscribe((resI: any) => {
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
    this.eventService.getRangeEventByEvents(this.eventoId,this.idtipoRangoTiempo).subscribe((res: any) => {
      this.loadingCount--
      const ranges = res
      this.loadingCount++
      this.eventService.updateDateEvent(ranges[0].id,this.eventoFechaInicio,this.eventoFechaFinal,this.idtipoRangoTiempo).subscribe((resI: any) => {
        this.loadingCount--
        console.log("// fechas actualizadas");
        console.log("datos",this.eventoDescripcion,this.eventoLema,this.eventoObjetivo);
        this.loadingCount++
        this.eventService.updateEvent(this.eventoId,this.eventoNombre,this.idTipoEvento,this.eventoDescripcion,this.eventoLema,this.eventoObjetivo,0,this.eventoNivelDesarrollo).subscribe((res: any) => {
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
      if(this.variableEncuentro=='guardar'){
        this.regreso='EventoCreado'
        this.resultadoGuardar()
      }else if(this.variableEncuentro=='guardarCerrar'){
        this.regreso='EventoCreadoCerrar'
        this.resultadoGuardar()
      }else if(this.variableEncuentro=='actualizar'){
        this.regreso='EventoActualizado'
        this.resultadoGuardar()
      }else if(this.variableEncuentro=='actualizarCerrar'){
        this.regreso='EventoActualizadoCerrar'
        this.resultadoGuardar()
      }
    }
  }

  resultadoGuardar(){
    var resultado = [{mensaje:this.regreso,eventoId:this.eventoId}]
    this.resultado.emit(resultado);
    this.variableEncuentro='';
  }

}
