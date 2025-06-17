import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class DisciplinesService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getDiciplines(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,idsInstSc?:any,idsRor?:any,idsAreasConoc?:any,
                idsLineasInvest?:any,con_area?:any,soloConInstitucion?:boolean,soloSinInstitucion?:boolean,
                soloConAreasConoc?:boolean,soloSinAreasConoc?:boolean,soloSinLineasInvest?:boolean,
                soloConLineasInvest?:boolean) {
    let endpoint = `${this.globals.backend_base_url}/disciplinas?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (idsInstSc.length>0) endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (idsRor.length>0) endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (idsAreasConoc.length>0) endpoint += `&idsTrabScicom=${encodeURIComponent(idsAreasConoc.join(' '))}`;
    if (idsLineasInvest.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsLineasInvest.join(' '))}`;
    if (con_area) endpoint += `&con_area=`;
    if (soloConInstitucion) endpoint += `&soloConInstitucion=`;
    if (soloSinInstitucion) endpoint += `&soloSinInstitucion=`;
    if (soloConAreasConoc) endpoint += `&soloConAreasConoc=`;
    if (soloSinAreasConoc) endpoint += `&soloSinAreasConoc=`;
    if (soloSinLineasInvest) endpoint += `&soloSinLineasInvest=`;
    if (soloConLineasInvest) endpoint += `&soloConLineasInvest=`;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getAllDiciplines(page:number,pageSize:number){
    return this.getDiciplines(false,page,pageSize,'','','','',
      '',false,false,false,false,
      false,false,false)
  }

  getDiciplinesList(){
    return this.getDiciplines(true,0,0,'','','','',
      '',false,false,false,false,
      false,false,false)
  }

  getDisciplinesWithAreas(){
    return this.getDiciplines(true,0,0,'','','','','',
      true,false,false,true,false,
      false,false)
  }

  getDisciplinesWithAreasByInstitucion(page?:number,pageSize?:number,search?:string,idsInstSc?:any){
    return this.getDiciplines(false,page,pageSize,search,idsInstSc,'','','',
      false,false,false,true,false,
      false,false)
  }

  getDiciplinesByFilter(page:number,pageSize:number,search:string,idsInstSc:any,idsAreasConoc:any){
    return this.getDiciplines(false,page,pageSize,search,idsInstSc,'',idsAreasConoc,'',
      true,false,false,false,false,
      false,false)
  }

  addDiscipline(nombreDisciplina:string,idInstitucion:number){
    let data = new FormData();
    data.append('nombre',nombreDisciplina.toString());
    if(idInstitucion){ data.append('id_institucion',idInstitucion.toString()); }
    const ENDPOINT = `${this.globals.backend_base_url}/disciplinas/create`
    return this.http.post(ENDPOINT,data)
  }

  updateDiscipline(idDisciplina:number,nombreDisciplina:string,idArea:number,idInstitucion:number){
    let data = new FormData();
    data.append('nombre',nombreDisciplina.toString());
    if(idArea){ data.append('id_area',idArea.toString()); }
    if(idInstitucion){ data.append('id_institucion',idInstitucion.toString()); }
    const ENDPOINT = `${this.globals.backend_base_url}/disciplinas/${idDisciplina}/update`
    return this.http.post(ENDPOINT,data)
  }

  deleteDiscipline(idDisciplina:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/disciplinas/${idDisciplina}/delete`
    return this.http.delete(ENDPOINT)
  }

}
