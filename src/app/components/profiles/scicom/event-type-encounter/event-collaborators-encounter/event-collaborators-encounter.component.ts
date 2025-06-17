import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {EventService} from "../../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-collaborators-encounter',
  templateUrl: './event-collaborators-encounter.component.html',
  styleUrls: ['./event-collaborators-encounter.component.css']
})
export class EventCollaboratorsEncounterComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  nombreUser:string = "";
  email:string = "";
  rolSelected:number = 0;

  usuarioScitra:number = 0 ;
  userScitraId:number = 0 ;
  userScicomId:number = 0 ;

  roles:any[]=[];
  colaboradores:any[]=[];

  nombre:string = "";
  tipo:number;
  estatus:string="";

  afiliacionesList:any = [];
  afiliaciones:any[] = [];
  afiliacionesAsing:any[] = [];
  afiliacionSelected:number = 0;
  campusEvent:any[] = [];
  campusTotalList:any[] = [];
  campusList:any[] = [];
  campus:any[] = [];
  campusSelected:number = 0;

  search:string = '';

  rolOld:number = 0;
  afiliacionesOld:any = [];
  campusOld:any = [];

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageStart:number = 0;
  pageEnd:number = 0;
  pageSize:number = 10;
  totalItems:number = 0;
  labelPagination:string = '';

  loadingCount: number = 0; //cuenta el número de elementos cargando
  titulo:boolean = false;

  formEmails: FormGroup;

  flagSearch:boolean = false;

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private router: Router,
              public permisosScicomService: PermisosScicomService){ }

  ngOnInit(): void {
    this.loadTitle();
    this.loadRoles();
    this.loadEventos();
    this.loadColaboradoresEvento();
    this.formEmails = new FormGroup({
      email: new FormControl(this.email,[
        Validators.required,
        Validators.email
      ])
    });
  }

  get emails() {
    return this.formEmails.get('email');
  }

  loadTitle = () => {
    if(this.router.url.includes('/event-update/')){
      this.titulo = true;
    }
  }

  loadEventos(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.nombre = res[0].nombre;
        this.tipo = res[0].id_tipo_evento;
        this.estatus = res[0].id_estatus_evento;
        this.campusEvent = res[0].campus;
        const idRorCoord = res[0].rors_editoras.filter((value: any) => value.pivot.creador == true)[0].id
        this.loadingCount++
        if (idRorCoord) {
          this.eventService.getInstitucionList([idRorCoord]).subscribe((res: any) => {
            this.loadingCount--
            this.cordId = res[0].id
            this.loadCampus();
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'Error al cargar la institución creadora del evento'});
            console.error(err)
          });
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los datos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadColaboradoresEvento(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getUsuariosEvento(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.colaboradores = res.filter((value: any) => value.id_rol != 0);
        this.loadPagination();
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los usuarios scicom del evento especificado'});
        console.error(err)
      });
    }
  }

  loadRoles(){
    this.loadingCount++
    this.eventService.getRolList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.roles = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los roles del sistema scicom'});
      console.error(err)
    });
  }

  loadCampus(){
    this.campusList=[];
    this.loadingCount++
    this.eventService.getCampusList(this.cordId).subscribe((res: any) => {
      this.loadingCount--
      this.campusTotalList = res;
      var auxCampusList = [];
      for(let campus1 of res){
        for(let campus2 of this.campusEvent){
          if(campus1.id==campus2.id){
            auxCampusList.push(campus1);
          }
        }
      }
      this.campusList = auxCampusList;
      if(this.campus.length!=0){
        this.loadCampusDisponibles();
        this.loadCampusNoDisponibles();
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus de la institución especificada'});
      console.error(err)
    });
  }

  loadCampusDisponibles(){
    var campustemporal:any = [];
    for(let campus1 of this.campus){
      for(let campus2 of this.campusTotalList){
        if(campus1.id == campus2.id){
          campustemporal.push(campus2);
        }
      }
    }
    this.campus = campustemporal;
  }

  loadCampusNoDisponibles(){
    var campustemporal2:any = this.campusList;
    for(let campus1 of this.campus){
      for(let campus2 of this.campusList){
        if(campus1.id == campus2.id){
          campustemporal2 = campustemporal2.filter( (ca2: any) => ca2.id != campus1.id)
        }
      }
    }
    this.campusList = campustemporal2;
  }

  loadAfiliacion(){
    if(this.search!=''){
      this.loadingCount++
      this.eventService.searchRor(this.search).subscribe((res: any) => {
        this.loadingCount--
        this.afiliacionesList = res.slice(0,50);
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las posibles instituciones de afiliación'});
        console.error(err)
      });
    }
    if(this.afiliaciones.length!=0){
      let auxAfiliacionesList = this.afiliacionesList
      for(let afilia of this.afiliaciones){
        auxAfiliacionesList = auxAfiliacionesList.filter( (id: any) => id != afilia.id)
      }
      this.afiliacionesList = auxAfiliacionesList;
      this.loadRor();
    }
  }

  loadRor(){
    if(this.afiliaciones.length!=0){
      this.afiliacionesAsing = [];
      for(let afil of this.afiliaciones){
        this.loadingCount++
        this.eventService.getRorById(afil.id).subscribe((res: any) => {
          this.loadingCount--
          if(res.length!=0){
            this.afiliacionesAsing.push(res);
          }
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se cargaron los datos de la institución de afiliación especificada'});
          console.error(err)
        });
      }
      this.afiliaciones = this.afiliacionesAsing ;
    }
  }

  asignarRor(){
    for(let afil of this.afiliacionesList){
      if(afil.id==this.afiliacionSelected){
        this.afiliaciones.push(afil);
        this.afiliacionesList = this.afiliacionesList.filter( (af1:any) => af1.id != this.afiliacionSelected);
        this.afiliacionSelected = 0;
      }
    }
  }

  removeRor = (idror:number) => {
    this.afiliaciones = this.afiliaciones.filter( (af:any) => af.id != idror)
    this.loadAfiliacion();
    this.afiliacionSelected = 0;
  }

  asignarCampus = () => {
    for(let camp of this.campusList){
      if(camp.id==this.campusSelected){
        this.campus.push(camp);
        this.campusList = this.campusList.filter( (ca1) => ca1.id != this.campusSelected);
        this.campusSelected = 0;
      }
    }
    this.loadCampus();
  }

  removeCampus = (idcamp:number) => {
    this.campus = this.campus.filter( ({ id }) => id != idcamp)
    this.loadCampus();
    this.campusSelected = 0;
  }

  cleanValues(){
    this.loadCampus();
    this.userScitraId = 0;
    this.userScicomId = 0;
    this.usuarioScitra = 0;
    this.nombreUser = "";
    this.email = "";
    this.rolSelected = 0;
    this.search = '';
    this.afiliacionSelected = 0;
    this.afiliacionesList = [];
    this.campusSelected = 0;
    this.campus = [];
    this.afiliaciones = [];
  }

  restartValues(){
    if(this.usuarioScitra!=0){
      this.loadCampus();
      this.userScitraId = 0;
      this.userScicomId = 0;
      this.usuarioScitra = 0;
      this.nombreUser = "";
      this.rolSelected = 0;
      this.search = "";
      this.afiliacionSelected = 0;
      this.afiliacionesList = [];
      this.campusSelected = 0;
      this.campus = [];
      this.afiliaciones = [];
    }
  }

  loadValues(datos:any){
    this.afiliacionesList = [];
    this.afiliaciones = datos.rors;
    this.campusList = [];
    this.campus = datos.campus;
    this.loadCampus();
    this.loadAfiliacion();
    this.email= datos.user.email;
    this.nombreUser = datos.user.name;
    this.rolSelected = datos.id_rol;
  }

  loadUpdateValues = (datos:any) => {
    this.afiliacionesOld = [];
    this.campusOld = [];
    this.userScicomId = datos.id;
    this.afiliacionesList = [];
    this.afiliaciones = datos.rors;
    this.campusList = [];
    this.campus = datos.campus;
    this.afiliacionSelected = 0;
    this.campusSelected = 0;
    this.loadCampus();
    this.loadAfiliacion();
    this.search = "";
    this.email= datos.user.email;
    this.nombreUser = datos.user.name;
    this.rolSelected = datos.id_rol;
    this.rolOld = datos.id_rol;
    this.afiliacionesOld = this.newObjectReference(datos.rors);
    this.campusOld = this.newObjectReference(this.campus);
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

  updateColaborador(){
    let asyncComplete = false
    if(this.rolSelected!=this.rolOld){
      this.loadingCount++
      this.eventService.updateScicomUser(this.userScicomId,this.rolSelected).subscribe((res: any) => {
        this.loadingCount--
        console.log("rol actualizado");
        if (!asyncComplete)
          this.sendEditCollNotif(this.userScicomId)
        asyncComplete = true
        this.loadColaboradoresEvento();
      }, (err:any) =>{
        this.loadingCount--
        asyncComplete = true
        Swal.fire({icon: 'error',text: 'No se actualizaron los datos del usuario scicom'});
        console.error(err)
      });
    }


    if(this.afiliacionesOld.length==0){

      for(let a of this.afiliaciones) {
        this.loadingCount++
        this.eventService.addRorToUser(this.userScicomId, a.id).subscribe((res: any) => {
          this.loadingCount--
          console.log("afiliacion agregada");
          if (!asyncComplete)
            this.sendEditCollNotif(this.userScicomId)
          asyncComplete = true
          this.loadColaboradoresEvento();
          this.loadAfiliacion();
        }, (err: any) => {
          this.loadingCount--
          asyncComplete = true
          Swal.fire({icon: 'error', text: 'No se agregó la afiliación al usuario scicom especificado'});
          console.error(err)
        });
      }

    }else if(this.afiliaciones.length==0){

      for(let d of this.afiliacionesOld){
        this.loadingCount++
        this.eventService.removeRorToUser(this.userScicomId,d.id).subscribe((res: any) => {
          this.loadingCount--
          console.log("afiliacion desasignado");
          if (!asyncComplete)
            this.sendEditCollNotif(this.userScicomId)
          asyncComplete = true
          this.loadColaboradoresEvento();
          this.loadAfiliacion();
        }, (err:any) =>{
          this.loadingCount--
          asyncComplete = true
          Swal.fire({icon: 'error',text: 'No se eliminó la afiliación del usuario scicom especificado'});
          console.error(err)
        });
      }

    }else{

      var add1:any = this.afiliaciones;
      for(let afili1 of this.afiliacionesOld){
        for(let afili2 of this.afiliaciones){
          if(afili1.id==afili2.id){
            add1 = add1.filter((afil:any) => afil.id != afili1.id)
          }
        }
      }
      if(add1.length!=0){
        for(let a of add1){
          this.loadingCount++
          this.eventService.addRorToUser(this.userScicomId,a.id).subscribe((res: any) => {
            this.loadingCount--
            console.log("afiliacion agregada");
            if (!asyncComplete)
              this.sendEditCollNotif(this.userScicomId)
            asyncComplete = true
            this.loadColaboradoresEvento();
            this.loadAfiliacion();
          }, (err:any) =>{
            this.loadingCount--
            asyncComplete = true
            Swal.fire({icon: 'error',text: 'No se agregó la afiliación al usuario scicom especificado'});
            console.error(err)
          });
        }
      }

      var del1:any = this.afiliacionesOld;
      for(let afili1 of this.afiliacionesOld){
        for(let afili2 of this.afiliaciones){
          if(afili1.id==afili2.id){
            del1 = del1.filter((afil:any) => afil.id != afili2.id)
          }
        }
      }
      if(del1.length!=0){
        for(let d of del1){
          this.loadingCount++
          this.eventService.removeRorToUser(this.userScicomId,d.id).subscribe((res: any) => {
            this.loadingCount--
            console.log("afiliacion desasignado");
            if (!asyncComplete)
              this.sendEditCollNotif(this.userScicomId)
            asyncComplete = true
            this.loadColaboradoresEvento();
            this.loadAfiliacion();
          }, (err:any) =>{
            this.loadingCount--
            asyncComplete = true
            Swal.fire({icon: 'error',text: 'No se eliminó la afiliación del usuario scicom especificado'});
            console.error(err)
          });
        }
      }

    }

    /**
     * Comparación de campus guardados y campus agregados
     */
    if(this.campusOld.length==0){
      console.log("this.campusOld",this.campusOld);
      if(this.campusOld.length==0){
        for(let a of this.campus){
          this.loadingCount++
          this.eventService.addCampusToUser(this.userScicomId,a.id).subscribe((res: any) => {
            this.loadingCount--
            if (!asyncComplete)
              this.sendEditCollNotif(this.userScicomId)
            asyncComplete = true
            this.loadColaboradoresEvento();
            this.loadCampus();
            console.log("campus agregado");
          }, (err:any) =>{
            asyncComplete = true
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se agregó el campus al usuario scicom especificado'});
            console.error(err)
          });
        }
      }
    }else if(this.campus.length==0){
      for(let d of this.campusOld){
        this.loadingCount++
        this.eventService.removeCampusToUser(this.userScicomId,d.id).subscribe((res: any) => {
          this.loadingCount--
          if (!asyncComplete)
            this.sendEditCollNotif(this.userScicomId)
          asyncComplete = true
          this.loadColaboradoresEvento();
          this.loadCampus();
          console.log("campus eliminado");
        }, (err:any) =>{
          this.loadingCount--
          asyncComplete = true
          Swal.fire({icon: 'error',text: 'No se eliminó el campus del usuario scicom especificado'});
          console.error(err)
        });
      }
    }else{
      var add2:any = this.campus;
      for(let campus1 of this.campusOld){
        for(let campus2 of this.campus){
          if(campus1.id==campus2.id){
            add2 = add2.filter((camp:any) => camp.id != campus1.id)
          }
        }
      }
      if(add2.length!=0){
        for(let a of add2){
          this.loadingCount++
          this.eventService.addCampusToUser(this.userScicomId,a.id).subscribe((res: any) => {
            this.loadingCount--
            if (!asyncComplete)
              this.sendEditCollNotif(this.userScicomId)
            asyncComplete = true
            this.loadColaboradoresEvento();
            this.loadCampus();
            console.log("campus agregado");
          }, (err:any) =>{
            this.loadingCount--
            asyncComplete = true
            Swal.fire({icon: 'error',text: 'No se agregó el campus al usuario scicom especificado'});
            console.error(err)
          });
        }
      }

      var del2:any = this.campusOld;
      for(let campus1 of this.campusOld){
        for(let campus2 of this.campus){
          if(campus1.id==campus2.id){
            del2 = del2.filter((camp:any) => camp.id != campus2.id)
          }
        }
      }
      if(del2.length!=0){
        for(let d of del2){
          this.loadingCount++
          this.eventService.removeCampusToUser(this.userScicomId,d.id).subscribe((res: any) => {
            this.loadingCount--
            if (!asyncComplete)
              this.sendEditCollNotif(this.userScicomId)
            asyncComplete = true
            this.loadColaboradoresEvento();
            this.loadCampus();
            console.log("campus desasignado");
          }, (err:any) =>{
            this.loadingCount--
            asyncComplete = true
            Swal.fire({icon: 'error',text: 'No se eliminó el campus del usuario scicom especificado'});
            console.error(err)
          });
        }
      }
    }
    this.loadColaboradoresEvento();
    this.loadAfiliacion();
    this.loadCampus();
    Swal.fire({icon: 'success',text: 'El colaborador se actualizó correctamente'});
  }

  sendEditCollNotif (userScicomId: any) {
    this.loadingCount++
    this.notificacionesScicomService.sendNotificationEditColabEvento(userScicomId).subscribe((res:any) => {
      this.loadingCount--
      console.info("NotificationEditColabEvento")
    }, (err:any) =>{
      this.loadingCount--
      console.error(err)
    });
  }

  searchUser(){
    if(this.email!=''){
      this.loadingCount++
      this.eventService.searchScintraUser(this.email).subscribe((res: any) => {
        this.loadingCount--
        if(res.length!=0){
          this.usuarioScitra = 1;
          this.userScitraId = res[0].id;
          this.nombreUser = res[0].name
          this.flagSearch = true;
        }else if(res.length==0){
          this.usuarioScitra = 2;
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se pudo buscar el usuario Scintra sugerido'});
        console.error(err)
      });
    }
  }

  saveCollaborator(){
    if(this.usuarioScitra!=0){
      if(this.usuarioScitra==1){
        /**
         * El usuario Scintra ya existe se crea el usuario scicom
         */
        if(this.userScitraId!=0){
          this.loadingCount++
          this.eventService.addScicomUser(this.rolSelected, this.userScitraId, this.eventoId).subscribe((res: any) => {
            this.loadingCount--
            this.userScicomId = res;
            console.log("colaborador sintra agregado");
            this.loadingCount++
            this.notificacionesScicomService.sendNotificationAddColabEvento(this.userScicomId).subscribe((res:any) => {
              this.loadingCount--
              console.info("NotificationAddColabEvento")
            }, (err:any) =>{
              this.loadingCount--
              console.error(err)
            });
            this.ligarAfiliaciones();
            this.ligarCampus();

            this.loadColaboradoresEvento();

            Swal.fire({icon: 'success',text: 'El colaborador se agregó correctamente'});
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se agregó el usuario scicom al evento especificado'});
            console.error(err)
          });
        }

      }else if(this.usuarioScitra==2){
        /**
         * El usuario Scintra no  se crea un usuario scitra y scicom
         */
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&/()=?¿';
        var charactersLength = characters.length;
        for ( var i = 0; i < 10; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        this.loadingCount++
        this.eventService.addScintraUser(this.nombreUser,this.email,'scicom',result,result).subscribe((res: any) => {
          this.loadingCount--
          console.log("colaborador buscado");
          this.loadingCount++
          this.eventService.searchScintraUser(this.email).subscribe((res: any) => {
            this.loadingCount--
            this.userScitraId = res[0].id;
            console.log("colaborador buscado");
            this.loadingCount++
            this.eventService.addScicomUser(this.rolSelected,this.userScitraId,this.eventoId).subscribe((res: any) => {
              this.loadingCount--
              console.log("colaborador sintra agregado");
              this.userScicomId = res;
              this.loadingCount++
              this.notificacionesScicomService.sendNotificationAddColabEvento(this.userScicomId).subscribe((res:any) => {
                this.loadingCount--
                console.info("NotificationAddColabEvento")
              }, (err:any) =>{
                this.loadingCount--
                console.error(err)
              });
              this.ligarAfiliaciones();
              this.ligarCampus();

              Swal.fire({icon: 'success',text: 'El colaborador se agregó correctamente'});
              this.loadColaboradoresEvento();
            }, (err:any) =>{
              this.loadingCount--
              Swal.fire({icon: 'error',text: 'No se agregó el usuario scicom al evento especificado'});
              console.error(err)
            });
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se pudo buscar el usuario Scintra sugerido'});
            console.error(err)
          });
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se creó el usuario Scintra'});
          console.error(err)
        });
        this.loadColaboradoresEvento();
      }
    }
  }

  ligarAfiliaciones(){
    if(this.afiliaciones.length>0){
      const idsAfiliaciones = this.afiliaciones.map((value: any) => value.id)
      this.loadingCount++
      this.eventService.addRorsToUserParticipation(this.userScicomId,idsAfiliaciones).subscribe((res: any) => {
        this.loadingCount--
        this.loadAfiliacion();
        console.log("Afiliacion agregada");
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se agregó la institución de afiliación al usuario scicom especificado'});
        console.error(err)
      });
    }
  }

  ligarCampus(){
    if(this.campus.length>0){
      const idsCampus = this.campus.map((value: any) => value.id)
      this.loadingCount++
      this.eventService.addCampusToUserParticipation(this.userScicomId,idsCampus).subscribe((res: any) => {
        this.loadingCount--
        this.loadCampus();
        console.log("campus agregado");
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se agregó el campus al usuario scicom especificado'});
        console.error(err)
      });
    }
  }

  deleteScicomUser (user:any) {
    Swal.fire({
      title: '¿Deseas eliminar <br> el colaborador del evento?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventService.deleteScicomUser(user.id).subscribe((res: any) => {
          this.loadingCount--
          this.pageNumber = 1;
          this.loadingCount++
          this.notificacionesScicomService.sendNotificationDelColabEvento(user.id).subscribe((res:any) => {
            this.loadingCount--
            console.info("NotificationDelColabEvento")
          }, (err:any) =>{
            this.loadingCount--
            console.error(err)
          });
          this.loadColaboradoresEvento();
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se eliminó el usuario scicom especificado'});
          console.error(err)
        });
      }
    })
  }

  loadPagination = (pageValue?:any) => {
    this.totalItems = this.colaboradores.length;
    this.pageNumbers = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbersArray = [];
    for(var i=1 ; i<= this.pageNumbers ; i++){
      this.pageNumbersArray.push({"id":i});
    }
    if(pageValue){
      if(pageValue=='prev'){
        this.pageNumber = this.pageNumber-1;
      }else if(pageValue=='next'){
        this.pageNumber = this.pageNumber+1;
      }else{
        this.pageNumber = pageValue;
      }
    }
    this.pageEnd = this.pageNumber * this.pageSize;
    this.pageStart = this.pageEnd - (this.pageSize - 1);
    if(this.pageNumber==this.pageNumbers){
      this.pageEnd = this.totalItems;
    }
    this.labelPagination = "Muestra los colaboradores del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
  }
}
