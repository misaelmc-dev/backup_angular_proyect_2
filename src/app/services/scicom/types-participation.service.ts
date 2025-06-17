import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TypesParticipationService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getTypeParticipations(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,
                        idsEvPerm?:any,idsTipEvPerm?:any,idsPart?:any,idsEvento?:any,idsEstatusPart?:any,
                        idsTiposActPerm?:any,idsTipoTrabPerm?:any,soloConEvPerm?:boolean,soloSinEvPerm?:boolean,
                        soloConTipsEvPerm?:boolean,soloSinTipsEvPerm?:boolean,soloConPart?:boolean,soloSinPart?:boolean,
                        soloConEvento?:boolean,soloSinEvento?:boolean,soloConEstatusPart?:boolean,
                        soloSinEstatusPart?:boolean,soloConTiposActPerm?:boolean,soloSinTiposActPerm?:boolean,
                        soloConTiposTrabPerm?:boolean,soloSinTiposTrabPerm?:boolean,
                        incluir?:string,ordenar?:string
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/tipspart?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsEvPerm.length>0) endpoint += `&idsEvPerm=${encodeURIComponent(idsEvPerm.join(' '))}`;
    if (idsTipEvPerm.length>0) endpoint += `&idsTipEvPerm=${encodeURIComponent(idsTipEvPerm.join(' '))}`;
    if (idsPart.length>0) endpoint += `&idsPart=${encodeURIComponent(idsPart.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsEstatusPart.length>0) endpoint += `&idsEstatusPart=${encodeURIComponent(idsEstatusPart.join(' '))}`;
    if (idsTiposActPerm.length>0) endpoint += `&idsTiposActPerm=${encodeURIComponent(idsTiposActPerm.join(' '))}`;
    if (idsTipoTrabPerm.length>0) endpoint += `&idsTipoTrabPerm=${encodeURIComponent(idsTipoTrabPerm.join(' '))}`;
    if (soloConEvPerm) endpoint += `&soloConEvPerm=`;
    if (soloSinEvPerm) endpoint += `&soloSinEvPerm=`;
    if (soloConTipsEvPerm) endpoint += `&soloConTipsEvPerm=`;
    if (soloSinTipsEvPerm) endpoint += `&soloSinTipsEvPerm=`;
    if (soloConPart) endpoint += `&soloConPart=`;
    if (soloSinPart) endpoint += `&soloSinPart=`;
    if (soloConEvento) endpoint += `&soloConEvento=`;
    if (soloSinEvento) endpoint += `&soloSinEvento=`;
    if (soloConEstatusPart) endpoint += `&soloConEstatusPart=`;
    if (soloSinEstatusPart) endpoint += `&soloSinEstatusPart=`;
    if (soloConTiposActPerm) endpoint += `&soloConTiposActPerm=`;
    if (soloSinTiposActPerm) endpoint += `&soloSinTiposActPerm=`;
    if (soloConTiposTrabPerm) endpoint += `&soloConTiposTrabPerm=`;
    if (soloSinTiposTrabPerm) endpoint += `&soloSinTiposTrabPerm=`;
    if (incluir!='') endpoint += `&incluir=`+incluir;
    if (ordenar!='') endpoint += `&ordenar=`+ordenar;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getTypeParticipationByEvent(eventoId?:any){
    return this.getTypeParticipations(
      true,0,0,'','',eventoId,'','',
      '','','','',false,
      false,false,false,false, false,
      false,false,false,false,false,
      false,false,false,
      '',''
    )
  }

}
