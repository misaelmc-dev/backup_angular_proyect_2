import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class InstitutionScintraService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getInstituciones(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsRor?:any,idsContrato?:any,
    idsCampus?:any,idsColegios?:any,idsCentrosInvest?:any,idsCriteriosInst?:any,idsContactosInst?:any,
    idsCriteriosRankingInst?:any,idsInvestigador?:any,idsProysInvest?:any,idsProgEstud?:any,
    idsDominiosWeb?:any,idsTipsEvScicomIntern?:any,idsAlumnos?:any,idsRolesSc?:any,idsMetas?:any,
    idsAreasConoc?:any,idsDisciplinas?:any,idsLineasInvest?:any,soloConAlumnos?:boolean,
    soloSinAlumnos?:boolean,soloConAreasConoc?:boolean,soloSinAreasConoc?:boolean,soloConContratos?:boolean,
    soloSinContratos?:boolean,soloConCampus?:boolean,soloSinCampus?:boolean,soloConColegio?:boolean,
    soloSinColegio?:boolean,soloConCentro?:boolean,soloSinCentro?:boolean,soloConCriteriosInst?:boolean,
    soloSinCriteriosInst?:boolean,soloConCriteriosRanking?:boolean,soloSinCriteriosRanking?:boolean,
    soloConInvestigador?:boolean,soloSinInvestigador?:boolean,soloConProysInvest?:boolean,
    soloSinProysInvest?:boolean,soloConRor?:boolean,soloSinRor?:boolean,soloConProgEstud?:boolean,
    soloSinProgEstud?:boolean,soloConDominiosWeb?:boolean,soloSinDominiosWeb?:boolean,
    soloConTipsEvScicomInter?:boolean,soloSinTipsEvScicomInter?:boolean,soloConUserResources?:boolean,
    soloSinUserResources?:boolean,soloConRolesSc?:boolean,soloSinRolesSc?:boolean,soloConMetas?:boolean,
    soloSinMetas?:boolean,soloConDisciplinas?:boolean,soloSinDisciplinas?:boolean,soloConLineasInvest?:boolean,
    soloSinLineasInvest?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/instituciones?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsRor.length>0) endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (idsContrato.length>0) endpoint += `&idsContrato=${encodeURIComponent(idsContrato.join(' '))}`;
    if (idsCampus.length>0) endpoint += `&idsCampus=${encodeURIComponent(idsCampus.join(' '))}`;
    if (idsColegios.length>0) endpoint += `&idsColegios=${encodeURIComponent(idsColegios.join(' '))}`;
    if (idsCentrosInvest.length>0) endpoint += `&idsCentrosInvest=${encodeURIComponent(idsCentrosInvest.join(' '))}`;
    if (idsCriteriosInst.length>0) endpoint += `&idsCriteriosInst=${encodeURIComponent(idsCriteriosInst.join(' '))}`;
    if (idsContactosInst.length>0) endpoint += `&idsContactosInst=${encodeURIComponent(idsContactosInst.join(' '))}`;
    if (idsCriteriosRankingInst.length>0) endpoint += `&idsCriteriosRankingInst=${encodeURIComponent(idsCriteriosRankingInst.join(' '))}`;
    if (idsInvestigador.length>0) endpoint += `&idsInvestigador=${encodeURIComponent(idsInvestigador.join(' '))}`;
    if (idsProysInvest.length>0) endpoint += `&idsProysInvest=${encodeURIComponent(idsProysInvest.join(' '))}`;
    if (idsProgEstud.length>0) endpoint += `&idsProgEstud=${encodeURIComponent(idsProgEstud.join(' '))}`;
    if (idsDominiosWeb.length>0) endpoint += `&idsDominiosWeb=${encodeURIComponent(idsDominiosWeb.join(' '))}`;
    if (idsTipsEvScicomIntern.length>0) endpoint += `&idsTipsEvScicomIntern=${encodeURIComponent(idsTipsEvScicomIntern.join(' '))}`;
    if (idsAlumnos.length>0) endpoint += `&idsAlumnos=${encodeURIComponent(idsAlumnos.join(' '))}`;
    if (idsRolesSc.length>0) endpoint += `&idsRolesSc=${encodeURIComponent(idsRolesSc.join(' '))}`;
    if (idsMetas.length>0) endpoint += `&idsMetas=${encodeURIComponent(idsMetas.join(' '))}`;
    if (idsAreasConoc.length>0) endpoint += `&idsAreasConoc=${encodeURIComponent(idsAreasConoc.join(' '))}`;
    if (idsDisciplinas.length>0) endpoint += `&idsDisciplinas=${encodeURIComponent(idsDisciplinas.join(' '))}`;
    if (idsLineasInvest.length>0) endpoint += `&idsLineasInvest=${encodeURIComponent(idsLineasInvest.join(' '))}`;
    if (soloConAlumnos) endpoint += `&soloConAlumnos=`;
    if (soloSinAlumnos) endpoint += `&soloSinAlumnos=`;
    if (soloConAreasConoc) endpoint += `&soloConAreasConoc=`;
    if (soloSinAreasConoc) endpoint += `&soloSinAreasConoc=`;
    if (soloConContratos) endpoint += `&soloConContratos=`;
    if (soloSinContratos) endpoint += `&soloSinContratos=`;
    if (soloConCampus) endpoint += `&soloConCampus=`;
    if (soloSinCampus) endpoint += `&soloSinCampus=`;
    if (soloConColegio) endpoint += `&soloConColegio=`;
    if (soloSinColegio) endpoint += `&soloSinColegio=`;
    if (soloConCentro) endpoint += `&soloConCentro=`;
    if (soloSinCentro) endpoint += `&soloSinCentro=`;
    if (soloConCriteriosInst) endpoint += `&soloConCriteriosInst=`;
    if (soloSinCriteriosInst) endpoint += `&soloSinCriteriosInst=`;
    if (soloConCriteriosRanking) endpoint += `&soloConCriteriosRanking=`;
    if (soloSinCriteriosRanking) endpoint += `&soloSinCriteriosRanking=`;
    if (soloConInvestigador) endpoint += `&soloConInvestigador=`;
    if (soloSinInvestigador) endpoint += `&soloSinInvestigador=`;
    if (soloConProysInvest) endpoint += `&soloConProysInvest=`;
    if (soloSinProysInvest) endpoint += `&soloSinProysInvest=`;
    if (soloConRor) endpoint += `&soloConRor=`;
    if (soloSinRor) endpoint += `&soloSinRor=`;
    if (soloConProgEstud) endpoint += `&soloConProgEstud=`;
    if (soloSinProgEstud) endpoint += `&soloSinProgEstud=`;
    if (soloConDominiosWeb) endpoint += `&soloConDominiosWeb=`;
    if (soloSinDominiosWeb) endpoint += `&soloSinDominiosWeb=`;
    if (soloConTipsEvScicomInter) endpoint += `&soloConTipsEvScicomInter=`;
    if (soloSinTipsEvScicomInter) endpoint += `&soloSinTipsEvScicomInter=`;
    if (soloConUserResources) endpoint += `&soloConUserResources=`;
    if (soloSinUserResources) endpoint += `&soloSinUserResources=`;
    if (soloConRolesSc) endpoint += `&soloConRolesSc=`;
    if (soloSinRolesSc) endpoint += `&soloSinRolesSc=`;
    if (soloConMetas) endpoint += `&soloConMetas=`;
    if (soloSinMetas) endpoint += `&soloSinMetas=`;
    if (soloConDisciplinas) endpoint += `&soloConDisciplinas=`;
    if (soloSinDisciplinas) endpoint += `&soloSinDisciplinas=`;
    if (soloConLineasInvest) endpoint += `&soloConLineasInvest=`;
    if (soloSinLineasInvest) endpoint += `&soloSinLineasInvest=`;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getInstitutionsWidthStudents(page?:number,pageSize?:number,search?:string){
    return this.getInstituciones(
      false,page,pageSize,'','','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',true,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthStudentsByProg(page?:number,pageSize?:number,search?:string,idsProgEstud?:any) {
    return this.getInstituciones(
      false,page,pageSize,search,'','','','','', '',
      '','','','','', idsProgEstud,
      '','','','','','','',
      '',true,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthAreas(){
    return this.getInstituciones(
      true,0,0,'','','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,true,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthAreasByDisciplines(page?:number,pageSize?:number,search?:string,idsDisciplinas?:any){
    return this.getInstituciones(
      false,page,pageSize,search,'','','','','', '',
      '','','','','', '',
      '','','','','','',idsDisciplinas,
      '',false,false,true,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthCampusList(){
    return this.getInstituciones(
      true,0,0,'','','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,true,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthCampus(page?:number,pageSize?:number,search?:string){
    return this.getInstituciones(
      false,page,pageSize,search,'','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,true,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthCenters(){
    return this.getInstituciones(
      true,0,0,'','','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,true,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthCentersByShools(page?:number,pageSize?:number,search?:string,idsColegios?:any){
    return this.getInstituciones(
      false,page,pageSize,search,'','','','',idsColegios, '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,true,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthSchools(){
    return this.getInstituciones(
      true,0,0,'','','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,true,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthSchoolsByFilter(page?:number,pageSize?:number,search?:string,idsCampus?:any,
                                      idsCentrosInvest?:any,idsInvestigador?:any){
    return this.getInstituciones(
      false,page,pageSize,search,'','','',idsCampus,'',idsCentrosInvest,
      '','','',idsInvestigador,'', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,true,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsWidthDisciplines(){
    return this.getInstituciones(
      true,0,0,'','','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,true,false,
      false,false
    )
  }

  getInstitutionsWidthDisciplinesByAreas(page?:number,pageSize?:number,search?:string,idsAreasConoc?:any){
    return this.getInstituciones(
      false,page,pageSize,search,'','','','','', '',
      '','','','','', '',
      '','','','','',idsAreasConoc,'',
      '',false,false,true,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsScWidthInvest(){
    return this.getInstituciones(
      true,0,0,'','','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,true,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsScWidthLinesList(){
    return this.getInstituciones(
      true,0,0,'','','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      true,false
    )
  }

  getInstitutionsScWidthLines(page?:number,pageSize?:number,search?:string){
    return this.getInstituciones(
      false,page,pageSize,search,'','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      true,false
    )
  }

  getInstitutionsScList(page?:number,pageSize?:number,search?:string) {
    return this.getInstituciones(
      false,page,pageSize,search,'','','','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getAllInstitutionsSc() {
    let endpoint = `${this.globals.backend_base_url}/instituciones?no_paginate=`
    return this.http.get(endpoint)
  }

  getInstitutionsScByFilter2(page?:number,pageSize?:number,search?:string,idsRor?:any,
                            idsCampus?:any,idsColegios?:any,idsCentros?:any){
    return this.getInstituciones(
      false,page,pageSize,search,'',idsRor,'',idsCampus,idsColegios,idsCentros,
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,true,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsScByFilter(page?:number,pageSize?:number,search?:string,idRor?:any) {
    return this.getInstituciones(
      false,page,pageSize,search,'',idRor,'','','', '',
      '','','','','', '',
      '','','','','','','',
      '',false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false, false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false
    )
  }

  getInstitutionsScById(idInstitucion:number) {
    let endpoint = `${this.globals.backend_base_url}/instituciones?no_paginate=&ids=${idInstitucion}`
    return this.http.get(endpoint)
  }

  getProgramStudyWidthStudents() {
    let endpoint = `${this.globals.backend_base_url}/programasestudio?soloConAlumnos=&no_paginate=`
    return this.http.get(endpoint)
  }


  addInstitutionsSc(RazonSocial:string,RFC:string,DireccionFiscal:string,PersonaMoral:number,Correo:string,IdRor:string){
    const ENDPOINT = `${this.globals.backend_base_url}/instituciones/create`
    return this.http.post(ENDPOINT,{razon_social:RazonSocial,rfc:RFC,direccion_fiscal:DireccionFiscal,persona_moral:PersonaMoral,correo:Correo,id_ror:IdRor})
  }

  updateInstitutionsSc(idInst:number,RazonSocial:string,RFC:string,DireccionFiscal:string,PersonaMoral:number,Correo:string,IdRor:string,Website:string,Telefono:string){
    const endpoint = `${this.globals.backend_base_url}/instituciones/${idInst}/update`
    let formData = new FormData();
    formData.append('razon_social', RazonSocial.toString());
    formData.append('rfc', RFC.toString());
    formData.append('direccion_fiscal', DireccionFiscal.toString());
    formData.append('persona_moral', PersonaMoral.toString());
    formData.append('correo', Correo.toString());
    formData.append('id_ror', IdRor.toString());
    if(Website!==null && Website!=undefined){formData.append('website', Website.toString());}
    if(Telefono!==null && Telefono!=undefined){formData.append('phone', Telefono.toString());}
    return this.http.post(endpoint, formData)
  }

  deleteInstitutionsSc(idRor:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/instituciones/${idRor}/delete`
    return this.http.delete(ENDPOINT)
  }

  addPictureInstitution(idInstitucion:number,foto:any) {
    let ENDPOINT = `${this.globals.backend_base_url}/institucion/${idInstitucion}/subirfoto`;
    let formData = new FormData();
    formData.append('foto', foto);
    return this.http.post(ENDPOINT, formData);
  }

}

