import {Component, OnInit, SecurityContext} from '@angular/core';
import Swal from "sweetalert2";
import {DomSanitizer} from "@angular/platform-browser";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";
import {InstitutionRorService} from "../../../../services/institution-ror.service";

@Component({
  selector: 'app-institutions-scintra',
  templateUrl: './institutions-scintra.component.html',
  styleUrls: ['./institutions-scintra.component.css']
})
export class InstitutionsScintraComponent implements OnInit {

  listaInstitucionesSc:any[]=[];
  listaInstitucionesScTotal:any[]=[];
  listaInstitucionesRorForm:any[]=[];

  criterioBusqueda:string="";
  criterioBusquedaRor:string="";
  criterioBusquedaRorForm:string="";

  filtroSelectInstitucionRor:number=0;

  institucionId:number=0;
  institucionRazonSocial:string="";
  institucionRFC:string="";
  institucionDireccionFiscal:string="";
  institucionPersonaMoral:boolean=true;
  institucionCorreo:string="";
  institucionIdRor:string="0";
  institucionWebsite:string="";
  institucionPhone:string="";
  institucionImagen:any=[];
  institucionImagenTemp:any;
  institucionImagenGuardada:string="";
  institucionImagenName:string="";
  archivoVacio:any;
  salvarImagen:boolean=false;

  validLink:number=0;
  validCorreo:number=0;

  pageNumber:number = 1;
  pageSize:number = 10;
  totalItems:number= 0;

  loadingCount: number = 0;

  update1:number = 1

  constructor(public institutionScintraService: InstitutionScintraService,
              public institutionRorService: InstitutionRorService,
              private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.obtenerTodasInstituciones();
  }

