import {Component, Input, OnInit, SecurityContext} from '@angular/core';
import {EventService} from "../../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import Swal from "sweetalert2";
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-event-participation-files-encounter',
  templateUrl: './event-participation-files-encounter.component.html',
  styleUrls: ['./event-participation-files-encounter.component.css']
})
export class EventParticipationFilesEncounterComponent implements OnInit {

  @Input('eventoId') eventoId:number = 0;

  @Input('participacionId') participacionId:number = 0;

  eventoTipoId:number=4;

  tiposArchivosEvento:any[]=[];
  tiposArchivoPart:any[]=[];
  tiposArchivoPartId:number=0;
  archivosEvento:any[]=[];
  archivosParticipacion:any[]=[];
  archivosLimite:boolean=false;
  archivosLimiteTemp:boolean=false;
  archivosParticipacionTemporal:any[]=[];

  archivoTipo:number=0;
  archivoNombre:string="";
  archivoDescripcion:string="";

  eventoArchivo:any;

  paso:number=1;

  elArchivo:any;
  ruta:string="C:\\fakepath\\20230411-1.PNG";

  pageNumbersEvento:number = 0;
  pageNumberEvento:number = 1;
  pageNumbersArrayEvento:any=[];
  pageNumbersArrayActiveEvento:any=[];
  pageSizeEvento:number = 5;
  totalItemsEvento:number = 0;
  labelPaginationEvento:string = '';

  pageNumbersPart:number = 0;
  pageNumberPart:number = 1;
  pageNumbersArrayPart:any=[];
  pageNumbersArrayActivePart:any=[];
  pageSizePart:number = 5;
  totalItemsPart:number = 0;
  labelPaginationPart:string = '';

  loadingCount:number=0;

  constructor(private eventService: EventService,
              public domSanitizer: DomSanitizer,
              public permisosScicomService: PermisosScicomService) { }

  ngOnInit(): void {
    this.loadTipoArchivos()
  }

  loadTipoArchivos(){
    this.loadingCount++
    this.eventService.getFileTypeListByEventType(this.eventoTipoId).subscribe((resTipArch: any) => {
      this.loadingCount--
      let auxTiposArchivo:any=[];
      for(let ta of resTipArch){
        if(ta.codigo_interno=="convocPart" ||
           ta.codigo_interno=="programaPart" ||
           ta.codigo_interno=="excelEvalCartPart" ||
           ta.codigo_interno=="reportEjecPart" ||
           ta.codigo_interno=="cartGan1erPart" ||
           ta.codigo_interno=="cartGan2doPart" ||
           ta.codigo_interno=="cartGan3erPart"){
          auxTiposArchivo.push(ta);
        }
        if(ta.codigo_interno=="evidPart"){
          this.tiposArchivoPart=ta;
          this.tiposArchivoPartId=ta.id;
        }
      }
      this.tiposArchivosEvento = auxTiposArchivo;
      for(let at of this.tiposArchivosEvento){
        if(at.codigo_interno=="convocPart"){at.real="Convocatoria al evento o cartel de difusión para estudiantes "}
        if(at.codigo_interno=="programaPart"){at.real="Programa del evento"}
        if(at.codigo_interno=="excelEvalCartPart"){at.real="Excel de evaluación de los carteles "}
        if(at.codigo_interno=="reportEjecPart"){at.real="Reporte ejecutivo del evento"}
        if(at.codigo_interno=="cartGan1erPart"){at.real="Cartel ganador de primer lugar"}
        if(at.codigo_interno=="cartGan2doPart"){at.real="Cartel ganador de segundo lugar"}
        if(at.codigo_interno=="cartGan3erPart"){at.real="Cartel ganador de tercer lugar"}
      }
      this.loadArchivosEvento();
      this.loadArchivosParticipacion();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de archivo'});
      console.error(err)
    });
  }

