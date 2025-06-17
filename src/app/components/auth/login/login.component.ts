import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";
import {forEach} from "lodash";
import {PermisosScicomService} from "../../../services/scicom/permisos-scicom.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  private intendedUrl: string = '/'
  public validCredentials = true;
  public serverErrors = false;
  public loginForm: FormGroup
  public showLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.intendedUrl = params.intendedUrl || null
    })
    //this.intendedUrl = null;
  }

  ngOnInit(): void {
    let loginFormBuilder = new FormBuilder();
    this.loginForm = loginFormBuilder.group({
      email: new FormControl(''),
      password: new FormControl(''),
    }); //todo validar que el campo email sea un correo válido, y que la contraseña tenga mínimo 8 dígitos
  }

  login(formData: any) {
    let { email, password } = formData;
    this.showLoading = true
    this.authService.login(email, password).subscribe((response: any) =>
    { //success
      this.showLoading = false
      this.validCredentials = true;
      this.serverErrors = false;
      localStorage.setItem('user', JSON.stringify(response))
      this.authService.cargaPermisosScicomEnLocal();
      let route = '/';
      let legacy_role = '';
      let indexDeListaRecursosRoles: number

      //se obtienen opciones de roles/recursos del usuario
      let listaRecursosRoles: any = []
      let listaRecursosRolesParaMostrar: string[] = []
      response.resources.globales.forEach((item: any) => {
        listaRecursosRoles.push({
          role_description: item.rol,
          default_dashboard: item.default_dashboard,
          home_dashboard: item.home_dashboard
        })
        listaRecursosRolesParaMostrar.push(`${item.rol}`)
      })
      response.resources.instituciones.forEach((item: any) => {
        listaRecursosRoles.push({
          id_institucion: item.id,
          role_description: item.rol,
          default_dashboard: item.default_dashboard,
          home_dashboard: item.home_dashboard
        })
        listaRecursosRolesParaMostrar.push(`${item.rol} (Institución: ${item.id})`)
      })
      response.resources.investigadores.forEach((item: any) => {
        listaRecursosRoles.push({
          id_investigador: item.id,
          role_description: item.rol,
          default_dashboard: item.default_dashboard,
          home_dashboard: item.home_dashboard
        })
        listaRecursosRolesParaMostrar.push(`${item.rol} (Investigador: ${item.id})`)
      })
      response.resources.campus.forEach((item: any) => {
        listaRecursosRoles.push({
          id_campus: item.id,
          role_description: item.rol,
          default_dashboard: item.default_dashboard,
          home_dashboard: item.home_dashboard
        })
        listaRecursosRolesParaMostrar.push(`${item.rol} (Campus: ${item.id})`)
      })
      if (listaRecursosRoles.length == 0) { //si el usuario no tiene recursos asociados entonces no hay nada para ingresar
        this.serverErrors = true;
      } else if (listaRecursosRoles.length == 1) { //si el usuario solo tiene un recurso, se va al dashboard especificado
        let dashboard = listaRecursosRoles[0].home_dashboard || listaRecursosRoles[0].default_dashboard
        if (!dashboard) {
          this.serverErrors = true;
        } else {
          switch (dashboard) {
            case 'dash-admin':
              route = 'admin/products' //todo poner aquí la ruta de dash de admin
              legacy_role = 'admin'
              break;
            case 'dash-coord':
              route = `/coord/${listaRecursosRoles[0].id_institucion}` // todo poner aquí la ruta de dash de coord
              legacy_role = 'coord'
              break;
            case 'dash-invest':
              route = `/invest/${listaRecursosRoles[0].id_investigador}` //todo poner aquí la ruta de dash de invest
              legacy_role = 'invest'
              break;
            case 'dash-scicom':
              route =`/scicom/event-list` // ruta de dash de scicom
              legacy_role = 'scicom'
          }
        }
        this.authService.emitUserChangedEvent()
        route = (this.intendedUrl) ? this.intendedUrl : route;
        //console.log(this.route.snapshot.paramMap)
        localStorage.setItem('user_legacy_data', JSON.stringify({
          role: legacy_role,
          role_description: listaRecursosRoles[0].role_description,
          id_investigador: listaRecursosRoles[0].id_investigador,
          id_institucion: listaRecursosRoles[0].id_institucion
        }))
        this.router.navigate([route])

      } else { //si el usuario tiene múltiples recursos, se le pide seleccione el deseado
        Swal.fire({
          title: 'Seleccione el rol/recurso al que quiere entrar',
          input: 'select',
          inputOptions: listaRecursosRolesParaMostrar,
          inputPlaceholder: 'Seleccione una opción...',
        }).then((result) => {
          if (result.isConfirmed) {
            indexDeListaRecursosRoles = Number.parseInt(result.value)
            let dashboard = listaRecursosRoles[indexDeListaRecursosRoles].home_dashboard
              || listaRecursosRoles[indexDeListaRecursosRoles].default_dashboard
            if (!dashboard) {
              this.serverErrors = true;
            } else {
              switch (dashboard) {
                case 'dash-admin':
                  route = 'admin/products' //todo poner aquí la ruta de dash de admin
                  legacy_role = 'admin'
                  break;
                case 'dash-coord':
                  route = `/coord/${listaRecursosRoles[indexDeListaRecursosRoles].id_institucion}` // todo poner aquí la ruta de dash de coord
                  legacy_role = 'coord'
                  break;
                case 'dash-invest':
                  route = `/invest/${listaRecursosRoles[indexDeListaRecursosRoles].id_investigador}` //todo poner aquí la ruta de dash de invest
                  legacy_role = 'invest'
                  break;
                case 'dash-scicom':
                  route =`/scicom/event-list` // ruta de dash de scicom
                  legacy_role = 'scicom'
              }
            }
          }
          this.authService.emitUserChangedEvent()
          route = (this.intendedUrl) ? this.intendedUrl : route;
          //console.log(this.route.snapshot.paramMap)
          localStorage.setItem('user_legacy_data', JSON.stringify({
            role: legacy_role,
            role_description: listaRecursosRoles[indexDeListaRecursosRoles].role_description,
            id_investigador: listaRecursosRoles[indexDeListaRecursosRoles].id_investigador,
            id_institucion: listaRecursosRoles[indexDeListaRecursosRoles].id_institucion
          }))
          this.router.navigate([route])
        })
      }
    }, //fail
      (err: any) => {
        this.showLoading = false
        console.error(err)
        if (err.status === 422) {
          //en caso de código de error status 422 indicar al usuario que credenciales incorrectas
          this.validCredentials = false;
        } else if (err.status === 409) {
          try {
            if (err.error.errors.user[1].max_allowed_sessions < 1) {
              this.showMessageBlockedUser()
            } else {
              this.showMessageMaxSessions()
            }
          } catch (error) {
            this.showMessageMaxSessions()
          }
        } else {
          //otro caso indicar error desconocido, contacte a su administrador
          this.serverErrors = true
        }
    });


  }

  showMessageMaxSessions () {
    Swal.fire({
      title: 'Ha alcanzado el máximo permitido de sesiones iniciadas simultáneas en Scintra, por ello se ha cerrado su sesión más antigua en este u otro dispositivo. A continuación vuelva a iniciar sesión',
      confirmButtonText: 'OK',
      //denyButtonText: `Cancelar`,
    })
  }

  showMessageBlockedUser () {
    Swal.fire({
      title: 'Este usuario se encuentra bloqueado y no puede iniciar sesión en Scintra. Si se necesita ayuda, contacte a soporte de Scintra',
      confirmButtonText: 'OK',
      //denyButtonText: `Cancelar`,
    })
  }

  redirectToUvmLoginPage() {
    this.showLoading = true
    this.authService.getNewOIDCproviderAuthUrl('uvm_prod').subscribe(
      (response: any) => {
        this.showLoading = false
        this.serverErrors = false
        window.location.href = response.authUrl
      }, (err) => {
        this.showLoading = false
        console.error(err)
        this.serverErrors = true
      }
    )
  }
}

