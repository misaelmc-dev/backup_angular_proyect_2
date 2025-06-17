import {Component,OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../../../../services/event.service";
import {PermisosScicomService} from "../../../../services/scicom/permisos-scicom.service";
import Swal from "sweetalert2";
import {NotificacionesScicomService} from "../../../../services/scicom/notificaciones-scicom.service";

@Component({
  selector: 'app-event-paticipation-new',
  templateUrl: './event-paticipation-new.component.html',
  styleUrls: ['./event-paticipation-new.component.css']
})
export class EventPaticipationNewComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?:number = Number(this.route.snapshot.paramMap.get('idevent'));
  userId?:number = Number(this.route.snapshot.paramMap.get('iduser'));

  participacionUsuario:any[]=[];
  usuario:any[]=[];

  usuarioId:number = 0;
  usuarioEmail:string = '';
  usuarioNombre:string = '';
  usuarioCampus:any[] = [];
  tipoPartSelected:number = 0;

  participation:any[]=[];
  participationAsing:any[]=[];
  participationNoAsing:any[]=[];
  participationId:number=0;

  save = '';

  loadingCount: number = 0; //cuenta el número de elementos cargando

  seccion:number=1;

  btnFinalizarHabilitado: boolean = false;

  permisoEditarCampus: boolean = false;

  campusList:any[]=[]
  campusAgregados:any[]=[]
  campusNoAgregados:any[]=[]
  campusSelected:number=0

  noEmpleado:number;
  validEmpleadoNumber = false;

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private permisosScicomService: PermisosScicomService,
              private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.loadUsuariosEvento();
    this.loadParticipation();
    this.loadParticipationPermisos()
    this.loadCampus()
  }

  loadParticipationPermisos(){
    if(this.permisosScicomService.canAgregarParticipacionEvento(this.eventoId)){
      this.permisoEditarCampus = true
    }else{
      this.permisoEditarCampus = false
    }
  }

  loadCampus(){
    this.loadingCount++
    this.eventService.getCampusAsign(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.campusList = res
      this.campusNoAgregados = res
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los campus de la institución especificada'});
      console.error(err)
    });
  }

  loadUsuariosEvento = () => {
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getUsuariosEvento(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.participacionUsuario = res;
        for(let u of this.participacionUsuario){
          if(u.id==this.userId){
            this.usuarioId = u.id;
            this.usuarioNombre = u.user.name;
            this.usuarioEmail = u.user.email;
            this.usuarioCampus = u.campus;
          }
        }
        console.log("this.usuarioId",this.usuarioId)
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los usuarios scicom del evento especificado'});
        console.error(err)
      });
    }
  }

  loadParticipation = () => {
    this.loadingCount++
    this.eventService.getParticipationList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.participation = res ;
      this.loadingCount++
      this.eventService.getParticipationAsign(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.participationNoAsing = this.participation;
        for(let camp of res[0].tipos_de_participacion){
          this.participationNoAsing = this.participationNoAsing.filter( ({ id }) => id != camp.pivot.id_tipo_participacion );
        }
        this.participationAsing = this.participation;
        for(let camp of this.participationNoAsing){
          this.participationAsing = this.participationAsing.filter( ({ id }) => id != camp.id );
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

  newParticipation(){
    this.eventService.addParticipation(this.tipoPartSelected,this.usuarioId).subscribe((res: any) => {
      this.loadingCount--
      this.participationId = res;
      if(this.permisoEditarCampus){
        this.loadingCount++
        this.eventService.addNoEmpleadoToUser(this.usuarioId,this.noEmpleado).subscribe((res:any) => {
          this.loadingCount--
          console.info("Se agregó el agrego el numero de empleado al usuario scicom")

          this.loadingCount--
          console.info("NotificationAddParticipEvento")
          this.loadingCount++
          this.notificacionesScicomService.sendNotificationAddParticipEvento(this.participationId).subscribe((res:any) => {
            this.loadingCount--
            console.info("NotificationAddParticipEvento")
          }, (err:any) =>{
            this.loadingCount--
            console.error(err)
          });

        }, (err:any) =>{
          this.loadingCount--
          console.info("No se agregó el agrego el numero de usuario al usuario scicom")
          console.error(err)
        });
      }else{
        const ids = this.campusAgregados.map((value: any) => value.id)
        this.loadingCount++
        this.eventService.addCampusToUserParticipation(this.usuarioId, ids).subscribe((res: any) => {
          this.loadingCount--
          this.loadingCount++
          this.eventService.addNoEmpleadoToUser(this.usuarioId,this.noEmpleado).subscribe((res:any) => {
            this.loadingCount--
            console.info("Se agregó el agrego el numero de empleado al usuario scicom")
            this.loadingCount++
            this.notificacionesScicomService.sendNotificationAddParticipEvento(this.participationId).subscribe((res:any) => {
              this.loadingCount--
              console.info("NotificationAddParticipEvento")
            }, (err:any) =>{
              this.loadingCount--
              console.error(err)
            });
          }, (err:any) =>{
            this.loadingCount--
            console.info("No se agregó el agrego el numero de usuario al usuario scicom")
            console.error(err)
          });
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
        });
      }


      Swal.fire({icon: 'success',text: 'Se generó la participación'});
      console.log("Se creo la participacion")
      this.save = 'ok';
      this.seccion = this.seccion + 1
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se generó la participación con el tipo y usuario indicados'});
      console.error(err)
    });
  }

  changeSeccion = (navegacion?:string) => {
    if(navegacion=='next'){
      if(this.permisoEditarCampus){
        if(this.save==''){
          if(this.seccion==1){
            this.newParticipation();
            console.log("nueva participacion")
          }else{
            this.seccion = this.seccion + 1
            this.actualizarNumEmpleado()
          }
        }else{
          this.seccion = this.seccion + 1
          this.actualizarNumEmpleado()
        }
      }else{
        if(this.save==''){
          if(this.seccion==1){
            this.newParticipation();
            console.log("nueva participacion")
          }else{
            this.seccion = this.seccion + 1
            this.actualizarNumEmpleado()
          }
        }else{
          this.actualizarCampus()
          console.log("actualizar")
          this.seccion = this.seccion + 1
        }
      }
    }else if('prev'){
      this.seccion = this.seccion - 1;
    }else if('paso2'){
      this.seccion = this.seccion + 1 ;
      this.actualizarNumEmpleado()
    }
  }

  checkIfAllowedToFinalize(allowed: boolean) {
    this.btnFinalizarHabilitado = allowed;
  }

  agregarCampus(){
    if(this.campusSelected!=0){
      for(let c of this.campusList){
        if(c.id == this.campusSelected){
          this.campusAgregados.push(c)
          this.campusNoAgregados = this.campusNoAgregados.filter((cnd:any) => cnd.id != this.campusSelected)
          this.campusSelected = 0
        }
      }
    }
  }

  removerCampus(idCampus:number){
    for(let c of this.campusList){
      if(c.id == idCampus){
        this.campusNoAgregados.push(c)
        this.campusAgregados = this.campusAgregados.filter((cnd:any) => cnd.id != idCampus)
        this.campusSelected = 0
      }
    }
  }

  actualizarCampus(){
    this.loadingCount++
    this.eventService.getUsuarioById(this.eventoId,this.usuarioId).subscribe((res: any) => {
      this.loadingCount--
      var auxCampus = []
      for(let r of res){if(r.campus.length!=0){auxCampus = r.campus}}
      const idsCampusElim = auxCampus.map((value:any) => value.id)
      this.loadingCount++
      this.eventService.removeCampusToUserParticipation(this.usuarioId,idsCampusElim).subscribe((res: any) => {
        this.loadingCount--
        const idsCampusAdd = this.campusAgregados.map((value:any) => value.id)
        this.loadingCount++
        this.eventService.addCampusToUserParticipation(this.usuarioId,idsCampusAdd).subscribe((res: any) => {
          this.loadingCount--
          this.actualizarNumEmpleado()
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se ligaron los campus al usuario especificado'});
          console.error(err)
        });
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se desligaron los campus del usuario especificado'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo la información del usuario scicom en el evento especificado'});
      console.error(err)
    });
  }

  actualizarNumEmpleado(){
    this.loadingCount++
    this.eventService.addNoEmpleadoToUser(this.usuarioId,this.noEmpleado).subscribe((res:any) => {
      this.loadingCount--
      console.info("Se actualizo el numero de empleado al usuario scicom")
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se actualizo el numero de empleado al usuario scicom'});
      console.error(err)
    });
  }

  validateNoEmpleado(){
    if(this.noEmpleado>9999999999){
      this.validEmpleadoNumber = true
    }else if(this.noEmpleado==0){
      this.validEmpleadoNumber = true
    }else if(!this.noEmpleado){
      this.validEmpleadoNumber = true
    }else{
      this.validEmpleadoNumber = false
    }
  }
}
