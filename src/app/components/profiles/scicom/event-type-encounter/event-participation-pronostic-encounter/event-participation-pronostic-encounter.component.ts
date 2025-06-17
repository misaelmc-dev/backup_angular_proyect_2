import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {TrabajoScicomService} from "../../../../../services/scicom/trabajo-scicom.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-participation-pronostic-encounter',
  templateUrl: './event-participation-pronostic-encounter.component.html',
  styleUrls: ['./event-participation-pronostic-encounter.component.css']
})
export class EventParticipationPronosticEncounterComponent implements OnInit{

  @Input() eventoId:number = 0;
  @Input() participacionId:number = 0;
  @Input() guardar = '';
  @Output() resultado = new EventEmitter<any>();

  tipoEventoId:number=4;

  cartelesObjetivoId:number=0;
  cartelesDescripcion:string="";
  cartelesValorObjetivoGuardado:number;
  cartelesValorObjetivo:number;
  cartelesTipo:string="pronostico";
  cartelesIndicadorId:number=0;
  cartelesRealValueUrl:string="";
  validCarteles:number=0;

  estudiantesObjetivoId:number=0;
  estudianteDescripcion:string="";
  estudianteValorObjetivoGuardado:number;
  estudianteValorObjetivo:number;
  estudianteTipo:string="pronostico";
  estudianteIndicadorId:number=0;
  estudianteRealValueUrl:string="";
  validEstudiantes:number=0;

  indicadores:any[]=[];
  objetivosIndicadores:any[]=[];
  tiposTrabajo:any[]=[];

  loadingCount:number=0;

  constructor(private eventService: EventService,
              private trabajoScicomService: TrabajoScicomService) { }

  ngOnInit(): void {
    this.loadIndicadores();
    this.loadObjetivos();
    this.loadTiposTrabajo();
  }

  ngOnChanges(changes:SimpleChanges){
    console.log("changes",changes)
    if(changes['guardar']){
      this.guardar=changes['guardar'].currentValue;
    }
    console.log("this.guardar",this.guardar)
    if(this.guardar=='Si'){
      this.validarFormulario()
    }
  }

  loadTiposTrabajo(){
    this.loadingCount++
    this.trabajoScicomService.getTiposTrabajo(this.eventoId,this.tipoEventoId).subscribe((resTipTrab: any) => {
      this.loadingCount--
      this.tiposTrabajo=resTipTrab;
      //console.warn('TiposTRAB Cargados')
      //console.warn(JSON.stringify(this.tiposTrabajo))
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo la lista de tipos de trabajo'});
      console.error(err)
    });
  }

  loadIndicadores(){
    this.loadingCount++
    this.eventService.getIndicadores().subscribe((resInd: any) => {
      this.loadingCount--
      this.indicadores=resInd;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo la lista de indicadores'});
      console.error(err)
    });
  }

  loadObjetivos(){
    this.loadingCount++
    this.eventService.getObjetivosIndicadores(this.eventoId).subscribe((resObj: any) => {
      this.loadingCount--
      var auxObjetivosParticipacion = [];
      for(let ro of resObj){
        if(ro.id_participacion==this.participacionId){
          auxObjetivosParticipacion.push(ro)
        }
      }
      this.objetivosIndicadores=auxObjetivosParticipacion;
      for(let aop of auxObjetivosParticipacion){
        if(aop.id_indicador==11){
          this.cartelesObjetivoId=aop.id;
          this.cartelesValorObjetivoGuardado=aop.valor_objetivo;
          this.cartelesValorObjetivo=aop.valor_objetivo;
        }
        if(aop.id_indicador==4){
          this.estudiantesObjetivoId=aop.id
          this.estudianteValorObjetivoGuardado=aop.valor_objetivo;
          this.estudianteValorObjetivo=aop.valor_objetivo;
        }
      }
      //console.log("auxObjetivosParticipacion",auxObjetivosParticipacion)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo la lista de indicadores'});
      console.error(err)
    });
  }

  validarCarteles(){
    if(this.cartelesValorObjetivo==null){
      this.validCarteles=1;
    }else if(this.cartelesValorObjetivo<=0){
      this.validCarteles=2;
    }else{
      this.validCarteles=0;
    }
  }

  validarEstudiantes(){
    if(this.estudianteValorObjetivo==null){
      this.validEstudiantes=1;
    }else if(this.estudianteValorObjetivo<=0){
      this.validEstudiantes=2;
    }else{
      this.validEstudiantes=0;
    }
  }

