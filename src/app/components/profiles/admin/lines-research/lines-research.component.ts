import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {LineasInvestigacionService} from "../../../../services/lineas-investigacion.service";
import {DisciplinesService} from "../../../../services/disciplines.service";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";
import {toNumber} from "lodash";


@Component({
  selector: 'app-lines-research',
  templateUrl: './lines-research.component.html',
  styleUrls: ['./lines-research.component.css']
})
export class LinesResearchComponent implements OnInit {

  listaLineas:any[]=[];
  listaLineasTotal:any[]=[];
  listaDisiplinas:any[]=[];
  listaDisiplinasTotal:any[]=[];
  listaInstituciones:any[]=[];
  listaInstitucionesTotal:any[]=[];
  infoLineaConsultada:any[]=[];

  lineaId:number=0;
  lineaNombre:string="";
  lineaDiciplina:number=0;
  lineaInstitucion:number=0;

  filtroSelectInstitucion:number=0;
  criterioBusqueda:string="";

  obligatorioInstitucion:boolean=false;
  obligatorioDiciplina:boolean=false;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1: number = 1;


  constructor(public lineasInvestigacionService: LineasInvestigacionService,
              public disiplinaService: DisciplinesService,
              public institucionService: InstitutionScintraService) { }

  ngOnInit(): void {
    this.obtenerTodasLineas();
    this.obtenerTodasDisciplinas();
  }

  obtenerTodasLineas(){
    this.loadingCount++
    this.lineasInvestigacionService.getAllLines(this.pageNumber,this.pageSize).subscribe((resLine: any) => {
      this.loadingCount--
      //console.log("resLine",resLine)
      this.listaLineas=resLine.data;
      this.listaLineasTotal=resLine.data;
      this.totalItems=resLine.total;
      //console.log("resLine",resLine);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las lineas de investigacion del sistema'});
      console.error(err)
    });
  }

  obtenerTodasDisciplinas(){
    this.loadingCount++
    this.disiplinaService.getDiciplinesList().subscribe((resDis: any) => {
      this.loadingCount--
      this.listaDisiplinasTotal=resDis;
      this.obtenerTodasInstituciones();
      //console.log("resDisiplinas",resDis);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las diciplinas del sistema'});
      console.error(err)
    });
  }

