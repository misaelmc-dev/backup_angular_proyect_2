import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class TypesProductService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getAllTypesProduct(){
    let endpoint = `${this.globals.backend_base_url}/tipos/simples`
    return this.http.get(endpoint)
  }

  getTypeProductById(idTypoProducto:number){
    let endpoint = `${this.globals.backend_base_url}/tipos/${idTypoProducto}`
    return this.http.get(endpoint)
  }

  getTypesProductByFilter(cadena:string){
    let endpoint = `${this.globals.backend_base_url}/tipos/simples?${cadena}`
    return this.http.get(endpoint)
  }

  addTypeProduct(tipo:string,descripcion:string,openaire:string){
    const ENDPOINT = `${this.globals.backend_base_url}/tipos/create`
    return this.http.post(ENDPOINT,{id_openaire:openaire,tipo:tipo,descripcion:descripcion,count_for_internal_stats:false})
  }

  updateTypeProduct(idTipoProduct:number,tipo:string,descripcion:string,openaire:string){
    const ENDPOINT = `${this.globals.backend_base_url}/tipos/${idTipoProduct}/update`
    return this.http.post(ENDPOINT,{id_openaire:openaire,tipo:tipo,descripcion:descripcion,count_for_internal_stats:false})
  }

  deleteTypeProduct(idTipoProduct:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/tipos/${idTipoProduct}/delete`
    return this.http.delete(ENDPOINT)
  }
}
