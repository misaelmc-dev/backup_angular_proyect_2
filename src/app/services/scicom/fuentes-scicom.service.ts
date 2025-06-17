import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class FuentesScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Obtiene los fuentes de trabajo scicom desde el backend
   *
   */
  getFuentesDeTrabajo(idsTrab: Array<number>) { //todo ALTO PELIGRO
    let endpointUrl = `${this.globals.backend_base_url}/fuentes/simples?idsTrabScicom=${encodeURIComponent(idsTrab.join(' '))}&no_paginate=`
    return this.http.get(endpointUrl)
  }

  getFuentes(){
    let endpointUrl = `${this.globals.backend_base_url}/fuentes?page_size=100&page=1&conPaises=&enScopus=`
    return this.http.get(endpointUrl)
  }

  getFuentesPaises(){
    let endpointUrl = `${this.globals.backend_base_url}/paises/simples?no_paginate=`
    return this.http.get(endpointUrl)
  }

  getFuentesIdiomas(){
    let endpointUrl = `${this.globals.backend_base_url}/idiomas/simples?no_paginate=`
    return this.http.get(endpointUrl)
  }

  getFuentesAreasScimago(){
    let endpointUrl = `${this.globals.backend_base_url}/scimago/subject/areas`
    return this.http.get(endpointUrl)
  }

  getFuentesSubAreasScimago(){
    let endpointUrl = `${this.globals.backend_base_url}/scimago/subject/categories`
    return this.http.get(endpointUrl)
  }

  getFuentesFiltradas(consulta:string){
    let endpointUrl = `${this.globals.backend_base_url}/fuentes?page_size=100&page=1&conPaises=&enScopus=${consulta}`
    return this.http.get(endpointUrl)
  }

  getFuentesFiltradasByResumen(resumen:string){
    let endpointUrl = `${this.globals.backend_base_url}/fuentes/suggest?page_size=100&page=1&keywords=${resumen}`
    return this.http.get(endpointUrl)
  }

}

