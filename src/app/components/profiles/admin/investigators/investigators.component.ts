import {Component, OnInit, SecurityContext} from '@angular/core';
import Swal from "sweetalert2";
import {DomSanitizer} from "@angular/platform-browser";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";
import {InstitutionRorService} from "../../../../services/institution-ror.service";
import {InvestigatorsService} from "../../../../services/investigators.service";
import {CampusService} from "../../../../services/campus.service";
import {SchoolsService} from "../../../../services/schools.service";
import {ResearchCentersService} from "../../../../services/research-centers.service";
import {CountriesService} from "../../../../services/countries.service";
import * as moment from "moment";

@Component({
  selector: 'app-investigators',
  templateUrl: './investigators.component.html',
  styleUrls: ['./investigators.component.css']
})
export class InvestigatorsComponent implements OnInit {

  listaInvestigadores:any[]=[];
  listaInvestigadoresTotal:any[]=[];
  listaPaises:any[]=[];
  listaPaisesFilter:any[]=[];
  listaPaisesTotal:any[]=[];
  listaInstitucionesSc:any[]=[];
  listaInstitucionesScFilter:any[]=[];
  listaInstitucionesScTotal:any[]=[];
  listaInstitucionesRor:any[]=[];
  listaInstitucionesRorForm:any[]=[];
  listaCampus:any[]=[];
  listaCampusFilter:any[]=[];
  listaCampusTotal:any[]=[];
  listaColegios:any[]=[];
  listaColegiosTotal:any[]=[];
  listaCentros:any[]=[];
  listaCentrosTotal:any[]=[];

  criterioBusqueda:string="";
  criterioBusquedaRor:string="";

  filtroSearch:string="";
  filtroSelectInstitucionSc:number=0;
  filtroSelectInstitucionRor:number=0;
  nombreInstitutionRor:string="";
  filtroSelectPaises:number=0;
  filtroSelectCampus:number=0;
  filtroSelectColegios:number=0;
  filtroSelectCentros:number=0;
  filtroSelectSoloConProd:boolean=false;
  filtroSelectSoloConCita:boolean=false;

  investId:number=0;
  investNombAccident:any[]=[];
  investCorreo:string="";
  investIdPais:number=0;
  investIdInstitucion:number=0;
  investOrcid:string="";
  investCargo:string="";
  investUrlFoto:string="";
  investScopusIds:any[]=[];

  nombAccident:string="";
  idScopus:any="";

  archivoVacio:any;
  investImagenRuta:any="";
  investImagen:any=[];
  investImagenName:string="";
  salvarImagen:boolean=false;

  tipoModal:string=""
  guardarTodo:number=0;

  validCorreo:number=0;
  validOrcid:number=0;
  validScopus:number=0;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1:number = 1
  update2:number = 1
  update3:number = 1
  update4:number = 1
  update5:number = 1
  update6:number = 1
  update7:number = 1
  update8:number = 1

  guardadoCampus:boolean=false;
  guardadoCentros:boolean=false;
  guardadoColegios:boolean=false;
  guardadoLineas:boolean=false;

  constructor(public investigatorService:InvestigatorsService,
              public institutionScintraService: InstitutionScintraService,
              public institutionRorService: InstitutionRorService,
              public campusService:CampusService,
              public colegiosService:SchoolsService,
              public centrosService:ResearchCentersService,
              public paisesService:CountriesService,
              private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.obtenerTodosInvestigadores();
    this.obtenerTodasInstituciones();
    this.obtenerTodosPaises();
    this.obtenerTodosCampus();
    this.obtenerTodosColegios();
    this.obtenerTodosCentros();
  }

  obtenerTodosInvestigadores(){
    this.loadingCount++
    this.investigatorService.getAllInvestigators(this.pageNumber,this.pageSize).subscribe((resInvest: any) => {
      this.loadingCount--
      this.listaInvestigadores=resInvest.data;
      this.listaInvestigadoresTotal=resInvest.data;
      this.totalItems=resInvest.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los investigadores'});
      console.error(err)
    });
  }

