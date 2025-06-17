import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../services/event.service";
import {ExportService} from "../../../../services/export.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PermisosScicomService} from "../../../../services/scicom/permisos-scicom.service";
import {AuthService} from "../../../../services/auth.service";
import {NotificacionesScicomService} from "../../../../services/scicom/notificaciones-scicom.service";
import {ExcelJson} from "../../../../interfaces/excel-json";

@Component({
  selector: 'app-event-participants',
  templateUrl: './event-participants.component.html',
  styleUrls: ['./event-participants.component.css']
})
export class EventParticipantsComponent implements OnInit {

  cordId?: number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?: number = Number(this.route.snapshot.paramMap.get('idevent'));

  participations: any[] = [];
  participacionUsuario: any[] = [];
  participacionUsuarioDisponibles: any[] = [];
  typeParticipation: any[] = [];
  typeParticipationAsign: any[] = [];
  typeParticipationNoAsign: any[] = [];

  participationEstatus: any[] = [];

  usuarioSelected: number = 0;

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

  reporteConTrabajos: boolean = false;
  reportePartAgrupados: boolean = false;
  participacionesExportar:any[] = [];
  datosExportar:any[] = [];

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
    this.loadUsuariosEvento();
    this.loadCurrentScicomUser()
    this.formEmails = new FormGroup({
      email: new FormControl(this.usuarioEmail, [
        Validators.required,
        Validators.email
      ])
    });
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

