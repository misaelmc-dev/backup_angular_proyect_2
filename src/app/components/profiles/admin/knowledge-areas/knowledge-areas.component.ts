import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";
import {DisciplinesService} from "../../../../services/disciplines.service";
import {KnowledgeAreasService} from "../../../../services/knowledge-areas.service";

@Component({
  selector: 'app-knowledge-areas',
  templateUrl: './knowledge-areas.component.html',
  styleUrls: ['./knowledge-areas.component.css']
})
export class KnowledgeAreasComponent implements OnInit {

  listaAreas:any[]=[];
  listaAreasTotal:any[]=[];
  listaInstituciones:any[]=[];
  listaInstitucionesFiltro:any[]=[];
  listaInstitucionesTotal:any[]=[];
  listaDisiplinasFiltro:any[]=[];
  listaDisiplinasTotal:any[]=[];

  infoAreaConsultada:any[]=[];

  areaId:number=0;
  areaNombre:string="";
  areaInstitucion:number=0;

  filtroSelectInstitucion:number=0;
  filtroSelectDisiplina:number=0;
  criterioBusqueda:string="";

  obligatorioInstitucion:boolean=false;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1:number = 1
  update2:number = 1

  constructor(public institucionService: InstitutionScintraService,
              public disciplinasService: DisciplinesService,
              public areasService: KnowledgeAreasService) { }

  ngOnInit(): void {
    this.obtenerTodasAreas();
    this.obtenerInstitucionesConAreas();
    this.obtenerDisciplinasConAreas();
  }

  obtenerTodasAreas(){
    this.loadingCount++
    this.areasService.getAllAreas(false,this.pageNumber,this.pageSize).subscribe((resArea: any) => {
      this.loadingCount--
      this.listaAreas=resArea.data;
      this.listaAreasTotal=resArea.data;
      this.totalItems=resArea.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las áreas del conocimiento'});
      console.error(err)
    });
  }

  obtenerInstitucionesConAreas(){
    this.loadingCount++
    this.institucionService.getInstitutionsWidthAreas().subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstituciones=resIns;
      this.listaInstitucionesTotal=resIns;
      this.listaInstitucionesFiltro=resIns;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones del sistema'});
      console.error(err)
    });
  }

  obtenerDisciplinasConAreas(){
    this.loadingCount++
    this.disciplinasService.getDisciplinesWithAreas().subscribe((resDis: any) => {
      this.loadingCount--
      this.listaDisiplinasTotal=resDis;
      this.listaDisiplinasFiltro=resDis;
      //console.log(resDis);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las diciplinas del sistema'});
      console.error(err)
    });
  }

  filtroDataLoadInstituciones = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxDisc:any = []; if(this.filtroSelectDisiplina!=0){ auxDisc = [this.filtroSelectDisiplina] }
    this.institucionService.getInstitutionsWidthAreasByDisciplines(currentPage,pageSize,searchTerm,
      auxDisc).subscribe((resInst: any) => {
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
    this.filtrarAreas(false,'');
    this.update1++;
    this.update2++;
  }

  filtroDataLoadDisciplinas = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                     loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInst:any = []; if(this.filtroSelectInstitucion!=0){ auxInst = [this.filtroSelectInstitucion] }
    this.disciplinasService.getDisciplinesWithAreasByInstitucion(currentPage,pageSize,searchTerm,
      auxInst).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron las disiplinas'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroDisciplinas(event:number){
    this.filtroSelectDisiplina = event;
    this.filtrarAreas(false,'');
    this.update1++;
    this.update2++;
  }

  filtrarAreas(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(this.criterioBusqueda!="" || this.filtroSelectInstitucion>0 || this.filtroSelectDisiplina>0) {
      let auxSelectInstitucion:any=[];
      let auxSelectDisciplina:any=[];
      if(this.filtroSelectInstitucion>0){auxSelectInstitucion=[this.filtroSelectInstitucion]}
      if(this.filtroSelectDisiplina>0){auxSelectDisciplina=[this.filtroSelectDisiplina]}
      this.loadingCount++
      this.areasService.getAreasByFilter(this.pageNumber,this.pageSize,this.criterioBusqueda,
        auxSelectInstitucion,auxSelectDisciplina).subscribe((resAreaFilt: any) => {
        this.loadingCount--
        this.listaAreas=resAreaFilt.data;
        this.totalItems=resAreaFilt.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las áreas de conocimiento'});
        console.error(err)
      });
    }else{
      this.obtenerTodasAreas();
    }
  }

  verInfoArea(idArea:number){
    this.areaId=0;
    this.areaNombre="";
    this.areaInstitucion=0;
    this.infoAreaConsultada=[];
    this.loadingCount++
    this.areasService.getAreaById([idArea]).subscribe((resAreaCon: any) => {
      this.loadingCount--
      this.infoAreaConsultada=resAreaCon;
      this.abrirModalVer();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las áreas de conocimiento'});
      console.error(err)
    });
  }

  abrirModalVer(){
    this.areaId=this.infoAreaConsultada[0].id;
    this.areaNombre=this.infoAreaConsultada[0].nombre;
    this.areaInstitucion=this.infoAreaConsultada[0].id_institucion;
  }

  abrirModalCrear(){
    this.areaId=0;
    this.areaNombre="";
    this.areaInstitucion=0;
  }

  crearArea(){
    this.loadingCount++
    this.areasService.addArea(this.areaNombre,this.areaInstitucion).subscribe(() => {
      this.loadingCount--
      this.obtenerTodasAreas();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el area de conocimiento'});
      console.error(err)
    });
  }

  abrirModalActualizar(ll:any){
    this.areaId = ll.id;
    this.areaNombre = ll.nombre;
    if(ll.id_institucion !== null ){
      this.areaInstitucion = ll.id_institucion;
      this.obligatorioInstitucion = true;
    }else{
      this.areaInstitucion = 0;
      this.obligatorioInstitucion = false;
    }
  }

  actualizarArea(){
    this.loadingCount++
    this.areasService.updateArea(this.areaId,this.areaNombre,this.areaInstitucion).subscribe(() => {
      this.loadingCount--
      this.obtenerTodasAreas();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el área del conocimiento'});
      console.error(err)
    });
  }

  eliminarArea(ll:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el área del conocimiento?',
      html: '<b>ID:</b> '+ll.id+'<br><b>Nombre:</b> "'+ll.nombre+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.areasService.deleteArea(ll.id).subscribe(() => {
          this.obtenerTodasAreas();
        })
      }
    });
  }

  limpiarFiltros(){
    this.filtroSelectInstitucion=0;
    this.filtroSelectDisiplina=0;
    this.update1 = 0;
    this.update2 = 0;
    this.criterioBusqueda="";
    this.pageNumber=1;
    this.obtenerTodasAreas();
  }

  cambiarPagina(event: any) {
    this.pageNumber = event;
    this.filtrarAreas(true,'');
  }

}

