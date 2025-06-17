import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class PagosScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  /**
   * Obtiene las participaciones scicom desde el backend
   *
   */
  getPayments(idEvento: number, idsTrabajos?: Array<number>)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/pagos?no_paginate=&idEvento=${idEvento}`
    if (idsTrabajos) endpointUrl += `&idsTrab=${encodeURIComponent(idsTrabajos.join(' '))}`
    return this.http.get(endpointUrl)
  }

  /**
   * Consulta de las formas de pago del scicom
   * @param idTipoPago Filtro por solo las formas de pago permitidas para el tipo de pago especificado
   */
  getMethodsPayments(idTipoPago: any)
  {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/formaspago?no_paginate=&idsTipsPagPerm=${idTipoPago}`
    return this.http.get(endpointUrl)
  }

  addPagoToWork(monto:number,idTipoPago:number,idFormaPago:number,idEstatusPago:number,idEvento:number,idTrebajo:number){
    const ENDPOINT = `${this.globals.backend_base_url}/scicom/pagos/create`
    return this.http.post(ENDPOINT, {monto:monto,id_tipo_pago:idTipoPago,id_forma_pago:idFormaPago,id_estatus_pago:idEstatusPago,id_evento:idEvento,id_trabajo:idTrebajo})
  }


}