  loadArchivosEvento(){
    this.loadingCount++
    let idsTipArchEvent = this.tiposArchivosEvento.map((value: any) => value.id)
    //console.log("idsTipArchEvent",idsTipArchEvent)
    this.eventService.getFileListByTypeFile(this.eventoId,idsTipArchEvent,this.participacionId).subscribe((resArchEve: any) => {
      this.loadingCount--
      this.archivosEvento = resArchEve;
      this.orderBy(this.archivosEvento)
      //console.log("resArchEve",resArchEve)
      this.loadPagination1(1);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los archivos del evento'});
      console.error(err)
    });
  }

  loadArchivosParticipacion(){
    this.loadingCount++
    let idsTipArchPart = [this.tiposArchivoPartId]
    //console.log("idsTipArchPart",idsTipArchPart)
    this.eventService.getFileListByTypeFile(this.eventoId,idsTipArchPart,this.participacionId).subscribe((resArchPart: any) => {
      this.loadingCount--
      this.archivosParticipacion = resArchPart;
      if(this.archivosParticipacion.length>50){
        this.archivosLimite=true;
        this.archivosParticipacion.slice(0,49)
      }
      //console.log("resArchPart",resArchPart)
      this.loadPagination2(1,resArchPart);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los archivos de la participacion'});
      console.error(err)
    });
  }

  openModalFileEvento(){
    this.paso=1;
    this.archivoTipo=0;
    this.archivoNombre="";
    this.archivoDescripcion="";
    this.eventoArchivo="";
  }

  openModalFileParticipacion(){
    this.archivoTipo=this.tiposArchivoPartId;
    this.archivosParticipacionTemporal=[];
  }

  cambiarTipo(){
    this.archivoNombre="";
    this.archivoDescripcion="";
    this.eventoArchivo="";
  }

  cambiarPaso(cambio?:string){
    if(this.paso>=1 && this.paso<=2){
      if(cambio=="anterior"){
        this.paso--
      }else if(cambio=="siguiente"){
        this.paso++
      }
    }
  }

  extractFileFromEvent(event: any) {
    this.eventoArchivo = event.target.files[0]
  }

  getValidFileType(idfileType:number){
    var codeTypeFile = "";
    for(let tae of this.tiposArchivosEvento){
      if(tae.id==idfileType){
        codeTypeFile=tae.codigo_interno;
      }
    }
    var accept:string = "";
    switch(codeTypeFile) {
      case "convocPart":{accept=".ppt,.pptx,image/jpg,image/png,image/jpeg";break;}
      case "programaPart":{accept=".ppt,.pptx,.docx,image/jpg,image/png,image/jpeg";break;}
      case "excelEvalCartPart":{accept=".xlsx,.xls";break;}
      case "reportEjecPart":{accept=".ppt,.pptx";break;}
      case "cartGan1erPart":{accept=".ppt,.pptx";break;}
      case "cartGan2doPart":{accept=".ppt,.pptx";break;}
      case "cartGan3erPart":{accept=".ppt,.pptx";break;}
    }
    return accept
  }

  saveFile(){
    console.log("this.eventoArchivo",this.eventoArchivo)
    this.loadingCount++
    this.eventService.addFileEventWithPart(this.archivoNombre,this.archivoDescripcion,this.eventoArchivo,this.archivoTipo,this.eventoId,this.participacionId).subscribe((resI: any) => {
      this.loadingCount--
      Swal.fire({icon: 'success',text: 'El archivo se guardó correctamente'});
      this.loadArchivosEvento();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se guardó el archivo en el evento especificado'});
      console.error(err)
    });
  }

  viewFileEvent(archivourl:string) {
    this.loadingCount++
    this.eventService.viewEventFile(archivourl).subscribe((resfile: Blob) => {
      this.loadingCount--
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      window.open(fileUrl.toString(), '_blank');
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se descargó el archivo especificado del evento'});
      console.error(err)
    });
  }

