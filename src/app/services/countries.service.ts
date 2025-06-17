import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getCountries(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInstRor?:any,
    idsInstScintra?:any,idsInvestigadores?:any,idsInstScintraOrigProdColab?:any,idsInstScintraOrigCitaColab?:any,
    idsInstRorOrigProdColab?:any,idsInstRorOrigCitaColab?:any,idsFuente?:any,idsInvestOrigProdColab?:any,
    idsInvestOrigCitaColab?:any,idsISO3166_1_alfa2?:any,soloConInstSc?:boolean,soloSinInstSc?:boolean,
    soloConInstRor?:boolean,soloSinInstRor?:boolean,soloConFuente?:boolean,soloSinFuente?:boolean,
    soloConInvest?:boolean,soloSinInvest?:boolean,soloConCita?:boolean,soloSinCita?:boolean,soloConProduct?:boolean,
    soloSinProduct?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/paises/simples?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInstRor.length>0) endpoint += `&idsInstRor=${encodeURIComponent(idsInstRor.join(' '))}`;
    if (idsInstScintra.length>0) endpoint += `&idsInstScintra=${encodeURIComponent(idsInstScintra.join(' '))}`;
    if (idsInvestigadores.length>0) endpoint += `&idsInvestigadores=${encodeURIComponent(idsInvestigadores.join(' '))}`;
    if (idsInstScintraOrigProdColab.length>0) endpoint += `&idsInstScintraOrigProdColab=${encodeURIComponent(idsInstScintraOrigProdColab.join(' '))}`;
    if (idsInstScintraOrigCitaColab.length>0) endpoint += `&idsInstScintraOrigCitaColab=${encodeURIComponent(idsInstScintraOrigCitaColab.join(' '))}`;
    if (idsInstRorOrigProdColab.length>0) endpoint += `&idsInstRorOrigProdColab=${encodeURIComponent(idsInstRorOrigProdColab.join(' '))}`;
    if (idsInstRorOrigCitaColab.length>0) endpoint += `&idsInstRorOrigCitaColab=${encodeURIComponent(idsInstRorOrigCitaColab.join(' '))}`;
    if (idsFuente.length>0) endpoint += `&idsFuente=${encodeURIComponent(idsFuente.join(' '))}`;
    if (idsInvestOrigProdColab.length>0) endpoint += `&idsInvestOrigProdColab=${encodeURIComponent(idsInvestOrigProdColab.join(' '))}`;
    if (idsInvestOrigCitaColab.length>0) endpoint += `&idsInvestOrigCitaColab=${encodeURIComponent(idsInvestOrigCitaColab.join(' '))}`;
    if (idsISO3166_1_alfa2.length>0) endpoint += `&idsISO3166_1_alfa2=${encodeURIComponent(idsISO3166_1_alfa2.join(' '))}`;
    if (soloConInstSc) endpoint += `&soloConInstSc=`;
    if (soloSinInstSc) endpoint += `&soloSinInstSc=`;
    if (soloConInstRor) endpoint += `&soloConInstRor=`;
    if (soloSinInstRor) endpoint += `&soloSinInstRor=`;
    if (soloConFuente) endpoint += `&soloConFuente=`;
    if (soloSinFuente) endpoint += `&soloSinFuente=`;
    if (soloConInvest) endpoint += `&soloConInvest=`;
    if (soloSinInvest) endpoint += `&soloSinInvest=`;
    if (soloConCita) endpoint += `&soloConCita=`;
    if (soloSinCita) endpoint += `&soloSinCita=`;
    if (soloConProduct) endpoint += `&soloConProduct=`;
    if (soloSinProduct) endpoint += `&soloSinProduct=`;
    //console.log("endpoint",endpoint);
    return this.http.get(endpoint)
  }

  getAllCountries(){
    return this.getCountries(
      true,0,0,'','','','','','',
      '','','','','',
      '','',false,false,false,
      false,false,false,false,false,false,
      false,false,false
    )
  }

  getCountryByFilter(search:string){
    return this.getCountries(
      true,0,0,search,'','','','','',
      '','','','','',
      '','',false,false,false,
      false,false,false,false,false,false,
      false,false,false
    )
  }

  getCountryWidthInvest(page?:number,pageSize?:number,search?:string,idsInstRor?:any,idsInstScintra?:any,
                        ){
    return this.getCountries(
      false,page,pageSize,search,'',idsInstRor,idsInstScintra,'','',
      '','','','','',
      '','',false,false,false,
      false,false,false,true,false,false,
      false,false,false
    )
  }


  getCountriesWidthSourcesList(){
    return this.getCountries(
      true,0,0,'','','','','','',
      '','','','','',
      '','',false,false,false,
      false,true,false,false,false,false,
      false,false,false
    )
  }

  getCountriesWidthSources(page:number,pageSize:number,search:string){
    return this.getCountries(
      false,page,pageSize,search,'','','','','',
      '','','','','',
      '','',false,false,false,
      false,true,false,false,false,false,
      false,false,false
    )
  }

  getCountriesWidthInvest(){
    return this.getCountries(
      true,0,0,'','','','','','',
      '','','','','',
      '','',false,false,false,
      false,false,false,true,false,false,
      false,false,false
    )
  }

  addCountry(idPais:any,nombre:string,codigo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/paises/create`
    return this.http.post(ENDPOINT,{ISO_3166_1_num:idPais,ISO_3166_1_alfa2:codigo,nombre:nombre})
  }

  updateCountry(idPais:number,nombre:string,codigo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/paises/${idPais}/update`
    return this.http.post(ENDPOINT,{ISO_3166_1_alfa2:codigo,nombre:nombre})
  }

  deleteCountry(idPais:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/paises/${idPais}/delete`
    return this.http.delete(ENDPOINT)
  }
}

