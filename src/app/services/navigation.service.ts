import { Injectable } from '@angular/core';
import {Location} from "@angular/common";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private readonly history: string[] = [] //historial de urls navegadas dentro de la app

  constructor(private router: Router, private location: Location) {
    //se toma el historial de navegación propio de la aplicación desde el localStorage si existe
    const navHistory = localStorage.getItem('navHistory')
    if (navHistory)
      this.history = JSON.parse(navHistory);
    //en cada navegación que se dirija a una url de la app guardar dicha url
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //this.history.push(event.urlAfterRedirects)
        this.historyPush(event.urlAfterRedirects)
      }
      /*if(event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          //this.history.pop();
          this.historyPop()
        }
      }*/
    })
  }

  back(): void {
    const url = this.historyPop()
    if (url && url == this.router.url)
      this.back();
    else {
      if (url)
        this.router.navigateByUrl(url)
    }
  }

  historyEmpty(): boolean {
    //console.log(this.history)
    return this.history.length == 0;
  }

  historyPush(elem: string) {
    if (!this.historyEmpty() && this.history[this.history.length - 1] == elem)
      this.history.pop()
    this.history.push(elem)
    localStorage.setItem('navHistory', JSON.stringify(this.history))
  }

  historyPop() {
    const elem = this.history.pop()
    localStorage.setItem('navHistory', JSON.stringify(this.history))
    return elem
  }

  backNavAllowed(): boolean {
    if (this.historyEmpty())
      return false;
    if (this.history.length === 1 && this.history[this.history.length - 1] == this.router.url)
      return false
    return true
  }
}
