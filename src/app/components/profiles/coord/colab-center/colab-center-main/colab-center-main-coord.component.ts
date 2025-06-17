import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {collectExternalReferences} from "@angular/compiler";
import {CollaborationService} from "../../../../../services/collaboration.service";
import {data} from "jquery";
import {forEach} from "lodash";
import {ExcelJson} from "../../../../../interfaces/excel-json";
import {ExportService} from "../../../../../services/export.service";

@Component({
  selector: 'app-colab-center',
  templateUrl: './colab-center-main-coord.component.html',
  styleUrls: ['./colab-center-main-coord.component.css']
})
export class ColabCenterMainCoordComponent implements OnInit {

  idsInstitucionesOrigen: Array<number> = [] //filtro por instituciones origen
  idsColegiosOrigen: Array<number> = [] //filtro por colegios origen
  idsCampusOrigen: Array<number> = [] //filtro por campus origen
  idsLineasOrigen: Array<number> = [] //filtro por líneas de investigación origen
  idsInvestigadoresOrigen: Array<number> = [] //filtro por investigadores origen
  idsInstitucionesDestino: Array<string> = [] //filtro por instituciones destino
  searchTermInvestigadoresDestino: string = null //filtro por search term de investigadores destino
  aniosDestino: Array<number> = [] //filtro por años destino
  idsPaisesDestino: Array<string> = [] //filtro por países destino
  searchTermProductosDestino: string = null //filtro por search term de productos destino
  soloDestinoNacional: boolean = null //filtro de solo destino nacional
  soloDestinoInternacional: boolean = null //filtro de solo destino internacional
  soloDestinoInstitucional: boolean = null //filtro de solo destino institucional
  //cargan o no info
  shouldshowMain: boolean = false;
  shouldshowColegio: boolean = false
  shouldshowCampus: boolean = false
  shouldshowLinea: boolean = false
  shouldshowInvestigador: boolean = false
  //variables de filtrado
  filterSearchTerm: string = null //término de búsqueda para filtrar
  filterPossibleYears: Array<any> = []// lista de posibles años para filtrar
  filterPossibleLineas: Array<any> = []// lista de posibles líneas de investigación para filtrar
  filterPossibleColegios: Array<any> = []// lista de posibles colegios para filtrar
  filterPossibleCampus: Array<any> = []// lista de posibles campus para filtrar
  filterPossiblePaises: Array<any> = []// lista de posibles países para filtrar
  filterPossibleInstitucionesDest: Array<any> = []// lista de posibles instituciones destino para filtrar
  filterPossibleInvestigadoresOrig: Array<any> = []// lista de posibles investigadores origen para filtrar
  //control del excel
  excelOrigenSelection: string = 'instituciones'
  excelDestinosSelection: Array<string> = []

  constructor(private activatedRoute: ActivatedRoute,
              private collaborationService: CollaborationService,
              private exportService: ExportService)
  {
    this.idsInstitucionesOrigen = [parseInt(this.activatedRoute.snapshot.paramMap.get('id'))];
  }

  ngOnInit(): void {
    this.shouldshowMain = true
    this.shouldshowColegio = false
    this.shouldshowCampus = false
    this.shouldshowLinea = false
    this.shouldshowInvestigador = false
    this.loadPossibleFilterColegios()
    this.loadPossibleFilterCampus()
    this.loadPossibleFilterInstitucionesDestino()
    this.loadPossibleFilterInvestigadoresOrigen()
    this.loadPossibleFilterLines()
    this.loadPossibleFilterPaises()
    this.loadPossibleFilterYears()
  }

  showColegio() {
    this.shouldshowColegio = true;
  }

  showCampus() {
    this.shouldshowCampus = true;
  }

  showLinea() {
    this.shouldshowLinea = true;
  }

