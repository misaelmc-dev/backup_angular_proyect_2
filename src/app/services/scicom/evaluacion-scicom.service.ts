import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class EvaluacionScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  /**
   * Obtiene las evaluaciones scicom desde el backend
   *
   * Ing. JAEG
   */
  getEvaluaciones(idEvento: number, idsTipEval?: Array<number>,idsTrab?: Array<number>, soloAprob: boolean = false,
                  soloNoAprob: boolean = false, ids?: Array<number>,
                  idsUsuSciEvaldr?: Array<number>, idsUsuSciEvaldo?: Array<number>)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/evals?no_paginate=&idEvento=${idEvento}`
    if (soloAprob) endpointUrl += `&soloAprob=`
    if (soloNoAprob) endpointUrl += `&soloNoAprob=`
    if (ids) endpointUrl += `&ids=${encodeURIComponent(ids.join(' '))}`
    if (idsUsuSciEvaldr) endpointUrl += `&idsUsuSciEvaldr=${encodeURIComponent(idsUsuSciEvaldr.join(' '))}`
    if (idsUsuSciEvaldo) endpointUrl += `&idsUsuSciEvaldo=${encodeURIComponent(idsUsuSciEvaldo.join(' '))}`
    if (idsTipEval) endpointUrl += `&idsTipEval=${encodeURIComponent(idsTipEval.join(' '))}`
    if (idsTrab) endpointUrl += `&idsTrab=${encodeURIComponent(idsTrab.join(' '))}`
    return this.http.get(endpointUrl)
  }


  /**
   * Obtiene los tipos de evaluación disponibles en sistema scicom desde el backend
   *
   * Ing. JAEG
   */
  getTiposDeEvaluacion(ids?: Array<number>, idsEvent?: Array<number>, searchTerm?: string)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/tipseval?no_paginate=`
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
