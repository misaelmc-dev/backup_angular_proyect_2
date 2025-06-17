import {Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../../../../../services/event.service";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import * as moment from "moment/moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-participation-new-forum',
  templateUrl: './event-participation-new-forum.component.html',
  styleUrls: ['./event-participation-new-forum.component.css']
})
export class EventParticipationNewForumComponent implements OnInit {

  cordId?: number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?: number = Number(this.route.snapshot.paramMap.get('idevent'));
  userId?: number = Number(this.route.snapshot.paramMap.get('iduser'));

  usuarioId:number=0;
  usuarioNombre:string="";
  usuarioCorreo:string="";
  usuarioNoCelular:number;
  validNoCelular:number=0;
  usuarioNoEmpleado:number;
  validNoEmpleado:number=0;
  fechaInicio:any="";
  validFechaInicio:number=0;
  showFechaInicio:any="";
  fechaFinal:any="";
  validFechaFinal:number=0;
  showFechaFinal:any="";
  campusSelected:number=0;
  campusTotal:any[]=[];
  campusEvento:any[]=[];
  campusUsuario:any[]=[];
  campus:any[]=[];
  campusDisponibles:any[]=[];
  validCampus:number=0;

  eventoFechaInicio:any="";
  eventoFechaFinal:any="";

  idtipoRangoTiempo:number=8;

  pasos:any[]=[{paso:1,titulo:'Datos de registro'},
               {paso:2,titulo:'Pronósticos'},
               {paso:3,titulo:'Agregar evidencia'}];
  pasoActual:number=1;
  pasoGuardar:string='Mantener';

  participacionId:number=0;

  tipoParticipacion:number=3;

  guardar:string="No";

  loadingCount:number=0;

  constructor(private eventService:EventService,
              private notificacionesScicomService:NotificacionesScicomService,
              private permisosScicomService:PermisosScicomService,
              private route:ActivatedRoute,) { }

  ngOnInit(): void {
    this.loadUsuario();
    this.loadEvento();
    this.loadRangeEvent();
  }

  loadUsuario(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getUsuariosEvento(this.eventoId).subscribe((resU: any) => {
        this.loadingCount--
        for(let u of resU){
          if(u.id==this.userId){
            this.usuarioId = u.id;
            this.usuarioNombre = u.user.name;
            this.usuarioCorreo = u.user.email;
            this.campusUsuario = u.campus;
          }
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los usuarios scicom del evento especificado'});
        console.error(err)
      });
    }
  }

