import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {AdviserService} from "../../../services/adviser.service";
import {ResearcherService} from "../../../services/researcher.service";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {filter, tap} from "rxjs/operators";

@Component({
  selector: 'app-info-banner',
  templateUrl: './info-banner.component.html',
  styleUrls: ['./info-banner.component.css']
})
export class InfoBannerComponent  {

  id_institucion?: number
  id_investigador?: number
  authRole = 'invest' //role oficial que viene del backend
  userChangedSubscription: Subscription

  id = '1';
  data!: any;
  totalSinTipo!:any;
  totalesPorTipo!:any;
  articulos = 0;
  libros = 0;
  objetos_conferencia = 0;
  tesis_doctorales = 0;
  capitulos_libro = 0;

  constructor(private adviserService: AdviserService,
              private researcherService: ResearcherService,
              private authService: AuthService,
              public router: Router)
  {
    this.dealWithUserChangedEvents() //deal with events when user is changed (logged in, logged out)
    this.dealWithUrlChangedEvents();
  }

  ngOnInit(): void {
    this.setPropertiesByUrl()
  }

  loadFromUser() {
      this.authService.getCurrentUserInfoFromBackend().subscribe((response: any) => {
        this.authService.setUserEnLocal(response, false)
        //console.log('Datos de usuario en info-banner cargados')
        this.authRole = JSON.parse(localStorage.getItem('user_legacy_data')).role
        this.id_institucion = JSON.parse(localStorage.getItem('user_legacy_data')).id_institucion
        this.id_investigador = JSON.parse(localStorage.getItem('user_legacy_data')).id_investigador
        this.fetchData()
      }, (err) => {
        console.error('Error al cargar datos de usuario')
      })
  }

  private fetchData() {
    switch (this.authRole) {
      case 'coord':
        //console.log('Usuario es coordinador en info-banner')
        this.adviserService.getAdviserBannerData(this.id_institucion.toString()).subscribe(
          (data: any) => {
            this.data = data
            this.totalSinTipo = data.totalesPorTipo.totalSinTipo;
            this.totalesPorTipo = data.totalesPorTipo;
            for (const item of this.totalesPorTipo) {
              switch (item.id) {
                case 1:
                  this.articulos = item.count;
                  break;
                case 2:
                  this.libros = item.count;
                  break;
                case 3:
                  this.objetos_conferencia = item.count;
                  break;
                case 5:
                  this.tesis_doctorales = item.count;
                  break;
                case 11:
                  this.capitulos_libro = item.count;
                  break;
              }
            }
          },
          error => {
            console.error('Error al cargar los totales de info-banner de la institución')
          }
        )
        break
      case 'invest':
        //console.log('Usuario es investigador en info-banner')
        this.researcherService.getResearcherBannerData(this.id_investigador.toString()).subscribe(
          (data: any) => {
            this.data = data
          },
          error => {
            console.error('Error al cargar los totales de info-banner del investigador')
          }
        )
        this.researcherService.getProductTypeTotals(this.id_investigador.toString()).subscribe(
          (data: any) => {
            //console.log('Datos de totales de prod de invest en info-banner cargados')
            this.totalSinTipo = data.totalesPorTipo.totalSinTipo;
            this.totalesPorTipo = data.totalesPorTipo;
            //console.log('DATA DE TOT: ' + JSON.stringify(data))
            //console.log('DAT TOT ESPEC: ' + JSON.stringify(this.totalesPorTipo))
            for (const item of this.totalesPorTipo) {
              //console.log('se entró a FOR: ' + item.id_tipo)
              switch (item.id_tipo) {
                case 1:
                  this.articulos = item.count;
                  break;
                case 2:
                  this.libros = item.count;
                  break;
                case 3:
                  this.objetos_conferencia = item.count;
                  break;
                case 5:
                  this.tesis_doctorales = item.count;
                  break;
                case 11:
                  this.capitulos_libro = item.count;
                  break;
              }
            }
          },
          error => {
            console.error('Error al cargar los totales por tipo de prod de info-banner del investigador')
          }
        )
        break
      default:
        //console.log('Usuario es de rol desconocido en info-banner')
        this.authRole = 'Role'
    }
  }

  setPropertiesByUrl() { //viene una url
    //se verifica que la url cumpla con ser de coordinador con id
    if (/\/coord\/[0-9]+/.test(this.router.url)) {
      //coordinador
      this.authRole = 'coord'
      this.id_institucion = parseInt(this.router.url.substring(7), 10)
      this.fetchData()
    }
    //se verifica que la url cumpla con ser de investigador con id
    else if (/\/invest\/[0-9]+/.test(this.router.url)) {
      //investigador
      this.authRole = 'invest'
      this.id_investigador = parseInt(this.router.url.substring(8), 10)
      this.fetchData()
    }
    //se verifica que la url cumpla con ser de coordinador con id
    else if (/\/admin*/.test(this.router.url)) {
      //admin
      this.authRole = 'admin'
    } else {
      this.loadFromUser()
    }
    //console.log(this.authRole)
  }

  dealWithUserChangedEvents() {
    //console.log('lidiando con cambio de usuario en el sidebar')
    this.userChangedSubscription = this.authService.userChanged.subscribe( () => {
      this.loadFromUser()
    })
  }

  dealWithUrlChangedEvents() {
    //console.log('lidiando con cambio de url en el sidebar')
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd), tap(event => {
        //console.log(event instanceof NavigationEnd)
        //console.log(JSON.stringify(event))
      })
    ).subscribe( (event) => {
      //console.log('cambió la url jeje')
      this.setPropertiesByUrl()
    })
  }

  ngOnDestroy() {
    this.userChangedSubscription.unsubscribe(); //unsubscribe from userChanged event
  }

}
