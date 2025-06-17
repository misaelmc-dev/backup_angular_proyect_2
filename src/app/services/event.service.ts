import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})

export class EventService {

  @Output() eventEvaluationTypesChanged = new EventEmitter();
  @Output() eventPayTypesChanged = new EventEmitter();

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

  getEventsByCordAndRor(page?:number,pageSize?:number,cordId?:any,conRorsEdit?:boolean,
                        incluir?:string,orden?:string){
    return this.getEvents(
      false,page,pageSize,'','',cordId,'','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      false,false,false,false,
      false, false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,conRorsEdit,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      incluir,orden
    )
  }

  getEventsByFilter(page?:number,pageSize?:number,search?:string,cordId?:any,conRorsEdit?:boolean,
                    idsTipEv?:any,idsEstEv?:any,idsCampus?:any,incluir?:string,orden?:string){
    return this.getEvents(
      false,page,pageSize,search,'',cordId,idsTipEv,idsEstEv,'',
      '','','','','',
      '',idsCampus,'','','',
      '','','','','',
      '','','','','',
      '','','','','',
      false,false,false,false,
      false, false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,conRorsEdit,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      incluir,orden
    )
  }

  getEventListAdmin(idsUsuarios?: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/eventos?no_paginate=&idsUsers=${encodeURIComponent(idsUsuarios.join(' '))}&conRorsEdit=`
    return this.http.get(endpointUrl)
  }

  //todo changes on 202209271755, check if errors elsewhere
  getEventList(cordId?:number, conRorsEdit?: boolean) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/eventos?no_paginate=`
    let yaHayParam = true;
    if (cordId) {
      endpointUrl += `&idInst=${cordId}`
      yaHayParam = true;
    }
    if (conRorsEdit) {
      if (yaHayParam)
        endpointUrl += `&conRorsEdit=`
      else
        endpointUrl += `?conRorsEdit=`
      yaHayParam = true
    }
    return this.http.get(endpointUrl)
  }

