
import {Component,OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";
import {InvestigatorsService} from "../../../../services/investigators.service";
import {SchoolsService} from "../../../../services/schools.service";
import {CampusService} from "../../../../services/campus.service";
import {ResearchCentersService} from "../../../../services/research-centers.service";

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit {

  listaColegios:any[]=[];
  listaColegiosTotal:any[]=[];
  listaInstituciones:any[]=[];
  listaInstitucionesTotal:any[]=[];
  listaCentrosTotal:any[]=[];
  listaCampusTotal:any[]=[];
  listaInvestigadoresTotal:any[]=[];

  colegioId:number=0;
  colegioNombre:string="";
  colegioDescripcion:string="";
  colegioInstitucion:number=0;

  obligatorioInstitucion:boolean=false;

  listaInstitucionesFiltro:any[]=[];
  listaCentrosFiltro:any[]=[];
  listaCampusFiltro:any[]=[];
  listaInvestigadoresFiltro:any[]=[];

  criterioBusqueda:string="";
  filtroSelectInstitucion:number=0;
  filtroSelectCampus:number=0;
  filtroSelectCentro:number=0;
  filtroSelectInvestigador:number=0;
  filtroSelectProducto:boolean=false;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1:number = 1
  update2:number = 1
  update3:number = 1
  update4:number = 1
  update5:number = 1

  constructor(public institucionService: InstitutionScintraService,
              public investigadorService: InvestigatorsService,
              public schoolsService: SchoolsService,
              public campusService: CampusService,
              public centersService: ResearchCentersService) { }

  ngOnInit(): void {
    this.obtenerTodosColegios()
    this.obtenerTodasInstituciones();
    this.obtenerTodosInvestigadores();
    this.obtenerTodosCentros();
    this.obtenerTodosCampus();
  }

  obtenerTodosColegios(){
    this.loadingCount++
    this.schoolsService.getAllSchools(this.pageNumber,this.pageSize).subscribe((resSchool: any) => {
      this.loadingCount--
      this.listaColegios=resSchool.data;
      this.listaColegiosTotal=resSchool.data;
      this.totalItems=resSchool.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los colegios del sistema'});
      console.error(err)
    });
  }

  obtenerTodasInstituciones(){
    this.loadingCount++
    this.institucionService.getInstitutionsWidthSchools().subscribe((resIns: any) => {
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

  obtenerTodosCampus(){
    this.loadingCount++
    this.campusService.getCampusWidthSchools().subscribe((resCampus: any) => {
      this.loadingCount--
      this.listaCampusTotal=resCampus;
      this.listaCampusFiltro=resCampus;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus del sistema'});
      console.error(err)
    });
  }

  obtenerTodosCentros(){
    this.loadingCount++
    this.centersService.getCentersWidthSchools().subscribe((resCent: any) => {
      this.loadingCount--
      this.listaCentrosTotal=resCent;
      this.listaCentrosFiltro=resCent;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los centros del sistema'});
      console.error(err)
    });
  }

  obtenerTodosInvestigadores(){
    this.loadingCount++
    this.investigadorService.getInvestigatorsWidthShools().subscribe((resInvest: any) => {
      this.loadingCount--
      this.listaInvestigadoresTotal=resInvest;
      this.listaInvestigadoresFiltro=resInvest;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los investigadores del sistema'});
      console.error(err)
    });
  }

  filtroDataLoadInstituciones = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxCampus:any = []; if(this.filtroSelectCampus!=0){ auxCampus = [this.filtroSelectCampus] }
    var auxCentro:any = []; if(this.filtroSelectCentro!=0){ auxCentro = [this.filtroSelectCentro] }
    var auxInvest:any = []; if(this.filtroSelectInvestigador!=0){ auxInvest = [this.filtroSelectInvestigador] }
    this.institucionService.getInstitutionsWidthSchoolsByFilter(currentPage,pageSize,searchTerm,
      auxCampus,auxCentro,auxInvest
    ).subscribe((resInst: any) => {
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
    this.filtrarColegios(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
  }

  filtroDataLoadCampus = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                     loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInst:any = []; if(this.filtroSelectInstitucion!=0){ auxInst = [this.filtroSelectInstitucion] }
    var auxCentro:any = []; if(this.filtroSelectCentro!=0){ auxCentro = [this.filtroSelectCentro] }
    var auxInvest:any = []; if(this.filtroSelectInvestigador!=0){ auxInvest = [this.filtroSelectInvestigador] }
    this.campusService.getCampusWidthSchoolsByFilter(currentPage,pageSize,searchTerm,
      auxInst,auxCentro,auxInvest
    ).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los campus del sistema'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroCampus(event:number){
    this.filtroSelectCampus = event;
    this.filtrarColegios(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
  }

  filtroDataLoadCentros = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                          loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInst:any = []; if(this.filtroSelectInstitucion!=0){ auxInst = [this.filtroSelectInstitucion] }
    var auxCampus:any = []; if(this.filtroSelectCampus!=0){ auxCampus = [this.filtroSelectCampus] }
    var auxInvest:any = []; if(this.filtroSelectInvestigador!=0){ auxInvest = [this.filtroSelectInvestigador] }
    this.centersService.getCentersWidthSchoolsByFilter(currentPage,pageSize,searchTerm,
      auxInst,auxCampus,auxInvest
    ).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los centros del sistema'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroCentros(event:number){
    this.filtroSelectCentro = event;
    this.filtrarColegios(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
  }

  filtroDataLoadInvestigadores = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                          loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInst:any = []; if(this.filtroSelectInstitucion!=0){ auxInst = [this.filtroSelectInstitucion] }
    var auxCampus:any = []; if(this.filtroSelectCampus!=0){ auxCampus = [this.filtroSelectCampus] }
    var auxCentro:any = []; if(this.filtroSelectCentro!=0){ auxCentro = [this.filtroSelectCentro] }
    this.investigadorService.getInvestigatorsWidthShoolsByFilter(currentPage,pageSize,searchTerm,
      auxInst,auxCampus,auxCentro
    ).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nomb_accident[0].nombre_accidente}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los investigadores del sistema'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroInvestigadores(event:number){
    this.filtroSelectInvestigador = event;
    this.filtrarColegios(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
  }

  cambiarFiltroProducto(event:boolean){
    this.filtroSelectProducto=event;
    this.update5++;
    this.filtrarColegios(false,'')
  }

  filtrarColegios(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(this.criterioBusqueda!="" ||
      this.filtroSelectProducto ||
      this.filtroSelectInstitucion>0 ||
      this.filtroSelectCampus>0 ||
      this.filtroSelectCentro>0 ||
      this.filtroSelectInvestigador>0 )
    {
      let auxSelectInst:any=[]; if(this.filtroSelectInstitucion>0){auxSelectInst=[this.filtroSelectInstitucion]}
      let auxSelectCampus:any=[]; if(this.filtroSelectCampus>0){auxSelectCampus=[this.filtroSelectCampus]}
      let auxSelectCantro:any=[]; if(this.filtroSelectCentro>0){auxSelectCantro=[this.filtroSelectCentro]}
      let auxSelectInvest:any=[]; if(this.filtroSelectInvestigador>0){auxSelectInvest=[this.filtroSelectInvestigador]}
      this.loadingCount++
      this.schoolsService.getSchoolsByFilter(this.pageNumber,this.pageSize,this.criterioBusqueda,
        auxSelectInst,auxSelectCampus,auxSelectCantro,auxSelectInvest,this.filtroSelectProducto).subscribe((resSchoolFilt: any) => {
        this.loadingCount--
        this.listaColegios=resSchoolFilt.data;
        this.totalItems=resSchoolFilt.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los colegios'});
        console.error(err)
      });
    }else{
      this.obtenerTodosColegios();
    }
  }

  consultar(objeto:any){
    this.colegioId=objeto.id;
    this.colegioNombre=objeto.nombre;
    this.colegioDescripcion=objeto.descripcion;
    this.colegioInstitucion=objeto.id_institucion;
  }

  abrirModalCrear(){
    this.colegioId=0;
    this.colegioNombre="";
    this.colegioDescripcion="";
    this.colegioInstitucion=0;
    this.obligatorioInstitucion=false;
  }

  crear(){
    this.loadingCount++
    this.schoolsService.addSchool(this.colegioNombre,this.colegioInstitucion).subscribe((resSchoolAdd) => {
      this.loadingCount--
      if(this.colegioDescripcion!=""){
        this.actualizar(resSchoolAdd);
      }
      this.obtenerTodosColegios();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el colegio'});
      console.error(err)
    });
  }

  abrirModalActualizar(objeto:any){
    this.colegioId=objeto.id;
    this.colegioNombre=objeto.nombre;
    this.colegioDescripcion=objeto.descripcion;
    this.colegioInstitucion=objeto.id_institucion;
    this.obligatorioInstitucion=true;
  }

  actualizar(idColegio?:any){
    if(idColegio){ this.colegioId=idColegio; }
    this.loadingCount++
    this.schoolsService.updateSchool(this.colegioId,this.colegioNombre,this.colegioDescripcion).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosColegios();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el colegio'});
      console.error(err)
    });
  }

  eliminar(objeto:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el colegio?',
      html: '<b>ID:</b> '+objeto.id+'<br><b>Nombre:</b> "'+objeto.nombre+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.schoolsService.deleteSchool(objeto.id).subscribe(() => {
          this.obtenerTodosColegios();
        })
      }
    });
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.filtroSelectProducto=false;
    this.filtroSelectInstitucion=0;
    this.filtroSelectCentro=0;
    this.filtroSelectCampus=0;
    this.filtroSelectInvestigador=0;
    this.update1=0;
    this.update2=0;
    this.update3=0;
    this.update4=0;
    this.update5=0;
    this.pageNumber=1;
    this.obtenerTodosColegios();
  }

  cambiarPagina(event: any) {
    this.pageNumber = event;
    this.filtrarColegios(true,'');
  }

}

