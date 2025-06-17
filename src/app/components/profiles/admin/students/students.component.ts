import { Component, OnInit } from '@angular/core';
import { toNumber } from "lodash";
import Swal from "sweetalert2";
import {StudentsService} from "../../../../services/students.service";
import {InstitutionScintraService} from "../../../../services/institution-scintra.service";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  listaAlumnos:any[]=[];
  listaAlumnosTotal:any[]=[];
  listaProgramaEstudios:any[]=[];
  listaProgramaEstudiosTotal:any[]=[];
  listaInstituciones:any[]=[];
  listaInstitucionesTotal:any[]=[];

  infoAlumnoConsultado:any[]=[];

  alumnoId:number=0;
  alumnoNombre:string="";
  alumnoNumero:any="";
  alumnoPrograma:number=0;
  alumnoInstitucion:number=0;

  obligatorioInstitucion:boolean=false;

  criterioBusqueda:string="";
  filtroSelectInstitucion:number=0;
  filtroSelectPrograma:number=0;
  filtroSelectProyectInvest:boolean=false;

  pageNumber:number=1;
  pageSize:number=10;
  totalItems:number=0;

  loadingCount: number = 0;

  update1:number = 1
  update2:number = 1
  update3:number = 1

  constructor(public studentsService: StudentsService,
              public institutionService: InstitutionScintraService) { }

  ngOnInit(): void {
    this.obtenerTodosAlumnos()
    this.obtenerTodosInstituciones()
    this.obtenerTodosProgramasEstudio()
  }

  obtenerTodosAlumnos(){
    this.loadingCount++
    this.studentsService.getAllStudents(this.pageNumber,this.pageSize).subscribe((resAlum: any) => {
      this.loadingCount--
      this.listaAlumnos=resAlum.data;
      this.listaAlumnosTotal=resAlum.data;
      this.totalItems=resAlum.total;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los alumnos'});
      console.error(err)
    });
  }

  obtenerTodosInstituciones(){
    this.loadingCount++
    this.institutionService.getInstitutionsWidthStudents(this.pageNumber,this.pageSize).subscribe((resInst: any) => {
      this.loadingCount--
      this.listaInstituciones=resInst.data;
      this.listaInstitucionesTotal=resInst.data;
      //console.log("start",this.listaInstitucionesTotal)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los alumnos'});
      console.error(err)
    });
  }

  obtenerTodosProgramasEstudio(){
    this.loadingCount++
    this.institutionService.getProgramStudyWidthStudents().subscribe((resProg: any) => {
      this.loadingCount--
      this.listaProgramaEstudios=resProg;
      this.listaProgramaEstudiosTotal=resProg;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los alumnos'});
      console.error(err)
    });
  }

  filtroDataLoadInstituciones = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                    loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxPrograma:any = []; if(this.filtroSelectPrograma!=0){ auxPrograma = [this.filtroSelectPrograma] }
    this.institutionService.getInstitutionsWidthStudentsByProg(currentPage,pageSize,searchTerm,
      auxPrograma).subscribe((resInst: any) => {
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
    this.filtrarAlumnos(false,'');
    this.update2++;
    this.update1++;
  }

  filtroDataLoadProgramasEstudios = (pageSize: number, currentPage: number, searchTerm: string, lista: any[],
                    loadingItems: boolean[], totalItems: number[]) =>
  {
    var auxInst:any = []; if(this.filtroSelectInstitucion!=0){ auxInst = [this.filtroSelectInstitucion] }
    this.studentsService.getProgramStudyWidthStudentsByInst(currentPage,pageSize,searchTerm,
      auxInst).subscribe((resProg: any) => {
      for (let item of resProg.data){ lista.push({"id":item.id,"texto":item.nombre}); }
      totalItems.splice(0, totalItems.length);
      totalItems.push(resProg.total);
      loadingItems.splice(0, loadingItems.length).push(false);
    }, (err:any) =>{
      loadingItems.splice(0, loadingItems.length).push(false);
      //Swal.fire({icon: 'error',text: 'No se cargaron los Programas Estudios'});
      console.error(err)
    });
  }

  recuperarSeleccionFiltroProgramasEstudios(event:number){
    this.filtroSelectPrograma = event;
    this.filtrarAlumnos(false,'');
    this.update2++;
    this.update1++;
  }

  cambiarFiltroProyectos(event:boolean){
    this.filtroSelectProyectInvest=event;
    this.update3++;
    this.filtrarAlumnos(false,'')
  }

  filtrarAlumnos(cambiarPagina?:boolean,filtro?:string){
    if(!cambiarPagina){
      this.pageNumber=1;
      this.pageSize=10;
    }
    if(this.criterioBusqueda!="" ||
      this.filtroSelectInstitucion>0 ||
      this.filtroSelectPrograma>0 ||
      this.filtroSelectProyectInvest)
    {
      let auxSelectInstitucion:any=[];
      let auxSelectPrograma:any=[];
      if(this.filtroSelectInstitucion>0){auxSelectInstitucion=[this.filtroSelectInstitucion]}
      if(this.filtroSelectPrograma>0){auxSelectPrograma=[this.filtroSelectPrograma]}
      this.loadingCount++
      this.studentsService.getStudentsByFilters(this.pageNumber,this.pageSize,this.criterioBusqueda,
        auxSelectInstitucion,auxSelectPrograma,this.filtroSelectProyectInvest).subscribe((resAlumFilt: any) => {
        this.loadingCount--
        this.listaAlumnos=resAlumFilt.data;
        this.totalItems=resAlumFilt.total;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'No se cargaron los alumnos'});
        console.error(err)
      });
    }else{
      this.obtenerTodosAlumnos();
    }
  }

  filtrarProgramas(){
    let idIndtitucion:number = 0;
    if(this.alumnoInstitucion==0){ idIndtitucion=null; }else{ idIndtitucion=toNumber(this.alumnoInstitucion); }
    //console.log("idIndtitucion",idIndtitucion);
    this.listaProgramaEstudios = this.listaProgramaEstudiosTotal.filter(item => item.id_institucion === idIndtitucion)
    //console.log("this.listaDisiplinas",this.listaDisiplinas);
  }

  verInfoAlumno(idAlumno:number){
    this.alumnoId=0;
    this.alumnoNombre="";
    this.alumnoNumero=0;
    this.alumnoPrograma=0;
    this.alumnoInstitucion=0;
    this.infoAlumnoConsultado=[];
    let auxAlumno:any=[];
    if(this.filtroSelectInstitucion!=0){auxAlumno=[idAlumno]}
    this.loadingCount++
    this.studentsService.getStudentById(auxAlumno).subscribe((resAlumCon: any) => {
      this.loadingCount--
      this.infoAlumnoConsultado=resAlumCon;
      this.abrirModalVer();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cargaron los datos del alumno'});
      console.error(err)
    });
  }

  abrirModalVer(){
    this.alumnoId=this.infoAlumnoConsultado[0].id;
    this.alumnoNombre=this.infoAlumnoConsultado[0].nombre;
    this.alumnoNumero=this.infoAlumnoConsultado[0].num_alumno;
    this.alumnoPrograma=this.infoAlumnoConsultado[0].id_programa;
    this.alumnoInstitucion=this.infoAlumnoConsultado[0].id_institucion;
  }

  abrirModalCrear(){
    this.alumnoId=0;
    this.alumnoNombre="";
    this.alumnoNumero="";
    this.alumnoInstitucion=0;
    this.alumnoPrograma=0;
    this.listaProgramaEstudios = this.listaProgramaEstudiosTotal.filter(item => item.id_institucion === null)
  }

  crearAlumno(){
    this.loadingCount++
    this.studentsService.addStudent(this.alumnoNombre,this.alumnoInstitucion).subscribe((resCreate) => {
      this.loadingCount--
      //console.log("resCreate",resCreate);
      this.actualizarAlumno(toNumber(resCreate));
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo crear el alumno'});
      console.error(err)
    });
  }

  abrirModalActualizar(ll:any){
    this.alumnoId = ll.id;
    this.alumnoNombre = ll.nombre;
    this.alumnoNumero = ll.num_alumno;
    if(ll.id_institucion !== null ){
      this.alumnoInstitucion = ll.id_institucion;
      this.listaProgramaEstudios = this.listaProgramaEstudiosTotal.filter(item => item.id_institucion === ll.id_institucion)
      this.obligatorioInstitucion = true;
    }else{
      this.alumnoInstitucion = 0;
      this.listaProgramaEstudios = this.listaProgramaEstudiosTotal.filter(item => item.id_institucion === null)
      this.obligatorioInstitucion = false;
    }
    if(ll.id_programa !== null ){
      this.alumnoPrograma = ll.id_programa;
    }else{
      this.alumnoPrograma = 0;
    }
  }

  actualizarAlumno(idAlumno?:number){
    if(idAlumno!=0 && idAlumno!==undefined){this.alumnoId = idAlumno}
    this.loadingCount++
    this.studentsService.updateStudent (this.alumnoId,this.alumnoNombre,this.alumnoNumero,this.alumnoPrograma).subscribe(() => {
      this.loadingCount--
      this.obtenerTodosAlumnos();
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se pudo actualizar el alumno'});
      console.error(err)
    });
  }

  eliminarAlumno(ll:any){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el alumno?',
      html: '<b>ID:</b> '+ll.id+'<br><b>Nombre:</b> "'+ll.nombre+'"',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed){
        this.studentsService.deleteStudent(ll.id).subscribe(() => {
          this.obtenerTodosAlumnos();
        })
      }
    });
  }

  limpiarFiltros(){
    this.filtroSelectInstitucion=0;
    this.filtroSelectPrograma=0;
    this.criterioBusqueda="";
    this.update1 = 0;
    this.update2 = 0;
    this.update3 = 0;
    this.pageNumber=1;
    this.obtenerTodosAlumnos();
  }

  cambiarPagina(event: any) {
    this.pageNumber = event;
    this.filtrarAlumnos(true,'');
  }

}
