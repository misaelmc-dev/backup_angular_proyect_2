import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {PermisosScicomService} from "../../services/scicom/permisos-scicom.service";

@Injectable({
  providedIn: 'root'
})
export class VerTiposParticipacionEventoGuard implements CanActivate {
  eventoId: number
  constructor(private permisosScicomService: PermisosScicomService,
              public router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.eventoId = Number(route.paramMap.get('idevent'));
    const autorizar = this.permisosScicomService.canVerTiposParticipacionEvento(this.eventoId)
    //console.warn('EVento: ' + this.eventoId)
    //console.warn('SE puede: ' + autorizar)
    if (autorizar == true)
      return autorizar
    else
      return this.router.parseUrl('/scicom/event-list')
  }

}
