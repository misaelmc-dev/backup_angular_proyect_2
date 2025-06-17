import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class CollaboratorsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getColaborators(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,
                  idsUser?:any,idsRol?:any,idEvento?:any,idsRor?:any,idsAprend?:any,idsTipNotif?:any,
                  idsCampus?:any,idsPart?:any,idsPatrocinador?:any,idsPatrocinado?:any,idsRangTiemp?:any,
                  idsEval?:any,conRor?:boolean,conAprend?:boolean,conTipNotif?:boolean,conCampus?:boolean,
                  soloConUser?:boolean,soloSinUser?:boolean,soloConRor?:boolean,soloSinRor?:boolean,
                  soloConCampus?:boolean,soloSinCampus?:boolean,soloConEvento?:boolean,soloSinEvento?:boolean,
                  soloConRolScicom?:boolean,soloSinRolScicom?:boolean,soloConAprendizaje?:boolean,
                  soloSinAprendizaje?:boolean,soloConTipNotif?:boolean,soloSinTipNotif?:boolean,
                  soloConPart?:boolean,soloSinPart?:boolean,soloConPatrocinador?:boolean,
                  soloSinPatrocinador?:boolean,soloConPatrocinad?:boolean,soloSinPatrocinad?:boolean,
                  soloConEval?:boolean,soloSinEval?:boolean,soloConRangTiemp?:boolean,soloSinRangTiemp?:boolean,
                  incluir?:string,ordenar?:string
  ){
    let endpoint = `${this.globals.backend_base_url}/scicom/usuarios?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsUser.length>0) endpoint += `&idsUser=${encodeURIComponent(idsUser.join(' '))}`;
    if (idsRol.length>0) endpoint += `&idsRol=${encodeURIComponent(idsRol.join(' '))}`;
    if (idEvento.length>0) endpoint += `&idEvento=${encodeURIComponent(idEvento.join(' '))}`;
    if (idsRor.length>0) endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (idsAprend.length>0) endpoint += `&idsAprend=${encodeURIComponent(idsAprend.join(' '))}`;
    if (idsTipNotif.length>0) endpoint += `&idsTipNotif=${encodeURIComponent(idsTipNotif.join(' '))}`;
    if (idsCampus.length>0) endpoint += `&idsCampus=${encodeURIComponent(idsCampus.join(' '))}`;
    if (idsPart.length>0) endpoint += `&idsPart=${encodeURIComponent(idsPart.join(' '))}`;
    if (idsPatrocinador.length>0) endpoint += `&idsPatrocinador=${encodeURIComponent(idsPatrocinador.join(' '))}`;
    if (idsPatrocinado.length>0) endpoint += `&idsPatrocinado=${encodeURIComponent(idsPatrocinado.join(' '))}`;
    if (idsRangTiemp.length>0) endpoint += `&idsRangTiemp=${encodeURIComponent(idsRangTiemp.join(' '))}`;
    if (idsEval.length>0) endpoint += `&idsEval=${encodeURIComponent(idsEval.join(' '))}`;
    if (conRor) endpoint += `&conRor=`;
    if (conAprend) endpoint += `&conAprend=`;
    if (conTipNotif) endpoint += `&conTipNotif=`;
    if (conCampus) endpoint += `&conCampus=`;
    if (soloConUser) endpoint += `&soloConUser=`;
    if (soloSinUser) endpoint += `&soloSinUser=`;
    if (soloConRor) endpoint += `&soloConRor=`;
    if (soloSinRor) endpoint += `&soloSinRor=`;
    if (soloConCampus) endpoint += `&soloConCampus=`;
    if (soloSinCampus) endpoint += `&soloSinCampus=`;
    if (soloConEvento) endpoint += `&soloConEvento=`;
    if (soloSinEvento) endpoint += `&soloSinEvento=`;
    if (soloConRolScicom) endpoint += `&soloConRolScicom=`;
    if (soloSinRolScicom) endpoint += `&soloSinRolScicom=`;
    if (soloConAprendizaje) endpoint += `&soloConAprendizaje=`;
    if (soloSinAprendizaje) endpoint += `&soloSinAprendizaje=`;
    if (soloConTipNotif) endpoint += `&soloConTipNotif=`;
    if (soloSinTipNotif) endpoint += `&soloSinTipNotif=`;
    if (soloConPart) endpoint += `&soloConPart=`;
    if (soloSinPart) endpoint += `&soloSinPart=`;
    if (soloConPatrocinador) endpoint += `&soloConPatrocinador=`;
    if (soloSinPatrocinador) endpoint += `&soloSinPatrocinador=`;
    if (soloConPatrocinad) endpoint += `&soloConPatrocinad=`;
    if (soloSinPatrocinad) endpoint += `&soloSinPatrocinad=`;
    if (soloConEval) endpoint += `&soloConEval=`;
    if (soloSinEval) endpoint += `&soloSinEval=`;
    if (soloConRangTiemp) endpoint += `&soloConRangTiemp=`;
    if (soloSinRangTiemp) endpoint += `&soloSinRangTiemp=`;
    if (incluir!='') endpoint += `&incluir=`+incluir;
    if (ordenar!='') endpoint += `&ordenar=`+ordenar;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getCollaboratorByEvent(page?:number,pageSize?:number,eventoId?:any,idUser?:number,ids?:Array<number>){
    return this.getColaborators(
      false,page,pageSize,'','','',[2,3],eventoId,'',
      '','','','','', '','',
      '',true,false,false,true,
      false, false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      '',''
    )
  }

}