  loadEventos = () => {
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

  loadParticipation = () => {
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
      this.participations = res;
      this.loadPagination();
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron las participaciones del evento especificado'});
      console.error(err)
    });
  }

  loadParticipationEstatus() {
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

  loadUsuariosEvento() {
    if (this.eventoId != 0) {
      this.loadingCount++
      this.eventService.getUsuariosEvento(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.orderBy(res);
        this.participacionUsuario = res;
        var usuarios = this.participacionUsuario;
        for (let pu of this.participacionUsuario) {
          for (let p of this.participations) {
            usuarios = usuarios.filter((u: any) => u.id != p.id_usuario);
          }
        }
        this.participacionUsuarioDisponibles = usuarios;
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

  loadRor() {
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

  asignarRor = () => {
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
      title: '¿Deseas eliminar la participación?',
      html: '<h5>Esta acción eliminará cualquier material asociado a esta.</h5>',
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
          this.notificacionesScicomService.sendNotificationDelParticipEvento(participacion.id).subscribe((res: any) => {
            this.loadingCount--
            console.info("NotificationDelParticipEvento")
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

  loadPagination = (pageValue?:any) => {
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
    this.labelTotalItems = "Muestra eventos del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
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

  clearUsuario = () => {
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
    this.router.navigate([`/scicom/api/${this.eventoId}/event-participation-new/${this.currentUsuarioScicomId}`])
  }

  permiteRegistrarParticipacion() {
    return !(this.permisosScicomService.canAgregarPreevaluacionTrabajoEvento(this.eventoId)
      && (!this.permisosScicomService.canEliminarTipoTrabajoEvento(this.eventoId)))
  }

  opcionesExportar(opcion:string){
    switch (opcion){
      case 'contrabajos': this.reporteConTrabajos = true; break;
      case 'sintrabajos': this.reporteConTrabajos = false;
                          this.reportePartAgrupados  = false; break;
      case 'agrupados': this.reportePartAgrupados = true; break;
      case 'sinagrupar': this.reportePartAgrupados  = false; break;
    }
  }

  exportToExcel(): void {
    this.participacionesExportar = [];
    for(let p of this.participations){
      var numempleado = '';
      var nombre = '';
      var correo = '';
      var tipo = '';
      var estatus = '';
      var campus = '';
      var creacion = moment(p.create_time).format('YYYY-MM-DD');
      for(let pu of this.participacionUsuario){if(pu.id==p.id_usuario){
        numempleado = pu.num_empleado
        nombre = pu.user.name
        correo = pu.user.email
      }}
      for(let tp of this.typeParticipationAsign){if(tp.id==p.id_tipo_participacion){tipo = tp.nombre;}}
      for(let pe of this.participationEstatus){if(pe.id==p.id_tipo_participacion){estatus = pe.nombre;}}
      for(let pu of this.participacionUsuario){
        if(pu.id==p.id_usuario){
          campus=''
          for(let c of pu.campus){
            for(let ca of this.campusTotalList){
              if(c.id==ca.id){
                if(campus==''){campus=ca.nombre}else{campus=campus+', '+ca.nombre}
              }
            }
          }
        }
      }
      this.participacionesExportar.push({id:p.id,numempleado:numempleado,nombre:nombre,correo:correo,tipo:tipo,estatus:estatus,campus:campus,creacionpart:creacion})
    }
    if(!this.reporteConTrabajos){
      const udt: ExcelJson = {// table header
        data: [{A:'No. empleado',B:'Nombre',C:'Correo',D:'Tipo',E:'Estatus',F:'Campus',G:'Fecha de registro'},], skipHeader: true,
      };
      this.participacionesExportar.forEach((item: any) => {
        udt.data.push({A:item.numempleado,B:item.nombre,C:item.correo,D:item.tipo,E:item.estatus,F:item.campus,G:item.creacionpart});
      });
      const edata: Array<ExcelJson> = [];
      edata.push(udt);
      if(this.reportePartAgrupados){
        this.exportService.exportArrayToExcel(edata, 'Participaciones registradas en el evento agrupados - '+this.nombre+' '+new Date())
      }else{
        this.exportService.exportArrayToExcel(edata, 'Participaciones registradas en el evento - '+this.nombre+' '+new Date())
      }
    }else{
      this.loadParticipationToWorks()
    }
  }

  exportToExcelWorks(){
    const edt: ExcelJson = {// table header
      data: [{
        A:'No. empleado',
        B:'Nombre',
        C:'Correo',
        D:'Tipo de participación',
        E:'Estatus de participación',
        F:'Campus de participación',
        G:'Fecha de registro de participación',
        H:'Título del trabajo',
        I:'Fuente',
        J:'Autores',
        K:'Tipo de trabajo',
        L:'Estatus del trabajo',
        M:'Fecha de registro de trabajo'},],
      skipHeader: true,
    };
    this.datosExportar.forEach((item: any) => {
      edt.data.push({
        A:item.numempleado,
        B:item.nombre,
        C:item.correo,
        D:item.tipo,
        E:item.estatus,
        F:item.campus,
        G:item.creacionpart,
        H:item.tituloTrabajo,
        I:item.fuente,
        J:item.autores,
        K:item.tipotrab,
        L:item.estatustrabajo,
        M:item.creaciontrab
      });
    });
    const udata: Array<ExcelJson> = [];
    udata.push(edt)
    if(this.reportePartAgrupados){
      this.exportService.exportArrayToExcelColor(udata, 'Participaciones registradas en el evento con trabajos agrupados - '+this.nombre+' '+new Date());
    }else{
      this.exportService.exportArrayToExcel(udata, 'Participaciones registradas en el evento con trabajos - '+this.nombre+' '+new Date());
    }
  }

  loadParticipationToWorks(){
    this.datosExportar = [];
    const ids = this.participacionesExportar.map((value: any) => value.id)
    this.loadingCount++
    this.eventService.getWorkByParticipations(this.eventoId,ids).subscribe((res: any) => {
      this.loadingCount--
      this.trabajos = res
      for(let t of this.trabajos){
        for(let p of this.participacionesExportar){
          if(t.id_participacion==p.id){
            this.datosExportar.push({
              id_trab:t.id,
              id_part:p.id,
              id_fuente:t.id_fuente,
              id_tipo:t.id_tipo_trabajo,
              id_estatus:t.id_estatus_trabajo,
              creacionpart:moment(p.creacionpart).format('YYYY-MM-DD'),
              numempleado:p.numempleado,
              nombre:p.nombre,
              correo:p.correo,
              tipo:p.tipo,
              estatus:p.estatus,
              campus:p.campus,
              creaciontrab:moment(t.create_time).format('YYYY-MM-DD')
            })
          }
        }
      }
      this.loadDatos()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los trabajos asignados a la lista de participaciones'});
      console.error(err)
    });
  }

  loadDatos(){
    const ids = this.trabajos.map((value: any) => value.id).join(' ');
    this.loadingCount++
    this.eventService.getMetadatosByWorkIds(this.eventoId,ids).subscribe((res: any) => {
      this.loadingCount--
      this.metadatos = res;
      let auxMetadatos:any = [];
      for(let tm of this.metadatos){
        if(tm.id_idioma == 150){
          if(tm.titulo!=null){
            auxMetadatos = auxMetadatos.filter((value: any) => value.id_trabajo != tm.id_trabajo);
            auxMetadatos.push(tm)
          }
        }else if(tm.id_idioma == 41){
          if(tm.titulo!=null){ auxMetadatos.push(tm) }
        }
      }
      this.metadatosTitulos = auxMetadatos;
      for(let de of this.datosExportar){
        for(let mt of this.metadatosTitulos){
          if(de.id_trab==mt.id_trabajo){
            de.tituloTrabajo = mt.titulo
          }
        }
      }
      this.loadFuentes()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los trabajos del evento especificado'});
      console.error(err)
    });
  }

  loadFuentes(){
    const ids = this.trabajos.map((value: any) => value.id).join(' ');
    this.fuentesCarga = [];
    this.loadingCount++
    this.eventService.getFontsByWorks(ids).subscribe((res: any) => {
      this.loadingCount--
      this.fuentesCarga = res
      for(let de of this.datosExportar){
        for(let fc of this.fuentesCarga){
          if(de.id_fuente==fc.id){
            de.fuente = fc.titulo
          }
        }
      }
      this.loadAutores()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fuentes especificadas'});
      console.error(err)
    });
  }

  loadAutores(){
    const ids = this.trabajos.map((value: any) => value.id).join(' ');
    if(ids && ids != ''){
      this.loadingCount++
      this.eventService.getAuthorByWorks(this.eventoId,ids).subscribe((res: any) => {
        this.loadingCount--
        this.autoresList = res;
        this.orderByType(this.autoresList,'id','asc')
        this.afiliacionesDatos = [];
        const arrIdsAutoresTrab = res.map((value: any) => value.id).join(' ');
        if(arrIdsAutoresTrab && arrIdsAutoresTrab!=''){
          this.loadingCount++
          this.eventService.getRorsByAuthor(arrIdsAutoresTrab).subscribe((res: any) => {
            this.loadingCount--
            this.afiliacionesDatos = res;
            this.loadCampus();
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se cargaron los datos de la institución especificada'});
            console.error(err)
          });
        }
        for(let de of this.datosExportar){
          de.autores = this.autoresList.filter((value) => { return value.id_trabajo == de.id_trab}).map((value: any) => {return value.nombre}).join(', ')
        }
        this.loadWorkType()
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los autores del evento especificado'});
        console.error(err)
      });
    }
  }

  loadWorkType(){
    this.loadingCount++
    this.eventService.getWorkList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.typeWork = res;
      this.loadingCount++
      this.eventService.getWorkAsign(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.typeWorkAsing = res ;
        this.typeWorkNoAsing = this.typeWork;
        for(let camp of this.typeWorkAsing){
          this.typeWorkNoAsing = this.typeWorkNoAsing.filter( (tw:any) => tw.id != camp.id );
        }
        for(let de of this.datosExportar){
          for(let ta of this.typeWorkAsing){
            if(de.id_tipo==ta.id){
              de.tipotrab = ta.nombre
            }
          }
        }
        this.loadWorkEstatus()
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los tipos de trabajo asignados al evento especificado'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de trabajos'});
      console.error(err)
    });
  }

  loadWorkEstatus(){
    this.loadingCount++
    this.eventService.getWorkEstausList().subscribe((res: any) => {
      this.loadingCount--
      this.estatusWork = res;
      for(let de of this.datosExportar){
        for(let ew of this.estatusWork){
          if(de.id_estatus==ew.id){
            de.estatustrabajo = ew.nombre
          }
        }
      }
      this.agruparDatos()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los estatus de trabajo del sistema'});
      console.error(err)
    });
  }

  agruparDatos(){
    this.datosExportar.sort((a,b)=>a.id_part-b.id_part)
    this.exportToExcelWorks()
    /*
    if(this.reportePartAgrupados){
      var id_anterior = ''
      for(let de of this.datosExportar){
        var cantidad = this.datosExportar.filter((c: any) => c.id_part == de.id_part)
        var auxNumEmpleado = ''
        if(de.numempleado==null){de.numempleado=' '}
        if(id_anterior == de.id_part){
          de.numempleado = ''
          de.nombre = ''
          de.correo = ''
          de.tipo = ''
          de.estatus = ''
          de.campus = ''
          de.creacionpart = ''
          de.cantidad = 0
        }else{
          de.cantidad = cantidad.length
        }
        id_anterior = de.id_part
      }
      this.exportToExcelWorks()
    }else{
      this.exportToExcelWorks()
    }*/
  }

  searchUsuarios(){
    this.loadingCount++
    this.eventService.searchUser(this.eventoId,this.searchUser).subscribe((res: any) => {
      this.loadingCount--
      console.log("res",res)
      const idsUsers = res.map((value: any) => value.id)
      console.log("idsUsers",idsUsers)
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

  orderByType = (sin_orden:any,campo:string,orden:string) => {
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

  modalOpenPaticipation(participacionSeleccionada:any){
    this.idParticipacion = participacionSeleccionada.id
    this.participacionIdUsuario = participacionSeleccionada.id_usuario
    for(let pe of this.typeParticipation){
      if(participacionSeleccionada.id_tipo_participacion == pe.id){
        this.tipoParticipacion = pe.nombre
      }
    }
    for(let u of this.participacionUsuario){
      if(participacionSeleccionada.id_usuario == u.id){
        this.nombreParticipacion = u.user.name
        this.correoParticipacion = u.user.email
        this.noEmpleadoParticipacion = u.num_empleado
        this.campusParticipacion = []
        this.campusSinParticipacion = this.campusTotalList
        for(let uc of u.campus){
          for(let c of this.campusTotalList){
            if(uc.id == c.id){
              this.campusParticipacion.push(c)
              this.campusSinParticipacion = this.campusSinParticipacion.filter( ({ id }) => id != uc.id );
            }
          }
        }
      }
    }
    this.validEmpleadoNumberParticipation = false
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
      console.info("Se actualizó el número de empleado al usuario scicom")
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al actualizar el colaborador [número de empleado]'});
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
      if(idsCampusElim.length!=0){
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
      }else{
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
      }
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

}
