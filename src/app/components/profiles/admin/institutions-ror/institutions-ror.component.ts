import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {InstitutionRorService} from "../../../../services/institution-ror.service";
import {CountriesService} from "../../../../services/countries.service";

@Component({
  selector: 'app-institutions-ror',
  templateUrl: './institutions-ror.component.html',
  styleUrls: ['./institutions-ror.component.css']
})
export class InstitutionsRorComponent implements OnInit {

  listaInstitucionesRor:any[]=[];
  listaInstitucionesRorTotal:any[]=[];
  listaPaises:any[]=[];

  criterioBusqueda:string="";
  filtroSelectConProyecto:boolean=false;
  filtroSelectConProducto:boolean=false;
  filtroSelectConCita:boolean=false;

  institucionId:number=0;
  institucionName:string="";
  institucionCity:string="";
  institucionState:string="";
  institucionCountry:string="";
  institucionLink:string="";
  institucionLatitud:string="";
  institucionLongitud:string="";
  institucionIdPais:number=0;
  institucionIdRor:string="";
  institucionIdRorGuardado:string="";
  institucionIdGrid:string="";
  institucionPais:any=[];

  validLink:number=0;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1:number = 1
  update2:number = 1
  update3:number = 1

  constructor(public institutionRorService: InstitutionRorService,
              public countriesService: CountriesService) { }

  ngOnInit(): void {
    this.obtenerTodasInstituciones();
    this.obtenerTodosPaises();
  }

  obtenerTodasInstituciones(){
    this.loadingCount++
    this.institutionRorService.getAllInstitutionsRor(this.pageNumber,this.pageSize).subscribe((resIns: any) => {
      this.loadingCount--
      this.listaInstitucionesRor=resIns.data;
      this.listaInstitucionesRorTotal=resIns.data;
      this.totalItems=resIns.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron las instituciones ROR del sistema'});
      console.error(err)
    });
  }

  obtenerTodosPaises(){
    this.loadingCount++
    this.countriesService.getAllCountries().subscribe((resPaises: any) => {
      this.loadingCount--
      this.listaPaises=resPaises;
      //console.log("listaPaises",resPaises);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los paises del sistema'});
      console.error(err)
    });
  }

  cambiarFiltroProyecto(event:boolean){
    this.filtroSelectConProyecto=event;
    this.update1++;
    this.filtrarInstituciones(false,'')
  }

  cambiarFiltroProducto(event:boolean){
    this.filtroSelectConProducto=event;
    this.update2++;
    this.filtrarInstituciones(false,'')
  }

  cambiarFiltroCita(event:boolean){
    this.filtroSelectConCita=event;
    this.update3++;
    this.filtrarInstituciones(false,'')
  }

  filtrarInstituciones(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(this.criterioBusqueda!="" || this.filtroSelectConProyecto || this.filtroSelectConProducto || this.filtroSelectConCita){
      this.loadingCount++
      this.institutionRorService.getInstitutionsByFilter(this.pageNumber,this.pageSize,this.criterioBusqueda,
        this.filtroSelectConProyecto,this.filtroSelectConProducto,this.filtroSelectConCita).subscribe((resInst: any) => {
        this.loadingCount--
        this.listaInstitucionesRor=resInst.data;
        this.totalItems=resInst.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron las instituciones ROR del sistema'});
        console.error(err)
      });
    }else{
      this.obtenerTodasInstituciones()
    }
  }

  abrirModalCrear(){
    this.institucionId=0;
    this.institucionName="";
    this.institucionCity="";
    this.institucionState="";
    this.institucionCountry="";
    this.institucionLink="";
    this.institucionLatitud="";
    this.institucionLongitud="";
    this.institucionIdPais=0;
    this.institucionIdRor="";
    this.institucionIdGrid="";
    this.institucionPais=[];
    this.validLink=0;
  }