  obtenerTodasInstituciones(){
    this.loadingCount++
    this.institutionScintraService.getAllInstitutionsSc().subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstitucionesSc=resIns;
      this.listaInstitucionesScTotal=resIns;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones Scintra del sistema'});
      console.error(err)
    });
    this.loadingCount++
    this.institutionScintraService.getInstitutionsScWidthInvest().subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstitucionesScFilter=resIns;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones Scintra del sistema'});
      console.error(err)
    });
  }

  obtenerTodasInstitucionesRor(){
    if(this.criterioBusquedaRor!="") {
      this.loadingCount++
      this.institutionRorService.getInstitutionsBySearch(this.criterioBusquedaRor).subscribe((resIns: any) => {
        this.loadingCount--
        this.listaInstitucionesRor = resIns;
        //console.log("listaInstitucionesRor",resIns);
      }, (err: any) => {
        this.loadingCount--
        Swal.fire({icon: 'error', text: 'No se cargaron las instituciones ROR del sistema'});
        console.error(err)
      });
    }
  }

  obtenerInstitucionRor(idRor:number){
    this.loadingCount++
    this.institutionRorService.getInstitutionsRorByIdRor(idRor).subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstitucionesRorForm = resIns;
      //console.log("listaInstitucionesRor",resIns);
    }, (err: any) => {
      this.loadingCount--
      Swal.fire({icon: 'error', text: 'No se cargaron las instituciones ROR del sistema'});
      console.error(err)
    });
  }

  obtenerTodosPaises(){
    this.loadingCount++
    this.paisesService.getAllCountries().subscribe((resPaises: any) => {
      this.loadingCount--
      //console.log("resPaises",resPaises)
      this.listaPaises=resPaises;
      this.listaPaisesTotal=resPaises;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los paises'});
      console.error(err)
    });
    this.loadingCount++
    this.paisesService.getCountriesWidthInvest().subscribe((resPaises: any) => {
      this.loadingCount--
      //console.log("resPaises",resPaises)
      this.listaPaisesFilter=resPaises;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los paises'});
      console.error(err)
    });
  }

  obtenerTodosCampus(){
    this.loadingCount++
    this.campusService.getCampusList().subscribe((resCamp: any) => {
      this.loadingCount--
      //console.log("resCamp",resCamp);
      this.listaCampus=resCamp;
      this.listaCampusTotal=resCamp;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus sistema'});
      console.error(err)
    });
    this.loadingCount++
    this.campusService.getCampusWidthInvest().subscribe((resCamp: any) => {
      this.loadingCount--
      //console.log("resCamp",resCamp);
      this.listaCampusFilter=resCamp;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los campus sistema'});
      console.error(err)
    });
  }

  obtenerTodosColegios(){
    this.loadingCount++
    this.colegiosService.getSchoolsWidthInvest().subscribe((resCol: any) => {
      this.loadingCount--
      //console.log("resCol",resCol);
      this.listaColegios=resCol;
      this.listaColegiosTotal=resCol;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los colegios del sistema'});
      console.error(err)
    });
  }

  obtenerTodosCentros(){
    this.loadingCount++
    this.centrosService.getCentersWidthInvest().subscribe((resCent: any) => {
      this.loadingCount--
      //console.log("resCent",resCent)
      this.listaCentros=resCent;
      this.listaCentrosTotal=resCent;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los centros del sistema'});
      console.error(err)
    });
  }

  filtroDataLoadInstitucionSc = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                     loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInstRor:any = []; if(this.filtroSelectInstitucionRor!=0){ auxInstRor = [this.filtroSelectInstitucionRor] }
    var auxCamp:any = []; if(this.filtroSelectCampus!=0){ auxCamp = [this.filtroSelectCampus] }
    var auxCol:any = []; if(this.filtroSelectColegios!=0){ auxCol = [this.filtroSelectColegios] }
    var auxCent:any = []; if(this.filtroSelectCentros!=0){ auxCent = [this.filtroSelectCentros] }
    this.institutionScintraService.getInstitutionsScByFilter2(currentPage,pageSize,searchTerm,
      auxInstRor,auxCamp,auxCol,auxCent
    ).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.razon_social}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron las instituciones scintra'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroInstitucionSc(event:number){
    this.filtroSelectInstitucionSc = event;
    this.filtrarInvestigadores(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
    this.update5++;
    this.update6++;
  }

  filtroDataLoadInstitucionRor = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInstSc:any = []; if(this.filtroSelectInstitucionSc!=0){ auxInstSc = [this.filtroSelectInstitucionSc] }
    var auxPais:any = []; if(this.filtroSelectPaises!=0){ auxPais = [this.filtroSelectPaises] }
    this.institutionRorService.getInstitutionsRorByFilter(currentPage,pageSize,searchTerm,
      auxInstSc,auxPais
    ).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.institution_name}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron las instituciones ror'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroInstitucionRor(event:number){
    this.filtroSelectInstitucionRor = event;
    this.filtrarInvestigadores(false,'');
    this.update3++;
    this.update4++;
    this.update5++;
    this.update6++;
  }

  filtroDataLoadPaises = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                          loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInstSc:any = []; if(this.filtroSelectInstitucionSc!=0){ auxInstSc = [this.filtroSelectInstitucionSc] }
    var auxInstRor:any = []; if(this.filtroSelectInstitucionRor!=0){ auxInstRor = [this.filtroSelectInstitucionRor] }
    this.paisesService.getCountryWidthInvest(currentPage,pageSize,searchTerm,
      auxInstSc,auxInstRor
    ).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.ISO_3166_1_num,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los paises'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroPaises(event:number){
    this.filtroSelectPaises = event;
    this.filtrarInvestigadores(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
    this.update5++;
    this.update6++;
  }

  filtroDataLoadCampus = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInstSc:any = []; if(this.filtroSelectInstitucionSc!=0){ auxInstSc = [this.filtroSelectInstitucionSc] }
    var auxCole:any = []; if(this.filtroSelectColegios!=0){ auxCole = [this.filtroSelectColegios] }
    this.campusService.getCampusWidthInvestByFilter(currentPage,pageSize,searchTerm,
      auxInstSc,auxCole
    ).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los campus'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroCampus(event:number){
    this.filtroSelectCampus = event;
    this.filtrarInvestigadores(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
    this.update5++;
    this.update6++;
  }

  filtroDataLoadColegios = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInstSc:any = []; if(this.filtroSelectInstitucionSc!=0){ auxInstSc = [this.filtroSelectInstitucionSc] }
    var auxCamp:any = []; if(this.filtroSelectCampus!=0){ auxCamp = [this.filtroSelectCampus] }
    this.colegiosService.getSchoolsWidthInvestByFilter(currentPage,pageSize,searchTerm,
      auxInstSc,auxCamp
    ).subscribe((resProg: any) => {
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
    this.filtroSelectColegios = event;
    this.filtrarInvestigadores(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
    this.update5++;
    this.update6++;
  }

  filtroDataLoadCentros = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInstSc:any = []; if(this.filtroSelectInstitucionSc!=0){ auxInstSc = [this.filtroSelectInstitucionSc] }
    var auxCole:any = []; if(this.filtroSelectColegios!=0){ auxCole = [this.filtroSelectColegios] }
    this.centrosService.getCentersWidthInvestByFilter(currentPage,pageSize,searchTerm,
      auxInstSc,auxCole
    ).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los centros'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroCentros(event:number){
    this.filtroSelectCentros = event;
    this.filtrarInvestigadores(false,'');
    this.update1++;
    this.update2++;
    this.update3++;
    this.update4++;
    this.update5++;
    this.update6++;
  }

  filtrarInvestigadores(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(
      this.filtroSearch!="" ||
      this.filtroSelectInstitucionSc>0 ||
      this.filtroSelectPaises>0 ||
      this.filtroSelectCampus>0 ||
      this.filtroSelectColegios>0 ||
      this.filtroSelectCentros>0 ||
      this.filtroSelectInstitucionRor!=0 ||
      this.filtroSelectSoloConProd ||
      this.filtroSelectSoloConCita
    ){
      let idsInstRor:any=[];
      let idsInstSc:any=[];
      let idsPais:any=[];
      let idsCampus:any=[];
      let idsColegio:any=[];
      let idsCentro:any=[];
      if(this.filtroSelectInstitucionRor!=0){ idsInstRor=[this.filtroSelectInstitucionRor]; }
      if(this.filtroSelectInstitucionSc!=0){ idsInstSc=[this.filtroSelectInstitucionSc]; }
      if(this.filtroSelectPaises!=0){ idsPais=[this.filtroSelectPaises]; }
      if(this.filtroSelectCampus!=0){ idsCampus=[this.filtroSelectCampus]; }
      if(this.filtroSelectColegios!=0){ idsColegio=[this.filtroSelectColegios]; }
      if(this.filtroSelectCentros!=0){ idsCentro=[this.filtroSelectCentros]; }
      this.loadingCount++
      this.investigatorService.getInvestigatorsFilter(this.pageNumber,this.pageSize,this.filtroSearch,
        idsInstRor,idsInstSc,idsPais,idsCampus,idsColegio,idsCentro,this.filtroSelectSoloConProd,
        this.filtroSelectSoloConCita).subscribe((resInvest: any) => {
        this.loadingCount--
        this.listaInvestigadores=resInvest.data;
        this.totalItems=resInvest.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los investigadores del sistema'});
        console.error(err)
      });
    }else{
      this.obtenerTodosInvestigadores()
    }
  }

  abrirModalCrear(){
    document.getElementById('validacionLogo1').style.display = "none";
    document.getElementById('validacionLogoInput1').className = "custom-file-input";
    this.investId=0;
    this.investCorreo="";
    this.investIdPais=0;
    this.investIdInstitucion=0;
    this.investOrcid="";
    this.investCargo="";
    this.investNombAccident=[];
    this.investScopusIds=[];
    this.investUrlFoto="";
    this.investImagenRuta="assets/img/profile.jpg";
    this.investImagenName="";
    this.salvarImagen=false;
    this.validCorreo=0;
    this.validOrcid=0;
    this.tipoModal="crear";
    this.guardarTodo=0;
  }

  crear(){
    this.loadingCount++
    this.investigatorService.addInvestigador(this.investCorreo,this.investIdPais,this.investIdInstitucion).subscribe((creInst: any) => {
      this.loadingCount--
      this.investId=creInst;
      this.guardarTodo++;
      this.actualizar();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se creo el investigador'});
      console.error(err)
    });
  }

  obtenerInvestigadorVer(idInvest:number){
    this.loadingCount++
    this.investigatorService.getAllInvestigatorId(idInvest).subscribe((resInvest: any) => {
      this.loadingCount--
      this.abrirModalVer(resInvest.data[0]);
      //console.log("resInsti",resInsti)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo el investigador'});
      console.error(err)
    });
  }

  abrirModalVer(item:any){
    //console.log("item",item)
    this.investId=item.id;
    this.investCorreo=item.correo;
    this.investIdPais=item.id_pais;
    this.investIdInstitucion=item.id_institucion;
    this.investOrcid=item.orcid_id;
    this.investCargo=item.cargo;
    this.investNombAccident=item.nomb_accident;
    if(this.investNombAccident.length>0){
      this.investNombAccident = this.investNombAccident.sort((a,b)=>a.id-b.id);
      for(let ina of this.investNombAccident){ ina.accion="guardado"; }
    }
    this.investScopusIds=item.scopus_ids;
    if(this.investScopusIds.length>0){
      for(let isi of this.investScopusIds){ isi.accion="guardado"; }
    }
    this.investUrlFoto=item.url_foto;
    this.investImagen=[];
    if(item.url_foto!='' && item.url_foto!=null){
      this.investImagenRuta="https://backend-dev.scintra.com/images/"+item.url_foto;
      this.investImagenName=item.url_foto.slice(item.url_foto.length-15,item.url_foto.length);
    }else{
      this.investImagenRuta="assets/img/profile.jpg";
      this.investImagenName="";
    }
    this.salvarImagen=false;
    this.validCorreo=0;
    this.validOrcid=0;
    this.tipoModal="ver";
    this.guardarTodo=0;
  }

  obtenerInvestigadorActualizar(idInvest:number){
    this.loadingCount++
    this.investigatorService.getAllInvestigatorId(idInvest).subscribe((resInvest: any) => {
      this.loadingCount--
      this.abrirModalActualizar(resInvest.data[0]);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo el investigador'});
      console.error(err)
    });
  }

  abrirModalActualizar(item:any){
    document.getElementById('validacionLogo2').style.display = "none";
    document.getElementById('validacionLogoInput2').className = "custom-file-input";
    this.investId=item.id;
    this.investCorreo=item.correo;
    this.investIdPais=item.id_pais;
    this.investIdInstitucion=item.id_institucion;
    this.investOrcid=item.orcid_id;
    this.investCargo=item.cargo;
    this.investNombAccident=item.nomb_accident;
    if(this.investNombAccident.length>0){
      this.investNombAccident = this.investNombAccident.sort((a,b)=>a.id-b.id);
      for(let ina of this.investNombAccident){ ina.accion="guardado"; }
    }
    this.investScopusIds=item.scopus_ids;
    if(this.investScopusIds.length>0){
      for(let isi of this.investScopusIds){ isi.accion="guardado"; }
    }
    this.investUrlFoto=item.url_foto;
    this.investImagen=[];
    if(item.url_foto!='' && item.url_foto!=null){
      this.investImagenRuta="https://backend-dev.scintra.com/images/"+item.url_foto;
      this.investImagenName=item.url_foto.slice(item.url_foto.length-15,item.url_foto.length);
    }else{
      this.investImagenRuta="";
      this.investImagenName="";
    }
    this.salvarImagen=false;
    this.validCorreo=0;
    this.validOrcid=0;
    this.tipoModal="editar";
    this.guardarTodo=0;
  }

  actualizar(){
    if(this.salvarImagen){
      this.saveFile();
    }
    this.guardarTodo++;
    this.guardarNombres();
    this.guardarScopus();
    this.loadingCount++
    this.investigatorService.updateInvestigador(
        this.investId,
        this.investCorreo,
        this.investIdPais,
        this.investIdInstitucion,
        this.investOrcid,
        this.investCargo
    ).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosInvestigadores()

    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se actualizo el investigador'});
      console.error(err)
    });

  }

  eliminar(item:any){
    const nombre = item.nomb_accident[0].nombre_accidente;
    Swal.fire({
      title: '¿Seguro que deseas eliminar el investigador?',
      html: '<b>ID:</b> '+item.id+'<br><b>Nombre:</b> "'+nombre+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.investigatorService.deleteInvestigador(item.id).subscribe(() => {
          this.obtenerTodosInvestigadores();
        })
      }
    });
  }

  agregarNombre(){
    const fecha = moment(new Date(), 'DD-MM-yyyy').format('yyyyMMDDhhmmss');
    this.investNombAccident.push({id:fecha,nombre_accidente:this.nombAccident,accion:"nuevo"})
    this.nombAccident="";
  }

  removerNombre(nombre:any){
    if(nombre.accion=="guardado"){
      for(let ina of this.investNombAccident){
        if(ina.id==nombre.id){ ina.accion="eliminar"}
      }
    }else if(nombre.accion=="nuevo"){
      this.investNombAccident = this.investNombAccident.filter(item => item.id != nombre.id);
    }
    this.nombAccident="";
  }

  agregarScopus(){
    const fecha = moment(new Date(), 'DD-MM-yyyy').format('yyyyMMDDhhmmss');
    this.investScopusIds.push({id:fecha,id_scopus:this.idScopus,accion:"nuevo"})
    this.idScopus="";
  }

  removerScopus(scopus:any){
    if(scopus.accion=="guardado"){
      for(let ina of this.investScopusIds){
        if(ina.id==scopus.id){ ina.accion="eliminar"}
      }
    }else if(scopus.accion=="nuevo"){
      this.investScopusIds = this.investScopusIds.filter(item => item.id != scopus.id);
    }
    this.idScopus="";
  }

  validarCorreo() {
    if (/[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[a-zA-Z0-9]$/.test(this.investCorreo)) {
      this.validCorreo = 0;
    }else if(this.investCorreo==""){
      this.validCorreo = 1;
    }else {
      this.validCorreo = 2;
    }
  }

  validarScopus() {
    if(this.idScopus != ""){
      if(this.idScopus>9999999999 && this.idScopus<100000000000){
        this.validScopus=0;
      }else{
        this.validScopus=1;
      }
    }else{
      this.validScopus=0;
    }
  }

  validarOrcid(){
    if(/^(\d{4}-){3}\d{3}(\d|X)$/.test(this.investOrcid)){
      this.validOrcid = 0;
    }else if(this.investOrcid==""){
      this.validOrcid = 0;
    }else{
      this.validOrcid = 1;
    }
  }

  extractFileFromEvent1(event: any) {
    this.investImagen = event.target.files[0];
    this.investImagenName = this.investImagen.name;
    this.salvarImagen=true;
    var foto = event.target.files[0];
    var img = new Image();
    img.onload = function dimension() {
      const height = img.height;
      const width = img.width;
      if(height != width){
        document.getElementById('validacionLogo1').style.display = "block";
        document.getElementById('validacionLogoInput1').className = "custom-file-input is-invalid";
      }else{
        document.getElementById('validacionLogo1').style.display = "none";
        document.getElementById('validacionLogoInput1').className = "custom-file-input";
      }
    };
    img.src = URL.createObjectURL(foto)
    this.viewFile(foto)
  }

  extractFileFromEvent2(event: any) {
    this.investImagen = event.target.files[0];
    this.investImagenName = this.investImagen.name;
    this.salvarImagen=true;
    var foto = event.target.files[0];
    var img = new Image();
    img.onload = function dimension() {
      const height = img.height;
      const width = img.width;
      if(height != width){
        document.getElementById('validacionLogo2').style.display = "block";
        document.getElementById('validacionLogoInput2').className = "custom-file-input is-invalid";
      }else{
        document.getElementById('validacionLogo2').style.display = "none";
        document.getElementById('validacionLogoInput2').className = "custom-file-input";
      }
    };
    img.src = URL.createObjectURL(foto)
    this.viewFile(foto)
  }

  viewFile(archivourl:string) {
    let tempUrl = window.URL.createObjectURL(archivourl)
    let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(tempUrl)
    let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
    var aux = fileUrl.toString();
    let sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(aux);
    this.investImagenRuta = sanitizedUrl;
  }

  saveFile(){
    this.loadingCount++
    this.investigatorService.addPictureInvestigator(this.investId,this.investImagen).subscribe((resI: any) => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se guardó la imagen del investigador'});
      console.error(err)
    });
  }

  notFoudImage(){
    this.investImagenRuta="assets/img/profile.jpg";
  }

  guardarNombres(){
    for(let lc of this.investNombAccident){
      if(lc.accion=="nuevo"){ this.asociarNombreInvestigador(lc.nombre_accidente) }
      if(lc.accion=="eliminar"){ this.desasociarNombreInvestigador(lc.id) }
    }
  }

  asociarNombreInvestigador(nombre:string){
    this.loadingCount++
    this.investigatorService.addNameToInvestigador(this.investId,nombre).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asoció el nombre al investigador'});
      console.error(err)
    });
  }

  desasociarNombreInvestigador(id:number){
    this.loadingCount++
    this.investigatorService.removeNameToInvestigador(id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasoció el nombre del investigador'});
      console.error(err)
    });
  }

  guardarScopus(){
    for(let lc of this.investScopusIds){
      //console.log("flash",lc)
      if(lc.accion=="nuevo"){ this.asociarScopusInvestigador(lc.id_scopus) }
      if(lc.accion=="eliminar"){ this.desasociarScopusInvestigador(lc.id) }
    }
  }

  asociarScopusInvestigador(id:number){
    this.loadingCount++
    this.investigatorService.addScopusToInvestigador(this.investId,id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asoció el ID scopus al investigador'});
      console.error(err)
    });
  }

  desasociarScopusInvestigador(id:number){
    this.loadingCount++
    this.investigatorService.removeScopusToInvestigador(id).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasoció el ID scopus del investigador'});
      console.error(err)
    });
  }

  cambiarFiltroProducto(value:boolean){
    this.filtroSelectSoloConProd=value;
    this.update7++;
    this.filtrarInvestigadores(false,'filtroProducto')
  }

  cambiarFiltroCita(value:boolean){
    this.filtroSelectSoloConCita=value;
    this.update8++;
    this.filtrarInvestigadores(false,'filtroCita')
  }

  limpiarFiltros(){
    this.filtroSearch="";
    this.filtroSelectInstitucionSc=0;
    this.filtroSelectInstitucionRor=0;
    this.nombreInstitutionRor="";
    this.filtroSelectPaises=0;
    this.filtroSelectCampus=0;
    this.filtroSelectColegios=0;
    this.filtroSelectCentros=0;
    this.filtroSelectSoloConProd=false;
    this.filtroSelectSoloConCita=false;
    this.pageNumber = 1;
    this.update1 = 0;
    this.update2 = 0;
    this.update3 = 0;
    this.update4 = 0;
    this.update5 = 0;
    this.update6 = 0;
    this.update7 = 0;
    this.update8 = 0;
    this.obtenerTodosInvestigadores()
  }

  cambiarPagina(event:number){
    this.pageNumber=event;
    this.filtrarInvestigadores(true,'');
  }

  desabilitarGuardadoCampus(event:any){
    this.guardadoCampus = event;
  }

  desabilitarGuardadoCentros(event:any){
    this.guardadoCentros = event;
  }

  desabilitarGuardadoColegios(event:any){
    this.guardadoColegios = event;
  }

  desabilitarGuardadoLineas(event:any){
    this.guardadoLineas = event;
  }

}

