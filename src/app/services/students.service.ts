import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getStudents(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInstSc?:any,numsAlum?:any,
              idsProgEst?:any,soloConProyectInvest?:boolean,soloConProgDeEst?:boolean,soloSinProgDeEst?:boolean) {
    let endpoint = `${this.globals.backend_base_url}/alumnos?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInstSc.length>0) endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (numsAlum.length>0) endpoint += `&numsAlum=${encodeURIComponent(numsAlum.join(' '))}`;
    if (idsProgEst.length>0) endpoint += `&idsProgEst=${encodeURIComponent(idsProgEst.join(' '))}`;
    if (soloConProyectInvest) endpoint += `&soloConProyectInvest=`;
    if (soloConProgDeEst) endpoint += `&soloConProgDeEst=`;
    if (soloSinProgDeEst) endpoint += `&soloSinProgDeEst=`;
    return this.http.get(endpoint)
  }

  getAllStudents(page?:number,pageSize?:number,search?:string){
    return this.getStudents(false,page,pageSize,search,0,0,'','',
      false,false,false);
  }

  getStudentsByFilters(page?:number,pageSize?:number,search?:string,idsInstSc?:any,idsProgEst?:any,soloConProyectInvest?:boolean) {
    return this.getStudents(false,page,pageSize,search,'',idsInstSc,'',idsProgEst,
      soloConProyectInvest,false,false);
  }

  getStudentById(ids:any){
    return this.getStudents(true,0,0,'',ids,0,'','',
      false,false,false);
  }

  getProgramStudy(no_paginate?:boolean, page?:number,pageSize?:number,search?:string,ids?:any,idsInst?:any,
                  nivsIntInst?:any,idsRor?:any,idsAlum?:any,idsAutTrab?:any,soloConAlumnos?:boolean,
                  soloSinAlumnos?:boolean,soloConInstituciones?:boolean,soloSinInstituciones?:boolean,
                  soloConAutTrab?:boolean,soloSinAutTrab?:boolean) {
    let endpoint = `${this.globals.backend_base_url}/programasestudio?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInst) endpoint += `&idsInst=${encodeURIComponent(idsInst.join(' '))}`;
    if (nivsIntInst) endpoint += `&nivsIntInst=${encodeURIComponent(nivsIntInst.join(' '))}`;
    if (idsRor) endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (idsAlum) endpoint += `&idsAlum=${encodeURIComponent(idsAlum.join(' '))}`;
    if (idsAutTrab) endpoint += `&idsAutTrab=${encodeURIComponent(idsAutTrab.join(' '))}`;
    if (soloConAlumnos) endpoint += `&soloConAlumnos=`;
    if (soloSinAlumnos) endpoint += `&soloSinAlumnos=`;
    if (soloConInstituciones) endpoint += `&soloConInstituciones=`;
    if (soloSinInstituciones) endpoint += `&soloSinInstituciones=`;
    if (soloConAutTrab) endpoint += `&soloConAutTrab=`;
    if (soloSinAutTrab) endpoint += `&soloSinAutTrab=`;
    return this.http.get(endpoint)
  }

  getProgramStudyWidthStudents(page?:number,pageSize?:number,search?:string){
    return this.getProgramStudy(false,page,pageSize,search,'','','','',
      '', '',true,false,false,false,
      false,false)
  }

  getProgramStudyWidthStudentsByInst(page?:number,pageSize?:number,search?:string,idsInst?:any){
    return this.getProgramStudy(false,page,pageSize,search,'',idsInst,'','',
      '', '',true,false,false,false,
      false,false)
  }


  addStudent (nombreAlumno:string,idInstitucion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/alumnos/create`
    return this.http.post(ENDPOINT,{nombre:nombreAlumno,id_institucion:idInstitucion})
  }

  updateStudent (idAlumno:number,nombreAlumno:string,numeroAlumno?:any,idPrograma?:number){
    let datos = new FormData();
    datos.append('nombre',nombreAlumno.toString());
    if(numeroAlumno!=0 && numeroAlumno!="" && numeroAlumno!==null){ datos.append('num_alumno',numeroAlumno.toString());}
    if(idPrograma!=0){ datos.append('id_programa',idPrograma.toString());}
    const ENDPOINT = `${this.globals.backend_base_url}/alumnos/${idAlumno}/update`
    return this.http.post(ENDPOINT,datos)
  }

  deleteStudent (idAlumno:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/alumnos/${idAlumno}/delete`
    return this.http.delete(ENDPOINT)
  }

}
