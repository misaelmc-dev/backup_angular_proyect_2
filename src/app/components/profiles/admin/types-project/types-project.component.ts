import {Component,OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {TypesProjectService} from "../../../../services/types-project.service";

@Component({
  selector: 'app-types-project',
  templateUrl: './types-project.component.html',
  styleUrls: ['./types-project.component.css']
})
export class TypesProjectComponent implements OnInit {

  listaTiposProyecto:any[]=[];
  listaTiposProyectoTotal:any[]=[];

  tipoProyectoConsultado:any=[];

  tipoProyectoId:number=0;
  tipoProyectoTipo:string="";

  criterioBusqueda:string="";
  filtroSelectProyecto:boolean=false;

  pageNumber:number = 1;

  loadingCount: number = 0;

  update1:number = 1

  constructor(public typesProjectService: TypesProjectService) { }

  ngOnInit(): void {
    this.obtenerTodosTiposProyecto();
  }

  obtenerTodosTiposProyecto(){
    this.loadingCount++
    this.typesProjectService.getAllTypesProject().subscribe((resTipProd: any) => {
      this.loadingCount--
      this.listaTiposProyecto=resTipProd;
      this.listaTiposProyectoTotal=resTipProd;
      this.pageNumber = 1;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de Proyecto del sistema'});
      console.error(err)
    });
  }

  consultar(objeto:any){
    this.loadingCount++
    this.typesProjectService.getTypeProjectById(objeto.id).subscribe((resTipPro: any) => {
      this.loadingCount--
      this.tipoProyectoConsultado=resTipPro;
      this.abrirModalVer();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo el tipo de Proyecto'});
      console.error(err)
    });
  }

  abrirModalVer(){
    this.tipoProyectoId=this.tipoProyectoConsultado.id;
    this.tipoProyectoTipo=this.tipoProyectoConsultado.tipo;
  }

  abrirModalCrear(){
    this.tipoProyectoId=0;
    this.tipoProyectoTipo="";
  }

  crear(){
    this.loadingCount++
    this.typesProjectService.addTypeProject(this.tipoProyectoTipo).subscribe((resSchoolAdd) => {
      this.loadingCount--
      this.obtenerTodosTiposProyecto();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el tipo de proyecto'});
      console.error(err)
    });
  }

  abrirModalActualizar(objeto:any){
    this.loadingCount++
    this.typesProjectService.getTypeProjectById(objeto.id).subscribe((resTipPro: any) => {
      this.loadingCount--
      this.tipoProyectoConsultado=resTipPro;
      this.abrirModalVer();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo el tipo de proyecto'});
      console.error(err)
    });
  }

  actualizar(){
    this.loadingCount++
    this.typesProjectService.updateTypeProject(this.tipoProyectoId,this.tipoProyectoTipo).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosTiposProyecto();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el tipo de proyecto'});
      console.error(err)
    });
  }

  eliminar(objeto:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el tipo de proyecto?',
      html: ' "' + objeto.tipo + '"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.typesProjectService.deleteTypeProject(objeto.id).subscribe(() => {
          this.obtenerTodosTiposProyecto();
        })
      }
    });
  }

  cambiarFiltroProducto(event:boolean){
    this.filtroSelectProyecto=event;
    this.update1++;
    this.filtrarProjectos();
  }

  filtrarProjectos(){
    if(this.criterioBusqueda!="" || this.filtroSelectProyecto) {
      let cadena:string = "";
      if(this.criterioBusqueda!=''){ cadena+="search="+this.criterioBusqueda+"&"; }
      if(this.filtroSelectProyecto){ cadena+="soloConProyectInvest="; }
      this.loadingCount++
      this.typesProjectService.getTypesProjectByFilter(cadena).subscribe((resTipProdFilt: any) => {
        this.loadingCount--
        this.pageNumber=1;
        this.listaTiposProyecto=resTipProdFilt;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los proyectos'});
        console.error(err)
      });
    }else{
      this.obtenerTodosTiposProyecto();
    }
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.filtroSelectProyecto=false;
    this.tipoProyectoId=0;
    this.tipoProyectoTipo="";
    this.update1 = 0;
    this.pageNumber=1;
    this.obtenerTodosTiposProyecto();
  }

}

