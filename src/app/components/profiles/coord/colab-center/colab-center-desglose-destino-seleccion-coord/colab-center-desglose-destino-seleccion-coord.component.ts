import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-colab-center-desglose-destino-seleccion-coord',
  templateUrl: './colab-center-desglose-destino-seleccion-coord.component.html',
  styleUrls: ['./colab-center-desglose-destino-seleccion-coord.component.css']
})
export class ColabCenterDesgloseDestinoSeleccionCoordComponent implements OnInit {
  @Input() titulo: string = 'Selección de desglose'
  @Input() tipoElementoOrigen: string = null //origen
  @Input() tiposElementosDestino: Array<string> = null //destinos
  @Input() idsInstitucionesOrigen: Array<number> = null //filtro por instituciones origen
  @Input() idsColegiosOrigen: Array<number> = null //filtro por colegios origen
  @Input() idsCampusOrigen: Array<number> = null //filtro por campus origen
  @Input() idsLineasOrigen: Array<number> = null //filtro por líneas de investigación origen
  @Input() idsInvestigadoresOrigen: Array<number> = null //filtro por investigadores origen
  @Input() idsInstitucionesDestino: Array<string> = null //filtro por instituciones destino
  @Input() searchTermInvestigadoresDestino: string = null //filtro por search term de investigadores destino
  @Input() aniosDestino: Array<number> = null //filtro por años destino
  @Input() idsPaisesDestino: Array<string> = null //filtro por países destino
  @Input() searchTermProductosDestino: string = null //filtro por search term de productos destino
  @Input() soloDestinoNacional: boolean = null //filtro de solo destino nacional
  @Input() soloDestinoInternacional: boolean = null //filtro de solo destino internacional
  @Input() soloDestinoInstitucional: boolean = null //filtro de solo destino institucional
  @Input() filterSearchTerm: string = null //término de búsqueda para filtrar
  //mostar opciones
  @Input() showBackButton: boolean = true //filtro de solo destino institucional
  @Input() showInstitucionesOption: boolean = true //indica si debe mostrarse la opción instituciones en el menú
  @Input() showInvestigadoresOption: boolean = true //indica si debe mostrarse la opción investigadores en el menú
  @Input() showAniosOption: boolean = true //indica si debe mostrarse la opción años en el menú
  @Input() showProductosOption: boolean = true //indica si debe mostrarse la opción productos en el menú
  //eventos salientes
  @Output() backEvent = new EventEmitter<string>();

  showElemList: boolean //mostrar el menú principal de este componente
  showInstitucionesList: boolean // mostrar la lista de instituciones si se selecciona la opción instituciones
  showInvestigadoresList: boolean // mostrar la lista de investigadores si se selecciona la opción investigadores
  showYearList: boolean // mostrar la lista de años si se selecciona la opción años
  showProductList: boolean // mostrar la lista de productos si se selecciona la opción productos

  selectedElem: number //tipo de desglose seleccionado al hacer clic

  constructor() { }

  ngOnInit(): void {
    this.showElemList = true
  }

  goBack() {
    this.backEvent.emit('')
  }

  onBackEventReceived() {
    this.showElemList = true
    this.showInstitucionesList = false
    this.showInvestigadoresList = false
    this.showYearList = false
    this.showProductList = false
  }

  onInstitutionClicked() {
    this.showElemList = false
    this.showInstitucionesList = true
    this.showInvestigadoresList = false
    this.showYearList = false
    this.showProductList = false
  }

  onInvestigadorClicked() {
    this.showElemList = false
    this.showInstitucionesList = false
    this.showInvestigadoresList = true
    this.showYearList = false
    this.showProductList = false
  }

  onYearClicked() {
    this.showElemList = false
    this.showInstitucionesList = false
    this.showInvestigadoresList = false
    this.showYearList = true
    this.showProductList = false
  }

  onProductoClicked() {
    this.showElemList = false
    this.showInstitucionesList = false
    this.showInvestigadoresList = false
    this.showYearList = false
    this.showProductList = true
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

}
