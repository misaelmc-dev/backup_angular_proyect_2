import {Component,OnInit ,Input } from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {NotificacionesScicomService} from "../../../../../services/scicom/notificaciones-scicom.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-objectives-encounter',
  templateUrl: './event-objectives-encounter.component.html',
  styleUrls: ['./event-objectives-encounter.component.css']
})
export class EventObjectivesEncounterComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  eventoNombre: number = 0;
  eventoODS: any[] = [];
  eventoODSList: any[] = [];
  eventoODSDisponibles: any[] = [];

  odsSelected:number = 0;

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageStart:number = 0;
  pageEnd:number = 0;
  pageSize:number = 10;
  totalItems:number = 0;
  labelPagination:string = '';

  loadingCount: number = 0;

  constructor(private eventService: EventService,
              private notificacionesScicomService: NotificacionesScicomService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              public permisosScicomService: PermisosScicomService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadEvento();
  }

  loadEvento() {
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        const evento = res[0];
        this.eventoNombre = evento.nombre;
        this.eventoODS = evento.objetivos_de_desarrollo_sostenible;
        this.loadODS();
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los datos del evento especificado'});
        console.error(err)
      });
    }
  }

  loadODS() {
    this.loadingCount++
    this.eventService.getODS().subscribe((resODS: any) => {
      this.loadingCount--
      this.eventoODSList = resODS;
      this.eventoODSDisponibles = this.eventoODSList;
      this.eventoODSList = resODS;
      let auxODS = [];
      for(let o of this.eventoODS){
        for(let ol of this.eventoODSList){
          if(ol.id==o.id){
            auxODS.push(ol);
            this.eventoODSDisponibles = this.eventoODSDisponibles.filter((ods: any) => ods.id != o.id);
          }
        }
      }
      this.eventoODS=auxODS;
      this.loadPagination(1,this.eventoODS)
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron lOS ODS del sistema'});
      console.error(err)
    });
  }

  asignODS(){
    if(this.odsSelected!=0){
      this.loadingCount++
      this.eventService.addODSToEvent(this.eventoId,this.odsSelected.toString()).subscribe((res: any) => {
        this.loadingCount--
        this.loadEvento();
        Swal.fire({icon: 'success',text: 'El ODS se agregó correctamente'});
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se agregó el ODS al evento'});
        console.error(err)
      });
    }
  }

  removeODS(idODS:number){
    Swal.fire({
      title: '¿Deseas eliminar el Objetivo?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventService.removeODSToEvent(this.eventoId,idODS.toString()).subscribe((res: any) => {
          this.loadingCount--
          this.pageNumber = 1;
          this.loadEvento()
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al eliminar el ODS especificado del evento'});
          console.error(err)
        });
      }
    })
  }


  loadPagination = (pageValue?:any,array?:any) => {
    this.totalItems = array.length;
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
    this.labelPagination = "Muestra Objetivos del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
  }

  cleanValues(){
    this.odsSelected = 0 ;
  }

}
