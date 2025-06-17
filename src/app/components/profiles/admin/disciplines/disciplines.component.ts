import {Component,OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {DisciplinesService} from "../../../../services/disciplines.service";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";
import {KnowledgeAreasService} from "../../../../services/knowledge-areas.service";

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.css']
})
export class DisciplinesComponent implements OnInit {

  listaDisciplinas:any[]=[];
  listaDisciplinasTotal:any[]=[];
  listaInstituciones:any[]=[];
  listaInstitucionesFiltro:any[]=[];
  listaInstitucionesTotal:any[]=[];
  listaAreas:any[]=[];
  listaAreasFiltro:any[]=[];
  listaAreasTotal:any[]=[];

  disciplinaId:number=0;
  disciplinaNombre:string="";
  disciplinaArea:number=0;
  disciplinaInstitucion:number=0;

  criterioBusqueda:string="";
  filtroSelectInstitucion:number=0;
  filtroSelectArea:number=0;

  obligatorioInstitucion:boolean=false;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1:number = 1
  update2:number = 1

  constructor(public institucionService: InstitutionScintraService,
              public areasService: KnowledgeAreasService,
              public disciplinasService: DisciplinesService) { }

  ngOnInit(): void {
    this.obtenerTodasDisciplinas();
    this.obtenerTodasInstituciones();
    this.obtenerTodasAreas();
  }

  obtenerTodasDisciplinas(){
    this.loadingCount++
    this.disciplinasService.getAllDiciplines(this.pageNumber,this.pageSize).subscribe((resDis: any) => {
      this.loadingCount--
      this.listaDisciplinas=resDis.data;
      this.listaDisciplinasTotal=resDis.data;
      this.totalItems=resDis.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las diciplinas del sistema'});
      console.error(err)
    });
  }

  obtenerTodasInstituciones(){
    this.loadingCount++
    this.institucionService.getInstitutionsWidthDisciplines().subscribe((resIns: any) => {
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

  obtenerTodasAreas(){
    this.loadingCount++
    this.areasService.getAreasWidthDisciplines().subscribe((resArea: any) => {
      this.loadingCount--
      this.listaAreas=resArea;
      this.listaAreasTotal=resArea;
      this.listaAreasFiltro=resArea;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las areas del sistema'});
      console.error(err)
    });
  }

  filtroDataLoadInstituciones = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxArea:any = []; if(this.filtroSelectArea!=0){ auxArea = [this.filtroSelectArea] }
    this.institucionService.getInstitutionsWidthDisciplinesByAreas(currentPage,pageSize,searchTerm,
      auxArea).subscribe((resInst: any) => {
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
    this.filtrarDisciplinas(false,'');
    this.update1++;
    this.update2++;
  }

  filtroDataLoadAreas = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                               loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInst:any = []; if(this.filtroSelectInstitucion!=0){ auxInst = [this.filtroSelectInstitucion] }
    this.areasService.getAreasWidthDisciplinesByInst(currentPage,pageSize,searchTerm,
      auxInst).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron las areas del conocimiento'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroAreas(event:number){
    this.filtroSelectArea = event;
    this.filtrarDisciplinas(false,'');
    this.update1++;
    this.update2++;
  }

  filtrarDisciplinas(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(this.criterioBusqueda!="" ||
      this.filtroSelectArea>0 ||
      this.filtroSelectInstitucion>0)
    {
      let auxSelectInst:any=[];
      if(this.filtroSelectInstitucion>0){auxSelectInst=[this.filtroSelectInstitucion]}
      let auxSelectArea:any=[];
      if(this.filtroSelectArea>0){auxSelectArea=[this.filtroSelectArea]}
      this.loadingCount++
      this.disciplinasService.getDiciplinesByFilter(this.pageNumber,this.pageSize,this.criterioBusqueda,
        auxSelectInst,auxSelectArea).subscribe((resSchoolFilt: any) => {
        this.loadingCount--
        this.listaDisciplinas=resSchoolFilt.data;
        this.totalItems=resSchoolFilt.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los colegios'});
        console.error(err)
      });
    }else{
      this.obtenerTodasDisciplinas();
    }
  }

  abrirModalConsultar(objeto:any){
    this.disciplinaId=objeto.id;
    this.disciplinaNombre=objeto.nombre;
    this.disciplinaArea=objeto.id_area;
    this.disciplinaInstitucion=objeto.id_institucion;
  }

  abrirModalCrear(){
    this.disciplinaId=0;
    this.disciplinaNombre="";
    this.disciplinaArea=0;
    this.disciplinaInstitucion=0;
    this.listaAreas = this.listaAreasTotal.filter(item => item.id_institucion === null)
  }

  crear(){
    this.loadingCount++
    this.disciplinasService.addDiscipline(this.disciplinaNombre,this.disciplinaInstitucion).subscribe((resAct:any) => {
      this.loadingCount--
      if(this.disciplinaArea!=0){
        this.actualizar(resAct)
      }else{
        this.obtenerTodasDisciplinas();
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear la disciplina'});
      console.error(err)
    });
  }

  abrirModalActualizar(objeto:any){
    this.disciplinaId = objeto.id;
    this.disciplinaNombre = objeto.nombre;
    this.obligatorioInstitucion = false;
    if(objeto.id_institucion !== null ){
      this.disciplinaInstitucion = objeto.id_institucion;
      this.listaAreas = this.listaAreasTotal.filter(item => item.id_institucion === objeto.id_institucion)
      this.obligatorioInstitucion = true;
    }else{
      this.disciplinaInstitucion = 0;
      this.listaAreas = this.listaAreasTotal.filter(item => item.id_institucion === null)
    }
    if(objeto.id_area !== null ){
      this.disciplinaArea = objeto.id_area;
      this.obligatorioInstitucion = true;
    }else{
      this.disciplinaArea = 0;
    }
  }

  actualizar(idDisciplina?:number){
    if(idDisciplina){this.disciplinaId=idDisciplina;}
    this.loadingCount++
    this.disciplinasService.updateDiscipline(this.disciplinaId,this.disciplinaNombre,this.disciplinaArea,this.disciplinaInstitucion).subscribe(() => {
      this.loadingCount--
      this.obtenerTodasDisciplinas();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar la disciplina'});
      console.error(err)
    });
  }

  eliminar(objeto:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar la disciplina?',
      html: '<b>ID:</b> '+objeto.id+'<br><b>Nombre:</b> "'+objeto.nombre+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.disciplinasService.deleteDiscipline(objeto.id).subscribe(() => {
          this.obtenerTodasDisciplinas();
        })
      }
    });
  }

  filtrarAreas(){
    var idInstitucion:number = 0;
    if(this.disciplinaInstitucion==0){ idInstitucion=null; }else{ idInstitucion=this.disciplinaInstitucion; }
    this.listaAreas = this.listaAreasTotal.filter(item => item.id_institucion == idInstitucion)
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.filtroSelectInstitucion=0;
    this.filtroSelectArea=0;
    this.update1 = 0;
    this.update2 = 0;
    this.pageNumber=1;
    this.obtenerTodasDisciplinas();
  }

  cambiarPagina(event: any) {
    this.pageNumber=event;
    this.filtrarDisciplinas(true,'');
  }

}

