import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NotificacionesScicomService} from "../../../../services/scicom/notificaciones-scicom.service";
import {EventService} from "../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-new',
  templateUrl: './event-new.component.html',
  styleUrls: ['./event-new.component.css']
})
export class EventNewComponent implements OnInit{

  valoresRegreso:string = '';

  cordinadorId:number=0;

  tiposEvento:any[]=[];

  pasos:any[]=[];
  pasoActual:number=1;

  tipoEventoSelected:number=0;
  validEventoTipo:number=0;

  eventoId:number=0;

  variableApi:string="";
  variableForo:string="";
  variableEncuentro:string="";

  loadingCount:number=0;

  guardar:string='';

  constructor(private eventService: EventService,
              private authService: AuthService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadingCount++
    this.authService.getCurrentUserInfoFromBackend().subscribe((res: any) => {
      this.authService.setUserEnLocal(res)
      this.loadingCount--
      this.cordinadorId = (JSON.parse(localStorage.getItem('user_legacy_data')).id_institucion)
        ? (JSON.parse(localStorage.getItem('user_legacy_data')).id_institucion) : undefined
      this.loadTiposEvento()
    }, (err) => {
      this.loadingCount--
      console.error(err)
    })
  }

  ngOnDestroy(): void {
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.deleteEvent(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        window.location.href = "/scicom/event-list";
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al eliminar el evento temporal'});
        console.error(err)
      });
    }else{
      window.location.href = "/scicom/event-list";
    }
  }

  loadTiposEvento(){
    //se descomenta la siguiente linea al ser administrador para seleccionar institucion
    //this.cordinadorId = 1;
    this.loadingCount++
    this.eventService.getEventTypes(this.cordinadorId).subscribe((res: any) => {
      this.loadingCount--
      this.tiposEvento = res;
    },(err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los tipos de evento'});
      console.error(err)
    })
  }

  loadTipoEvento(){
    if(this.tipoEventoSelected==1){
      this.pasos=[{paso:1,titulo:'Datos generales'},
                  {paso:2,titulo:'Agregar campus'},
                  {paso:3,titulo:'Agregar tipos de evaluación'},
                  {paso:4,titulo:'Agregar tipos de pagos'},
                  {paso:5,titulo:'Agregar tipos de participación'},
                  {paso:6,titulo:'Agregar tipos de trabajo'},
                  {paso:7,titulo:'Agregar archivos'},
                  {paso:8,titulo:'Agregar colaboradores'}];
    }else if(this.tipoEventoSelected==3){
      this.pasos=[{paso:1,titulo:'Datos generales'},
                  {paso:2,titulo:'Agregar campus'},
                  {paso:3,titulo:'Agregar objetivo de desarrollo sostenible'},
                  {paso:4,titulo:'Agregar archivos'},
                  {paso:5,titulo:'Agregar colaboradores'}];
    }else if(this.tipoEventoSelected==4){
      this.pasos=[{paso:1,titulo:'Datos generales'},
                  {paso:2,titulo:'Agregar campus'},
                  {paso:3,titulo:'Agregar objetivo de desarrollo sostenible'},
                  {paso:4,titulo:'Agregar archivos'},
                  {paso:5,titulo:'Agregar colaboradores'}];
    }else{
      this.pasos=[];
    }
  }

  validarTipoEvento(){
    if(this.tipoEventoSelected==0){this.validEventoTipo=1;
    }else{this.validEventoTipo=0;}
  }

  changeTipoEvento(){
    this.loadTipoEvento();
    this.validarTipoEvento();
  }

  resultadoGuardar(resultado:any[]){
    const mensaje=resultado[0].mensaje
    this.eventoId=resultado[0].eventoId
    if(mensaje=='NoValido'){
      this.guardar='contendo1'
    }else if(mensaje=='EventoCreado'){
      this.guardar='contendo2'
      this.pasoActual++
    }else if(mensaje=='EventoCreadoCerrar'){
      this.guardar='contendo3'
      this.cerrarAlGuardar()
    }else if(mensaje=='EventoActualizado'){
      this.pasoActual++
      this.guardar='contendo4'
    }else if(mensaje=='EventoActualizadoCerrar'){
      this.guardar='contendo5'
      this.cerrarAlGuardar()
    }else if(mensaje=='Error'){
      this.guardar='contendo6'
      this.onErrorSavingAllEventData()
    }
    console.log("resultado",resultado)
  }

  resultadoGuardarForo(resultado:any[]){
    const mensaje=resultado[0].mensaje
    this.eventoId=resultado[0].eventoId
    if(mensaje=='NoValido'){
      this.variableForo='contendo1'
    }else if(mensaje=='EventoCreado'){
      this.variableForo='contendo2'
      this.pasoActual++
    }else if(mensaje=='EventoCreadoCerrar'){
      this.variableForo='contendo3'
      this.cerrarAlGuardar()
    }else if(mensaje=='EventoActualizado'){
      this.variableForo='contendo4'
      this.pasoActual++
    }else if(mensaje=='EventoActualizadoCerrar'){
      this.variableForo='contendo5'
      this.cerrarAlGuardar()
    }else if(mensaje=='Error'){
      this.variableForo='contendo6'
      this.onErrorSavingAllEventData()
    }
    console.log("resultadoForo",resultado)
  }

  resultadoGuardarEncuentro(resultado:any[]){
    const mensaje=resultado[0].mensaje
    this.eventoId=resultado[0].eventoId
    if(mensaje=='NoValido'){
      this.variableEncuentro='contendo1'
    }else if(mensaje=='EventoCreado'){
      this.variableEncuentro='contendo2'
      this.pasoActual++
    }else if(mensaje=='EventoCreadoCerrar'){
      this.variableEncuentro='contendo3'
      this.cerrarAlGuardar()
    }else if(mensaje=='EventoActualizado'){
      this.variableEncuentro='contendo4'
      this.pasoActual++
    }else if(mensaje=='EventoActualizadoCerrar'){
      this.variableEncuentro='contendo5'
      this.cerrarAlGuardar()
    }else if(mensaje=='Error'){
      this.variableEncuentro='contendo6'
      this.onErrorSavingAllEventData()
    }
    console.log("resultadoEncuentro",resultado)
  }

  cerrarAlGuardar(){
    Swal.fire({
      icon: 'success',
      text: 'El evento se creó correctamente',
      confirmButtonColor: '#0a70bd',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.notificacionesScicomService.sendNotificationAddEvento(this.eventoId).subscribe((res:any) => {
          this.loadingCount--
          console.info("sendNotificationAddEvento")
          window.location.href = "/scicom/event-list";
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
          window.location.href = "/scicom/event-list";
        });
      }
    })
  }

  onErrorSavingAllEventData() {
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.deleteEvent(this.eventoId).subscribe(() => {
        this.loadingCount--
        console.info("Evento temporal eliminado");
        window.location.href = "/scicom/event-new";
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al eliminar el evento temporal'});
        console.error(err)
        window.location.href = "/scicom/event-new";
      });
    }else{
      window.location.href = "/scicom/event-new";
    }
  }

  changeSeccion(navegacion?:string){
    if(navegacion=='next'){
      if(this.eventoId==0){
        if(this.pasoActual==1){
          if(this.tipoEventoSelected==1){
            this.guardar='guardar';
          }else if(this.tipoEventoSelected==3){
            this.variableForo='guardar';
          }else if(this.tipoEventoSelected==4){
            this.variableEncuentro='guardar';
          }
        }else{
          this.pasoActual++
        }
      }else{
        if(this.pasoActual==1){
          if(this.tipoEventoSelected==1){
            this.guardar='actualizar';
          }else if(this.tipoEventoSelected==3){
            this.variableForo='actualizar';
          }else if(this.tipoEventoSelected==4){
            this.variableEncuentro='actualizar';
          }
        }else{
          this.pasoActual++
        }
      }
    }else if(navegacion=='prev'){
      this.pasoActual--
    }
  }

  finalizarEvento(){
    if(this.eventoId==0){
      if(this.tipoEventoSelected==1){
        this.guardar='guardarCerrar';
      }else if(this.tipoEventoSelected==3){
        this.variableForo='guardarCerrar';
      }else if(this.tipoEventoSelected==4){
        this.variableEncuentro='guardarCerrar';
      }
    }else{
      if(this.tipoEventoSelected==1){
        this.guardar='actualizarCerrar';
      }else if(this.tipoEventoSelected==3){
        this.variableForo='actualizarCerrar';
      }else if(this.tipoEventoSelected==4){
        this.variableEncuentro='actualizarCerrar';
      }
    }
  }
}