  getEventListForumEncuntro(cordId?:number, conRorsEdit?: boolean) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/eventos?no_paginate=&idsTipEv=2 3`
    if (cordId)
      endpointUrl += `&idInst=${cordId}`
    if (conRorsEdit)
      endpointUrl += `&conRorsEdit=`
    return this.http.get(endpointUrl)
  }

  getEventById (eventId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos?no_paginate=&conCamp=&conArConoc=&conRorsEdit=&conTipPag=&conOds=&id=${eventId}`
    return this.http.get(ENDPOINT)
  }

  consultaEvent (consulta:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos${consulta}`;
    //console.log("consulta",`${this.globals.backend_base_url}/scicom/eventos?${consulta}`);
    return this.http.get(ENDPOINT)
  }

  /**
   * Consulta los tipos de rango de tiempo  permitidos
   * @param idInstScintra Filtra por solo los tipos de eventos permitidos para la institución scintra especificada
   */

  consultaRangoTiempo(tiporangotiempo:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsrangtiemp?no_paginate=&search=${tiporangotiempo}`;
    return this.http.get(ENDPOINT)
  }

  /**
   * Consulta los tipos de evento scicom permitidos
   * @param idInstScintra Filtra por solo los tipos de eventos permitidos para la institución scintra especificada
   */
  getEventTypes(idInstScintra: any) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsevento?no_paginate=&idsInstSc=${idInstScintra}`
    return this.http.get(ENDPOINT)
  }

  getTypeEventList () {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsevento?no_paginate=`
    return this.http.get(ENDPOINT)
  }

  getTypeEvent (idsEvento: Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsevento?no_paginate=&idsEvent=${encodeURIComponent(idsEvento.join(' '))}`
    return this.http.get(ENDPOINT)
  }

  getTypeEventById (idTypeEvento:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsevento?no_paginate=&ids=${idTypeEvento}`
    return this.http.get(ENDPOINT)
  }

  getTypeEventByInstitucion(idInstitucion:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsevento?no_paginate=&idsInstSc=${idInstitucion}`
    return this.http.get(ENDPOINT)
  }

  getStatusEvent(idsEvento?: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/estatusevento?no_paginate=`
    if (idsEvento)
      endpointUrl += (`&idsEvent=${encodeURIComponent(idsEvento.join(' '))}`)
    return this.http.get(endpointUrl)
  }

  getStatusEventByTipoEvent(idsTipoEvento:number) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/estatusevento?no_paginate=&idsTipEvPerm=${idsTipoEvento}`
    return this.http.get(endpointUrl)
  }

  getInstitucionList (idsRor?: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/instituciones/simples`
    if (idsRor)
      endpointUrl += `?idsRor=${encodeURIComponent(idsRor.join(' '))}`
    return this.http.get(endpointUrl)
  }

  addEvent (nombres:string,tipo:number,institucion:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/create`
    //console.log(ENDPOINT)
    return this.http.post(ENDPOINT,{nombre:nombres,id_tipo_evento:tipo,id_institucion:institucion})
  }

  updateEvent (eventoId:number,nombre:string,tipo:number,descripcion?:string,lema?:string,objetivos?:string,estatus?:any,nivel?:any) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/update`
    let formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('id_tipo_evento', tipo.toString());
    formData.append('descripcion', descripcion);
    formData.append('lema', lema);
    formData.append('objetivo', objetivos);
    if(estatus && estatus!=0){formData.append('id_estatus_evento', estatus);}
    if(nivel && nivel!=''){formData.append('niv_desarr_for_enc_unit_uvm', nivel);}
    return this.http.post(ENDPOINT, formData);
  }

  deleteEvent (id:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${id}/delete`
    return this.http.delete(ENDPOINT)
  }

  getCampusList (institucionId?:number, idsEvento?: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/campus/simples?no_paginate=`
    let yaHayAlgunParametro = false
    if (institucionId)
      endpointUrl += (`&idsInst=${encodeURIComponent(institucionId)}`)
    if (idsEvento) {
      if (yaHayAlgunParametro)
        endpointUrl += `&idsEvento=`
      else
        endpointUrl += `&idsEvento=`
      endpointUrl += encodeURIComponent(idsEvento.join(' '))
    }
    return this.http.get(endpointUrl)
  }

  getCampusAsign (eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/campus?no_paginate=&idsEvento=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  getCampusSimplesAsign (eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/campus/simples?no_paginate=&idsEvento=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  addCampusToEvent (campusId:number,eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/campus/ligar?ids=${campusId}`
    return this.http.post(ENDPOINT,{ids:campusId})
  }

  removeCampusToEvent (campusId:number,eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/campus/desligar?ids=${campusId}`
    return this.http.post(ENDPOINT,{ids:campusId})
  }

  getTypeEvaluationById (idTypeEval:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipseval?no_paginate=&ids=${idTypeEval}`
    return this.http.get(ENDPOINT)
  }

  getEvaluationAsign (eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipseval?no_paginate=&idsEvent=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  addEvaluationToEvent (evaluationId:number,eventoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipseval/ligar?ids=${evaluationId}`
    let subscription = this.http.post(ENDPOINT,{ids:evaluationId})
    subscription.subscribe(() => {
      this.emitEventEvaluationTypesChangedEvent()
    }, () => {
      this.emitEventEvaluationTypesChangedEvent()
    })
    return subscription
  }

  removeEvaluationToEvent (evaluationId:number,eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipseval/desligar?ids=${evaluationId}`
    let subscription =  this.http.post(ENDPOINT,{ids:evaluationId})
    subscription.subscribe(() => {
      this.emitEventEvaluationTypesChangedEvent()
    }, () => {
      this.emitEventEvaluationTypesChangedEvent()
    })
    return subscription
  }

  addPaymentsToEvent (payId:number,eventoId:number,monto:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipspago/ligar?ids=${payId}&monto=${monto}`
    let subscription = this.http.post(ENDPOINT,{ids:payId,monto:monto})
    subscription.subscribe(() => {
      this.emitEventPayTypesChangedEvent()
    }, () => {
      this.emitEventPayTypesChangedEvent()
    })
    return subscription
  }

  removePaymentsToEvent (payId:number,eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipspago/desligar?ids=${payId}`
    let subscription = this.http.post(ENDPOINT,{ids:payId})
    subscription.subscribe(() => {
      this.emitEventPayTypesChangedEvent()
    }, () => {
      this.emitEventPayTypesChangedEvent()
    })
    return subscription
  }

  getTypeParticipationByEventAsign(page?:number,pageSize?:number,eventoId?:any){
    return this.getEvents(
      false,page,pageSize,'',eventoId,'','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      false,false,false,false,
      false, false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,true,false,
      '',''
    )
  }

  getParticipationList (idEvento: any) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipspart?no_paginate=&idsEvPerm=${idEvento}`
    return this.http.get(ENDPOINT)
  }

  getParticipationAsign (eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos?no_paginate=&conTipPart=&id=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  addParticipationToEvent (participationId:number,eventoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipspart/ligar?ids=${participationId}`
    return this.http.post(ENDPOINT,{ids:participationId})
  }

  removeParticipationToEvent (participationId:number,eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipspart/desligar?ids=${participationId}`
    return this.http.post(ENDPOINT,{ids:participationId})
  }

  getWorkList (idEvento: any) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipstrab?no_paginate=&idsEvPerm=${idEvento}`
    return this.http.get(ENDPOINT)
  }

  getWorkTypeList(idEvento:number,idWorkType:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipstrab?no_paginate=&idsEvent=${idEvento}&idsTipEvPerm=${idWorkType}`
    return this.http.get(ENDPOINT)
  }

  getWorkAsign (eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipstrab?no_paginate=&idsEvent=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  addWorkToEvent (workId:number,eventoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipstrab/ligar?ids=${workId}`
    return this.http.post(ENDPOINT,{ids:workId})
  }

  removeWorkToEvent (workId:number,eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipstrab/desligar?ids=${workId}`
    return this.http.post(ENDPOINT,{ids:workId})
  }

  getFileTypeList () {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsarch?no_paginate=`
    return this.http.get(ENDPOINT)
  }

  getFileTypeListByEventType (eventTypeId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsarch?no_paginate=&idsTipEvPerm=${eventTypeId}`
    return this.http.get(ENDPOINT)
  }

  getFileList (eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos?no_paginate=&idEvento=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  getFileListByTypeFile (eventoId:number,idsTipArch: Array<number>,partIds:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos?no_paginate=&idEvento=${eventoId}&idsTipsArch=${encodeURIComponent(idsTipArch.join(' '))}&idsPart=${partIds}`
    return this.http.get(ENDPOINT)
  }

  getFileListByWork(eventoId:number,idsTrab: Array<number>){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos?no_paginate=&idEvento=${eventoId}&idsTrab=${encodeURIComponent(idsTrab.join(' '))}`
    return this.http.get(ENDPOINT)
  }

  getFilesByWork(eventoId:number,tipoId:number,trabajoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos?no_paginate=&idEvento=${eventoId}&idsTipsArch=${tipoId}&idsTrab=${trabajoId}`
    return this.http.get(ENDPOINT)
  }

  addFileEvent(nombre:string,descripcion:string,eventoId:string,idTipoArchivo:string,selectedFile: any) {
    let ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/subir`;
    let formData = new FormData();
    formData.append('nombre', nombre);
    if(descripcion!=''){
      formData.append('descripcion', descripcion);
    }
    formData.append('id_evento', eventoId);
    formData.append('id_tipo_archivo', idTipoArchivo);
    formData.append('file', selectedFile);
    return this.http.post(ENDPOINT, formData);
  }

  addFileEventWithPart(nombre:string,descripcion:string,selectedFile:any,idTipoArchivo:number,eventoId:number,participacionId:number) {
    let ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/subir`;
    let formData = new FormData();
    formData.append('nombre', nombre);
    if(descripcion!=''){
      formData.append('descripcion', descripcion);
    }
    formData.append('id_evento', eventoId.toString());
    formData.append('id_tipo_archivo', idTipoArchivo.toString());
    formData.append('file', selectedFile);
    formData.append('id_participacion', participacionId.toString());
    return this.http.post(ENDPOINT, formData);
  }

  addLogoEvent(nombre:string,selectedFile:any,idTipoArchivo:number,eventoId:number) {
    let ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/subir`;
    let formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('id_evento', eventoId.toString());
    formData.append('id_tipo_archivo', idTipoArchivo.toString());
    formData.append('file', selectedFile);
    return this.http.post(ENDPOINT, formData);
  }

  getFileLogoEvent(eventoId:number, idTipoArch:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos?no_paginate=&idEvento=${eventoId}&idsTipsArch=${idTipoArch}`
    return this.http.get(ENDPOINT)
  }

  addFileWork(nombre:string,descripcion:string,eventoId:any,idTipoArchivo:any,idTrabajo:any,selectedFile: any) {
    let ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/subir`;
    let formData = new FormData();
    formData.append('nombre', nombre);
    if(descripcion!=''){
      formData.append('descripcion', descripcion);
    }
    formData.append('id_evento', eventoId);
    formData.append('id_tipo_archivo', idTipoArchivo);
    formData.append('id_trabajo', idTrabajo);
    formData.append('file', selectedFile);
    return this.http.post(ENDPOINT, formData);
  }

  addFileEvaluation(nombre:string,descripcion:string,eventoId:any,idTipoArchivo:any,idevaluacion:any,selectedFile: any) {
    let ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/subir`;
    let formData = new FormData();
    formData.append('nombre', nombre);
    if(descripcion!=''){
      formData.append('descripcion', descripcion);
    }
    formData.append('id_evento', eventoId);
    formData.append('id_tipo_archivo', idTipoArchivo);
    formData.append('id_evaluacion', idevaluacion);
    formData.append('file', selectedFile);
    return this.http.post(ENDPOINT, formData);
  }

  addFilePago(nombre:string,descripcion:string,eventoId:any,idTipoArchivo:any,idpago:any,selectedFile: any) {
    let ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/subir`;
    let formData = new FormData();
    formData.append('nombre', nombre);
    if(descripcion!=''){
      formData.append('descripcion', descripcion);
    }
    formData.append('id_evento', eventoId);
    formData.append('id_tipo_archivo', idTipoArchivo);
    formData.append('id_pago', idpago);
    formData.append('file', selectedFile);
    return this.http.post(ENDPOINT, formData);
  }

  viewEventFile = (eventFileUrl: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/${eventFileUrl}/descargar`;
    return this.http.get(ENDPOINT, { responseType: "blob"} );
  }

  deleteEventFile = (eventoId:number) => {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/${eventoId}/eliminar`;
    return this.http.delete(ENDPOINT);
  }

  getRangeEventList (eventoId:number, idsTipRango?: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/rangstiempo?no_paginate=&idEvento=${eventoId}`;
    if (idsTipRango) {
      endpointUrl += `&idsTipsRang=${encodeURIComponent(idsTipRango.join(' '))}`
    }
    return this.http.get(endpointUrl)
  }

  getRangeEventById (rangeId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/rangstiempo?no_paginate=&ids=${rangeId}`;
    return this.http.get(ENDPOINT)
  }

  getRangeEventListTotat (idsEvento: Array<number>, idsTipoRango: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/rangstiempo?no_paginate=&idsEvento${
      encodeURIComponent(idsEvento.join(' '))}&idsTipsRang${encodeURIComponent(idsEvento.join(' '))}`;
    return this.http.get(endpointUrl)
  }

  getRangeEventByEvents (eventoId:number,tipoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/rangstiempo?no_paginate=&idEvento=${eventoId}&idsTipsRang=${tipoId}`;
    return this.http.get(ENDPOINT)
  }

  getRangeEventByParticipation(eventoId:number,participacionId:number,tipoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/rangstiempo?no_paginate=&idsTipsRang=${tipoId}&idEvento=${eventoId}&idsPart=${participacionId}`;
    return this.http.get(ENDPOINT)
  }


  addDateRangeEvent (dateinicio:string,datefin:string,eventoId:number,rangoTipoId:number,evaluacionId?:number,tipoPagoId?:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/rangstiempo/create`
    if(tipoPagoId){
      return this.http.post(ENDPOINT,{tiempo_inicio:dateinicio,tiempo_final:datefin,id_evento:eventoId,id_tipo_rango:rangoTipoId,id_tipo_pago_evento:tipoPagoId})
    }else if(evaluacionId && evaluacionId != 0){
      return this.http.post(ENDPOINT,{tiempo_inicio:dateinicio,tiempo_final:datefin,id_evento:eventoId,id_tipo_rango:rangoTipoId,id_tipo_evaluacion:evaluacionId})
    }else{
      return this.http.post(ENDPOINT,{tiempo_inicio:dateinicio,tiempo_final:datefin,id_evento:eventoId,id_tipo_rango:rangoTipoId})
    }
  }

  updateDateRangeEvent (rangoId:number,dateinicio:string,datefin:string,eventoId:number,rangoTipoId:number,evaluacionId?:number,tipoPagoId?:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/rangstiempo/${rangoId}/update`
    if(tipoPagoId){
      return this.http.post(ENDPOINT,{tiempo_inicio:dateinicio,tiempo_final:datefin,id_evento:eventoId,id_tipo_rango:rangoTipoId,id_tipo_pago_evento:tipoPagoId})
    }else if(evaluacionId && evaluacionId != 0){
      return this.http.post(ENDPOINT,{tiempo_inicio:dateinicio,tiempo_final:datefin,id_evento:eventoId,id_tipo_rango:rangoTipoId,id_tipo_evaluacion:evaluacionId})
    }else{
      return this.http.post(ENDPOINT,{tiempo_inicio:dateinicio,tiempo_final:datefin,id_evento:eventoId,id_tipo_rango:rangoTipoId})
    }
  }

  updateDateEvent (fechaId:number,dateinicio:string,datefin:string,rangoTipoId?:any){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/rangstiempo/${fechaId}/update`
    let formData = new FormData();
    formData.append('tiempo_inicio',dateinicio);
    formData.append('tiempo_final',datefin);
    if(rangoTipoId){
      formData.append('id_tipo_rango',rangoTipoId);
    }
    return this.http.post(ENDPOINT,formData)
  }

  addRangeDate(dateinicio:string,datefin:string,eventoId:number,rangoTipoId:number,participacionId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/rangstiempo/create`;
    return this.http.post(ENDPOINT,{tiempo_inicio:dateinicio,tiempo_final:datefin,id_evento:eventoId,id_tipo_rango:rangoTipoId,id_participacion:participacionId})
  }

  deleteRangeEvent (rangoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/rangstiempo/${rangoId}/delete`
    return this.http.delete(ENDPOINT)
  }

  getPaymentsList (idEvento: any) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipspago?no_paginate=&idsEvPerm=${idEvento}`
    return this.http.get(ENDPOINT)
  }

  getPaymentsAsign (eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipspago?no_paginate=&idsEvent=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  getUsuariosEvento(eventoId:number, idUser?: number, ids?: Array<number>){
    let endpointUrl = `${this.globals.backend_base_url}/scicom/usuarios?no_paginate=&idEvento=${eventoId}&conRor=&conCampus=`;
    if (idUser)
      endpointUrl += `&idsUser=${idUser}`
    if (ids)
      endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}`
    return this.http.get(endpointUrl)
  }

  getUsuariosByEventoAndUser(eventoId:number,idUser:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios?no_paginate=&ids=${idUser}&idEvento=${eventoId}&conCampus=`
    return this.http.get(ENDPOINT)
  }

  getUsuarioById(eventoId:number,idUsuarioScicom:number) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/usuarios?no_paginate=&idEvento=${eventoId}&ids=${idUsuarioScicom}&conRor=&conCampus=`;
    return this.http.get(endpointUrl)
  }

  getUsuariosTrabajosAdmin(ids?: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/usuarios?no_paginate=&ids=${encodeURIComponent(ids.join(' '))}`;
    return this.http.get(endpointUrl)
  }

  searchScintraUser (email:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/users?email=${email}`;
    return this.http.get(ENDPOINT)
  }

  addScicomUser (rolId:number,userId:number,eventoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/create`
    return this.http.post(ENDPOINT,{id_rol:rolId,id_user:userId,id_evento:eventoId})
  }


  addScintraUser (name:string,email:string,rol:string,password:string,password_confirm:string){
    const ENDPOINT = `${this.globals.backend_base_url}/register`
    return this.http.post(ENDPOINT,{name:name,email:email,legacy_role:rol,password:password,password_confirmation:password_confirm})
  }

  updateScicomUser (colabId:number,rolId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${colabId}/update`
    return this.http.post(ENDPOINT,{id_rol:rolId})
  }

  deleteScicomUser (userId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${userId}/delete`
    return this.http.delete(ENDPOINT)
  }

  searchScicomUser (eventId:number,email:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios?no_paginate=&idEvento=${eventId}&search=${email}&conCampus=`;
    return this.http.get(ENDPOINT)
  }

  getRolList (idEvento: any) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/roles?no_paginate=&idEvento=${idEvento}`;
    return this.http.get(ENDPOINT)
  }

  /** asignacion y remocion de campus
   *
   * @param usuarioId
   * @param campusId
   */

  addCampusToUser (usuarioId:number,campusId:number[]) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/campus/ligar?ids=${campusId}`
    return this.http.post(ENDPOINT,{ids:campusId})
  }

  addCampusToUserParticipation(usuarioId:number,ids?:Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/campus/ligar?ids=${encodeURIComponent(ids.join(' '))}`
    return this.http.post(ENDPOINT,{})
  }

  addRorsToUserParticipation(usuarioId:number,ids?:Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/rors/ligar?ids=${encodeURIComponent(ids.join(' '))}`
    return this.http.post(ENDPOINT,{})
  }

  removeCampusToUserParticipation(usuarioId:number,ids?:Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/campus/desligar?ids=${encodeURIComponent(ids.join(' '))}`
    return this.http.post(ENDPOINT,{})
  }

  removeRorsToUserParticipation(usuarioId:number,ids?:Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/rors/desligar?ids=${encodeURIComponent(ids.join(' '))}`
    return this.http.post(ENDPOINT,{})
  }

  removeCampusToUser (usuarioId:number,campusId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/campus/desligar?ids=${campusId}`
    return this.http.post(ENDPOINT,{ids:campusId})
  }

  /** control de rors
   *
   * @param search
   */


  searchRor (search:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/rors/simples?no_paginate=&search=${search}`;
    return this.http.get(ENDPOINT)
  }

  addRorToUser (usuarioId:number,rorId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/rors/ligar?ids=${rorId}`
    return this.http.post(ENDPOINT,{ids:rorId})
  }

  removeRorToUser (usuarioId:number,rorId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/rors/desligar?ids=${rorId}`
    return this.http.post(ENDPOINT,{ids:rorId})
  }

  searchUser (idEvento:number,search:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios?no_paginate=&idEvento=${idEvento}&search=${search}`;
    return this.http.get(ENDPOINT)
  }

  getRorById (rorId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/rors/${rorId}?con_pais=`;
    return this.http.get(ENDPOINT)
  }

  getRorsByAuthor (idsAutTrabScicom:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/rors/simples?no_paginate=&idsAutTrabScicom=${idsAutTrabScicom}`;
    return this.http.get(ENDPOINT)
  }

  /** se cargan los endpoints de participaciones **/

  getParticipationListByEvent (IdEvento:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones?no_paginate=&idEvento=${IdEvento}`
    return this.http.get(ENDPOINT)
  }

  getParticipationSearch(IdEvento:number,idsUsers:Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones?no_paginate=&idEvento=${IdEvento}&idsUsuarios=${encodeURIComponent(idsUsers.join(' '))}`
    //console.log("ENDPOINT",ENDPOINT)
    return this.http.get(ENDPOINT)
  }

  getParticipationById(IdEvento:number,IdPart:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones?no_paginate=&ids=${IdPart}&idEvento=${IdEvento}`
    return this.http.get(ENDPOINT)
  }

  getParticipationEstatus () {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/estatusparts?no_paginate=`
    return this.http.get(ENDPOINT)
  }

  addParticipation (tipoPart:number,usuarioId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones/create`
    return this.http.post(ENDPOINT,{id_tipo_participacion:tipoPart,id_usuario:usuarioId})
  }

  updateParticipation (participacionId:number,estatusId?:number, tipoParticipacionId?: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones/${participacionId}/update`
    let datos = new FormData();
    if (estatusId)
      datos.append('id_estatus_participacion',estatusId.toString());
    if (tipoParticipacionId)
      datos.append('id_tipo_participacion', tipoParticipacionId.toString());
    return this.http.post(ENDPOINT,datos)
  }

  deleteParticipation (partId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones/${partId}/delete`
    return this.http.delete(ENDPOINT)
  }

  /** se guarda precentaciones **/

  addPresentacion (eventoId:number,presenId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${eventoId}/tipspresent/ligar?ids=${presenId}`
    return this.http.post(ENDPOINT,{ids:presenId})
  }

  /** se cargan los endpoints de trabajos **/

  getWorkListAdminSugerencias(ids?: Array<number>)
  {
    const endpointUrl = `${this.globals.backend_base_url}/scicom/trabajos?no_paginate=&ids=${encodeURIComponent(ids.join(' '))}`
    return this.http.get(endpointUrl)
  }

  getWorkListAdmin () {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos?no_paginate=`
    return this.http.get(ENDPOINT)
  }

  getWorkByEvent (idEvento:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos?no_paginate=&idEvento=${idEvento}&conArConoc=`
    return this.http.get(ENDPOINT)
  }

  getWorkByPart (idEvento:number,idParticiacion:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos?no_paginate=&idEvento=${idEvento}&idsPart=${idParticiacion}&conArConoc=&conOds`
    return this.http.get(ENDPOINT)
  }

  getWorkByParticipations (idEvento:number,idsParticiations:Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos?no_paginate=&idEvento=${idEvento}&idsPart=${encodeURIComponent(idsParticiations.join(' '))}&conArConoc=`
    return this.http.get(ENDPOINT)
  }

  addWorkToParticipation (idPart:number,idEstatus:number,idtipo:number,idPresentacion:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/create`
    return this.http.post(ENDPOINT,{id_participacion:idPart,id_estatus_trabajo:idEstatus,id_tipo_trabajo:idtipo,id_tipo_presentacion:idPresentacion})
  }

  updateWork(idWork:number,idFont:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idWork}/update`
    return this.http.post(ENDPOINT,{id_fuente:idFont})
  }

  updateWorkWithRefrendo(idWork:number,idFont:number,refrendo:any) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idWork}/update`
    return this.http.post(ENDPOINT,{id_fuente:idFont,refrendado_api_uvmunitec:refrendo})
  }

  updateConfWithRefrendo(idWork:number,refrendo:any) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idWork}/update`
    return this.http.post(ENDPOINT,{refrendado_api_uvmunitec:refrendo})
  }

  deleteWork (idWork:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idWork}/delete`
    return this.http.delete(ENDPOINT)
  }

  /** se cargan los endpoints de fuentes**/

  searchFonts(criterio:string){
    var anio = (new Date).getFullYear();
    const ENDPOINT = `${this.globals.backend_base_url}/fuentes/simples?no_paginate=&search=${criterio}&scopusEnAnio=${anio}`
    return this.http.get(ENDPOINT)
  }

  getFontsByWorks(idWorks:string){
    var anio = (new Date).getFullYear();
    const ENDPOINT = `${this.globals.backend_base_url}/fuentes/simples?no_paginate=&scopusEnAnio=${anio}&idsTrabScicom=${idWorks}`
    return this.http.get(ENDPOINT)
  }

  /** se cargan los endpoints de ares ade conocimiento **/

  getODS(){
    const ENDPOINT = `${this.globals.backend_base_url}/objsdesarrollosostenible`
    return this.http.get(ENDPOINT)
  }

  addODS(idTrabajo:number,idsODS:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idTrabajo}/ods/ligar?ids=${idsODS}`
    return this.http.post(ENDPOINT,{})
  }

  removeODS(idTrabajo:number,idsODS:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idTrabajo}/ods/desligar?ids=${idsODS}`
    return this.http.post(ENDPOINT,{})
  }

  addODSToEvent(idTrabajo:number,idsODS:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${idTrabajo}/ods/ligar?ids=${idsODS}`
    return this.http.post(ENDPOINT,{})
  }

  removeODSToEvent(idTrabajo:number,idsODS:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos/${idTrabajo}/ods/desligar?ids=${idsODS}`
    return this.http.post(ENDPOINT,{})
  }


  updateCartel(idWork:number,refrendo:any,lugar:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idWork}/update`
    return this.http.post(ENDPOINT,{refrendado_api_uvmunitec:refrendo,lugar_obtenido_cartel_uvmunitec:lugar})
  }

  updateCartelLugar(idWork:number,lugar:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idWork}/update`
    return this.http.post(ENDPOINT,{lugar_obtenido_cartel_uvmunitec:lugar})
  }

  /** se cargan los endpoints de ODS **/

  getArea(){
    const ENDPOINT = `${this.globals.backend_base_url}/areas_conocimiento?no_paginate=`
    return this.http.get(ENDPOINT)
  }

  addArea(idTrabajo:number,idArea:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idTrabajo}/areaconoc/ligar?ids=${idArea}`
    return this.http.post(ENDPOINT,{ids:idArea})
  }

  removeArea(idTrabajo:number,idArea:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/${idTrabajo}/areaconoc/desligar?ids=${idArea}`
    return this.http.post(ENDPOINT,{ids:idArea})
  }



  /** se cargan los endpoints de trabajo de estatus **/

  getWorkEstausList(){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/estatustrabajo?no_paginate=`
    return this.http.get(ENDPOINT)
  }

  /** se cargan los endpoints de trabajo de estatus **/

  getMetadatosTrabajosAdmin(idsTrabajos?: Array<number>)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/conjmetatrabajos?no_paginate=&idsTrab=${encodeURIComponent(idsTrabajos.join(' '))}`
    return this.http.get(endpointUrl)
  }

  getMetadatosByWorkIds(idEvento:number,idsWork:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/conjmetatrabajos?no_paginate=&idEvento=${idEvento}&idsTrab=${idsWork}`
    return this.http.get(ENDPOINT)
  }

  getMetadatosByWorksAndIdiomId(idEvento:number,idsWorks:string,idsIdiomas:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/conjmetatrabajos?no_paginate=&idEvento=${idEvento}&idsTrab=${idsWorks}&idsIdiom=${idsIdiomas}`
    return this.http.get(ENDPOINT)
  }

  addMetadatos(idTabajo:number,idIdioma:number,titulo?:string,resumen?:string,url?:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/conjmetatrabajos/create`
    let datos = new FormData();
    datos.append('id_trabajo',idTabajo.toString());
    datos.append('id_idioma',idIdioma.toString());
    if(titulo!='' && titulo){datos.append('titulo',titulo);}
    if(resumen!='' && resumen){datos.append('resumen',resumen);}
    if(url!='' && url){datos.append('url',url);}
    return this.http.post(ENDPOINT,datos)
  }

  updateMetadatos(idMeta:number,titulo?:string,resumen?:string,url?:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/conjmetatrabajos/${idMeta}/update`
    let datos = new FormData();
    if(titulo!=null){datos.append('titulo',titulo);}
    if(resumen!=null){datos.append('resumen',resumen);}
    if(url!=null){datos.append('url',url);}
    return this.http.post(ENDPOINT,datos)
  }

  getAuthorByWorks(eventoId:number,worksId:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo?no_paginate=&idEvento=${eventoId}&idsTrab=${worksId}`
    return this.http.get(ENDPOINT)
  }

  addAuthor(idTrabajo:number,nombre:string,email:string,orcid?:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/create`
    let datos = new FormData();
    datos.append('id_trabajo',idTrabajo.toString());
    datos.append('nombre',nombre);
    datos.append('correo',email);
    if(orcid!=''){datos.append('orcid',orcid);}
    //console.log("ENDPOINT",ENDPOINT)
    //console.log("datos",datos)
    return this.http.post(ENDPOINT,datos)
  }

  addWorkAuthor(idTrabajo:number,nombre:string,correo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/create`
    //console.log("ENDPOINT",ENDPOINT)
    //console.log("datos",idTrabajo,nombre,correo)
    let datos = new FormData();
    datos.append('id_trabajo',idTrabajo.toString());
    datos.append('nombre',nombre);
    if(correo!='' && correo!=null && correo){datos.append('correo',correo);}
    return this.http.post(ENDPOINT,datos)
  }

  addAuthorToWork(idTrabajo:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/create`
    return this.http.post(ENDPOINT,{id_trabajo:idTrabajo})
  }

  addInstitucionToAutor(idAutor:number,idInst:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${idAutor}/rors/ligar?ids=${idInst}`
    return this.http.post(ENDPOINT,{ids:idInst})
  }

  addRorsToAutor(idAutor:number,idsInst:Array<number>){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${idAutor}/rors/ligar?ids=${encodeURIComponent(idsInst.join(' '))}`
    return this.http.post(ENDPOINT,{})
  }

  removeInstitucionToAutor(idAutor:number,idsInst:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${idAutor}/rors/desligar?ids=${idsInst}`
    return this.http.post(ENDPOINT,{ids:idsInst})
  }

  removeRorsToAutor(idAutor:number,idsInst:Array<number>){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${idAutor}/rors/desligar?ids=${encodeURIComponent(idsInst.join(' '))}`
    return this.http.post(ENDPOINT,{})
  }

  addCampusToAutor(idAutor:number,idCamp:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${idAutor}/campus/ligar?ids=${idCamp}`
    return this.http.post(ENDPOINT,{ids:idCamp})
  }

  removeCampusToAutor(idAutor:number,idsCamp:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${idAutor}/campus/desligar?ids=${idsCamp}`
    return this.http.post(ENDPOINT,{ids:idsCamp})
  }

  updateAutorWork(autorId:number,orcid:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${autorId}/update`
    return this.http.post(ENDPOINT,{orcid:orcid})
  }

  updateAuthorOfCartel(autorId:number,nombre:string,correo:string,carreraId:number,semestre:string,genero:string,puesto:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${autorId}/update`
    return this.http.post(ENDPOINT,{nombre:nombre,correo:correo,id_programa_estudio:carreraId,semest_cuatrimest_uvmutec:semestre,genero:genero,puesto:puesto})
  }

  updateAuthorOfConferencia(autorId:number,nombre:string,correo:string,genero:string,puesto:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${autorId}/update`
    return this.http.post(ENDPOINT,{nombre:nombre,correo:correo,genero:genero,puesto:puesto})
  }

  updateAutorWorkDatos(autorId:number,nombre:string,correo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${autorId}/update`
    return this.http.post(ENDPOINT,{nombre:nombre,correo:correo})
  }

  deleteAutorToWork(idAuthor:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/${idAuthor}/delete`
    return this.http.delete(ENDPOINT)
  }

  addEvaluacionToWork(idTipoEvaluacion:any, descripcion:string, idEvento:number, idTrebajo:number,aprobatoria:any){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/evals/create`
    return this.http.post(ENDPOINT, {id_tipo_evaluacion:idTipoEvaluacion,descripcion:descripcion,id_evento:idEvento,id_trabajo:idTrebajo,aprobatoria:aprobatoria})
  }

  emitEventEvaluationTypesChangedEvent () {
    this.eventEvaluationTypesChanged.emit();
  }

  emitEventPayTypesChangedEvent () {
    this.eventPayTypesChanged.emit();
  }

  getProductScintra () {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/conjmetatrabajos/similarscintraproducts`
    return this.http.get(ENDPOINT)
  }

  getSugerenciasProductScintra (idsNP?: Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/myzone/productos?idsProductos=${encodeURIComponent(idsNP.join(' '))}&todo_dataset=&no_paginate`
    return this.http.get(ENDPOINT)
  }

  asignProductosToMetadatos (idMetadatos:number,idProductos:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/conjmetatrabajos/${idMetadatos}/productos/${idProductos}/ligar`
    return this.http.post(ENDPOINT,{})
  }

  generateAndAsignProductosToMetadatos (idMetadatos:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/conjmetatrabajos/${idMetadatos}/productos/generarligar`
    return this.http.post(ENDPOINT,{})
  }

  addNoEmpleadoToUser (usuarioId:number,noEmpleado:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/update`
    const numEmpleado = noEmpleado.toString()
    return this.http.post(ENDPOINT,{num_empleado:numEmpleado})
  }

  updateUser(usuarioId:number,noEmpleado:number,noCelular:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios/${usuarioId}/update`
    const numEmpleado = noEmpleado.toString()
    const numCelular = noCelular.toString()
    return this.http.post(ENDPOINT,{num_empleado:numEmpleado,num_celular:numCelular})
  }

  getIndicadores() {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/indicadores?no_paginate=`
    return this.http.get(ENDPOINT,{})
  }

  getObjetivosIndicadores(eventoId:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/objsindicador?no_paginate=&idsEvento=${eventoId}`
    return this.http.get(ENDPOINT,{})
  }

  addObjsIndicador(Descripcion:string,ValorObjetivo:number,Tipo:string,participacionId:number,IndicadorId:number,RealValueUrl:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/objsindicador/create`
    return this.http.post(ENDPOINT,{descripcion:Descripcion,valor_objetivo:ValorObjetivo,tipo:Tipo,
      id_participacion:participacionId,id_indicador:IndicadorId,real_value_url:RealValueUrl})
  }

  updateObjsIndicador(objetivoId:number,Descripcion:string,ValorObjetivo:number,Tipo:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/objsindicador/${objetivoId}/update`
    return this.http.post(ENDPOINT,{descripcion:Descripcion,valor_objetivo:ValorObjetivo,tipo:Tipo})
  }

  getProgramasEstudioByRors(idsRors:Array<number>,search:string) {
    const ENDPOINT = `${this.globals.backend_base_url}/programasestudio?no_paginate=&search=${search}&idsRor=${encodeURIComponent(idsRors.join(' '))}`
    return this.http.get(ENDPOINT)
  }

  getProgramasEstudioByIds(idsRors:Array<number>,ids:Array<number>) {
    const ENDPOINT = `${this.globals.backend_base_url}/programasestudio?no_paginate=&idsRor=${encodeURIComponent(idsRors.join(' '))}&ids=${encodeURIComponent(ids.join(' '))}`
    return this.http.get(ENDPOINT)
  }

  getRegistrosToExcel(eventoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/custom/registros_foro_uvm_encuento_utec_agrupados_detallados?idEvento=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  getRegistrosToExcelRep2(rorId:number,fechaini:string,fechafin:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/custom/stats_reporte_foros_uvm_carteles_estudiantes_por_institucion_agrupado_por_campus?idRor=${rorId}&fechaInic=${fechaini}&fechaFin=${fechafin}`
    return this.http.get(ENDPOINT)
  }

  getRegistrosToExcelRep3(rorId:number,fechaini:string,fechafin:string,eventoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/custom/stats_reporte_foros_uvm_carteles_estudiantes_por_ciclo_agrupado_por_campus?idRor=${rorId}&fechaInic=${fechaini}&fechaFin=${fechafin}&idsEvento=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  getRegistrosToExcelRep4(rorId:number,fechaini:string,fechafin:string,eventoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/custom/stats_reporte_foros_uvm_carteles_estudiantes_por_ciclo?idRor=${rorId}&fechaInic=${fechaini}&fechaFin=${fechafin}&idsEvento=${eventoId}`
    return this.http.get(ENDPOINT)
  }

  getReporteCiclosToExcel(rorId:number,fechaini:string,fechafin:string,idsCiclos:Array<number>){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/custom/stats_reporte_foros_uvm_carteles_estudiantes_por_ciclo_agrupado_por_campus?idRor=${rorId}&fechaInic=${fechaini}&fechaFin=${fechafin}&idsEvento=${encodeURIComponent(idsCiclos.join(' '))}`
    return this.http.get(ENDPOINT)
  }

  getReporteCiclosToExcelSinCiclos(rorId:number,fechaini:string,fechafin:string){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/custom/stats_reporte_foros_uvm_carteles_estudiantes_por_ciclo_agrupado_por_campus?idRor=${rorId}&fechaInic=${fechaini}&fechaFin=${fechafin}`
    return this.http.get(ENDPOINT)
  }
}
