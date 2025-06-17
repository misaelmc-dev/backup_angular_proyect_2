import {Component,OnInit ,Input } from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {CampusService} from "../../../../../services/scicom/campus.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-campus',
  templateUrl: './event-campus.component.html',
  styleUrls: ['./event-campus.component.css']
})
export class EventCampusComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  eventoInfo:any=[];

  instituciones:any=[];

  campus:any[]=[];
  campusAsing:any[]=[];
  campusNoAsing:any[]=[];

  campusSelected:number;

  pageNumber:number = 1;
  pageSize:number = 10;
  totalItems:number = 0;

  loadingCount: number = 0; //cuenta el número de elementos cargando

  titulo:boolean = false;

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              public permisosScicomService: PermisosScicomService,
              public campusService: CampusService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadTitle();
    this.loadEventos();
  }

  loadTitle = () => {
    if(this.router.url.includes('/event-update/')){
      this.titulo = true;
    }
  }

  loadEventos = () => {
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((resEvent: any) => {
        this.loadingCount--
        this.eventoInfo = resEvent[0];
        this.loadInstitucion()
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadInstitucion() {
    const idRorCoord = this.eventoInfo.rors_editoras.filter((value: any) => value.pivot.creador == true)[0].id
    this.loadingCount++
    if (idRorCoord) {
      this.eventService.getInstitucionList([idRorCoord]).subscribe((resInst: any) => {
        this.loadingCount--
        this.instituciones = resInst;
        this.cordId = resInst[0].id
        this.loadCampus();
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar la institución creadora del evento'});
        console.error(err)
      });
    }
  }

  loadCampus = () => {
    if(this.eventoId!=0){
      this.loadingCount++
      this.campusService.getCampusListByCord([this.cordId]).subscribe((resCamp: any) => {
        this.loadingCount--
        this.campus = resCamp ;
        this.loadingCount++
        this.campusService.getCampusByEvent(this.pageNumber,this.pageSize,[this.eventoId]).subscribe((resCampAsig: any) => {
          this.loadingCount--
          this.campusAsing = resCampAsig.data ;
          this.totalItems = resCampAsig.total;
          this.campusNoAsing = this.campus;
          for(let camp of this.campusAsing){
            this.campusNoAsing = this.campusNoAsing.filter( (value: any) => {
              return value.id != camp.id
            })
          }
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se cargaron los campus asociados al evento especificado'});
          console.error(err)
        });
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los campus de la institución especificada'});
        console.error(err)
      });
    }
  }

  asingCampus = () => {
    if(this.campusSelected!=0){
      this.loadingCount++
      this.eventService.addCampusToEvent(this.campusSelected,this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.pageNumber = 1;
        this.loadingCount++
        this.notificacionesScicomService.sendNotificationAddCampusEvento(this.eventoId,this.campusSelected).subscribe((res:any) => {
          this.loadingCount--
          console.info("NotificationAddCampusEvento")
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
        });
        this.loadCampus();
        Swal.fire({icon: 'success',text: 'El campus se agregó'});
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se agregó el campus al evento'});
        console.error(err)
      });
    }
  }

  removeCampus = (campusId:number) => {
    Swal.fire({
      title: '¿Deseas eliminar el campus?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventService.removeCampusToEvent(campusId,this.eventoId).subscribe((res: any) => {
          this.loadingCount--
          this.pageNumber = 1;
          this.loadingCount++
          this.notificacionesScicomService.sendNotificationDelCampusEvento(this.eventoId,campusId).subscribe((res:any) => {
            this.loadingCount--
            console.info("NotificationDelCampusEvento")
          }, (err:any) =>{
            this.loadingCount--
            console.error(err)
          });
          this.loadCampus()
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al eliminar el campus especificado del evento'});
          console.error(err)
        });
      }
    })
  }

  cleanValues = () => {
    this.campusSelected = 0 ;
  }

  cambiarPagina(event?:number){
    this.pageNumber = event
    this.loadCampus()
  }

}
