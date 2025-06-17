import {Component,OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {LanguagesService} from "../../../../services/languages.service";

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesComponent implements OnInit {

  listaIdiomas:any[]=[];
  listaIdiomasTotal:any[]=[];

  idiomaConsultado:any[]=[];

  idiomaId:number=0;
  idiomaNombre:string="";
  idiomaCodigo:string="";

  criterioBusqueda:string="";

  pageNumber:number = 1;

  loadingCount: number = 0;

  constructor(public languagesService: LanguagesService) { }

  ngOnInit(): void {
    this.obtenerTodosIdiomas();
  }

  obtenerTodosIdiomas(){
    this.loadingCount++
    this.languagesService.getAllLanguages().subscribe((resLanguage: any) => {
      this.loadingCount--
      this.listaIdiomas=resLanguage;
      this.listaIdiomasTotal=resLanguage;
      this.pageNumber=1;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los idiomas del sistema'});
      console.error(err)
    });
  }

  filtrarIdiomas(){
    this.loadingCount++
    this.languagesService.getLanguagesByFilter(this.criterioBusqueda).subscribe((resLanguage: any) => {
      this.loadingCount--
      this.listaIdiomas=resLanguage;
      this.listaIdiomasTotal=resLanguage;
      this.pageNumber=1;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los idiomas del sistema'});
      console.error(err)
    });
  }

  consultar(objeto:any){
    this.loadingCount++
    this.languagesService.getLanguagesById([objeto.id]).subscribe((resLang: any) => {
      this.loadingCount--
      this.idiomaConsultado=resLang;
      this.abrirModalconsultar();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los idiomas del sistema'});
      console.error(err)
    });
  }

  abrirModalconsultar(){
    this.idiomaId=this.idiomaConsultado[0].id;
    this.idiomaNombre=this.idiomaConsultado[0].nombre;
    this.idiomaCodigo=this.idiomaConsultado[0].id_639_1;
  }

  abrirModalCrear(){
    this.idiomaId=0;
    this.idiomaNombre="";
    this.idiomaCodigo="";
  }

  crear(){
    this.loadingCount++
    this.languagesService.addLanguage(this.idiomaNombre,this.idiomaCodigo).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosIdiomas();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el idioma'});
      console.error(err)
    });
  }

  abrirModalActualizar(objeto:any){
    this.idiomaId=objeto.id;
    this.idiomaNombre=objeto.nombre;
    this.idiomaCodigo=objeto.id_639_1;
  }

  actualizar(){
    this.loadingCount++
    this.languagesService.updateLanguage(this.idiomaId,this.idiomaNombre,this.idiomaCodigo).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosIdiomas();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el idioma'});
      console.error(err)
    });
  }

  eliminar(objeto:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el idioma?',
      html: ' "' + objeto.nombre + '"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.languagesService.deleteLanguage(objeto.id).subscribe(() => {
          this.obtenerTodosIdiomas();
        })
      }
    });
  }

  limpiarFiltros(){
    this.pageNumber=1;
    this.criterioBusqueda="";
    this.obtenerTodosIdiomas();
  }

}

