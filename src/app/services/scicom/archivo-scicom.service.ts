import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class ArchivoScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  /**
   * Obtiene los metadatos de archivos scicom desde el backend
   *
   * Ing. JAEG
   */
  getMetadatosDeArchivosScicom(idEvento: number, ids?: Array<number>, idsTipsArch?: Array<number>,
                               idsTrab?: Array<number>, idsAct?: Array<number>, idsPag?: Array<number>,
                               idsEval?: Array<number>, searchTerm?: string)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/archivos?no_paginate=&idEvento=${idEvento}`
    if (ids) endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}`
    if (idsTipsArch) endpointUrl += `&idsTipsArch=${encodeURIComponent(idsTipsArch.join(' '))}`
    if (idsTrab) endpointUrl += `&idsTrab=${encodeURIComponent(idsTrab.join(' '))}`
    if (idsAct) endpointUrl += `&idsAct=${encodeURIComponent(idsAct.join(' '))}`
    if (idsPag) endpointUrl += `&idsPag=${encodeURIComponent(idsPag.join(' '))}`
    if (idsEval) endpointUrl += `&idsEval=${encodeURIComponent(idsEval.join(' '))}`
    if (searchTerm) endpointUrl += `&search=${encodeURIComponent(searchTerm)}`
    let resp = this.http.get(endpointUrl)
    return resp
  }

  /**
   * Obtiene los metadatos de archivos scicom desde el backend
   *
   */
  getArchivosEvaluacionesScicom(idEvento: number, idsTipsArch?: Array<number>)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/archivos?no_paginate=&idEvento=${idEvento}`
    if (idsTipsArch) endpointUrl += `&idsTipsArch=${encodeURIComponent(idsTipsArch.join(' '))}`
    return this.http.get(endpointUrl)
  }

  /**
   * Descarga un archivo scicom desde el backend
   *
   * Ing. JAEG
   */
  descargarArchivoScicom = (uri: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/archivos/${uri}/descargar`;
    return this.http.get(ENDPOINT, { responseType: "blob"} );
  }
}
