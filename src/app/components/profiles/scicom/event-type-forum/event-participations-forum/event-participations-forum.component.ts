import {Component, OnInit} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {ExportService} from "../../../../../services/export.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {AuthService} from "../../../../../services/auth.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {ExcelJson} from "../../../../../interfaces/excel-json";

@Component({
  selector: 'app-event-participations-forum',
  templateUrl: './event-participations-forum.component.html',
  styleUrls: ['./event-participations-forum.component.css']
})
export class EventParticipationsForumComponent implements OnInit {

  cordId?: number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?: number = Number(this.route.snapshot.paramMap.get('idevent'));

  rorId: number;

  participations: any[] = [];
  participacionUsuario: any[] = [];
  participacionUsuarioDisponibles: any[] = [];
  typeParticipation: any[] = [];
  typeParticipationAsign: any[] = [];
  typeParticipationNoAsign: any[] = [];

  participationEstatus: any[] = [];

  usuarioSelected: number = 0;

  usuarioId:number;
  usuarioEmail: string = '';
  usuarioNombre: string = '';

  formEmails: FormGroup;

  mensaje: string = 'inicio';

  usuarioScintraId: number = 0;

  usuarioScitra: number = 0;
  userScitraId: number = 0;
  userScicomId: number = 0;

  nombre: string = "";
  tipo: number;
  estatus: string = "";

  pageNumbers: number = 0;
  pageNumber: number = 1;
  pageNumbersArray: any = [];
  pageStart: number = 0;
  pageEnd: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  labelTotalItems:string = '';
  labelTotalPagination:string = '';
  limitStartPage:number = 0;
  limitEndPage:number = 0;

  afiliacionesList: any = [];
  afiliaciones: any[] = [];
  afiliacionesAsing: any[] = [];
  afiliacionSelected: number = 0;
  fechasEvento: any[] = [];
  campusEvent: any[] = [];
  campusTotalList: any[] = [];
  campusList: any[] = [];
  campus: any[] = [];
  campusSelected: number = 0;
  currentUsuarioScicomId: number;

  search: string = '';
  searchUser: string = '';

  loadingCount: number = 0; //cuenta el número de elementos cargando

  titulo: boolean = false;
  estilosModalUsuario: string = '';
  estilosModalPart: string = '';

  reportePartAgrupados: boolean = false;
  participacionesExportar:any[] = [];
  datosExportar:any[] = [];
  datosCompletosExportar:any[] = [];

  trabajos:any[] = [];
  metadatos:any[] = [];
  fuentesCarga:any[] = [];
  estatusWork:any[] = [];
  autoresList:any[] = [];
  afiliacionesDatos:any[] = [];
  metadatosTitulos:any[] = [];
  typeWork:any[] = [];
  typeWorkAsing:any[] = [];
  typeWorkNoAsing:any[] = [];

  idParticipacion:number=0
  participacionIdUsuario:number=0
  tipoParticipacion:string=''
  nombreParticipacion:string=''
  correoParticipacion:string=''
  campusParticipacion:any[]=[]
  campusSinParticipacion:any[]=[]
  noEmpleadoParticipacion:number=0
  campusParticipacionSelected:number=0

  validEmpleadoNumberParticipation = false

  partId:number;
  partUsuarioId:number;
  partUsuario:string;
  partEmail:string;
  partCelular:number;
  partNumEmpleado:number;
  tipoRangoTiempoId:number=8;
  partRangoTiempoId:number;
  partFechaInicio:string;
  showFechaInicio:string;
  partFechaFinal:string;
  showFechaFinal:string;
  partCampusGuardados:any[]=[];
  partCampus:any[]=[];
  partCampusDisponibles:any[]=[];

  validCelular:number=0;
  validNumEmpleado:number=0;
  validFechaInicio:number=0;
  validFechaFinal:number=0;
  validCampus:number=0;
  validPronosticoCarteles:number=0;
  validPronosticoEstudiantes:number=0;
  validTodo:boolean=false;

  eventoFechaInicio:string;
  eventoFechaFinal:string;

  pronosticoCarteles:number;
  pronosticoCartelesId:number;
  pronosticoEstudiantes:number;
  pronosticoEstudiantesId:number;

  tipoReporte:string;
  repFechaInicio:string;
  repFechaFinal:string;
  repShowFechaInicio:string;
  repShowFechaFinal:string;

