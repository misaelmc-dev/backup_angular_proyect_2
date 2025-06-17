import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class EstadisticsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getTiposEvento(institucionId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipsevento?no_paginate=&idsInstSc=${institucionId}`
    return this.http.get(ENDPOINT)
  }

  getTiposTrabajo(tipoEventoId:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/tipstrab?no_paginate=&idsTipEvPerm=${tipoEventoId}`
    return this.http.get(ENDPOINT)
  }

  getRor(){
    const ENDPOINT = `${this.globals.backend_base_url}/instituciones/simples`
    return this.http.get(ENDPOINT)
  }

  getCartelesEveCamp(tipEventoId:number,idsTipTrab: Array<number>,rorId:number,selectedCiclo?:number){
    if(selectedCiclo==0){
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?desgPorParticipacion=38&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }else{
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?desgPorParticipacion=38&idsEvento=${selectedCiclo}&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }
    //console.log("ENDPOINT",ENDPOINT)
    return this.http.get(ENDPOINT)
  }

  getAutoresEveCamp(tipEventoId:number,idsTipTrab: Array<number>,rorId:number,selectedCiclo?:number){
    if(selectedCiclo==0){
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/statistics?desgPorParticipacion=38&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }else{
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/statistics?desgPorParticipacion=388&idsEvento=${selectedCiclo}&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }
    //console.log("ENDPOINT",ENDPOINT)
    return this.http.get(ENDPOINT)
  }

  getCartelesCiclo(tipEventoId:number,idsTipTrab: Array<number>,rorId:number,selectedCiclo?:number){
    if(selectedCiclo==0){
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?desgPorEvento=38&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }else{
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?desgPorEvento=38&idsEvento=${selectedCiclo}&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }
    //console.log("ENDPOINT",ENDPOINT)
    return this.http.get(ENDPOINT)
  }

  getAutoresCiclo(tipEventoId:number,idsTipTrab: Array<number>,rorId:number,selectedCiclo?:number){
    if(selectedCiclo==0){
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/statistics?desgPorEvento=38&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }else{
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/statistics?desgPorEvento=38&idsEvento=${selectedCiclo}&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }
    //console.log("ENDPOINT",ENDPOINT)
    return this.http.get(ENDPOINT)
  }

  getParticipacionCiclo(tipEventoId:number,rorId:number,selectedCiclo?:number){
    if(selectedCiclo==0){
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones/statistics?desgPorEvento=26&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }else{
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones/statistics?desgPorEvento=26&idsEvento=${selectedCiclo}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }
    //console.log("ENDPOINT",ENDPOINT)
    return this.http.get(ENDPOINT)
  }

  getCartelesAnio(tipEventoId:number,idsTipTrab: Array<number>,rorId:number,selectedCiclo?:number){
    if(selectedCiclo==0){
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?desgPorAnioRegTrab=36&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }else{
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?desgPorAnioRegTrab=36&idsEvento=${selectedCiclo}&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }
    //console.log("ENDPOINT",ENDPOINT)
    return this.http.get(ENDPOINT)
  }

  getEventCampAnio(tipEventoId:number,idsTipTrab: Array<number>,rorId:number,selectedCiclo?:number){
    if(selectedCiclo==0){
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones/statistics?desgPorAnioRegPart=24&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }else{
      var ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones/statistics?desgPorAnioRegPart=24&idsEvento=${selectedCiclo}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${rorId}`
    }
    //console.log("ENDPOINT",ENDPOINT)
    return this.http.get(ENDPOINT)
  }

  getParticipacionesByIds(idsPart: Array<number>){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones?no_paginate=&ids=${encodeURIComponent(idsPart.join(' '))}`
    return this.http.get(ENDPOINT)
  }

  getUsuariosByIds(idsUser: Array<number>){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/usuarios?no_paginate=&ids=${encodeURIComponent(idsUser.join(' '))}&conRor=&conCampus=`
    return this.http.get(ENDPOINT)
  }

  getCampusList(idInstitucion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/campus/simples?no_paginate=&idsInst=${idInstitucion}`
    return this.http.get(ENDPOINT)
  }

  getObjetivosByIdsPart(idsPart:Array<number>){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/objsindicador?no_paginate=&soloPronosticos=&idsPart=${encodeURIComponent(idsPart.join(' '))}`
    return this.http.get(ENDPOINT)
  }

  getObjetivosByIdsEvent(idsEvent:Array<number>){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/objsindicador?no_paginate=&soloPronosticos=&idsEvento=${encodeURIComponent(idsEvent.join(' '))}`
    return this.http.get(ENDPOINT)
  }

  getCiclosByTypeAndInstitution(idsTypeEvent:number,idInstitucion:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/eventos?no_paginate=&idsTipEv=${idsTypeEvent}&idsRorEd=${idInstitucion}`
    return this.http.get(ENDPOINT)
  }

  getPartByCamp(idTypeEvent:number,idRor:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/participaciones/statistics?desgPorCampusUsuarioRegistro=18&idsTipsEv=${idTypeEvent}&idsRorOrgEv=${idRor}`
    return this.http.get(ENDPOINT)
  }

  getCartByCamp(tipEventoId:number,idsTipTrab:Array<number>,idRor:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?desgPorCampusUsuarioRegistro=17&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${idRor}`
    return this.http.get(ENDPOINT)
  }

  getAuthByCamp(tipEventoId:number,idsTipTrab:Array<number>,idRor:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/autorestrabajo/statistics?desgPorCampusUsuarioRegistro=21&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${idRor}`
    return this.http.get(ENDPOINT)
  }

  getCartByODS(tipEventoId:number,idsTipTrab:Array<number>,idRor:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?desgPorODSTrab=38&idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${idRor}`
    return this.http.get(ENDPOINT)
  }

  getCartByAreas(tipEventoId:number,idsTipTrab: Array<number>,idRor:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/trabajos/statistics?idsTipsTrab=${encodeURIComponent(idsTipTrab.join(' '))}&idsTipsEv=${tipEventoId}&idsRorOrgEv=${idRor}&desgPorAreasConocimiento=17`
    return this.http.get(ENDPOINT)
  }
}
