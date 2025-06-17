import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TypesProjectService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getAllTypesProject(){
    let endpoint = `${this.globals.backend_base_url}/tipos_proyecto`
    return this.http.get(endpoint)
  }

  getTypeProjectById(idTypeProject:number){
    let endpoint = `${this.globals.backend_base_url}/tipos_proyecto/${idTypeProject}`
    return this.http.get(endpoint)
  }

  getTypesProjectByFilter(cadena:string){
    let endpoint = `${this.globals.backend_base_url}/tipos_proyecto?${cadena}`
    return this.http.get(endpoint)
  }

  addTypeProject(tipo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/create`
    return this.http.post(ENDPOINT,{tipo:tipo})
  }

  updateTypeProject(idTipoProject:number,tipo:string){
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/${idTipoProject}/update`
    return this.http.post(ENDPOINT,{tipo:tipo})
  }

  deleteTypeProject(idTipoProject:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos_proyecto/${idTipoProject}/delete`
    return this.http.delete(ENDPOINT)
  }
}
