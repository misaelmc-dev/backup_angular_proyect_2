import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {TypesWorkService} from "../../../../../services/scicom/types-work.service";

@Component({
  selector: 'app-event-work',
  templateUrl: './event-work.component.html',
  styleUrls: ['./event-work.component.css']
})
export class EventWorkComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  nombre:string="";
  tipo:number;
  estatus:string="";

  work:any[]=[];
  workAsing:any[]=[];
  workNoAsing:any[]=[];

  workSelected:number=0;

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

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              public permisosScicomService: PermisosScicomService,
              public tiposTrabajoService: TypesWorkService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadTitle();
    this.loadEventos();
    this.loadWork();
  }

  loadTitle = () => {
    if(this.router.url.includes('/event-update/')){
      this.titulo = true;
    }
  }

  loadEventos = () => {
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.nombre = res[0].nombre;
        this.tipo = res[0].id_tipo_evento;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los datos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadWork = () => {
    this.loadingCount++
    this.tiposTrabajoService.getTypeWorkByEvent([this.eventoId]).subscribe((resWork: any) => {
      this.loadingCount--
      this.work = resWork;
      //console.log("this.work",this.work)
      this.loadingCount++
      this.tiposTrabajoService.getTypeWorkAsign(this.pageNumber,this.pageSize,[this.eventoId]).subscribe((resWorkAsign: any) => {
        this.loadingCount--
        this.workAsing = resWorkAsign.data ;
        this.totalItems = resWorkAsign.total ;
        this.workNoAsing = this.work;
        for(let item of this.workAsing){
          this.workNoAsing = this.workNoAsing.filter( ({ id }) => id != item.id );
        }
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

  asingWork = () => {
    this.loadingCount++
    this.eventService.addWorkToEvent(this.workSelected,this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.pageNumber = 1;

      this.loadingCount++
      this.notificacionesScicomService.sendNotificationAddTipTrabEvento(this.eventoId,this.workSelected).subscribe((res:any) => {
        this.loadingCount--
        console.info("NotificationAddTipTrabEvento")
      }, (err:any) =>{
        this.loadingCount--
        console.error(err)
      });

      this.loadWork();
      Swal.fire({icon: 'success',text: 'El tipo de trabajo se agregó'});
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asigno el tipo de trabajos al evento especificado'});
      console.error(err)
    });
  }

  removeWork  = (workId:number) => {
    Swal.fire({
      title: '¿Deseas eliminar <br>el tipo de trabajo?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventService.removeWorkToEvent(workId,this.eventoId).subscribe((res: any) => {
          this.loadingCount--
          this.pageNumber = 1;

          this.loadingCount++
          this.notificacionesScicomService.sendNotificationDelTipTrabEvento(this.eventoId,workId).subscribe((res:any) => {
            this.loadingCount--
            console.info("NotificationDelTipTrabEvento")
          }, (err:any) =>{
            this.loadingCount--
            console.error(err)
          });

          this.loadWork()
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al eliminar el tipo de trabajo permitido del evento especificado'});
          console.error(err)
        });
      }
    })
  }

  cleanValues = () => {
    this.workSelected = 0;
  }

  cambiarPagina(event?:number){
    this.pageNumber = event
    this.loadWork()
  }
}

