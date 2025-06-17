import {Injectable} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  //todo VERSIÓN PARA AUTH SYSTEM LEGACY, en desuso desde 231115 JAEG
  constructor(private authService: AuthService, public router: Router, private activatedRoute: ActivatedRoute) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getCurrentUserInfoFromBackend().pipe(
      map(user => {
        this.authService.setUserEnLocal(user)
        //console.log('prueba de admin guard: ' + JSON.parse(JSON.stringify(user)).role)
        const autorizar = JSON.parse(JSON.stringify(user)).role === 'admin'
        return (autorizar) ? autorizar : this.router.parseUrl('/unauthorized')
      }),
      catchError(() => {
        return of(this.router.parseUrl('/login?intendedUrl=' + encodeURIComponent(state.url)));
      }))
  }

}
