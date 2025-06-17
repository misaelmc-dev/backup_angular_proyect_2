import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TiposDeProductoService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Obtiene los tipos de producto
   */
  get(soloConProduct?: boolean, soloConCita?: boolean, idsInvestProd?: Array<any>, idsInstScintraProd?: Array<any>,
      idsInstRorProd?: Array<any>, idsInvestCita?: Array<any>, idsInstScintraCita?: Array<any>,
      idsInstRorCita?: Array<any>)
  {
    let endpoint = `${this.globals.backend_base_url}/tipos/simples?test=0`
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
    if (soloConCita)
      endpoint += `&soloConCita=`;
    return this.http.get(endpoint)
  }
}
