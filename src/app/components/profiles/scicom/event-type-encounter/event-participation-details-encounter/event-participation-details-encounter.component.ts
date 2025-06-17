import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {EventService} from "../../../../../services/event.service";
import {AuthService} from "../../../../../services/auth.service";


@Component({
  selector: 'app-event-participation-details-encounter',
  templateUrl: './event-participation-details-encounter.component.html',
  styleUrls: ['./event-participation-details-encounter.component.css']
})
export class EventParticipationDetailsEncounterComponent implements OnInit {

  eventoId?:number = Number(this.route.snapshot.paramMap.get('idevent'));
  participacionId?:number = Number(this.route.snapshot.paramMap.get('idpart'));

  cordId:number;

  currentUsuarioScicomId:number;
  campusList:any[]=[];
  participacion:any[]=[];

  usuario:string;
  correo:string;
  numeroCelular:number;
  numeroEmpleado:number;
  campus:any[];
  fechaInicio:string;
  fechaFin:string;
  pronosticoCarteles:number;
  pronosticoeEstudiantes:number;

  loadingCount:number=0;

  constructor(private eventService: EventService,
              public authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadEventos();
    this.loadObjetivos();
  }

  loadEventos(){
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      const idRorCoord = res[0].rors_editoras.filter((value: any) => value.pivot.creador == true)[0].id
      this.loadingCount++
      if (idRorCoord) {
        this.eventService.getInstitucionList([idRorCoord]).subscribe((res: any) => {
          this.loadingCount--
          this.cordId = res[0].id
          this.loadParticipation();
          this.loadCurrentScicomUser();
          this.loadCampus();
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'Error al cargar la institución creadora del evento'});
          console.error(err)
        });
      }
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  loadParticipation(){
    this.loadingCount++
    this.eventService.getParticipationById(this.eventoId,this.participacionId).subscribe((resPart: any) => {
      this.loadingCount--
      this.participacion = resPart;
      //console.log("this.participacion",this.participacion)
      this.loadUsuariosEvento(resPart[0].id_usuario);
      this.loadRangeEvent()
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron las participaciones del evento especificado'});
      console.error(err)
    });
  }

  loadCurrentScicomUser() {
    const user = this.authService.getUserEnLocal()
    this.currentUsuarioScicomId = user.id;
  }

  loadUsuariosEvento(usuarioId:number){
    //console.log("usuarioId",usuarioId)
    this.loadingCount++
    this.eventService.getUsuariosByEventoAndUser(this.eventoId,usuarioId).subscribe((resUsu: any) => {
      this.loadingCount--
      //console.log("resUsu",resUsu)
      this.usuario=resUsu[0].user.name;
      this.correo=resUsu[0].user.email;
      this.numeroCelular=resUsu[0].num_celular;
      this.numeroEmpleado=resUsu[0].num_empleado;
      this.campus=resUsu[0].campus;
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los usuarios scicom del evento especificado'});
      console.error(err)
    });
  }

  loadCampus(){
    this.campusList=[];
    this.loadingCount++
    this.eventService.getCampusList(this.cordId).subscribe((resCamp: any) => {
      this.loadingCount--
      this.campusList=resCamp;
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los campus de la institución especificada'});
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
      for(let aop of auxObjetivosParticipacion){
        if(aop.id_indicador==11){
          this.pronosticoCarteles=aop.valor_objetivo;
        }
        if(aop.id_indicador==4){
          this.pronosticoeEstudiantes=aop.valor_objetivo;
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo la lista de indicadores'});
      console.error(err)
    });
  }

  loadRangeEvent(){
    this.loadingCount++
    this.eventService.getRangeEventByParticipation(this.eventoId,this.participacionId,8).subscribe((resFech: any) => {
      this.loadingCount--
      this.fechaInicio=resFech[0].tiempo_inicio;
      this.fechaFin=resFech[0].tiempo_final;
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fechas del evento especificado'});
      console.error(err)
    })
  }

}