  obtenerTodasInstituciones(){
    this.loadingCount++
    this.institucionService.getInstitutionsScWidthLinesList().subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstituciones=resIns;
      this.listaInstitucionesTotal=resIns;
      this.filtrarDisciplinas();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones del sistema'});
      console.error(err)
    });
  }

  filtroDataLoadInstituciones = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    this.institucionService.getInstitutionsScWidthLines(currentPage,pageSize,searchTerm).subscribe((resInst: any) => {
      for (let item of resInst.data){ lista.push({"id":item.id,"texto":item.razon_social}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resInst.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron las instituciones Scintra'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroInstituciones(event:number){
    this.filtroSelectInstitucion = event;
    this.filtrarLineas(false,'');
    this.update1++;
  }

  filtrarLineas(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(this.criterioBusqueda!='' || this.filtroSelectInstitucion>0){
      let auxInstitucion:any=[];
      if(this.filtroSelectInstitucion>0){ auxInstitucion=[this.filtroSelectInstitucion];}
      this.loadingCount++
      this.lineasInvestigacionService.getLinesByFilter(this.pageNumber,this.pageSize,
        this.criterioBusqueda,auxInstitucion).subscribe((resLine: any) => {
        this.loadingCount--
        //console.log("resLine",resLine);
        this.listaLineas=resLine.data;
        this.totalItems=resLine.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las lineas de investigacion del sistema'});
        console.error(err)
      });
    }else{
      this.obtenerTodasLineas()
    }
  }

  filtrarDisciplinas(){
    var idIndtitucion:number = 0;
    if(this.lineaInstitucion==0){ idIndtitucion=null; }else{ idIndtitucion=toNumber(this.lineaInstitucion); }
    //console.log("idIndtitucion",idIndtitucion);
    this.listaDisiplinas = this.listaDisiplinasTotal.filter(item => item.id_institucion === idIndtitucion)
    //console.log("this.listaDisiplinas",this.listaDisiplinas);
  }

  verInfoLinea(idLinea:number){
    this.lineaId=0;
    this.lineaNombre="";
    this.lineaDiciplina=0;
    this.lineaInstitucion=0;
    this.infoLineaConsultada=[];
    this.loadingCount++
    this.lineasInvestigacionService.getLineById([idLinea]).subscribe((resLineCon: any) => {
      this.loadingCount--
      this.infoLineaConsultada=resLineCon;
      //console.log("this.infoLineaConsultada",this.infoLineaConsultada);
      this.abrirModalVer();
      //console.log("resLineCon",resLineCon);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las lineas de investigacion del sistema'});
      console.error(err)
    });
  }

  abrirModalVer(){
    this.lineaId=this.infoLineaConsultada[0].id;
    this.lineaNombre=this.infoLineaConsultada[0].nombre;
    this.lineaDiciplina=this.infoLineaConsultada[0].id_disciplina;
    this.lineaInstitucion=this.infoLineaConsultada[0].id_institucion;
  }

  abrirModalCrear(){
    this.lineaId=0;
    this.lineaNombre="";
    this.lineaDiciplina=0;
    this.lineaInstitucion=0;
    this.listaDisiplinas = this.listaDisiplinasTotal.filter(item => item.id_institucion === null)
  }

  crearLinea(){
    this.loadingCount++
    this.lineasInvestigacionService.addLine(this.lineaNombre,this.lineaDiciplina,this.lineaInstitucion).subscribe(() => {
      this.loadingCount--
      //console.log("resLine",resLine);
      this.pageNumber=1;
      this.obtenerTodasLineas();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear la línea de investigación'});
      console.error(err)
    });
  }

  abrirModalActualizar(ll:any){
    //console.log("ll",ll);
    this.lineaId = ll.id;
    this.lineaNombre = ll.nombre;
    if(ll.id_institucion !== null ){
      this.lineaInstitucion = ll.id_institucion;
      this.listaDisiplinas = this.listaDisiplinasTotal.filter(item => item.id_institucion === ll.id_institucion)
      this.obligatorioInstitucion = true;
    }else{
      this.lineaInstitucion = 0;
      this.listaDisiplinas = this.listaDisiplinasTotal.filter(item => item.id_institucion === null)
      this.obligatorioInstitucion = false;
    }
    if(ll.id_disciplina !== null ){
      this.lineaDiciplina = ll.id_disciplina;
      this.obligatorioDiciplina = true;
    }else{
      this.lineaDiciplina = 0;
      this.obligatorioDiciplina = false;
    }
  }

  actualizarLinea(){
    this.loadingCount++
    this.lineasInvestigacionService.updateLine(this.lineaId,this.lineaNombre,this.lineaDiciplina,this.lineaInstitucion).subscribe(() => {
      this.loadingCount--
      this.pageNumber=1;
      this.obtenerTodasLineas();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar la linea de investigacion'});
      console.error(err)
    });
  }

  eliminarLinea(ll:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar la línea de investigación?',
      html: '<b>ID:</b> '+ll.id+'<br><b>Nombre:</b> "'+ll.nombre+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.lineasInvestigacionService.deleteLine(ll.id).subscribe(() => {
          this.pageNumber=1;
          this.obtenerTodasLineas();
        })
      }
    });
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.filtroSelectInstitucion=0;
    this.pageNumber=1;
    this.update1=0;
    this.obtenerTodasLineas();
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

  cambiarPagina(event: any) {
    this.pageNumber = event;
    this.filtrarLineas(true,'');
  }

}
