import {Component, Inject, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {ResearcherService} from "../../../services/researcher.service";
import {AdviserService} from "../../../services/adviser.service";
import {EventService} from "../../../services/event.service";
import {DOCUMENT} from "@angular/common";
import {filter, tap} from "rxjs/operators";
import {Subscription} from "rxjs";
import {AdminService} from "../../../services/admin.service";
import {GlobalsVars} from "../../../global/globals-vars";
import {ActivatedRoute} from "@angular/router";
import {parse} from "@angular/compiler/src/render3/view/style_parser";
import {PermisosScicomService} from "../../../services/scicom/permisos-scicom.service";
import Swal from "sweetalert2";
import {PermisosScintraService,} from "../../../services/permisos-scintra-service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  public cordId:any = 0;
  public eventoId:any;
  public loc:any;


  public username = ''
  public authRole = ''
  public loggedInRole = ''
  public name = ''
  public roleDescription = '' //phrase or word describing authRole
  public profilePhotoUrl = '' //url of profile photo
  public email = '' //email
  public institution = '' //user's institution
  public profilePhotoPlaceholderUrl = 'assets/img/demo/avatars/avatar-m.png'
  public id_institucion = ''
  public id_investigador = ''
  public loaded = false; //if component has loaded all data needed for it to properly operate
  public userChangedSubscription: Subscription
  public eventEvaluationTypesChangedSubscription: Subscription
  public eventPayTypesChangedSubscription: Subscription
  public contractualInstitutions: any[] = []; //instituciones contratantes de scintra

  public evaluationAsing:any[]=[];
  public paymentsAsing:any[]=[];

  public typeEventInstitution:any[]=[];

  constructor(public authService: AuthService,
              public router: Router,
              public researcherService: ResearcherService,
              public advisorService: AdviserService,
              public adminService: AdminService,
              private eventService: EventService,
              public globals: GlobalsVars,
              public permisosScicom: PermisosScicomService,
              public permisosScintraService: PermisosScintraService)
  {
    this.setInitialProperties(); //set placeholders of properties
    this.dealWithUserChangedEvents() //deal with events when user is changed (logged in, logged out)
    this.dealWithUrlChangedEvents();
    //deals with showing/hiding evaluation options as these change as per current event
    this.dealWithEventEvaluationTypesChangedEvents()
    this.dealWithEventPayTypesChangedEvents()
  }

  ngOnInit(): void {
    this.setPropertiesByUrl('nada')
      this.authService.getCurrentUserInfoFromBackend().subscribe((user: any) => {
        this.authService.setUserEnLocal(user)
        this.name = user.name
        this.setPropertiesByLoggedInUser(user)
        this.setPropertiesByUrl('nada')
        this.loaded = true;
      }, (err) => {
        console.log(err)
        this.setInitialProperties()
        this.loaded = false
      })
    this.loadEventType()
  }

  dealWithUserChangedEvents() { //todo, la prioridad la tiene la url ver aquó
    //console.log('lidiando con cambio de usuario en el sidebar')
    this.userChangedSubscription = this.authService.userChanged.subscribe( () => {
        this.loadUserAndSetProperties()
    })
  }

  loadUserAndSetProperties() {
    this.authService.getCurrentUserInfoFromBackend().subscribe((user) => {
      this.authService.setUserEnLocal(user)
      this.setPropertiesByLoggedInUser(user)
      this.loaded = true;
    }, (err) => {
      console.log(err)
      this.setInitialProperties()
      this.loaded = false;
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
        this.setPropertiesByUrl(this.router.url)
        this.loaded = true
    })
  }

  ngOnDestroy() {
    this.userChangedSubscription.unsubscribe(); //unsubscribe from userChanged event
  }

  setInitialProperties() {
    this.username = 'Usuario'
    this.authRole = 'Role'
    this.name = 'Nombre'
    this.roleDescription = 'Descripción'
    this.profilePhotoUrl = this.profilePhotoPlaceholderUrl
    this.email = 'Correo';
    this.institution = 'Institución'
    this.id_institucion = ''
    this.id_investigador = ''
  }

  setPropertiesByLoggedInUser(user: any) {
    this.setInitialProperties()
    this.username = user.email
    this.name = user.name
    this.email = user.email
    this.authRole = JSON.parse(localStorage.getItem('user_legacy_data')).role
    this.loggedInRole = JSON.parse(localStorage.getItem('user_legacy_data')).role
    this.id_institucion = JSON.parse(localStorage.getItem('user_legacy_data')).id_institucion
    this.id_investigador = JSON.parse(localStorage.getItem('user_legacy_data')).id_investigador
    this.roleDescription = JSON.parse(localStorage.getItem('user_legacy_data')).role_description
    switch (this.authRole) { //sets props based on auth role
      case 'admin':
        //this.roleDescription = 'Administrador'
        this.profilePhotoUrl = (user.url_foto) ? user.url_foto : this.profilePhotoPlaceholderUrl
        this.institution = 'Habilis'
        this.adminService.getInstitutions().subscribe(
          (response: any) => {
            this.contractualInstitutions = response;
          })
        break;
      case 'invest':
        //this.roleDescription = 'Investigador'
        this.researcherService.getResearcherBannerData(this.id_investigador).subscribe(
          (response: any) => {
            this.profilePhotoUrl = user.url_foto || response.url_foto;
            this.institution = response.nombre_institucion
          }
        )
        break;
      case 'coord':
        //this.roleDescription = 'Coordinador'
        this.advisorService.getAdviserBannerData(this.id_institucion).subscribe(
          (response: any) => {
            this.profilePhotoUrl = user.url_foto || response.institution.url_foto;
            this.institution = response.institution.nombre
          }
        )
        break;
      case 'scicom':
        //this.roleDescription = 'Externo'
        this.profilePhotoUrl = (user.url_foto) ? user.url_foto : this.profilePhotoPlaceholderUrl
        break;
    }
  }

  setPropertiesByUrl(url: string) { //viene una url
    //se verifica que la url cumpla con ser de coordinador con id
    if (/\/coord\/[0-9]+/.test(this.router.url)) {
      //coordinador
      this.authRole = 'coord'
      this.id_institucion = parseInt(this.router.url.substring(7), 10).toString()
    }
    //se verifica que la url cumpla con ser de investigador con id
    else if (/\/invest\/[0-9]+/.test(this.router.url)) {
      //investigador
      this.authRole = 'invest'
      this.id_investigador = parseInt(this.router.url.substring(8), 10).toString()
      var loc = this.router.url ;
      //console.log("loc", loc);
    }
    //se verifica que la url cumpla con ser de coordinador con id
    else if (/\/admin*/.test(this.router.url)) {
      //admin
      this.authRole = 'admin'
      this.adminService.getInstitutions().subscribe(
        (response: any) => {
          this.contractualInstitutions = response;
        })
    }
    else if (/\/scicom\/event-list*/.test(this.router.url)
      || /\/scicom\/event-new*/.test(this.router.url)
      || /\/scicom\/tool-sumary-source*/.test(this.router.url)
      || /\/scicom\/tool-similar-source*/.test(this.router.url)
      || /\/scicom\/tool-source*/.test(this.router.url)
      ) {
      this.authRole = 'scicomInicio';
      this.eventoId=0;
      //this.cordId = parseInt(this.router.url.substring(8), 11).toString();
    }else if(/\/scicom\/api*/.test(this.router.url)) {
      this.authRole = 'scicomEvent'
      this.eventoId = this.router.url.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;})[0]
      this.loadEvaluationsType();
      this.loadPaymentsType();
      //console.warn(this.eventoId)
    }else if(/\/scicom\/foro*/.test(this.router.url)) {
      this.authRole = 'scicomEventForum'
      this.eventoId = this.router.url.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;})[0]
    }else if(/\/scicom\/encuentro*/.test(this.router.url)) {
      this.authRole = 'scicomEventEncounter'
      this.eventoId = this.router.url.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;})[0]
    }else{
      this.loadUserAndSetProperties()
    }
    //console.log(this.authRole)
  }

  matchRegExp(regExp: string, str: string) {
    return new RegExp(regExp).test(str);
  }

  loadEvaluationsType(){
    this.eventService.getEvaluationAsign(this.eventoId).subscribe((res: any) => {
      this.evaluationAsing = res ;
    }, (err:any) =>{
      /*Swal.fire({icon: 'error',text: 'Error al cargar los tipos de evaluación permitidos en el evento '
          +'especificado. Sidebar'});*/
      console.error(err)
    });
  }

  loadPaymentsType(){
    this.eventService.getPaymentsAsign(this.eventoId).subscribe((res: any) => {
      this.paymentsAsing = res ;
    }, (err:any) =>{
      console.error(err)
    });
  }

  dealWithEventEvaluationTypesChangedEvents() {
    this.eventEvaluationTypesChangedSubscription = this.eventService.eventEvaluationTypesChanged.subscribe( () => {
      if (this.authRole == 'scicomEvent') {
        console.info('Sidebar actualizado con cambio de tipos de evaluación')
        this.loadEvaluationsType()
      }
    })
  }

  dealWithEventPayTypesChangedEvents() {
    this.eventPayTypesChangedSubscription = this.eventService.eventPayTypesChanged.subscribe( () => {
      if (this.authRole == 'scicomEvent') {
        console.info('Sidebar actualizado con cambio de tipos de pagos')
        this.loadPaymentsType()
      }
    })
  }

  loadEventType(){
    if(this.router.url.includes('coord')){
      this.eventService.getTypeEventByInstitucion(Number.parseInt(this.id_institucion)).subscribe((resTipEve: any) => {
        this.typeEventInstitution=resTipEve;
      }, (err:any) =>{
        Swal.fire({icon: 'error',text: 'Error al cargar los tipos de evento para la institucion especificada'});
        console.error(err)
      });
    }
  }

  /**
   * Checa si debe activarse la opción de menú "Inicio" del menú de coordinador
   */
  activeCoordInicio() {
    return (this.permisosScintraService.canVerGraph3Rankings()
        || this.permisosScintraService.canVerGraph3RankingsInst(this.id_institucion))
      && (this.permisosScintraService.canVerGraph4Rankings()
        || this.permisosScintraService.canVerGraph4RankingsInst(this.id_institucion))
      && (this.permisosScintraService.canVerInvestDeAllInst()
        || this.permisosScintraService.canVerInvestDeOwnInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Producción científica" del menú de coordinador
   */
  activeCoordProduccionCientifica() {
    return (this.permisosScintraService.canVerGraph3Rankings()
        || this.permisosScintraService.canVerGraph3RankingsInst(this.id_institucion))
      && (this.permisosScintraService.canVerHeaderDataAllInst()
        || this.permisosScintraService.canVerHeaderDataOwnInst(this.id_institucion))
      && (this.permisosScintraService.canInstScicom(this.id_institucion) || this.permisosScintraService.canVerColegios()
        || this.permisosScintraService.canVerColegiosSameInstScintra(this.id_institucion))
      && (this.permisosScintraService.canVerLineasInvestAllInst()
        || this.permisosScintraService.canVerLineasInvestOwnInst(this.id_institucion))
      && (this.permisosScintraService.canVerGraph1Invest()
        || this.permisosScintraService.canVerGraph1InvestInst(this.id_institucion))
      && (this.permisosScintraService.canVerGraph2Invest()
        || this.permisosScintraService.canVerGraph2InvestInst(this.id_institucion))
      && (this.permisosScintraService.canVerGraph3Invest()
        || this.permisosScintraService.canVerGraph3InvestInst(this.id_institucion))
      && (this.permisosScintraService.canVerGraph4Invest()
        || this.permisosScintraService.canVerGraph4InvestInst(this.id_institucion))
      && (this.permisosScintraService.canVerVisibilidadInstPorAnio()
        || this.permisosScintraService.canVerVisibilidadInstPorAnioInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Impacto" del menú de coordinador
   */
  activeCoordImpacto() {
    return (this.permisosScintraService.canVerGraph4Rankings()
        || this.permisosScintraService.canVerGraph4RankingsInst(this.id_institucion))
    && (this.permisosScintraService.canVerHeaderDataAllInst()
        || this.permisosScintraService.canVerHeaderDataOwnInst(this.id_institucion))
    && (this.permisosScintraService.canInstScicom(this.id_institucion)
        || this.permisosScintraService.canVerColegios()
        || this.permisosScintraService.canVerColegiosSameInstScintra(this.id_institucion))
    && (this.permisosScintraService.canVerLineasInvestAllInst()
        || this.permisosScintraService.canVerLineasInvestOwnInst(this.id_institucion))
    && (this.permisosScintraService.canVerGraph1Invest()
        || this.permisosScintraService.canVerGraph1InvestInst(this.id_institucion))
    && (this.permisosScintraService.canVerGraph1Impacto()
        || this.permisosScintraService.canVerGraph1ImpactoInst(this.id_institucion))
    && (this.permisosScintraService.canVerGraph2Impacto()
        || this.permisosScintraService.canVerGraph2ImpactoInst(this.id_institucion))
    && (this.permisosScintraService.canVerGraph3Impacto()
        || this.permisosScintraService.canVerGraph3ImpactoInst(this.id_institucion))
    && (this.permisosScintraService.canVerAniosProdAllInst()
        || this.permisosScintraService.canVerAniosProdOwnInst(this.id_institucion))
    && (this.permisosScintraService.canVerCampusAllInst()
        || this.permisosScintraService.canVerCampusOwnInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Proyectos" del menú de coordinador
   */
  activeCoordProyectos() {
    return (this.permisosScintraService.canVerHeaderDataAllInst()
        || this.permisosScintraService.canVerHeaderDataOwnInst(this.id_institucion))
      && (this.permisosScintraService.canVerLineasInvestAllInst()
        || this.permisosScintraService.canVerLineasInvestOwnInst(this.id_institucion))
      && (this.permisosScintraService.canVerAlum()
        || this.permisosScintraService.canVerAlumSameInstScintra(this.id_institucion))
      && (this.permisosScintraService.canVerCentroInvest()
        || this.permisosScintraService.canVerCentroInvestSameInstScintra(this.id_institucion))
      && (this.permisosScintraService.canVerInvestSimple()
        || this.permisosScintraService.canVerInvestSimpleSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerConvocsProyInvest()
        || this.permisosScintraService.canVerConvocsProyInvestSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerProyectosInvest()
        || this.permisosScintraService.canVerProyectosInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Colaboracion/Mapa nacional" del menú de coordinador
   */
  activeCoordMapaNacional() {
    return (this.permisosScintraService.canVerStatsProdColaboracion()
      || this.permisosScintraService.canVerStatsProdColaboracionInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Colaboracion/Mapa internacional" del menú de coordinador
   */
  activeCoordMapaInternacional() {
    return (this.permisosScintraService.canVerStatsProdColaboracion()
      || this.permisosScintraService.canVerStatsProdColaboracionInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Colaboracion/Centro de colaboración" del menú de coordinador
   */
  activeCoordCentroDeColaboracion() {
    return (this.permisosScintraService.canVerStatsProdColaboracion()
      || this.permisosScintraService.canVerStatsProdColaboracionInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Mi zona/Mi producción" del menú de coordinador
   */
  activeCoordMiProduccion() {
    return (this.permisosScintraService.canVerHeaderDataAllInst()
        || this.permisosScintraService.canVerHeaderDataOwnInst(this.id_institucion))
      && (this.permisosScintraService.canInstScicom(this.id_institucion)
        || this.permisosScintraService.canVerColegios()
        || this.permisosScintraService.canVerColegiosSameInstScintra(this.id_institucion))
      && (this.permisosScintraService.canVerInvestSimple()
        || this.permisosScintraService.canVerInvestSimpleSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerMyZone()
        || this.permisosScintraService.canVerMyZoneSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Mi zona/Mi impacto" del menú de coordinador
   */
  activeCoordMiImpacto() {
    return (this.permisosScintraService.canVerHeaderDataAllInst()
        || this.permisosScintraService.canVerHeaderDataOwnInst(this.id_institucion))
      && (this.permisosScintraService.canInstScicom(this.id_institucion)
        || this.permisosScintraService.canVerColegios()
        || this.permisosScintraService.canVerColegiosSameInstScintra(this.id_institucion))
      && (this.permisosScintraService.canVerInvestSimple()
        || this.permisosScintraService.canVerInvestSimpleSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerMyZoneCitas()
        || this.permisosScintraService.canVerMyZoneCitasSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Selección de revistas" del menú de coordinador
   */
  activeCoordSeleccionDeRevistas() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Revistas similares" del menú de coordinador
   */
  activeCoordRevistasSimilares() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Revista por resumen" del menú de coordinador
   */
  activeCoordRevistaPorResumen() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Selección de revistas" del menú de investigador
   */
  activeInvestSeleccionDeRevistas() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Revistas similares" del menú de investigador
   */
  activeInvestRevistasSimilares() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Revista por resumen" del menú de investigador
   */
  activeInvestRevistaPorResumen() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Selección de revistas" del menú de administrador
   */
  activeAdminSeleccionDeRevistas() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Revistas similares" del menú de administrador
   */
  activeAdminRevistasSimilares() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Revista por resumen" del menú de administrador
   */
  activeAdminRevistaPorResumen() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Selección de revistas" del menú de scicom
   */
  activeScicomSeleccionDeRevistas() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Revistas similares" del menú de scicom
   */
  activeScicomRevistasSimilares() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Centro de autor/Revista por resumen" del menú de scicom
   */
  activeScicomRevistaPorResumen() {
    return true
  }

  /**
   * Checa si debe activarse la opción de menú "Inicio" del menú de investigador
   */
  activeInvestInicio() {
    return (this.permisosScintraService.canVerHeaderDataInvest()
        || this.permisosScintraService.canVerHeaderDataInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerHeaderDataInvestSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerTotProdCitPorTipoPorAnioInvest()
        || this.permisosScintraService.canVerTotProdCitPorTipoPorAnioInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerTotProdCitPorTipoPorAnioInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Investigación/ Producción científica" del menú de investigador
   */
  activeInvestProduccionCientifica() {
    return (this.permisosScintraService.canVerHeaderDataInvest()
        || this.permisosScintraService.canVerHeaderDataInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerHeaderDataInvestSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerProdsInvest()
        || this.permisosScintraService.canVerProdsInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerProdsInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Impacto/ Reporte de citas" del menú de investigador
   */
  activeInvestReporteDeCitas() {
    return (this.permisosScintraService.canVerHeaderDataInvest()
        || this.permisosScintraService.canVerHeaderDataInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerHeaderDataInvestSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerProdsInvest()
        || this.permisosScintraService.canVerProdsInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerProdsInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Impacto/Análisis de cita" del menú de investigador
   */
  activeInvestAnalisisDeCita() {
    return (this.permisosScintraService.canVerHeaderDataInvest()
        || this.permisosScintraService.canVerHeaderDataInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerHeaderDataInvestSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerTotProdCitPorTipoPorAnioInvest()
        || this.permisosScintraService.canVerTotProdCitPorTipoPorAnioInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerTotProdCitPorTipoPorAnioInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Coautoria" del menú de investigador
   */
  activeInvestCoautoria() {
    return (this.permisosScintraService.canVerStatsProdColaboracion()
        || this.permisosScintraService.canVerStatsProdColaboracionInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerStatsProdColaboracionInvestSameInst(this.id_institucion))
      && (this.permisosScintraService.canVerTotProdPorTipoInvest()
        || this.permisosScintraService.canVerTotProdPorTipoInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerTotProdPorTipoInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Colaboración/Mapa nacional" del menú de investigador
   */
  activeInvestMapaNacional() {
    return (this.permisosScintraService.canVerStatsProdColaboracion()
        || this.permisosScintraService.canVerStatsProdColaboracionInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerStatsProdColaboracionInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Colaboración/Mapa internacional" del menú de investigador
   */
  activeInvestMapaInternacional() {
    return (this.permisosScintraService.canVerStatsProdColaboracion()
      || this.permisosScintraService.canVerStatsProdColaboracionInvestProp(this.id_investigador)
      || this.permisosScintraService.canVerStatsProdColaboracionInvestSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Mi zona/Mi producción" del menú de investigador
   */
  activeInvestMiProduccion() {
    return (this.permisosScintraService.canVerMyZone()
        || this.permisosScintraService.canVerMyZoneInvestProp(this.id_investigador)
        || this.permisosScintraService.canVerMyZoneSameInst(this.id_institucion))
  }

  /**
   * Checa si debe activarse la opción de menú "Mi zona/Mi impacto" del menú de investigador
   */
  activeInvestMiImpacto() {
    return (this.permisosScintraService.canVerMyZoneCitas()
      || this.permisosScintraService.canVerMyZoneCitasInvestProp(this.id_investigador)
      || this.permisosScintraService.canVerMyZoneCitasSameInst(this.id_institucion))
  }
}
