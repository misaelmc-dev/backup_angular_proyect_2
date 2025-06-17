import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class KnowledgeAreasService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getAreas(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInstSc?:any,idsDisciplina?:any,
           idsRor?:any,idsTrabScicom?:any,idsEvento?:any,soloConInstituciones?:boolean,soloSinInstituciones?:boolean,
           soloConDisciplinas?:boolean,soloSinDisciplinas?:boolean,soloConTrabScicom?:boolean,soloSinTrabScicom?:boolean,
           soloConEventosScicom?:boolean,soloSinEventosScicom?:boolean) {
    let endpoint = `${this.globals.backend_base_url}/areas_conocimiento?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInstSc.length>0) endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (idsDisciplina.length>0) endpoint += `&idsDisciplina=${encodeURIComponent(idsDisciplina.join(' '))}`;
    if (idsRor.length>0) endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (idsTrabScicom.length>0) endpoint += `&idsTrabScicom=${encodeURIComponent(idsTrabScicom.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (soloConInstituciones) endpoint += `&soloConInstituciones=`;
    if (soloSinInstituciones) endpoint += `&soloSinInstituciones=`;
    if (soloConDisciplinas) endpoint += `&soloConDisciplinas=`;
    if (soloSinDisciplinas) endpoint += `&soloSinDisciplinas=`;
    if (soloConTrabScicom) endpoint += `&soloConTrabScicom=`;
    if (soloSinTrabScicom) endpoint += `&soloSinTrabScicom=`;
    if (soloConEventosScicom) endpoint += `&soloConEventosScicom=`;
    if (soloSinEventosScicom) endpoint += `&soloSinEventosScicom=`;
    return this.http.get(endpoint)
  }

  getAllAreas(no_paginate?:boolean,page?:number,pageSize?:number) {
    return this.getAreas(false,page,pageSize,'','','','','','',
      '',false,false,false,false,false,
      false,false,false)
  }

  getAreasByFilter(page?:number,pageSize?:number,search?:string,idsInstSc?:any,idsDisciplina?:any) {
    return this.getAreas(false,page,pageSize,search,'',idsInstSc,idsDisciplina,'','',
      '',false,false,false,false,false,
      false,false,false)
  }

  getAreaById(ids:any){
    return this.getAreas(true,0,0,'',ids,'','','','',
      '',false,false,false,false,false,
      false,false,false)
  }

  getAreasWidthDisciplines() {
    return this.getAreas(true,0,0,'','','','','','',
      '',false,false,true,false,false,
      false,false,false)
  }

  getAreasWidthDisciplinesByInst(page?:number,pageSize?:number,search?:string,idsInstSc?:any) {
    return this.getAreas(false,page,pageSize,search,'',idsInstSc,'','','',
      '',false,false,true,false,false,
      false,false,false)
  }

  addArea(nombreArea:string,idInstitucion:number){
    let datos = new FormData();
    datos.append('nombre',nombreArea.toString());
    if(idInstitucion!=0){ datos.append('id_institucion',idInstitucion.toString());}
    const ENDPOINT = `${this.globals.backend_base_url}/areas_conocimiento/create`
    return this.http.post(ENDPOINT,datos)
  }

  updateArea (idArea:number,nombreArea:string,idInstitucion?:number){
    let datos = new FormData();
    datos.append('nombre',nombreArea.toString());
    if(idInstitucion!=0){ datos.append('id_institucion',idInstitucion.toString());}
    const ENDPOINT = `${this.globals.backend_base_url}/areas_conocimiento/${idArea}/update`
    return this.http.post(ENDPOINT,datos)
  }

  deleteArea (idArea:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/areas_conocimiento/${idArea}/delete`
    return this.http.delete(ENDPOINT)
  }
}
