import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class SchoolsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getShools(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInst?:any,idsInstRorCita?:any,
    idsInstRorProd?:any,idsInstScintraCita?:any,idsInvest?:any,idsInvestProd?:any,idsInvestCita?:any,
    idsInstScintraProd?:any,idsCampus?:any,idsEvento?:any,idsCentrosInv?:any,con_institucion?:boolean,
    soloConInstSc?:boolean,soloSinInstSc?:boolean,soloConCampus?:boolean,soloSinCampus?:boolean,
    soloConCentrosInv?:boolean,soloSinCentrosInv?:boolean,soloConInvestigador?:boolean,soloSinInvestigador?:boolean,
    soloConEvScicom?:boolean,soloSinEvScicom?:boolean,soloConProduct?:boolean,
  ){
    let endpoint = `${this.globals.backend_base_url}/colegios?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInst.length>0) endpoint += `&idsInst=${encodeURIComponent(idsInst.join(' '))}`;
    if (idsInstRorCita.length>0) endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (idsInstRorProd.length>0) endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsInstScintraCita.length>0) endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInvest.length>0) endpoint += `&idsInvest=${encodeURIComponent(idsInvest.join(' '))}`;
    if (idsInvestProd.length>0) endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInvestCita.length>0) endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsInstScintraProd.length>0) endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsCampus.length>0) endpoint += `&idsCampus=${encodeURIComponent(idsCampus.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsCentrosInv.length>0) endpoint += `&idsCentrosInv=${encodeURIComponent(idsCentrosInv.join(' '))}`;
    if (con_institucion) endpoint += `&con_institucion=`;
    if (soloConInstSc) endpoint += `&soloConInstSc=`;
    if (soloSinInstSc) endpoint += `&soloSinInstSc=`;
    if (soloConCampus) endpoint += `&soloConCampus=`;
    if (soloSinCampus) endpoint += `&soloSinCampus=`;
    if (soloConCentrosInv) endpoint += `&soloConCentrosInv=`;
    if (soloSinCentrosInv) endpoint += `&soloSinCentrosInv=`;
    if (soloConInvestigador) endpoint += `&soloConInvestigador=`;
    if (soloSinInvestigador) endpoint += `&soloSinInvestigador=`;
    if (soloConEvScicom) endpoint += `&soloConEvScicom=`;
    if (soloSinEvScicom) endpoint += `&soloSinEvScicom=`;
    if (soloConProduct) endpoint += `&soloConProduct=`;
    return this.http.get(endpoint)
  }

  getAllSchools(page?:number,pageSize?:number){
    return this.getShools(false,page,pageSize,'','','','','',
      '','','','','','','',
      '',false,false,false,false,false,
      false,false,false,false,false,
      false,false
    );
  }

  getSchoolsList(){
    return this.getShools(true,0,0,'','','','','',
      '','','','','','','',
      '',false,false,false,false,false,
      false,false,false,false,false,
      false,false
    );
  }

  getSchoolsByFilter(page:number,pageSize:number,search:string,idsInst:any,idsCampus:any,idsCentroInv:any,
                     idsInvest:any,soloConProduct:boolean){
    return this.getShools(false,page,pageSize,search,'',idsInst,'','',
      '',idsInvest,'','','',idsCampus,'',
      idsCentroInv,false,false,false,false,false,
      false,false,false,false,false,
      false,soloConProduct
    );
  }

  getSchoolsByCampus(idsCampus:any){
    return this.getShools(true,0,0,'','','','','',
      '','','','','',idsCampus,'',
      '',false,false,false,false,false,
      false,false,false,false,false,
      false,false
    );
  }

  getSchoolsWidthCenters(){
    return this.getShools(true,0,0,'','','','','',
      '','','','','','','',
      '',false,false,false,false,false,
      true,false,false,false,false,
      false,false
    );
  }

  getSchoolsWidthCentersByInst(page?:number,pageSize?:number,search?:string,idsInst?:any){
    return this.getShools(false,page,pageSize,search,'',idsInst,'','',
      '','','','','','','',
      '',false,false,false,false,false,
      true,false,false,false,false,
      false,false
    );
  }

  getSchoolsWidthInvest(){
    return this.getShools(true,0,0,'','','','','',
      '','','','','','','',
      '',false,false,false,false,false,
      false,false,true,false,false,
      false,false
    );
  }

  getSchoolsWidthInvestByFilter(page?:number,pageSize?:number,search?:string,idsInst?:any,idsCampus?:any){
    return this.getShools(false,page,pageSize,search,'',idsInst,'','',
      '','','','','',idsCampus,'',
      '',false,false,false,false,false,
      false,false,true,false,false,
      false,false
    );
  }

  getSchoolsByInvestigador(idInvestigador:number){
    let endpoint = `${this.globals.backend_base_url}/colegios?no_paginate=&idsInvest=${idInvestigador}`
    return this.http.get(endpoint)
  }


  addSchool(nombre:string,idInstitucion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/colegios/create`
    return this.http.post(ENDPOINT,{nombre:nombre,id_institucion:idInstitucion})
  }

  updateSchool(idColegio:number,nombre:string,descripcion:string){
    let data = new FormData();
    data.append('nombre',nombre.toString());
    data.append('descripcion',descripcion.toString());
    const ENDPOINT = `${this.globals.backend_base_url}/colegios/${idColegio}/update`
    return this.http.post(ENDPOINT,data)
  }

  deleteSchool(idColegio:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/colegios/${idColegio}/delete`
    return this.http.delete(ENDPOINT)
  }

  addSchoolsToInvestigador(idInvest:number,idColegio:number){
    let endpoint = `${this.globals.backend_base_url}/colegio/${idColegio}/investigador/${idInvest}/asociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeSchoolsToInvestigador(idInvest:number,idColegio:number){
    let endpoint = `${this.globals.backend_base_url}/colegio/${idColegio}/investigador/${idInvest}/desasociar`
    return this.http.delete(endpoint)
  }

}

