import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class InstitutionRorService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {
  }

  getInstitutionsRor(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsEvento?:any,
    idsTrabScicom?:any,idsAutTrabScicom?:any,idsInvestProd?:any,idsInstScintraProd?:any,idsInstRorProd?:any,
    idsInvestCita?:any,idsInstScintraCita?:any,idsInstRorCita?:any,idsRor?:any,idsGrid?:any,idsInstSc?:any,
    idsCoautorProd?:any,idsCoautorCita?:any,idsPais?:any,idsProyInvestFinanc?:any,idsEspacioFisico?:any,
    idsUsuScicom?:any,idsAutoresDeActividadScicom?:any,idsPatroc?:any,con_pais?:boolean,soloConPatroc?:boolean,
    soloSinPatroc?:boolean,soloConProduct?:boolean,soloSinProduct?:boolean,soloConCita?:boolean,
    soloSinCita?:boolean,soloConInstSc?:boolean,soloSinInstSc?:boolean,soloConCoautorProd?:boolean,
    soloSinCoautorProd?:boolean,soloConCoautorCita?:boolean,soloSinCoautorCita?:boolean,
    soloConEventoScicom?:boolean,soloSinEventoScicom?:boolean,soloConAutorTrabScicom?:boolean,
    soloSinAutorTrabScicom?:boolean,soloConTrabScicom?:boolean, soloSinTrabScicom?:boolean,
    soloConPais?:boolean,soloSinPais?:boolean,soloConProyectInvest?:boolean,
    soloSinProyectInvest?:boolean,soloConEspacioFisico?:boolean,soloSinEspacioFisico?:boolean,
    soloConUsuScicom?:boolean,soloSinUsuScicom?:boolean,soloConAutorActScicom?:boolean,
    soloSinAutorActScicom?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/rors/simples?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsEvento.length>0) endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsTrabScicom.length>0) endpoint += `&idsTrabScicom=${encodeURIComponent(idsTrabScicom.join(' '))}`;
    if (idsAutTrabScicom.length>0) endpoint += `&idsAutTrabScicom=${encodeURIComponent(idsAutTrabScicom.join(' '))}`;
    if (idsInvestProd.length>0) endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInstScintraProd.length>0) endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsInstRorProd.length>0) endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsInvestCita.length>0) endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsInstScintraCita.length>0) endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInstRorCita.length>0) endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (idsRor.length>0) endpoint += `&idsRor=${encodeURIComponent(idsRor.join(' '))}`;
    if (idsGrid.length>0) endpoint += `&idsGrid=${encodeURIComponent(idsGrid.join(' '))}`;
    if (idsInstSc.length>0) endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (idsCoautorProd.length>0) endpoint += `&idsCoautorProd=${encodeURIComponent(idsCoautorProd.join(' '))}`;
    if (idsCoautorCita.length>0) endpoint += `&idsCoautorCita=${encodeURIComponent(idsCoautorCita.join(' '))}`;
    if (idsPais.length>0) endpoint += `&idsPais=${encodeURIComponent(idsPais.join(' '))}`;
    if (idsProyInvestFinanc.length>0) endpoint += `&idsProyInvestFinanc=${encodeURIComponent(idsProyInvestFinanc.join(' '))}`;
    if (idsEspacioFisico.length>0) endpoint += `&idsEspacioFisico=${encodeURIComponent(idsEspacioFisico.join(' '))}`;
    if (idsUsuScicom.length>0) endpoint += `&idsUsuScicom=${encodeURIComponent(idsUsuScicom.join(' '))}`;
    if (idsAutoresDeActividadScicom.length>0) endpoint += `&idsAutoresDeActividadScicom=${encodeURIComponent(idsAutoresDeActividadScicom.join(' '))}`;
    if (idsPatroc.length>0) endpoint += `&idsPatroc=${encodeURIComponent(idsPatroc.join(' '))}`;
    if (con_pais) endpoint += `&con_pais=`;
    if (soloConPatroc) endpoint += `&soloConPatroc=`;
    if (soloSinPatroc) endpoint += `&soloSinPatroc=`;
    if (soloConProduct) endpoint += `&soloConProduct=`;
    if (soloSinProduct) endpoint += `&soloSinProduct=`;
    if (soloConCita) endpoint += `&soloConCita=`;
    if (soloSinCita) endpoint += `&soloSinCita=`;
    if (soloConInstSc) endpoint += `&soloConInstSc=`;
    if (soloSinInstSc) endpoint += `&soloSinInstSc=`;
    if (soloConCoautorProd) endpoint += `&soloConCoautorProd=`;
    if (soloSinCoautorProd) endpoint += `&soloSinCoautorProd=`;
    if (soloConCoautorCita) endpoint += `&soloConCoautorCita=`;
    if (soloSinCoautorCita) endpoint += `&soloSinCoautorCita=`;
    if (soloConEventoScicom) endpoint += `&soloConEventoScicom=`;
    if (soloSinEventoScicom) endpoint += `&soloSinEventoScicom=`;
    if (soloConAutorTrabScicom) endpoint += `&soloConAutorTrabScicom=`;
    if (soloSinAutorTrabScicom) endpoint += `&soloSinAutorTrabScicom=`;
    if (soloConTrabScicom) endpoint += `&soloConTrabScicom=`;
    if (soloSinTrabScicom) endpoint += `&soloSinTrabScicom=`;
    if (soloConPais) endpoint += `&soloConPais=`;
    if (soloSinPais) endpoint += `&soloSinPais=`;
    if (soloConProyectInvest) endpoint += `&soloConProyectInvest=`;
    if (soloSinProyectInvest) endpoint += `&soloSinProyectInvest=`;
    if (soloConEspacioFisico) endpoint += `&soloConEspacioFisico=`;
    if (soloSinEspacioFisico) endpoint += `&soloSinEspacioFisico=`;
    if (soloConUsuScicom) endpoint += `&soloConUsuScicom=`;
    if (soloSinUsuScicom) endpoint += `&soloSinUsuScicom=`;
    if (soloConAutorActScicom) endpoint += `&soloConAutorActScicom=`;
    if (soloSinAutorActScicom) endpoint += `&soloSinAutorActScicom=`;
    //console.log("endpoint",endpoint)
    return this.http.get(endpoint)
  }

  getAllInstitutionsRor(page:number,pageSize:number) {
    return this.getInstitutionsRor(
      false,page,pageSize,'','','','','','',
      '','','','','','','','',
      '','','','','','',
      '','',false,false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false
    )
  }

  getAllInstitutionsRorWidthInstSc(page:number,pageSize:number,search:string) {
    return this.getInstitutionsRor(
      false,page,pageSize,search,'','','','','',
      '','','','','','','','',
      '','','','','','',
      '','',false,false,false,false,
      false,false,false,true,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false
    )
  }

  getInstitutionsByFilter(page?:number,pageSize?:number,search?:string,
                          soloConProyectInvest?:boolean,soloConProduct?:boolean,soloConCita?:boolean) {
    return this.getInstitutionsRor(
      false,page,pageSize,search,'','','','','',
      '','','','','','','','',
      '','','','','','',
      '','',false,false,false,soloConProduct,
      false,soloConCita,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,soloConProyectInvest,false,false,false,
      false,false,false,false
    )
  }

  getInstitutionsRorByFilter(page:number,pageSize:number,search?:string,idsInstScintra?:any,idsPais?:any) {
    return this.getInstitutionsRor(
      false,page,pageSize,search,'','','','','',
      '','','','','','','',idsInstScintra,
      '','',idsPais,'','','',
      '','',false,false,false,false,
      false,false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false
    )
  }



  getInstitutionsBySearch(criterio:string) {
    let endpoint = `${this.globals.backend_base_url}/rors/simples?no_paginate=&search=${criterio}`
    return this.http.get(endpoint)
  }

  getInstitutionsRorById(idInstitucion:number) {
    let endpoint = `${this.globals.backend_base_url}/rors/${idInstitucion}?con_pais=`
    return this.http.get(endpoint)
  }

  getInstitutionsRorByIdRor(idInstitucion:number) {
    let endpoint = `${this.globals.backend_base_url}/rors/simples?no_paginate=&idsRor=${idInstitucion}`
    return this.http.get(endpoint)
  }

  addInstitutionsRor(idPais:any,nombre:string){
    const ENDPOINT = `${this.globals.backend_base_url}/rors/create`
    return this.http.post(ENDPOINT,{institution_name:nombre,id_pais:idPais})
  }

  updateInstitutionsRor(idInst:number,nombre:string,id_pais:number,city:string,state:string,country:string,link:string,latitud:string,longitud:string,id_ror:string){
    const endpoint = `${this.globals.backend_base_url}/rors/${idInst}/update`
    let formData = new FormData();
    formData.append('institution_name', nombre.toString());
    formData.append('id_pais', id_pais.toString());
    if(city!==null && city!=undefined){formData.append('city', city.toString());}
    if(state!==null && state!=undefined){formData.append('state', state.toString());}
    if(country!==null && country!=undefined){formData.append('country', country.toString());}
    if(link!==null && link!=undefined){formData.append('link', link.toString());}
    if(latitud!==null && latitud!=undefined){formData.append('latitud', latitud.toString());}
    if(longitud!==null && longitud!=undefined){formData.append('longitud', longitud.toString());}
    if(id_ror!==null && id_ror!=undefined && id_ror!=""){formData.append('id_ror', id_ror.toString());}
    return this.http.post(endpoint, formData)
  }

  deleteInstitutionsRor(idRor:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/rors/${idRor}/delete`
    return this.http.delete(ENDPOINT)
  }

}
