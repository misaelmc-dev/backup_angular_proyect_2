import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  getVisibilityTotals () {
    const ENDPOINT = `${this.globals.backend_base_url}/fuentes/visibilidad/totales`
    return this.http.get(ENDPOINT)
  }

  getInstitutions() {
    const ENDPOINT = `${this.globals.backend_base_url}/instituciones/simples`
    return this.http.get(ENDPOINT)
  }
}
