import {Component, OnInit, SecurityContext} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {EventService} from "../../../../../services/event.service";
import {EventDetailsService} from "../../../../../services/scicom/event-details.service";
// @ts-ignore
import moment from "moment";
import Swal from "sweetalert2";
import 'moment/locale/es-mx' //importación de lenguaje de moment en localización "español mexicano"

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})

export class EventDetailsComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?:number = Number(this.route.snapshot.paramMap.get('idevent'));

  evento:any=[];

  eventoNombre:string="";
  eventoTipo:number;
  eventoEstatus:string="";
  eventoDescripcion:string="";
  eventoLema:string="";
  eventoObjetivos:string="";
  eventosPagos:any=[];

  institucion:number=this.cordId;
  instituciones:any=[];
  institucionNombre:string="";
  estatusEventos:any=[];

  campusAsing:any[]=[];
  evaluationAsing:any[]=[];
  paymentsAsing:any[]=[];
  eventoPagos:any=[];
  workAsing:any[]=[];
  tiposArchivos:any[]=[];
  archivos:any[]=[];

  participation:any[]=[];
  participationAsing:any[]=[];
  participationNoAsing:any[]=[];

  rangoEvento:string;
  fechaInicioEvento:string;
  fechaFinalEvento:string;
  fechasAsign:any[]=[];
  fechasAsign1:any[]=[];
  fechasAsign2:any[]=[];
  fechasAsign3:any[]=[];

  loadingCount: number = 0; //cuenta el número de elementos cargando

  nowDate:any = null

  constructor(private eventService: EventService,
              public eventDetailsService: EventDetailsService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute)
  {
    moment().locale('es-mx')
    const auxNowDate = moment(new Date()).format('LLLL')
    this.nowDate = auxNowDate
  }

  ngOnInit(): void {
    this.loadEventos();
    this.loadStatusEvent();
    this.loadRangeEvent();

    this.loadCampus();
    this.loadEvaluation();
    this.loadPayments();
    this.loadParticipation();
    this.loadWork();
    //this.loadTipoArchivos();
    //this.loadArchivos();
  }

  loadEventos(){
    var auxIncluir:string="id,nombre,descripcion,lema,objetivo,id_tipo_evento,id_estatus_evento";
    this.loadingCount++
    this.eventDetailsService.getEventById(this.eventoId,auxIncluir).subscribe((res: any) => {
      this.evento = res.data[0];
      this.loadingCount--
      const tipoPagoAux = res.data[0].tipos_de_pago.shift(0)
      this.eventosPagos = []
      if (tipoPagoAux)
        this.eventosPagos = [tipoPagoAux.pivot];
      const idRorInstitucionCreadoraEvento = res.data[0].rors_editoras.filter((value: any) => value.pivot.creador == true)
        .map((value: any) => value.id).pop()
      //se carga la institución creadora del evento
      if (idRorInstitucionCreadoraEvento) {
        this.loadingCount++
        this.eventService.getInstitucionList([idRorInstitucionCreadoraEvento]).subscribe((res: any) => {
          this.loadingCount--
          this.institucionNombre = res[0].razon_social
        }, (err) => {
          this.loadingCount--
          console.error(err)
          Swal.fire({icon: 'error',text: 'Error al cargar los datos de la institución creadora del evento'});
        })
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar el evento especificado'});
      console.error(err)
    });
  }

  loadStatusEvent = () => {
    this.loadingCount++
    this.eventService.getStatusEvent([this.eventoId]).subscribe((res: any) => {
      this.loadingCount--
      this.estatusEventos = res;
      console.log("res",res);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los estatus del evento'});
      console.error(err)
    });
  }

  loadInstitucion = () => {
    this.loadingCount++
    this.eventService.getInstitucionList().subscribe((res: any) => {
      this.loadingCount--
      this.instituciones = res;
      for(let inst of this.instituciones){
        if(inst.id==this.cordId){
          this.institucionNombre = inst.razon_social;
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones'});
      console.error(err)
    });
  }

  loadRangeEvent = () => {
    this.loadingCount++
    this.eventService.getRangeEventList(this.eventoId, [1, 2, 3, 5, 6]).subscribe((res: any) => {
      this.loadingCount--
      for(let fech of res ){
        switch(fech.id_tipo_rango) {
          case 1:
            this.rangoEvento = fech.tiempo_inicio.slice(0,10)+" - "+fech.tiempo_final.slice(0,10);
            this.fechaInicioEvento = fech.tiempo_inicio.slice(0,10);
            this.fechaFinalEvento = fech.tiempo_final.slice(0,10);
            break;
          case 2:
            this.fechasAsign3 = res.filter((value: any) => value.id_tipo_rango == fech.id_tipo_rango);
            break;
          case 3:
            this.fechasAsign = res.filter((value: any) => value.id_tipo_rango == fech.id_tipo_rango);
            break;
          case 5:
            this.fechasAsign1 = res.filter((value: any) => value.id_tipo_rango == fech.id_tipo_rango);
            break
          case 6:
            this.fechasAsign2 = res.filter((value: any) => value.id_tipo_rango == fech.id_tipo_rango);
            break;
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar el calendario del evento'});
      console.error(err)
    });
  }



  loadCampus = () => {
    this.loadingCount++
    this.eventService.getCampusSimplesAsign(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.campusAsing = res ;
      this.loadingCount++
      this.eventService.getInstitucionList().subscribe((resInst: any) => {
        this.loadingCount--
        for(let campus of this.campusAsing) {
          for(let institucion of resInst) {
            if (institucion.id == campus.id_institucion)
              campus.institucion = institucion.razon_social
          }
        }
      }, (err) => {
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar las instituciones de los campus asociados'});
        console.error(err)
      })
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los campus asociados al evento'});
      console.error(err)
    });
  }

  loadEvaluation = () => {
    this.loadingCount++
    this.eventService.getEvaluationAsign(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.evaluationAsing = res ;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los tipos de evaluación permitidos en el evento'});
      console.error(err)
    });
  }

  loadPayments = () => {
    this.loadingCount++
    this.eventService.getPaymentsAsign(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.paymentsAsing = res ;
    }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar los tipos de pago permitidos en el evento'});
        console.error(err)
    });
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
        Swal.fire({icon: 'error',text: 'Error al cargar los tipos de participación permitidos en el evento'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los tipos de participación desde scicom'});
      console.error(err)
    });
  }

  loadWork = () => {
    this.loadingCount++
    this.eventService.getWorkAsign(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.workAsing = res ;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo permitidos en el evento'});
      console.error(err)
    });
  }

  loadTipoArchivos = () => {
    this.loadingCount++
    this.eventService.getFileTypeList().subscribe((res: any) => {
      this.loadingCount--
      this.tiposArchivos = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de archivo del sistema'});
      console.error(err)
    });
  }

  loadArchivos = () => {
    this.loadingCount++
    this.eventService.getFileList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.archivos = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los archivos del evento especificado'});
      console.error(err)
    });
  }

  viewFileEvent = (archivourl:string) => {
    this.loadingCount++
    this.eventService.viewEventFile(archivourl).subscribe((resfile: Blob) => {
      this.loadingCount++
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo descargar el archivo especificado'});
      console.error(err)
    });
  }
}
