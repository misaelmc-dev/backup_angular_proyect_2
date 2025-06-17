import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class SourcesService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getSources(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,issn?:any,
    isbn?:any,idsImpacto?:any,idsProducto?:any,idsCuartil?:any,idsTrabScicom?:any,idsIdioma?:any,idsPais?:any,
    idsScimagoResTopic?:any,idsScimagoAreaResTopic?:any,idsScimago?:any,idsResearchTopic?:any,idFuentOrigSimilaridad?:any,
    qScopus?:any,qScopusScintra?:any,
    min_h_index?:number, max_h_index?:number, min_cites_score?:number, max_cites_score?:number,min_sjr?:number,
    max_sjr?:number,min_snip?:number,max_snip?:number,min_fi?:number,max_fi?:number,conPaises?:boolean,
    conResTopics?:boolean,conIdiomas?:boolean,conVigScopus?:boolean,conHistScimago?:boolean,conFuentSimilares?:boolean,
    enDoaj?:boolean,enJcr?:boolean,enConacyt?:boolean,enScielo?:boolean,enScopus?:boolean,soloDepredadoras?:boolean,
    soloOpenaccess?:boolean,soloOpenaccessAutor?:boolean,soloOpenaccessLector?:boolean,soloConPais?:boolean,
    soloSinPais?:boolean,soloConResTopic?:boolean,soloSinResTopic?:boolean,soloConImpacto?:boolean,soloSinImpacto?:boolean,
    soloConProducto?:boolean,soloSinProducto?:boolean,soloConIdioma?:boolean,soloSinIdioma?:boolean,soloConVigencia?:boolean,
    soloSinVigencia?:boolean,soloConScimagoHistoric?:boolean,soloSinScimagoHistoric?:boolean,soloConCuartil?:boolean,
    soloSinCuartil?:boolean,soloConTrabScicom?:boolean,soloSinTrabScicom?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/fuentes?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (issn.length>0) endpoint += `&issn=${encodeURIComponent(issn.join(' '))}`;
    if (isbn.length>0) endpoint += `&isbn=${encodeURIComponent(isbn.join(' '))}`;
    if (idsImpacto.length>0) endpoint += `&idsImpacto=${encodeURIComponent(idsImpacto.join(' '))}`;
    if (idsProducto.length>0) endpoint += `&idsProducto=${encodeURIComponent(idsProducto.join(' '))}`;
    if (idsCuartil.length>0) endpoint += `&idsCuartil=${encodeURIComponent(idsCuartil.join(' '))}`;
    if (idsTrabScicom.length>0) endpoint += `&idsTrabScicom=${encodeURIComponent(idsTrabScicom.join(' '))}`;
    if (idsIdioma.length>0) endpoint += `&idsIdioma=${encodeURIComponent(idsIdioma.join(' '))}`;
    if (idsPais.length>0) endpoint += `&idsPais=${encodeURIComponent(idsPais.join(' '))}`;
    if (idsScimagoResTopic.length>0) endpoint += `&idsScimagoResTopic=${encodeURIComponent(idsScimagoResTopic.join(' '))}`;
    if (idsScimagoAreaResTopic.length>0) endpoint += `&idsScimagoAreaResTopic=${encodeURIComponent(idsScimagoAreaResTopic.join(' '))}`;
    if (idsScimago.length>0) endpoint += `&idsScimago=${encodeURIComponent(idsScimago.join(' '))}`;
    if (idsResearchTopic.length>0) endpoint += `&idsResearchTopic=${encodeURIComponent(idsResearchTopic.join(' '))}`;
    if (idFuentOrigSimilaridad.length>0) endpoint += `&idFuentOrigSimilaridad=${encodeURIComponent(idFuentOrigSimilaridad.join(' '))}`;
    if (qScopus.length>0) endpoint += `&qScopus=${encodeURIComponent(qScopus.join(' '))}`;
    if (qScopusScintra.length>0) endpoint += `&qScopusScintra=${encodeURIComponent(qScopusScintra.join(' '))}`;
    if (min_h_index>0) endpoint += `&min_h_index=${encodeURIComponent(min_h_index)}`;
    if (max_h_index>0) endpoint += `&max_h_index=${encodeURIComponent(max_h_index)}`;
    if (min_cites_score>0) endpoint += `&min_cites_score=${encodeURIComponent(min_cites_score)}`;
    if (max_cites_score>0) endpoint += `&max_cites_score=${encodeURIComponent(max_cites_score)}`;
    if (min_sjr>0) endpoint += `&min_sjr=${encodeURIComponent(min_sjr)}`;
    if (max_sjr>0) endpoint += `&max_sjr=${encodeURIComponent(max_sjr)}`;
    if (min_snip>0) endpoint += `&min_snip=${encodeURIComponent(min_snip)}`;
    if (max_snip>0) endpoint += `&max_snip=${encodeURIComponent(max_snip)}`;
    if (min_fi>0) endpoint += `&min_fi=${encodeURIComponent(min_fi)}`;
    if (max_fi>0) endpoint += `&max_fi=${encodeURIComponent(max_fi)}`;
    if (conPaises) endpoint += `&conPaises=`;
    if (conResTopics) endpoint += `&conResTopics=`;
    if (conIdiomas) endpoint += `&conIdiomas=`;
    if (conVigScopus) endpoint += `&conVigScopus=`;
    if (conHistScimago) endpoint += `&conHistScimago=`;
    if (conFuentSimilares) endpoint += `&conFuentSimilares=`;
    if (enDoaj) endpoint += `&enDoaj=`;
    if (enJcr) endpoint += `&enJcr=`;
    if (enConacyt) endpoint += `&enConacyt=`;
    if (enScielo) endpoint += `&enScielo=`;
    if (enScopus) endpoint += `&enScopus=`;
    if (soloDepredadoras) endpoint += `&soloDepredadoras=`;
    if (soloOpenaccess) endpoint += `&soloOpenaccess=`;
    if (soloOpenaccessAutor) endpoint += `&soloOpenaccessAutor=`;
    if (soloOpenaccessLector) endpoint += `&soloOpenaccessLector=`;
    if (soloConPais) endpoint += `&soloConPais=`;
    if (soloSinPais) endpoint += `&soloSinPais=`;
    if (soloConResTopic) endpoint += `&soloConResTopic=`;
    if (soloSinResTopic) endpoint += `&soloSinResTopic=`;
    if (soloConImpacto) endpoint += `&soloConImpacto=`;
    if (soloSinImpacto) endpoint += `&soloSinImpacto=`;
    if (soloConProducto) endpoint += `&soloConProducto=`;
    if (soloSinProducto) endpoint += `&soloSinProducto=`;
    if (soloConIdioma) endpoint += `&soloConIdioma=`;
    if (soloSinIdioma) endpoint += `&soloSinIdioma=`;
    if (soloConVigencia) endpoint += `&soloConVigencia=`;
    if (soloSinVigencia) endpoint += `&soloSinVigencia=`;
    if (soloConScimagoHistoric) endpoint += `&soloConScimagoHistoric=`;
    if (soloSinScimagoHistoric) endpoint += `&soloSinScimagoHistoric=`;
    if (soloConCuartil) endpoint += `&soloConCuartil=`;
    if (soloSinCuartil) endpoint += `&soloSinCuartil=`;
    if (soloConTrabScicom) endpoint += `&soloConTrabScicom=`;
    if (soloSinTrabScicom) endpoint += `&soloSinTrabScicom=`;
    console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getAllSources(page:number,pageSize:number) {
    return this.getSources(
      false,page,pageSize,'','',
      '','','','','','','','','',
      '','','','',
      '','',
      0,0,0,0,0,0,0,0,0,0,
      false,false,false,false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false
    )
  }

  getSourceWidthAllMetadata(idFuente:number) {
    let endpoint = `${this.globals.backend_base_url}/fuentes?no_paginate=&ids=${idFuente}&conPaises=&conResTopics=&conIdiomas=&conVigScopus=&conHistScimago=&conFuentSimilares=`
    return this.http.get(endpoint)
  }

  getSourcesFilter(page?:number,pageSize?:number,search?:string,min_cites_score?:number,
                   max_cites_score?:number,qScopus?:any,idsIdioma?:any,idsPais?:any,
                   soloOpenaccess?:boolean,soloDepredadoras?:boolean) {
    return this.getSources(
      false,page,pageSize,search,'',
      '','','','','','',idsIdioma,idsPais,
      '','','','','',
      qScopus,'',
      0,0,min_cites_score,max_cites_score,0,0,0,0,0,0,
      false,false,false,false,false,false,
      false,false,false,false,false,soloDepredadoras,soloOpenaccess,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false
    )
  }

  getSourcesByIds(idsSources:any) {
    let endpoint = `${this.globals.backend_base_url}/fuentes?no_paginate=&ids=${encodeURIComponent(idsSources.join(' '))}`
    return this.http.get(endpoint)
  }

  getSourceSearch(search:string) {
    let endpoint = `${this.globals.backend_base_url}/fuentes?no_paginate=&search=${search}`
    return this.http.get(endpoint)
  }

  getSourcePublisherSearch(search:string) {
    let endpoint = `${this.globals.backend_base_url}/fuentes/publishers?no_paginate=&s=${search}`
    return this.http.get(endpoint)
  }

  getSourceConacyt() {
    let endpoint = `${this.globals.backend_base_url}/fuentes/clasifs-conacyt?no_paginate=`
    return this.http.get(endpoint)
  }

  deleteSource(idSource:number) {
    const endpoint = `${this.globals.backend_base_url}/fuente/${idSource}`
    return this.http.delete(endpoint)
  }

  getSimago() {
    let endpoint = `${this.globals.backend_base_url}/scimago/subject/categories`
    return this.http.get(endpoint)
  }


  addSource(titulo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/fuentes/create`
    return this.http.post(ENDPOINT,{titulo:titulo})
  }

  updateSource(
    fuenteId:number,
    fuenteTitulo:string,
    fuenteIssni:string,
    fuenteIssne:string,
    fuenteFrecuencia:string,
    fuentePublisher:string,
    fuenteFi:string,
    fuenteAaAutor:boolean,
    fuenteAaLector:boolean,
    fuenteUrlNormas:string,
    fuenteCitesScore:string,
    fuenteDoaj:boolean,
    fuenteJcr:boolean,
    fuenteScopusAlgunaVez:boolean,
    fuenteConacyt:boolean,
    fuenteScielo:boolean,
    fuenteApcCosto:string,
    fuenteLicenseCondition:string,
    fuenteClasifConacyt:string,
    fuenteAccesoAbierto:boolean,
    fuenteRightsUri:string,
    fuenteIsbn:string,
    fuenteTipo:string,
    fuenteCitesScorYear:string,
    fuenteCitesScoreTrack:string,
    fuenteCitesScoreTrackYear:string,
    fuenteSjr:string,
    fuenteSjrYear:string,
    fuenteSnip:string,
    fuenteSnipYear:string,
    fuenteHIndex:string,
    fuenteUrl:string,
    fuenteScimagoSourceId:string,
    fuenteWoscc:boolean,
    fuenteDepredadora:boolean
    ){
    const endpoint = `${this.globals.backend_base_url}/fuentes/${fuenteId}/update`
    let formData = new FormData();
      if(fuenteIssni===null){
        formData.append('titulo', fuenteTitulo);
      }else{
        formData.append('titulo', fuenteTitulo.toString());
      }
      if(fuenteIssni===null){
        formData.append('issn_e', fuenteIssni);
      }else{
        formData.append('issn_e', fuenteIssni.toString());
      }
      if(fuenteIssni===null){
        formData.append('issn_e', fuenteIssne);
      }else{
        formData.append('issn_e', fuenteIssne.toString());
      }
      formData.append('issn_e', fuenteIssni.toString());
      formData.append('issn_i', fuenteIssne.toString());
      formData.append('frecuencia', fuenteFrecuencia.toString());
      formData.append('publisher', fuentePublisher.toString());
      if(fuenteFi===null){
        formData.append('fi', "0".toString());
      }else{
        formData.append('fi', fuenteFi.toString());
      }
      if(fuenteAaAutor){
        formData.append('aa_autor', "1".toString());
      }else{
        formData.append('aa_autor', "0".toString());
      }
      if(fuenteAaLector){
        formData.append('aa_lector', "1".toString());
      }else{
        formData.append('aa_lector', "0".toString());
      }
      if(fuenteUrlNormas!='' && fuenteUrlNormas!==null){
        formData.append('url_normas', fuenteUrlNormas.toString());
      }
      if(fuenteCitesScore===null){
        formData.append('cites_score', "0".toString());
      }else{
        formData.append('cites_score', fuenteCitesScore.toString());
      }
      if(fuenteDoaj){
        formData.append('doaj', "1".toString());
      }else{
        formData.append('doaj', "0".toString());
      }
      if(fuenteJcr){
        formData.append('jcr', "1".toString());
      }else{
        formData.append('jcr', "0".toString());
      }
      if(fuenteScopusAlgunaVez){
        formData.append('scopus', "1".toString());
      }else{
        formData.append('scopus', "0".toString());
      }
      if(fuenteConacyt){
        formData.append('conacyt', "1".toString());
      }else{
        formData.append('conacyt', "0".toString());
      }
      if(fuenteScielo){
        formData.append('scielo', "1".toString());
      }else{
        formData.append('scielo', "0".toString());
      }
      formData.append('apc_costo', fuenteApcCosto.toString());
      formData.append('license_condition', fuenteLicenseCondition.toString());
      formData.append('clasif_conacyt', fuenteClasifConacyt.toString());
      if(fuenteAccesoAbierto){
        formData.append('acceso_abierto', "1".toString());
      }else{
        formData.append('acceso_abierto', "0".toString());
      }
      if(fuenteRightsUri!='' && fuenteRightsUri!==null){
        formData.append('rights_uri', fuenteRightsUri.toString());
      }
      formData.append('isbn', fuenteIsbn.toString());
      formData.append('tipo', fuenteTipo.toString());
      formData.append('cites_score_year', fuenteCitesScorYear.toString());
      if(fuenteCitesScoreTrack===null){
        formData.append('cites_score_track', "0".toString());
      }else{
        formData.append('cites_score_track', fuenteCitesScoreTrack.toString());
      }
      formData.append('cites_score_track_year', fuenteCitesScoreTrackYear.toString());
      if(fuenteSjr===null){
        formData.append('sjr', "0".toString());
      }else{
        formData.append('sjr', fuenteSjr.toString());
      }
      formData.append('sjr_year', fuenteSjrYear.toString());
      if(fuenteSnip===null){
        formData.append('snip', "0".toString());
      }else{
        formData.append('snip', fuenteSnip.toString());
      }
      formData.append('snip_year', fuenteSnipYear.toString());
      formData.append('h_index', fuenteHIndex.toString());
      if(fuenteUrl!='' && fuenteUrl!==null){
        formData.append('url', fuenteUrl.toString());
      }
      formData.append('scimago_source_id', fuenteScimagoSourceId.toString());
      if(fuenteWoscc){
        formData.append('woscc', "1".toString());
      }else{
        formData.append('woscc', "0".toString());
      }
      if(fuenteDepredadora){
        formData.append('depredadora', "1".toString());
      }else{
        formData.append('depredadora', "0".toString());
      }
    return this.http.post(endpoint, formData)
  }

  addLanguageToSource(idFuente:number,idLanguage:number){
    let endpoint = `${this.globals.backend_base_url}/fuente/${idFuente}/idioma/${idLanguage}`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeLanguageToSource(idFuente:number,idLanguage:number){
    let endpoint = `${this.globals.backend_base_url}/fuente/${idFuente}/idioma/${idLanguage}`
    return this.http.delete(endpoint)
  }

  addCountryToSource(idFuente:number,idCountry:number){
    let endpoint = `${this.globals.backend_base_url}/fuente/${idFuente}/pais/${idCountry}`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeCountryToSource(idFuente:number,idCountry:number){
    let endpoint = `${this.globals.backend_base_url}/fuente/${idFuente}/pais/${idCountry}`
    return this.http.delete(endpoint)
  }

  addSimilarSourceToSource(idFuente:number,idSimilarSource:number,similitud:number){
    let endpoint = `${this.globals.backend_base_url}/fuentes/${idFuente}/similar/${idSimilarSource}/asociar`
    let datos = new FormData();
    datos.append('similaridad', similitud.toString());
    return this.http.post(endpoint,datos)
  }

  removeSimilarSourceToSource(idFuente:number,idSimilarSource:number){
    let endpoint = `${this.globals.backend_base_url}/fuentes/${idFuente}/similar/${idSimilarSource}/desasociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  getAllResearchTopics() {
    let endpoint = `${this.globals.backend_base_url}/fuentes/research_topics?no_paginate=`
    return this.http.get(endpoint)
  }

  addResearchTopicToSource(idFuente:number,topic:string,simago:number,area:number){
    let endpoint = `${this.globals.backend_base_url}/topic/fuente/${idFuente}`
    let datos = new FormData();
    datos.append('topic', topic.toString());
    if(simago!=0){ datos.append('id_scimago', simago.toString()) }
    if(area!=0){ datos.append('id_scimago_area', area.toString()) }
    console.log("datos",datos)
    console.log("datos1",idFuente,topic,simago,area)
    console.log("endpoint",endpoint)
    return this.http.post(endpoint,datos)
  }

  removeResearchTopicToSource(idResearchTopic:number){
    let endpoint = `${this.globals.backend_base_url}/fuente/topic/${idResearchTopic}`
    return this.http.delete(endpoint)
  }

}
