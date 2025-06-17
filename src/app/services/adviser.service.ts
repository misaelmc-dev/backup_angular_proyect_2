import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {GlobalsVars} from '../global/globals-vars';

@Injectable({
  providedIn: 'root',
})
export class AdviserService {
  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getAdviserBannerData(adviserId: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/headerdata`;
    return this.http.get(ENDPOINT);
  }

  getLinesByAdviser(adviserId: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/lineas`;
    return this.http.get(ENDPOINT);
  }

  getCampusByAdviser(adviserId: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/campus`;
    return this.http.get(ENDPOINT);
  }

  getYearsByAdviser(adviserId: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/anios/productivos`;
    return this.http.get(ENDPOINT);
  }

  getGraph1Data = (criteria: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(ENDPOINT);
  }

  getGraph5ProdYearByVisibility = (adviserId: string, colegioId?: number, campusId?: number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/visibilidad/totales/anual`;
    if (colegioId)
      ENDPOINT += `?id_colegio=${colegioId}`
    if (campusId && !colegioId)
      ENDPOINT += `?id_campus=${campusId}`
    if (campusId && colegioId)
      ENDPOINT += `&id_campus=${campusId}`
    return this.http.get(ENDPOINT);
  };

  getGraph2Data = (criteria: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(ENDPOINT);
  };

  getGraph3Data = (criteria: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(ENDPOINT);
  };

  getGraph4Data = (criteria: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    //console.log(ENDPOINT);
    return this.http.get(ENDPOINT);
  };

  getImpactGraph1(criteria: string) {
    //const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/impacto/graph1?por_anio&por_tipo&por_visibilidad`;
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(ENDPOINT);
  }

  getImpactGraph2Data = (adviserId: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/impacto/graph2`;
    return this.http.get(ENDPOINT);
  };

  getImpactGraph3Data = (adviserId: string, colegioId?: number, campusId?: number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/impacto/graph3?por_anio&por_linea&indicador`;
    if (colegioId)
      ENDPOINT += `&id_colegio=${colegioId}`
    if (campusId)
      ENDPOINT += `&id_campus=${campusId}`
    return this.http.get(ENDPOINT);
  };

  findResearcher(adviserId: string, text: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/investigadores?search=${encodeURIComponent(text)}`;
    return this.http.get(ENDPOINT);
  }

  getRankingProductivesResearcher(adviserId: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/ranking/graph3`;
    return this.http.get(ENDPOINT);
  }

  getRankingProductivesResearcherFilter(criteria: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(ENDPOINT);
  }

  getRankingImpactResearcher(adviserId: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/ranking/graph4`;
    return this.http.get(ENDPOINT);
  }

  getRankingImpactResearcherFilter(criteria: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(ENDPOINT);
  }

  getAniosProductivos = (adviserId: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/institucion/${adviserId}/anios/productivos`;
    return this.http.get(ENDPOINT);
  }

  getMyZoneData = (criteria: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    //console.log(ENDPOINT);
    return this.http.get(ENDPOINT);
  }

  getProjectsData = (criteria: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(ENDPOINT);
  }

  getProjectDataById = (projectId: string, idInst?: number) => {
    let ENDPOINT = `${this.globals.backend_base_url}/proyectos_invest/${projectId}?con_centros=&con_instituciones=&con_lineas_invest=&con_keywords=&con_estancias_invest=&con_productos=&con_colaboradores=&con_entidades_financ=`;
    if (idInst) {
      ENDPOINT += `&id_institucion=${idInst}`
    }
    return this.http.get(ENDPOINT);
  }

  getProjectsConvocatorias = (idInst?: number) => {
    let endpoint = `${this.globals.backend_base_url}/proyectos_invest/convocatorias/obtener`;
    if (idInst)
      endpoint += '?id_institucion=' + idInst
    return this.http.get(endpoint);
  }
}
