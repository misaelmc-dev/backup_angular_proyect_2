import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {ResearcherService} from "../../../services/researcher.service";
import {AdviserService} from "../../../services/adviser.service";
import {Subscription} from "rxjs";
import {NavigationService} from "../../../services/navigation.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public username = ''
  public authRole = ''
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

  constructor(public authService: AuthService,
              public router: Router,
              public researcherService: ResearcherService,
              public advisorService: AdviserService,
              public navigationService: NavigationService)
  {
    this.setInitialProperties(); //set placeholders of properties
  }

  ngOnInit(): void {
    this.dealWithUserChangedEvents() //deal with events when user is changed (logged in, logged out)
    this.loadUserAndSetProperties();
  }

  loadUserAndSetProperties() {
    this.authService.getCurrentUserInfoFromBackend().subscribe((user) => {
      this.authService.setUserEnLocal(user, false)
      this.setProperties(user)
      this.loaded = true;
    }, (err) => {
      console.log(err)
      this.setInitialProperties()
      this.loaded = false
    })
  }

  dealWithUserChangedEvents() {
    this.userChangedSubscription = this.authService.userChanged.subscribe( () => {
        this.loadUserAndSetProperties()
    })
  }

  ngOnDestroy() {
    this.userChangedSubscription.unsubscribe(); //unsubscribe from userChanged event
  }

  logout(): void {
    this.authService.logout().subscribe((resp) => {
      localStorage.removeItem('user')
      localStorage.removeItem('user_legacy_data')
      this.authService.emitUserChangedEvent()
      this.router.navigate(['/login']);
      //console.log('Deslogueo exitoso')
    }, (error) => {
      console.error(error);
      console.log('Error fallido de deslogueo')
    })
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

  setProperties(user: any) {
    this.setInitialProperties()
    this.username = user.email
    this.name = user.name
    this.email = user.email
    this.authRole = JSON.parse(localStorage.getItem('user_legacy_data')).role
    this.id_institucion = JSON.parse(localStorage.getItem('user_legacy_data')).id_institucion
    this.id_investigador = JSON.parse(localStorage.getItem('user_legacy_data')).id_investigador
    this.roleDescription = JSON.parse(localStorage.getItem('user_legacy_data')).role_description

    switch (this.authRole) { //sets props based on auth role
      case 'admin':
        //this.roleDescription = 'Administrador'
        this.profilePhotoUrl = (user.url_foto) ? user.url_foto : this.profilePhotoPlaceholderUrl
        this.institution = 'Habilis'
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

  back(): void {
    this.navigationService.back()
  }
}
