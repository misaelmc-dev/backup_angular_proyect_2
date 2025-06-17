import {Component,OnInit,AfterViewInit,ViewChild,ElementRef} from '@angular/core';
import Swal from "sweetalert2";
import {TypesProductService} from "../../../../services/types-product.service";
import {StudentsService} from "../../../../services/students.service";

@Component({
  selector: 'app-types-product',
  templateUrl: './types-product.component.html',
  styleUrls: ['./types-product.component.css']
})
export class TypesProductComponent implements OnInit  {

  listaTiposProducto:any[]=[];
  listaTiposProductoTotal:any[]=[];

  tipoProductoConsultado:any=[];

  tipoProductoId:number=0;
  tipoProductoTipo:string="";
  tipoProductoDescripcion:string="";
  tipoProductoOpenaire:string="";

  criterioBusqueda:string="";
  filtroSelectProducto:boolean=false;
  filtroSelectCita:boolean=false;

  pageNumber:number = 1;

  loadingCount: number = 0;

  update1:number = 1
  update2:number = 1

  constructor(public tipesProductService: TypesProductService,
              public studentsService: StudentsService,) { }

  ngOnInit(): void {
    this.obtenerTodosTiposProducto();
  }

  filtroDataLoad = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                     loadingItems: boolean[], totalItems: number[]) =>
  {
    this.studentsService.getAllStudents(currentPage,pageSize, searchTerm).subscribe((resAlum: any) => {
      for (let item of resAlum.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resAlum.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los alumnos'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltro(event:number){
    console.log("123",event);
  }

  cambiarFiltroProducto(event:boolean){
    this.filtroSelectProducto=event;
    this.update1++;
    this.filtrarListaColegios();
  }

  cambiarFiltroCita(event:boolean){
    this.filtroSelectCita=event;
    this.update2++;
    this.filtrarListaColegios();
  }

  obtenerTodosTiposProducto(){
    this.loadingCount++
    this.tipesProductService.getAllTypesProduct().subscribe((resTipProd: any) => {
      this.loadingCount--
      this.listaTiposProducto=resTipProd;
      this.listaTiposProductoTotal=resTipProd;
      this.pageNumber=1;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los tipos de producto del sistema'});
      console.error(err)
    });
  }

  consultar(objeto:any){
    this.loadingCount++
    this.tipesProductService.getTypeProductById(objeto.id).subscribe((resTipPro: any) => {
      this.loadingCount--
      this.tipoProductoConsultado=resTipPro;
      this.abrirModalVer();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo el tipo de producto'});
      console.error(err)
    });
  }

  abrirModalVer(){
    this.tipoProductoId=this.tipoProductoConsultado.id;
    this.tipoProductoTipo=this.tipoProductoConsultado.tipo;
    this.tipoProductoDescripcion=this.tipoProductoConsultado.descripcion;
    this.tipoProductoOpenaire=this.tipoProductoConsultado.id_openaire;
  }

  abrirModalCrear(){
    this.tipoProductoId=0;
    this.tipoProductoTipo="";
    this.tipoProductoDescripcion="";
    this.tipoProductoOpenaire="";
  }

  crear(){
    this.loadingCount++
    this.tipesProductService.addTypeProduct(this.tipoProductoTipo,this.tipoProductoDescripcion,this.tipoProductoOpenaire).subscribe((resSchoolAdd) => {
      this.loadingCount--
      this.obtenerTodosTiposProducto();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el tipo de producto'});
      console.error(err)
    });
  }

  abrirModalActualizar(objeto:any){
    this.loadingCount++
    this.tipesProductService.getTypeProductById(objeto.id).subscribe((resTipPro: any) => {
      this.loadingCount--
      this.tipoProductoConsultado=resTipPro;
      this.abrirModalVer();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo el tipo de producto'});
      console.error(err)
    });
  }

  actualizar(){
    this.loadingCount++
    this.tipesProductService.updateTypeProduct(this.tipoProductoId,this.tipoProductoTipo,this.tipoProductoDescripcion,this.tipoProductoOpenaire).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosTiposProducto();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el tipo de producto'});
      console.error(err)
    });
  }

  eliminar(objeto:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el tipo de producto?',
      html: ' "' + objeto.tipo + '"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.tipesProductService.deleteTypeProduct(objeto.id).subscribe(() => {
          this.obtenerTodosTiposProducto();
        })
      }
    });
  }

  filtrarListaColegios(){
    if(this.criterioBusqueda!="" ||
      this.filtroSelectProducto ||
      this.filtroSelectCita)
    {
      let cadena:string = "";
      if(this.criterioBusqueda!=''){ cadena+="search="+this.criterioBusqueda+"&"; }
      if(this.filtroSelectProducto){ cadena+="soloConProduct=&"; }
      if(this.filtroSelectCita){ cadena+="soloConCita=&"; }
      this.loadingCount++
      this.tipesProductService.getTypesProductByFilter(cadena).subscribe((resTipProdFilt: any) => {
        this.loadingCount--
        this.pageNumber=1;
        this.listaTiposProducto=resTipProdFilt;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los productos'});
        console.error(err)
      });
    }else{
      this.obtenerTodosTiposProducto();
    }
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.filtroSelectProducto=false;
    this.filtroSelectCita=false;
    this.tipoProductoId=0;
    this.tipoProductoTipo="";
    this.tipoProductoDescripcion="";
    this.tipoProductoOpenaire="";
    this.update1 = 0;
    this.update2 = 0;
    this.pageNumber=1;
    this.obtenerTodosTiposProducto()
  }

}
