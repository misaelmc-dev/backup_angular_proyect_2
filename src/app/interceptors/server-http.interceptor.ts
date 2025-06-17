import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable()
export class ServerHttpInterceptor implements HttpInterceptor {

  token = '9|akSQCfr9599CMtfVZramjG4LAZchfVnjzSlOuzLs';


  constructor(public authService: AuthService, public cookieService: CookieService, private router: Router) {}

  async handle(req: HttpRequest<any>, next: HttpHandler) {

    let request = req;

    if (this.token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${ this.token }`
        }
      });
      if (!this.authService.arePermisosScicomSet() && !req.url.includes('/scicom/permisosporeventousuarioactual')) {
        if (!this.cookieService.get('tokenInterceptorPermisosScicomRunning')) {
          this.cookieService.set('tokenInterceptorPermisosScicomRunning', 'true', new Date(Date.now() + (1000 * 10)))
          await this.authService.cargaPermisosScicomEnLocalAsync()
        }
      }

      localStorage.setItem('user_legacy_data', JSON.stringify({
        role: 'admin',
        role_description: 'Interceptor admin',
        id_investigador: null,
        id_institucion: null
      }))
    }

    return next.handle(request).toPromise()
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handle(req, next))
  }
}
