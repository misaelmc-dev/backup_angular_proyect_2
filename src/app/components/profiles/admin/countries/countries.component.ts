import {Component,OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {CountriesService} from "../../../../services/countries.service";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  listaPaises:any[]=[];
  listaPaisesTotal:any[]=[];

  paisId:any="";
  paisNombre:string="";
  paisCodigo:string="";

  numeroValidado:boolean=false;
  codigoValidado:boolean=false;

  criterioBusqueda:string="";

  pageNumber:number = 1;

  loadingCount: number = 0;

  constructor(public countriesService: CountriesService) { }

  ngOnInit(): void {
    this.obtenerTodosPaises()
  }

  obtenerTodosPaises(){
    this.loadingCount++
    this.countriesService.getAllCountries().subscribe((resCountry: any) => {
      this.loadingCount--
      this.listaPaises=resCountry;
      this.listaPaisesTotal=resCountry;
      this.pageNumber=1;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los países del sistema'});
      console.error(err)
    });
  }

  filtrarPaises(){
    this.loadingCount++
    this.countriesService.getCountryByFilter(this.criterioBusqueda).subscribe((resCountry: any) => {
      this.loadingCount--
      this.listaPaises=resCountry;
      this.pageNumber=1;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los idiomas del sistema'});
      console.error(err)
    });
  }

  consultar(objeto:any){
    this.paisId=objeto.ISO_3166_1_num;
    this.paisNombre=objeto.nombre;
    this.paisCodigo=objeto.ISO_3166_1_alfa2;
  }

  abrirModalCrear(){
    this.paisId="";
    this.paisNombre="";
    this.paisCodigo="";
    this.numeroValidado=false;
    this.codigoValidado=false;
  }

  crear(){
    this.loadingCount++
    this.countriesService.addCountry(this.paisId,this.paisNombre,this.paisCodigo).subscribe((resSchoolAdd) => {
      this.loadingCount--
      this.obtenerTodosPaises();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el país'});
      console.error(err)
    });
  }

  abrirModalActualizar(objeto:any){
    this.paisId=objeto.ISO_3166_1_num;
    this.paisNombre=objeto.nombre;
    this.paisCodigo=objeto.ISO_3166_1_alfa2;
    this.numeroValidado=false;
    this.codigoValidado=false;
  }

  actualizar(){
    this.loadingCount++
    this.countriesService.updateCountry(this.paisId,this.paisNombre,this.paisCodigo).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosPaises();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el país'});
      console.error(err)
    });
  }

  eliminar(objeto:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el país?',
      html: ' "' + objeto.nombre + '"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.countriesService.deleteCountry(objeto.ISO_3166_1_num).subscribe(() => {
          this.obtenerTodosPaises();
        })
      }
    });
  }

  validarNumero(){
    this.numeroValidado=false;
    for(let lpt of this.listaPaisesTotal){
      if(lpt.ISO_3166_1_num==this.paisId){ this.numeroValidado=true; }
    }
  }

  validarCodigo(){
    this.codigoValidado=false;
    for(let lpt of this.listaPaisesTotal){
      if(lpt.ISO_3166_1_alfa2==this.paisCodigo){ this.codigoValidado=true; }
    }
  }

  limpiarFiltros(){
    this.criterioBusqueda="";
    this.pageNumber=1;
    this.obtenerTodosPaises();
  }
}


