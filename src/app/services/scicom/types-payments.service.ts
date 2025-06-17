import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TypesPaymentsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getTypePayments(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,
                  idsEvent?:any,idsEvPerm?:any,idsTipEvPerm?:any,idsPago?:any,idsEstatusPago?:any,idsFormaPago?:any,
                  conEventos?:boolean,soloConEvento?:boolean,soloSinEvento?:boolean,soloConEvPerm?:boolean,
                  soloSinEvPerm?:boolean,soloConTipEvPerm?:boolean,soloSinTipEvPerm?:boolean,soloConPago?:boolean,
                  soloSinPago?:boolean,soloConEstatusPago?:boolean,soloSinEstatusPago?:boolean,
                  soloConFormaPago?:boolean,soloSinFormaPago?:boolean,
                  incluir?:string,ordenar?:string
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/tipspago?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsEvent.length>0) endpoint += `&idsEvent=${encodeURIComponent(idsEvent.join(' '))}`;
    if (idsEvPerm.length>0) endpoint += `&idsEvPerm=${encodeURIComponent(idsEvPerm.join(' '))}`;
    if (idsTipEvPerm.length>0) endpoint += `&idsTipEvPerm=${encodeURIComponent(idsTipEvPerm.join(' '))}`;
    if (idsPago.length>0) endpoint += `&idsPago=${encodeURIComponent(idsPago.join(' '))}`;
    if (idsEstatusPago.length>0) endpoint += `&idsEstatusPago=${encodeURIComponent(idsEstatusPago.join(' '))}`;
    if (idsFormaPago.length>0) endpoint += `&idsFormaPago=${encodeURIComponent(idsFormaPago.join(' '))}`;
    if (conEventos) endpoint += `&conEventos=`;
    if (soloConEvento) endpoint += `&soloConEvento=`;
    if (soloSinEvento) endpoint += `&soloSinEvento=`;
    if (soloConEvPerm) endpoint += `&soloConEvPerm=`;
    if (soloSinEvPerm) endpoint += `&soloSinEvPerm=`;
    if (soloConTipEvPerm) endpoint += `&soloConTipEvPerm=`;
    if (soloSinTipEvPerm) endpoint += `&soloSinTipEvPerm=`;
    if (soloConPago) endpoint += `&soloConPago=`;
    if (soloSinPago) endpoint += `&soloSinPago=`;
    if (soloConEstatusPago) endpoint += `&soloConEstatusPago=`;
    if (soloSinEstatusPago) endpoint += `&soloSinEstatusPago=`;
    if (soloConFormaPago) endpoint += `&soloConFormaPago=`;
    if (soloSinFormaPago) endpoint += `&soloSinFormaPago=`;
    if (incluir!='') endpoint += `&incluir=`+incluir;
    if (ordenar!='') endpoint += `&ordenar=`+ordenar;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getPaymentsList(idEvento:any){
    return this.getTypePayments(true,0,0,'','',[idEvento],'',
      '', '','','',false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,
      '',''
    );
  }

  getPaymentsAsign(page?:number,pageSize?:number,idEvento?:any){
    return this.getTypePayments(false,page,pageSize,'','',[idEvento],'',
      '', '','','',false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,
      '',''
    );
  }
}
