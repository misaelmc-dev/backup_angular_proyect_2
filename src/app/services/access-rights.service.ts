import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class AccessRightsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getAllAccess(){
    let endpoint = `${this.globals.backend_base_url}/rights`
    return this.http.get(endpoint)
  }

  getAccessByFilters(search:string){
    let endpoint = `${this.globals.backend_base_url}/rights?search=${search}`;
    return this.http.get(endpoint)
  }

  getAccessById(idAccess:number){
    let endpoint = `${this.globals.backend_base_url}/rights?ids=${idAccess}`
    return this.http.get(endpoint)
  }

  addAccess(term:string,code:string){
    const ENDPOINT = `${this.globals.backend_base_url}/rights/create`
    return this.http.post(ENDPOINT,{right_term:term,right_code:code})
  }

  updateAccess(idAccess:number,term:string,code:string){
    const ENDPOINT = `${this.globals.backend_base_url}/rights/${idAccess}/update`
    return this.http.post(ENDPOINT,{right_term:term,right_code:code})
  }

  deleteAccess(idAccess:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/rights/${idAccess}/delete`
    return this.http.delete(ENDPOINT)
  }

}

