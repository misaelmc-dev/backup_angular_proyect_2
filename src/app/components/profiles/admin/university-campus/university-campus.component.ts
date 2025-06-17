import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";
import {CampusService} from "../../../../services/campus.service";
import {SchoolsService} from "../../../../services/schools.service";

@Component({
  selector: 'app-university-campus',
  templateUrl: './university-campus.component.html',
  styleUrls: ['./university-campus.component.css']
})
export class UniversityCampusComponent implements OnInit {

  listaCampus:any[]=[];
  listaCampusTotal:any[]=[];
  listaInstituciones:any[]=[];
  listaInstitucionesTotal:any[]=[];

  campusId:number=0;
  campusNombre:string="";
  campusDireccion:string="";
  campusCorreo:string="";
  campusTelefono:any="";
  campusInstitucion:number=0;

  campusColegios:any=[];
  campusColegiosLista:any=[];
  campusColegiosTotal:any=[];

  selectColegio:number=0;
  filtroSelectInstitucion:number=0;
  criterioBusqueda:string="";

  obligatorioInstitucion:boolean=false;

  validCorreo:number=0;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1:number = 1

  constructor(public institutionService: InstitutionScintraService,
              public campusService: CampusService,
              public colegiosService: SchoolsService) { }

  ngOnInit(): void {
    this.obtenerTodosCampus();
    this.obtenerTodasInstituciones();
    this.ObtenerTodosColegios();
  }

  obtenerTodosCampus(){
    this.loadingCount++
    this.campusService.getAllCampus(this.pageNumber,this.pageSize).subscribe((resCamp: any) => {
      this.loadingCount--
      this.listaCampus=resCamp.data;
      this.listaCampusTotal=resCamp.data;
      this.totalItems=resCamp.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus'});
      console.error(err)
    });
  }

