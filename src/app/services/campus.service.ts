import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class CampusService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Consulta los campus versión simple
   */
  getSimples(id_institucion?: any, id_colegio?:any, id_investigador?: any, idsInvestProd?: Array<any>,
             idsInstScintraProd?: Array<any>, idsInstRorProd?: Array<any>, idsInvestCita?: Array<any>,
             idsInstScintraCita?: Array<any>, idsInstRorCita?: Array<any>, idsEvento?: Array<any>,
             soloConProduct?: boolean)
  {
    let endpoint = `${this.globals.backend_base_url}/campus/simples?no_paginate=&test=0`
    if (id_institucion)
      endpoint += `&idsInst=${encodeURIComponent(id_institucion)}`;
    if (id_colegio)
      endpoint += `&idsColegio=${encodeURIComponent(id_colegio)}`;
    if (id_investigador)
      endpoint += `&idsInvest=${encodeURIComponent(id_investigador)}`;
    if (idsEvento)
      endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsInvestProd)
      endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInstScintraProd)
      endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsInstRorProd)
      endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsInvestCita)
      endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsInstScintraCita)
      endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInstRorCita)
      endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (soloConProduct)
      endpoint += `&soloConProduct=`;
    return this.http.get(endpoint)
  }

  /**
   * Consulta los campus
   */
  get(id_institucion?: any, id_colegio?:any, id_investigador?: any, idsEvento?: Array<any>, idsInvestProd?: Array<any>,
      idsInstScintraProd?: Array<any>, idsInstRorProd?: Array<any>, idsInvestCita?: Array<any>,
      idsInstScintraCita?: Array<any>, idsInstRorCita?: Array<any>, con_institucion?: boolean)
  {
    let endpoint = `${this.globals.backend_base_url}/campus?no_paginate=&test=0`
    if (id_institucion)
      endpoint += `&idsInst=${encodeURIComponent(id_institucion)}`;
    if (id_colegio)
      endpoint += `&idsColegio=${encodeURIComponent(id_colegio)}`;
    if (id_investigador)
      endpoint += `&idsInvest=${encodeURIComponent(id_investigador)}`;
    if (idsEvento)
      endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsInvestProd)
      endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInstScintraProd)
      endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsInstRorProd)
      endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsInvestCita)
      endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsInstScintraCita)
      endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInstRorCita)
      endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (con_institucion)
      endpoint += `&con_institucion=`;
    return this.http.get(endpoint)
  }

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

  getAllCampus(page?:number,pageSize?:number){
    return this.getCampus(false,page,pageSize,'','','','','',
      '','','','','','','', '',
      '','','',false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getCampusList(){
    return this.getCampus(true,0,0,'','','','','',
      '','','','','','','', '',
      '','','',false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getCampusWidthInvestByFilter(page?:number,pageSize?:number,search?:string,idsInst?:any,idsColegio?:any){
    return this.getCampus(false,page,pageSize,search,'','','','',
      '','','','','','','', '',
      '','','',false,false,false,
      false,false,false,false,true,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getCampusWidthSchools(){
    return this.getCampus(true,0,0,'','','','','',
      '','','','','','','', '',
      '','','',false,false,false,
      false,false,true,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getCampusWidthSchoolsByFilter(page?:number,pageSize?:number,search?:string,idsInst?:any,idsCentrosInvest?:any,idsInvest?:any){
    return this.getCampus(false,page,pageSize,search,'',idsInst,'','',
      '',idsInvest,'','','','','', '',
      '','','',false,false,false,
      false,false,true,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getCampusByFilter(page?:number,pageSize?:number,search?:string,idsInstScintraProd?:any){
    return this.getCampus(false,page,pageSize,search,'','','',idsInstScintraProd,
      '','','','','','','', '',
      '','','',false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getCampusWidthInvest(){
    return this.getCampus(true,0,0,'','','','','',
      '','','','','','','', '',
      '','','',false,false,false,
      false,false,false,false,true,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  getCampusByInvestigador(idsInvest:any){
    return this.getCampus(true,0,0,'','','','','',
      '',idsInvest,'','','','','', '',
      '','','',false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false
    );
  }

  addCampus(nombre:string,direccion:string,correo:string,idInstitucion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/campus/create`
    return this.http.post(ENDPOINT,{nombre:nombre,direccion:direccion,correo:correo,id_institucion:idInstitucion})
  }

  updateCampus(idCampus:number,nombre:string,direccion:string,correo:string,telefono:any){
    let datos = new FormData();
    if(nombre!="" && nombre!==null){ datos.append('nombre',nombre.toString());}
    if(direccion!="" && direccion!==null){ datos.append('direccion',direccion.toString());}
    if(correo!="" && correo!==null){ datos.append('correo',correo.toString());}
    //console.log("telefono",telefono);
    datos.append('phone',telefono.toString());
    const ENDPOINT = `${this.globals.backend_base_url}/campus/${idCampus}/update`
    return this.http.post(ENDPOINT,datos)
  }

  deleteCampus(idCampus:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/campus/${idCampus}/delete`
    return this.http.delete(ENDPOINT)
  }

  addColegioToCampús(idCampus:number,idColegio:number){
    let endpoint = `${this.globals.backend_base_url}/campus/${idCampus}/colegio/${idColegio}/asociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeColegioToCampús(idCampus:number,idColegio:number){
    let endpoint = `${this.globals.backend_base_url}/campus/${idCampus}/colegio/${idColegio}/desasociar`
    return this.http.delete(endpoint)
  }

  addCampusToInvestigador(idInvest:number,idCampus:number){
    let endpoint = `${this.globals.backend_base_url}/campus/${idCampus}/investigador/${idInvest}/asociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeCampusToInvestigador(idInvest:number,idCampus:number){
    let endpoint = `${this.globals.backend_base_url}/campus/${idCampus}/investigador/${idInvest}/desasociar`
    return this.http.delete(endpoint)
  }

}