  viewTemporalFile(file: string){
    //console.log("file",file)
    let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file))
    let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
    // @ts-ignore
    window.open(fileUrl.toString(), '_blank');
  }

  deleteFileEvent(archivo:any,tipArch?:string){
    Swal.fire({
      title: '¿Deseas eliminar el archivo?',
      text: ' Archivo : '+archivo.nombre,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCount++
        this.eventService.deleteEventFile(archivo.id).subscribe((resDelete: any) => {
          this.loadingCount--
          console.log("Archivo Eliminado",resDelete);
          if(tipArch=='evento'){
            this.loadArchivosEvento();
          }else{
            this.loadArchivosParticipacion();
          }
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se eliminó el archivo del de evento'});
          console.error(err)
        });
      }
    });
  }

  extractMultiplesArchivos(event:any) {
    //console.log("this.elArchivo",this.elArchivo);
    let auxArchPartTemp:any = [];
    if(this.archivosParticipacionTemporal.length>0){
      for(let atf of this.archivosParticipacionTemporal){
        auxArchPartTemp.push(atf);
      }
      for(let etf of event.target.files){
        auxArchPartTemp.push(etf);
      }
    }else{
      auxArchPartTemp = event.target.files;
    }
    this.archivosParticipacionTemporal = auxArchPartTemp;
    //console.log("this.archivosParticipacionTemporal",this.archivosParticipacionTemporal)
    this.calcularLimiteArchivos()
  }

  calcularLimiteArchivos(){
    const totalArchivos = this.archivosParticipacion.length + this.archivosParticipacionTemporal.length;
    //console.log("totalArchivos",totalArchivos)
    if(totalArchivos>=50){
      this.archivosLimiteTemp=true
      /*
      const reducir = this.archivosParticipacionTemporal.length-(totalArchivos - 50)
      let auxArchivosTemporales = this.archivosParticipacionTemporal;
      console.log("reducir",reducir)
      this.archivosParticipacionTemporal=auxArchivosTemporales.slice(0,reducir);
      */
    }else{
      this.archivosLimiteTemp=false;
    }
  }

  srcImg(resfile:any) {

      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore

      console.log("fileUrl",fileUrl)
      fileUrl = this.utf8_to_b64(fileUrl)
      fileUrl = "data:image/png;base64,"+fileUrl
      console.log("fileUrl",fileUrl)

      return fileUrl


    }

    limpiarUrl(file: any){

    let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file))
    let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
    // @ts-ignore

    /*
    fileUrl = fileUrl.slice(9,300)
    fileUrl = "https"+fileUrl
    console.log("fileUrl", fileUrl)
     */

    /*
    console.log("fileUrl",fileUrl)
    fileUrl = this.utf8_to_b64(fileUrl)
    fileUrl = "data:image/png;base64,"+fileUrl
    console.log("fileUrl",fileUrl)
    */

    /*
    return fileUrl
     */
  }

  utf8_to_b64( str:string ) {
    return window.btoa(unescape(encodeURIComponent( str )));
  }

  removeTemporalFile(cracion:number){
    var auxArchTemporal = [];
    for(let arch of this.archivosParticipacionTemporal){
      if(arch.lastModified != cracion){
        auxArchTemporal.push(arch)
      }
    }
    this.archivosParticipacionTemporal = auxArchTemporal;
    this.calcularLimiteArchivos()
  }


  saveMultipleFile(){
    var validUploadAllFiles:number=1;
    Swal.fire({
      title: '¿Deseas guardar la lista de archivos?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let fileCounter = 0;
        for(let apt of this.archivosParticipacionTemporal){
          fileCounter++
          if(((apt.size/1024)/1024)<10){
            var nombre = apt.name;
            var file = apt;
            this.archivoDescripcion = "";
            this.loadingCount++
            this.eventService.addFileEventWithPart(nombre,this.archivoDescripcion,file,this.tiposArchivoPartId,this.eventoId,this.participacionId).subscribe((resI: any) => {
              this.loadingCount--
              Swal.fire({icon: 'success',text: 'Todos los archivos se guardaron correctamente'});
              if(this.archivosParticipacionTemporal.length == fileCounter){
                this.loadArchivosParticipacion();
                Swal.fire({icon: 'success',text: 'Todos los archivos se guardaron correctamente'});
              }
            }, (err:any) =>{
              this.loadingCount--
              Swal.fire({icon: 'error',text: 'Error al guardar los archivos de especificados'});
              if(this.archivosParticipacionTemporal.length == fileCounter){
                this.loadArchivosParticipacion();
              }
              console.error(err)
            });
          }
        }
      }
    });
  }

  loadPagination1(pageValue?:any){
    this.totalItemsEvento = this.archivosEvento.length;
    this.pageNumbersEvento = Math.ceil(this.totalItemsEvento / this.pageSizeEvento);
    this.pageNumbersArrayEvento = [];
    for(var i=1 ; i<= this.pageNumbersEvento ; i++){
      this.pageNumbersArrayEvento.push({"id":i});
    }
    if(pageValue){
      if(pageValue=='prev'){
        this.pageNumberEvento--;
      }else if(pageValue=='next'){
        this.pageNumberEvento++;
      }else{
        this.pageNumberEvento = pageValue;
      }
    }
    var pageEnd = this.pageNumberEvento * this.pageSizeEvento;
    var pageStart = pageEnd - (this.pageSizeEvento - 1);
    if(this.pageNumberEvento==this.pageNumbersEvento){
      pageEnd = this.totalItemsEvento;
    }
    this.labelPaginationEvento = "Muestra listado de archivos del "+pageStart+" al "+pageEnd+", Total: "+this.totalItemsEvento;
  }

  loadPagination2(pageValue?:any,listaArchivos?:any){
    //console.log("this.archivosParticipacion.length",this.archivosParticipacion.length)
    this.totalItemsPart = this.archivosParticipacion.length;
    this.pageNumbersPart = Math.ceil(this.totalItemsPart / this.pageSizePart);
    this.pageNumbersArrayPart = [];
    for(var i=1 ; i<= this.pageNumbersPart ; i++){
      this.pageNumbersArrayPart.push({"id":i});
    }
    if(pageValue){
      if(pageValue=='prev'){
        this.pageNumberPart--;
      }else if(pageValue=='next'){
        this.pageNumberPart++;
      }else{
        this.pageNumberPart = pageValue;
      }
    }
    this.pageNumbersArrayActivePart = []
    var activePage:number = 0;
    activePage = this.pageNumberPart-2;
    if(activePage>0){this.pageNumbersArrayActivePart.push({"id":activePage});}
    activePage = this.pageNumberPart-1;
    if(activePage>0){this.pageNumbersArrayActivePart.push({"id":activePage});}
    this.pageNumbersArrayActivePart.push({"id":this.pageNumberPart});
    activePage = this.pageNumberPart+1;
    for(let i of this.pageNumbersArrayPart){
      if(i.id==activePage){
        this.pageNumbersArrayActivePart.push({"id":activePage});
      }
    }
    activePage = this.pageNumberPart+2;
    for(let i of this.pageNumbersArrayPart){
      if(i.id==activePage){
        this.pageNumbersArrayActivePart.push({"id":activePage});
      }
    }

    var pageEnd = this.pageNumberPart * this.pageSizePart;
    var pageStart = pageEnd - (this.pageSizePart - 1);
    if(this.pageNumberPart==this.pageNumbersPart){
      pageEnd = this.totalItemsPart;
    }
    this.labelPaginationPart = "Muestra listado de archivos "+pageStart+" al "+pageEnd+", Total: "+this.totalItemsPart;
  }

  downloadMultiplesArchivos(){
    Swal.fire({
      title: '¿Deseas descargar toda la lista de archivos?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Sí, descargar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        for(let ap of this.archivosParticipacion){
          this.downloadFile(ap.uri,ap.nombre);
        }
      }
    });
  }
  downloadFile(archivourl:string,archivoName:string) {
    this.loadingCount++
    this.eventService.viewEventFile(archivourl).subscribe((resfile: Blob) => {
      this.loadingCount--
      let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(resfile))
      let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
      // @ts-ignore
      saveAs(fileUrl,archivoName);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se descargó el archivo especificado del evento'});
      console.error(err)
    });
  }

  orderBy(sin_orden: any) {
    let con_orden: any[] = sin_orden;
    con_orden.sort((n1, n2) => {
      if (n1.id_tipo_archivo > n2.id_tipo_archivo) {
        return 1;
      }
      if (n1.id_tipo_archivo < n2.id_tipo_archivo) {
        return -1;
      }
      return 0;
    });
  }

}
