import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {EventService} from "../../../../services/event.service";
import {MetasService} from "../../../../services/scicom/metas.service";
import Swal from "sweetalert2";
import * as moment from "moment/moment";
import {ExportService} from "../../../../services/export.service";


@Component({
  selector: 'app-modal-report-anual',
  templateUrl: './modal-report-anual.component.html',
  styleUrls: ['./modal-report-anual.component.css']
})
export class ModalReportAnualComponent implements OnInit {

  loadingCount:number=0;

  eventoInstituciones:any[];
  listaYears:any[];
  listaInstituciones:any[];

  selectInstituciones:number=0;
  selectYear:number=0;

  selectInstitucionesAnual:number=0;
  selectYearAnual:number=0;
  reporteAnualFechaInicio:any;
  reporteAnualFechaFinal:any;
  listaInstitucionesAnual:any[];

  listaCampus:any[]=[];
  listaMetas:any[]=[];
  listaMetasCompleta:any[]=[];
  listaCambiosCrear:any[]=[];
  listaCambiosActualizar:any[]=[];

  constructor(private eventService: EventService,
              public authService: AuthService,
              public metasService: MetasService,
              public exportService: ExportService) { }

  ngOnInit(): void {
    this.loadYear()
    this.loadCurrentScicomUser();
    this.limpiarFormularioReporteAnual();
  }

  loadCurrentScicomUser() {
    const user = this.authService.getUserEnLocal()
    //console.log("user",user);
    this.loadEvents();
  }

  loadEvents(){
    this.loadingCount++
    this.eventService.getEventList().subscribe((resEventList: any) => {
      this.loadingCount--
      //console.log("resEventList",resEventList);
      const idsEvento = resEventList.map((value: any) => value.id);
      this.loadInstitucionesEvent(idsEvento);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los eventos'});
      console.error(err)
    });
  }

