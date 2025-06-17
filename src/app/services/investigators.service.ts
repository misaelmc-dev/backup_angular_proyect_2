import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class InvestigatorsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getInvestigators(no_paginate?:boolean,page?:number,pageSize?:number,search?:string,ids?:any,idsInstSc?:any,
    idsInstRor?:any,idsPais?:any,idsCampus?:any,idsColegio?:any,idsCentro?:any,idsScopus?:any,idsUser?:any,
    idsNombAccident?:any,idsGradoInvest?:any,idsCriterioInst?:any,idsCriterioSni?:any,idsRedSocial?:any,
    idsLineaInvest?:any,idsProducto?:any,idsSni?:any,idsSniArea?:any,idsPubProblem?:any,conRedesSoc?:boolean,
    soloConInst?:boolean,soloSinInst?:boolean,soloConPais?:boolean,soloSinPais?:boolean,soloConNombAccidente?:boolean,
    soloSinNombAccidente?:boolean,soloConGradoInvest?:boolean,soloSinGradoInvest?:boolean,soloConCampus?:boolean,
    soloSinCampus?:boolean,soloConColegio?:boolean,soloSinColegio?:boolean,soloConCentroInvest?:boolean,
    soloSinCentroInvest?:boolean,soloConCriterioInst?:boolean,soloSinCriterioInst?:boolean,soloConCriterioSni?:boolean,
    soloConRedSocial?:boolean,soloSinRedSocial?:boolean,soloConLineaInvest?:boolean,soloSinLineaInvest?:boolean,
    soloConProducto?:boolean,soloSinProducto?:boolean,soloConSni?:boolean,soloSinSni?:boolean,soloConAreaSni?:boolean,
    soloSinAreaSni?:boolean,soloConPubProblem?:boolean,soloSinPubProblem?:boolean,soloConIdScopus?:boolean,
    soloSinIdScopus?:boolean,soloConProyInvest?:boolean,soloSinProyInvest?:boolean,soloConCita?:boolean,
    soloSinCita?:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/investigadores?`
    if (no_paginate) endpoint += `no_paginate=`;
    if (page!=0) endpoint += `page=${encodeURIComponent(page)}`;
    if (pageSize!=0) endpoint += `&page_size=${encodeURIComponent(pageSize)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ids.length>0) endpoint += `&ids=${encodeURIComponent(ids.join(' '))}`;
    if (idsInstSc.length>0) endpoint += `&idsInstSc=${encodeURIComponent(idsInstSc.join(' '))}`;
    if (idsInstRor.length>0) endpoint += `&idsInstRor=${encodeURIComponent(idsInstRor.join(' '))}`;
    if (idsPais.length>0) endpoint += `&idsPais=${encodeURIComponent(idsPais.join(' '))}`;
    if (idsCampus.length>0) endpoint += `&idsCampus=${encodeURIComponent(idsCampus.join(' '))}`;
    if (idsColegio.length>0) endpoint += `&idsColegio=${encodeURIComponent(idsColegio.join(' '))}`;
    if (idsCentro.length>0) endpoint += `&idsCentro=${encodeURIComponent(idsCentro.join(' '))}`;
    if (idsScopus.length>0) endpoint += `&idsScopus=${encodeURIComponent(idsScopus.join(' '))}`;
    if (idsUser.length>0) endpoint += `&idsUser=${encodeURIComponent(idsUser.join(' '))}`;
    if (idsNombAccident.length>0) endpoint += `&idsNombAccident=${encodeURIComponent(idsNombAccident.join(' '))}`;
    if (idsGradoInvest.length>0) endpoint += `&idsGradoInvest=${encodeURIComponent(idsGradoInvest.join(' '))}`;
    if (idsCriterioInst.length>0) endpoint += `&idsCriterioInst=${encodeURIComponent(idsCriterioInst.join(' '))}`;
    if (idsCriterioSni.length>0) endpoint += `&idsCriterioSni=${encodeURIComponent(idsCriterioSni.join(' '))}`;
    if (idsRedSocial.length>0) endpoint += `&idsRedSocial=${encodeURIComponent(idsRedSocial.join(' '))}`;
    if (idsLineaInvest.length>0) endpoint += `&idsLineaInvest=${encodeURIComponent(idsLineaInvest.join(' '))}`;
    if (idsProducto.length>0) endpoint += `&idsProducto=${encodeURIComponent(idsProducto.join(' '))}`;
    if (idsSni.length>0) endpoint += `&idsSni=${encodeURIComponent(idsSni.join(' '))}`
    if (idsSniArea.length>0) endpoint += `&idsSniArea=${encodeURIComponent(idsSniArea.join(' '))}`;
    if (idsPubProblem.length>0) endpoint += `&idsPubProblem=${encodeURIComponent(idsPubProblem.join(' '))}`;
    if (conRedesSoc) endpoint += `&conRedesSoc=`;
    if (soloConInst) endpoint += `&soloConInst=`;
    if (soloSinInst) endpoint += `&soloSinInst=`;
    if (soloConPais) endpoint += `&soloConPais=`;
    if (soloSinPais) endpoint += `&soloSinPais=`;
    if (soloConNombAccidente) endpoint += `&soloConNombAccidente=`;
    if (soloSinNombAccidente) endpoint += `&soloSinNombAccidente=`;
    if (soloConGradoInvest) endpoint += `&soloConGradoInvest=`;
    if (soloSinGradoInvest) endpoint += `&soloSinGradoInvest=`;
    if (soloConCampus) endpoint += `&soloConCampus=`;
    if (soloSinCampus) endpoint += `&soloSinCampus=`;
    if (soloConColegio) endpoint += `&soloConColegio=`;
    if (soloSinColegio) endpoint += `&soloSinColegio=`;
    if (soloConCentroInvest) endpoint += `&soloConCentroInvest=`;
    if (soloSinCentroInvest) endpoint += `&soloSinCentroInvest=`;
    if (soloConCriterioInst) endpoint += `&soloConCriterioInst=`;
    if (soloSinCriterioInst) endpoint += `&soloSinCriterioInst=`;
    if (soloConCriterioSni) endpoint += `&soloConCriterioSni=`;
    if (soloConRedSocial) endpoint += `&soloConRedSocial=`;
    if (soloSinRedSocial) endpoint += `&soloSinRedSocial=`;
    if (soloConLineaInvest) endpoint += `&soloConLineaInvest=`;
    if (soloSinLineaInvest) endpoint += `&soloSinLineaInvest=`;
    if (soloConProducto) endpoint += `&soloConProducto=`;
    if (soloSinProducto) endpoint += `&soloSinProducto=`;
    if (soloConSni) endpoint += `&soloConSni=`;
    if (soloSinSni) endpoint += `&soloSinSni=`;
    if (soloConAreaSni) endpoint += `&soloConAreaSni=`;
    if (soloSinAreaSni) endpoint += `&soloSinAreaSni=`;
    if (soloConPubProblem) endpoint += `&soloConPubProblem=`;
    if (soloSinPubProblem) endpoint += `&soloSinPubProblem=`;
    if (soloConIdScopus) endpoint += `&soloConIdScopus=`;
    if (soloSinIdScopus) endpoint += `&soloSinIdScopus=`;
    if (soloConProyInvest) endpoint += `&soloConProyInvest=`;
    if (soloSinProyInvest) endpoint += `&soloSinProyInvest=`;
    if (soloConCita) endpoint += `&soloConCita=`;
    if (soloSinCita) endpoint += `&soloSinCita=`;
    //console.log("endpoint",endpoint);
    return this.http.get(endpoint)
  }

  getAllInvestigators(page?:number,pageSize?:number) {
    return this.getInvestigators(
      false,page,pageSize,'','','','','','',
      '','','','','','','',
      '','','','','','','',
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false
    )
  }

  getInvestigatorsList() {
    return this.getInvestigators(
      true,0,0,'','','','','','',
      '','','','','','','',
      '','','','','','','',
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false
    )
  }

  getInvestigatorsWidthShools(){
    return this.getInvestigators(
      true,0,0,'','','','','','',
      '','','','','','','',
      '','','','','','','',
      false,false,false,false,false,
      false,false,false,false,
      false,false,true,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false
    )
  }

  getInvestigatorsWidthShoolsByFilter(page?:number,pageSize?:number,search?:string,idsInst?:any,idsCampus?:any,idsCentro?:any){
    return this.getInvestigators(
      false,page,pageSize,search,'',idsInst,'','',idsCampus,
      '',idsCentro,'','','','','',
      '','','','','','','',
      false,false,false,false,false,
      false,false,false,false,
      false,false,true,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false
    )
  }

  getAllInvestigatorId(idInvest:number) {
    let endpoint = `${this.globals.backend_base_url}/investigadores?ids=${idInvest}&page_size=10&page=1`
    return this.http.get(endpoint)
  }

  getInvestigatorsFilter(page?:number,pageSize?:number,search?:string,
    idsInstRor?:any,idsInstSc?:any,idsPais?:any,idsCampus?:any,idsColegio?:any,idsCentro?:any,
    SoloConProd?:boolean,SoloConCita?:boolean){
    return this.getInvestigators(
      false,page,pageSize,search,'',idsInstSc,idsInstRor,idsPais,idsCampus,
      idsColegio,idsCentro,'','','','','',
      '','','','','','','',
      false,false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,false,false,false,
      false,SoloConProd,false,false,false,
      false,false,false,false,
      false,false,false,false,
      SoloConCita,false
    )
  }

  addInvestigador(correo:string,idPais:number,idInstitucion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/investigadores/create`
    return this.http.post(ENDPOINT,{correo:correo,id_pais:idPais,id_institucion:idInstitucion})
  }

  updateInvestigador(idInvest:number,correo:string,idPais:number,idInstitucion:number,orcid:string,cargo:string){
    const endpoint = `${this.globals.backend_base_url}/investigadores/${idInvest}/update`
    let formData = new FormData();
    formData.append('correo', correo.toString());
    formData.append('idPais', idPais.toString());
    formData.append('idInstitucion', idInstitucion.toString());
    if(cargo!=null){ formData.append('cargo', cargo.toString());
    }else{ formData.append('cargo', '') }
    if(orcid!=null){ formData.append('orcid', orcid.toString());
    }else{ formData.append('orcid', '') }
    return this.http.post(endpoint, formData)
  }

  deleteInvestigador(idinvest:number) {
    const endpoint = `${this.globals.backend_base_url}/investigadores/${idinvest}/delete`
    return this.http.delete(endpoint)
  }

  addPictureInvestigator(idInvest:number,foto:any) {
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/subirfoto`;
    let formData = new FormData();
    formData.append('foto', foto);
    return this.http.post(endpoint, formData);
  }

  addNameToInvestigador(idInvest:number,nombre:string){
    let endpoint = `${this.globals.backend_base_url}/investigadores/nombreaccidente/create`
    let datos = new FormData();
    datos.append('nombre_accidente', nombre.toString());
    datos.append('id_investigador', idInvest.toString());
    return this.http.post(endpoint,datos)
  }

  removeNameToInvestigador(idName:number){
    let endpoint = `${this.globals.backend_base_url}/investigadores/nombreaccidente/${idName}/delete`
    return this.http.delete(endpoint)
  }

  addScopusToInvestigador(idInvest:number,idScopus:number){
    let endpoint = `${this.globals.backend_base_url}/investigadores/scopusid/create`
    let datos = new FormData();
    datos.append('id', idScopus.toString());
    datos.append('id_investigador', idInvest.toString());
    return this.http.post(endpoint,datos)
  }

  removeScopusToInvestigador(idScopus:number){
    let endpoint = `${this.globals.backend_base_url}/investigadores/scopusid/${idScopus}/delete`
    return this.http.delete(endpoint)
  }
}
