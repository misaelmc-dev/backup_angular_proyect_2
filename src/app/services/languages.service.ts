import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getLanguages(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,codsIso6391?:any,idsProducto?:any,
               idsFuente?:any,idsConjMetaTrab?:any,soloConProduct?:boolean,soloSinProduct?:boolean,
               soloConFuente?:boolean,soloSinFuente?:boolean,soloConConjMetaTrab?:boolean,
               soloSinConjMetaTrab?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/idiomas/simples?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (codsIso6391.length>0) endpoint += `&codsIso6391=${encodeURIComponent(codsIso6391.join(' '))}`;
    if (idsProducto.length>0) endpoint += `&idsProducto=${encodeURIComponent(idsProducto.join(' '))}`;
    if (idsFuente.length>0) endpoint += `&idsFuente=${encodeURIComponent(idsFuente.join(' '))}`;
    if (idsConjMetaTrab.length>0) endpoint += `&idsConjMetaTrab=${encodeURIComponent(idsConjMetaTrab.join(' '))}`;
    if (soloConProduct) endpoint += `&soloConProduct=`;
    if (soloSinProduct) endpoint += `&soloSinProduct=`;
    if (soloConFuente) endpoint += `&soloConFuente=`;
    if (soloSinFuente) endpoint += `&soloSinFuente=`;
    if (soloConConjMetaTrab) endpoint += `&soloConConjMetaTrab=`;
    if (soloSinConjMetaTrab) endpoint += `&soloSinConjMetaTrab=`;
    return this.http.get(endpoint)
  }

  getAllLanguages(){
    return this.getLanguages(
      true,0,0,'','','','','','',
      false,false,false,false,
      false,false,
    );
  }

  getLanguagesByFilter(search?:string){
    return this.getLanguages(
      true,0,0,search,'','','','','',
      false,false,false,false,
      false,false,
    );
  }

  getLanguagesWidthSources(page?:number,pageSize?:number,search?:string){
    return this.getLanguages(
      false,page,pageSize,search,'','','','','',
      false,false,true,false,
      false,false
    );
  }

  getLanguagesWidthSourcesList(){
    return this.getLanguages(
      true,0,0,'','','','','','',
      false,false,true,false,
      false,false
    );
  }

  getLanguagesById(ids:any){
    return this.getLanguages(
      true,0,0,'',ids,'','','','',
      false,false,false,false,
      false,false,
    );
  }


  addLanguage(nombre:string,codigo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/idiomas/create`
    return this.http.post(ENDPOINT,{id_639_1:codigo,nombre:nombre })
  }

  updateLanguage(idIdioma:number,nombre:string,codigo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/idiomas/${idIdioma}/update`
    return this.http.post(ENDPOINT,{id_639_1:codigo,nombre:nombre})
  }

  deleteLanguage(idIdioma:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/idiomas/${idIdioma}/delete`
    return this.http.delete(ENDPOINT)
  }

}
