import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class SourceHistoryService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getHistoryBySource(idFuente:number,page:number) {
    let endpoint = `${this.globals.backend_base_url}/scimagohistoricsfuente?idsFuente=${idFuente}&pageSize=10&page=${page}`
    return this.http.get(endpoint)
  }

  addHistoryToSource(
    idFuente:number,
    year:number,
  ){
    console.warn("idFuente",idFuente,"year",year)
    let endpoint = `${this.globals.backend_base_url}/scimagohistoricsfuente/create`
    let datos = new FormData();
    datos.append('fuente_id', idFuente.toString());
    datos.append('year', year.toString());
    return this.http.post(endpoint,datos)
  }

  updateHistoryToSource(
    id:number,
    year:number,
    sjr:number,
    docs:number,
    cites_last_3_years:number,
    self_cites_last_3_years:number,
    cited_docs_ratio_last_3_years:number,
    uncited_docs_ratio_last_3_years:number,
    citable_docs_ratio_last_3_years:number,
    non_citable_docs_ratio_last_3_years:number,
    cites_per_doc_last_4_years:number,
    cites_per_doc_last_3_years:number,
    cites_per_doc_last_2_years:number,
    external_cites_per_doc_last_3_years:number,
    international_colab_percent:number
  ){
    let endpoint = `${this.globals.backend_base_url}/scimagohistoricsfuente/${id}/update`
    let datos = new FormData();
    datos.append('year', year.toString());
    if(sjr==null){sjr=0}
    datos.append('sjr', sjr.toString());
    if(docs==null){docs=0}
    datos.append('docs', docs.toString());
    if(cites_last_3_years==null){cites_last_3_years=0}
    datos.append('cites_last_3_years', cites_last_3_years.toString());
    if(self_cites_last_3_years==null){self_cites_last_3_years=0}
    datos.append('self_cites_last_3_years', self_cites_last_3_years.toString());
    if(cited_docs_ratio_last_3_years==null){cited_docs_ratio_last_3_years=0}
    datos.append('cited_docs_ratio_last_3_years', cited_docs_ratio_last_3_years.toString());
    if(uncited_docs_ratio_last_3_years==null){uncited_docs_ratio_last_3_years=0}
    datos.append('uncited_docs_ratio_last_3_years', uncited_docs_ratio_last_3_years.toString());
    if(citable_docs_ratio_last_3_years==null){citable_docs_ratio_last_3_years=0}
    datos.append('citable_docs_ratio_last_3_years', citable_docs_ratio_last_3_years.toString());
    if(non_citable_docs_ratio_last_3_years==null){non_citable_docs_ratio_last_3_years=0}
    datos.append('non_citable_docs_ratio_last_3_years', non_citable_docs_ratio_last_3_years.toString());
    if(cites_per_doc_last_4_years==null){cites_per_doc_last_4_years=0}
    datos.append('cites_per_doc_last_4_years', cites_per_doc_last_4_years.toString());
    if(cites_per_doc_last_3_years==null){cites_per_doc_last_3_years=0}
    datos.append('cites_per_doc_last_3_years', cites_per_doc_last_3_years.toString());
    if(cites_per_doc_last_2_years==null){cites_per_doc_last_2_years=0}
    datos.append('cites_per_doc_last_2_years', cites_per_doc_last_2_years.toString());
    if(external_cites_per_doc_last_3_years==null){external_cites_per_doc_last_3_years=0}
    datos.append('external_cites_per_doc_last_3_years', external_cites_per_doc_last_3_years.toString());
    if(international_colab_percent==null){international_colab_percent=0}
    datos.append('international_colab_percent', international_colab_percent.toString());
    return this.http.post(endpoint,datos)
  }

  removeHistoryToSource(idHistory:number){
    let endpoint = `${this.globals.backend_base_url}/scimagohistoricsfuente/${idHistory}`
    return this.http.delete(endpoint)
  }
}

