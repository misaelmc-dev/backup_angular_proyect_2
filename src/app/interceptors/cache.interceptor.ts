import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpHeaders
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap} from "rxjs/operators";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  validTime = 15 // tiempo que será válida la caché en segundos

  expections = [
    'sanctum/csrf-cookie',
    '/user',
  ] //urls que contengan algo de lo que viene en este arreglo se exceptúan

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.method !== "GET" || this.isExceptionalUrl(req.url, this.expections)) {
      return next.handle(req)
    }

    let cachedResponse: HttpResponse<any> = null
    //console.log('aún sín caché')
    let cache = JSON.parse(sessionStorage.getItem(req.url))
    if (cache) {
      //console.log('hay algo guardado, comprobando si es válido')
      const cacheDate = new Date(cache.expTime)
      if (cacheDate.getTime() - (new Date).getTime() > 0) { //si hay caché y no ha expirado aún
        //console.log('es válida fecha cache: ' + cacheDate.getSeconds() + ' fechaactual: ' + (new Date).getSeconds())
        cachedResponse = cache.res
      } else {
        //console.log('es INválida, removiendo elemento')
        sessionStorage.removeItem(req.url)
      }
    }

    if(cachedResponse) {
      const httpResponse = new HttpResponse(
        {
              body: cachedResponse.body,
              url: cachedResponse.url,
              headers: cachedResponse.headers,
              status: cachedResponse.status,
              statusText: cachedResponse.statusText
        })
      //console.log('caché para: ' + req.url + ' => ' + httpResponse)
      return of(httpResponse)
    } else {
      return next.handle(req).pipe(
        tap((event: any) => {
          if(event instanceof HttpResponse && event.ok) {
            const date = (new Date())
            date.setSeconds(date.getSeconds() + this.validTime) //this.validTime segundos de expiración de la caché para los get
            sessionStorage.setItem(
              req.url,
              JSON.stringify({
                req: req,
                res: event.clone(),
                expTime: date
              }))
          }
          return event
        })
      )
    }
    //return next.handle(req);
  }

  isExceptionalUrl(url: string, arr: Array<string>) {
    for (let i = 0; i < arr.length; i++) {
      if (url.includes(arr[i])) {
        return true;
      }
    }
    return false;
  }
}
