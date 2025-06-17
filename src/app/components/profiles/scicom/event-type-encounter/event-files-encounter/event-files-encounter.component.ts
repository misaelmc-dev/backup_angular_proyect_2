import {Component, SecurityContext, OnInit, Input} from '@angular/core';
import {PermisosScicomService} from "../../../../../services/scicom/permisos-scicom.service";
import {EventService} from "../../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-files-encounter',
  templateUrl: './event-files-encounter.component.html',
  styleUrls: ['./event-files-encounter.component.css']
})
export class EventFilesEncounterComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  @Input('eventoId') eventoId:number = 0;

  nombre:string="";
  tipo:number;
  estatus:string="";

  archivos:any=[];

  archivosConvocatoria:any[]=[];
  archivosEvidencia:any[]=[];

  tiposArchivos:any=[];

  nombreArchivo:string = '';
  descripcionArchivo:string = '';
  eventoArchivo:any;
  tipoArchivoSelected:any = 0;
  filtroTipoArchivo:number;

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageStart:number = 0;
  pageEnd:number = 0;
  pageSize:number = 10;
  totalItems:number = 0;
  labelPagination:string = '';

  pageNumbers2:number = 0;
  pageNumber2:number = 1;
  pageNumbersArray2:any=[];
  pageStart2:number = 0;
  pageEnd2:number = 0;
  pageSize2:number = 10;
  totalItems2:number = 0;
  labelPagination2:string = '';

  loadingCount:number = 0;

  titulo:boolean = false;

  archivoVacio = '';

  constructor(private eventService: EventService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private router: Router,
              public permisosScicomService: PermisosScicomService) { }

  ngOnInit(): void {
    this.loadTitle();
    this.loadEventos();
    this.loadArchivos();
    this.loadTipoArchivos();
  }

  loadTitle = () => {
    if(this.router.url.includes('/event-update/')){
      this.titulo = true;
    }
  }

  loadEventos = () => {
    this.loadingCount++
    this.eventService.getEventById(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.nombre = res[0].nombre;
      this.tipo = res[0].id_tipo_evento;
      this.estatus = res[0].id_estatus_evento;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los datos del evento especificado'});
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
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de archivo del sistema scicom'});
      console.error(err)
    });
  }

  loadArchivos = () => {
    this.loadingCount++
    this.eventService.getFileList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.archivosConvocatoria=[];
      this.archivosEvidencia=[];
      this.archivos = res;
      for(let camp of this.archivos){
        if(camp.id_tipo_archivo==4){
          this.archivosConvocatoria.push(camp);
        }else if(camp.id_tipo_archivo==3){
          this.archivosEvidencia.push(camp);
        }
      }
      this.loadPagination();
      this.loadPagination2();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los archivos del evento especificado'});
      console.error(err)
    });
  }

  saveFile = () => {
    this.loadingCount++
    this.eventService.addFileEvent(this.nombreArchivo,this.descripcionArchivo,this.eventoId.toString(),this.tipoArchivoSelected,this.eventoArchivo).subscribe((resI: any) => {
      this.loadingCount--
      Swal.fire({icon: 'success',text: 'El archivo se guardó correctamente'});
      this.loadArchivos();
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

  deleteFileEvent = (archivo:any) => {
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
          console.log("Eliminado",resDelete);
          this.loadArchivos();
        }, (err:any) =>{
          this.loadingCount--
          Swal.fire({icon: 'error',text: 'No se eliminó el archivo del de evento'});
          console.error(err)
        });
        this.loadArchivos();
      }
    });
  }

  extractFileFromEvent(event: any) {
    this.eventoArchivo = event.target.files[0]
  }

  loadPagination = (pageValue?:any) => {
    this.totalItems = this.archivosConvocatoria.length;
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
    this.labelPagination = "Muestra archivos del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
  }

  loadPagination2 = (pageValue?:any) => {
    this.totalItems2 = this.archivosEvidencia.length;
    this.pageNumbers2 = Math.ceil(this.totalItems2 / this.pageSize2);
    this.pageNumbersArray2 = [];
    for(var i=1 ; i<= this.pageNumbers2 ; i++){
      this.pageNumbersArray2.push({"id":i});
    }
    if(pageValue){
      if(pageValue=='prev'){
        this.pageNumber2 = this.pageNumber2-1;
      }else if(pageValue=='next'){
        this.pageNumber2 = this.pageNumber2+1;
      }else{
        this.pageNumber2 = pageValue;
      }
    }
    this.pageEnd2 = this.pageNumber2 * this.pageSize2;
    this.pageStart2 = this.pageEnd2 - (this.pageSize2 - 1);
    if(this.pageNumber2==this.pageNumbers2){
      this.pageEnd2 = this.totalItems2;
    }
    this.labelPagination2 = "Muestra archivos del "+this.pageStart2+" al "+this.pageEnd2+", Total: "+this.totalItems2;
  }

  cleanValues(){
    this.tipoArchivoSelected =  4;
    this.nombreArchivo = '';
    this.descripcionArchivo = '';
    this.eventoArchivo = '';
    this.archivoVacio = '';
  }

  cleanValues2(){
    this.tipoArchivoSelected =  3;
    this.nombreArchivo = '';
    this.descripcionArchivo = '';
    this.eventoArchivo = '';
    this.archivoVacio = '';
  }

}
