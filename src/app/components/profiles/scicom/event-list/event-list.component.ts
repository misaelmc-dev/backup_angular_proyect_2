import {Component,OnInit} from '@angular/core';
import {EventListService} from "../../../../services/scicom/event-list.service";
import {PermisosScicomService} from "../../../../services/scicom/permisos-scicom.service";
import {NotificacionesScicomService} from "../../../../services/scicom/notificaciones-scicom.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  loadAll:number=0;

  items:any=[];

  institucionesEventos:any=[];
  estatusEventos:any=[];
  tiposEventos:any=[];
  campusEventos:any=[];
  rangosEventos:any=[];
  filtroSearch:string='';
  filtroEstatusEvento:number=0;
  filtroTiposEvento:number=0;
  filtroCampusEvento:number=0;

  pageSize:number=10;
  pageNumber:number=1;
  totalItems:number=0;

  loadingCount:number=0;

  constructor(public  eventListService: EventListService,
              public permisosScicomService: PermisosScicomService,
              private notificacionesScicomService: NotificacionesScicomService) { }

  ngOnInit(): void {
    this.loadEventos();
    this.filtrarEventos();
  }

  loadEventos(){
    this.loadingCount++
    this.eventListService.getAllEventsIds().subscribe((resEventIds:any) => {
      this.loadingCount--
      let idsEventos = resEventIds.map((value: any) => value.id)
      if (idsEventos.length > 0) {
        this.loadInstitucionesEvent(idsEventos);
        this.loadEstatusEventos(idsEventos);
        this.loadTiposEventos(idsEventos);
        this.loadCampus(idsEventos);
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los ids de los eventos del sistema scicom'});
      console.error(err)
    });
  }

  loadInstitucionesEvent(idsEventos:any) {
    if (idsEventos.length > 0){
      this.loadingCount++
      this.eventListService.getInstitutionsRorList(idsEventos).subscribe((resInstRor: any) => {
        this.loadingCount--
        let idsRors = resInstRor.map((value: any) => value.id_ror)
        this.loadingCount++
        this.eventListService.getInstitucionsList(idsRors).subscribe((resInst: any) => {
          this.loadingCount--
          for(let inst of resInst ){
            for(let ror of resInstRor){
              if(inst.id_ror == ror.id_ror){
                inst.ror = ror.id;
              }
            }
          }
          this.institucionesEventos = resInst;
          //console.log("this.institucionesEventos",this.institucionesEventos)
        }, (err) => {
          this.loadingCount--
          console.error(err)
          Swal.fire({icon: 'error', text: 'Error al cargar los datos de la institución creadora del evento'});
        })
      }, (err) => {
        this.loadingCount--
        console.error(err)
        Swal.fire({icon: 'error', text: 'Error al cargar los rors de la institución creadora del evento'});
      })
    }
  }

  loadEstatusEventos(idsEventos?:any){
    var auxIncluir:string='id, nombre';
    this.loadingCount++
    this.eventListService.getEstatEventByEvents(idsEventos,auxIncluir).subscribe((resEstEvent: any) => {
      this.loadingCount--
      this.estatusEventos = resEstEvent;
      //console.log("this.estatusEventos",this.estatusEventos);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los Estatus de evento del sistema scicom'});
      console.error(err)
    });
  }

  loadTiposEventos(idsEventos?:any){
    var auxIncluir:string='id, nombre';
    this.loadingCount++
    this.eventListService.getTypeEventByEvents(idsEventos,auxIncluir).subscribe((resTypEvent: any) => {
      this.loadingCount--
      this.tiposEventos = resTypEvent;
      //console.log("this.tiposEventos",this.tiposEventos);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los tipos de evento del sistema scicom'});
      console.error(err)
    });
  }

  loadCampus(idsEventos?:any){
    this.loadingCount++
    this.eventListService.getCampusByEvents(idsEventos).subscribe((resCampEvent: any) => {
      this.loadingCount--
      this.campusEventos = resCampEvent;
      //console.log("this.campusEventos",this.campusEventos);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los campus del evento del sistema scicom'});
      console.error(err)
    });
  }

  filtrarEventos(cambiar?:string) {
    if(cambiar==undefined){ this.pageNumber=1 }
    var auxIncluir:string='id, nombre, id_tipo_evento, id_estatus_evento';
    var auxOrden:string='nombre:asc';
    var auxfilterEstatusEvento:any=[];
    var auxfilterTiposEvento:any=[];
    var auxfilterCampusEvento:any=[];
    if(this.filtroEstatusEvento!=0){ auxfilterEstatusEvento = [this.filtroEstatusEvento] }
    if(this.filtroTiposEvento!=0){ auxfilterTiposEvento = [this.filtroTiposEvento] }
    if(this.filtroCampusEvento!=0){ auxfilterCampusEvento = [this.filtroCampusEvento] }
    this.loadingCount++
    this.eventListService.getEventList(this.pageNumber,this.pageSize,this.filtroSearch,auxfilterEstatusEvento,
      auxfilterTiposEvento,auxfilterCampusEvento,auxIncluir,auxOrden).subscribe((resEve: any) => {
      this.loadingCount--
      for(let item of resEve.data){
        for(let ror of item.rors_editoras){
          if(ror.pivot.creador==true){
            item.ror=ror.id
          }
        }
      }
      this.items = resEve.data;
      this.totalItems = resEve.total;
      let idsEventos = this.items.map((value: any) => value.id)
      if (idsEventos.length > 0) {
        this.loadRangosEventos(idsEventos);
      }
      //console.log("this.items",this.items);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los eventos'});
      console.error(err)
    });
  }

  loadRangosEventos(idsEventos:any) {
    var auxIncluir = 'id,tiempo_inicio,tiempo_final,id_evento';
    this.rangosEventos=[];
    this.loadingCount++
    this.eventListService.getRangesByEvents(idsEventos,[1],auxIncluir).subscribe((resRangEve: any) => {
      this.loadingCount--
      this.rangosEventos = resRangEve;
      //console.log("this.rangosEventos",this.rangosEventos);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los datos de calendario de eventos'});
      console.error(err)
    });
  }

  getEventUrl(eventoId:number,eventoTipo:number) {
    let url = ''
    if(this.permisosScicomService.canVerFichaTecnicaEvento(eventoId)){
      if(eventoTipo==1){
        url = '/scicom/api/event-details/'+eventoId
      }else if(eventoTipo==3){
        url = '/scicom/foro/event-details/'+eventoId
      }else if(eventoTipo==4){
        url = '/scicom/encuentro/event-details/'+eventoId
      }
    }else{
      url = '/scicom/api/'+eventoId+'/event-participations'
    }
    //console.warn("url",url)
    return url
  }

  deleteEvent(eventoId:number,eventNombre:string){
    Swal.fire({
      title: '¿Deseas eliminar el evento?',
      text: eventNombre,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventListService.deleteEvent(eventoId).subscribe((res: any) => {
          this.loadingCount--

          this.loadingCount++
          this.notificacionesScicomService.sendNotificationDelEvento(eventoId).subscribe((res:any) => {
            this.loadingCount--
            //console.info("NotificationDelEvento")
          }, (err:any) =>{
            this.loadingCount--
            console.error(err)
          });

          this.pageNumber=1;
          this.filtrarEventos();

        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'Error al eliminar el evento especificado'});
          console.error(err)
        });
      }
    })
  }

  cambiarPagina(event:any){
    this.pageNumber=event;
    this.filtrarEventos("cambiar");
  }

  limpiarFiltros(){
    this.filtroSearch='';
    this.filtroEstatusEvento=0;
    this.filtroTiposEvento=0;
    this.filtroCampusEvento=0;
    this.pageNumber=0;
    this.filtrarEventos();
  }

}
