import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  /**
   * Consulta el endpoint de colaboración según los parámtros indicados
   * @param origen 5 posibles => instituciones, investigadores, lineas, colegios, campus (Debe venir al menos uno)
   * @param destinos 5 posibles => paises, instituciones, investigadores, anios, productos
   * @param institucionesOrigen Arreglo de Ids de instituciones de Scintra por las que se quiere filtrar el origen
   * @param investigadoresOrigen Arreglo de Ids de investigadores de Scintra por las que se quiere filtrar el origen
   * @param colegiosOrigen Arreglo de Ids de colegios de Scintra por las que se quiere filtrar el origen
   * @param campusOrigen Arreglo de Ids de campus de Scintra por las que se quiere filtrar el origen
   * @param lineasOrigen Arreglo de Ids de líneas de investigadción de Scintra por las que se quiere filtrar el origen
   * @param institucionesDestino
   * Arreglo de Ids ror interno y/o Ids ror oficial de las instituciones por las que se quiere filtrar el destino
   * @param filtraInvestigadoresDestino Término para filtrar los investigadores destino con respecto a su nombre y/o Orcid
   * @param aniosDestino Arreglo de años por los que se quieren filtrar los productos en colaboración destino
   * @param paisesDest Arreaglo de Ids o código ISO alfa2 de países por los que se quiere filtrar el destino
   * @param filtraProductosDestino  Término para filtrar los productos destino con respecto a su título y/o Doi
   * @param soloDestinoNacional True => solo trae colaboración con destino nacional
   * @param soloDestinoInternacional True => solo trae colaboración con destino internacional
   * @param soloDestinoInstitucional True => solo trae colaboración con destino institucional
   * @param filtraSearchTerm Filtra por término de búsqueda contra varios campos posibles del endpoint, ver detalles en docs de endpoint
   */
  getCollaborationData(origen: string,
                       destinos?: Array<string>,
                       institucionesOrigen?: Array<number>,
                       investigadoresOrigen?: Array<number>,
                       colegiosOrigen?: Array<number>,
                       lineasOrigen?: Array<number>,
                       institucionesDestino?: Array<string>,
                       aniosDestino?: Array<number>,
                       paisesDest?: Array<string>,
                       filtraInvestigadoresDestino?: string,
                       filtraProductosDestino?: string,
                       soloDestinoNacional?: boolean,
                       soloDestinoInternacional?: boolean,
                       soloDestinoInstitucional?: boolean,
                       filtraSearchTerm?: string,
                       campusOrigen?: Array<number>)
  {
    let endpointUrl = `${this.globals.backend_base_url}/colaboracion`
    //se toma el origen, solo uno
    switch(origen) {
      case 'instituciones':
        endpointUrl += '?origen_por_institucion='
        break;
      case 'investigadores':
        endpointUrl += '?origen_por_investigador='
        break;
      case 'lineas':
        endpointUrl += '?origen_por_linea='
        break;
      case 'colegios':
        endpointUrl += '?origen_por_colegio='
        break;
      case 'campus':
        endpointUrl += '?origen_por_campus='
        break;
    }
    //se toman los posibles destinos, pueden ser varios
    if (destinos) {
      destinos.forEach((dest) => {
        switch(dest) {
          case 'paises':
            endpointUrl += '&destino_por_pais='
            break;
          case 'instituciones':
            endpointUrl += '&destino_por_institucion='
            break;
          case 'investigadores':
            endpointUrl += '&destino_por_investigador='
            break;
          case 'anios':
            endpointUrl += '&destino_por_anio='
            break;
          case 'productos':
            endpointUrl += '&destino_por_producto='
            break;
        }
      })
    }
    //se añaden posibles filtros de instituciones de origen
    if (institucionesOrigen)
      endpointUrl += ('&instituciones_orig=' + encodeURIComponent(institucionesOrigen.join(' ')))
    //se añaden posibles filtros de investigadores de origen
    if (investigadoresOrigen)
      endpointUrl += ('&investigadores_orig=' + encodeURIComponent(investigadoresOrigen.join(' ')))
    //se añaden posibles filtros de colegios de origen
    if (colegiosOrigen)
      endpointUrl += ('&colegios_orig=' + encodeURIComponent(colegiosOrigen.join(' ')))
    //se añaden posibles filtros de campus de origen
    if (campusOrigen)
      endpointUrl += ('&campus_orig=' + encodeURIComponent(campusOrigen.join(' ')))
    //se añaden posibles filtros de líneas de investigación de origen
    if (lineasOrigen)
      endpointUrl += ('&lineas_orig=' + encodeURIComponent(lineasOrigen.join(' ')))
    //se añaden posibles filtros de instituciones destino
    if (institucionesDestino)
      endpointUrl += ('&instituciones_dest=' + encodeURIComponent(institucionesDestino.join(' ')))
    //se añaden posibles filtros de años destino
    if (aniosDestino)
      endpointUrl += ('&anios_dest=' + encodeURIComponent(aniosDestino.join(' ')))
    //se añaden posibles filtros de países destino
    if (paisesDest)
      endpointUrl += ('&paises_dest=' + encodeURIComponent(paisesDest.join(' ')))
    //se añade posible término de filtro por investigadores destino (ej: "Kenia", "Orozco")
    if (filtraInvestigadoresDestino)
      endpointUrl += ('&investigadores_dest=' + encodeURIComponent(filtraInvestigadoresDestino))
    //se añade posible término de filtro por productos destino (ej: "Fuzzy", "Mobile robots")
    if (filtraProductosDestino)
      endpointUrl += ('&productos_dest=' + encodeURIComponent(filtraProductosDestino))
    //se añade posible filtro de solo colaboración destino nacional
    if (soloDestinoNacional)
      endpointUrl += '&solo_dest_nacional='
    //se añade posible filtro de solo colaboración destino internacional
    if (soloDestinoInternacional)
      endpointUrl += '&solo_dest_internacional='
    //se añade posible filtro de solo colaboración destino institucional
    if (soloDestinoInstitucional)
      endpointUrl += '&solo_dest_institucional='
    //se añade posible término de filtro general (ej: "Fuzzy", "Mobile robots")
    if (filtraSearchTerm)
      endpointUrl += ('&search_term=' + encodeURIComponent(filtraSearchTerm))
   return this.http.get(endpointUrl)
  }
}
