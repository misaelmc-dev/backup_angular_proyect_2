import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";
import {AuthService} from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class PermisosScicomService {

  constructor(private http: HttpClient, private globals: GlobalsVars, private authService: AuthService) {}

  /**
   * Verifica si se permite la eliminación de un evento scicom
   */
  canEliminarEvento() {
    const user = this.authService.getUserEnLocal()
    if (user) {
      return (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
    } else {
      return false
    }
  }

  algo() {
    const permisos = this.authService.getPermisosScicomEnLocal()
    let sePuede = false
    for (let perm of permisos) {

    }
  }

  canVerFichaTecnicaEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'verArchEvid'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarEstatusEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'editEstEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarDescripcionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'editDescEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarLemaEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'editLemaEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarObjetivoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'editObjEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarNombreEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'editNombEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarFechasRealizacionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'editRangEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canVerEdicionDatosGeneralesEvento(idEvento: number) {
    return this.canVerFichaTecnicaEvento(idEvento)
  }

  canAgregarCampusEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addCampusEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarCampusEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delCampusEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canVerCampusEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'delCampusEvento')
      || this.checkPermissionByCode(idEvento, 'addCampusEvento' )
      || this.checkPermissionByCode(idEvento, 'verArchEvid')
  }

  canVerODSEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'addOdsEvento')
      || this.checkPermissionByCode(idEvento, 'delOdsEvento' )
      || this.canVerFichaTecnicaEvento(idEvento)
  }

  canEliminarODSEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delOdsEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarODSEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addOdsEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canVerTiposPagoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'delTipsPagoEvento')
      || this.checkPermissionByCode(idEvento, 'addTipsPagoEvento' )
      || this.checkPermissionByCode(idEvento, 'verArchEvid')
  }

  canAgregarTipoEvalEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addTipsEvalEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarTipoEvalEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delTipsEvalEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canVerTiposEvaluacionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'delTipsEvalEvento')
      || this.checkPermissionByCode(idEvento, 'addTipsEvalEvento' )
      || this.checkPermissionByCode(idEvento, 'verArchEvid')
  }

  canAgregarTipoPagoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addTipsPagoEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarTipoPagoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delTipsPagoEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarTipoPagoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'delTipsPagoEvento')
      && this.checkPermissionByCode(idEvento, 'addTipsPagoEvento')
  }

  canVerTiposParticipacionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'delTipsParticipEvento')
      || this.checkPermissionByCode(idEvento, 'addTipsParticipEvento' )
      || this.checkPermissionByCode(idEvento, 'verArchEvid')
  }

  canAgregarTipoParticipacionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addTipsParticipEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarTipoParticipacionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delTipsParticipEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarTipoParticipacionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'addTipsParticipEvento')
      && this.checkPermissionByCode(idEvento, 'delTipsParticipEvento')
  }

  canVerTiposTrabajoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'delTipsTrabEvento')
      || this.checkPermissionByCode(idEvento, 'addTipsTrabEvento' )
      || this.checkPermissionByCode(idEvento, 'verArchEvid')
  }

  canAgregarTipoTrabajoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addTipsTrabEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarTipoTrabajoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delTipsTrabEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canVerColaboradoresEvento(idEvento: number) {
    return this.canVerFichaTecnicaEvento(idEvento);
  }

  canAgregarColaboradorEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addUsuScicomEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarColaboradorEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delUsuScicomEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEditarColaboradorEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return this.checkPermissionByCode(idEvento, 'editUsuScicomEvento')
  }

  canVerArchivosEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    return (this.canVerArchConvocEvento(idEvento) || this.canVerArchEvidenciaEvento(idEvento))
  }

  canVerArchConvocEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'verArchConvoc'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarArchConvocEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addArchConvoc'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canVerArchPartProp(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'verArchPartProp'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarArchPartProp(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addArchPartProp'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarArchConvocEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delArchConvoc'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarArchPartProp(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delArchPartProp'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canVerArchEvidenciaEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'verArchEvid'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarArchEvidenciaEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addArchEvid'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarArchEvidenciaEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delArchEvid'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarParticipacionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addParticip'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarParticipacionPropia(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addParticipProp'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canEliminarParticipacionEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'delParticip'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarPreevaluacionTrabajoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addPreApiEval'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarEvaluacionTrabajoEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addAprobApiEval'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  canAgregarPagoEstimuloApiEvento(idEvento: number) {
    const user = this.authService.getUserEnLocal()
    if (user) {
      if (this.checkPermisoScintraByCode('allScicom') || this.checkPermisoScintraByCode('instScicom'))
        return true
    }
    const permisoBase = 'addPagEstApiEvento'
    return this.checkPermissionByCode(idEvento, permisoBase)
  }

  checkPermissionByCode(idEvento: number, permisoBase: string) {
    const permisos = this.authService.getPermisosScicomEnLocal()
    //console.warn(typeof permisos)
    let sePuede = false
    if (permisos) {
      if (typeof permisos[permisoBase] !== 'undefined') {
        for(let id of permisos[permisoBase]) {
          if (id == idEvento)
            return true
        }
      }
    }
    return sePuede;
  }

  /**
   * Verifica si el permiso scintra especificado está presente en cualquiera de los recursos del usuario, sin importar el tipo
   * @param permiso
   */
  checkPermisoScintraByCode(permiso: string) {
    let user = this.authService.getUserEnLocal()
    if (!user) return false
    const resources = user.resources
    const institucionesResources = resources.instituciones
    const investigadoresResources = resources.investigadores
    const campusResources = resources.campus
    const globalResources = resources.globales

    let authorized = false;
    if (!authorized) {
      institucionesResources.forEach((instRes: any) => {
        if (instRes.permisos.includes(permiso))
          authorized = true
      })
    }
    if (!authorized) {
      investigadoresResources.forEach((invRes: any) => {
        if (invRes.permisos.includes(permiso))
          authorized = true
      })
    }
    if (!authorized) {
      campusResources.forEach((campRes: any) => {
        if (campRes.permisos.includes(permiso))
          authorized = true
      })
    }
    if (!authorized) {
      globalResources.forEach((globRes: any) => {
        if (globRes.permisos.includes(permiso))
          authorized = true
      })
    }
    return authorized;
  }
}
