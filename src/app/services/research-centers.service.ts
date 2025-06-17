import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class ResearchCentersService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getCenters(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInst?:any,
    idsInvest?:any,idsEvento?:any,idsColegio?:any,idsProy?:any,con_institucion?:boolean,
    soloConProyectInvest?:boolean,soloSinProyectInvest?:boolean,soloConInstitucion?:boolean,
    soloSinInstitucion?:boolean,soloConColegio?:boolean,soloSinColegio?:boolean,soloConInvest?:boolean,
    soloSinInvest?:boolean,soloConEvento?:boolean,soloSinEvento?:boolean,soloConProduct?:boolean,
  ){
    let endpoint = `${this.globals.backend_base_url}/centros_invest?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInst.length>0) endpoint += `&idsInst=${encodeURIComponent(idsInst.join(' '))}`;
    if (idsInvest.length>0) endpoint += `&idsInvest=${encodeURIComponent(idsInvest.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsColegio.length>0) endpoint += `&idsColegio=${encodeURIComponent(idsColegio.join(' '))}`;
    if (idsProy.length>0) endpoint += `&idsProy=${encodeURIComponent(idsProy.join(' '))}`;
    if (con_institucion) endpoint += `&con_institucion=`;
    if (soloConProyectInvest) endpoint += `&soloConProyectInvest=`;
    if (soloSinProyectInvest) endpoint += `&soloSinProyectInvest=`;
    if (soloConInstitucion) endpoint += `&soloConInstitucion=`;
    if (soloSinInstitucion) endpoint += `&soloSinInstitucion=`;
    if (soloConColegio) endpoint += `&soloConColegio=`;
    if (soloSinColegio) endpoint += `&soloSinColegio=`;
    if (soloConInvest) endpoint += `&soloConInvest=`;
    if (soloSinInvest) endpoint += `&soloSinInvest=`;
    if (soloConEvento) endpoint += `&soloConEvento=`;
    if (soloSinEvento) endpoint += `&soloSinEvento=`;
    if (soloConProduct) endpoint += `&soloConProduct=`;
    return this.http.get(endpoint)
  }

  getAllCenters(page?:number,pageSize?:number){
    return this.getCenters(false,page,pageSize,'','','','','',
      '','',false,false,false,false, false,
      false,false,false,false,false,
      false,false
    )
  }

  getCentersList(){
    return this.getCenters(true,0,0,'','','','','',
      '','',false,false,false,false, false,
      false,false,false,false,false,
      false,false
    )
  }

  getCentersWidthSchools(){
    return this.getCenters(true,0,0,'','','','','',
      '','',false,false,false,false, false,
      true,false,false,false,false,
      false,false
    )
  }

  getCentersWidthSchoolsByFilter(page?:number,pageSize?:number,search?:string,idsInst?:any,idsCampus?:any,idsInvest?:any){
    return this.getCenters(false,page,pageSize,search,'',idsInst,idsInvest,'',
      '','',false,false,false,false, false,
      true,false,false,false,false,
      false,false
    )
  }

  getCentersByFilter(page:number,pageSize:number,search:string,idsInst:any,idsColegio:any,
                     soloConProyectInvest:boolean,soloConProduct:boolean){
    return this.getCenters(false,page,pageSize,search,'',idsInst,'','',
      idsColegio,'',false,soloConProyectInvest,false,false,
      false,false,false,false,false,
      false,false,soloConProduct
    )
  }

  getCentersWidthInvest(){
    return this.getCenters(true,0,0,'','','','','',
      '','',false,false,false,false, false,
      false,false,true,false,false,
      false,false
    )
  }

  getCentersWidthInvestByFilter(page?:number,pageSize?:number,search?:string,idsInst?:any,idsColegio?:any,){
    return this.getCenters(false,page,pageSize,search,'',idsInst,'','',
      idsColegio,'',false,false,false,false, false,
      false,false,true,false,false,
      false,false
    )
  }

  getCentersByInvestigador(idInvestigador:any){
    let endpoint = `${this.globals.backend_base_url}/centros_invest?no_paginate=&idsInvest=${idInvestigador}`
    return this.http.get(endpoint)
  }

  getColegiosByCentros(idCentro:number){
    let endpoint = `${this.globals.backend_base_url}/colegios?no_paginate=&idsCentrosInv=${idCentro}`
    return this.http.get(endpoint)
  }


  addCentros(nombre:string,idInstitucion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/centros_invest/create`
    return this.http.post(ENDPOINT,{nombre:nombre,id_institucion:idInstitucion})
  }

  updateCentros(idCentros:number,nombre:string,mision:string,website:string){
    let datos = new FormData();
    datos.append('nombre',nombre.toString());
    datos.append('mision',mision.toString());
    datos.append('website',website.toString());
    const ENDPOINT = `${this.globals.backend_base_url}/centros_invest/${idCentros}/update`
    return this.http.post(ENDPOINT,datos)
  }

  deleteCentros(idCentros:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/centros_invest/${idCentros}/delete`
    return this.http.delete(ENDPOINT)
  }

  addColegioToCampús(idCentro:number,idColegio:number){
    let endpoint = `${this.globals.backend_base_url}/centros_invest/${idCentro}/colegio/${idColegio}/asociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeColegioToCampús(idCentro:number,idColegio:number){
    let endpoint = `${this.globals.backend_base_url}/centros_invest/${idCentro}/colegio/${idColegio}/desasociar`
    return this.http.delete(endpoint)
  }

  addCenterToInvestigador(idInvest:number,idCenter:number){
    let endpoint = `${this.globals.backend_base_url}/centros_invest/${idCenter}/investigador/${idInvest}/asociar`
    let datos = new FormData();
    console.log("endpoint",endpoint)
    return this.http.post(endpoint,datos)
  }

  removeCenterToInvestigador(idInvest:number,idCenter:number){
    let endpoint = `${this.globals.backend_base_url}/centros_invest/${idCenter}/investigador/${idInvest}/desasociar`
    console.log("endpoint",endpoint)
    return this.http.delete(endpoint)
  }

}

