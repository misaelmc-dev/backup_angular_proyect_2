import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class AreasConocimientoScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Obtiene los datos de las ateas de conocimiento desde el backend
   *
   */
  getAreasDeConocimiento(idsTrab: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/fuentes/simples?idsTrabScicom=${encodeURIComponent(idsTrab.join(' '))}`
    return this.http.get(endpointUrl)
  }
}