  loadEvento(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.campusEvento=res[0].campus;
        this.loadCampus();
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los datos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadRangeEvent(){
    this.loadingCount++
    this.eventService.getRangeEventList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      for(let fech of res){
        if(fech.id_tipo_rango == 1){
          var inicio = moment(fech.tiempo_inicio,'yyyy-MM-DD').format('DD-MM-yyyy');
          var final = moment(fech.tiempo_final,'yyyy-MM-DD').format('DD-MM-yyyy');
          this.eventoFechaInicio = this.dateStringToIso8601Start(inicio);
          this.eventoFechaFinal = this.dateStringToIso8601End(final);
        }
      }
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas del evento especificado'});
      console.error(err)
    })
  }

  loadCampus(){
    this.loadingCount++
    this.eventService.getCampusList(this.cordId).subscribe((resC: any) => {
      this.loadingCount--
      let camp = [];
      for(let c of this.campusEvento){
        for(let r of resC){
          if(r.id == c.id){
            camp.push(r)
          }
        }
      }
      this.campusTotal=camp;
      this.campusDisponibles=camp;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus de la institución especificada'});
      console.error(err)
    });
  }

  agregarCampus(){
    var auxCampus = this.campusDisponibles;
    for(let ct of this.campusTotal){
      if(ct.id==this.campusSelected){
        this.campus.push(ct)
      }
    }
    this.campusDisponibles = auxCampus.filter( (camp: any) => camp.id != this.campusSelected)
    this.campusSelected=0;
    this.validarCampus();
  }

  removerCampus(idCampus:number){
    var auxCampus = this.campus;
    for(let ct of this.campusTotal){
      if(ct.id==idCampus){
        this.campusDisponibles.push(ct)
      }
    }
    this.campus = auxCampus.filter( (camp: any) => camp.id != idCampus)
    this.campusSelected=0;
    this.validarCampus();
  }

  validarNoEmpleado(){
    if(this.usuarioNoEmpleado>9999999999){
      this.validNoEmpleado = 2
    }else if(this.usuarioNoEmpleado==0){
      this.validNoEmpleado = 1
    }else if(!this.usuarioNoEmpleado){
      this.validNoEmpleado = 1
    }else{
      this.validNoEmpleado = 0
    }
  }

  validarNoCelular(){
    if(this.usuarioNoCelular<999999999){
      this.validNoCelular = 2
    }else if(this.usuarioNoCelular>9999999999){
      this.validNoCelular = 2
    }else if(this.usuarioNoCelular==0){
      this.validNoCelular = 1
    }else if(!this.usuarioNoCelular){
      this.validNoCelular = 1
    }else{
      this.validNoCelular = 0
    }
  }

  validarFechas(){
    if(this.fechaInicio=='' && this.fechaFinal==''){
      this.validFechaInicio=1;
      this.validFechaFinal=1;
    }else if(this.fechaInicio=='' && this.fechaFinal!=''){
      this.validFechaInicio=1;
      this.validFechaFinal=3;
    }else if(this.fechaInicio!='' && this.fechaFinal==''){
      this.validFechaInicio=0;
      this.validFechaFinal=1;
    }else if(this.fechaInicio!='' && this.fechaFinal!=''){
      //console.warn("Fechas evento",this.eventoFechaInicio,this.eventoFechaFinal)
      //console.warn("Fechas",this.fechaInicio,this.fechaFinal)
      this.validFechaInicio = 0;
      this.validFechaFinal = 0;
      if(this.eventoFechaInicio > this.fechaInicio){
        this.validFechaInicio = 4;
      }else{
        this.validFechaInicio = 0;
      }
      if(this.fechaFinal > this.eventoFechaFinal){
        this.validFechaFinal = 4;
      }else{
        this.validFechaFinal = 0;
      }
      if(this.fechaInicio >= this.fechaFinal){
        this.validFechaInicio = 2;
        this.validFechaFinal = 2;
      }
    }
  }

  validarCampus(){
    if(this.campus.length<=0){
      this.validCampus=1;
    }else{
      this.validCampus=0;
    }
  }

  validarFormulario(){
    this.validarNoEmpleado();
    this.validarNoCelular();
    this.validarFechas();
    this.validarCampus();
    if(this.validNoEmpleado==0 &&
      this.validNoCelular==0 &&
      this.validFechaInicio==0 &&
      this.validFechaFinal==0 &&
      this.validCampus==0)
    {
      if(this.participacionId==0){
        this.crearParticipacion();
        this.pasoActual++ ;
      }else{
        this.actualizarParticipacion();
        this.pasoActual++ ;
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

  crearParticipacion(){
    this.loadingCount++
    this.eventService.addParticipation(this.tipoParticipacion,this.usuarioId).subscribe((resPart: any) => {
      this.loadingCount--
      this.loadingCount++
      this.notificacionesScicomService.sendNotificationAddParticipForUvmEncUtecEvento(resPart).subscribe((res:any) => {
        this.loadingCount--
        console.info("NotificationAddParticipForUvmEncUtecEvento")
      }, (err:any) =>{
        this.loadingCount--
        console.error(err)
      });
      this.participacionId=resPart;
      //console.log("participacionId",this.participacionId)
      this.eventService.updateUser(this.usuarioId,this.usuarioNoEmpleado,this.usuarioNoCelular).subscribe((res:any) => {
        this.ligarCampusToUser()
        this.addRango()
      }, (err:any) =>{
        this.loadingCount--
        console.info("No se agregó el agrego el numero de usuario y celular al usuario scicom")
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se generó el registro con el tipo y usuario indicados'});
      console.error(err)
    });
  }

  ligarCampusToUser(){
    const idsCampus = this.campus.map((value: any) => value.id)
    this.loadingCount++
    this.eventService.addCampusToUserParticipation(this.usuarioId,idsCampus).subscribe((res: any) => {
      this.loadingCount--
      console.log("campus agregado");
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se agregó el campus al usuario scicom especificado'});
      console.error(err)
    });
  }

  addRango(){
    this.loadingCount++
    this.eventService.addRangeDate(this.fechaInicio,this.fechaFinal,this.eventoId,this.idtipoRangoTiempo,this.participacionId).subscribe((resI: any) => {
      this.loadingCount--
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al guardar las fechas del registro'});
      console.error(err)
    });
  }

  actualizarParticipacion(){
    this.eventService.updateUser(this.usuarioId,this.usuarioNoEmpleado,this.usuarioNoCelular).subscribe((res:any) => {
      this.actualizarCampusToUser()
      this.actualizarRango()
    }, (err:any) =>{
      this.loadingCount--
      console.info("No se agregó el agrego el numero de usuario y celular al usuario scicom")
      console.error(err)
    });
  }

  actualizarCampusToUser(){
    this.loadingCount++
    this.eventService.getUsuariosEvento(this.eventoId).subscribe((resU: any) => {
      this.loadingCount--
      for(let u of resU){
        if(u.id==this.userId){
          this.campusUsuario = u.campus;
        }
      }
      if(this.campusUsuario.length>0){
        const idsCampus = this.campusUsuario.map((value: any) => value.id)
        this.loadingCount++
        this.eventService.removeCampusToUserParticipation(this.usuarioId,idsCampus).subscribe((res: any) => {
          this.loadingCount--
          console.log("campus actualizados");
          this.ligarCampusToUser()
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se agregó el campus al usuario scicom especificado'});
          console.error(err)
        });
      }
      //console.warn("resU",resU)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los usuarios scicom del evento especificado'});
      console.error(err)
    });
  }

  actualizarRango(){
    this.loadingCount++
    this.eventService.getRangeEventByParticipation(this.eventoId,this.participacionId,this.idtipoRangoTiempo).subscribe((resRange: any) => {
      this.loadingCount--
      const ranges = resRange
      this.loadingCount++
      this.eventService.updateDateEvent(ranges[0].id,this.fechaInicio,this.fechaFinal,this.idtipoRangoTiempo).subscribe((resI: any) => {
        this.loadingCount--
        console.log("fechas aactualizadas");
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

  changeSeccion(navegacion?:string){
    this.guardar="No";
    this.pasoGuardar='Mantener';
    if(navegacion=='next'){
      if(this.pasoActual==1){
        this.validarFormulario();
      }else if(this.pasoActual==2){
        this.guardar="Si";
        this.pasoGuardar='Avanzar';
      }else{
        this.pasoActual++ ;
      }
    }else if('prev'){
      if(this.pasoActual==2){
        this.guardar="Si";
        this.pasoGuardar='Regresar';
      }else{
        this.pasoActual--;
      }
    }
  }

  resultadoGuardar(result:any){
    if(result=='GuardadoCorrecto'){
      this.guardar='contendo1';
      console.log("Guardado Correctamente Predicciones");
      if(this.pasoGuardar=='Avanzar'){
        this.pasoActual++
      }else if(this.pasoGuardar=='Regresar'){
        this.pasoActual--
      }
    }else if(result=='SinValoresGuardar'){
      this.guardar='contendo2'
      console.log("No tiene datos que guardar");
    }else if(result=='ActializacionCorrecta'){
      this.guardar='contendo3'
      console.log("Se actualizo");
      if(this.pasoGuardar=='Avanzar'){
        this.pasoActual++
      }else if(this.pasoGuardar=='Regresar'){
        this.pasoActual--
      }
    }
  }

}
