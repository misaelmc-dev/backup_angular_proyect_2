import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TypesWorkService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getTypeWork(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,
              idsEvent?:any,idsTipPartPerm?:any,idsPartPerm?:any,idsEvPerm?:any,idsTipEvPerm?:any,
              idsEstatusTrabPerm?:any,idsTrab?:any,conEventos?:boolean,soloConEvento?:boolean,
              soloSinEvento?:boolean,soloConPartPerm?:boolean,soloSinPartPerm?:boolean,
              soloConTipPartPerm?:boolean,soloSinTipPartPerm?:boolean,soloConEvPerm?:boolean,
              soloSinEvPerm?:boolean,soloConTipEvPerm?:boolean,soloSinTipEvPerm?:boolean,
              soloConEstatusTrabPerm?:boolean,soloSinEstatusTrabPerm?:boolean,soloConTrab?:boolean,
              soloSinTrab?:boolean,incluir?:string,ordenar?:string
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/tipstrab?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsEvent.length>0) endpoint += `&idsEvent=${encodeURIComponent(idsEvent.join(' '))}`;
    if (idsTipPartPerm.length>0) endpoint += `&idsTipPartPerm=${encodeURIComponent(idsTipPartPerm.join(' '))}`;
    if (idsPartPerm.length>0) endpoint += `&idsPartPerm=${encodeURIComponent(idsPartPerm.join(' '))}`;
    if (idsEvPerm.length>0) endpoint += `&idsEvPerm=${encodeURIComponent(idsEvPerm.join(' '))}`;
    if (idsTipEvPerm.length>0) endpoint += `&idsTipEvPerm=${encodeURIComponent(idsTipEvPerm.join(' '))}`;
    if (idsEstatusTrabPerm.length>0) endpoint += `&idsEstatusTrabPerm=${encodeURIComponent(idsEstatusTrabPerm.join(' '))}`;
    if (idsTrab.length>0) endpoint += `&idsTrab=${encodeURIComponent(idsTrab.join(' '))}`;
    if (conEventos) endpoint += `&conEventos=`;
    if (soloConEvento) endpoint += `&soloConEvento=`;
    if (soloSinEvento) endpoint += `&soloSinEvento=`;
    if (soloConPartPerm) endpoint += `&soloConPartPerm=`;
    if (soloSinPartPerm) endpoint += `&soloSinPartPerm=`;
    if (soloConTipPartPerm) endpoint += `&soloConTipPartPerm=`;
    if (soloSinTipPartPerm) endpoint += `&soloSinTipPartPerm=`;
    if (soloConEvPerm) endpoint += `&soloConEvPerm=`;
    if (soloSinEvPerm) endpoint += `&soloSinEvPerm=`;
    if (soloConTipEvPerm) endpoint += `&soloConTipEvPerm=`;
    if (soloSinTipEvPerm) endpoint += `&soloSinTipEvPerm=`;
    if (soloConEstatusTrabPerm) endpoint += `&soloConEstatusTrabPerm=`;
    if (soloSinEstatusTrabPerm) endpoint += `&soloSinEstatusTrabPerm=`;
    if (soloConTrab) endpoint += `&soloConTrab=`;
    if (soloSinTrab) endpoint += `&soloSinTrab=`;
    if (incluir!='') endpoint += `&incluir=`+incluir;
    if (ordenar!='') endpoint += `&ordenar=`+ordenar;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getTypeWorkByEvent(eventoId?:any){
    return this.getTypeWork(
      true,0,0,'','','','','',
      eventoId,'','','',false,
      false,false,false,false,
      false, false,false,false,
      false,false,false,
      false,false,false,
      '',''
    )
  }

  getTypeWorkAsign(page?:number,pageSize?:number,eventoId?:any){
    return this.getTypeWork(
      false,page,pageSize,'','',eventoId,'','',
      '','','','',false,
      false,false,false,false,
      false, false,false,false,
      false,false,false,
      false,false,false,
      '',''
    )
  }

}
