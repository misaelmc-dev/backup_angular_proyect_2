import {Component, OnInit, SecurityContext} from '@angular/core';
import Swal from "sweetalert2";
import {SourcesService} from "../../../../services/sources.service";
import {CountriesService} from "../../../../services/countries.service";
import {LanguagesService} from "../../../../services/languages.service";

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {

  listaFuentes:any[]=[];
  listaFuentesTotal:any[]=[];
  listaPaises:any[]=[];
  listaPaisesTotal:any[]=[];
  listaIdiomas:any[]=[];
  listaIdiomasTotal:any[]=[];
  listaSimago:any[]=[];
  listaSimagoTotal:any[]=[];
  listaPublisher:any[]=[];
  listaConacyt:any[]=[];

  filtroSearch:string="";
  filtroOpenAccess:boolean=false;
  filtroMinCiteScore:number=0;
  filtroMaxCiteScore:number=0;
  filtroSelectQscopus:string="";
  filtroSelectIdioma:number=0;
  filtroSelectPais:number=0;
  filtroDepredadoras:boolean=false;

  fuenteId:number = 0;
  fuenteTitulo:string="";
  fuenteIssne:string="";
  fuenteIssni:string="";
  fuenteFrecuencia:string="";
  fuentePublisher:string="";
  fuenteSearchPublisher:string="";
  fuenteFi:any="";
  fuenteScopusQ:string="";
  fuenteAaAutor:boolean=false;
  fuenteAaLector:boolean=false;
  fuenteUrlNormas:string="";
  fuenteCitesScore:string="";
  fuenteDoaj:boolean=false;
  fuenteJcr:boolean=false;
  fuenteScopusAlgunaVez:boolean=false;
  fuenteConacyt:boolean=false;
  fuenteApcCosto:string="";
  fuenteLicenseCondition:string="";
  fuenteClasifConacyt:string="";
  fuenteAccesoAbierto:boolean=false;
  fuenteScielo:boolean=false;
  fuenteRightsUri:string="";
  fuenteIsbn:string="";
  fuenteTipo:string="";
  fuenteCitesScorYear:any="";
  fuenteCitesScoreTrack:any="";
  fuenteCitesScoreTrackYear:any="";
  fuenteSjr:any="";
  fuenteSjrYear:any="";
  fuenteSnip:any="";
  fuenteSnipYear:any="";
  fuenteHIndex:any="";
  fuenteUrl:string="";
  fuenteScimagoSourceId:string="";
  fuenteScopusQScintra:string="";
  fuenteWoscc:boolean=false;
  fuenteDepredadora:boolean=false;

  fuenteMetadata:any=[];

  copiar:string="1233";

  modal_titulo:string="";
  modal_boton:string="";
  modal_icon:string="";

  validIssne:number=0;
  validIssni:number=0;
  validUrlNorm:number=0;
  validPublisher:number=0;
  validApcCosto:number=0;
  validLicense:number=0;
  validClasif:number=0;
  validRigtsUrl:number=0;
  validIsbn:number=0;
  validTipo:number=0;
  validScoreYear:number=0;
  validScoreTrackYear:number=0;
  validSjrYear:number=0;
  validSnipYear:number=0;
  validHIndex:number=0;
  validUrl:number=0;

  criterioBusqueda:string="";

  guardarTodo:number=0;
  tipoModal:string="";

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1:number = 1
  update2:number = 1
  update3:number = 1
  update4:number = 1
  update5:number = 1

  constructor(public fuentesService:SourcesService,
              public paisesService:CountriesService,
              public idiomasService:LanguagesService) { }

  ngOnInit(): void {
    this.obtenerTodasFuentes();
    this.obtenerTodosPaises();
    this.obtenerTodosIdiomas();
    this.obtenerTodosSimago();
    this.obtenerTodosConacyt();
  }

  obtenerTodasFuentes(){
    this.loadingCount++
    this.fuentesService.getAllSources(this.pageNumber,this.pageSize).subscribe((resSour: any) => {
      this.loadingCount--
      this.listaFuentes=resSour.data;
      this.listaFuentesTotal=resSour.data;
      this.totalItems=resSour.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las fuentes del sistema'});
      console.error(err)
    });
  }

  obtenerTodosPaises(){
    this.loadingCount++
    this.paisesService.getCountriesWidthSourcesList().subscribe((resPaises: any) => {
      this.loadingCount--
      this.listaPaises=resPaises;
      this.listaPaisesTotal=resPaises;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los paises'});
      console.error(err)
    });
  }

  obtenerTodosIdiomas(){
    this.loadingCount++
    this.idiomasService.getLanguagesWidthSourcesList().subscribe((resLang: any) => {
      this.loadingCount--
      this.listaIdiomas=resLang;
      this.listaIdiomasTotal=resLang;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los idiomas'});
      console.error(err)
    });
  }

  obtenerTodosSimago(){
    this.loadingCount++
    this.fuentesService.getSimago().subscribe((resSimago: any) => {
      this.loadingCount--
      this.listaSimago=resSimago;
      this.listaSimagoTotal=resSimago;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los id SIMAGO'});
      console.error(err)
    });
  }

  obtenerPublisher(){
    this.loadingCount++
    this.fuentesService.getSourcePublisherSearch(this.fuenteSearchPublisher).subscribe((resPublisher: any) => {
      this.loadingCount--
      this.listaPublisher=resPublisher;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los id SIMAGO'});
      console.error(err)
    });
  }

  obtenerTodosConacyt(){
    this.loadingCount++
    this.fuentesService.getSourceConacyt().subscribe((resConacyt: any) => {
      this.loadingCount--
      this.listaConacyt=resConacyt;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los id SIMAGO'});
      console.error(err)
    });
  }

  cambiarFiltroOpen(event:boolean){
    this.filtroOpenAccess=event;
    this.update1++;
    this.filtrarFuentes(false,'')
  }

  cambiarFiltroDepredadoras(event:boolean){
    this.filtroDepredadoras=event;
    this.update2++;
    this.filtrarFuentes(false,'')
  }

  filtroDataLoadCuartil = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    this.paisesService.getCountriesWidthSources(currentPage,pageSize,searchTerm).subscribe((resPais: any) => {
      lista.push({"id":"q1","texto":"Q1"});
      lista.push({"id":"q2","texto":"Q2"});
      lista.push({"id":"q3","texto":"Q3"});
      lista.push({"id":"q4","texto":"Q4"});
      totalItems.splice(0, lista.length);
      totalItems.push(lista.length);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los paises'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroCuartil(event:any){
    this.filtroSelectQscopus = event;
    this.update3++;
    this.filtrarFuentes(false,'');
  }

  filtroDataLoadPais = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                     loadingItems: boolean[], totalItems: number[]) =>
  {
    this.paisesService.getCountriesWidthSources(currentPage,pageSize,searchTerm).subscribe((resPais: any) => {
      for (let item of resPais.data){ lista.push({"id":item.ISO_3166_1_num,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resPais.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los paises'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroPais(event:number){
    this.filtroSelectPais = event;
    this.update4++;
    this.filtrarFuentes(false,'');
  }

  filtroDataLoadIdiomas = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                     loadingItems: boolean[], totalItems: number[]) =>
  {
    this.idiomasService.getLanguagesWidthSources(currentPage,pageSize,searchTerm).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los idiomas'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroIdiomas(event:number){
    this.filtroSelectIdioma = event;
    this.update5++;
    this.filtrarFuentes(false,'');
  }

  filtrarFuentes(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(
      this.filtroSearch!="" ||
      this.filtroOpenAccess ||
      (this.filtroMinCiteScore>0 && this.filtroMinCiteScore!=null) ||
      (this.filtroMaxCiteScore>0 && this.filtroMaxCiteScore!=null) ||
      this.filtroSelectIdioma>0 ||
      this.filtroSelectPais>0 ||
      this.filtroSelectQscopus!="" ||
      this.filtroDepredadoras
    ){
      let auxMinScore:number=0;
      if(this.filtroMinCiteScore>0 && this.filtroMinCiteScore!=null){ auxMinScore=this.filtroMinCiteScore;}
      let auxMaxScore:number=0;
      if(this.filtroMaxCiteScore>0 && this.filtroMaxCiteScore!=null){ auxMaxScore=this.filtroMaxCiteScore;}
      let auxSelectQscopus:any=[];
      if(this.filtroSelectQscopus!=""){ auxSelectQscopus=[this.filtroSelectQscopus];}
      let auxSelectIdioma:any=[];
      if(this.filtroSelectIdioma>0){ auxSelectIdioma=[this.filtroSelectIdioma];}
      let auxSelectPais:any=[];
      if(this.filtroSelectPais>0){ auxSelectPais=[this.filtroSelectPais];}
      this.loadingCount++
      this.fuentesService.getSourcesFilter(this.pageNumber,this.pageSize,this.filtroSearch,auxMinScore,auxMaxScore,
        auxSelectQscopus,auxSelectIdioma,auxSelectPais,this.filtroOpenAccess,this.filtroDepredadoras).subscribe((resSourFilt: any) => {
        this.loadingCount--
        this.listaFuentes=resSourFilt.data;
        this.totalItems=resSourFilt.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las fuentes del sistema filtradas'});
        console.error(err)
      });
    }else{
      this.obtenerTodasFuentes();
    }
  }

  limpiarDatos(){
    this.fuenteMetadata=[];
    this.tipoModal="crear";
    this.modal_titulo="Ingrese los datos de la fuente";
    this.modal_boton="Guardar";
    this.modal_icon="fa fa-save mr-2";
    this.fuenteId = 0;
    this.fuenteTitulo="";
    this.fuenteIssne="";
    this.fuenteIssni="";
    this.fuenteFrecuencia="";
    this.fuentePublisher="";
    this.fuenteSearchPublisher="";
    this.fuenteFi="";
    this.fuenteScopusQ="";
    this.fuenteAaAutor=false;
    this.fuenteAaLector=false;
    this.fuenteUrlNormas="";
    this.fuenteCitesScore="";
    this.fuenteDoaj=false;
    this.fuenteJcr=false;
    this.fuenteScopusAlgunaVez=false;
    this.fuenteConacyt=false;
    this.fuenteApcCosto="";
    this.fuenteLicenseCondition="";
    this.fuenteClasifConacyt="";
    this.fuenteAccesoAbierto=false;
    this.fuenteScielo=false;
    this.fuenteRightsUri="";
    this.fuenteIsbn="";
    this.fuenteTipo="";
    this.fuenteCitesScorYear="";
    this.fuenteCitesScoreTrack="";
    this.fuenteCitesScoreTrackYear="";
    this.fuenteSjr="";
    this.fuenteSjrYear="";
    this.fuenteSnip="";
    this.fuenteSnipYear="";
    this.fuenteHIndex="";
    this.fuenteUrl="";
    this.fuenteScimagoSourceId="";
    this.fuenteScopusQScintra="";
    this.fuenteWoscc=false;
    this.fuenteDepredadora=false;
    this.fuenteMetadata=[];
  }

  consultar(id:number,modal:string){
    this.tipoModal=modal;
    this.loadingCount++
    this.fuentesService.getSourceWidthAllMetadata(id).subscribe((resSource: any) => {
      this.loadingCount--
      this.llenarDatos(resSource[0]);
      //console.log("resSource",resSource);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo la fuente'});
      console.error(err)
    });
  }

  llenarDatos(item:any){
    this.fuenteMetadata=item;
    this.modal_titulo="Actualice los datos de la fuente";
    this.modal_boton="Actualizar";
    this.modal_icon="fa fa-check mr-2";
    this.fuenteId = item.id;
    this.fuenteTitulo=item.titulo;
    if(item.issn_e===null){ this.fuenteIssne=""; }else{ this.fuenteIssne=item.issn_e; }
    if(item.issn_i===null){ this.fuenteIssni=""; }else{ this.fuenteIssni=item.issn_i; }
    if(item.frecuencia===null){ this.fuenteFrecuencia=""; }else{ this.fuenteFrecuencia=item.frecuencia; }
    if(item.publisher===null){ this.fuentePublisher=""; }else{ this.fuentePublisher=item.publisher; }
    this.fuenteSearchPublisher="";
    if(item.fi===null){ this.fuenteFi=""; }else{ this.fuenteFi=item.fi; }
    if(item.aa_autor===null){ this.fuenteAaAutor=false; }else{ this.fuenteAaAutor=item.aa_autor; }
    if(item.aa_lector===null){ this.fuenteAaLector=false; }else{ this.fuenteAaLector=item.aa_lector; }
    if(item.url_normas===null){ this.fuenteUrlNormas=""; }else{ this.fuenteUrlNormas=item.url_normas; }
    if(item.cites_score===null){ this.fuenteCitesScore=""; }else{ this.fuenteCitesScore=item.cites_score; }
    if(item.doaj===null){ this.fuenteDoaj=false; }else{ this.fuenteDoaj=item.doaj; }
    if(item.jcr===null){ this.fuenteJcr=false; }else{ this.fuenteJcr=item.jcr; }
    if(item.scopus_alguna_vez===null){ this.fuenteScopusAlgunaVez=false; }else{ this.fuenteScopusAlgunaVez=item.scopus_alguna_vez; }
    if(item.conacyt===null){ this.fuenteConacyt=false; }else{ this.fuenteConacyt=item.conacyt; }
    if(item.apc_costo===null){ this.fuenteApcCosto=""; }else{ this.fuenteApcCosto=item.apc_costo; }
    if(item.license_condition===null){ this.fuenteLicenseCondition=""; }else{ this.fuenteLicenseCondition=item.license_condition; }
    if(item.clasif_conacyt===null){ this.fuenteClasifConacyt=""; }else{ this.fuenteClasifConacyt=item.clasif_conacyt; }
    if(item.acceso_abierto===null || item.acceso_abierto==0){ this.fuenteAccesoAbierto=false; }else{ this.fuenteAccesoAbierto=item.acceso_abierto; }
    if(item.scielo===null){ this.fuenteScielo=false; }else{ this.fuenteScielo=item.scielo; }
    if(item.rights_uri===null){ this.fuenteRightsUri=""; }else{ this.fuenteRightsUri=item.rights_uri; }
    if(item.isbn===null){ this.fuenteIsbn=""; }else{ this.fuenteIsbn=item.isbn; }
    if(item.tipo===null){ this.fuenteTipo=""; }else{ this.fuenteTipo=item.tipo; }
    if(item.cites_score_year===null){ this.fuenteCitesScorYear=""; }else{ this.fuenteCitesScorYear=item.cites_score_year; }
    if(item.cites_score_track===null){ this.fuenteCitesScoreTrack=""; }else{ this.fuenteCitesScoreTrack=item.cites_score_track; }
    if(item.cites_score_track_year===null){ this.fuenteCitesScoreTrackYear=""; }else{ this.fuenteCitesScoreTrackYear=item.cites_score_track_year; }
    if(item.sjr===null){ this.fuenteSjr=""; }else{ this.fuenteSjr=item.sjr; }
    if(item.sjr_year===null){ this.fuenteSjr=""; }else{ this.fuenteSjr=item.sjr_year; }
    if(item.snip===null){ this.fuenteSnip=""; }else{ this.fuenteSnip=item.snip; }
    if(item.snip_year===null){ this.fuenteSnipYear=""; }else{ this.fuenteSnipYear=item.snip_year; }
    if(item.h_index===null){ this.fuenteHIndex=""; }else{ this.fuenteHIndex=item.h_index; }
    if(item.url===null){ this.fuenteUrl=""; }else{ this.fuenteUrl=item.url; }
    if(item.scimago_source_id===null){ this.fuenteScimagoSourceId=""; }else{ this.fuenteScimagoSourceId=item.scimago_source_id; }
    if(item.woscc===null){ this.fuenteWoscc=false; }else{ this.fuenteWoscc=item.woscc; }
    if(item.depredadora===null){ this.fuenteDepredadora=false; }else{ this.fuenteDepredadora=item.depredadora; }
    if(item.scopus_q_scintra===null){ this.fuenteScopusQScintra=""; }else{ this.fuenteScopusQScintra=item.scopus_q_scintra; }
    if(item.scopus_q===null){ this.fuenteScopusQ=""; }else{ this.fuenteScopusQ=item.scopus_q; }
  }

  crear(){
    this.loadingCount++
    this.fuentesService.addSource(this.fuenteTitulo).subscribe((creInst: any) => {
      this.loadingCount--
      this.fuenteId=creInst;
      this.actualizar();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se creo la fuente'});
      console.error(err)
    });
  }

  actualizar(){
    this.guardarTodo++
    this.loadingCount++
    this.fuentesService.updateSource(
      this.fuenteId,
      this.fuenteTitulo,
      this.fuenteIssni,
      this.fuenteIssne,
      this.fuenteFrecuencia,
      this.fuentePublisher,
      this.fuenteFi,
      this.fuenteAaAutor,
      this.fuenteAaLector,
      this.fuenteUrlNormas,
      this.fuenteCitesScore,
      this.fuenteDoaj,
      this.fuenteJcr,
      this.fuenteScopusAlgunaVez,
      this.fuenteConacyt,
      this.fuenteScielo,
      this.fuenteApcCosto,
      this.fuenteLicenseCondition,
      this.fuenteClasifConacyt,
      this.fuenteAccesoAbierto,
      this.fuenteRightsUri,
      this.fuenteIsbn,
      this.fuenteTipo,
      this.fuenteCitesScorYear,
      this.fuenteCitesScoreTrack,
      this.fuenteCitesScoreTrackYear,
      this.fuenteSjr,
      this.fuenteSjrYear,
      this.fuenteSnip,
      this.fuenteSnipYear,
      this.fuenteHIndex,
      this.fuenteUrl,
      this.fuenteScimagoSourceId,
      this.fuenteWoscc,
      this.fuenteDepredadora
    ).subscribe(() => {
      this.loadingCount--
      this.limpiarFiltros();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se actualizo la fuente'});
      console.error(err)
    });
  }

  eliminar(item:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar la fuente?',
      html: '<b>ID:</b> '+item.id+'<br><b>Nombre:</b> "'+item.titulo+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.fuentesService.deleteSource(item.id).subscribe(() => {
          this.limpiarFiltros();
        })
      }
    });
  }

  validarIssne(){
    if(this.fuenteIssne.length>10){
      this.validIssne=1;
    }else{
      this.validIssne=0;
    }
  }

  validarIssni(){
    if(this.fuenteIssni.length>10){
      this.validIssni=1;
    }else{
      this.validIssni=0;
    }
  }

  validarPublisher(){
    if(this.fuentePublisher.length>255){
      this.validPublisher=1;
    }else{
      this.validPublisher=0;
    }
  }

  validarUrlNormas() {
    if(this.fuenteUrlNormas!=""){
      if (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(this.fuenteUrlNormas)) {
        this.validUrlNorm=0;
      }else{ this.validUrlNorm=1; }
    }else{ this.validUrlNorm=0; }
  }

  validarApcCosto(){
    if(this.fuenteApcCosto.length>100){
      this.validApcCosto=1;
    }else{
      this.validApcCosto=0;
    }
  }

  validarLicense(){
    if(this.fuenteLicenseCondition.length>100){
      this.validLicense=1;
    }else{
      this.validLicense=0;
    }
  }

  validarClasif(){
    if(this.fuenteClasifConacyt.length>50){
      this.validClasif=1;
    }else{
      this.validClasif=0;
    }
  }

  validarRigtsUrl(){
    if(this.fuenteRightsUri!=""){
      if (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(this.fuenteRightsUri)) {
        this.validRigtsUrl=0;
      }else{ this.validRigtsUrl=1; }
    }else{ this.validRigtsUrl=0; }
  }

  validarIsbn(){
    if(this.fuenteIsbn.length>15){
      this.validIsbn=1;
    }else{
      this.validIsbn=0;
    }
  }

  validarTipo(){
    if(this.fuenteTipo.length>45){
      this.validTipo=1;
    }else{
      this.validTipo=0;
    }
  }

  validarScoreYear(){
    if (this.fuenteCitesScorYear % 1 === 0) {
      this.validScoreYear=0;
    } else {
      this.validScoreYear=1;
    }
  }

  validarScoreTrackYear(){
    if (this.fuenteCitesScoreTrackYear % 1 === 0) {
      this.validScoreTrackYear=0;
    } else {
      this.validScoreTrackYear=1;
    }
  }

  validarSjrYear(){
    if (this.fuenteSjrYear % 1 === 0) {
      this.validSjrYear=0;
    } else {
      this.validSjrYear=1;
    }
  }

  validarSnipYear(){
    if (this.fuenteSnipYear % 1 === 0) {
      this.validSnipYear=0;
    } else {
      this.validSnipYear=1;
    }
  }

  validarHIndex(){
    if (this.fuenteHIndex % 1 === 0) {
      this.validHIndex=0;
    } else {
      this.validHIndex=1;
    }
  }

  validarUrl(){
    if(this.fuenteUrl!=""){
      if (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(this.fuenteUrl)) {
        this.validUrl=0;
      }else{ this.validUrl=1; }
    }else{ this.validUrl=0; }
  }

  cambiarAAAutor(value:boolean){
    this.fuenteAaAutor=value;
  }

  cambiarAALector(value:boolean){
    this.fuenteAaLector=value;
  }

  cambiarDoaj(value:boolean){
    this.fuenteDoaj=value;
  }

  cambiarJcr(value:boolean){
    this.fuenteJcr=value;
  }

  cambiarScopus(value:boolean){
    this.fuenteScopusAlgunaVez=value;
  }

  cambiarConacyt(value:boolean){
    this.fuenteConacyt=value;
  }

  cambiarScielo(value:boolean){
    this.fuenteScielo=value;
  }

  cambiarAccesoAbierto(value:boolean){
    this.fuenteAccesoAbierto=value;
  }

  cambiarWoscc(value:boolean){
    this.fuenteWoscc=value;
  }

  cambiarDepredadora(value:boolean){
    this.fuenteDepredadora=value;
  }

  limpiarFiltros(){
    this.filtroSearch="";
    this.filtroOpenAccess=false;
    this.filtroDepredadoras=false;
    this.filtroMinCiteScore=0;
    this.filtroMaxCiteScore=0;
    this.filtroSelectQscopus="";
    this.filtroSelectIdioma=0;
    this.filtroSelectPais=0;
    this.update1 = 0;
    this.update2 = 0;
    this.update3 = 0;
    this.update4 = 0;
    this.update5 = 0;
    this.pageNumber=1;
    this.obtenerTodasFuentes()
  }

  cambiarPagina(event: any) {
    this.pageNumber=event;
    this.filtrarFuentes(true,'');
  }

  protected readonly Text = Text;

  copiarText(valor:string){
    console.log("copiarText",valor);
    var aux = document.createElement("input");
    aux.setAttribute("value", valor);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
  }

}
