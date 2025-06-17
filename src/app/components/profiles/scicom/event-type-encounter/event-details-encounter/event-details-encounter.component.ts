import {Component, OnInit, SecurityContext} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
// @ts-ignore
import moment from "moment";
import 'moment/locale/es-mx' //importación de lenguaje de moment en localización "español mexicano"

@Component({
  selector: 'app-event-details-encounter',
  templateUrl: './event-details-encounter.component.html',
  styleUrls: ['./event-details-encounter.component.css']
})
export class EventDetailsEncounterComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?:number = Number(this.route.snapshot.paramMap.get('idevent'));

  tipoRangoTiempo:string='rangEvent';

  eventoNombre:string="";
  eventoTipo:number=4;
  eventoEstatus:string="";
  eventoDescripcion:string="";
  eventoLema:string="";
  eventoObjetivos:string="";
  eventoNivel:string="";
  eventoODS:any[]=[];
  eventoColaboradores:any[]=[];
  eventosPagos:any=[];

  institucion:number=this.cordId;
  instituciones:any=[];
  institucionNombre:string="";
  estatusEventos:any=[];

  campusList:any[]=[];
  rolesList:any[]=[];
  campusAsing:any[]=[];
  evaluationAsing:any[]=[];
  paymentsAsing:any[]=[];
  workAsing:any[]=[];
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

  logoEventoArchivo: any;
  archivoVacio: any;
  validacionLogoImagen:boolean;

  listaLogoEvento:any[];
  urlLogoEvento:any="assets/img/logo-default.jpg";


  loadingCount: number = 0; //cuenta el número de elementos cargando

  nowDate:any = null

  constructor(private eventService: EventService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute)
  {
    moment().locale('es-mx')
    const auxNowDate = moment(new Date()).format('LLLL')
    this.nowDate = auxNowDate
  }

  ngOnInit(): void {
    this.loadStatusEvent();
    this.loadRangeEvent();
    this.loadEventos();
    this.loadCampus();
    this.loadRoles();
    this.loadEvaluation();
    this.loadPayments();
    this.loadParticipation();
    this.loadWork();
    this.loadLogoEvento();
  }

  loadStatusEvent(){
    this.loadingCount++
    this.eventService.getStatusEvent([this.eventoId]).subscribe((res: any) => {
      this.loadingCount--
      this.estatusEventos = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los estatus del evento'});
      console.error(err)
    });
  }

  loadRangeEvent(){
    this.loadingCount++
    this.eventService.getRangeEventList(this.eventoId, [1]).subscribe((res: any) => {
      this.loadingCount--
      this.fechaInicioEvento = res[0].tiempo_inicio;
      this.fechaFinalEvento = res[0].tiempo_final;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar el calendario del evento'});
      console.error(err)
    });
  }

  loadEventos(){
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.eventoNombre = res[0].nombre;
      this.eventoTipo = res[0].id_tipo_evento;
      this.eventoEstatus = res[0].id_estatus_evento;
      this.eventoDescripcion = res[0].descripcion ;
      this.eventoLema = res[0].lema
      this.eventoObjetivos = res[0].objetivo;
      this.eventoODS = res[0].objetivos_de_desarrollo_sostenible;
      this.loadODS();
      this.loadColaboradoresEvento()
      this.eventoNivel = res[0].niv_desarr_for_enc_unit_uvm;
      const tipoPagoAux = res[0].tipos_de_pago.shift(0)
      this.eventosPagos = []
      if (tipoPagoAux)
        this.eventosPagos = [tipoPagoAux.pivot];
      const idRorInstitucionCreadoraEvento = res[0].rors_editoras.filter((value: any) => value.pivot.creador == true)
        .map((value: any) => value.id).pop()
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

  loadCampus(){
    this.loadingCount++
    this.eventService.getCampusSimplesAsign(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.campusList = res;
      this.campusAsing = res;
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

  loadODS() {
    if(this.eventoODS.length>0){
      let idsODS: any = this.eventoODS.map(value => value.id);
      this.loadingCount++
      this.eventService.getODS().subscribe((resODS: any) => {
        this.loadingCount--
        let auxODS = [];
        for(let o of this.eventoODS){
          for(let od of resODS){
            if(o.id == od.id){
              auxODS.push(od)
            }
          }
        }
        this.eventoODS=auxODS;
        this.orderBy(this.eventoODS);
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron lOS ODS del sistema'});
        console.error(err)
      });
    }
  }

  loadColaboradoresEvento(){
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getUsuariosEvento(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.eventoColaboradores = res;
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
      this.rolesList = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los roles del sistema scicom'});
      console.error(err)
    });
  }

  loadEvaluation(){
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

  loadPayments(){
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

  loadParticipation(){
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

  loadWork(){
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

  orderBy(sin_orden: any) {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1, n2) => {
      if (n1.numero > n2.numero) {
        return 1;
      }
      if (n1.numero < n2.numero) {
        return -1;
      }
      return 0;
    });
  }

  loadLogoEvento(){
    this.loadingCount++
    this.eventService.getFileLogoEvent(this.eventoId,22).subscribe((resArchEve: any) => {
      this.loadingCount--
      if(resArchEve.length!=0){
        this.listaLogoEvento = resArchEve;
        var auxUrlLogo = "";
        for(let urllogo of this.listaLogoEvento){
          auxUrlLogo = urllogo.uri
        }
        this.viewFileEvent(auxUrlLogo);
      }
    }, (err:any) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo el logo del evento'});
      console.error(err)
    });
  }

  extractFileFromEvent(event: any) {
    this.logoEventoArchivo = event.target.files[0];
    var foto = event.target.files[0];
    var img = new Image();
    img.onload = function dimension() {
      const height = img.height;
      const width = img.width;
      var opcion = Math.round(width/3);
      if(height != opcion){
        document.getElementById('validacionLogo').style.display = "block";
        document.getElementById('validacionLogoInput').className = "custom-file-input is-invalid";
        document.getElementById('btn-guardar-imagen1').style.display = "block";
        document.getElementById('btn-guardar-imagen2').style.display = "none";
        document.getElementById('btn-guardar-imagen3').style.display = "block";
        document.getElementById('btn-guardar-imagen4').style.display = "none";
      }else{
        document.getElementById('validacionLogo').style.display = "none";
        document.getElementById('validacionLogoInput').className = "custom-file-input";
        document.getElementById('btn-guardar-imagen1').style.display = "none";
        document.getElementById('btn-guardar-imagen2').style.display = "block";
        document.getElementById('btn-guardar-imagen3').style.display = "none";
        document.getElementById('btn-guardar-imagen4').style.display = "block";
      }
    };
    img.src = URL.createObjectURL(foto);
  }

  updateFile(){
    if(this.listaLogoEvento.length!=0){
      var auxUrlLogo:number = 0;
      for(let urllogo of this.listaLogoEvento){
        auxUrlLogo = urllogo.id
      }
      this.deleteFile(auxUrlLogo);
    }
  }

  saveFile(){
    this.loadingCount++
    this.eventService.addLogoEvent(this.logoEventoArchivo.name,this.logoEventoArchivo,22,this.eventoId).subscribe((resI: any) => {
      this.loadingCount--
      this.ngOnInit();
      this.limpiarFormularioImagen();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se guardó el archivo en el evento especificado'});
      console.error(err)
    });
  }

  deleteFile(idFile:number){
    this.loadingCount++
    this.eventService.deleteEventFile(idFile).subscribe((resI: any) => {
      this.loadingCount--
      this.saveFile();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se elimino el archivo en el evento especificado'});
      console.error(err)
    });
  }

  viewFileEvent(archivourl:string) {
    this.loadingCount++
    this.eventService.viewEventFile(archivourl).subscribe((resfile: Blob) => {
      this.loadingCount--
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      var aux = fileUrl.toString();
      let sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(aux);
      this.urlLogoEvento = sanitizedUrl;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se descargó el logo del evento'});
      console.error(err)
    });
  }

  limpiarFormularioImagen(){
    document.getElementById('validacionLogo').style.display = "none";
    document.getElementById('validacionLogoInput').className = "custom-file-input";
    document.getElementById('btn-guardar-imagen1').style.display = "none";
    document.getElementById('btn-guardar-imagen2').style.display = "block";
    document.getElementById('btn-guardar-imagen3').style.display = "none";
    document.getElementById('btn-guardar-imagen4').style.display = "block";
    this.logoEventoArchivo = "";
    this.logoEventoArchivo = "";
  }

}
