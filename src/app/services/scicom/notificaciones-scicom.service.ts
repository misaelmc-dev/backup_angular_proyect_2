import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class NotificacionesScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  sendNotificationAddCampusEvento (idEvento: number, idCampus:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addCampusEvento&idEvento=${idEvento}&idCampus=${idCampus}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelCampusEvento (idEvento: number, idCampus:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delCampusEvento&idEvento=${idEvento}&idCampus=${idCampus}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddColabEvento (idUsuScicom: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addColabEvento&idUsuScicom=${idUsuScicom}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationEditColabEvento (idUsuScicom: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=editColabEvento&idUsuScicom=${idUsuScicom}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelColabEvento (idUsuScicom: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delColabEvento&idUsuScicom=${idUsuScicom}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationEditDatGenEvento (idEvento: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=editDatGenEvento&idEvento=${idEvento}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelEvento (idEvento: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delEvento&idEvento=${idEvento}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationEditFechasDurEvento (idEvento: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=editFechasDurEvento&idEvento=${idEvento}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationEditFechasRegPartConTrabEvento (idEvento: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=editFechasRegPartConTrabEvento&idEvento=${idEvento}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddParticipEvento (idParticipacion: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addParticipEvento&idParticipacion=${idParticipacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelParticipEvento (idParticipacion: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delParticipEvento&idParticipacion=${idParticipacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddParticipForUvmEncUtecEvento (idParticipacion: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addParticipForUvmEncUtecEvento&idParticipacion=${idParticipacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelParticipForUvmEncUtecEvento (idParticipacion: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delParticipForUvmEncUtecEvento&idParticipacion=${idParticipacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddTipEvalEvento (idEvento: number, idTipoEvaluacion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addTipEvalEvento&idEvento=${idEvento}&idTipoEvaluacion=${idTipoEvaluacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelTipEvalEvento (idEvento: number, idTipoEvaluacion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delTipEvalEvento&idEvento=${idEvento}&idTipoEvaluacion=${idTipoEvaluacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddTipPagEvento (idEvento: number, idTipoPago:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addTipPagEvento&idEvento=${idEvento}&idTipoPago=${idTipoPago}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelTipPagEvento (idEvento: number, idTipoPago:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delTipPagEvento&idEvento=${idEvento}&idTipoPago=${idTipoPago}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationEditTipPagEvento (idEvento: number, idTipoPago:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=editTipPagEvento&idEvento=${idEvento}&idTipoPago=${idTipoPago}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddTipPartEvento (idEvento: number, idTipoParticipacion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addTipPartEvento&idEvento=${idEvento}&idTipoParticipacion=${idTipoParticipacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelTipPartEvento (idEvento: number, idTipoParticipacion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delTipPartEvento&idEvento=${idEvento}&idTipoParticipacion=${idTipoParticipacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddTipTrabEvento (idEvento: number, idTipoTrabajo:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addTipTrabEvento&idEvento=${idEvento}&idTipoTrabajo=${idTipoTrabajo}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationDelTipTrabEvento (idEvento: number, idTipoTrabajo:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=delTipTrabEvento&idEvento=${idEvento}&idTipoTrabajo=${idTipoTrabajo}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddEvento (idEvento: number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addEvento&idEvento=${idEvento}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddEvalTrabEvento (idEvento: number, idEvaluacion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addEvalTrabEvento&idEvento=${idEvento}&idEvaluacion=${idEvaluacion}`
    return this.http.post(ENDPOINT, {})
  }

  sendNotificationAddPagoSalTrabEvento (idEvento: number, idPago:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/notifs/send?codNotif=addPagoSalTrabEvento&idEvento=${idEvento}&idPago=${idPago}`
    return this.http.post(ENDPOINT, {})
  }
}
