import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class EventListService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getEvents(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInst?:any
    ,idsTipEv?:any,idsEstEv?:any,idsRorEd?:any,idsModalidad?:any,idsColegios?:any,idsTipNotif?:any
    ,idsTipAct?:any,idsTipPresent?:any,idsCentInvest?:any,idsCampus?:any,idsArConoc?:any
    ,idsTipTrab?:any,idsTipEval?:any,idsTipPago?:any,idsUsers?:any,idsContacto?:any,idsAprends?:any
    ,idsObjInd?:any,idsRolScicom?:any,idsUsuScicom?:any,idsPatrocdor?:any,idsPatroc?:any
    ,idsPago?:any,idsEval?:any,idsArch?:any,idsRangTiemp?:any,idsTipPart?:any,idsOds?:any
    ,soloConTipoEvento?:boolean,soloSinTipoEvento?:boolean,soloConEstatusEvento?:boolean
    ,soloSinEstatusEvento?:boolean,soloConRorEdit?:boolean,soloSinRorEdit?:boolean
    ,soloConModalidad?:boolean,soloSinModalidad?:boolean,soloConColegio?:boolean
    ,soloSinColegio?:boolean,soloConCampus?:boolean,soloSinCampus?:boolean
    ,soloConCentroInvest?:boolean,soloSinCentroInvest?:boolean,soloConAreaConoc?:boolean
    ,soloSinAreaConoc?:boolean,soloConODS?:boolean,soloSinODS?:boolean
    ,soloConTipoActividad?:boolean,soloSinTipoActividad?:boolean,soloConTipoPresentacion?:boolean
    ,soloSinTipoPresentacion?:boolean,soloConTipoTrab?:boolean,soloSinTipoTrab?:boolean
    ,soloConTipoPago?:boolean,soloSinTipoPago?:boolean,soloConTipoNotif?:boolean
    ,soloSinTipoNotif?:boolean,soloConTipoEval?:boolean,soloSinTipoEval?:boolean
    ,soloConUser?:boolean,soloSinUser?:boolean,soloConInstScintra?:boolean
    ,soloSinInstScintra?:boolean,conRorsEdit?:boolean,conMods?:boolean
    ,conColegs?:boolean,conTipNotif?:boolean,conTipAct?:boolean
    ,conTipPre?:boolean,conCenInv?:boolean,conCamp?:boolean
    ,conArConoc?:boolean,conTipTra?:boolean,conTipEv?:boolean
    ,conTipPag?:boolean,conTipPart?:boolean,conOds?:boolean
    ,incluir?:string,ordenar?:string
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/eventos?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&id=${encodeURIComponent(ids.join(' '))}`;
    if (idsInst.length>0) endpoint += `&idInst=${encodeURIComponent(idsInst.join(' '))}`;
    if (idsTipEv.length>0) endpoint += `&idsTipEv=${encodeURIComponent(idsTipEv.join(' '))}`;
    if (idsEstEv.length>0) endpoint += `&idsEstEv=${encodeURIComponent(idsEstEv.join(' '))}`;
    if (idsRorEd.length>0) endpoint += `&idsRorEd=${encodeURIComponent(idsRorEd.join(' '))}`;
    if (idsModalidad.length>0) endpoint += `&idsModalidad=${encodeURIComponent(idsModalidad.join(' '))}`;
    if (idsColegios.length>0) endpoint += `&idsColegios=${encodeURIComponent(idsColegios.join(' '))}`;
    if (idsTipNotif.length>0) endpoint += `&idsTipNotif=${encodeURIComponent(idsTipNotif.join(' '))}`;
    if (idsTipAct.length>0) endpoint += `&idsTipAct=${encodeURIComponent(idsTipAct.join(' '))}`;
    if (idsTipPresent.length>0) endpoint += `&idsTipPresent=${encodeURIComponent(idsTipPresent.join(' '))}`;
    if (idsCentInvest.length>0) endpoint += `&idsCentInvest=${encodeURIComponent(idsCentInvest.join(' '))}`;
    if (idsCampus.length>0) endpoint += `&idsCampus=${encodeURIComponent(idsCampus.join(' '))}`;
    if (idsArConoc.length>0) endpoint += `&idsArConoc=${encodeURIComponent(idsArConoc.join(' '))}`;
    if (idsTipTrab.length>0) endpoint += `&idsTipTrab=${encodeURIComponent(idsTipTrab.join(' '))}`;
    if (idsTipEval.length>0) endpoint += `&idsTipEval=${encodeURIComponent(idsTipEval.join(' '))}`;
    if (idsTipPago.length>0) endpoint += `&idsTipPago=${encodeURIComponent(idsTipPago.join(' '))}`;
    if (idsUsers.length>0) endpoint += `&idsUsers=${encodeURIComponent(idsUsers.join(' '))}`;
    if (idsContacto.length>0) endpoint += `&idsContacto=${encodeURIComponent(idsContacto.join(' '))}`;
    if (idsAprends.length>0) endpoint += `&idsAprends=${encodeURIComponent(idsAprends.join(' '))}`;
    if (idsObjInd.length>0) endpoint += `&idsObjInd=${encodeURIComponent(idsObjInd.join(' '))}`;
    if (idsRolScicom.length>0) endpoint += `&idsRolScicom=${encodeURIComponent(idsRolScicom.join(' '))}`;
    if (idsUsuScicom.length>0) endpoint += `&idsUsuScicom=${encodeURIComponent(idsUsuScicom.join(' '))}`;
    if (idsPatrocdor.length>0) endpoint += `&idsPatrocdor=${encodeURIComponent(idsPatrocdor.join(' '))}`;
    if (idsPatroc.length>0) endpoint += `&idsPatroc=${encodeURIComponent(idsPatroc.join(' '))}`;
    if (idsPago.length>0) endpoint += `&idsPago=${encodeURIComponent(idsPago.join(' '))}`;
    if (idsEval.length>0) endpoint += `&idsEval=${encodeURIComponent(idsEval.join(' '))}`;
    if (idsArch.length>0) endpoint += `&idsArch=${encodeURIComponent(idsArch.join(' '))}`;
    if (idsRangTiemp.length>0) endpoint += `&idsRangTiemp=${encodeURIComponent(idsRangTiemp.join(' '))}`;
    if (idsTipPart.length>0) endpoint += `&idsTipPart=${encodeURIComponent(idsTipPart.join(' '))}`;
    if (idsOds.length>0) endpoint += `&idsOds=${encodeURIComponent(idsOds.join(' '))}`;
    if (soloConTipoEvento) endpoint += `&soloConTipoEvento=`;
    if (soloSinTipoEvento) endpoint += `&soloSinTipoEvento=`;
    if (soloConEstatusEvento) endpoint += `&soloConEstatusEvento=`;
    if (soloSinEstatusEvento) endpoint += `&soloSinEstatusEvento=`;
    if (soloConRorEdit) endpoint += `&soloConRorEdit=`;
    if (soloSinRorEdit) endpoint += `&soloSinRorEdit=`;
    if (soloConModalidad) endpoint += `&soloConModalidad=`;
    if (soloSinModalidad) endpoint += `&soloSinModalidad=`;
    if (soloConColegio) endpoint += `&soloConColegio=`;
    if (soloSinColegio) endpoint += `&soloSinColegio=`;
    if (soloConCampus) endpoint += `&soloConCampus=`;
    if (soloSinCampus) endpoint += `&soloSinCampus=`;
    if (soloConCentroInvest) endpoint += `&soloConCentroInvest=`;
    if (soloSinCentroInvest) endpoint += `&soloSinCentroInvest=`;
    if (soloConAreaConoc) endpoint += `&soloConAreaConoc=`;
    if (soloSinAreaConoc) endpoint += `&soloSinAreaConoc=`;
    if (soloConODS) endpoint += `&soloConODS=`;
    if (soloSinODS) endpoint += `&soloSinODS=`;
    if (soloConTipoActividad) endpoint += `&soloConTipoActividad=`;
    if (soloSinTipoActividad) endpoint += `&soloSinTipoActividad=`;
    if (soloConTipoPresentacion) endpoint += `&soloConTipoPresentacion=`;
    if (soloSinTipoPresentacion) endpoint += `&soloSinTipoPresentacion=`;
    if (soloConTipoTrab) endpoint += `&soloConTipoTrab=`;
    if (soloSinTipoTrab) endpoint += `&soloSinTipoTrab=`;
    if (soloConTipoPago) endpoint += `&soloConTipoPago=`;
    if (soloSinTipoPago) endpoint += `&soloSinTipoPago=`;
    if (soloConTipoNotif) endpoint += `&soloConTipoNotif=`;
    if (soloSinTipoNotif) endpoint += `&soloSinTipoNotif=`;
    if (soloConTipoEval) endpoint += `&soloConTipoEval=`;
    if (soloSinTipoEval) endpoint += `&soloSinTipoEval=`;
    if (soloConUser) endpoint += `&soloConUser=`;
    if (soloSinUser) endpoint += `&soloSinUser=`;
    if (soloConInstScintra) endpoint += `&soloConInstScintra=`;
    if (soloSinInstScintra) endpoint += `&soloSinInstScintra=`;
    if (conRorsEdit) endpoint += `&conRorsEdit=`;
    if (conMods) endpoint += `&conMods=`;
    if (conColegs) endpoint += `&conColegs=`;
    if (conTipNotif) endpoint += `&conTipNotif=`;
    if (conTipAct) endpoint += `&conTipAct=`;
    if (conTipPre) endpoint += `&conTipPre=`;
    if (conCenInv) endpoint += `&conCenInv=`;
    if (conCamp) endpoint += `&conCamp=`;
    if (conArConoc) endpoint += `&conArConoc=`;
    if (conTipTra) endpoint += `&conTipTra=`;
    if (conTipEv) endpoint += `&conTipEv=`;
    if (conTipPag) endpoint += `&conTipPag=`;
    if (conTipPart) endpoint += `&conTipPart=`;
    if (conOds) endpoint += `&conOds=`;
    if (incluir!='') endpoint += `&incluir=`+incluir;
    if (ordenar!='') endpoint += `&ordenar=`+ordenar;
    return this.http.get(endpoint)
  }

  getAllEventsIds() {
    return this.getEvents(true,0,0,'','','','','',
      '','','','','','','','',
      '','','','','','','','',
      '','','','','','','','',
      '','',
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,false,false,
      false,false,
      'id',''
    );
  }

  getEventList(page?:number,pageSize?:number,search?:string,idsEstEv?:any,idsTipEv?:any,idsCampus?:any,
               incluir?:string,ordenar?:string) {
    return this.getEvents(false,page,pageSize,search,'','',idsTipEv,idsEstEv,
      '','','','','','','',idsCampus,
      '','','','','','','','',
      '','','','','','','','',
      '','',
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      true,false,false,false,false,false,
      false,false,false,false,false,false,
      false,false,
      incluir,ordenar
    );
  }

  deleteEvent (id:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${id}/delete`
    return this.http.delete(ENDPOINT)
  }

  getInstitutionsRor(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsEvento?:any,
                     idsTrabScicom?:any,idsAutTrabScicom?:any,idsInvestProd?:any,idsInstScintraProd?:any,idsInstRorProd?:any,
                     idsInvestCita?:any,idsInstScintraCita?:any,idsInstRorCita?:any,idsRor?:any,idsGrid?:any,idsInstSc?:any,
                     idsCoautorProd?:any,idsCoautorCita?:any,idsPais?:any,idsProyInvestFinanc?:any,idsEspacioFisico?:any,
                     idsUsuScicom?:any,idsAutoresDeActividadScicom?:any,idsPatroc?:any,con_pais?:boolean,soloConPatroc?:boolean,
                     soloSinPatroc?:boolean,soloConProduct?:boolean,soloSinProduct?:boolean,soloConCita?:boolean,
                     soloSinCita?:boolean,soloConInstSc?:boolean,soloSinInstSc?:boolean,soloConCoautorProd?:boolean,
                     soloSinCoautorProd?:boolean,soloConCoautorCita?:boolean,soloSinCoautorCita?:boolean,
                     soloConEventoScicom?:boolean,soloSinEventoScicom?:boolean,soloConAutorTrabScicom?:boolean,
                     soloSinAutorTrabScicom?:boolean,soloConTrabScicom?:boolean, soloSinTrabScicom?:boolean,
                     soloConPais?:boolean,soloSinPais?:boolean,soloConProyectInvest?:boolean,
                     soloSinProyectInvest?:boolean,soloConEspacioFisico?:boolean,soloSinEspacioFisico?:boolean,
                     soloConUsuScicom?:boolean,soloSinUsuScicom?:boolean,soloConAutorActScicom?:boolean,
                     soloSinAutorActScicom?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/rors/simples?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsTrabScicom.length>0) endpoint += `&idsTrabScicom=${encodeURIComponent(idsTrabScicom.join(' '))}`;
    if (idsAutTrabScicom.length>0) endpoint += `&idsAutTrabScicom=${encodeURIComponent(idsAutTrabScicom.join(' '))}`;
    if (idsInvestProd.length>0) endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInstScintraProd.length>0) endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsInstRorProd.length>0) endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsInvestCita.length>0) endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsInstScintraCita.length>0) endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInstRorCita.length>0) endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (idsRor.length>0) endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (idsGrid.length>0) endpoint += `&idsGrid=${encodeURIComponent(idsGrid.join(' '))}`;
    if (idsInstSc.length>0) endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (idsCoautorProd.length>0) endpoint += `&idsCoautorProd=${encodeURIComponent(idsCoautorProd.join(' '))}`;
    if (idsCoautorCita.length>0) endpoint += `&idsCoautorCita=${encodeURIComponent(idsCoautorCita.join(' '))}`;
    if (idsPais.length>0) endpoint += `&idsPais=${encodeURIComponent(idsPais.join(' '))}`;
    if (idsProyInvestFinanc.length>0) endpoint += `&idsProyInvestFinanc=${encodeURIComponent(idsProyInvestFinanc.join(' '))}`;
    if (idsEspacioFisico.length>0) endpoint += `&idsEspacioFisico=${encodeURIComponent(idsEspacioFisico.join(' '))}`;
    if (idsUsuScicom.length>0) endpoint += `&idsUsuScicom=${encodeURIComponent(idsUsuScicom.join(' '))}`;
    if (idsAutoresDeActividadScicom.length>0) endpoint += `&idsAutoresDeActividadScicom=${encodeURIComponent(idsAutoresDeActividadScicom.join(' '))}`;
    if (idsPatroc.length>0) endpoint += `&idsPatroc=${encodeURIComponent(idsPatroc.join(' '))}`;
    if (con_pais) endpoint += `&con_pais=`;
    if (soloConPatroc) endpoint += `&soloConPatroc=`;
    if (soloSinPatroc) endpoint += `&soloSinPatroc=`;
    if (soloConProduct) endpoint += `&soloConProduct=`;
    if (soloSinProduct) endpoint += `&soloSinProduct=`;
    if (soloConCita) endpoint += `&soloConCita=`;
    if (soloSinCita) endpoint += `&soloSinCita=`;
    if (soloConInstSc) endpoint += `&soloConInstSc=`;
    if (soloSinInstSc) endpoint += `&soloSinInstSc=`;
    if (soloConCoautorProd) endpoint += `&soloConCoautorProd=`;
    if (soloSinCoautorProd) endpoint += `&soloSinCoautorProd=`;
    if (soloConCoautorCita) endpoint += `&soloConCoautorCita=`;
    if (soloSinCoautorCita) endpoint += `&soloSinCoautorCita=`;
    if (soloConEventoScicom) endpoint += `&soloConEventoScicom=`;
    if (soloSinEventoScicom) endpoint += `&soloSinEventoScicom=`;
    if (soloConAutorTrabScicom) endpoint += `&soloConAutorTrabScicom=`;
    if (soloSinAutorTrabScicom) endpoint += `&soloSinAutorTrabScicom=`;
    if (soloConTrabScicom) endpoint += `&soloConTrabScicom=`;
    if (soloSinTrabScicom) endpoint += `&soloSinTrabScicom=`;
    if (soloConPais) endpoint += `&soloConPais=`;
    if (soloSinPais) endpoint += `&soloSinPais=`;
    if (soloConProyectInvest) endpoint += `&soloConProyectInvest=`;
    if (soloSinProyectInvest) endpoint += `&soloSinProyectInvest=`;
    if (soloConEspacioFisico) endpoint += `&soloConEspacioFisico=`;
    if (soloSinEspacioFisico) endpoint += `&soloSinEspacioFisico=`;
    if (soloConUsuScicom) endpoint += `&soloConUsuScicom=`;
    if (soloSinUsuScicom) endpoint += `&soloSinUsuScicom=`;
    if (soloConAutorActScicom) endpoint += `&soloConAutorActScicom=`;
    if (soloSinAutorActScicom) endpoint += `&soloSinAutorActScicom=`;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getInstitutionsRorList(idsEvento?:any) {
    return this.getInstitutionsRor(
      true,0,0,'','',idsEvento,'','','',
      '','','','','','','','',
      '','','','','','',
      '','',false,false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false
    )
  }

  getInstitutions(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsRor?:any,idsContrato?:any,
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

  getInstitucionsList(idsRor?:any) {
    return this.getInstitutions(true,0,0,'','',idsRor,'','',
      '','','','','','',
      '','','','','','','',
      '','','',
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false, false,false,false,false,
      false,false,false,false
    );
  }

  getEstatEvents(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsEvent?:any,
                 idsEvPerm?:any,idsTipEvPerm?:any,conEventos?:boolean,soloConEvento?:boolean,soloSinEvento?:boolean,
                 soloConEvPerm?:boolean,soloSinEvPerm?:boolean,soloConTipsEvPerm?:boolean,soloSinTipsEvPerm?:boolean,
                 incluir?:string,ordenar?:string
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/estatusevento?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsEvent.length>0) endpoint += `&idsEvent=${encodeURIComponent(idsEvent.join(' '))}`;
    if (idsEvPerm.length>0) endpoint += `&idsEvPerm=${encodeURIComponent(idsEvPerm.join(' '))}`;
    if (idsTipEvPerm.length>0) endpoint += `&idsTipEvPerm=${encodeURIComponent(idsTipEvPerm.join(' '))}`;
    if (conEventos) endpoint += `&conEventos=`;
    if (soloConEvento) endpoint += `&soloConEvento=`;
    if (soloSinEvento) endpoint += `&soloSinEvento=`;
    if (soloConEvPerm) endpoint += `&soloConEvPerm=`;
    if (soloSinEvPerm) endpoint += `&soloSinEvPerm=`;
    if (soloConTipsEvPerm) endpoint += `&soloConTipsEvPerm=`;
    if (soloSinTipsEvPerm) endpoint += `&soloSinTipsEvPerm=`;
    if (incluir!='') endpoint += `&incluir=`+incluir;
    if (ordenar!='') endpoint += `&ordenar=`+ordenar;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getEstatEventByEvents(idsEvent?:any,incluir?:any) {
    return this.getEstatEvents(true,0,0,'','',idsEvent,'','',
      false,true,false,false,false,
      false,false,incluir,''
    );
  }

  getTypeEvents(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsEvent?:any,idsInstSc?:any,
                idsTipActPerm?:any,idsActPerm?:any,idsTipArchPerm?:any,idsArchPerm?:any,idsEstatusEvPerm?:any,idsTipEvalPerm?:any,
                idsEvalPerm?:any,idsModalidadPerm?:any,idsTipPagoPerm?:any,idsPagoPerm?:any,idsTipPartPerm?:any,idsPartPerm?:any,
                idsTipNotifPerm?:any,idsTipPresPerm?:any,idsTipTrabPerm?:any,idsTrabPerm?:any,idsRolScicom?:any,
                soloConEvento?:boolean,soloSinEvento?:boolean,soloConInstSc?:boolean,soloSinInstSc?:boolean,
                soloConTipActPerm?:boolean,soloSinTipActPerm?:boolean,soloConActPerm?:boolean,soloSinActPerm?:boolean,
                soloConTipArchPerm?:boolean,soloSinTipArchPerm?:boolean,soloConArchPerm?:boolean,soloSinArchPerm?:boolean,
                soloConEstatusEvPerm?:boolean,soloSinEstatusEvPerm?:boolean,soloConTipEvalPerm?:boolean,soloSinTipEvalPerm?:boolean,
                soloConEvalPerm?:boolean,soloSinEvalPerm?:boolean,soloConModalidadPerm?:boolean,soloSinModalidadPerm?:boolean,
                soloConTipPagoPerm?:boolean,soloSinTipPagoPerm?:boolean,soloConPagoPerm?:boolean,soloSinPagoPerm?:boolean,
                soloConTipPartPerm?:boolean,soloSinTipPartPerm?:boolean,soloConPartPerm?:boolean,soloSinPartPerm?:boolean,
                soloConTipNotifPerm?:boolean,soloSinTipNotifPerm?:boolean,soloConTipPresPerm?:boolean,soloSinTipPresPerm?:boolean,
                soloConTipTrabPerm?:boolean,soloSinTipTrabPerm?:boolean,soloConTrabPerm?:boolean,soloSinTrabPerm?:boolean,
                soloConRolScicom?:boolean,soloSinRolScicom?:boolean,incluir?:string,ordenar?:string
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/tipsevento?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsEvent.length>0) endpoint += `&idsEvent=${encodeURIComponent(idsEvent.join(' '))}`;
    if (idsInstSc.length>0) endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (idsTipActPerm.length>0) endpoint += `&idsTipActPerm=${encodeURIComponent(idsTipActPerm.join(' '))}`;
    if (idsActPerm.length>0) endpoint += `&idsActPerm=${encodeURIComponent(idsActPerm.join(' '))}`;
    if (idsTipArchPerm.length>0) endpoint += `&idsTipArchPerm=${encodeURIComponent(idsTipArchPerm.join(' '))}`;
    if (idsArchPerm.length>0) endpoint += `&idsArchPerm=${encodeURIComponent(idsArchPerm.join(' '))}`;
    if (idsEstatusEvPerm.length>0) endpoint += `&idsEstatusEvPerm=${encodeURIComponent(idsEstatusEvPerm.join(' '))}`;
    if (idsTipEvalPerm.length>0) endpoint += `&idsTipEvalPerm=${encodeURIComponent(idsTipEvalPerm.join(' '))}`;
    if (idsEvalPerm.length>0) endpoint += `&idsEvalPerm=${encodeURIComponent(idsEvalPerm.join(' '))}`;
    if (idsModalidadPerm.length>0) endpoint += `&idsModalidadPerm=${encodeURIComponent(idsModalidadPerm.join(' '))}`;
    if (idsTipPagoPerm.length>0) endpoint += `&idsTipPagoPerm=${encodeURIComponent(idsTipPagoPerm.join(' '))}`;
    if (idsPagoPerm.length>0) endpoint += `&idsPagoPerm=${encodeURIComponent(idsPagoPerm.join(' '))}`;
    if (idsTipPartPerm.length>0) endpoint += `&idsTipPartPerm=${encodeURIComponent(idsTipPartPerm.join(' '))}`;
    if (idsPartPerm.length>0) endpoint += `&idsPartPerm=${encodeURIComponent(idsPartPerm.join(' '))}`;
    if (idsTipNotifPerm.length>0) endpoint += `&idsTipNotifPerm=${encodeURIComponent(idsTipNotifPerm.join(' '))}`;
    if (idsTipPresPerm.length>0) endpoint += `&idsTipPresPerm=${encodeURIComponent(idsTipPresPerm.join(' '))}`;
    if (idsTipTrabPerm.length>0) endpoint += `&idsTipTrabPerm=${encodeURIComponent(idsTipTrabPerm.join(' '))}`;
    if (idsTrabPerm.length>0) endpoint += `&idsTrabPerm=${encodeURIComponent(idsTrabPerm.join(' '))}`;
    if (idsRolScicom.length>0) endpoint += `&idsRolScicom=${encodeURIComponent(idsRolScicom.join(' '))}`;
    if (soloConEvento) endpoint += `&soloConEvento`;
    if (soloSinEvento) endpoint += `&soloSinEvento`;
    if (soloConInstSc) endpoint += `&soloConInstSc`;
    if (soloSinInstSc) endpoint += `&soloSinInstSc`;
    if (soloConTipActPerm) endpoint += `&soloConTipActPerm`;
    if (soloSinTipActPerm) endpoint += `&soloSinTipActPerm`;
    if (soloConActPerm) endpoint += `&soloConActPerm`;
    if (soloSinActPerm) endpoint += `&soloSinActPerm`;
    if (soloConTipArchPerm) endpoint += `&soloConTipArchPerm`;
    if (soloSinTipArchPerm) endpoint += `&soloSinTipArchPerm`;
    if (soloConArchPerm) endpoint += `&soloConArchPerm`;
    if (soloSinArchPerm) endpoint += `&soloSinArchPerm`;
    if (soloConEstatusEvPerm) endpoint += `&soloConEstatusEvPerm`;
    if (soloSinEstatusEvPerm) endpoint += `&soloSinEstatusEvPerm`;
    if (soloConTipEvalPerm) endpoint += `&soloConTipEvalPerm`;
    if (soloSinTipEvalPerm) endpoint += `&soloSinTipEvalPerm`;
    if (soloConEvalPerm) endpoint += `&soloConEvalPerm`;
    if (soloSinEvalPerm) endpoint += `&soloSinEvalPerm`;
    if (soloConModalidadPerm) endpoint += `&soloConModalidadPerm`;
    if (soloSinModalidadPerm) endpoint += `&soloSinModalidadPerm`;
    if (soloConTipPagoPerm) endpoint += `&soloConTipPagoPerm`;
    if (soloSinTipPagoPerm) endpoint += `&soloSinTipPagoPerm`;
    if (soloConPagoPerm) endpoint += `&soloConPagoPerm`;
    if (soloSinPagoPerm) endpoint += `&soloSinPagoPerm`;
    if (soloConTipPartPerm) endpoint += `&soloConTipPartPerm`;
    if (soloSinTipPartPerm) endpoint += `&soloSinTipPartPerm`;
    if (soloConPartPerm) endpoint += `&soloConPartPerm`;
    if (soloSinPartPerm) endpoint += `&soloSinPartPerm`;
    if (soloConTipNotifPerm) endpoint += `&soloConTipNotifPerm`;
    if (soloSinTipNotifPerm) endpoint += `&soloSinTipNotifPerm`;
    if (soloConTipPresPerm) endpoint += `&soloConTipPresPerm`;
    if (soloSinTipPresPerm) endpoint += `&soloSinTipPresPerm`;
    if (soloConTipTrabPerm) endpoint += `&soloConTipTrabPerm`;
    if (soloSinTipTrabPerm) endpoint += `&soloSinTipTrabPerm`;
    if (soloConTrabPerm) endpoint += `&soloConTrabPerm`;
    if (soloSinTrabPerm) endpoint += `&soloSinTrabPerm`;
    if (soloConRolScicom) endpoint += `&soloConRolScicom`;
    if (soloSinRolScicom) endpoint += `&soloSinRolScicom`;
    if (incluir!='') endpoint += `&incluir=`+incluir;
    if (ordenar!='') endpoint += `&ordenar=`+ordenar;
    return this.http.get(endpoint)
  }

  getTypeEventByEvents(idsEvent?:any,incluir?:any) {
    return this.getTypeEvents(true,0,0,'','',idsEvent,'',
      '','','','','','','',
      '','','','','','',
      '','','','',
      true,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,
      false,
      incluir,''
    );
  }

  getCampus(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInst?:any,
            idsInstScintraCita?:any,idsInstScintraProd?:any,idsInstRorCita?:any,idsInvest?:any,idsInvestCita?:any,
            idsColegio?:any,idsEvento?:any,idsInvestProd?:any,idsInstRorProd?:any,idsUsrScicom?:any,
            idsAutTrabScicom?:any,idsUserResource?:any,idsMetas?:any,con_institucion?:boolean,soloConProduct?:boolean,
            soloSinProduct?:boolean,soloConInstSc?:boolean,soloSinInstSc?:boolean,soloConColegio?:boolean,
            soloSinColegio?:boolean,soloConInvest?:boolean,soloSinInvest?:boolean,soloConEventoScicom?:boolean,
            soloSinEventoScicom?:boolean,soloConUsuarioScicom?:boolean,soloSinUsuarioScicom?:boolean,
            soloConAutorTrabScicom?:boolean,soloSinAutorTrabScicom?:boolean,soloConUserRes?:boolean,
            soloSinUserRes?:boolean,soloConMeta?:boolean,soloSinMeta?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/campus?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInst.length>0) endpoint += `&idsInst=${encodeURIComponent(idsInst.join(' '))}`;
    if (idsInstScintraCita.length>0) endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInstScintraProd.length>0) endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsInstRorCita.length>0) endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (idsInvest.length>0) endpoint += `&idsInvest=${encodeURIComponent(idsInvest.join(' '))}`;
    if (idsInvestCita.length>0) endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsColegio.length>0) endpoint += `&idsColegio=${encodeURIComponent(idsColegio.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsInvestProd.length>0) endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInstRorProd.length>0) endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsUsrScicom.length>0) endpoint += `&idsUsrScicom=${encodeURIComponent(idsUsrScicom.join(' '))}`;
    if (idsAutTrabScicom.length>0) endpoint += `&idsAutTrabScicom=${encodeURIComponent(idsAutTrabScicom.join(' '))}`;
    if (idsUserResource.length>0) endpoint += `&idsUserResource=${encodeURIComponent(idsUserResource.join(' '))}`;
    if (idsMetas.length>0) endpoint += `&idsMetas=${encodeURIComponent(idsMetas.join(' '))}`;
    if (con_institucion) endpoint += `&con_institucion`;
    if (soloConProduct) endpoint += `&soloConProduct`;
    if (soloSinProduct) endpoint += `&soloSinProduct`;
    if (soloConInstSc) endpoint += `&soloConInstSc`;
    if (soloSinInstSc) endpoint += `&soloSinInstSc`;
    if (soloConColegio) endpoint += `&soloConColegio`;
    if (soloSinColegio) endpoint += `&soloSinColegio`;
    if (soloConInvest) endpoint += `&soloConInvest`;
    if (soloSinInvest) endpoint += `&soloSinInvest`;
    if (soloConEventoScicom) endpoint += `&soloConEventoScicom`;
    if (soloSinEventoScicom) endpoint += `&soloSinEventoScicom`;
    if (soloConUsuarioScicom) endpoint += `&soloConUsuarioScicom`;
    if (soloSinUsuarioScicom) endpoint += `&soloSinUsuarioScicom`;
    if (soloConAutorTrabScicom) endpoint += `&soloConAutorTrabScicom`;
    if (soloSinAutorTrabScicom) endpoint += `&soloSinAutorTrabScicom`;
    if (soloConUserRes) endpoint += `&soloConUserRes`;
    if (soloSinUserRes) endpoint += `&soloSinUserRes`;
    if (soloConMeta) endpoint += `&soloConMeta`;
    if (soloSinMeta) endpoint += `&soloSinMeta`;
    return this.http.get(endpoint)
  }

  getCampusByEvents(idsEvento?:any){
    return this.getCampus(true,0,0,'','','','','',
      '','','','',idsEvento,'','', '',
      '','','',false,false,false,
      false,false,false,false,false,false,
      true,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getRangeEvents(no_paginate?:boolean,page?:number,pageSize?:number,ids?:any,idsTipsRang?:any,idsUsuario?:any,
    idsTipsPagEvent?:any,idsExcepTipsPag?:any,idsEspFis?:any,idsObjInd?:any,idsTrab?:any,fechaInic?:any,fechaFin?:any,
    idsInst?:any,idsEvento?:any,idsPart?:any,idEvento?:any,idsTipEval?:any,soloConEvento?:boolean,
    soloSinEvento?:boolean,soloConPart?:boolean,soloSinPart?:boolean,soloConTrab?:boolean,soloSinTrab?:boolean,
    soloConInst?:boolean,soloSinInst?:boolean,soloConObjInd?:boolean,soloSinObjInd?:boolean,
    soloConExcepTipPago?:boolean,soloSinExcepTipPago?:boolean,soloConTipPagoEvento?:boolean,
    soloSinTipPagoEvento?:boolean,soloConUsuario?:boolean,soloSinUsuario?:boolean,soloConTipRang?:boolean,
    soloSinTipRang?:boolean,soloConEspFis?:boolean,soloSinEspFis?:boolean,
    incluir?:string,ordenar?:string
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/rangstiempo?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsTipsRang.length>0) endpoint += `&idsTipsRang=${encodeURIComponent(idsTipsRang.join(' '))}`;
    if (idsUsuario.length>0) endpoint += `&idsUsuario=${encodeURIComponent(idsUsuario.join(' '))}`;
    if (idsTipsPagEvent.length>0) endpoint += `&idsTipsPagEvent=${encodeURIComponent(idsTipsPagEvent.join(' '))}`;
    if (idsExcepTipsPag.length>0) endpoint += `&idsExcepTipsPag=${encodeURIComponent(idsExcepTipsPag.join(' '))}`;
    if (idsEspFis.length>0) endpoint += `&idsEspFis=${encodeURIComponent(idsEspFis.join(' '))}`;
    if (idsObjInd.length>0) endpoint += `&idsObjInd=${encodeURIComponent(idsObjInd.join(' '))}`;
    if (idsTrab.length>0) endpoint += `&idsTrab=${encodeURIComponent(idsTrab.join(' '))}`;
    if (fechaInic.length>0) endpoint += `&fechaInic=${encodeURIComponent(fechaInic.join(' '))}`;
    if (fechaFin.length>0) endpoint += `&fechaFin=${encodeURIComponent(fechaFin.join(' '))}`;
    if (idsInst.length>0) endpoint += `&idsInst=${encodeURIComponent(idsInst.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsPart.length>0) endpoint += `&idsPart=${encodeURIComponent(idsPart.join(' '))}`;
    if (idEvento.length>0) endpoint += `&idEvento=${encodeURIComponent(idEvento.join(' '))}`;
    if (idsTipEval.length>0) endpoint += `&idsTipEval=${encodeURIComponent(idsTipEval.join(' '))}`;
    if (soloConEvento) endpoint += `&soloConEvento=`;
    if (soloSinEvento) endpoint += `&soloSinEvento=`;
    if (soloConPart) endpoint += `&soloConPart=`;
    if (soloSinPart) endpoint += `&soloSinPart=`;
    if (soloConTrab) endpoint += `&soloConTrab=`;
    if (soloSinTrab) endpoint += `&soloSinTrab=`;
    if (soloConInst) endpoint += `&soloConInst=`;
    if (soloSinInst) endpoint += `&soloSinInst=`;
    if (soloConObjInd) endpoint += `&soloConObjInd=`;
    if (soloSinObjInd) endpoint += `&soloSinObjInd=`;
    if (soloConExcepTipPago) endpoint += `&soloConExcepTipPago=`;
    if (soloSinExcepTipPago) endpoint += `&soloSinExcepTipPago=`;
    if (soloConTipPagoEvento) endpoint += `&soloConTipPagoEvento=`;
    if (soloSinTipPagoEvento) endpoint += `&soloSinTipPagoEvento=`;
    if (soloConUsuario) endpoint += `&soloConUsuario=`;
    if (soloSinUsuario) endpoint += `&soloSinUsuario=`;
    if (soloConTipRang) endpoint += `&soloConTipRang=`;
    if (soloSinTipRang) endpoint += `&soloSinTipRang=`;
    if (soloConEspFis) endpoint += `&soloConEspFis=`;
    if (soloSinEspFis) endpoint += `&soloSinEspFis=`;
    if (incluir!='') endpoint += `&incluir=`+incluir;
    if (ordenar!='') endpoint += `&ordenar=`+ordenar;
    return this.http.get(endpoint)
  }

  getRangesByEvents(idsEvento?:any,idsTipsRang?:any,incluir?:string){
    return this.getRangeEvents(true,0,0,'',idsTipsRang,'','',
      '','','','','','','',idsEvento, '',
      '','',
      true,false,false, false,false,false,
      false,false,false, false,false,
      false,false, false,false,
      false,false,false,false,false,
       incluir,'',
    );
  }

}
