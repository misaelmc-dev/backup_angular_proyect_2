import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class LineasInvestigacionService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Obtiene las líneas de investigación
   */
  get(ids?: Array<any>, idsProy?: Array<any>, idsInvestigador?: Array<any>, idsDisciplinas?: Array<any>,
      idsAreas?: Array<any>, idsInstSc?: Array<any>, idsRor?: Array<any>, soloConProyectInvest?: boolean,
      soloConProduct?: boolean, soloConCitas?: boolean, conDisciplina?: boolean, conArea?: boolean)
  {
    let endpoint = `${this.globals.backend_base_url}/lineas_investigacion?no_paginate=&test=0`
    if (ids)
      endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsProy)
      endpoint += `&idsProy=${encodeURIComponent(idsProy.join(' '))}`;
    if (idsInvestigador)
      endpoint += `&idsInvestigador=${encodeURIComponent(idsInvestigador.join(' '))}`;
    if (idsDisciplinas)
      endpoint += `&idsDisciplinas=${encodeURIComponent(idsDisciplinas.join(' '))}`;
    if (idsAreas)
      endpoint += `&idsAreas=${encodeURIComponent(idsAreas.join(' '))}`;
    if (idsInstSc)
      endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (idsRor)
      endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (soloConProyectInvest)
      endpoint += `&soloConProyectInvest=`;
    if (soloConProduct)
      endpoint += `&soloConProduct=`;
    if (soloConCitas)
      endpoint += `&soloConCitas=`;
    if (conDisciplina)
      endpoint += `&conDisciplina=`;
    if (conArea)
      endpoint += `&conArea=`;
    return this.http.get(endpoint)
  }

  getLines(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsProy?:any,
      idsInvestigador?:any,idsDisciplinas?:any,idsAreas?:any,idsInstSc?:any,idsRor?:any,
      soloConProyectInvest?:boolean,soloConProduct?:boolean,soloConCitas?:boolean,
      conDisciplina?:boolean,conArea?:boolean)
  {
    let endpoint = `${this.globals.backend_base_url}/lineas_investigacion?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsProy.length>0) endpoint += `&idsProy=${encodeURIComponent(idsProy.join(' '))}`;
    if (idsInvestigador.length>0) endpoint += `&idsInvestigador=${encodeURIComponent(idsInvestigador.join(' '))}`;
    if (idsDisciplinas.length>0) endpoint += `&idsDisciplinas=${encodeURIComponent(idsDisciplinas.join(' '))}`;
    if (idsAreas.length>0) endpoint += `&idsAreas=${encodeURIComponent(idsAreas.join(' '))}`;
    if (idsInstSc.length>0) endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (idsRor.length>0) endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (soloConProyectInvest) endpoint += `&soloConProyectInvest=`;
    if (soloConProduct) endpoint += `&soloConProduct=`;
    if (soloConCitas) endpoint += `&soloConCitas=`;
    if (conDisciplina) endpoint += `&conDisciplina=`;
    if (conArea) endpoint += `&conArea=`;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getAllLines(page?:number,pageSize?:number){
    return this.getLines(
      false,page,pageSize,'','','','','','',
      '','',false,false,false,false,
      false
    )
  }

  getLinesList(){
    return this.getLines(
      true,0,0,'','','','','','',
      '','',false,false,false,false,
      false
    )
  }

  getLinesByFilter(page?:number,pageSize?:number,search?:string,idsInstSc?:any){
    return this.getLines(
      false,page,pageSize,search,'','','','','',
      idsInstSc,'',false,false,false,false,
      false
    )
  }

  getLineById(ids:any){
    return this.getLines(
      true,0,0,'',ids,'','','','',
      '','',false,false,false,false,
      false
    )
  }


  addLine (nombreLinea:string,idDisciplina:number,idInstitucion:number){
    if(idInstitucion==0){idInstitucion=null}
    const ENDPOINT = `${this.globals.backend_base_url}/lineas_investigacion/create`
    return this.http.post(ENDPOINT,{nombre:nombreLinea,id_disciplina:idDisciplina,id_institucion:idInstitucion})
  }

  updateLine (idLinea:number,nombreLinea:string,idDisciplina:number,idInstitucion:number){
    if(idInstitucion==0){idInstitucion=null}
    const ENDPOINT = `${this.globals.backend_base_url}/lineas_investigacion/${idLinea}/update`
    return this.http.post(ENDPOINT,{nombre:nombreLinea,id_disciplina:idDisciplina,id_institucion:idInstitucion})
  }

  deleteLine (idLinea:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/lineas_investigacion/${idLinea}/delete`
    return this.http.delete(ENDPOINT)
  }

  getLinesByInvestigador(idInvestigador:number){
    let endpoint = `${this.globals.backend_base_url}/lineas_investigacion?no_paginate=&idsInvestigador=${idInvestigador}`
    return this.http.get(endpoint)
  }

  addLineToInvestigador(idInvest:number,idLinea:number){
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/lineainvestigacion/${idLinea}/asociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeLineToInvestigador(idInvest:number,idLinea:number){
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/lineainvestigacion/${idLinea}/desasociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

}
