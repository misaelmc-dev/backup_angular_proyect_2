import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class ParticipacionScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  /**
   * Obtiene las participaciones scicom desde el backend
   *
   * Ing. JAEG
   */
  getParticipaciones(idEvento: number, ids?: Array<number>, idsUsuarios?: Array<number>, idsTipPart?: Array<number>,
                     idsEstPart?: Array<number>)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/participaciones?no_paginate=&idEvento=${idEvento}`
    if (ids) endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}`
    if (idsUsuarios) endpointUrl += `&idsUsuarios=${encodeURIComponent(idsUsuarios.join(' '))}`
    if (idsTipPart) endpointUrl += `&idsTipPart=${encodeURIComponent(idsTipPart.join(' '))}`
    if (idsEstPart) endpointUrl += `&idsEstPart=${encodeURIComponent(idsEstPart.join(' '))}`
    return this.http.get(endpointUrl)
  }

  getParticipacionesAdmin(ids?: Array<number>)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/participaciones?no_paginate=&ids=${encodeURIComponent(ids.join(' '))}`
    return this.http.get(endpointUrl)
  }

  /**
   * Obtiene las tipos participaciones desde el backend
   *
   * Ing. JAEG
   */
  getTiposParticipaciones(idsTipos?: Array<number>)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/tipspart?no_paginate=&ids=${encodeURIComponent(idsTipos.join(' '))}`
    return this.http.get(endpointUrl)
  }

  /**
   * Obtiene los tipos de participación posibles en sistema scicom desde el backend
   *
   * Ing. JAEG
   */
  getTiposDeParticipacion(ids?: Array<number>, searchTerm?: string)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/tipspart?no_paginate=`
    let yaHayParams = true
    if (ids) {
      endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}`
      yaHayParams = true
    }
    if (searchTerm) {
      if (yaHayParams)
        endpointUrl += `&search=${encodeURIComponent(searchTerm)}`
      else
        endpointUrl += `?search=${encodeURIComponent(searchTerm)}`
      yaHayParams = true
    }
    return this.http.get(endpointUrl)
  }

  /**
   * Obtiene los estatus de participación posibles en sistema scicom desde el backend
   *
   * Ing. JAEG
   */
  getEstatusDeParticipacion(ids?: Array<number>, idsEvent?: Array<number>, searchTerm?: string)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/estatusparts?no_paginate=`
    let yaHayParams = true
    if (ids) {
      endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}`
      yaHayParams = true
    }
    if (idsEvent) {
      if (yaHayParams)
        endpointUrl += `&idsEvent=${encodeURIComponent(idsEvent.join(' '))}`
      else
        endpointUrl += `?idsEvent=${encodeURIComponent(idsEvent.join(' '))}`
      yaHayParams = true
    }
    if (searchTerm) {
      if (yaHayParams)
        endpointUrl += `&search=${encodeURIComponent(searchTerm)}`
      else
        endpointUrl += `?search=${encodeURIComponent(searchTerm)}`
      yaHayParams = true
    }
    return this.http.get(endpointUrl)
  }

}
