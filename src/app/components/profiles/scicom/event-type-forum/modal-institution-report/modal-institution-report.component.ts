import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../../services/auth.service";
import {EventService} from "../../../../../services/event.service";
import {MetasService} from "../../../../../services/scicom/metas.service";
import Swal from "sweetalert2";
import * as moment from "moment/moment";
import {ExcelJson} from "../../../../../interfaces/excel-json";
import {ExportService} from "../../../../../services/export.service";
import {forEach} from "lodash";

@Component({
  selector: 'app-modal-institution-report',
  templateUrl: './modal-institution-report.component.html',
  styleUrls: ['./modal-institution-report.component.css']
})
export class ModalInstitutionReportComponent implements OnInit {

  loadingCount:number=0;

  eventoInstituciones:any[];
  listaCiclos:any[];
  listaYears:any[];
  listaInstituciones:any[];

  selectInstituciones:number=0;
  selectYear:number=0;
  selectCiclo:number=0;

  listaCiclosTotal:any[]=[];
  listaCiclosBuscar:any[]=[];

  reporteFechaInicio:any;
  reporteFechaFinal:any;

  reporteConCiclos:boolean=false;
  datosCompletosExportar:any[];
  nombreEventoExportar:string;

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

  loadCompleteYear(){
    const fecha = new Date();
    const actualYear = fecha.getFullYear();
    this.reporteFechaInicio = this.dateStringToIso8601Start("01-01-"+this.selectYear);
    this.reporteFechaFinal = this.dateStringToIso8601End("31-12-"+this.selectYear);
    //console.log("fechas",this.reporteFechaInicio,this.reporteFechaFinal);
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

  loadListaEventos(){
    this.listaCiclosTotal = this.eventoInstituciones.filter((i:any) => i.rors_editoras[0].id == this.selectInstituciones);
    this.listaCiclos = this.eventoInstituciones.filter((i:any) => i.rors_editoras[0].id == this.selectInstituciones);
    this.orderByName(this.listaCiclos);
  }

  orderByName(sin_orden: any) {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1, n2) => {
      if (n1.nombre > n2.nombre) {
        return 1;
      }
      if (n1.nombre < n2.nombre) {
        return -1;
      }
      return 0;
    });
  }

  agregarCicloLista(){
    var auxCiclos:any = this.listaCiclos;
    for(let ct of this.listaCiclosTotal){
      if(ct.id==this.selectCiclo){
        this.listaCiclosBuscar.push(ct);
      }
    }
    this.listaCiclos = auxCiclos.filter( (ciclo: any) => ciclo.id != this.selectCiclo)
    this.selectCiclo=0;
    //console.log("this.listaCiclos",this.listaCiclos);
    //console.log("this.listaCiclosBuscar",this.listaCiclosBuscar);
  }

  removerCicloLista(idCampus:number){
    var auxCiclos = this.listaCiclosBuscar;
    for(let ct of this.listaCiclosTotal){
      if(ct.id==idCampus){
        this.listaCiclos.push(ct)
      }
    }
    this.listaCiclosBuscar = auxCiclos.filter( (camp: any) => camp.id != idCampus)
    this.selectCiclo=0;
  }


  loadNombreEvento(){
    for(let ciclo of this.listaCiclos){
      if(ciclo.id == this.selectCiclo){
        this.nombreEventoExportar = ciclo.nombre;
      }
    }
  }

  changeCiclos(conCiclos:boolean){
    this.reporteConCiclos = conCiclos;
  }

  exportToExcelReporte(): void {
    const idsCiclos = this.listaCiclosBuscar.map((value: any) => value.id)
    //console.log("datos",this.selectInstituciones,this.reporteFechaInicio,this.reporteFechaFinal,idsCiclos)
    this.loadingCount++
    this.eventService.getReporteCiclosToExcel(this.selectInstituciones,this.reporteFechaInicio,this.reporteFechaFinal,idsCiclos).subscribe((resExcel: any) => {
      this.loadingCount--
      this.datosCompletosExportar = resExcel;
      this.sendToExcelReporte();
      this.limpiarFormularioExportar();
      //console.log("resExcel",resExcel);
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  exportToExcelReporteSinCiclos(): void {
    const idsCiclos = this.listaCiclosBuscar.map((value: any) => value.id)
    //console.log("datos",this.selectInstituciones,this.reporteFechaInicio,this.reporteFechaFinal,idsCiclos)
    this.loadingCount++
    this.eventService.getReporteCiclosToExcel(this.selectInstituciones,this.reporteFechaInicio,this.reporteFechaFinal,idsCiclos).subscribe((resExcel: any) => {
      this.loadingCount--
      this.datosCompletosExportar = resExcel;
      this.sendToExcelReporteSinCiclos();
      this.limpiarFormularioExportar();
      //console.log("resExcel",resExcel);
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron los datos del evento especificado'});
      console.error(err)
    });
  }

  sendToExcelReporte(): void {
    var num_cols:number = 0;
    var num_ciclos:number = 1;
    let titulo_inicio = ["Reporte detallado de avance de metas anuales"];
    let espacio_inicio = [""];
    let titulos_superiores = [""];
    let titulos = ["Campus"];
    var limit:number = 0;
    for(let de of this.datosCompletosExportar){
      if(limit == 0){
        num_ciclos = de.data.length;
        for(let d of de.data) {
          var nombre_ciclo = d.nomb_ciclo;
          titulo_inicio.push('', '', '', '', '', '', 'Color', '', '', '', '', 'Color');
          espacio_inicio.push('', '', '', '', '', '', 'Color', '', '', '', '', 'Color');
          titulos_superiores.push('', '',
            'Informe de carteles "'+nombre_ciclo+'"','','','', 'Color',
            'Informe de estudiantes "'+nombre_ciclo+'"','','','', 'Color'
          );
          titulos.push(
            "Ciclo",
            'Fechas de ciclo',
            'Carteles',
            'Pronóstico carteles',
            'Faltante de pronóstico de carteles',
            'Avance de carteles respecto a pronóstico de ciclo',
            'Color',
            'Estudiantes',
            'Pronóstico estudiantes',
            'Faltante de pronóstico de estudiantes',
            'Avance de estudiantes respecto a pronóstico del ciclo',
            'Color'
          );
        }
      }
      limit = limit+1
    }
    titulo_inicio.push("","","","","Color","","","","","Color");
    espacio_inicio.push("","","","","Color","","","","","Color");
    titulos_superiores.push(
      "Informe de carteles de campus","","","","Color","Informe de estudiantes de campus","","","","Color"
    );
    titulos.push(
      "Carteles de campus",
      "Meta anual carteles de campus",
      "Faltante para meta anual de carteles de campus",
      "Avance de la meta anual de carteles",
      "Color",
      "Estudiantes de campus",
      "Meta anual estudiantes de campus",
      "Faltante para meta anual de estudiantes de campus",
      "Avance de la meta anual de estudiantes",
      "Color"
    );

    num_cols = titulos.length;
    //console.log("num_cols",num_cols);

    const udt: ExcelJson = {// table header
      data: [titulo_inicio], skipHeader: true,
    };

    udt.data.push(espacio_inicio);
    udt.data.push(titulos_superiores);
    udt.data.push(titulos);

    for(let p of this.datosCompletosExportar){
      var valueToPush:any = { };

      var indice = 0;
      valueToPush[indice] = p.nomb_campus;indice++;
      for(let d of p.data){
        var fechas_ciclo_1 = moment(d.fechas[0].tiempo_inicio).format('YYYY-MM-DD')+" - "+moment(d.fechas[0].tiempo_final).format('YYYY-MM-DD');
        valueToPush[indice] = d.nomb_ciclo;indice++;
        valueToPush[indice] = fechas_ciclo_1;indice++;
        valueToPush[indice] = d.cant_carteles;indice++;
        valueToPush[indice] = d.pronostico_carteles;indice++;
        valueToPush[indice] = d.cant_faltante_pronostico_carteles;indice++;
        valueToPush[indice] = d.porciento_avance_pronostico_carteles;indice++;
        valueToPush[indice] = this.send_background_color_option(d.porciento_avance_pronostico_carteles,d.razon_avance_tiempo,"carteles");indice++;
        valueToPush[indice] = d.cant_estudntes;indice++;
        valueToPush[indice] = d.pronostico_estudntes;indice++;
        valueToPush[indice] = d.cant_faltante_pronostico_estudntes;indice++;
        valueToPush[indice] = d.porciento_avance_pronostico_estudntes;indice++;
        valueToPush[indice] = this.send_background_color_option(d.porciento_avance_pronostico_estudntes,d.razon_avance_tiempo,"estudiantes");indice++;
      }
      valueToPush[indice] = p.cant_carteles;indice++;
      valueToPush[indice] = p.meta_carteles;indice++;
      valueToPush[indice] = p.cant_faltante_meta_carteles;indice++;
      valueToPush[indice] = p.porciento_avance_meta_carteles;indice++;
      valueToPush[indice] = this.send_background_color_option(p.porciento_avance_meta_carteles,p.razon_avance_tiempo,"campus1");indice++;
      valueToPush[indice] = p.cant_estudntes;indice++;
      valueToPush[indice] = p.meta_estudntes;indice++;
      valueToPush[indice] = p.cant_faltante_meta_estudntes;indice++;
      valueToPush[indice] = p.porciento_avance_meta_estudntes;indice++;
      valueToPush[indice] = this.send_background_color_option(p.porciento_avance_meta_estudntes,p.razon_avance_tiempo,"campus2");indice++;

      udt.data.push(valueToPush);
    }
    const edata: Array<ExcelJson> = [];
    edata.push(udt);
    this.exportService.exportReporteEventoToExcelConCiclos(edata, 'Reporte detallado de avance de metas anuales '+moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),num_cols,num_ciclos)
  }

  sendToExcelReporteSinCiclos(): void {

    let titulos0 = ["Reporte general de avance de metas anuales","","","","","","","","","",""];

    const udt: ExcelJson = { data: [titulos0], skipHeader: true,};

    let titulos1 = ["","","","","","","","","","",""];

    udt.data.push(titulos1);

    let titulos2 = ["","Informe de carteles","","","","","Informe de estudiantes","","","",""];

    udt.data.push(titulos2);

    let titulos3 = [
      "Campus",
      "Carteles",
      "Meta anual carteles",
      "Faltante para meta anual de carteles",
      "Avance de la meta anual de carteles",
      "Color",
      "Estudiantes",
      "Meta anual estudiantes",
      "Faltante para meta anual de estudiantes",
      "Avance de la meta anual de estudiantes",
      "Color"
    ];

    udt.data.push(titulos3);

    for(let p of this.datosCompletosExportar){
      var valueToPush:any = { };

      var indice = 0;
      valueToPush[indice] = p.nomb_campus;indice++;
      valueToPush[indice] = p.cant_carteles;indice++;
      valueToPush[indice] = p.meta_carteles;indice++;
      valueToPush[indice] = p.cant_faltante_meta_carteles;indice++;
      valueToPush[indice] = p.porciento_avance_meta_carteles;indice++;
      valueToPush[indice] = this.background_color_option(p.porciento_avance_meta_carteles,p.razon_avance_tiempo,"carteles");indice++;
      valueToPush[indice] = p.cant_estudntes;indice++;
      valueToPush[indice] = p.meta_estudntes;indice++;
      valueToPush[indice] = p.cant_faltante_meta_estudntes;indice++;
      valueToPush[indice] = p.porciento_avance_meta_estudntes;indice++;
      valueToPush[indice] = this.background_color_option(p.porciento_avance_meta_estudntes,p.razon_avance_tiempo,"estudiantes");indice++;

      udt.data.push(valueToPush);
    }

    const edata: Array<ExcelJson> = [];
    edata.push(udt);
    this.exportService.exportReporteEventoToExcelSinCiclos(edata, 'Reporte general de avance de metas anuales '+moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
  }

  send_background_color_option(porciento:any,razon:any,option:string){
    var avance_color = "D4D5D4";
    if(option=="carteles"){
      avance_color = "ddd9c4";
    }else if(option=="estudiantes"){
      avance_color = "f2dcdb";
    }else if(option=="campus1"){
      avance_color = "ebf1de";
    }else if(option=="campus2"){
      avance_color = "dce6f1";
    }

    if(porciento!==null && porciento!==""){
      if (porciento >= (100*razon)){
        avance_color = "98ff66";
      } else if (porciento <= (99*razon) && porciento >= (80*razon)) {
        avance_color = "feff00";
      } else if (porciento <= (79*razon) && porciento >= (65*razon)) {
        avance_color = "ffc200";
      } else if (porciento < (65*razon)) {
        avance_color = "f50504";
      }
    }
    return avance_color
  }

  background_color_option(porciento:any,razon:any, tipo:string){
    var avance_color = "E6F1FA";
    if(tipo=="carteles"){
      avance_color = "8db4e2";
    }else{
      avance_color = "E6F1FA";
    }
    if(porciento!==null && porciento!==""){
      if (porciento >= (100*razon)){
        avance_color = "98ff66";
      } else if (porciento <= (99*razon) && porciento >= (80*razon)) {
        avance_color = "feff00";
      } else if (porciento <= (79*razon) && porciento >= (65*razon)) {
        avance_color = "ffc200";
      } else if (porciento < (65*razon)) {
        avance_color = "f50504";
      }
    }
    return avance_color
  }

  limpiarFormularioExportar(){
    this.selectInstituciones = 0;
    this.selectYear = 0;
    this.selectCiclo = 0;
    this.listaCiclosBuscar = [];
    this.reporteConCiclos = false;
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
    console.log("limpiar");
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
