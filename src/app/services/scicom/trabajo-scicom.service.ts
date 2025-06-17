import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TrabajoScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  /**
   * Obtiene los trabajos scicom desde el backend
   *
   * Ing. JAEG
   */
  getTrabajos(idEvento: number, ids?: Array<number>, idsPart?: Array<number>, idsEstTrab?: Array<number>,
              idsTipsTrab?: Array<number>, idsTipsPres?: Array<number>, idsArConoc?: Array<number>,
              idsUsuarios?: Array<number>, idsTipPart?: Array<number>, idsEstPart?: Array<number>,
              conArConoc?: boolean )
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/trabajos?no_paginate=&idEvento=${idEvento}`
    if (ids) endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}`
    if (idsPart) endpointUrl += `&idsPart=${encodeURIComponent(idsPart.join(' '))}`
    if (idsEstTrab) endpointUrl += `&idsEstTrab=${encodeURIComponent(idsEstTrab.join(' '))}`
    if (idsTipsTrab) endpointUrl += `&idsTipsTrab=${encodeURIComponent(idsTipsTrab.join(' '))}`
    if (idsTipsPres) endpointUrl += `&idsTipsPres=${encodeURIComponent(idsTipsPres.join(' '))}`
    if (idsArConoc) endpointUrl += `&idsArConoc=${encodeURIComponent(idsArConoc.join(' '))}`
    if (idsUsuarios) endpointUrl += `&idsUsuarios=${encodeURIComponent(idsUsuarios.join(' '))}`
    if (idsTipPart) endpointUrl += `&idsTipPart=${encodeURIComponent(idsTipPart.join(' '))}`
    if (idsEstPart) endpointUrl += `&idsEstPart=${encodeURIComponent(idsEstPart.join(' '))}`
    if (conArConoc) endpointUrl += `&conArConoc=`
    return this.http.get(endpointUrl)
  }

  /**
   * Obtiene los tipos de trabajos scicom desde el backend
   *
   */
  getTiposTrabajos(idsTipoTrabajos?: Array<number> )
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/tipstrab?no_paginate=&ids=${encodeURIComponent(idsTipoTrabajos.join(' '))}`
    return this.http.get(endpointUrl)
  }

  getTiposTrabajo(eventoId:number,idTipoEvento:number ) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/tipstrab?no_paginate=&idsEvent=${eventoId}&idsTipEvPerm=${idTipoEvento}`
    return this.http.get(endpointUrl)
  }

  /**
   * Obtiene los tipos de trabajo posibles en sistema scicom desde el backend
   *
   * Ing. JAEG
   */
  getTiposDeTrabajo(ids?: Array<number>, idsEvent?: Array<number>, searchTerm?: string)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/tipstrab?no_paginate=`
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

  /**
   * Obtiene los conjuntos de metadatos de trabajo scicom desde el backend
   *
   * Ing. JAEG
   */
  getConjuntosDeMetadatosDeTrabajo(idEvento: number, ids?: Array<number>, idsTrab?: Array<number>,
                                   idsIdiom?: Array<number>, searchTerm?: string)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/conjmetatrabajos?no_paginate=&idEvento=${idEvento}`
    if (ids){ endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}` }
    if (idsTrab){ endpointUrl += `&idsTrab=${encodeURIComponent(idsTrab.join(' '))}` }
    if (idsIdiom){ endpointUrl += `&idsIdiom=${encodeURIComponent(idsIdiom.join(' '))}` }
    if (searchTerm){ endpointUrl += `&search=${encodeURIComponent(searchTerm)}` }
    return this.http.get(endpointUrl)
  }

  /**
   * Obtiene los autores de trabajo scicom desde el backend
   *
   * Ing. JAEG
   */
  getAutoresDeTrabajo(idEvento: number, ids?: Array<number>, idsTrab?: Array<number>, searchTerm?: string) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/autorestrabajo?no_paginate=&idEvento=${idEvento}`
    if (ids) endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}`
    if (idsTrab) endpointUrl += `&idsTrab=${encodeURIComponent(idsTrab.join(' '))}`
    if (searchTerm) endpointUrl += `&search=${encodeURIComponent(searchTerm)}`
    return this.http.get(endpointUrl)
  }

  getAutoresDeTrabajoAdmin(idsTrab?: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/autorestrabajo?no_paginate=&idsTrab=${encodeURIComponent(idsTrab.join(' '))}`
    return this.http.get(endpointUrl)
  }

}