  loadInstitucionesEvent(idsEvento: Array<number>) {
    if (idsEvento.length > 0){
      var auxEventoInstituciones:any = [];
      this.eventoInstituciones = [];
      this.listaInstituciones = [];
      this.loadingCount++
      this.eventService.getEventListForumEncuntro(undefined, true).subscribe((resInstitucion: any) => {
        //console.log("actual", resInstitucion);
        this.loadingCount--
        this.eventoInstituciones = resInstitucion;
        let idsRorInstitucionesCreadorasEvento: any = [];
        for(let event of resInstitucion) {
          const idEvento = event.id
          const idRor = event.rors_editoras.filter((value: any) => value.pivot.creador == true)
            .map((value: any) => value.id).pop()
          idsRorInstitucionesCreadorasEvento.push({idEvento, idRor})
        }
        //console.warn(idsRorInstitucionesCreadorasEvento);
        if (idsRorInstitucionesCreadorasEvento.length > 0) {
          this.loadingCount++
          this.eventService.getInstitucionList(idsRorInstitucionesCreadorasEvento.map((value: any) => {return value.idRor}))
            .subscribe((res: any) => {
              //console.warn(res)
              this.loadingCount--
              this.listaInstitucionesAnual = res;
              //console.warn("this.listaInstitucionesAnual",this.listaInstitucionesAnual)
              for(let idRorInst of idsRorInstitucionesCreadorasEvento) {
                auxEventoInstituciones.push({
                  institucion: res.filter((value: any) => {
                    return idRorInst.idRor == value.id_ror
                  }).pop().razon_social,
                  institucion_ror: idRorInst.idRor
                });
              }
              var auxInstituciones:any = [];
              for(let ei of auxEventoInstituciones) {
                if (!auxInstituciones.find((value: any) => value.institucion_ror == ei.institucion_ror)) {
                  auxInstituciones.push({
                    institucion: ei.institucion,
                    institucion_ror: ei.institucion_ror
                  });
                }
              }
              this.listaInstituciones = auxInstituciones;
            }, (err) => {
              this.loadingCount--
              console.error(err)
              Swal.fire({icon: 'error', text: 'Error al cargar los datos de la institución creadora del evento'});
            })
        }
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'Error al cargar el evento especificado'});
        console.error(err)
      });
    }
  }

  loadCampusByInstitucion(){
    this.loadingCount++
    this.eventService.getCampusList(this.selectInstitucionesAnual).subscribe((resCampus: any) => {
      this.loadingCount--
      //console.log("resCampus",resCampus);
      this.listaCampus = resCampus;
      this.loadMetas();
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los campus de la institución especificada'});
      console.error(err)
    });
  }

  loadYear(){
    const fecha = new Date();
    const actualYear = fecha.getFullYear();
    this.listaYears = [
      {year:actualYear+1}, {year:actualYear}, {year:actualYear-1}, {year:actualYear-2}, {year:actualYear-3},
      {year:actualYear-4}, {year:actualYear-5}, {year:actualYear-6}, {year:actualYear-7}, {year:actualYear-8},
      {year:actualYear-9}, {year:actualYear-10}
    ];
  }

  loadCompleteYearAnual(){
    this.reporteAnualFechaInicio = this.dateStringToIso8601Start("01-01-"+this.selectYearAnual);
    this.reporteAnualFechaFinal = this.dateStringToIso8601End("31-12-"+this.selectYearAnual);
    //console.log("fechas",this.reporteAnualFechaInicio,this.reporteAnualFechaFinal);
  }

  dateStringToIso8601Start(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').startOf('day').valueOf())).toISOString()
  }

  dateStringToIso8601End(fechaDD_MM_YYYY: any) {
    const fecha = new Date(moment(fechaDD_MM_YYYY, 'DD-MM-yyyy').format('yyyy-MM-DD'));
    return (new Date(moment.utc(fecha, 'DD-MM-yyyy').endOf('day').valueOf())).toISOString()
  }

  newObjectReference(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

  loadMetas(){
    //console.log("metas", this.reporteAnualFechaInicio, this.reporteAnualFechaFinal, this.selectInstitucionesAnual);
    this.loadingCount++
    this.metasService.getMetasByInstitucion(this.selectInstitucionesAnual,"1 2",this.reporteAnualFechaInicio,this.reporteAnualFechaFinal).subscribe((resMetas: any) => {
      this.loadingCount--
      this.listaMetas = resMetas;
      this.listaMetasCompleta = this.newObjectReference(this.listaCampus);
      for (let lmc of this.listaMetasCompleta){
        for (let lm of this.listaMetas){
          if(lmc.id == lm.id_campus ){
            if(lm.id_tipo_meta == 1){
              lmc.metaEstId = lm.id;
              lmc.metaEstValor = lm.valor;
            }else if(lm.id_tipo_meta == 2){
              lmc.metaCartId = lm.id;
              lmc.metaCartValor = lm.valor;
            }
          }
        }
      }
      //console.log("listaMetasCompleta",resMetas);
      //console.log("listaMetasCompleta",this.listaMetasCompleta);
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  loadDatosMetas(){
    if(this.selectYearAnual!=0){
      this.loadCompleteYearAnual();
      if(this.selectInstitucionesAnual!=0){
        this.loadCampusByInstitucion();
      }
    }
  }

  limpiarFormularioReporteAnual(){
    //console.log("limpiar");
    this.selectInstitucionesAnual = 0;
    this.selectYearAnual = 0;
    this.listaMetasCompleta = [];
    this.listaCambiosCrear = [];
    this.listaCambiosActualizar = [];
  }

  crearMeta(valor:any,idCampus:number,tipoMeta:number){
    //console.log("valores",valor,idCampus,tipoMeta)
    const fecha = moment(new Date(), 'DD-MM-yyyy').format('yyyyMMDDhhmmss');
    for (let lcc of this.listaCambiosCrear){
      if(lcc.id_campus == idCampus){
        if(lcc.tipo_meta == tipoMeta){
          this.listaCambiosCrear = this.listaCambiosCrear.filter( (u:any) => u.token != lcc.token);
        }
      }
    }
    this.listaCambiosCrear.push({
      token:fecha,
      meta:"crear",
      valor:valor.target.value,
      id_campus:idCampus,
      fecha_ini:this.reporteAnualFechaInicio,
      fecha_fin:this.reporteAnualFechaFinal,
      tipo_meta:tipoMeta
    });
    //console.log("this.listaCambiosCrear",this.listaCambiosCrear)
  }

  actualizarMeta(id:number,valor:any,idCampus:number,tipoMeta:number){
    this.listaCambiosActualizar = this.listaCambiosActualizar.filter( (u:any) => u.id != id);
    this.listaCambiosActualizar.push({
      meta:"actualizar",
      id:id,
      valor:valor.target.value
    });
  }

  eliminarMeta(){
    this.listaCambiosCrear = this.listaCambiosCrear.filter( (u:any) => u.valor != "");
    for (let lc of this.listaCambiosActualizar){
      if(lc.valor == ""){
        lc.meta = "eliminar";
      }
    }
  }

  confirmarMetas(){
    Swal.fire({
      text: "¿Estás seguro que desea guardar los cambios a las metas?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28A745",
      cancelButtonColor: "#6E7881",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cerrar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarMeta();
        this.guardarMetas();
      }
    });
  }

  guardarMetas(){
    this.crearMetas();
    this.actualizarMetas();
    this.eliminarMetas();
    this.ngOnInit();
  }

  crearMetas(){
    //console.log("this.listaCambiosCrear",this.listaCambiosCrear)
    for(let lmc of this.listaCambiosCrear){
      this.loadingCount++
      this.metasService.addMetas(lmc.valor,lmc.id_campus,lmc.fecha_ini,lmc.fecha_fin,lmc.tipo_meta).subscribe((resAddMetas: any) => {
        this.loadingCount--
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron los campus de la institución especificada'});
        console.error(err)
      });
    }
  }

  actualizarMetas(){
    for(let lmc of this.listaCambiosActualizar){
      if(lmc.meta == "actualizar"){
        this.loadingCount++
        this.metasService.updateMetas(lmc.id,lmc.valor).subscribe((resUpdateMetas: any) => {
          this.loadingCount--
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se cargaron los campus de la institución especificada'});
          console.error(err)
        });
      }
    }
  }

  eliminarMetas(){
    for(let lmc of this.listaCambiosActualizar){
      if(lmc.meta == "eliminar"){
        this.loadingCount++
        this.metasService.deleteMetas(lmc.id).subscribe((resDeleteMeta: any) => {
          this.loadingCount--
        }, (err: any) => {
          this.loadingCount--
          Swal.fire({icon: 'error', text: 'No se cargaron los campus de la institución especificada'});
          console.error(err)
        });
      }
    }
  }

}
