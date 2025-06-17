import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class EventDetailsService {

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

  getEventById(idEvent?:any,incluir?:string) {
    return this.getEvents(false,1,1,'',idEvent,'','','',
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
      true,false,false,false,false,false,
      false,true,false,false,false,true,
      false,false,
      incluir,''
    );
  }



}
