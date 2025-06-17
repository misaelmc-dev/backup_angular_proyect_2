import {Component,OnInit ,Input } from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-campus-encounter',
  templateUrl: './event-campus-encounter.component.html',
  styleUrls: ['./event-campus-encounter.component.css']
})
export class EventCampusEncounterComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  nombre:string="";
  tipo:number;
  estatus:string="";

  instituciones:any=[];
  institucionNombre:string="";

  campus:any[]=[];
  campusAsing:any[]=[];
  campusNoAsing:any[]=[];

  campusSelected:number;

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
              private router: Router) { }

  ngOnInit(): void {
    this.loadTitle();
    this.loadEventos();
    //this.loadInstitucion();
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
        const evento = res[0];
        this.nombre = evento.nombre;
        this.tipo = evento.id_tipo_evento;
        this.estatus = evento.id_estatus_evento;
        const idRorCoord = evento.rors_editoras.filter((value: any) => value.pivot.creador == true)[0].id
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
        Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadInstitucion() {
    this.loadingCount++
    this.eventService.getInstitucionList().subscribe((res: any) => {
      this.loadingCount--
      this.instituciones = res;
      /*this.instituciones.forEach((element: any) => {
        if(element.id==this.cordId){
          this.institucionNombre = element.razon_social;
        }
      })*/
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones del sistema'});
      console.error(err)
    });
  }

  loadCampus = () => {
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getCampusList(this.cordId).subscribe((res: any) => {
        this.loadingCount--
        this.campus = res ;
        this.loadingCount++
        this.eventService.getCampusSimplesAsign(this.eventoId).subscribe((res: any) => {
          this.loadingCount--
          this.campusAsing = res ;
          this.campusNoAsing = this.campus;
          //console.warn(this.campusAsing)
          //console.warn(JSON.stringify(this.campusNoAsing))
          for(let camp of this.campusAsing){
            this.campusNoAsing = this.campusNoAsing.filter( (value: any) => {

              return value.id != camp.id
            })
          }
          //console.warn(JSON.stringify(this.campusNoAsing))
          this.loadingCount++
          this.eventService.getInstitucionList().subscribe((res: any) => {
            this.loadingCount--
            this.instituciones = res;

            for(let campus of this.campusAsing) {
              for(let institucion of this.instituciones) {
                if (campus.id_institucion == institucion.id) {
                  campus.institucion = institucion.razon_social
                  break;
                }
              }
            }
            /*this.instituciones.forEach((element: any) => {
              if(element.id==this.cordId){
                this.institucionNombre = element.razon_social;
              }
            })*/
          }, (err:any) =>{
            this.loadingCount--
            Swal.fire({icon: 'error',text: 'No se cargaron las instituciones del sistema'});
            console.error(err)
          });
          this.loadPagination();
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
        this.loadingCount++
        this.notificacionesScicomService.sendNotificationAddCampusEvento(this.eventoId,this.campusSelected).subscribe((res:any) => {
          this.loadingCount--
          console.info("NotificationAddCampusEvento")
        }, (err:any) =>{
          this.loadingCount--
          console.error(err)
        });
        this.pageNumber = 1;
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
          this.loadingCount++
          this.notificacionesScicomService.sendNotificationDelCampusEvento(this.eventoId,campusId).subscribe((res:any) => {
            this.loadingCount--
            console.info("NotificationDelCampusEvento")
          }, (err:any) =>{
            this.loadingCount--
            console.error(err)
          });
          this.pageNumber = 1;
          this.loadCampus()
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al eliminar el campus especificado del evento'});
          console.error(err)
        });
      }
    })
  }



  loadPagination = (pageValue?:any) => {
    this.totalItems = this.campusAsing.length;
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
    this.labelPagination = "Muestra campus del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
  }

  cleanValues = () => {
    this.campusSelected = 0 ;
  }

}

