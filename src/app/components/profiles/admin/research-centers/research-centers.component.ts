import {Component,OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";
import {ColegiosService} from "../../../../services/colegios.service";
import {ResearchCentersService} from "../../../../services/research-centers.service";
import {SchoolsService} from "../../../../services/schools.service";

@Component({
  selector: 'app-research-centers',
  templateUrl: './research-centers.component.html',
  styleUrls: ['./research-centers.component.css']
})
export class ResearchCentersComponent implements OnInit {

  listaCentros:any[]=[];
  listaCentrosFiltro:any[]=[];
  listaCentrosTotal:any[]=[];
  listaInstituciones:any[]=[];
  listaInstitucionesFiltro:any[]=[];
  listaInstitucionesTotal:any[]=[];
  centroColegios:any=[];
  listaColegiosFiltro:any=[];
  listaColegios:any=[];
  listaColegiosTotal:any=[];

  centroId:number=0;
  centroNombre:string="";
  centroMision:string="";
  centroWebsite:string="";
  centroInstitucion:number=0;

  selectColegio:number=0;

  validUrl:number=0

  criterioBusqueda:string="";
  filtroSelectInstitucion:number=0;
  filtroSelectColegio:number=0;
  filtroSelectProy:boolean=false;
  filtroSelectProd:boolean=false;

  obligatorioInstitucion:boolean=false;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount:number=0;

  update1:number = 1
  update2:number = 1
  update3:number = 1
  update4:number = 1

  constructor(public institutionService: InstitutionScintraService,
              public colegiosService: SchoolsService,
              public centrosService: ResearchCentersService) { }

  ngOnInit(): void {
    this.obtenerTodosCentros();
    this.obtenerTodasInstituciones();
    this.ObtenerTodosColegios();
  }

  obtenerTodosCentros(){
    this.loadingCount++
    this.centrosService.getAllCenters(this.pageNumber,this.pageSize).subscribe((resCent: any) => {
      this.loadingCount--
      this.listaCentros=resCent.data;
      this.listaCentrosFiltro=resCent.data;
      this.listaCentrosTotal=resCent.data;
      this.totalItems=resCent.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los centros'});
      console.error(err)
    });
  }

  obtenerTodasInstituciones(){
    this.loadingCount++
    this.institutionService.getInstitutionsWidthCenters().subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstituciones=resIns;
      this.listaInstitucionesFiltro=resIns;
      this.listaInstitucionesTotal=resIns;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones del sistema'});
      console.error(err)
    });
  }

  ObtenerTodosColegios(){
    this.loadingCount++
    this.colegiosService.getSchoolsWidthCenters().subscribe((resShool) => {
      this.loadingCount--
      this.listaColegiosFiltro=resShool;
      this.listaColegiosTotal=resShool;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los colegios'});
      console.error(err)
    });
  }

  obtenerColegiosPorCentros(idCentros:number,idInstitucion:number){
    this.centroColegios = [];
    this.listaColegios = this.listaColegiosTotal.filter((item:any) => item.id_institucion == idInstitucion)
    this.loadingCount++
    this.centrosService.getColegiosByCentros(idCentros).subscribe((resColCamp) => {
      this.loadingCount--
      this.centroColegios = resColCamp;
      for(let cc of this.centroColegios){
        cc.accion = "ingresado";
        this.listaColegios = this.listaColegios.filter((item:any) => item.id != cc.id)
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los colegios del Centros'});
      console.error(err)
    });
  }

  filtroDataLoadInstituciones = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxColegio:any = []; if(this.filtroSelectColegio!=0){ auxColegio = [this.filtroSelectColegio] }
    this.institutionService.getInstitutionsWidthCentersByShools(currentPage,pageSize,searchTerm,
      auxColegio).subscribe((resInst: any) => {
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
    this.filtrarCentros(false,'');
    this.update2++;
    this.update1++;
  }

  filtroDataLoadColegios = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                     loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInst:any = []; if(this.filtroSelectInstitucion!=0){ auxInst = [this.filtroSelectInstitucion] }
    this.colegiosService.getSchoolsWidthCentersByInst(currentPage,pageSize,searchTerm,
      auxInst).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los colegios'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroColegios(event:number){
    this.filtroSelectColegio = event;
    this.filtrarCentros(false,'');
    this.update2++;
    this.update1++;
  }

  cambiarFiltroProyectos(event:boolean){
    this.filtroSelectProy=event;
    this.update3++;
    this.filtrarCentros(false,'')
  }

  cambiarFiltroProductos(event:boolean){
    this.filtroSelectProd=event;
    this.update4++;
    this.filtrarCentros(false,'')
  }


  filtrarCentros(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(this.criterioBusqueda!="" ||
      this.filtroSelectInstitucion!=0 ||
      this.filtroSelectColegio!=0 ||
      this.filtroSelectProd ||
      this.filtroSelectProy)
    {
      let auxSelectInstitucion:any=[];
      let auxSelectColegio:any=[];
      if(this.filtroSelectInstitucion>0){auxSelectInstitucion=[this.filtroSelectInstitucion]}
      if(this.filtroSelectColegio>0){auxSelectColegio=[this.filtroSelectColegio]}
      this.loadingCount++
      this.centrosService.getCentersByFilter(this.pageNumber,this.pageSize,this.criterioBusqueda,
        auxSelectInstitucion,auxSelectColegio,this.filtroSelectProy,this.filtroSelectProd).subscribe((resCentFilt: any) => {
        this.loadingCount--
        this.listaCentros=resCentFilt.data;
        this.totalItems=resCentFilt.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los alumnos'});
        console.error(err)
      });
    }else{
      this.obtenerTodosCentros();
    }
  }

  verInfoCentro(centro:any){
    this.centroId=centro.id;
    this.centroNombre=centro.nombre;
    this.centroMision=centro.mision;
    this.centroWebsite=centro.website;
    this.centroInstitucion=centro.id_institucion;
    this.obtenerColegiosPorCentros(centro.id,centro.id_institucion);
  }

  abrirModalCrear(){
    this.centroId=0;
    this.centroNombre="";
    this.centroMision="";
    this.centroWebsite="";
    this.centroInstitucion=0;
    this.obligatorioInstitucion=false;
    this.listaColegios=this.listaColegiosTotal;
    this.centroColegios=[];
    this.validUrl = 0;
  }

  crearCentros(){
    this.loadingCount++
    this.centrosService.addCentros(this.centroNombre,this.centroInstitucion).subscribe((resCampCre) => {
      this.loadingCount--
      if(this.centroMision!="" || this.centroWebsite!="" ){
        this.actualizarCentros(resCampCre);
      }
      for(let cc of this.centroColegios){
        if(cc.accion=="agregar"){ this.asociarColegio(this.centroId,cc.id); }
      }
      this.obtenerTodosCentros();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el centro de investigación'});
      console.error(err)
    });
  }

  abrirModalActualizar(ll:any){
    this.centroId = ll.id;
    this.centroNombre = ll.nombre;
    this.centroMision=ll.mision;
    this.centroWebsite=ll.website;
    this.centroInstitucion = ll.id_institucion;
    this.obligatorioInstitucion = true;
    this.obtenerColegiosPorCentros(ll.id,ll.id_institucion);
    this.validUrl = 0;
  }

  actualizarCentros(idCentro?:any){
    if(idCentro){ this.centroId=idCentro; }
    if(this.centroMision===null){ this.centroMision=""; }
    if(this.centroWebsite===null){ this.centroWebsite=""; }
    this.loadingCount++
    this.centrosService.updateCentros(this.centroId,this.centroNombre,this.centroMision,this.centroWebsite).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosCentros();
      for(let cc of this.centroColegios){
        if(cc.accion=="agregar"){
          this.asociarColegio(this.centroId,cc.id);
        }else if(cc.accion=="eliminar"){
          this.desasociarColegio(this.centroId,cc.id);
        }
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el centro de investigación'});
      console.error(err)
    });
  }

  asociarColegio(idCentros:number,idColegio:number){
    this.loadingCount++
    this.centrosService.addColegioToCampús(idCentros,idColegio).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo asociar el colegio a el centro de investigación'});
      console.error(err)
    });
  }

  desasociarColegio(idCentros:number,idColegio:number){
    this.loadingCount++
    this.centrosService.removeColegioToCampús(idCentros,idColegio).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo eliminar el colegio a el centro de investigación'});
      console.error(err)
    });
  }

  eliminarCentros(objeto:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el centro de investigación?',
      html: '<b>ID:</b> '+objeto.id+'<br><b>Nombre:</b> "'+objeto.nombre+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.centrosService.deleteCentros(objeto.id).subscribe(() => {
          this.obtenerTodosCentros();
        })
      }
    });
  }

  filtrarColegios(){
    if(this.centroInstitucion!=0){
      this.listaColegios = this.listaColegiosTotal.filter((item:any) => item.id_institucion == this.centroInstitucion)
      this.centroColegios = [];
    }
  }

  validarUrl() {
    if(this.centroWebsite!=""){
      if (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(this.centroWebsite)) {
        this.validUrl=0;
      }else{ this.validUrl=1; }
    }else{ this.validUrl=0; }
  }

  agregarColegio(){
    if(this.selectColegio!=0){
      for(let cl of this.listaColegios){
        if(cl.id==this.selectColegio){
          let auxColegio = cl;
          auxColegio.accion = "agregar";
          this.centroColegios.push(auxColegio)
        }
      }
      this.listaColegios = this.listaColegios.filter((item:any) => item.id != this.selectColegio)
      this.selectColegio=0;
    }
  }

  removerColegio(colegio:any){
    for(let cl of this.listaColegiosTotal){
      if(cl.id==colegio.id){
        this.listaColegios.push(cl)
      }
    }
    if(colegio.accion=="agregar"){
      this.centroColegios = this.centroColegios.filter((item:any) => item.id != colegio.id)
    }else if(colegio.accion=="ingresado"){
      for(let cl of this.centroColegios){
        if(cl.id==colegio.id){
          cl.accion = "eliminar";
        }
      }
    }

    this.listaColegios = this.listaColegios.filter((item:any) => item.id != this.selectColegio)
    this.selectColegio=0;
    for(let cl of this.listaColegios){
      if(cl.id==this.selectColegio){
        let auxColegio = cl;
        auxColegio.accion = "agregar";
        this.centroColegios.push(auxColegio)
      }
    }
  }

  limpiarFiltros(){
    this.criterioBusqueda = "";
    this.filtroSelectInstitucion = 0;
    this.filtroSelectColegio = 0;
    this.filtroSelectProd=false;
    this.filtroSelectProy=false;
    this.update1 = 0;
    this.update2 = 0;
    this.update3 = 0;
    this.update4 = 0;
    this.pageNumber = 1;
    this.validUrl = 0;
    this.obtenerTodosCentros()
  }

  cambiarPagina(event: any) {
    this.pageNumber = event;
    this.filtrarCentros(true,'');
  }

}

