import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {GlobalsVars} from '../global/globals-vars';
import { Source } from '../interfaces/source';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  /**
   * Consulta las instituciones ror
   */
  getAllRors(idsEvento?: Array<any>, idsAutTrabScicom?: Array<any>, idsTrabScicom?: Array<any>,
             idsInvestProd?: Array<any>, idsInstScintraProd?: Array<any>, idsInstRorProd?: Array<any>,
             idsInvestCita?: Array<any>, idsInstScintraCita?: Array<any>, idsInstRorCita?: Array<any>,
             soloConProyectInvest?: boolean, soloConProduct?: boolean, soloConCita?: boolean, con_pais?: boolean, search?: boolean)
  {
    let endpoint = `${this.globals.backend_base_url}/rors/simples?no_paginate=&test=0`;
    if (idsEvento)
      endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsAutTrabScicom)
      endpoint += `&idsAutTrabScicom=${encodeURIComponent(idsAutTrabScicom.join(' '))}`;
    if (idsTrabScicom)
      endpoint += `&idsTrabScicom=${encodeURIComponent(idsTrabScicom.join(' '))}`;
    if (idsInvestProd)
      endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInstScintraProd)
      endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsInstRorProd)
      endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsInvestCita)
      endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsInstScintraCita)
      endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInstRorCita)
      endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (soloConProyectInvest)
      endpoint += `&soloConProyectInvest=`;
    if (soloConProduct)
      endpoint += `&soloConProduct=`;
    if (soloConCita)
      endpoint += `&soloConCita=`;
    if (con_pais)
      endpoint += `&con_pais=`;
    if (search)
      endpoint += `&search=`;
    return this.http.get(endpoint);
  };

  getAllPublishers = (textCriteria: string) => {
    const ALL_PUBLISHERS_ENDPOINT = `${this.globals.backend_base_url}/fuentes/publishers?no_paginate=&s=${encodeURIComponent(textCriteria)}`;
    return this.http.get(ALL_PUBLISHERS_ENDPOINT);
  };

  getAllProductsTypes = () => {
    const ALL_PRODUCT_TYPES_ENDPOINT = `${this.globals.backend_base_url}/tipos/simples`;
    return this.http.get(ALL_PRODUCT_TYPES_ENDPOINT);
  };

  getAllRights = () => {
    const ALL_RIGHTS_ENDPOINT = `${this.globals.backend_base_url}/rights`;
    return this.http.get(ALL_RIGHTS_ENDPOINT);
  };

  getAllLanguages = () => {
    const ALL_LANGUAGES_ENDPOINT = `${this.globals.backend_base_url}/idiomas/simples?no_paginate=`;
    return this.http.get(ALL_LANGUAGES_ENDPOINT);
  };

  getSearchSources = (text: string) => {
    let ALL_SOURCES_ENDPOINT = `${this.globals.backend_base_url}/fuentes?no_paginate`;
    if (text.trim().length !== 0) {
      ALL_SOURCES_ENDPOINT = `${this.globals.backend_base_url}/fuentes?search=${encodeURIComponent(text)}&no_paginate`;
    }
    return this.http.get(ALL_SOURCES_ENDPOINT);
  };

  getPagedSources(text: string,
    pageNumber: number,
    pageSize: number
  ): Observable<Source[]> {
    let ENDPOINT = `${this.globals.backend_base_url}/fuentes/simples`;
    let params = new HttpParams();
    if (text.trim().length !== 0) {
      params = params.append('search', encodeURIComponent(text));
    }
    params = params.append('page', String(pageNumber));
    params = params.append('page_size', String(pageSize));
    return this.http
      .get(ENDPOINT,
        {
          params,
        }
      )
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  getAllCountries = () => {
    const ALL_COUNTRIES_ENDPOINT = `${this.globals.backend_base_url}/paises/simples?no_paginate=`;
    return this.http.get(ALL_COUNTRIES_ENDPOINT);
  };

  createSource = (data: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/fuentes/new`;
    return this.http.post(ENDPOINT, data);
  };

  updateSource = (id: string, data: any) => {
    const ENDPOINT = `${this.globals.backend_base_url}/fuente/${id}`;
    return this.http.post(ENDPOINT, data);
  };

  getSourceById = (id: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/fuente/${id}`;
    return this.http.get(ENDPOINT);
  }

  deleteSourceById = (id: string) => {
    const ENDPOINT = `${this.globals.backend_base_url}/fuente/${id}`;
    return this.http.delete(ENDPOINT);
  }

  getAllRorsByText = (text: string) => {
    const ALL_RORS_BY_TEXT_ENDPOINT = `${this.globals.backend_base_url}/rors/simples?no_paginate=&search=${encodeURIComponent(text)}`;
    //console.log(ALL_RORS_BY_TEXT_ENDPOINT);
    return this.http.get(ALL_RORS_BY_TEXT_ENDPOINT);
  };

  getFrecuencies() {
    return [
      'mensual',
      'bimensual',
      'trimestral',
      'cuatrimestral',
      'semestral',
      'anual',
      'continua',
    ];
  }

}
