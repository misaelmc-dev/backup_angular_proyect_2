import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TypesEvaluationService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getTypeEvaluations(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsEvent?:any
    ,idsEvPerm?:any,idsTipEvPerm?:any,idsEval?:any,idsRangTiemp?:any,conEventos?:boolean
    ,soloConEvento?:boolean,soloSinEvento?:boolean,soloConEval?:boolean,soloSinEval?:boolean
    ,soloConEvPerm?:boolean,soloSinEvPerm?:boolean,soloConTipEvPerm?:boolean,soloSinTipEvPerm?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/tipseval?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsEvent.length>0) endpoint += `&idsEvent=${encodeURIComponent(idsEvent.join(' '))}`;
    if (idsEvPerm.length>0) endpoint += `&idsEvPerm=${encodeURIComponent(idsEvPerm.join(' '))}`;
    if (idsTipEvPerm.length>0) endpoint += `&idsTipEvPerm=${encodeURIComponent(idsTipEvPerm.join(' '))}`;
    if (idsEval.length>0) endpoint += `&idsEval=${encodeURIComponent(idsEval.join(' '))}`;
    if (idsRangTiemp.length>0) endpoint += `&idsRangTiemp=${encodeURIComponent(idsRangTiemp.join(' '))}`;
    if (conEventos) endpoint += `&conEventos=`;
    if (soloConEvento) endpoint += `&soloConEvento=`;
    if (soloSinEvento) endpoint += `&soloSinEvento=`;
    if (soloConEval) endpoint += `&soloConEval=`;
    if (soloSinEval) endpoint += `&soloSinEval=`;
    if (soloConEvPerm) endpoint += `&soloConEvPerm=`;
    if (soloSinEvPerm) endpoint += `&soloSinEvPerm=`;
    if (soloConTipEvPerm) endpoint += `&soloConTipEvPerm=`;
    if (soloSinTipEvPerm) endpoint += `&soloSinTipEvPerm=`;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getTypesEvalList(idEvento:any){
    return this.getTypeEvaluations(true,0,0,'','','',idEvento,
      '', '','',false,false,false,
      false,false,false,false,
      false,false
    );
  }

  getTypesEvalByEvent(page?:number,pageSize?:number,idEvento?:any){
    return this.getTypeEvaluations(false,page,pageSize,'','',idEvento,'','',
      '','',false,false,false,
      false,false,false,false,
      false,false
    );
  }

}