  showInvestigador() {
    this.shouldshowInvestigador = true;
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

  /**
   * Recarga la página para que se descarten los filtros
   */
  clearFilters = () => {
    //se recarga la página para deshacer la selección de filtros
    window.location.reload();
  }

  /**
   * Carga la información que cumpla con el término de búsqueda o filtrado
   */
  filterBySearchTerm() {
    if (this.filterSearchTerm.length > 1)
      this.resetMainView();
  }

  /**
   * Carga el listado de años posibles para filtrar que deben aparecer en el filtro por años
   */
  loadPossibleFilterYears() {
    this.collaborationService.getCollaborationData(
      'instituciones',
      ['anios'],
      this.idsInstitucionesOrigen
    ).subscribe(
      (data: any) => {
        this.gatherCleanYearData(data)
      }
    )
  }

  /**
   * Con base en una respuesta de origen institución y destino solo años del endpoint de colaboración,
   * toma el listado de años posibles para el filtro por años y los organiza de mayor a menor
   * @param data
   */
  gatherCleanYearData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
      if (item.desglose !== undefined) {
        this.gatherCleanYearData(item.desglose)
      } else {
        this.filterPossibleYears.push({'anio':item.anio,'checked':false})
      }
    })
    this.filterPossibleYears = this.filterPossibleYears.sort((a,b)=>b.anio-a.anio);
    //console.log("this.filterPossibleYears",this.filterPossibleYears)
  }

  /**
   * Agrega el año seleccionado en el filtro por años al listado de años destino y a continuación recarga la página
   * @param year
   * @param event
   */
  onYearSelectedForFiltering(year: number, event: any) {
    //console.log("year", year,"event", event);
    for(let item of this.filterPossibleYears){
      if(item.anio==year){
        if(item.checked){item.checked=false}else{item.checked=true}
      }
    }
    if (event.target.checked)
      this.aniosDestino.push(year) //agrega al listado de años a filtrar
    else {
      this.aniosDestino = this.aniosDestino.filter((item) => { return item != year; })
    }
    //console.log("this.aniosDestino",this.aniosDestino)
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el año indicado
    this.resetMainView()
  }

  /**
   * Carga el listado de líneas de investigadción posibles para filtrar que deben aparecer en el filtro por líneas
   */
  loadPossibleFilterLines() {
    this.collaborationService.getCollaborationData(
      'lineas',
      null,
      this.idsInstitucionesOrigen
    ).subscribe(
      (data: any) => {
        this.gatherCleanLineData(data)
      }
    )
  }

  /**
   * Con base en una respuesta de origen líneas de investigación del endpoint de colaboración,
   * toma el listado de líneas de investigación posibles para el filtro por líneas y los organiza alfabéticamente
   * @param data
   */
  gatherCleanLineData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
        this.filterPossibleLineas.push({
          id: item.id,
          nombre: item.nombre,
          checked: false
        })
        this.filterPossibleLineas.sort((item1, item2) => {
          if (item1.nombre == null)
            return 1
          if (item2.nombre == null)
            return -1
          return item1.nombre.toUpperCase().localeCompare(item2.nombre.toUpperCase())
        })
    })
  }

  /**
   * Agrega la línea de investigación seleccionada en el filtro por líneas al listado de líneas de investigación
   * origen y a continuación recarga la página
   * @param id
   * @param event
   */
  onLineaSelectedForFiltering(id: number, event: any) {
    for(let item of this.filterPossibleLineas){
      if(item.id==id){
        if(item.checked){ item.checked=false }else{ item.checked=true }
      }
    }
    if (event.target.checked)
      this.idsLineasOrigen.push(id) //agrega al listado de líneas de investigación a filtrar
    else {
      this.idsLineasOrigen = this.idsLineasOrigen.filter((item) => {
        return item != id;
      })
    }
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por la línea indicada
    this.resetMainView()
  }

  /**
   * Carga el listado de países posibles para filtrar que deben aparecer en el filtro por países
   */
  loadPossibleFilterPaises() {
    this.collaborationService.getCollaborationData(
      'instituciones',
      ['paises'],
      this.idsInstitucionesOrigen
    ).subscribe(
      (data: any) => {
        this.gatherCleanPaisData(data)
      }
    )
  }

  /**
   * Con base en una respuesta de origen institución y destino solo países del endpoint de colaboración,
   * toma el listado de países posibles para el filtro por países y los organiza alfabéticamente
   * @param data
   */
  gatherCleanPaisData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
      if (item.desglose !== undefined) {
        this.gatherCleanPaisData(item.desglose)
      } else {
        this.filterPossiblePaises.push({
          id: item.id_pais,
          nombre: item.nombre_pais,
          checked: false
        })
        this.filterPossiblePaises.sort((item1, item2) => {
          if (item1.nombre == null)
            return 1
          if (item2.nombre == null)
            return -1
          return item1.nombre.toUpperCase().localeCompare(item2.nombre.toUpperCase())
        })
      }
    })
  }

  /**
   * Agrega el país seleccionado en el filtro por país al listado de países destino y a continuación recarga la página
   * @param id
   * @param event
   */
  onPaisSelectedForFiltering(id: number, event: any) {
    for(let item of this.filterPossiblePaises){
      if(item.id==id){
        if(item.checked){ item.checked=false }else{ item.checked=true }
      }
    }
    if (event.target.checked)
      this.idsPaisesDestino.push((id) ? id.toString() : 'null') //agrega al listado de países a filtrar
    else {
      this.idsPaisesDestino = this.idsPaisesDestino.filter((item) => {
        return item !== ((id) ? id.toString() : 'null');
      })
    }
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el país indicado
    this.resetMainView()
  }

  /**
   * Carga el listado de instituciones destino posibles para filtrar que deben aparecer en el filtro
   * por instituciones destino
   */
  loadPossibleFilterInstitucionesDestino() {
    this.collaborationService.getCollaborationData(
      'instituciones',
      ['instituciones'],
      this.idsInstitucionesOrigen
    ).subscribe(
      (data: any) => {
        this.gatherCleanInstitucionDestData(data)
      }
    )
  }

  /**
   * Con base en una respuesta de origen institución y destino solo instituciones del endpoint de colaboración,
   * toma el listado de instituciones destino posibles para el filtro por instituciones destino y las organiza
   * alfabéticamente
   * @param data
   */
  gatherCleanInstitucionDestData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
      if (item.desglose !== undefined) {
        this.gatherCleanInstitucionDestData(item.desglose)
      } else {
        this.filterPossibleInstitucionesDest.push({
          id: item.id_ror_interno,
          nombre: item.nombre_institucion,
          pais: item.nombre_pais,
          checked: false
        })
        this.filterPossibleInstitucionesDest.sort((item1, item2) => {
          if (item1.nombre == null)
            return 1
          if (item2.nombre == null)
            return -1
          return item1.nombre.toUpperCase().localeCompare(item2.nombre.toUpperCase())
        })
      }
    })
  }

  /**
   * Agrega la institución destino seleccionada en el filtro por institución destino al listado de instituciones
   * destino y a continuación recarga la página
   * @param id
   * @param event
   */
  onInstitucionDestinoSelectedForFiltering(id: number, event: any) {
    for(let item of this.filterPossibleInstitucionesDest){
      if(item.id==id){
        if(item.checked){ item.checked=false }else{ item.checked=true }
      }
    }
    if (event.target.checked)
      this.idsInstitucionesDestino.push((id) ? id.toString() : 'null') //agrega al listado de instituciones destino a filtrar
    else {
      this.idsInstitucionesDestino = this.idsInstitucionesDestino.filter((item) => {
        return item !== ((id) ? id.toString() : 'null');
      })
    }
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el país indicado
    this.resetMainView()
  }

  /**
   * Carga el listado de colegios posibles para filtrar que deben aparecer en el filtro por colegios
   */
  loadPossibleFilterColegios() {
    this.collaborationService.getCollaborationData(
      'colegios',
      null,
      this.idsInstitucionesOrigen
    ).subscribe(
      (data: any) => {
        this.gatherCleanColegioData(data)
      }
    )
  }

  /**
   * Con base en una respuesta de origen colegios del endpoint de colaboración, toma el listado de colegios
   * posibles para el filtro por colegios y los organiza alfabéticamente
   * @param data
   */
  gatherCleanColegioData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
      this.filterPossibleColegios.push({
        id: item.id,
        nombre: item.nombre,
        checked: false
      })
      this.filterPossibleColegios.sort((item1, item2) => {
        if (item1.nombre == null)
          return 1
        if (item2.nombre == null)
          return -1
        return item1.nombre.toUpperCase().localeCompare(item2.nombre.toUpperCase())
      })
    })
  }

  /**
   * Agrega el colegio seleccionado en el filtro por colegios al listado de colegios origen
   * y a continuación recarga la página
   * @param id
   * @param event
   */
  onColegioSelectedForFiltering(id: number, event: any) {
    for(let item of this.filterPossibleColegios){
      if(item.id==id){
        if(item.checked){ item.checked=false }else{ item.checked=true }
      }
    }
    if (event.target.checked)
      this.idsColegiosOrigen.push(id) //agrega al listado de colegios a filtrar
    else {
      this.idsColegiosOrigen = this.idsColegiosOrigen.filter((item) => {
        return item != id;
      })
    }
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el colegio indicado}
    this.resetMainView()
  }

  /**
   * Carga el listado de campus posibles para filtrar que deben aparecer en el filtro por campus
   */
  loadPossibleFilterCampus() {
    this.collaborationService.getCollaborationData(
      'campus',
      null,
      this.idsInstitucionesOrigen
    ).subscribe(
      (data: any) => {
        this.gatherCleanCampusData(data)
      }
    )
  }

  /**
   * Con base en una respuesta de origen campus del endpoint de colaboración, toma el listado de campus
   * posibles para el filtro por campus y los organiza alfabéticamente
   * @param data
   */
  gatherCleanCampusData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
      this.filterPossibleCampus.push({
        id: item.id,
        nombre: item.nombre,
        checked: false
      })
      this.filterPossibleCampus.sort((item1, item2) => {
        if (item1.nombre == null)
          return 1
        if (item2.nombre == null)
          return -1
        return item1.nombre.toUpperCase().localeCompare(item2.nombre.toUpperCase())
      })
    })
  }

  /**
   * Agrega el campus seleccionado en el filtro por campus al listado de campus origen
   * y a continuación recarga la página
   * @param id
   * @param event
   */
  onCampusSelectedForFiltering(id: number, event: any) {
    for(let item of this.filterPossibleCampus){
      if(item.id==id){
        if(item.checked){ item.checked=false }else{ item.checked=true }
      }
    }
    if (event.target.checked)
      this.idsCampusOrigen.push(id) //agrega al listado de campus a filtrar
    else {
      this.idsCampusOrigen = this.idsCampusOrigen.filter((item) => {
        return item != id;
      })
    }
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el campus indicado}
    this.resetMainView()
  }

  /**
   * Carga el listado de investigadores origen posibles para filtrar que deben aparecer en el filtro por
   * investigadores origen
   */
  loadPossibleFilterInvestigadoresOrigen() {
    this.collaborationService.getCollaborationData(
      'investigadores',
      null,
      this.idsInstitucionesOrigen
    ).subscribe(
      (data: any) => {
        this.gatherCleanInvestigadorOrigenData(data)
      }
    )
  }

  /**
   * Con base en una respuesta de origen investigadores del endpoint de colaboración, toma el listado de investigadores
   * origen posibles para el filtro por investigadores origen y los organiza alfabéticamente
   * @param data
   */
  gatherCleanInvestigadorOrigenData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
      this.filterPossibleInvestigadoresOrig.push({
        id: item.id,
        nombre: item.nombre,
        checked: false
      })
      this.filterPossibleInvestigadoresOrig.sort((item1, item2) => {
        if (item1.nombre == null)
          return 1
        if (item2.nombre == null)
          return -1
        return item1.nombre.toUpperCase().localeCompare(item2.nombre.toUpperCase())
      })
    })
  }

  /**
   * Agrega el investigador origen seleccionado en el filtro por investigadores origen al listado de investigadores
   * origen y a continuación recarga la página
   * @param id
   * @param event
   */
  onInvestigadorOrigenSelectedForFiltering(id: number, event: any) {
    for(let item of this.filterPossibleInvestigadoresOrig){
      if(item.id==id){
        if(item.checked){ item.checked=false }else{ item.checked=true }
      }
    }
    if (event.target.checked)
      this.idsInvestigadoresOrigen.push(id) //agrega al listado de investigadores origen a filtrar
    else {
      this.idsInvestigadoresOrigen = this.idsInvestigadoresOrigen.filter((item) => {
        return item != id;
      })
    }
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el colegio indicado
    this.resetMainView()
  }

  /**
   * Pone el filtro solo nacional y a continuación recarga la página
   * @param event
   */
  onSoloNacionalSelectedForFiltering(event: any) {
    this.soloDestinoNacional = event.target.checked
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el colegio indicado
    this.resetMainView()
  }

  /**
   * Pone el filtro solo internacional y a continuación recarga la página
   * @param event
   */
  onSoloInternacionalSelectedForFiltering(event: any) {
    this.soloDestinoInternacional = event.target.checked
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el colegio indicado
    this.resetMainView()
  }

  /**
   * Pone el filtro solo institucional y a continuación recarga la página
   * @param event
   */
  onSoloInstitucionalSelectedForFiltering(event: any) {
    this.soloDestinoInstitucional = event.target.checked
    //recarga el mainframe de la vista del centro de colaboración para que cargue filtrando por el colegio indicado
    this.resetMainView()
  }

  resetMainView(){
    this.shouldshowMain = false;
    setTimeout(() => {
      this.shouldshowMain = true
    }, 100);
  }

  onExcelOrigenSelectionChange(event: any) {
    this.excelOrigenSelection= event.target.value
    //console.log(this.excelOrigenSelection)
  }

  onExcelDestinoSelectionChange(event: any) {
    const value = event.target.value
    const checked = event.target.checked
    if (checked)
      this.excelDestinosSelection.push(value)
    else {
      this.excelDestinosSelection = this.excelDestinosSelection.filter((item) => item !== value)
    }
  }

  exportAsExcel() {
    let readyColabData: any[]
    //se piden los datos de colaboración al servicio de colaboración
    this.collaborationService.getCollaborationData(
      this.excelOrigenSelection,
      this.excelDestinosSelection,
      this.idsInstitucionesOrigen,
      this.idsInvestigadoresOrigen,
      this.idsColegiosOrigen,
      this.idsLineasOrigen,
      this.idsInstitucionesDestino,
      this.aniosDestino,
      this.idsPaisesDestino,
      this.searchTermInvestigadoresDestino,
      this.searchTermProductosDestino,
      this.soloDestinoNacional,
      this.soloDestinoInternacional,
      this.soloDestinoInstitucional,
      this.filterSearchTerm,
      this.idsCampusOrigen
    ).subscribe((data: any) => {
      readyColabData = this.transformToMatrix(data)
      if (readyColabData && readyColabData.length > 0) {
        const edata: Array<ExcelJson> = []

        let headerDataRow: any = {}
        Object.keys(readyColabData[0]).forEach((key) => {
          if (key == 'colabs_individuales')
            headerDataRow[key] = 'Coautoría'
          else
            headerDataRow[key] = key
        })
        const udt: ExcelJson = {
          data: [
            headerDataRow
          ],
          skipHeader: true,
        }
        readyColabData.forEach((item: any) => {
          let dataRow: any = {}
          Object.keys(item).forEach((key) => {
            dataRow[key] = item[key]
          })
          udt.data.push(dataRow);
        });
        edata.push(udt);
        this.exportService.exportJsonToExcel(edata, 'Compendio de colaboración');
      }
    })
    //se transforman los datos a forma matricial

  }

  transformToMatrix(originalData: Array<any>): any {
    //se genera una nueva referencia al objeto para no modificar datos originales
    let data = this.newObjectReference(originalData)
    let outputData: Array<any> = []
    data.forEach((origen: any) => {
      if (origen.desglose != undefined) {
        let desglose = this.newObjectReference(origen.desglose) //se obtiene el valor de desglose con una nueva referencia
        delete origen.desglose //se elimina el campo "desglose" de origen original
        desglose.forEach((desg: any) => { //por cada elemento del desglose
          let aux = this.newObjectReference(origen) //se toma nueva referencia para tener un origen auxiliar con que trabajar
          Object.keys(desg).forEach((key) => {
            aux[key] = desg[key]
          })
          outputData.push(aux)
        })
      }
    })
    //hace llamada recursiva si aún hay desglose, de lo contrario corta la ejecución retornando
    if (outputData && outputData.length > 0 && outputData[0].desglose != undefined)
      return this.transformToMatrix(outputData)
    else
      return outputData
  }
}