  crear(){
    this.loadingCount++
    this.institutionRorService.addInstitutionsRor(this.institucionIdPais,this.institucionName).subscribe((creInst: any) => {
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
    this.institutionRorService.getInstitutionsRorById(idInst).subscribe((resInsti: any) => {
      this.loadingCount--
      this.abrirModalVer(resInsti);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo las institución ROR'});
      console.error(err)
    });
  }

  abrirModalVer(ror:any){
    this.institucionId=ror.id;
    this.institucionName=ror.institution_name;
    this.institucionCity=ror.city;
    this.institucionState=ror.state;
    this.institucionCountry=ror.country;
    this.institucionLink=ror.link;
    this.institucionLatitud=ror.latitud;
    this.institucionLongitud=ror.longitud;
    this.institucionIdPais=ror.id_pais;
    this.institucionIdRor=ror.id_ror;
    this.institucionIdGrid=ror.id_grid;
    this.institucionPais=ror.pais;
  }

  obtenerInstitucionActualizar(idInst:number){
    this.loadingCount++
    this.institutionRorService.getInstitutionsRorById(idInst).subscribe((resInstit: any) => {
      this.loadingCount--
      this.abrirModalActualizar(resInstit);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargo las institución ROR'});
      console.error(err)
    });
  }

  abrirModalActualizar(ror:any){
    this.institucionId=ror.id;
    this.institucionName=ror.institution_name;
    this.institucionCity=ror.city;
    this.institucionState=ror.state;
    this.institucionCountry=ror.country;
    this.institucionLink=ror.link;
    this.institucionLatitud=ror.latitud;
    this.institucionLongitud=ror.longitud;
    this.institucionIdPais=ror.id_pais;
    this.institucionIdRor=ror.id_ror;
    this.institucionIdRorGuardado=ror.id_ror;
    this.institucionIdGrid=ror.id_grid;
    this.institucionPais=ror.pais;
    this.validLink=0;
  }

  actualizar(){
    if(this.institucionIdRorGuardado==this.institucionIdRor){
      this.institucionIdRor="";
    }
    this.loadingCount++
    this.institutionRorService.updateInstitutionsRor(this.institucionId,this.institucionName,this.institucionIdPais,this.institucionCity,this.institucionState,this.institucionCountry,this.institucionLink,this.institucionLatitud,this.institucionLongitud,this.institucionIdRor).subscribe(() => {
      this.loadingCount--
      this.obtenerTodasInstituciones()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se actualizo la institución ROR'});
      console.error(err)
    });
  }

  eliminar(ror:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar la institución?',
      html: '<b>ID:</b> '+ror.id+'<br><b>Nombre:</b> "'+ror.institution_name+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.institutionRorService.deleteInstitutionsRor(ror.id).subscribe(() => {
          this.obtenerTodasInstituciones();
        })
      }
    });
  }

  validarNumeroCaracteres(cadena:string,numero:number){
    let validacion:string="";
    if(cadena && cadena.length>numero){
      validacion="is-invalid";
    }
    return validacion
  }

  validarLink(){
    const patronURL = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (patronURL.test(this.institucionLink)) {
      this.validLink = 0;
    }else{
      this.validLink = 1;
    }
  }

  cambiarPais(){
    if(this.institucionIdPais!=0){
      for(let lp of this.listaPaises){
        if(this.institucionIdPais==lp.ISO_3166_1_num){
          this.institucionCountry=lp.nombre;
        }
      }
    }else{
      this.institucionCountry=null;
    }
  }

  limpiarFiltros(){
    this.criterioBusqueda = "";
    this.filtroSelectConProyecto = false;
    this.filtroSelectConProducto = false;
    this.filtroSelectConCita = false;
    this.pageNumber = 1;
    this.update1 = 0;
    this.update2 = 0;
    this.update3 = 0;
    this.obtenerTodasInstituciones();
  }

  cambiarPagina(event: any) {
    this.pageNumber = event;
    this.filtrarInstituciones(true,'');
  }

}
