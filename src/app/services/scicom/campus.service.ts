import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class CampusService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getCampus(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInst?:any,
            idsInstScintraCita?:any,idsInstScintraProd?:any,idsInstRorCita?:any,idsInvest?:any,idsInvestCita?:any,
            idsColegio?:any,idsEvento?:any,idsInvestProd?:any,idsInstRorProd?:any,idsUsrScicom?:any,
            idsAutTrabScicom?:any,idsUserResource?:any,idsMetas?:any,con_institucion?:boolean,soloConProduct?:boolean,
            soloSinProduct?:boolean,soloConInstSc?:boolean,soloSinInstSc?:boolean,soloConColegio?:boolean,
            soloSinColegio?:boolean,soloConInvest?:boolean,soloSinInvest?:boolean,soloConEventoScicom?:boolean,
            soloSinEventoScicom?:boolean,soloConUsuarioScicom?:boolean,soloSinUsuarioScicom?:boolean,
            soloConAutorTrabScicom?:boolean,soloSinAutorTrabScicom?:boolean,soloConUserRes?:boolean,
            soloSinUserRes?:boolean,soloConMeta?:boolean,soloSinMeta?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/campus?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInst.length>0) endpoint += `&idsInst=${encodeURIComponent(idsInst.join(' '))}`;
    if (idsInstScintraCita.length>0) endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInstScintraProd.length>0) endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsInstRorCita.length>0) endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (idsInvest.length>0) endpoint += `&idsInvest=${encodeURIComponent(idsInvest.join(' '))}`;
    if (idsInvestCita.length>0) endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsColegio.length>0) endpoint += `&idsColegio=${encodeURIComponent(idsColegio.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsInvestProd.length>0) endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInstRorProd.length>0) endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsUsrScicom.length>0) endpoint += `&idsUsrScicom=${encodeURIComponent(idsUsrScicom.join(' '))}`;
    if (idsAutTrabScicom.length>0) endpoint += `&idsAutTrabScicom=${encodeURIComponent(idsAutTrabScicom.join(' '))}`;
    if (idsUserResource.length>0) endpoint += `&idsUserResource=${encodeURIComponent(idsUserResource.join(' '))}`;
    if (idsMetas.length>0) endpoint += `&idsMetas=${encodeURIComponent(idsMetas.join(' '))}`;
    if (con_institucion) endpoint += `&con_institucion`;
    if (soloConProduct) endpoint += `&soloConProduct`;
    if (soloSinProduct) endpoint += `&soloSinProduct`;
    if (soloConInstSc) endpoint += `&soloConInstSc`;
    if (soloSinInstSc) endpoint += `&soloSinInstSc`;
    if (soloConColegio) endpoint += `&soloConColegio`;
    if (soloSinColegio) endpoint += `&soloSinColegio`;
    if (soloConInvest) endpoint += `&soloConInvest`;
    if (soloSinInvest) endpoint += `&soloSinInvest`;
    if (soloConEventoScicom) endpoint += `&soloConEventoScicom`;
    if (soloSinEventoScicom) endpoint += `&soloSinEventoScicom`;
    if (soloConUsuarioScicom) endpoint += `&soloConUsuarioScicom`;
    if (soloSinUsuarioScicom) endpoint += `&soloSinUsuarioScicom`;
    if (soloConAutorTrabScicom) endpoint += `&soloConAutorTrabScicom`;
    if (soloSinAutorTrabScicom) endpoint += `&soloSinAutorTrabScicom`;
    if (soloConUserRes) endpoint += `&soloConUserRes`;
    if (soloSinUserRes) endpoint += `&soloSinUserRes`;
    if (soloConMeta) endpoint += `&soloConMeta`;
    if (soloSinMeta) endpoint += `&soloSinMeta`;
    return this.http.get(endpoint)
  }

  getCampusListByCord(cordId:any){
    return this.getCampus(true,0,0,'','',cordId,'','',
      '','','','','','','', '',
      '','','',false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getCampusByEvent(page?:number,pageSize?:number,idsEvento?:any){
    return this.getCampus(false,page,pageSize,'','','','','',
      '','','','',idsEvento,'','', '',
      '','','',false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

}
