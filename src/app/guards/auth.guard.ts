import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {never, Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {catchError, delay, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private intendedUrl: string
  public id_institucion
  public id_investigador
  public authRole
  public userLegacyData

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.intendedUrl = this.router.routerState.snapshot.url;
    //console.log('AuthGuard: ' + this.activatedRoute.snapshot)
    //console.warn('inicio sí auth')
    this.userLegacyData = localStorage.getItem('user_legacy_data')
    if (this.userLegacyData) this.userLegacyData = JSON.parse(this.userLegacyData)
    if (this.userLegacyData) {
      this.authRole = this.userLegacyData.role
      this.id_institucion = this.userLegacyData.id_institucion
      this.id_investigador = this.userLegacyData.id_investigador
    }
    //console.warn('fin constructo sí auth')
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getCurrentUserInfoFromBackend().pipe(
      map(res => {
        if (res && this.userLegacyData) {
          this.authService.setUserEnLocal(res)
          return true;
        }
        return this.router.parseUrl('/login?intendedUrl=' + encodeURIComponent(state.url));
      }),
      catchError(() => {
        return of(this.router.parseUrl('/login?intendedUrl=' + encodeURIComponent(state.url)));
      }))
  }

}