  mensaje3:number;
  mensaje4:number;


  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private router: Router,
              public permisosScicomService: PermisosScicomService,
              public authService: AuthService,
              public exportService: ExportService) {
  }

  ngOnInit(): void {
    this.loadTitle();
    this.loadEventos();
    this.loadParticipation();
    this.loadParticipationList();
    this.loadParticipationEstatus();
    this.loadCurrentScicomUser()
    this.formEmails = new FormGroup({
      email: new FormControl(this.usuarioEmail, [
        Validators.required,
        Validators.email
      ])
    });
    this.tipoReporte = "reporte1"
  }

  get emails() {
    return this.formEmails.get('email');
  }

  loadTitle(){
    if (this.router.url.includes('/event-update/')) {
      this.titulo = true;
    }
  }

  loadCurrentScicomUser() {
    const user = this.authService.getUserEnLocal()
    if (user && !this.permisosScicomService.checkPermisoScintraByCode('allScicom')
      && !this.permisosScicomService.checkPermisoScintraByCode('instScicom'))
    {
      const idUser = user.id
      this.loadingCount++
      this.eventService.getUsuariosEvento(this.eventoId, idUser).subscribe((usuariosScicom: any) => {
        this.loadingCount--
        this.currentUsuarioScicomId = usuariosScicom[0].id
      }, (err) => {
        this.loadingCount--
        console.error(err)
      })
    }
  }

  loadEventos(){
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.nombre = res[0].nombre;
      this.tipo = res[0].id_tipo_evento;
      this.estatus = res[0].id_estatus_evento;
      this.campusEvent = res[0].campus;
      const idRorCoord = res[0].rors_editoras.filter((value: any) => value.pivot.creador == true)[0].id
      this.rorId = idRorCoord;
      this.loadRangeEvent();
      this.loadingCount++
      if (idRorCoord) {
        this.eventService.getInstitucionList([idRorCoord]).subscribe((res: any) => {
          this.loadingCount--
          this.cordId = res[0].id
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
    this.eventService.getParticipationList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.typeParticipation = res;
      this.loadingCount++
      this.eventService.getParticipationAsign(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.typeParticipationNoAsign = this.typeParticipation;
        for (let camp of res[0].tipos_de_participacion) {
          this.typeParticipationNoAsign = this.typeParticipationNoAsign.filter((a: any) => a.id != camp.pivot.id_tipo_participacion);
        }
        this.typeParticipationAsign = this.typeParticipation;
        for (let camp of this.typeParticipationNoAsign) {
          this.typeParticipationAsign = this.typeParticipationAsign.filter((a: any) => a.id != camp.id);
        }
        this.loadPagination();
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron las participaciones asignadas del evento especificado'});
        console.error(err)
      });
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los tipos de participaciones'});
      console.error(err)
    });
  }

  loadParticipationList() {
    this.loadingCount++
    this.eventService.getParticipationListByEvent(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.participations = res
      this.loadUsuariosEvento()
      this.loadPagination();
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron las participaciones del evento especificado'});
      console.error(err)
    });
  }

  loadParticipationEstatus(){
    this.loadingCount++
    this.eventService.getParticipationEstatus().subscribe((res: any) => {
      this.loadingCount--
      this.participationEstatus = res;
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron las participaciones del evento especificado'});
      console.error(err)
    });
  }

  loadUsuariosEvento(){
    if (this.eventoId != 0) {
      this.loadingCount++
      this.eventService.getUsuariosEvento(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.orderBy(res);
        this.participacionUsuario = res;
        var usuarios = res;
        //console.log("usuarios",usuarios)
        for (let pu of this.participacionUsuario) {
          for (let p of this.participations) {
            usuarios = usuarios.filter( (u:any) => u.id != p.id_usuario);
          }
        }
        this.participacionUsuarioDisponibles = usuarios;
        //console.log("this.participacionUsuarioDisponibles",this.participacionUsuarioDisponibles)
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron los usuarios scicom del evento especificado'});
        console.error(err)
      });
    }
  }

  loadAfiliacion(){
    if (this.search != '') {
      this.loadingCount++
      this.eventService.searchRor(this.search).subscribe((res: any) => {
        this.loadingCount--
        this.afiliacionesList = res.slice(0, 50);
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron las posibles instituciones de afiliación'});
        console.error(err)
      });
    }
    if (this.afiliaciones.length != 0) {
      let auxAfiliacionesList = this.afiliacionesList
      for (let afilia of this.afiliaciones) {
        auxAfiliacionesList = auxAfiliacionesList.filter((id: any) => id != afilia.id)
      }
      this.afiliacionesList = auxAfiliacionesList;
      this.loadRor();
    }
  }

  loadRangeEvent(){
    this.loadingCount++
    this.eventService.getRangeEventList(this.eventoId).subscribe((resFech: any) => {
      this.loadingCount--
      this.fechasEvento = resFech.filter( (fech: any) => fech.id_tipo_rango == 8);
      for(let fech of resFech){
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


  loadRor(){
    if (this.afiliaciones.length != 0) {
      this.afiliacionesAsing = [];
      for (let afil of this.afiliaciones) {
        this.loadingCount++
        this.eventService.getRorById(afil.id).subscribe((res: any) => {
          this.loadingCount--
          if (res.length != 0) {
            this.afiliacionesAsing.push(res);
          }
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se cargaron los datos de la institución de afiliación especificada'});
          console.error(err)
        });
      }
      this.afiliaciones = this.afiliacionesAsing;
    }
  }

  asignarRor(){
    for (let afil of this.afiliacionesList) {
      if (afil.id == this.afiliacionSelected) {
        this.afiliaciones.push(afil);
        this.afiliacionesList = this.afiliacionesList.filter((af1: any) => af1.id != this.afiliacionSelected);
        this.afiliacionSelected = 0;
      }
    }
  }

  removeRor = (idror: number) => {
    this.afiliaciones = this.afiliaciones.filter((af: any) => af.id != idror)
    this.loadAfiliacion();
    this.afiliacionSelected = 0;
  }

  loadCampus(){
    this.campusList = [];
    this.loadingCount++
    this.eventService.getCampusList(this.cordId).subscribe((res: any) => {
      this.loadingCount--
      this.campusTotalList = res;
      var auxCampusList = [];
      for (let campus1 of res) {
        for (let campus2 of this.campusEvent) {
          if (campus1.id == campus2.id) {
            auxCampusList.push(campus1);
          }
        }
      }
      this.campusList = auxCampusList;
      if (this.campus.length != 0) {
        this.loadCampusDisponibles();
        this.loadCampusNoDisponibles();
      }
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los campus de la institución especificada'});
      console.error(err)
    });
  }

  loadCampusDisponibles() {
    var campustemporal: any = [];
    for (let campus1 of this.campus) {
      for (let campus2 of this.campusTotalList) {
        if (campus1.id == campus2.id) {
          campustemporal.push(campus2);
        }
      }
    }
    this.campus = campustemporal;
  }

  loadCampusNoDisponibles() {
    var campustemporal2: any = this.campusList;
    for (let campus1 of this.campus) {
      for (let campus2 of this.campusList) {
        if (campus1.id == campus2.id) {
          campustemporal2 = campustemporal2.filter((ca2: any) => ca2.id != campus1.id)
        }
      }
    }
    this.campusList = campustemporal2;
  }

  asignarCampus(){
    for (let camp of this.campusList) {
      if (camp.id == this.campusSelected) {
        this.campus.push(camp);
        this.campusList = this.campusList.filter((ca1) => ca1.id != this.campusSelected);
        this.campusSelected = 0;
      }
    }
    this.loadCampus();
  }

  removeCampus = (idcamp: number) => {
    this.campus = this.campus.filter(({id}) => id != idcamp)
    this.loadCampus();
    this.campusSelected = 0;
  }

  newUser() {
    this.loadingCount++
    this.eventService.searchScintraUser(this.usuarioEmail).subscribe((resSi: any) => {
      this.loadingCount--
      if (resSi.length != 0) {
        this.userScitraId = resSi[0].id;
        this.usuarioNombre = resSi[0].name;
        this.usuarioEmail = resSi[0].email;
        this.loadingCount++
        this.eventService.searchScicomUser(this.eventoId, this.usuarioEmail).subscribe((resSc: any) => {
          this.loadingCount--
          if (resSc.length != 0) {
            this.mensaje = 'existe';
          } else if (resSc.length == 0) {
            this.mensaje = 'scicom';

            this.loadingCount++
            this.eventService.addScicomUser(0, this.userScitraId, this.eventoId).subscribe((res: any) => {
              this.loadingCount--
              this.userScicomId = res;
              console.log("colaborador sintra agregado");
              const ids = this.campus.map((value: any) => value.id)
              this.loadingCount++
              this.eventService.addCampusToUserParticipation(this.userScicomId, ids).subscribe((res: any) => {
                this.loadingCount--
                console.log("campus agregado");
              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se agregó el campus al usuario scicom especificado'});
                console.error(err)
              });
              for (let afil of this.afiliaciones) {
                this.loadingCount++
                this.eventService.addRorToUser(this.userScicomId, afil.id).subscribe((res: any) => {
                  this.loadingCount--
                  console.log("Afiliacion agregada");
                }, (err: any) => {
                  this.loadingCount--
                  Swal.fire({
                    icon: 'error',
                    text: 'No se agregó la institución de afiliación al usuario scicom especificado'
                  });
                  console.error(err)
                });
              }
              this.loadUsuariosEvento();
              this.loadParticipationList();
              this.loadAfiliacion();
              this.loadCampus();
            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error', text: 'No se agregó el usuario scicom al evento especificado'});
              console.error(err)
            });
            this.loadParticipationList();
          }
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se agregó el usuario scicom al evento especificado'});
          console.error(err)
        });

      } else if (resSi.length == 0) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&/()=?¿';
        var charactersLength = characters.length;
        for (var i = 0; i < 10; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        this.loadingCount++
        this.eventService.addScintraUser(this.usuarioNombre, this.usuarioEmail, 'scicom', result, result).subscribe((res: any) => {
          this.loadingCount--
          console.log("colaborador buscado");
          this.loadingCount++
          this.eventService.searchScintraUser(this.usuarioEmail).subscribe((res: any) => {
            this.loadingCount--
            this.userScitraId = res[0].id;
            console.log("colaborador buscado");
            this.loadingCount++
            this.eventService.addScicomUser(0, this.userScitraId, this.eventoId).subscribe((res: any) => {
              this.loadingCount--
              console.log("colaborador sintra agregado");
              this.userScicomId = res;
              this.mensaje = 'guardado';

              const ids = this.campus.map((value: any) => value.id)
              this.loadingCount++
              this.eventService.addCampusToUserParticipation(this.userScicomId, ids).subscribe((res: any) => {
                this.loadingCount--
                console.log("campus agregado");
                this.loadParticipationList();
                this.loadCampus();
              }, (err: any) => {
                this.loadingCount--
                Swal.fire({icon: 'error', text: 'No se agregó el campus al usuario scicom especificado'});
                console.error(err)
              });

              for (let afil of this.afiliaciones) {
                this.loadingCount++
                this.eventService.addRorToUser(this.userScicomId, afil.id).subscribe((res: any) => {
                  this.loadingCount--
                  console.log("Afiliacion agregada");
                  this.loadParticipationList();
                  this.loadAfiliacion();

                }, (err: any) => {
                  this.loadingCount--
                  Swal.fire({
                    icon: 'error',
                    text: 'No se agregó la institución de afiliación al usuario scicom especificado'
                  });
                  console.error(err)
                });
              }
              this.loadUsuariosEvento();
              this.loadParticipationList();
              this.loadCampus();
              this.loadAfiliacion();
            }, (err: any) => {
              this.loadingCount--
              Swal.fire({icon: 'error', text: 'No se agregó el usuario scicom al evento especificado'});
              console.error(err)
            });
          }, (err: any) => {
            this.loadingCount--
            Swal.fire({icon: 'error', text: 'No se pudo buscar el usuario Scintra sugerido'});
            console.error(err)
          });
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se creó el usuario Scintra'});
          console.error(err)
        });
        this.loadParticipationList();
        this.loadCampus();
        this.loadAfiliacion();
      }
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se pudo buscar el usuario Scintra sugerido'});
      console.error(err)
    });

  }

  deleteParticipation(participacion: any) {
    Swal.fire({
      title: '¿Deseas eliminar el registro?',
      html: '<h5>Esta acción eliminará cualquier material asociado a este.</h5>',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventService.deleteParticipation(participacion.id).subscribe((res: any) => {
          this.loadingCount--

          this.loadingCount++
          this.notificacionesScicomService.sendNotificationDelParticipForUvmEncUtecEvento(participacion.id).subscribe((res: any) => {
            this.loadingCount--
            console.info("NotificationDelParticipForUvmEncUtecEvento")
          }, (err: any) => {
            this.loadingCount--
            console.error(err)
          });

          console.log("eliminado", res);
          this.loadParticipationList();
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se eliminó la participación especificada'});
          console.error(err)
        });
      }
    })
  }

  loadPagination(pageValue?:any){
    this.totalItems = this.participations.length;
    this.pageNumbers = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbersArray = [];
    for(var i=1 ; i<=this.pageNumbers ; i++){
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
    if(this.pageNumber==0 || this.pageNumber==1 || this.pageNumber==2){this.limitStartPage=0}
    if(this.pageNumber>2){this.limitStartPage=this.pageNumber-3}
    if(this.pageNumbersArray.length == this.pageNumber){this.limitEndPage=this.pageNumber}
    if(this.pageNumbersArray.length >= this.pageNumber){this.limitEndPage=this.pageNumber+1}
    let auxPaginas = this.pageNumbersArray
    let auxPaginasShow = []
    var i = 0
    for(let page of this.pageNumbersArray){
      if(i >= this.limitStartPage && i <= this.limitEndPage){
        auxPaginasShow.push(page)
      }
      i++
    }
    this.pageNumbersArray = auxPaginasShow
    var pageNumberSelected=this.pageNumber
    var totalPages = auxPaginas.length
    this.labelTotalItems = "Muestra los registros del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
    this.labelTotalPagination = "Página: "+pageNumberSelected+" de "+totalPages;
  }


  orderBy(sin_orden: any) {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1, n2) => {
      if (n1.user.email > n2.user.email) {
        return 1;
      }
      if (n1.user.email < n2.user.email) {
        return -1;
      }
      return 0;
    });
  }

  clearValues() {
    this.usuarioNombre = '';
    this.usuarioEmail = '';
    this.usuarioSelected = 0;
  }

  clearUsuario(){
    this.usuarioNombre = '';
    this.usuarioEmail = '';
    this.search = '';
    this.usuarioSelected = 0;
    this.afiliaciones = [];
    this.loadAfiliacion();
    this.campus = [];
    this.loadCampus();
    this.afiliacionSelected = 0;
    this.campusSelected = 0;
    this.mensaje = 'inicio';
  }

  onNewParticipationButtonClick() {
    this.clearValues()
    if (!this.permisosScicomService.canAgregarParticipacionEvento(this.eventoId)) {
      if (this.currentUsuarioScicomId === undefined) {
        //generar usuario con rol de participante
        this.loadingCount++
        this.eventService.addScicomUser(0, this.authService.getUserEnLocal().id, this.eventoId)
          .subscribe((id: any) => {
            this.loadingCount--
            this.currentUsuarioScicomId = id
            this.navigateToNewParticipation()
          }, (err) => {
            this.loadingCount--
            console.error(err)
            Swal.fire({icon: 'error', text: 'Error al registrarlo como usuario SCICOM'})
          })
      } else {
        this.navigateToNewParticipation()
      }

    }
  }

  navigateToNewParticipation() {
    this.router.navigate([`/scicom/foro/${this.eventoId}/event-participation-new/${this.currentUsuarioScicomId}`])
  }

  permiteRegistrarParticipacion() {
    return !(this.permisosScicomService.canAgregarPreevaluacionTrabajoEvento(this.eventoId)
      && (!this.permisosScicomService.canEliminarTipoTrabajoEvento(this.eventoId)))
  }

  cambiarTipoReporte(tipo_reporte:string){
    this.tipoReporte = tipo_reporte;
    console.log("tipo de reporte", this.tipoReporte);
  }

  orderByCampus(sin_orden: any) {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1, n2) => {
      if (n1.campus > n2.campus) {
        return 1;
      }
      if (n1.campus < n2.campus) {
        return -1;
      }
      return 0;
    });
  }

  exportToExcelRep1(): void {
    this.loadingCount++
    this.eventService.getRegistrosToExcel(this.eventoId).subscribe((resExcel: any) => {
      this.loadingCount--
      this.datosCompletosExportar = resExcel;
      this.sendToExcelRep1();
      this.limpiarFiltrosReportes();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  exportToExcelRep2(): void {
    this.loadingCount++
    this.eventService.getRegistrosToExcelRep2(this.rorId,this.repFechaInicio,this.repFechaFinal).subscribe((resExcel: any) => {
      this.loadingCount--
      this.datosCompletosExportar = resExcel;
      this.sendToExcelRep2();
      this.limpiarFiltrosReportes();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  exportToExcelRep3(): void {
    this.loadingCount++
    this.eventService.getRegistrosToExcelRep3(this.rorId,this.repFechaInicio,this.repFechaFinal,this.eventoId).subscribe((resExcel: any) => {
      this.loadingCount--
      this.datosCompletosExportar = resExcel;
      this.sendToExcelRep3();
      this.limpiarFiltrosReportes();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  exportToExcelRep4(): void {
    this.loadingCount++
    this.eventService.getRegistrosToExcelRep4(this.rorId,this.repFechaInicio,this.repFechaFinal,this.eventoId).subscribe((resExcel: any) => {
      this.loadingCount--
      this.datosCompletosExportar = resExcel;
      this.sendToExcelRep4();
      this.limpiarFiltrosReportes();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  limpiarFiltrosReportes(){
    this.tipoReporte = "reporte1";
    this.repShowFechaInicio = "";
    this.repShowFechaFinal = "";
    this.mensaje3 = 1;
    this.mensaje4 = 1;
  }

  sendToExcelRep1(): void {
    this.participacionesExportar = [];
    for(let p of this.datosCompletosExportar){
      var campus = '';
      var nombre = '';
      var rango = '';
      var rol = '';
      var nivel = '';
      var conferencista = '';
      var conferencia = '';
      var institucion = '';
      var puesto = '';
      var carteles_pro = '';
      var carteles_real = '';
      var carteles_por = '';
      var estudiantes_pro = '';
      var estudiantes_real = '';
      var estudiantes_por = '';
      var ods = '';
      var hombres = '0';
      var mujeres = '0';
      var pnd = '0';
      var sddg = '0';
      var razon = 0;

      if(p.hasOwnProperty('campus')){
        if(p.campus.length > 0){
          for(let c of p.campus){
            if(campus == ""){ campus = c.nombre }else{ campus += ", "+c.nombre }
          }
        }
      }

      if(p.hasOwnProperty('user')){ nombre = p.user.name; }

      if(p.hasOwnProperty('rangos_tiempo_realizacion')) {
        if (p.rangos_tiempo_realizacion.length > 0 ) {
          var duracion = p.rangos_tiempo_realizacion[0]
          rango = moment(duracion.tiempo_inicio).format('YYYY-MM-DD')+" - "+moment(duracion.tiempo_final).format('YYYY-MM-DD');
        }
      }

      if(p.hasOwnProperty('nombre_rol')){ rol = p.nombre_rol; }

      if(p.hasOwnProperty('niv_desarr_for_enc_unit_uvm_evento')){ nivel = p.niv_desarr_for_enc_unit_uvm_evento; }

      if(p.hasOwnProperty('conferencias')){
        var conferencias = p.conferencias;

        if(conferencias.hasOwnProperty('autores_trab')){
          if(conferencias.autores_trab.length > 0){
            conferencista = p.conferencias.autores_trab[0].nombre_autor_trab;
            if(p.conferencias.autores_trab[0].instituciones_ror_autor_trab[0]){
              institucion = p.conferencias.autores_trab[0].instituciones_ror_autor_trab[0].institution_name;
            }
            if(p.conferencias.autores_trab[0].puesto_autor_trab){
              puesto = p.conferencias.autores_trab[0].puesto_autor_trab;
            }
          }
        }

        if(conferencias.hasOwnProperty('conjs_meta_trab')){
          if(conferencias.conjs_meta_trab.length > 0){
            conferencia = p.conferencias.conjs_meta_trab[0].titulo_conj_meta;
          }
        }

      }

      if(p.hasOwnProperty('pronostico_carteles')){ carteles_pro = p.pronostico_carteles; }
      if(p.hasOwnProperty('cant_real_carteles')){ carteles_real = p.cant_real_carteles; }
      if(p.hasOwnProperty('avance_carteles')){ carteles_por = p.avance_carteles; }
      if(p.hasOwnProperty('pronostico_estudiantes')){ estudiantes_pro = p.pronostico_estudiantes; }
      if(p.hasOwnProperty('cant_real_estudiantes')){ estudiantes_real = p.cant_real_estudiantes; }
      if(p.hasOwnProperty('avance_estudiantes')){ estudiantes_por = p.avance_estudiantes; }

      if(p.hasOwnProperty('ods')){
        if(p.ods.length > 0){
          for(let o of p.ods){
            if(ods == ""){ ods = o.nombre_obj_ind }else{ ods += ", "+o.nombre_obj_ind }
          }
        }
      }

      if(p.hasOwnProperty('cant_estudiantes_hombres')){ hombres = p.cant_estudiantes_hombres; }
      if(p.hasOwnProperty('cant_estudiantes_mujeres')){ mujeres = p.cant_estudiantes_mujeres; }
      if(p.hasOwnProperty('cant_estudiantes_prefieren_no_decir')){ pnd = p.cant_estudiantes_prefieren_no_decir; }
      if(p.hasOwnProperty('cant_estudiantes_sin_datos_de_genero')){ sddg = p.cant_estudiantes_sin_datos_de_genero; }

      if(p.hasOwnProperty('razon_tiempo_transc_vs_realiz')){ razon = p.razon_tiempo_transc_vs_realiz; }

      this.participacionesExportar.push({
        campus:campus,
        nombre:nombre,
        rango:rango,
        rol:rol,
        nivel:nivel,
        conferencista:conferencista,
        conferencia:conferencia,
        institucion:institucion,
        puesto:puesto,
        carteles_pro:carteles_pro,
        carteles_real:carteles_real,
        carteles_por:carteles_por,
        estudiantes_pro:estudiantes_pro,
        estudiantes_real:estudiantes_real,
        estudiantes_por:estudiantes_por,
        ods:ods,
        hombres:hombres,
        mujeres:mujeres,
        pnd:pnd,
        sddg:sddg,
        razon:razon
      })
    }

    this.orderByCampus(this.participacionesExportar);

    const udt: ExcelJson = {// table header
      data: [{
        A:'Campus',
        B:'Nombre de quien carga la información',
        C:'Rol de quien carga la información',
        D:'Fecha de realización',
        E:'Nivel',
        F:'Nombre del conferencista',
        G:'Título de la conferencia',
        H:'Institución del conferencista',
        I:'Puesto o cargo del conferencista',
        J:'Total de carteles pronosticados',
        K:'Total de carteles reales',
        L:'% de cumplimiento de carteles',
        M:'Total de estudiantes pronosticados',
        N:'Total de estudiantes reales',
        O:'% de cumplimiento de estudiantes',
        P:'ODS abordados',
        Q:'No. de hombres',
        R:'No. de mujeres',
        S:'No. de personas que prefieren no decir',
        T:'No. de personas sin datos de género'
      },], skipHeader: true,
    };

    this.participacionesExportar.forEach((item: any) => {
      udt.data.push({
        A:item.campus,
        B:item.nombre,
        C:item.rol,
        D:item.rango,
        E:item.nivel,
        F:item.conferencista,
        G:item.conferencia,
        H:item.institucion,
        I:item.puesto,
        J:item.carteles_pro,
        K:item.carteles_real,
        L:item.carteles_por,
        M:item.estudiantes_pro,
        N:item.estudiantes_real,
        O:item.estudiantes_por,
        P:item.ods,
        Q:item.hombres,
        R:item.mujeres,
        S:item.pnd,
        T:item.sddg,
        U:item.razon
      });
    });
    const edata: Array<ExcelJson> = [];
    edata.push(udt);
    this.exportService.exportRegistrosToExcel(edata, 'Reporte de seguimiento de registros - '+this.nombre+' '+moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
  }

  sendToExcelRep2(): void {
    this.participacionesExportar = [];
    for(let p of this.datosCompletosExportar){

      this.participacionesExportar.push({
        id_campus:p.id_campus,
        nomb_campus:p.nomb_campus,
        cant_foros:p.cant_foros,
        cant_carteles:p.cant_carteles,
        cant_estudntes:p.cant_estudntes
      })
    }

    this.orderByCampus(this.participacionesExportar);

    const udt: ExcelJson = {// table header
      data: [{
        A:'ID campus',
        B:'Campus',
        C:'Cantidad de foros',
        D:'Cantidad de carteles',
        E:'Cantidad de estudiantes'
      },], skipHeader: true,
    };

    this.participacionesExportar.forEach((item: any) => {
      udt.data.push({
        A:item.id_campus,
        B:item.nomb_campus,
        C:item.cant_foros,
        D:item.cant_carteles,
        E:item.cant_estudntes
      });
    });
    const edata: Array<ExcelJson> = [];
    edata.push(udt);
    this.exportService.exportRep2ToExcel(edata, 'Reporte de estadísticas de foro, cartel, estudiante por institución agrupado por campus UVM - '+this.nombre+' '+moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
  }

  sendToExcelRep3(): void {
    this.participacionesExportar = [];

    for(let p of this.datosCompletosExportar){
      this.participacionesExportar.push({
        id_campus: p.id_campus,
        nomb_campus: p.nomb_campus,
        id_ciclo: p.data[0].id_ciclo,
        nomb_ciclo: p.data[0].nomb_ciclo,
        cant_foros: p.data[0].cant_foros,
        cant_carteles: p.data[0].cant_carteles,
        cant_estudntes: p.data[0].cant_estudntes,
        tiempo_inicio: moment(p.data[0].fechas[0].tiempo_inicio).format('YYYY-MM-DD'),
        tiempo_final: moment(p.data[0].fechas[0].tiempo_final).format('YYYY-MM-DD'),
      })
    }

    this.orderByCampus(this.participacionesExportar);

    const udt: ExcelJson = {// table header
      data: [{
        A:'ID campus',
        B:'Campus',
        C:'ID ciclo',
        D:'Ciclo',
        E:'Cantidad de foros',
        F:'Cantidad de carteles',
        G:'Cantidad de estudiantes',
        H:'Fecha inicio',
        I:'Fecha final'
      },], skipHeader: true,
    };

    this.participacionesExportar.forEach((item: any) => {
      udt.data.push({
        A:item.id_campus,
        B:item.nomb_campus,
        C:item.id_ciclo,
        D:item.nomb_ciclo,
        E:item.cant_foros,
        F:item.cant_carteles,
        G:item.cant_estudntes,
        H:item.tiempo_inicio,
        I:item.tiempo_final
      });
    });
    const edata: Array<ExcelJson> = [];
    edata.push(udt);
    this.exportService.exportRep3ToExcel(edata, 'Reporte de estadísticas de foro, cartel, estudiante por ciclo agrupado por campus UVM - '+this.nombre+' '+moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
  }

  sendToExcelRep4(): void {
    this.participacionesExportar = [];

    for(let p of this.datosCompletosExportar){
      this.participacionesExportar.push({
        id_ciclo: p.id_ciclo,
        nomb_ciclo: p.nomb_ciclo,
        cant_foros: p.cant_foros,
        cant_carteles: p.cant_carteles,
        cant_estudntes: p.cant_estudntes,
        tiempo_inicio: moment(p.fechas[0].tiempo_inicio).format('YYYY-MM-DD'),
        tiempo_final: moment(p.fechas[0].tiempo_final).format('YYYY-MM-DD'),
      })
    }

    this.orderByCampus(this.participacionesExportar);

    const udt: ExcelJson = {// table header
      data: [{
        A:'ID ciclo',
        B:'Ciclo',
        C:'Cantidad de foros',
        D:'Cantidad de carteles',
        E:'Cantidad de estudiantes',
        F:'Fecha inicio',
        G:'Fecha final'
      },], skipHeader: true,
    };

    this.participacionesExportar.forEach((item: any) => {
      udt.data.push({
        A:item.id_ciclo,
        B:item.nomb_ciclo,
        C:item.cant_foros,
        D:item.cant_carteles,
        E:item.cant_estudntes,
        F:item.tiempo_inicio,
        G:item.tiempo_final
      });
    });
    const edata: Array<ExcelJson> = [];
    edata.push(udt);
    this.exportService.exportRep4ToExcel(edata, 'Reporte de estadísticas de foro, cartel, estudiante por ciclo UVM - '+this.nombre+' '+moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
  }

  loadObjetivos(participacionId:number){
    this.loadingCount++
    this.eventService.getObjetivosIndicadores(this.eventoId).subscribe((resObj: any) => {
      this.loadingCount--
      var auxObjetivosParticipacion = [];
      for(let ro of resObj){
        if(ro.id_participacion==participacionId){
          auxObjetivosParticipacion.push(ro)
        }
      }
      for(let aop of auxObjetivosParticipacion){
        if(aop.id_indicador==11){
          this.pronosticoCartelesId=aop.id;
          this.pronosticoCarteles=aop.valor_objetivo;
        }
        if(aop.id_indicador==4){
          this.pronosticoEstudiantesId=aop.id;
          this.pronosticoEstudiantes=aop.valor_objetivo;
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo la lista de indicadores'});
      console.error(err)
    });
  }

  searchUsuarios(){
    this.loadingCount++
    this.eventService.searchUser(this.eventoId,this.searchUser).subscribe((res: any) => {
      this.loadingCount--
      //console.log("res",res)
      const idsUsers = res.map((value: any) => value.id)
      //console.log("idsUsers",idsUsers)
      this.searchParticipáciones(idsUsers);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los estatus de trabajo del sistema'});
      console.error(err)
    });
  }

  searchParticipáciones(idsUsers:Array<number>){
    this.loadingCount++
    this.eventService.getParticipationSearch(this.eventoId,idsUsers).subscribe((res: any) => {
      this.loadingCount--
      this.participations = res;
      this.pageNumber=1;
      this.loadPagination();
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron las participaciones del evento especificado'});
      console.error(err)
    });
  }

  orderByType(sin_orden:any,campo:string,orden:string){
    let con_orden:any[]=sin_orden;
    con_orden.sort((n1,n2) => {
      if(campo=='nombre'){
        if(orden=='asc'){
          if(n1.nombre>n2.nombre){return 1;}
          if(n1.nombre<n2.nombre){return -1;}
        }else if(orden=='desc'){
          if(n1.nombre<n2.nombre){return 1;}
          if(n1.nombre>n2.nombre){return -1;}
        }
      }
      if(campo=='id'){
        if(orden=='asc'){
          if(n1.id>n2.id){return 1;}
          if(n1.id<n2.id){return -1;}
        }else if(orden=='desc'){
          if(n1.id<n2.id){return 1;}
          if(n1.id>n2.id){return -1;}
        }
      }
      return 0;
    });
  }

  addCampusToParticipation(){
    if(this.campusParticipacionSelected!=0){
      for(let c of this.campusTotalList){
        if(c.id == this.campusParticipacionSelected){
          this.campusParticipacion.push(c)
          this.campusSinParticipacion = this.campusSinParticipacion.filter((cnd:any) => cnd.id != this.campusParticipacionSelected)
          this.campusParticipacionSelected = 0
        }
      }
    }
  }

  delCampusToParticipation(idCampus:number){
    for(let c of this.campusTotalList){
      if(c.id == idCampus){
        this.campusSinParticipacion.push(c)
        this.campusParticipacion = this.campusParticipacion.filter((cnd:any) => cnd.id != idCampus)
        this.campusParticipacionSelected = 0
      }
    }
  }

  updateNumEmpleadoToParticipation(){
    this.loadingCount++
    this.eventService.addNoEmpleadoToUser(this.participacionIdUsuario,this.noEmpleadoParticipacion).subscribe((res:any) => {
      this.loadingCount--
      this.updateCampusToParticipation()
      console.info("Se actualizo el numero de empleado al usuario scicom")
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se actualizo el numero de empleado al usuario scicom'});
      console.error(err)
    });
  }

  updateCampusToParticipation(){
    this.loadingCount++
    this.eventService.getUsuarioById(this.eventoId,this.participacionIdUsuario).subscribe((res: any) => {
      this.loadingCount--
      var auxCampus = []
      for(let r of res){if(r.campus.length!=0){auxCampus = r.campus}}
      const idsCampusElim = auxCampus.map((value:any) => value.id)
      this.loadingCount++
      this.eventService.removeCampusToUserParticipation(this.participacionIdUsuario,idsCampusElim).subscribe((res: any) => {
        this.loadingCount--
        const idsCampusAdd = this.campusParticipacion.map((value:any) => value.id)
        this.loadingCount++
        this.eventService.addCampusToUserParticipation(this.participacionIdUsuario,idsCampusAdd).subscribe((res: any) => {
          this.loadingCount--
          this.ngOnInit()
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

  updateParticipacion(){
    this.updateNumEmpleadoToParticipation()
  }

  validateNoEmpleado(){
    if(this.noEmpleadoParticipacion>9999999999){
      this.validEmpleadoNumberParticipation = true
    }else if(this.noEmpleadoParticipacion==0){
      this.validEmpleadoNumberParticipation = true
    }else if(!this.noEmpleadoParticipacion){
      this.validEmpleadoNumberParticipation = true
    }else{
      this.validEmpleadoNumberParticipation = false
    }
  }

  modalUpdatePaticipation(part:any){
    this.validNumEmpleado=0
    this.validCelular=0
    this.validFechaInicio=0
    this.validFechaFinal=0
    this.validCampus=0
    this.validPronosticoCarteles=0
    this.validPronosticoEstudiantes=0
    this.validTodo=false;
    this.campusSelected=0;
    this.partId=part.id;
    this.partUsuarioId=part.id_usuario;
    var campus = [];
    for(let pu of this.participacionUsuario){
      if(part.id_usuario==pu.id){
        this.usuarioId=pu.id_user;
        this.partUsuario=pu.user.name;
        this.partEmail=pu.user.email;
        this.partCelular=pu.num_celular;
        this.partNumEmpleado=pu.num_empleado;
        this.partCampusGuardados=pu.campus;
        campus=pu.campus;
      }
    }
    for(let fe of this.fechasEvento){
      if(part.id==fe.id_participacion) {
        this.partRangoTiempoId=fe.id;
        this.setFechaInicio(moment(fe.tiempo_inicio,'YYYY-MM-DD').format('DD-MM-YYYY'));
        this.setFechaFinal(moment(fe.tiempo_final,'YYYY-MM-DD').format('DD-MM-YYYY'));
      }
    }
    let auxCampus = [];
    for(let c of campus){
      for(let ctl of this.campusTotalList){
        if(c.id==ctl.id){
          auxCampus.push(ctl)
        }
      }
    }
    this.partCampus=auxCampus;
    //console.log("this.partCampus",this.partCampus);
    this.partCampusDisponibles=this.campusList;
    //console.log("this.partCampusDisponibles",this.partCampusDisponibles);
    for(let pcd of this.partCampus){
      this.partCampusDisponibles = this.partCampusDisponibles.filter( (camp: any) => camp.id != pcd.id)
    }
    //console.log("this.partCampusDisponibles",this.partCampusDisponibles);
    this.loadObjetivos(part.id);
  }

  agregarCampus(){
    var auxCampus = this.partCampusDisponibles;
    for(let ct of this.campusTotalList){
      if(ct.id==this.campusSelected){
        this.partCampus.push(ct)
      }
    }
    this.partCampusDisponibles = auxCampus.filter( (camp: any) => camp.id != this.campusSelected)
    this.campusSelected=0;
    this.validarCampus();
  }

  removerCampus(idCampus:number){
    var auxCampus = this.partCampus;
    for(let ct of this.campusTotalList){
      if(ct.id==idCampus){
        this.partCampusDisponibles.push(ct)
      }
    }
    this.partCampus = auxCampus.filter( (camp: any) => camp.id != idCampus)
    this.campusSelected=0;
    this.validarCampus();
  }

  validarNoEmpleado(){
    if(this.partNumEmpleado>9999999999){
      this.validNumEmpleado = 2
    }else if(this.partNumEmpleado==0){
      this.validNumEmpleado = 1
    }else if(!this.partNumEmpleado){
      this.validNumEmpleado = 1
    }else{
      this.validNumEmpleado = 0
    }
    this.validAll();
  }

  validarNoCelular(){
    if(this.partCelular<999999999){
      this.validCelular = 2
    }else if(this.partCelular>9999999999){
      this.validCelular = 2
    }else if(this.partCelular==0){
      this.validCelular = 1
    }else if(!this.partCelular){
      this.validCelular = 1
    }else{
      this.validCelular = 0
    }
    this.validAll();
  }

  validarFechas(){
    if(this.partFechaInicio=='' && this.partFechaFinal==''){
      this.validFechaInicio=1;
      this.validFechaFinal=1;
    }else if(this.partFechaInicio=='' && this.partFechaFinal!=''){
      this.validFechaInicio=1;
      this.validFechaFinal=3;
    }else if(this.partFechaInicio!='' && this.partFechaFinal==''){
      this.validFechaInicio=0;
      this.validFechaFinal=1;
    }else if(this.partFechaInicio!='' && this.partFechaFinal!=''){
      this.validFechaInicio = 0;
      this.validFechaFinal = 0;
      if(this.eventoFechaInicio > this.partFechaInicio){
        this.validFechaInicio = 4;
      }else{
        this.validFechaInicio = 0;
      }
      if(this.partFechaFinal > this.eventoFechaFinal){
        this.validFechaFinal = 4;
      }else{
        this.validFechaFinal = 0;
      }
      if(this.partFechaInicio >= this.partFechaFinal){
        this.validFechaInicio = 2;
        this.validFechaFinal = 2;
      }
    }
    this.validAll();
  }

  validarCampus(){
    if(this.partCampus.length<=0){
      this.validCampus=1;
    }else{
      this.validCampus=0;
    }
    this.validAll();
  }

  validarPronosticoCarteles(){
    if(this.pronosticoCarteles>0 && this.pronosticoCarteles!=null){
      this.validPronosticoCarteles=0;
    }else{
      this.validPronosticoCarteles=1;
    }
    this.validAll();
  }

  validarPronosticoEstudiantes(){
    if(this.pronosticoEstudiantes>0 && this.pronosticoEstudiantes!=null){
      this.validPronosticoEstudiantes=0;
    }else{
      this.validPronosticoEstudiantes=1;
    }
    this.validAll();
  }

  validAll(){
    if(this.validNumEmpleado==0 &&
      this.validCelular==0 &&
      this.validFechaInicio==0 &&
      this.validFechaFinal==0 &&
      this.validCampus==0 &&
      this.validPronosticoCarteles==0 &&
      this.validPronosticoEstudiantes==0
    ){
      this.validTodo=false;
    }else{
      this.validTodo=true;
    }
  }

  setFechaInicio(fecha: any) {
    this.showFechaInicio = fecha;
    this.repFechaInicio = this.dateStringToIso8601Start(fecha);
  }

  setFechaFinal(fecha: any) {
    this.showFechaFinal = fecha;
    this.repFechaFinal = this.dateStringToIso8601End(fecha);
  }

  setFechaInicioRep(fecha: any) {
    this.repShowFechaInicio = fecha;
    this.repFechaInicio = this.dateStringToIso8601Start(fecha);
  }

  setFechaFinalRep(fecha: any) {
    this.repShowFechaFinal = fecha;
    this.repFechaFinal = this.dateStringToIso8601End(fecha);
  }

  dateStringToIso8601Start(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').startOf('day').valueOf())).toISOString()
  }

  dateStringToIso8601End(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').endOf('day').valueOf())).toISOString()
  }

  validateInput = (validate?:string) => {
      if(this.repFechaInicio==''){this.mensaje3=2}else{this.mensaje3=1;}
      if(this.repFechaFinal!=''){
        if(this.repFechaInicio >= this.repFechaFinal){this.mensaje3=3}
        if(this.repFechaInicio == this.repFechaFinal){this.mensaje3=1}
      }
      if(this.repFechaFinal==''){this.mensaje4=2}else{this.mensaje4=1}
      if(this.repFechaInicio!=''){
        if(this.repFechaFinal <= this.repFechaInicio){this.mensaje4=3}
        if(this.repFechaInicio == this.repFechaFinal){this.mensaje4=1}
      }else{
        this.mensaje4=4;
      }

      if(!this.repFechaInicio && !this.repFechaFinal){
        var year_inicio = moment(this.repFechaInicio).format('yyyy');
        var year_final = moment(this.repFechaFinal).format('yyyy');
        if( year_inicio != year_final){
          this.mensaje3=5;
          this.mensaje4=5;
        }
      }
  }

  actualizarParticipacion(){
    this.eventService.updateUser(this.partUsuarioId,this.partNumEmpleado,this.partCelular).subscribe((res:any) => {
      console.log("se actualizo el usuario");
      this.actualizarCampusToUser();
      this.actualizarRango();
      this.updatePronosticsCarteles();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se agregó el agrego el numero de usuario y celular al usuario scicom'});
      console.error(err)
    });
  }

  actualizarCampusToUser(){
    if(this.partCampusGuardados.length>0){
      //console.log("this.partCampusGuardados",this.partCampusGuardados)
      const idsCampus = this.partCampusGuardados.map((value: any) => value.id)
      this.loadingCount++
      this.eventService.removeCampusToUserParticipation(this.partUsuarioId,idsCampus).subscribe((res: any) => {
        this.loadingCount--
        console.log("campus eliminados",res);
        this.ligarCampusToUser()
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se agregó el campus al usuario scicom especificado'});
        console.error(err)
      });
    }else{
      this.ligarCampusToUser()
    }
  }

  ligarCampusToUser(){
    if(this.partCampus.length>0) {
      const idsCampus = this.partCampus.map((value: any) => value.id)
      //console.log("idsCampus",idsCampus)
      this.loadingCount++
      this.eventService.addCampusToUserParticipation(this.partUsuarioId, idsCampus).subscribe((res: any) => {
        this.loadingCount--
        this.loadUsuariosEvento();
        console.log("campus agregados",res);
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se agregó el campus al usuario scicom especificado'});
        console.error(err)
      });
    }
  }

  actualizarRango(){
    this.loadingCount++
    this.eventService.getRangeEventByParticipation(this.eventoId,this.partId,this.tipoRangoTiempoId).subscribe((resRange: any) => {
      this.loadingCount--
      const ranges = resRange
      this.loadingCount++
      this.eventService.updateDateEvent(this.partRangoTiempoId,this.partFechaInicio,this.partFechaFinal,this.tipoRangoTiempoId).subscribe((resI: any) => {
        this.loadingCount--
        console.log("fechas actualizadas");
        this.loadRangeEvent();
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

  updatePronosticsCarteles(){
    if(this.pronosticoCartelesId!=0 && this.pronosticoCarteles!=undefined && this.pronosticoCarteles!=0){
      var cartelesDescripcion="Descripción de cartel";
      var cartelesTipo="pronostico";
      this.loadingCount++
      this.eventService.updateObjsIndicador(this.pronosticoCartelesId,cartelesDescripcion,this.pronosticoCarteles,cartelesTipo).subscribe((resCarteles: any) => {
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
    if(this.pronosticoEstudiantesId!=0 && this.pronosticoEstudiantes!=undefined && this.pronosticoEstudiantes!=0){
      var estudianteDescripcion="Descripcion de estudiante/autor";
      var estudianteTipo="pronostico";
      this.loadingCount++
      this.eventService.updateObjsIndicador(this.pronosticoEstudiantesId,estudianteDescripcion,this.pronosticoEstudiantes,estudianteTipo).subscribe((resEstudiante: any) => {
        this.loadingCount--
        this.loadParticipation();
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se agregaron los pronósticos al evento'});
        console.error(err)
      });
    }else{
      this.loadParticipation();
    }
  }

}

