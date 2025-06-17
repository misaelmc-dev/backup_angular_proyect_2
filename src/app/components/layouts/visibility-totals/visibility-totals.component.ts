import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {AdviserService} from "../../../services/adviser.service";
import {ResearcherService} from "../../../services/researcher.service";
import {AdminService} from "../../../services/admin.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-visibility-totals',
  templateUrl: './visibility-totals.component.html',
  styleUrls: ['./visibility-totals.component.css']
})
export class VisibilityTotalsComponent implements OnInit, OnDestroy {

  public authRole = ''
  public id_institucion = ''
  public id_investigador = ''
  public scopus: number | string = '...'
  public jcr: number | string  = '...'
  public scielo: number | string = '...'
  public conacyt: number | string = '...'
  public doaj: number | string = '...'
  public otros: number | string = '...'
  public userChangedSubscription: Subscription

  public scicom:any = "";

  constructor(public authService: AuthService,
              public adviserService: AdviserService,
              public researcherService: ResearcherService,
              public adminService: AdminService,
              public router: Router) {
    this.dealWithUserChangedEvents()
    this.dealWithUrlChangedEvents()
  }

  ngOnInit(): void {
    //this.load()
    this.setPropertiesByUrl('nada')
  }

  ngOnDestroy(): void {
    this.userChangedSubscription.unsubscribe();
  }

  load() {
    this.authService.getCurrentUserInfoFromBackend().subscribe(
      (response: any) => {
        this.authService.setUserEnLocal(response, false)
        this.authRole = JSON.parse(localStorage.getItem('user_legacy_data')).role
        this.id_institucion = JSON.parse(localStorage.getItem('user_legacy_data')).id_institucion
        this.id_investigador = JSON.parse(localStorage.getItem('user_legacy_data')).id_investigador
        if (this.authRole != '') {
          switch(this.authRole) {
            case 'coord':
              this.adviserService.getAdviserBannerData(this.id_institucion).subscribe(
                (response: any) => {
                  this.setProps(response.totalesPorVisibilidad)
                },
                error => {
                  this.setInitialProps()
                }
              )
              break
            case 'invest':
              this.researcherService.getVisibilityTotals(this.id_investigador).subscribe(
                (response: any) => {
                  this.setProps(response)
                },
                error => {
                  this.setInitialProps()
                }
              )
              break
            case 'admin':
              this.adminService.getVisibilityTotals().subscribe(
                (response: any) => {
                  this.setProps(response)
                },
                error => {
                  this.setInitialProps()
                }
              )
              break
            default:
              this.setInitialProps()
          }
        } else
          this.setInitialProps()
      },
      error => {
        this.setInitialProps()
      }
    );
  }

  setInitialProps () {
    this.scopus = '...'
    this.jcr = '...'
    this.scielo = '...'
    this.conacyt = '...'
    this.doaj = '...'
    this.otros = '...'
  }

  setProps (data: any) {
    this.scopus = data.scopus
    this.jcr = data.jcr
    this.scielo = data.scielo
    this.conacyt = data.conacyt
    this.doaj = data.doaj
    this.otros = data.otros
  }

  dealWithUserChangedEvents() {
    this.userChangedSubscription = this.authService.userChanged.subscribe( () => {
      this.load()
    })
  }

  dealWithUrlChangedEvents () {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe( (event) => {
      this.setPropertiesByUrl(this.router.url)
    })
  }

  setPropertiesByUrl(url: string) {
    //se verifica que la url cumpla con ser de coordinador con id
    if (/\/coord\/[0-9]+/.test(this.router.url)) {
      //coordinador
      let id_institucion = parseInt(this.router.url.substring(7), 10).toString()
      this.adviserService.getAdviserBannerData(id_institucion).subscribe(
        (response: any) => {
          this.setProps(response.totalesPorVisibilidad)
        },
        error => {
          this.setInitialProps()
        }
      )
    }
    //se verifica que la url cumpla con ser de investigador con id
    else if (/\/invest\/[0-9]+/.test(this.router.url)) {
      //investigador
      let id_investigador = parseInt(this.router.url.substring(8), 10).toString()
      this.researcherService.getVisibilityTotals(id_investigador).subscribe(
        (response: any) => {
          this.setProps(response)
        },
        error => {
          this.setInitialProps()
        }
      )
    }
    //se verifica que la url cumpla con ser de coordinador con id
    else if (/\/admin*/.test(this.router.url)) {
      //admin
      this.adminService.getVisibilityTotals().subscribe(
        (response: any) => {
          this.setProps(response)
        },
        error => {
          this.setInitialProps()
        }
      )
    }
    //se verifica que la url cumpla con ser de control de eventos con id
    else if (/\/scicom*/.test(this.router.url)) {
      this.scicom = "scicom" ;
    }else {
      this.scicom = "" ;
      this.load();
    }
  }
}
