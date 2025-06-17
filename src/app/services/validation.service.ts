import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {GlobalsVars} from '../global/globals-vars';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getAllValidations = (criteria: string) => {
    const ALL_VALIDATIONS_ENDPOINT = `${this.globals.backend_base_url}/${criteria}`;
    const obs = this.http.get(ALL_VALIDATIONS_ENDPOINT);
    return obs;
  };

  getProductById = (id: string) => {
    const GET_VALIDATION_BY_ID_ENDPOINT = `${this.globals.backend_base_url}/validacion/productos/${id}`;
    //console.log(GET_VALIDATION_BY_ID_ENDPOINT);
    const obs = this.http.get(GET_VALIDATION_BY_ID_ENDPOINT);
    return obs;
  };

  getUnvalidatedQuotesByProductId = (id: number) => {
    return this.http.get(`${this.globals.backend_base_url}/validacion/citas/pendientes/${id}`)
  };

  getUnvalidatedQuotesCountByProductId = (id: number) => {
    return this.http.get<number>(`${this.globals.backend_base_url}/validacion/citas/pendientes/${id}?justCount`)
  };

  getCoauthorsByProductId = (id: string) => {
    const GET_COAUTHTORS_BY_PRODUCT_ID_ENDPOINT = `${this.globals.backend_base_url}/coautores/producto/${id}`;
    //console.log(GET_COAUTHTORS_BY_PRODUCT_ID_ENDPOINT)
    const obs = this.http.get(GET_COAUTHTORS_BY_PRODUCT_ID_ENDPOINT);
    return obs;
  };

  getSubjectsByProductId = (id: string) => {
    const GET_SUBJECTS_BY_PRODUCT_ID_ENDPOINT = `${this.globals.backend_base_url}/subjects/producto/${id}`;
    //console.log(GET_SUBJECTS_BY_PRODUCT_ID_ENDPOINT)
    const obs = this.http.get(GET_SUBJECTS_BY_PRODUCT_ID_ENDPOINT);
    return obs;
  };

  getSimilarValidatableProductsFrom(id: number) {
    return this.http.get(`${this.globals.backend_base_url}/validacion/productos/pendientes?similarToId=${id}`);
  }

  updateCoauthorProduct(
    id: string,
    nombre: string,
    orcid_id: string,
    rorsIds: number[],
    validate: boolean
  ) {
    const UPDATE_PRODUCT_COAUTHOR_ENDPOINT = `${this.globals.backend_base_url}/producto/coautor/${id}`;
    const obs = this.http.post(UPDATE_PRODUCT_COAUTHOR_ENDPOINT, {
      nombre,
      orcid_id,
      rors: rorsIds,
      validate,
    });
    return obs;
  }

  updateCoauthorProductOrder( id:number, orden:number ){
    const ENDPOINT = `${this.globals.backend_base_url}/producto/coautor/${id}`
    return this.http.post(ENDPOINT,{orden:orden})
  }

  updateCoauthorProductCorrespondencia( id:number, correspondencia:boolean ){
    const ENDPOINT = `${this.globals.backend_base_url}/producto/coautor/${id}`
    return this.http.post(ENDPOINT,{correspondencia:correspondencia})
  }

  createCoauthorProduct(
    id_producto: string,
    nombre: string,
    orcid_id: string,
    rorsIds: number[],
    validate: boolean
  ) {
    const CREATE_PRODUCT_COAUTHOR_ENDPOINT = `${this.globals.backend_base_url}/coautor/producto/${id_producto}`;
    const obs = this.http.post(CREATE_PRODUCT_COAUTHOR_ENDPOINT, {
      nombre,
      orcid_id,
      rors: rorsIds,
      validate,
    });
    return obs;
  }

  deleteCoauthorProduct(id_coautor: string) {
    const DELETE_PRODUCT_COAUTHOR_ENDPOINT = `${this.globals.backend_base_url}/producto/coautor/${id_coautor}`;
    const obs = this.http.delete(DELETE_PRODUCT_COAUTHOR_ENDPOINT);
    return obs;
  }

  createSubjectProduct(id_producto: string, nombre: string) {
    const CREATE_PRODUCT_SUBJECT_ENDPOINT = `${this.globals.backend_base_url}/subject/producto/${id_producto}`;
    const obs = this.http.post(CREATE_PRODUCT_SUBJECT_ENDPOINT, [nombre]);
    return obs;
  }

  deleteSubjectProduct(id_subject: string) {
    const DELETE_SUBJECT_COAUTHOR_ENDPOINT = `${this.globals.backend_base_url}/producto/subject/${id_subject}`;
    const obs = this.http.delete(DELETE_SUBJECT_COAUTHOR_ENDPOINT);
    return obs;
  }

  validateSubjectProduct(id_subject: string) {
    const VALIDATE_SUBJECT_COAUTHOR_ENDPOINT = `${this.globals.backend_base_url}/producto/subject/${id_subject}/validate`;
    const obs = this.http.post(VALIDATE_SUBJECT_COAUTHOR_ENDPOINT, {});
    return obs;
  }

  createLanguageProduct(id_producto: string, id_idioma: string) {
    const CREATE_LANGUAGE_SUBJECT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/idioma/${id_idioma}`;
    const obs = this.http.post(CREATE_LANGUAGE_SUBJECT_ENDPOINT, {});
    return obs;
  }

  deleteLanguageProduct(id_producto: string, id_idioma: string) {
    const DELETE_LANGUAGE_SUBJECT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/idioma/${id_idioma}`;
    const obs = this.http.delete(DELETE_LANGUAGE_SUBJECT_ENDPOINT, {});
    return obs;
  }

  validateLanguageProduct(id_producto: string, id_idioma: string) {
    const VALIDATE_LANGUAGE_COAUTHOR_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/idioma/${id_idioma}/validate`;
    const obs = this.http.post(VALIDATE_LANGUAGE_COAUTHOR_ENDPOINT, {});
    return obs;
  }

  getProductCoauthors(searchTerm?: string) {
    let url = `${this.globals.backend_base_url}/coautores/producto`
    if (searchTerm) {
      url += '?search=' + encodeURIComponent(searchTerm)
    }
    return this.http.get(url)
  }

  updateProduct(id: string, data: any) {
    //console.log(JSON.stringify(data));
    const UPDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id}/modify`;
    /*const obs = this.http.post(UPDATE_PRODUCT_ENDPOINT, {
      titulo: data.titulo,
      DOI: data.doi,
      url: data.url,
      right: data.right,
      fuente: data.fuente,
      description: data.description,
      anio: data.anio,
      linkCitas: data.linkCitas,
      nombreInvest: data.nombreInvest,
      tipo: data.tipo,
      journal: data.journal,
    });*/
    const obs = this.http.post(UPDATE_PRODUCT_ENDPOINT, data);
    return obs;
  }

  validateProductYear(id_producto: string, anio_validate: boolean, anio?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
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
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductTitle(id_producto: string, titulo_validate: boolean, titulo?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
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
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductDoi(id_producto: string, DOI_validate: boolean, DOI?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    let body = null
    if (DOI) {
      body = {
        DOI_validate,
        DOI
      }
    } else {
      body = {
        DOI_validate
      }
    }
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductUrl(id_producto: string, url_validate: boolean, url?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    let body = null
    if (url) {
      body = {
        url_validate,
        url
      }
    } else {
      body = {
        url_validate
      }
    }
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductDescription(id_producto: string, description_validate: boolean, description?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    let body = null
    if (description) {
      body = {
        description_validate,
        description
      }
    } else {
      body = {
        description_validate
      }
    }
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductPublisher(id_producto: string, publisher_validate: boolean, publisher?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    let body = null
    if (publisher) {
      body = {
        publisher_validate,
        publisher
      }
    } else {
      body = {
        publisher_validate
      }
    }
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductTipo(id_producto: string, tipo_validate: boolean, tipo?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    //console.log(VALIDATE_PRODUCT_FIELD_ENDPOINT);
    let body = null
    if (tipo) {
      body = {
        tipo_validate,
        tipo
      }
    } else {
      body = {
        tipo_validate
      }
    }
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductSource(id_producto: string, journal_validate: boolean, fuente?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    //console.log(VALIDATE_PRODUCT_FIELD_ENDPOINT);
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
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductJournal(id_producto: string, journal_validate: boolean) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, {
      journal_validate,
    });
    return obs;
  }

  validateProductRight(id_producto: string, right_validate: boolean, right?: string) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    let body = null
    if (right) {
      body = {
        right_validate,
        right
      }
    } else {
      body = {
        right_validate
      }
    }
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductScopus(id_producto: string, in_scopus_validate: boolean, in_scopus?: boolean) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
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
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProductJcr(id_producto: string, in_jcr_validate: boolean, in_jcr?: boolean) {
    const VALIDATE_PRODUCT_FIELD_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
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
    return this.http.post(VALIDATE_PRODUCT_FIELD_ENDPOINT, body);
  }

  validateProduct(id_producto: string, validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      validate,
    });
    return obs;
  }

  validateSourceVolumen(id_producto: string, volumen_fuente_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      volumen_fuente_validate,
    });
    return obs;
  }

  validateSourceNumber(id_producto: string, numero_fuente_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      numero_fuente_validate,
    });
    return obs;
  }

  validateSourcePage(id_producto: string, pagina_fuente_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      pagina_fuente_validate,
    });
    return obs;
  }

  validateScielo(id_producto: string, in_scielo_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      in_scielo_validate,
    });
    return obs;
  }

  validateConacyt(id_producto: string, in_conacyt_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      in_conacyt_validate,
    });
    return obs;
  }

  validateDoaj(id_producto: string, in_doaj_validate: boolean) {
    const VALIDATE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/producto/${id_producto}/modify`;
    const obs = this.http.post(VALIDATE_PRODUCT_ENDPOINT, {
      in_doaj_validate,
    });
    return obs;
  }

  invalidateProduct(id: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/producto/${id}/invalidate`;
    return this.http.post(ENDPOINT, {});

  }

  validateSimilarProducts(baseProdId: number, similarProdsIds: number[]) {
    return this.http.post(`${this.globals.backend_base_url}/validacion/deproducto/${baseProdId}`
      +`/validaotros?idsToModify=${similarProdsIds.join(' ')}`, {});
  }

  deleteProduct(id_producto: string) {
    const DELETE_PRODUCT_ENDPOINT = `${this.globals.backend_base_url}/validacion/productos/${id_producto}/delete`;
    const obs = this.http.delete(DELETE_PRODUCT_ENDPOINT, {});
    return obs;
  }

  createProduct(titulo: string, idInvestigador: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/productos/create`;
    return this.http.post(ENDPOINT, {titulo: titulo, id_investigador: idInvestigador});
  }

  createCitation(titulo: string, idProducto: number) {
    const ENDPOINT = `${this.globals.backend_base_url}/citas/create`;
    return this.http.post(ENDPOINT, {titulo: titulo, id_producto: idProducto});
  }
}
