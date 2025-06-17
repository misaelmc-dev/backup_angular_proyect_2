import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-uvm-login-callback',
  templateUrl: './uvm-login-callback.component.html',
  styleUrls: ['./uvm-login-callback.component.css']
})
export class UvmLoginCallbackComponent implements OnInit {

  private idToken: string //idToken de OpenID Connect de UVM
  private state: string //state parameter (arbitrary data)
  private params: Params
  private sessionState: string //session state

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    /*//todo PRUEBA ELIMINAR
    let currentUrl = window.location.href.slice()
    let newUrl = currentUrl.replace('plataforma.scintra.com', 'dev2.scintra.com');
    window.location.replace(newUrl)
    //todo FIN PRUEBA ELIMINAR*/
    this.route.fragment.subscribe(fragment => {
      let auxArr = fragment.split('&')
      let params: any = []
      for (let i = 0; i < auxArr.length; i++) {
        let arr: any = auxArr[i].split('=')
        params[arr[0]] = arr[1]
      }
      this.idToken = params['id_token'] || null
      this.state = params['state'] || null
      this.sessionState = params['session_state'] || null
      let aux = params['prueba'] || null//todo línea de prueba exclusivamente
      this.params = params
      //console.log('UvmloginCallback => ' + JSON.stringify(params))
    })
  }

  ngOnInit(): void {
    if (this.idToken && this.state) {
      this.authService.sendOIDCidTokenForLogin(this.idToken, this.state, 'uvm_prod', this.sessionState).subscribe(
        (response: any)  => {
          //console.log(response)
          localStorage.setItem('user', JSON.stringify(response))
          this.authService.cargaPermisosScicomEnLocal()
          this.authService.emitUserChangedEvent()
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
            Swal.fire({
              title: 'Su usuario no está debidamente configurado, contacte a soporte de Scintra ' +
                'adjuntando captura de esta pantalla (error: noResourceAssignedToUser).' + ' Se redirigirá a la página de acceso',
              confirmButtonText: 'Ok',
              denyButtonText: `Cancelar`,
            }).then((result: any) => {
              this.router.navigate(['login'])
            })
          } else if (listaRecursosRoles.length == 1) { //si el usuario solo tiene un recurso, se va al dashboard especificado
            let dashboard = listaRecursosRoles[0].home_dashboard || listaRecursosRoles[0].default_dashboard
            if (!dashboard) {
              Swal.fire({
                title: 'Su usuario no está debidamente configurado, contacte a soporte de Scintra ' +
                  'adjuntando captura de esta pantalla (error: noDashboardToRedirect1).' + ' Se redirigirá a la página de acceso',
                confirmButtonText: 'Ok',
                denyButtonText: `Cancelar`,
              }).then((result: any) => {
                this.router.navigate(['login'])
              })
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
                let indexDeListaRecursosRoles = Number.parseInt(result.value)
                let dashboard = listaRecursosRoles[indexDeListaRecursosRoles].home_dashboard
                  || listaRecursosRoles[indexDeListaRecursosRoles].default_dashboard
                if (!dashboard) {
                  Swal.fire({
                    title: 'Su usuario no está debidamente configurado, contacte a soporte de Scintra ' +
                      'adjuntando captura de esta pantalla (error: noDashboardToRedirect2).' + ' Se redirigirá a la página de acceso',
                    confirmButtonText: 'Ok',
                    denyButtonText: `Cancelar`,
                  }).then((result: any) => {
                    this.router.navigate(['login'])
                  })
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
              localStorage.setItem('user_legacy_data', JSON.stringify({
                role: legacy_role,
                role_description: listaRecursosRoles[indexDeListaRecursosRoles].role_description,
                id_investigador: listaRecursosRoles[indexDeListaRecursosRoles].id_investigador,
                id_institucion: listaRecursosRoles[indexDeListaRecursosRoles].id_institucion
              }))
              this.router.navigate([route])
            })
          }
        },
        (err) => {
          console.log(err)
          Swal.fire({
            title: 'Ha ocurrido un error durante la autenticación, intente nuevamente.'
              + ' Si el problema persiste, contacte a soporte.' + ' Se redirigirá a la página de acceso(1)',
            confirmButtonText: 'Ok',
            denyButtonText: `Cancelar`,
          }).then((result: any) => {
            this.router.navigate(['login'])
          })
        }
      )
    } else {
      //console.error('UVMlogincallback llamada incorrecta')
      console.error(this.params)
      Swal.fire({
        title: 'Ha ocurrido un error durante la autenticación, intente nuevamente.'
          + ' Si el problema persiste, contacte a soporte.' + ' Se redirigirá a la página de acceso(2)',
        confirmButtonText: 'Ok',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        this.router.navigate(['login'])
      })
    }
  }
}
