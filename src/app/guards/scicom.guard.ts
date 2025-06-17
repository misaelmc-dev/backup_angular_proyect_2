import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {EventNewComponent} from "../components/profiles/scicom/event-new/event-new.component";

@Injectable({
  providedIn: 'root'
})
export class ScicomGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: EventNewComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let allowedToDeactivate = confirm('¿Seguro que desea salir de la parametrización de su evento?'
      +' Todos los cambios serán descartados');
    return allowedToDeactivate;
    //return true ;
  }

}
