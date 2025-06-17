import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {GlobalsVars} from '../global/globals-vars';
import {Quote} from '../interfaces/quote';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getQuotesByResearcher = (researcherId: string) => {
    const GET_QUOTES_BY_RESEARCHER_ENDPOINT = `${this.globals.backend_base_url}/investigador/${researcherId}/citas`;
    return this.http.get(GET_QUOTES_BY_RESEARCHER_ENDPOINT);
  };

  getCoauthorsByQuoteId = (quoteId: string) => {
    const GET_COAUTHOR_BY_QUOTE_ID_ENDPOINT = `${this.globals.backend_base_url}/coautores/cita/${quoteId}`;
    return this.http.get(GET_COAUTHOR_BY_QUOTE_ID_ENDPOINT);
  };

  getQuoteById = (id: string) => {
    const GET_QUOTE_BY_ID_ENDPOINT = `${this.globals.backend_base_url}/validacion/citas/${id}`;
    return this.http.get(GET_QUOTE_BY_ID_ENDPOINT);
  };

  getCiteCoauthors(searchTerm?: string) {
    let url = `${this.globals.backend_base_url}/coautores/cita`
    if (searchTerm) {
      url += '?search=' + encodeURIComponent(searchTerm)
    }
    return this.http.get(url)
  }

  UpdateCoauthorQuote = (
    id_coautor: string,
    nombre: string,
    orcid_id: string,
    rorsIds: number[],
    validate: boolean
  ) => {
    const UPDATE_COAUTHOR_QUOTE = `${this.globals.backend_base_url}/cita/coautor/${id_coautor}`;
    return this.http.post(UPDATE_COAUTHOR_QUOTE, {
      nombre,
      orcid_id,
      rors: rorsIds,
      validate,
    });
  };

  updateCoauthorQuoteOrder( id:number, orden:number ){
    const ENDPOINT = `${this.globals.backend_base_url}/cita/coautor/${id}`
    return this.http.post(ENDPOINT,{orden:orden})
  }

  updateCoauthorQuoteCorrespondencia( id:number, correspondencia:boolean ){
    const ENDPOINT = `${this.globals.backend_base_url}/cita/coautor/${id}`
    return this.http.post(ENDPOINT,{correspondencia:correspondencia})
  }

  createCoauthorQuote(
    id_cita: string,
    nombre: string,
    orcid_id: string,
    rorsIds: number[],
    validate: boolean
  ) {
    const CREATE_QUOTE_COAUTHOR_ENDPOINT = `${this.globals.backend_base_url}/coautor/cita/${id_cita}`;
    return this.http.post(CREATE_QUOTE_COAUTHOR_ENDPOINT, {
      nombre,
      orcid_id,
      rors: rorsIds,
      validate,
    });
  }

  deleteCoauthorQuote(id_coautor: string) {
    const DELETE_QUOTE_COAUTHOR_ENDPOINT = `${this.globals.backend_base_url}/cita/coautor/${id_coautor}`;
    return this.http.delete(DELETE_QUOTE_COAUTHOR_ENDPOINT);
  }

  updateQuote = (id: string, data: any) => {
    const UPDATE_QUOTE = `${this.globals.backend_base_url}/cita/${id}/modify`;
    return this.http.post(UPDATE_QUOTE, data);
  };

  validateQuoteTitle(id_quote: string, titulo_validate: boolean, titulo?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (titulo) {
      body = {
        titulo_validate,
        titulo
      }
    } else {
      body = {
        titulo_validate,
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteDoi(id_quote: string, DOI_validate: boolean, DOI?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (DOI) {
      body = {
        DOI_validate,
        DOI
      }
    } else {
      body = {
        DOI_validate,
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteUrl(id_quote: string, url_validate: boolean, url?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (url) {
      body = {
        url_validate,
        url
      }
    } else {
      body = {
        url_validate,
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteYear(id_quote: string, anio_validate: boolean, anio?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (anio) {
      body = {
        anio_validate,
        anio
      }
    } else {
      body = {
        anio_validate,
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteSource(id_quote: string, journal_validate: boolean, fuente?: number) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (fuente) {
      body = {
        journal_validate,
        fuente
      }
    } else {
      body = {
        journal_validate,
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteSourceVolume(id_quote: string, source_volume_validate: boolean, source_volume?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (source_volume) {
      body = {
        source_volume_validate,
        source_volume
      }
    } else {
      body = {
        source_volume_validate
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteSourceIssue(id_quote: string, source_issue_validate: boolean, source_issue?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (source_issue) {
      body = {
        source_issue_validate,
        source_issue
      }
    } else {
      body = {
        source_issue_validate
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteSourcePage(id_quote: string, source_page_validate: boolean, source_page?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (source_page) {
      body = {
        source_page_validate,
        source_page
      }
    } else {
      body = {
        source_page_validate
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteAutocitaAutor(id_quote: string, autocita_autor_validate: boolean, autocita_autor?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (autocita_autor) {
      body = {
        autocita_autor_validate,
        autocita_autor
      }
    } else {
      body = {
        autocita_autor_validate,
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteAutocitaJournal(id_quote: string, autocita_journal_validate: boolean, autocita_journal?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (autocita_journal) {
      body = {
        autocita_journal_validate,
        autocita_journal
      }
    } else {
      body = {
        autocita_journal_validate,
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateQuoteTipo(id_quote: string, tipo_validate: boolean, tipo?: string) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    let body = null
    if (tipo) {
      body = {
        tipo_validate,
        tipo
      }
    } else {
      body = {
        tipo_validate,
      }
    }
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, body);
  }

  validateScopus(id_cita: string, in_scopus_validate: boolean, in_scopus?: boolean) {
    const VALIDATE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_cita}/modify`;
    let body = null
    if (in_scopus) {
      body = {
        in_scopus_validate,
        in_scopus
      }
    } else {
      body = {
        in_scopus_validate
      }
    }
    return this.http.post(VALIDATE_FIELD_ENDPOINT, body);
  }

  validateJcr(id_cita: string, in_jcr_validate: boolean, in_jcr?: boolean) {
    const VALIDATE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_cita}/modify`;
    let body = null
    if (in_jcr) {
      body = {
        in_jcr_validate,
        in_jcr
      }
    } else {
      body = {
        in_jcr_validate
      }
    }
    return this.http.post(VALIDATE_FIELD_ENDPOINT, body);
  }

  validateScielo(id_cita: string, in_scielo_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_cita}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      in_scielo_validate,
    });
    return obs;
  }

  validateConacyt(id_cita: string, in_conacyt_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_cita}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      in_conacyt_validate,
    });
    return obs;
  }

  validateDoaj(id_cita: string, in_doaj_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_cita}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      in_doaj_validate,
    });
    return obs;
  }

  validateQuote(id_quote: string, validate: boolean) {
    const VALIDATE_QUOTE_FIELD_ENDPOINT = `${this.globals.backend_base_url}/cita/${id_quote}/modify`;
    return this.http.post(VALIDATE_QUOTE_FIELD_ENDPOINT, {
      validate,
    });
  }

  deleteQuote(id_cita: string) {
    const DELETE_QUOTE_ENDPOINT = `${this.globals.backend_base_url}/validacion/citas/${id_cita}/delete`;
    return this.http.delete(DELETE_QUOTE_ENDPOINT, {});
  }

  findQuotesByPage(
    criteria: string
  ): Observable<Quote[]> {
    return this.http
      .get(
        `${this.globals.backend_base_url}/${criteria}`)
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  orderDataByType(researcherId: string, mode: string, pageNumber: number, pageSize: number) {
    const SORTED_DATA = `${this.globals.backend_base_url}/investigador/${researcherId}/citas`;
    let params = new HttpParams();
    params = params.append('orderByType', mode);
    params = params.append('page', String(pageNumber));
    params = params.append('page_size', String(pageSize));
    return this.http
      .get(SORTED_DATA, {
        params,
      })
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  orderDataByDate(researcherId: string, mode: string, pageNumber: number, pageSize: number) {
    const SORTED_DATA = `${this.globals.backend_base_url}/investigador/${researcherId}/citas`;
    let params = new HttpParams();
    params = params.append('orderByDate', mode);
    params = params.append('page', String(pageNumber));
    params = params.append('page_size', String(pageSize));
    return this.http
      .get(SORTED_DATA, {
        params,
      })
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  orderDataByTitle(researcherId: string, mode: string, pageNumber: number, pageSize: number) {
    const SORTED_DATA = `${this.globals.backend_base_url}/investigador/${researcherId}/citas`;
    let params = new HttpParams();
    params = params.append('orderByTitle', mode);
    params = params.append('page', String(pageNumber));
    params = params.append('page_size', String(pageSize));
    return this.http
      .get(SORTED_DATA, {
        params,
      })
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  getProductByRangeYear(
    researcherId: string,
    since: number,
    to: number,
    pageNumber: number,
    pageSize: number
  ) {
    const RANGE_DATA = `${this.globals.backend_base_url}/investigador/${researcherId}/citas`;
    let params = new HttpParams();
    params = params.append('anioDesde', since);
    params = params.append('anioHasta', to);
    params = params.append('page', String(pageNumber));
    params = params.append('page_size', String(pageSize));
    return this.http
      .get(RANGE_DATA, {
        params,
      })
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  dataImpactQuotes(researcherId: string) {
    let endpoint = `${this.globals.backend_base_url}/investigador/${researcherId}/citas?no_paginate`;
    return this.http.get(endpoint);
  }

  getPagedQuotesByProduct(
    productId: string,
    pageNumber: number
  ): Observable<Quote[]> {
    const GET_QUOTES_BY_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/productos/${productId}/citas`;
    let params = new HttpParams();
    params = params.append('page', String(pageNumber));
    return this.http
      .get(GET_QUOTES_BY_PRODUCT_ENDPOINT,
        {
          params,
        }
      )
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

  getQuotesByProductId(criteria: string): Observable<Quote[]> {
    //const GET_QUOTES_BY_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/productos/${productId}/citas`;
    const GET_QUOTES_BY_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    return this.http.get(GET_QUOTES_BY_PRODUCT_ENDPOINT)
      .pipe(
        map((res: any) => res),
        catchError((err) => throwError(err))
      );
  }

}
