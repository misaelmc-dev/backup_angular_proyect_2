import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {GlobalsVars} from '../global/globals-vars';
import {END} from "@angular/cdk/keycodes";

@Injectable({
  providedIn: 'root'
})
export class ResearcherService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  /**
   * Consulta los investigadores
   */
  getSimple(id_institucion?: any, soloConProyectInvest?: boolean, idsInvestigadores?: Array<any>, searchTerm?: string,
            soloConProducto?: boolean, soloConCita?: boolean)
  {
    let endpoint = `${this.globals.backend_base_url}/investigadores/listasimple?no_paginate=&test=0`
    if (id_institucion)
      endpoint += `&idsInstSc=${encodeURIComponent(id_institucion)}`;
    if (soloConProyectInvest)
      endpoint += `&soloConProyectInvest=`;
    if (idsInvestigadores)
      endpoint += `&idsInvestigadores=${encodeURIComponent(idsInvestigadores.join(' '))}`;
    if (searchTerm)
      endpoint += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    if (soloConProducto)
      endpoint += `&soloConProducto=`;
    if (soloConCita)
      endpoint += `&soloConCita=`;
    return this.http.get(endpoint)
  }

  getResearcherBannerData = (researcherId: string) => {
    const GET_RESEARCHER_DATA_ENDPOINT = `${this.globals.backend_base_url}/investigador/${researcherId}/headerdata`;
    return this.http.get(GET_RESEARCHER_DATA_ENDPOINT);
  }

  getProductByResearcher = (criteria: string) => {
    const GET_RESEARCHER_PRODUCTS_ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    //console.log(GET_RESEARCHER_PRODUCTS_ENDPOINT);

    return this.http.get(GET_RESEARCHER_PRODUCTS_ENDPOINT);
  }

  orderDataByType(researcherId: string, mode: string) {
    const ORDER_DATA_BY_TYPE = `${this.globals.backend_base_url}/investigador/${researcherId}/productos?orderByType=${mode}`;
    return this.http.get(ORDER_DATA_BY_TYPE);
  }

  orderDataByDate(researcherId: string, mode: string) {
    const ORDER_DATA_BY_DATE = `${this.globals.backend_base_url}/investigador/${researcherId}/productos?orderByDate=${mode}`;
    return this.http.get(ORDER_DATA_BY_DATE);
  }

  orderDataByCites(researcherId: string, mode: string) {
    const ORDER_DATA_BY_TITLE = `${this.globals.backend_base_url}/investigador/${researcherId}/productos?orderByCites=${mode}`;
    return this.http.get(ORDER_DATA_BY_TITLE);
  }

  getSummaryTotals(researcherId: string) {
    const SUMMARY_DATA = `${this.globals.backend_base_url}/investigador/${researcherId}/totales`;
    return this.http.get(SUMMARY_DATA);
  }

  getProductByRangeYear(researcherId: string, since: number, to: number) {
    const RANGE_DATA = `${this.globals.backend_base_url}/investigador/${researcherId}/productos?anioDesde=${since}&&anioHasta=${to}`;
    return this.http.get(RANGE_DATA);
  }

  getChartTotals(researcherId: string) {
    const TOTAL_DATA = `${this.globals.backend_base_url}/investigador/${researcherId}/citas/tipos/totales`;
    return this.http.get(TOTAL_DATA);
  }

  getProductQuotesByResearcher = (criteria: string) => {
    const GET_RESEARCHER_PRODUCTS_ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(GET_RESEARCHER_PRODUCTS_ENDPOINT);
  }

  getCoauthors = (researcherId: string) => {
    return this.http.get(
      `${this.globals.backend_base_url}/colaboracion?origen_por_investigador=&destino_por_investigador=&investigadores_orig=${researcherId}`
    );
  }

  getTotalesDeColaboracion (id: number) {
    return this.http.get(
      `${this.globals.backend_base_url}/colaboracion?origen_por_investigador=&investigadores_orig=${id}`
    )
  }

  updateProfilePicture(researcherId: string, selectedFile: any) {
    const UPDATE_PROFILE_PIC_ENDPOINT = `${this.globals.backend_base_url}/investigador/${researcherId}/subirfoto`;
    const uploadData = new FormData();
    uploadData.append('foto', selectedFile, selectedFile.name);
    return this.http.post(UPDATE_PROFILE_PIC_ENDPOINT, uploadData);
  }

  getVisibilityTotals (id: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/investigador/${id}/fuentes/totales`
    return this.http.get(ENDPOINT)
  }

  getInstitutionHeaderData(institutionId: string) {
    const SUMMARY_DATA = `${this.globals.backend_base_url}/institucion/${institutionId}/headerdata`;
    return this.http.get(SUMMARY_DATA);
  }

  getProductTypeTotals(researcherId: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/investigador/${researcherId}/tipos/totales`;
    return this.http.get(ENDPOINT);
  }

  getResearcherList(idInst?: number, searchTerm?: string) {
    let ENDPOINT = `${this.globals.backend_base_url}/investigadores/listasimple?no_paginate=`;
    if (idInst) {
      ENDPOINT += `&idsInstSc=${idInst}`
    }
    if (searchTerm) {
      ENDPOINT += `&searchTerm=${searchTerm}`
    }
    return this.http.get(ENDPOINT);
  }

}