  obtenerTodasInstituciones(){
    this.loadingCount++
    this.institutionService.getInstitutionsWidthCampusList().subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstituciones=resIns;
      this.listaInstitucionesTotal=resIns;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones del sistema'});
      console.error(err)
    });
  }

  ObtenerTodosColegios(){
    this.loadingCount++
    this.colegiosService.getSchoolsList().subscribe((resCol) => {
      this.loadingCount--
      this.campusColegiosTotal=resCol;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los colegios'});
      console.error(err)
    });
  }

  filtroDataLoadInstituciones = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    this.institutionService.getInstitutionsWidthCampus(currentPage,pageSize,searchTerm).subscribe((resInst: any) => {
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
    this.filtrarCampus(false,'');
    this.update1++;
  }

  filtrarCampus(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(this.criterioBusqueda!="" || this.filtroSelectInstitucion!=0){
      let auxSelectInstitucion:any=[];
      if(this.filtroSelectInstitucion!=0){auxSelectInstitucion=[this.filtroSelectInstitucion]}
      this.loadingCount++
      this.campusService.getCampusByFilter(this.pageNumber,this.pageSize,this.criterioBusqueda,
        auxSelectInstitucion).subscribe((resCampFilt: any) => {
        this.loadingCount--
        this.listaCampus=resCampFilt.data;
        this.totalItems=resCampFilt.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las áreas de conocimiento'});
        console.error(err)
      });
    }else{
      this.obtenerTodosCampus();
    }
  }

  obtenerColegiosPorCampus(idCampus:number,idInstitucion:number){
    this.campusColegios = [];
    this.campusColegiosLista = this.campusColegiosTotal.filter((item:any) => item.id_institucion == idInstitucion)
    this.loadingCount++
    this.colegiosService.getSchoolsByCampus([idCampus]).subscribe((resColCamp) => {
      this.loadingCount--
      this.campusColegios=resColCamp;
      for(let cc of this.campusColegios){
        cc.accion="ingresado";
        this.campusColegiosLista = this.campusColegiosLista.filter((item:any) => item.id != cc.id)
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los colegios del campus'});
      console.error(err)
    });
  }

  filtrarColegios(){
    if(this.campusInstitucion!=0){
      this.campusColegiosLista = this.campusColegiosTotal.filter((item:any) => item.id_institucion == this.campusInstitucion)
      this.campusColegios = [];
    }
  }

  verInfoCampus(campus:any){
    this.campusId=campus.id;
    this.campusNombre=campus.nombre;
    this.campusDireccion=campus.direccion;
    this.campusCorreo=campus.correo;
    this.campusTelefono=campus.phone;
    this.campusInstitucion=campus.id_institucion;
    this.obtenerColegiosPorCampus(campus.id,campus.id_institucion);
  }

  abrirModalCrear(){
    this.campusId=0;
    this.campusNombre="";
    this.campusDireccion="";
    this.campusCorreo="";
    this.campusTelefono="";
    this.campusInstitucion=0;
    this.obligatorioInstitucion=false;
    this.validCorreo=0;
    this.campusColegiosLista=this.campusColegiosTotal;
    this.campusColegios=[];
  }

  crearCampus(){
    this.loadingCount++
    this.campusService.addCampus(this.campusNombre,this.campusDireccion,this.campusCorreo,this.campusInstitucion).subscribe((resCampCre) => {
      this.loadingCount--
      if(this.campusTelefono!=""){
        this.actualizarCampus(resCampCre);
      }
      for(let cc of this.campusColegios){
        if(cc.accion=="agregar"){
           this.asociarColegio(this.campusId,cc.id);
        }
      }
      this.obtenerTodosCampus();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el campus'});
      console.error(err)
    });
  }

  abrirModalActualizar(ll:any){
    //console.log("ll",ll);
    this.campusId = ll.id;
    this.campusNombre = ll.nombre;
    this.campusDireccion = ll.direccion;
    this.campusCorreo = ll.correo;
    this.campusTelefono = ll.phone;
    this.campusInstitucion = ll.id_institucion;
    this.obligatorioInstitucion = true;
    this.validCorreo = 0;
    this.obtenerColegiosPorCampus(ll.id,ll.id_institucion);
  }

  actualizarCampus(idCampus?:any){
    if(idCampus){ this.campusId=idCampus; }
    if(this.campusTelefono===null){ this.campusTelefono=""; }
    this.loadingCount++
    this.campusService.updateCampus(
      this.campusId,this.campusNombre,this.campusDireccion,this.campusCorreo,this.campusTelefono
    ).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosCampus();
      //console.log("this.campusColegios",this.campusColegios);
      for(let cc of this.campusColegios){
        if(cc.accion=="agregar"){
           this.asociarColegio(this.campusId,cc.id);
        }else if(cc.accion=="eliminar"){
           this.desasociarColegio(this.campusId,cc.id);
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el campus'});
      console.error(err)
    });
  }

  asociarColegio(idCampus:number,idColegio:number){
    this.loadingCount++
    this.campusService.addColegioToCampús(idCampus,idColegio).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo asociar el colegio del campus'});
      console.error(err)
    });
  }

  desasociarColegio(idCampus:number,idColegio:number){
    this.loadingCount++
    this.campusService.removeColegioToCampús(idCampus,idColegio).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo eliminar el colegio del campus'});
      console.error(err)
    });
  }

  eliminarCampus(c:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el campus?',
      html: '<b>ID:</b> '+c.id+'<br><b>Nombre:</b> "'+c.nombre+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.campusService.deleteCampus(c.id).subscribe(() => {
          this.obtenerTodosCampus();
        })
      }
    });
  }

  agregarColegio(){
    if(this.selectColegio!=0){
      for(let cl of this.campusColegiosLista){
        if(cl.id==this.selectColegio){
          let auxColegio = cl;
          auxColegio.accion = "agregar";
          this.campusColegios.push(auxColegio)
        }
      }
      this.campusColegiosLista = this.campusColegiosLista.filter((item:any) => item.id != this.selectColegio)
      this.selectColegio=0;
    }
  }

  removerColegio(colegio:any){
    for(let cl of this.campusColegiosTotal){
      if(cl.id==colegio.id){
        this.campusColegiosLista.push(cl)
      }
    }
    if(colegio.accion=="agregar"){
      this.campusColegios = this.campusColegios.filter((item:any) => item.id != colegio.id)
    }else if(colegio.accion=="ingresado"){
      for(let cl of this.campusColegios){
        if(cl.id==colegio.id){
          cl.accion = "eliminar";
        }
      }
    }

    this.campusColegiosLista = this.campusColegiosLista.filter((item:any) => item.id != this.selectColegio)
    this.selectColegio=0;
    for(let cl of this.campusColegiosLista){
      if(cl.id==this.selectColegio){
        let auxColegio = cl;
        auxColegio.accion = "agregar";
        this.campusColegios.push(auxColegio)
      }
    }
  }

  validarCorreo() {
    if (/[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[a-zA-Z0-9]$/.test(this.campusCorreo)) {
      this.validCorreo = 0;
    }else if(this.campusCorreo==""){
      this.validCorreo = 1;
    }else{
      this.validCorreo = 2;
    }
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.filtroSelectInstitucion=0;
    this.update1 = 0;
    this.pageNumber=1;
    this.listaCampus=this.listaCampusTotal;
  }

  cambiarPagina(event: any) {
    this.pageNumber = event;
    this.filtrarCampus(true,'');
  }

}