  validarFormulario(){
    this.validarCarteles();
    this.validarEstudiantes();
    if(this.validCarteles==0 && this.validEstudiantes==0){
      this.savePronostics();
      console.log("paso")
    }else{
      this.resultadoGuardar("SinValoresGuardar");
      console.log("No paso")
    }
  }

  savePronostics(){
    if(this.cartelesObjetivoId!=0 || this.estudiantesObjetivoId!=0){
      this.updatePronosticsCarteles();
    }else{
      this.savePronosticsCarteles()
      console.log("paso savePronostics")
    }
  }

  savePronosticsCarteles(){
    if(this.cartelesValorObjetivo!=0 && this.cartelesValorObjetivo!=undefined) {
      for (let ind of this.indicadores) {
        if (ind.codigo_interno == "cantCartEncUtec") {
          this.cartelesIndicadorId = ind.id;
        }
      }
      this.cartelesDescripcion="descripcion de cartel";
      const idsTiposTrabajos = [5, 6]/*this.tiposTrabajo.map((value: any) => value.id_tipo_trabajo)*/
      this.cartelesRealValueUrl = "/api/scicom/trabajos/statistics?idsPart=" + this.participacionId + "&idsTipsTrab=" + encodeURIComponent(idsTiposTrabajos.join(' ')) + "";
      this.loadingCount++
      this.eventService.addObjsIndicador(this.cartelesDescripcion, this.cartelesValorObjetivo, this.cartelesTipo,
        this.participacionId, this.cartelesIndicadorId, this.cartelesRealValueUrl).subscribe((resCarteles: any) => {
        this.loadingCount--
        this.savePronosticsEstudiantes();
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregaron los pronósticos al evento'});
        console.error(err)
      });
    }else{
      this.savePronosticsEstudiantes();
    }
  }

  savePronosticsEstudiantes(){
    if(this.estudianteValorObjetivo!=0 && this.estudianteValorObjetivo!=undefined){
      for(let ind of this.indicadores){
        if(ind.codigo_interno=="cantAutTrabCartEncUtec"){
          this.estudianteIndicadorId=ind.id;
        }
      }
      this.estudianteDescripcion="Descripción de estudiante/autor";
      const idsTiposTrabajos = [5, 6]/*this.tiposTrabajo.map((value: any) => value.id_tipo_trabajo)*/
      this.estudianteRealValueUrl="/api/scicom/autorestrabajo/statistics?idsPart="+this.participacionId+"&idsTipsTrab="+encodeURIComponent(idsTiposTrabajos.join(' '))+"";
      this.loadingCount++
      this.eventService.addObjsIndicador(this.estudianteDescripcion,this.estudianteValorObjetivo,this.estudianteTipo,
        this.participacionId,this.estudianteIndicadorId,this.estudianteRealValueUrl).subscribe((resEstudiante: any) => {
        this.loadingCount--
        this.resultadoGuardar("GuardadoCorrecto");
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se agregaron los pronósticos al evento'});
        console.error(err)
      });
    }else{
      this.resultadoGuardar("SinValoresGuardar");
    }
  }

  updatePronosticsCarteles(){
    if(this.cartelesValorObjetivo!=0 && this.cartelesValorObjetivo!=undefined && this.cartelesObjetivoId!=0){
      this.cartelesDescripcion="Descripción de cartel";
      this.cartelesTipo="pronostico";
      this.loadingCount++
      this.eventService.updateObjsIndicador(this.cartelesObjetivoId,this.cartelesDescripcion,this.cartelesValorObjetivo,this.cartelesTipo).subscribe((resCarteles: any) => {
        this.loadingCount--
        this.updatePronosticsEstudiantes();
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregaron los pronósticos al evento'});
        console.error(err)
      });
    }else{
      this.updatePronosticsEstudiantes();
    }
  }

  updatePronosticsEstudiantes(){
    if(this.estudianteValorObjetivo!=0 && this.estudianteValorObjetivo!=undefined && this.estudiantesObjetivoId!=0){
      this.estudianteDescripcion="Descripcion de estudiante/autor";
      this.estudianteTipo="pronostico";
      this.loadingCount++
      this.eventService.updateObjsIndicador(this.estudiantesObjetivoId,this.estudianteDescripcion,this.estudianteValorObjetivo,this.estudianteTipo).subscribe((resEstudiante: any) => {
        this.loadingCount--
        this.resultadoGuardar("ActializacionCorrecta");
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se agregaron los pronósticos al evento'});
        console.error(err)
      });
    }else{
      this.resultadoGuardar("SinValoresGuardar");
    }
  }

  resultadoGuardar(valor?:string){
    this.resultado.emit(valor);
    this.guardar='';
  }
}
