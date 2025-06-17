import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PermisosScintraService {

  constructor(private authService: AuthService) { }

  /**
   * Revisa si el usuario scintra logueado está autorizado a ver reportes de foro /encuentro uvm /unitec ilimitadamente
   */
  canVerStatsForoEncuentroUvmUnitecIlimitadamente() {
    return this.checkPermisoScintraByCode('verStatsForoUVMEncuentroUtec')
  }

  canVerStatsForoEncuentroUvmUnitecInstitucion(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verStatsForoUVMEncuentroUtecSameInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 3 de ranking
   */
  canVerGraph3Rankings() {
    return this.checkPermisoScintraByCode('verGraph3Rankings')
  }

  /**
   * Puede ver gráfico 3 de ranking de las instituciones especificadas
   */
  canVerGraph3RankingsInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph3RankingsInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 4 de ranking
   */
  canVerGraph4Rankings() {
    return this.checkPermisoScintraByCode('verGraph4Rankings')
  }

  /**
   * Puede ver gráfico 4 de ranking de las instituciones especificadas
   */
  canVerGraph4RankingsInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph4RankingsInst', idInstitucion)
  }

  /**
   * Puede ver investigadores de todas las instituciones Scintra
   */
  canVerInvestDeAllInst() {
    return this.checkPermisoScintraByCode('verInvestDeAllInst')
  }

  /**
   * Puede ver investigadores de la institución Scintra especificada
   */
  canVerInvestDeOwnInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verInvestDeOwnInst', idInstitucion)
  }

  /**
   * Puede ver header data de cualquier institución
   */
  canVerHeaderDataAllInst() {
    return this.checkPermisoScintraByCode('verHeaderDataAllInst')
  }

  /**
   * Puede ver header data de la institución especificada
   */
  canVerHeaderDataOwnInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verHeaderDataOwnInst', idInstitucion)
  }

  /**
   * Tiene acceso limitado institucional a layer 2 SCICOM
   */
  canInstScicom(idInstitucion: any) {
    return this.checkPermisoScintraByCode('instScicom', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente colegios
   */
  canVerColegios() {
    return this.checkPermisoScintraByCode('verColegios')
  }

  /**
   * Puede ver colegios de la institución especificada
   */
  canVerColegiosSameInstScintra(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verColegiosSameInstScintra', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente las líneas de investigación
   */
  canVerLineasInvestAllInst() {
    return this.checkPermisoScintraByCode('verLineasInvestAllInst')
  }

  /**
   * Puede ver líneas de investigación de la institución especificada
   */
  canVerLineasInvestOwnInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verLineasInvestOwnInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 1 de investigación
   */
  canVerGraph1Invest() {
    return this.checkPermisoScintraByCode('verGraph1Invest')
  }

  /**
   * Puede ver gráfico 1 de investigación de la institución especificada
   */
  canVerGraph1InvestInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph1InvestInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 2 de investigación
   */
  canVerGraph2Invest() {
    return this.checkPermisoScintraByCode('verGraph2Invest')
  }

  /**
   * Puede ver gráfico 2 de investigación de la institución especificada
   */
  canVerGraph2InvestInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph2InvestInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 3 de investigación
   */
  canVerGraph3Invest() {
    return this.checkPermisoScintraByCode('verGraph3Invest')
  }

  /**
   * Puede ver gráfico 3 de investigación de la institución especificada
   */
  canVerGraph3InvestInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph3InvestInst', idInstitucion)
  }

  /**
   * Puede ver visibilidad institucional por año (scopsu etc) ilimitadamente
   */
  canVerVisibilidadInstPorAnio() {
    return this.checkPermisoScintraByCode('verVisibilidadInstPorAnio')
  }

  /**
   * Puede ver visibilidad institucional por año (scopus etc) de la institución especificada
   */
  canVerVisibilidadInstPorAnioInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verVisibilidadInstPorAnioInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 4 de investigación
   */
  canVerGraph4Invest() {
    return this.checkPermisoScintraByCode('verGraph4Invest')
  }

  /**
   * Puede ver gráfico 3 de investigación de la institución especificada
   */
  canVerGraph4InvestInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph4InvestInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 1 de impacto
   */
  canVerGraph1Impacto() {
    return this.checkPermisoScintraByCode('verGraph1Impacto')
  }

  /**
   * Puede ver gráfico 1 de impacto de la institución especificada
   */
  canVerGraph1ImpactoInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph1ImpactoInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 2 de impacto
   */
  canVerGraph2Impacto() {
    return this.checkPermisoScintraByCode('verGraph2Impacto')
  }

  /**
   * Puede ver gráfico 2 de impacto de la institución especificada
   */
  canVerGraph2ImpactoInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph2ImpactoInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 3 de impacto
   */
  canVerGraph3Impacto() {
    return this.checkPermisoScintraByCode('verGraph3Impacto')
  }

  /**
   * Puede ver gráfico 3 de impacto de la institución especificada
   */
  canVerGraph3ImpactoInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph3ImpactoInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente gráfico 4 de impacto
   */
  canVerGraph4Impacto() {
    return this.checkPermisoScintraByCode('verGraph4Impacto')
  }

  /**
   * Puede ver gráfico 4 de impacto de la institución especificada
   */
  canVerGraph4ImpactoInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verGraph4ImpactoInst', idInstitucion)
  }

  /**
   * Puede ver años productivos de cualquier institución
   */
  canVerAniosProdAllInst(){
    return this.checkPermisoScintraByCode('verAniosProdAllInst')
  }

  /**
   * Puede ver años productivos de la institución especificada
   */
  canVerAniosProdOwnInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verAniosProdOwnInst', idInstitucion)
  }

  /**
   * Puede ver campus de cualquier institución especificada
   */
  canVerCampusAllInst() {
    return this.checkPermisoScintraByCode('verCampusAllInst')
  }

  /**
   * Puede ver campus de la institución especificada
   */
  canVerCampusOwnInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verCampusOwnInst', idInstitucion)
  }

  /**
   * Puede ver alumnos de cualquier institución
   */
  canVerAlum() {
    return this.checkPermisoScintraByCode('verAlum')
  }

  /**
   * Puede ver alumnos de la institución especificada
   */
  canVerAlumSameInstScintra(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verAlumSameInstScintra', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente centros de investigación
   */
  canVerCentroInvest() {
    return this.checkPermisoScintraByCode('verCentroInvest')
  }

  /**
   * Puede ver centros de investigación de la institución especificada
   */
  canVerCentroInvestSameInstScintra(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verCentroInvestSameInstScintra', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente investigadores en formato simple
   */
  canVerInvestSimple() {
    return this.checkPermisoScintraByCode('verInvestSimple')
  }

  /**
   * Puede ver investigadores en formato de simple de la institución especificada
   */
  canVerInvestSimpleSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verInvestSimpleSameInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente convocatorias de proyectos de investigación
   */
  canVerConvocsProyInvest() {
    return this.checkPermisoScintraByCode('verConvocsProyInvest')
  }

  /**
   * Puede ver convocatorias de proyectos de investigación de la institución especificada
   */
  canVerConvocsProyInvestSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verConvocsProyInvestSameInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente proyectos de investigación
   */
  canVerProyectosInvest() {
    return this.checkPermisoScintraByCode('verProyectosInvest')
  }

  /**
   * Puede ver proyectos de investigación de la institución especificada
   */
  canVerProyectosInvestSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verProyectosInvestSameInst', idInstitucion)
  }

  /**
   * Puede ver estadísticas de productos en colaboración ilimitadamente
   */
  canVerStatsProdColaboracion() {
    return this.checkPermisoScintraByCode('verStatsProdColaboracion')
  }

  /**
   * Puede ver estadísticas de productos en colaboración para el investigador especificado
   */
  canVerStatsProdColaboracionInvestProp(idInvestigador: any) {
    return this.checkPermisoScintraByCode('verStatsProdColaboracionInvestProp', null, idInvestigador)
  }

  /**
   * Puede ver estadísticas de productos en colaboración para la institución especificada
   */
  canVerStatsProdColaboracionInvestSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verStatsProdColaboracionInvestSameInst', idInstitucion)
  }

  /**
   * Puede ver myzone de productos ilimitadamente
   */
  canVerMyZone() {
    return this.checkPermisoScintraByCode('verMyZone')
  }

  /**
   * Puede ver myzone de productos del investigador especificado
   */
  canVerMyZoneInvestProp(idInvestigador: any) {
    return this.checkPermisoScintraByCode('verMyZoneInvestProp', null, idInvestigador)
  }

  /**
   * Puede ver myzone de productos de la institución especificada
   */
  canVerMyZoneSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verMyZoneSameInst', idInstitucion)
  }

  /**
   * Puede ver myzone de impacto ilimitadamente
   */
  canVerMyZoneCitas() {
    return this.checkPermisoScintraByCode('verMyZoneCitas')
  }

  /**
   * Puede ver myzone de impacto del investigador especificado
   */
  canVerMyZoneCitasInvestProp(idInvestigador: any) {
    return this.checkPermisoScintraByCode('verMyZoneCitasInvestProp', null, idInvestigador)
  }

  /**
   * Puede ver myzone de impacto de la institución especificada
   */
  canVerMyZoneCitasSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verMyZoneCitasSameInst', idInstitucion)
  }

  /**
   * Puede ver header data de cualquier investigador
   */
  canVerHeaderDataInvest() {
    return this.checkPermisoScintraByCode('verHeaderDataInvest')
  }

  /**
   * Puede ver header data de investigador del investigador especificado
   */
  canVerHeaderDataInvestProp(idInvestigador: any){
    return this.checkPermisoScintraByCode('verHeaderDataInvestProp', null, idInvestigador)
  }

  /**
   * Puede ver header data de investigador de la institución especificada
   */
  canVerHeaderDataInvestSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verHeaderDataInvestSameInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente totales de productos y citas por tipo por año de investigador
   */
  canVerTotProdCitPorTipoPorAnioInvest() {
    return this.checkPermisoScintraByCode('verTotProdCitPorTipoPorAnioInvest')
  }

  /**
   * Puede ver totales de productos y citas por tipo por año del investigador especificado
   */
  canVerTotProdCitPorTipoPorAnioInvestProp(idInvestigador: any) {
    return this.checkPermisoScintraByCode('verTotProdCitPorTipoPorAnioInvestProp', null, idInvestigador)
  }

  /**
   * Puede ver totales de productos y citas por tipo por año de investigador perteneciente a la institución especificada
   */
  canVerTotProdCitPorTipoPorAnioInvestSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verTotProdCitPorTipoPorAnioInvestSameInst', idInstitucion)
  }

  /**
   * Puede ver productos de investigadores ilimitadamente
   */
  canVerProdsInvest() {
    return this.checkPermisoScintraByCode('verProdsInvest')
  }

  /**
   * Puede ver productos de investigador especificado
   */
  canVerProdsInvestProp(idInvestigador: any) {
    return this.checkPermisoScintraByCode('verProdsInvestProp', null, idInvestigador)
  }

  /**
   * Puede ver productos de investigador de institución especificada
   */
  canVerProdsInvestSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verProdsInvestSameInst', idInstitucion)
  }

  /**
   * Puede ver ilimitadamente totales de producto por tipos de investigador
   */
  canVerTotProdPorTipoInvest() {
    return this.checkPermisoScintraByCode('verTotProdPorTipoInvest')
  }

  /**
   * Puede ver totales de producto por tipos de investigador especificado
   */
  canVerTotProdPorTipoInvestProp(idInvestigador: any) {
    return this.checkPermisoScintraByCode('verTotProdPorTipoInvestProp', null, idInvestigador)
  }

  /**
   * Puede ver totales de producto por tipos de investigador
   */
  canVerTotProdPorTipoInvestSameInst(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verTotProdPorTipoInvestSameInst', idInstitucion)
  }

  /**
   * Puede crear ilimitadamente alumnos
   */
  canAddAlum() {
    return this.checkPermisoScintraByCode('addAlum')
  }

  /**
   * Puede crear alumnos de su institución
   */
  canAddAlumSameInstScintra(idInstitucion: any) {
    return this.checkPermisoScintraByCode('addAlumSameInstScintra', idInstitucion)
  }

  /**
   * Puede actualizar ilimitadamente alumnos
   */
  canUpdAlum() {
    return this.checkPermisoScintraByCode('updAlum')
  }

  /**
   * Puede actualizar alumnos de su institución
   */
  canUpdAlumSameInstScintra(idInstitucion: any) {
    return this.checkPermisoScintraByCode('updAlumSameInstScintra', idInstitucion)
  }

  /**
   * Puede eliminar ilimitadamente alumnos
   */
  canDelAlum() {
    return this.checkPermisoScintraByCode('delAlum')
  }

  /**
   * Puede eliminar alumnos de su institución
   */
  canDelAlumSameInstScintra(idInstitucion: any) {
    return this.checkPermisoScintraByCode('delAlumSameInstScintra', idInstitucion)
  }

  /**
   * Puede crear ilimitadamente áreas del conocimiento
   */
  canAddArea() {
    return this.checkPermisoScintraByCode('addArea')
  }

  /**
   * Puede actualizar ilimitadamente áreas del conocimiento
   */
  canUpdArea() {
    return this.checkPermisoScintraByCode('updArea')
  }

  /**
   * Puede eliminar ilimitadamente áreas del conocimiento
   */
  canDelArea() {
    return this.checkPermisoScintraByCode('delArea')
  }

  /**
   * Puede ver ilimitadamente campus
   */
  canVerCampus() {
    return this.checkPermisoScintraByCode('verCampus')
  }

  /**
   * Puede ver campus de su institución
   */
  canVerCampusSameInstScintra(idInstitucion: any) {
    return this.checkPermisoScintraByCode('verCampusSameInstScintra', idInstitucion)
  }

  /**
   * Puede ver campus propios (asignados directamente a él por user resource)
   */
  canVerCampusPropios(idCampus: any) {
    return this.checkPermisoScintraByCode('verCampusPropios', null, null, idCampus)
  }

  /**
   * Puede crear ilimitadamente campus
   */
  canAddCampus() {
    return this.checkPermisoScintraByCode('addCampus')
  }

  /**
   * Puede actualizar ilimitadamente campus
   */
  canUpdCampus() {
    return this.checkPermisoScintraByCode('updCampus')
  }

  /**
   * Puede actualizar ilimitadamente campus
   */
  canDelCampus() {
    return this.checkPermisoScintraByCode('delCampus')
  }

  /**
   * Puede asociar ilimitadamente campus y colegios
   */
  canLinkCampusColegio() {
    return this.checkPermisoScintraByCode('linkCampusColegio')
  }

  /**
   * Puede desasociar ilimitadamente campus y colegios
   */
  canUnlinkCampusColegio() {
    return this.checkPermisoScintraByCode('unlinkCampusColegio')
  }

  /**
   * Puede crear ilimitadamente centros de investigación
   */
  canAddCentroInvest() {
    return this.checkPermisoScintraByCode('addCentroInvest')
  }

  /**
   * Puede actualizar ilimitadamente centros de investigación
   */
  canUpdCentroInvest() {
    return this.checkPermisoScintraByCode('updCentroInvest')
  }

  /**
   * Puede eliminar ilimitadamente centros de investigación
   */
  canDelCentroInvest() {
    return this.checkPermisoScintraByCode('delCentroInvest')
  }

  /**
   * Puede asociar ilimitadamente centros de investigación y colegios
   */
  canLinkCentroInvestColegio() {
    return this.checkPermisoScintraByCode('linkCentroInvestColegio')
  }

  /**
   * Puede desasociar ilimitadamente centros de investigación y colegios
   */
  canUnlinkCentroInvestColegio() {
    return this.checkPermisoScintraByCode('unlinkCentroInvestColegio')
  }

  /**
   * Puede crear ilimitadamente colegios
   */
  canAddColegio() {
    return this.checkPermisoScintraByCode('addColegio')
  }

  /**
   * Puede actualizar ilimitadamente colegios
   */
  canUpdColegio() {
    return this.checkPermisoScintraByCode('updColegio')
  }

  /**
   * Puede eliminar ilimitadamente colegios
   */
  canDelColegio() {
    return this.checkPermisoScintraByCode('delColegio')
  }

  /**
   * Puede crear ilimitadamente disciplinas
   */
  canAddDisciplina() {
    return this.checkPermisoScintraByCode('addDisciplina')
  }

  /**
   * Puede actualizar ilimitadamente disciplinas
   */
  canUpdDisciplina() {
    return this.checkPermisoScintraByCode('updDisciplina')
  }

  /**
   * Puede eliminar ilimitadamente disciplinas
   */
  canDelDisciplina() {
    return this.checkPermisoScintraByCode('delDisciplina')
  }

  /**
   * Puede crear ilimitadamente idiomas
   */
  canAddIdioma() {
    return this.checkPermisoScintraByCode('addIdioma')
  }

  /**
   * Puede actualizar ilimitadamente idiomas
   */
  canUpdIdioma() {
    return this.checkPermisoScintraByCode('updIdioma')
  }

  /**
   * Puede eliminar ilimitadamente idiomas
   */
  canDelIdioma() {
    return this.checkPermisoScintraByCode('delIdioma')
  }

  /**
   * Puede crear ilimitadamente líneas de investigación
   */
  canAddLineaInvest() {
    return this.checkPermisoScintraByCode('addLineaInvest')
  }

  /**
   * Puede actualizar ilimitadamente líneas de investigación
   */
  canUpdLineaInvest() {
    return this.checkPermisoScintraByCode('updLineaInvest')
  }

  /**
   * Puede eliminar ilimitadamente líneas de investigación
   */
  canDelLineaInvest() {
    return this.checkPermisoScintraByCode('delLineaInvest')
  }

  /**
   * Puede crear ilimitadamente países
   */
  canAddPais() {
    return this.checkPermisoScintraByCode('addPais')
  }

  /**
   * Puede actualizar ilimitadamente países
   */
  canUpdPais() {
    return this.checkPermisoScintraByCode('updPais')
  }

  /**
   * Puede eliminar ilimitadamente países
   */
  canDelPais() {
    return this.checkPermisoScintraByCode('delPais')
  }

  /**
   * Puede crear ilimitadamente accessright
   */
  canAddAccessRight() {
    return this.checkPermisoScintraByCode('addAccessRight')
  }

  /**
   * Puede actualizar ilimitadamente accessright
   */
  canUpdAccessRight() {
    return this.checkPermisoScintraByCode('updAccessRight')
  }

  /**
   * Puede eliminar ilimitadamente accessright
   */
  canDelAccessRight() {
    return this.checkPermisoScintraByCode('delAccessRight')
  }

  /**
   * Puede crear ilimitadamente tipo de producto
   */
  canAddTipoNp() {
    return this.checkPermisoScintraByCode('addTipoNp')
  }

  /**
   * Puede actualizar ilimitadamente tipo de producto
   */
  canUpdTipoNp() {
    return this.checkPermisoScintraByCode('updTipoNp')
  }

  /**
   * Puede eliminar ilimitadamente tipo de producto
   */
  canDelTipoNp() {
    return this.checkPermisoScintraByCode('delTipoNp')
  }

  /**
   * Puede crear ilimitadamente tipo de proyecto
   */
  canAddTipoProyecto() {
    return this.checkPermisoScintraByCode('addTipoProyecto')
  }

  /**
   * Puede actualizar ilimitadamente tipo de proyecto
   */
  canUpdTipoProyecto() {
    return this.checkPermisoScintraByCode('updTipoProyecto')
  }

  /**
   * Puede eliminar ilimitadamente tipo de proyecto
   */
  canDelTipoProyecto() {
    return this.checkPermisoScintraByCode('delTipoProyecto')
  }

  /**
   * Verifica si el permiso Scintra especificado está presente en cualquiera de los recursos del usuario si no se
   * especifican recursos, si sí se especifica al menos 1 de los recursos (institución, investigador, campus) entonces
   * se busca que esté presente para estos
   * @param permiso
   * @param idInstitucion
   * @param idInvestigador
   * @param idCampus
   */
  checkPermisoScintraByCode(permiso: string, idInstitucion?: any, idInvestigador?: any, idCampus?: any) {
    let user = this.authService.getUserEnLocal()
    if (!user) return false
    const resources = user.resources
    const institucionesResources = resources.instituciones
    const investigadoresResources = resources.investigadores
    const campusResources = resources.campus
    const globalResources = resources.globales

    let authorized = false;
    const institutionCheckRequested = !(idInstitucion === undefined || idInstitucion === null || idInstitucion === '')
    const investigadorCheckRequested = !(idInvestigador === undefined || idInvestigador === null || idInvestigador === '')
    const campusCheckRequested = !(idCampus === undefined || idCampus === null || idCampus === '')

    if (!institutionCheckRequested && !investigadorCheckRequested && !campusCheckRequested)
    {
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
    } else {
      let institucionAuthorized = false
      if (institutionCheckRequested) {
        institucionesResources.forEach((instRes: any) => {
          if (instRes.id == idInstitucion && instRes.permisos.includes(permiso))
            institucionAuthorized = true
        })
        authorized = institucionAuthorized
      }
      let investigadorAuthorized = false
      if (investigadorCheckRequested) {
        investigadoresResources.forEach((invRes: any) => {
          if (invRes.id == idInvestigador && invRes.permisos.includes(permiso))
            investigadorAuthorized = true
        })
        authorized = (institutionCheckRequested ? authorized : true) && investigadorAuthorized
      }
      let campusAuthorized = false
      if (campusCheckRequested) {
        campusResources.forEach((campRes: any) => {
          if (campRes.id == idCampus && campRes.permisos.includes(permiso))
            campusAuthorized = true
        })
        authorized = ((institutionCheckRequested || investigadorCheckRequested) ? authorized : true) && campusAuthorized
      }
    }

    return authorized;
  }
}