  obtenerTodasInstituciones(){
    this.loadingCount++
    this.institutionScintraService.getInstitutionsScList(this.pageNumber,this.pageSize,this.criterioBusqueda).subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstitucionesSc=resIns.data;
      this.listaInstitucionesScTotal=resIns.data;
      this.totalItems=resIns.total;
      //console.log("listaInstituciones",resIns);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones Scintra del sistema'});
      console.error(err)
    });
  }

  obtenerTodasInstitucionesRorForm(){
    if(this.criterioBusquedaRorForm!="") {
      this.loadingCount++
      this.institutionRorService.getInstitutionsBySearch(this.criterioBusquedaRorForm).subscribe((resIns: any) => {
        this.loadingCount--
        this.listaInstitucionesRorForm = resIns;
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

  filtroDataLoadInstitucionesRor = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                                 loadingItems: boolean[], totalItems: number[]) =>
  {
    this.institutionRorService.getAllInstitutionsRorWidthInstSc(currentPage,pageSize,searchTerm).subscribe((resInst: any) => {
      //console.log("resInst",resInst)
      for (let item of resInst.data){ lista.push({"id":item.id_ror,"texto":item.institution_name}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resInst.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron las instituciones ROR'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroInstitucionesRor(event:number){
    this.filtroSelectInstitucionRor = event;
    this.filtrarInstituciones();
    this.update1++;
  }

  filtrarInstituciones(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
    }
    if(this.filtroSelectInstitucionRor!=0 || this.criterioBusqueda!=""){
      this.loadingCount++
      var auxInstRor:any = []; if(this.filtroSelectInstitucionRor!=0){ auxInstRor = this.filtroSelectInstitucionRor }
      this.institutionScintraService.getInstitutionsScByFilter(this.pageNumber,this.pageSize,
        this.criterioBusqueda,auxInstRor).subscribe((resInst: any) => {
        this.loadingCount--
        this.listaInstitucionesSc=resInst.data;
        this.totalItems=resInst.total;
        //console.log("resInst",resInst)
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las instituciones Scintra del sistema'});
        console.error(err)
      });
    }else{
      this.obtenerTodasInstituciones()
    }
  }

  abrirModalCrear(){
    document.getElementById('validacionLogo').style.display = "none";
    document.getElementById('validacionLogoInput').className = "custom-file-input";
    this.institucionId=0;
    this.institucionRazonSocial="";
    this.institucionRFC="";
    this.institucionDireccionFiscal="";
    this.institucionPersonaMoral=true;
    this.institucionCorreo="";
    this.institucionWebsite="";
    this.institucionPhone="";
    this.institucionIdRor="0";
    this.institucionImagenGuardada="";
    this.institucionImagenName="";
    this.institucionImagen=[];
    this.institucionImagenTemp='';
    this.salvarImagen=false;
    this.validLink=0;
    this.validCorreo=0;
  }

  crear(){
    let auxPersonaMoral = 0;
    if(this.institucionPersonaMoral==true){auxPersonaMoral==1}
    this.loadingCount++
    this.institutionScintraService.addInstitutionsSc(
      this.institucionRazonSocial,
      this.institucionRFC,
      this.institucionDireccionFiscal,
      auxPersonaMoral,
      this.institucionCorreo,
      this.institucionIdRor
    ).subscribe((creInst: any) => {
      this.loadingCount--
      this.institucionId=creInst;
      this.actualizar();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se creo la institución ROR'});
      console.error(err)
    });
  }

  obtenerInstitucionVer(idInst:number){
    this.loadingCount++
    this.institutionScintraService.getInstitutionsScById(idInst).subscribe((resInsti: any) => {
      this.loadingCount--
      this.abrirModalVer(resInsti[0]);
      //console.log("resInsti",resInsti)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo las institución ROR'});
      console.error(err)
    });
  }

  abrirModalVer(item:any){
    this.institucionId=item.id;
    this.institucionRazonSocial=item.razon_social;
    this.institucionRFC=item.rfc;
    this.institucionDireccionFiscal=item.direccion_fiscal;
    this.institucionPersonaMoral=item.persona_moral;
    this.institucionCorreo=item.correo;
    this.institucionIdRor=item.id_ror;
    this.institucionWebsite=item.website;
    this.institucionPhone=item.phone;
    this.institucionImagenGuardada=item.url_foto;
    this.institucionImagenName=item.url_foto;
    this.institucionImagenTemp='';
    this.salvarImagen=false;
    this.validLink=0;
    this.validCorreo=0;
  }

  obtenerInstitucionActualizar(idInst:number){
    this.loadingCount++
    this.institutionScintraService.getInstitutionsScById(idInst).subscribe((resInstit: any) => {
      this.loadingCount--
      this.abrirModalActualizar(resInstit[0]);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo las institución ROR'});
      console.error(err)
    });
  }

  abrirModalActualizar(item:any){
    //console.log("item",item)
    document.getElementById('validacionLogo').style.display = "none";
    document.getElementById('validacionLogoInput').className = "custom-file-input";
    this.obtenerInstitucionRor(item.id_ror)
    this.institucionId=item.id;
    this.institucionRazonSocial=item.razon_social;
    this.institucionRFC=item.rfc;
    this.institucionDireccionFiscal=item.direccion_fiscal;
    this.institucionPersonaMoral=item.persona_moral;
    this.institucionWebsite=item.website;
    this.institucionCorreo=item.correo;
    this.institucionPhone=item.phone;
    this.institucionIdRor=item.id_ror;
    this.institucionImagenGuardada=item.url_foto;
    this.institucionImagenTemp='';
    this.salvarImagen=false;
    const auxInicio:number=item.url_foto.length-15;
    const auxFinal:number=item.url_foto.length;
    this.institucionImagenName=item.url_foto.slice(auxInicio,auxFinal);
    this.validLink=0;
    this.validCorreo=0;
  }

  actualizar(){
    let auxPersonaMoral = 0;
    if(this.institucionPersonaMoral==true){auxPersonaMoral==1}
    this.loadingCount++
    this.institutionScintraService.updateInstitutionsSc(
      this.institucionId,
      this.institucionRazonSocial,
      this.institucionRFC,
      this.institucionDireccionFiscal,
      auxPersonaMoral,
      this.institucionCorreo,
      this.institucionIdRor,
      this.institucionWebsite,
      this.institucionPhone
    ).subscribe(() => {
      this.loadingCount--
      this.obtenerTodasInstituciones()
      if(this.salvarImagen){
        this.saveFile();
      }
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se actualizo la institución ROR'});
      console.error(err)
    });
  }

  eliminar(item:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar la institución?',
      html: '<b>ID:</b> '+item.id+'<br><b>Nombre:</b> "'+item.razon_social+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.institutionScintraService.deleteInstitutionsSc(item.id).subscribe(() => {
          this.obtenerTodasInstituciones();
        })
      }
    });
  }

  cambiarPersonaMoral(valor:boolean){
    this.institucionPersonaMoral=valor;
  }

  extractFileFromEvent(event: any) {
    this.institucionImagen = event.target.files[0];
    this.institucionImagenName = this.institucionImagen.name;
    this.salvarImagen=true;
    //console.warn("this.institucionImagen",this.institucionImagen)
    var foto = event.target.files[0];
    var img = new Image();
    img.onload = function dimension() {
      const height = img.height;
      const width = img.width;
      if(height != width){
        document.getElementById('validacionLogo').style.display = "block";
        document.getElementById('validacionLogoInput').className = "custom-file-input is-invalid";
      }else{
        document.getElementById('validacionLogo').style.display = "none";
        document.getElementById('validacionLogoInput').className = "custom-file-input";
      }
    };
    img.src = URL.createObjectURL(foto)
    //this.institucionImagenTemp = img.src ;
    this.viewFile(foto)
  }

  extractFileFromEvent1(event: any) {
    this.institucionImagen = event.target.files[0];
    this.institucionImagenName = this.institucionImagen.name;
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

  viewFile(archivourl:string) {
    let tempUrl = window.URL.createObjectURL(archivourl)
    let safeFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(tempUrl)
    let fileUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeFileUrl)
    var aux = fileUrl.toString();
    let sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(aux);
    this.institucionImagenTemp = sanitizedUrl;
  }

  saveFile(){
    this.loadingCount++
    this.institutionScintraService.addPictureInstitution(this.institucionId,this.institucionImagen).subscribe((resI: any) => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se guardó el archivo en el evento especificado'});
      console.error(err)
    });
  }

  validarLink(){
    const patronURL = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (patronURL.test(this.institucionWebsite)) {
      this.validLink = 0;
    }else if(this.institucionWebsite==""){
      this.validLink = 0;
    }else{
      this.validLink = 1;
    }
  }

  validarCorreo() {
    if (/[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[a-zA-Z0-9]$/.test(this.institucionCorreo)) {
      this.validCorreo = 0;
    }else if(this.institucionCorreo==""){
      this.validCorreo = 1;
    }else {
      this.validCorreo = 2;
    }
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.criterioBusquedaRor="";
    this.filtroSelectInstitucionRor=0;
    this.update1=0;
    this.pageNumber=1;
    this.obtenerTodasInstituciones();
  }

  notFoudImage(){
    this.institucionImagenGuardada="";
  }

  cambiarPagina(event: any) {
    this.pageNumber = event;
    this.filtrarInstituciones(true,'');
  }


}

