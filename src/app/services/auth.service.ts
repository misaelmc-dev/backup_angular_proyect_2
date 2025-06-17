import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";
import {CookieService} from "ngx-cookie-service";
import {of, throwError} from "rxjs";
import {shareReplay, windowTime} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() userChanged = new EventEmitter();

  constructor(private http: HttpClient, private globals: GlobalsVars , public cookieService: CookieService) {}

  getCsrfCookie() {
    const ENDPOINT = `${this.globals.base_path}/sanctum/csrf-cookie`
    return this.http.get(ENDPOINT,{ withCredentials: true });
  }

  login(email: string, password: string) {
    // agregar esto
    const ENDPOINT = `${this.globals.backend_base_url}/login`;
    return this.http.post(ENDPOINT, {email, password});
  }

  logout() {
    const ENDPOINT = `${this.globals.backend_base_url}/logout`;
    localStorage.removeItem('user')
    localStorage.removeItem('user_legacy_data')
    this.unsetPermisosScicomEnLocal();
    return this.http.post(ENDPOINT, {});
  }

  getCurrentUserScicomPermissionsFromBackend(idsEvento?: Array<number>) {
    let endpointUrl = `${this.globals.backend_base_url}/scicom/permisosporeventousuarioactual`
    if (idsEvento)
      endpointUrl += `?idsEvento=${encodeURIComponent(idsEvento.join(' '))}`
    return this.http.get(endpointUrl);
  }

  setPermisosScicomEnLocal(permisos: string) {
    localStorage.setItem('permisosScicom', permisos)
  }

  unsetPermisosScicomEnLocal() {
    localStorage.removeItem('permisosScicom');
  }

  arePermisosScicomSet() {
    const value = Boolean(localStorage.getItem('permisosScicom')).valueOf()
    return value
  }

  getPermisosScicomEnLocal() {
    return JSON.parse(localStorage.getItem('permisosScicom'))
  }

  cargaPermisosScicomEnLocal() {
    this.getCurrentUserScicomPermissionsFromBackend().subscribe((permisos: any) => {
      this.setPermisosScicomEnLocal(JSON.stringify(permisos))
    }, (err) => {
      console.error(err)
      console.error('Error al obtener permisos scicom desde el backend')
    })
  }

  async cargaPermisosScicomEnLocalAsync() {
    this.getCurrentUserScicomPermissionsFromBackend().subscribe((permisos: any) => {
      this.setPermisosScicomEnLocal(JSON.stringify(permisos))
      return true;
    }, (err) => {
      console.error(err)
      console.error('Error al obtener permisos scicom desde el backend async ')
      return false
    })
  }

  getCurrentUserInfoFromBackend() {
    const ENDPOINT = `${this.globals.backend_base_url}/user_info`
    return this.http.get(ENDPOINT)
  }

  setUserEnLocal(user: any, shouldLoadPermisosScicom: boolean = false) {
    localStorage.setItem('user', JSON.stringify(user))
    if (shouldLoadPermisosScicom)
      this.cargaPermisosScicomEnLocal()
  }

  getUserEnLocal() {
    return JSON.parse(localStorage.getItem('user'))
  }

  emitUserChangedEvent () {
    this.userChanged.emit();
  }

  sendPasswdResetEmail(email: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/forgot-password`
    return this.http.post(ENDPOINT,{email})
  }

  resetPassword(email: string, token: string, password: string, passwordConfirm: string) {
    const ENDPOINT = `${this.globals.backend_base_url}/reset-password`
    return this.http.post(ENDPOINT,{email, token, password, password_confirmation: passwordConfirm})
  }

  /**
   * Envía el id_token de respuesta de la autenticación al backend para que este decida si se autoriza la sesión
   */
  sendOIDCidTokenForLogin(idToken: string, state: string, provider: string, sessionState?: string) {
    return this.http.post(`${this.globals.backend_base_url}/oidc/${provider}/login`,
      {idToken, state, sessionState})
  }

  getNewOIDCproviderAuthUrl(provider: string) {
    return this.http.post(`${this.globals.backend_base_url}/oidc/${provider}/auth_url`, null);
  }
}
