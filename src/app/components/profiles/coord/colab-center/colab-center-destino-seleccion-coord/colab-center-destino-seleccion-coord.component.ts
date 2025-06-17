import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-colab-center-destino-seleccion-coord',
  templateUrl: './colab-center-destino-seleccion-coord.component.html',
  styleUrls: ['./colab-center-destino-seleccion-coord.component.css']
})
export class ColabCenterDestinoSeleccionCoordComponent implements OnInit {
  @Input() titulo: string = 'Sin título'
  @Input() tipoElementoOrigen: string = null
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
  @Output() backEvent = new EventEmitter<string>();

  shouldshowPais: boolean = false
  shouldshowInstitucion: boolean = false
  shouldshowInvestigador: boolean = false
  shouldshowAnio: boolean = false
  shouldshowProducto: boolean = false

  constructor() {}

  ngOnInit(): void {
    //console.log('tipoElem:['+this.tipoElementoOrigen+'] y id:[' + this.idElementoOrigen + ']')
  }

  goBack() {
    this.backEvent.emit('')
  }

  showPais() {
    this.shouldshowPais = true;
  }

  showInstitucion() {
    this.shouldshowInstitucion = true;
  }

  showInvestigador() {
    this.shouldshowInvestigador = true;
  }

  showAnio() {
    this.shouldshowAnio = true;
  }

  showProducto() {
    this.shouldshowProducto = true;
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

}
