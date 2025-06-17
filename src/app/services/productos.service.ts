import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Obtiene los años para los que exista al menos un producto en el sistema (solo productos activos para mostrar
   */
  getAniosProductivos(idsInstScintra?: Array<any>, idsInstRor?: Array<any>, idsInvestigadores?: Array<any>)
  {
    let endpoint = `${this.globals.backend_base_url}/productos/anios?test=0`
    if (idsInstScintra)
      endpoint += `&idsInstScintra=${encodeURIComponent(idsInstScintra.join(' '))}`;
    if (idsInstRor)
      endpoint += `&idsInstRor=${encodeURIComponent(idsInstRor.join(' '))}`;
    if (idsInvestigadores)
      endpoint += `&idsInvestigadores=${encodeURIComponent(idsInvestigadores.join(' '))}`;
    return this.http.get(endpoint)
  }

  /**
   * Obtiene las visibilidades (scopus, jcr, scielo, conacyt, etc) para las cuales exista producto
   */
  getVisibilidadesConProductos(idsInvestigadores?: Array<any>, idsInstScintra?: Array<any>, idsInstRor?: Array<any>)
  {
    let endpoint = `${this.globals.backend_base_url}/productos/visibilidades?test=0`
    if (idsInstScintra)
      endpoint += `&idsInstScintra=${encodeURIComponent(idsInstScintra.join(' '))}`;
    if (idsInstRor)
      endpoint += `&idsInstRor=${encodeURIComponent(idsInstRor.join(' '))}`;
    if (idsInvestigadores)
      endpoint += `&idsInvestigadores=${encodeURIComponent(idsInvestigadores.join(' '))}`;
    return this.http.get(endpoint)
  }
}
