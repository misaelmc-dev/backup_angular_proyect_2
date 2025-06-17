import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  paginateItems = (items: any, current_page: number, per_page_items: number) => {
    let page = current_page || 1,
      per_page = per_page_items || 10,
      offset = (page - 1) * per_page,

      paginatedItems = items.slice(offset).slice(0, per_page_items),
      total_pages = Math.ceil(items.length / per_page);
    return {
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: items.length,
      total_pages: total_pages,
      data: paginatedItems
    };
  }

  getInvestigadoresList(idInst?: number) {
    let ENDPOINT = `${this.globals.backend_base_url}/investigadores/listasimple?no_paginate=`;
    if (idInst) {
      ENDPOINT += `&idsInstSc=${idInst}`
    }
    return this.http.get(ENDPOINT);
  }

  getClasificacionConacyt() {
    const ENDPOINT = `${this.globals.backend_base_url}/fuentes/clasifs-conacyt?no_paginate=`;
    return this.http.get(ENDPOINT);
  }

  getColleges = (idInst?: number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/colegios?no_paginate=`;
    if (idInst) {
      ENDPOINT += `&idsInst=${idInst}`
    }
    return this.http.get(ENDPOINT);
  }

  getTipoProductos = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos/simples`;
    return this.http.get(ENDPOINT);
  }

  getInstitutions = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/instituciones/simples`;
    return this.http.get(ENDPOINT);
  }

  getCampus = (idInst?: number) => {
    let endpoint = `${this.globals.backend_base_url}/campus/simples?no_paginate=`;
    if (idInst)
      endpoint += '&idsInst=' + idInst
    return this.http.get(endpoint);
  }

  getCentrosInvestigacion = (idInst?: number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/centros_invest?no_paginate=`;
    if (idInst) {
      ENDPOINT += `&idsInst=${idInst}`
    }
    return this.http.get(ENDPOINT);
  }

  getTipoProyectos = () => {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto`;
    return this.http.get(ENDPOINT);
  }

  getAlumnos = (idInst?: number) => {
    let endpoint = `${this.globals.backend_base_url}/alumnos?no_paginate=`;
    if (idInst)
      endpoint += '&idsInstSc=' + idInst
    return this.http.get(endpoint);
  }



}
