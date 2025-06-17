import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {never, Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {catchError, delay, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {

  public id_institucion
  public id_investigador
  public authRole
  public userLegacyData

  constructor(private authService: AuthService, private router: Router) {
    //console.warn('inicio no auth')
    this.userLegacyData = localStorage.getItem('user_legacy_data')
    if (this.userLegacyData) this.userLegacyData = JSON.parse(this.userLegacyData)
    if (this.userLegacyData) {
      this.authRole = this.userLegacyData.role
      this.id_institucion = this.userLegacyData.id_institucion
      this.id_investigador = this.userLegacyData.id_investigador
    }
    //console.warn('fin constructo no auth')
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getCurrentUserInfoFromBackend().pipe(
      map(resp => {
        this.authService.setUserEnLocal(resp)
        if (resp && this.userLegacyData) {
          //console.warn('sí auth ' + this.authRole)
          switch (this.authRole) {
            case 'admin':
              return this.router.parseUrl('admin/products') // ruta de dash de admin
            case 'coord':
              return this.router.parseUrl(`/coord/${this.id_institucion}`) // ruta de dash de coord
            case 'invest':
              return this.router.parseUrl(`/invest/${this.id_investigador}`) // ruta de dash de invest
            case 'scicom':
              return this.router.parseUrl(`/scicom/event-list`) // ruta de dash de scicom
          }
          return this.router.parseUrl('/')
        } else {
          //console.warn('no auth')
          return true
        }
      }),
      catchError(() => {
        return of(true)
      }))
  }

}
