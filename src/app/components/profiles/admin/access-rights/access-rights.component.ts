import {Component,OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {AccessRightsService} from "../../../../services/access-rights.service";

@Component({
  selector: 'app-access-rights',
  templateUrl: './access-rights.component.html',
  styleUrls: ['./access-rights.component.css']
})
export class AccessRightsComponent implements OnInit {

  listaAccess:any[]=[];
  listaAccessTotal:any[]=[];

  accessId:number=0;
  accessTerm:string="";
  accessCode:string="";

  infoAccessConsultada:any[]=[];

  criterioBusqueda:string="";

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  constructor(public accessRightService: AccessRightsService) { }

  ngOnInit(): void {
    this.obtenerTodosAccess();
  }

  obtenerTodosAccess(){
    this.loadingCount++
    this.accessRightService.getAllAccess().subscribe((resAcc: any) => {
      this.loadingCount--
      this.listaAccess=resAcc;
      this.listaAccessTotal=resAcc;
      this.totalItems=resAcc.length;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los access right'});
      console.error(err)
    });
  }

  filtrarAccess(){
    this.pageNumber=1;
    if(this.criterioBusqueda!=''){
      this.loadingCount++
      this.accessRightService.getAccessByFilters(this.criterioBusqueda).subscribe((resAccFilt: any) => {
        this.loadingCount--
        this.listaAccess=resAccFilt;
        this.totalItems=resAccFilt.length;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los access right'});
        console.error(err)
      });
    }else{
      this.obtenerTodosAccess()
    }
  }

  verInfoAccess(idAccess:number){
    this.accessId=0;
    this.accessTerm="";
    this.accessCode="";
    this.loadingCount++
    this.accessRightService.getAccessById(idAccess).subscribe((resAccCon: any) => {
      this.loadingCount--
      this.infoAccessConsultada=resAccCon;
      //console.log("this.infoLineaConsultada",this.infoLineaConsultada);
      this.abrirModalVer();
      //console.log("resLineCon",resLineCon);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron el access right'});
      console.error(err)
    });
  }

  abrirModalVer(){
    this.accessId=this.infoAccessConsultada[0].id;
    this.accessTerm=this.infoAccessConsultada[0].right_term;
    this.accessCode=this.infoAccessConsultada[0].right_code;
  }

  abrirModalCrear(){
    this.accessId=0;
    this.accessTerm="";
    this.accessCode="";
  }

  crearAccess(){
    this.loadingCount++
    this.accessRightService.addAccess(this.accessTerm,this.accessCode).subscribe(() => {
      this.loadingCount--
      //console.log("resLine",resLine);
      this.pageNumber=1;
      this.obtenerTodosAccess();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el access right'});
      console.error(err)
    });
  }

  abrirModalActualizar(la:any){
    this.accessId=la.id;
    this.accessTerm=la.right_term;
    this.accessCode=la.right_code;
  }

  actualizarAccess(){
    this.loadingCount++
    this.accessRightService.updateAccess(this.accessId,this.accessTerm,this.accessCode).subscribe(() => {
      this.loadingCount--
      this.pageNumber=1;
      this.obtenerTodosAccess();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el access right'});
      console.error(err)
    });
  }

  eliminarAccess(ll:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el access right?',
      html: '<b>ID:</b> '+ll.id+'<br><b>Right term:</b> "'+ll.right_term+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.accessRightService.deleteAccess(ll.id).subscribe(() => {
          this.pageNumber=1;
          this.obtenerTodosAccess();
        })
      }
    });
  }

  cambiarPagina(valor:number){
    this.pageNumber=valor;
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.pageNumber=1;
    this.obtenerTodosAccess()
  }

}
