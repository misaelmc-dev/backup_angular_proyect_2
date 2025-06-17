import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CollaborationService} from "../../../../../services/collaboration.service";

@Component({
  selector: 'app-colab-center-destino-producto-coord',
  templateUrl: './colab-center-destino-producto-coord.component.html',
  styleUrls: ['./colab-center-destino-producto-coord.component.css']
})
export class ColabCenterDestinoProductoCoordComponent implements OnInit {
  @Input() titulo: string = 'Productos'
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
  @Input() showBackButton: boolean = true //filtro de solo destino institucional
  @Input() filterSearchTerm: string = null //término de búsqueda para filtrar
  @Output() backEvent = new EventEmitter<string>();


  products: Array<any> = []; //datos de producto
  auxDataVar: Array<any> = []; //var auxiliar para ayudar a extraer datos
  currentPage: number //página seleccionada actual en la paginación

  constructor(private collaborationService: CollaborationService) {}

  ngOnInit(): void {
    //se añade el destino actual pq los destinos anteriores no tienen porque saber el que sigue
    this.tiposElementosDestino.push('productos')
    //se eliminan los duplicados en los destinos
    this.tiposElementosDestino = Array.from(new Set(this.tiposElementosDestino));
    this.loadInternalData()
  }

  loadInternalData() {
    this.collaborationService.getCollaborationData(
      this.tipoElementoOrigen,
      this.tiposElementosDestino,
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
    ).subscribe(
        (data: any) => {
          this.takeCleanAndOrderData(data)
        }
      )
  }

  gatherCleanData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
      if (item.desglose !== undefined) {
        this.gatherCleanData(item.desglose)
      } else {
        this.auxDataVar.push(
          JSON.stringify({
            titulo: item.titulo,
            anio: item.anio,
            doi: item.doi,
            url: item.url,
            prodsColab: item.prods_en_colab,
            colabsIndividuales: item.colabs_individuales
          })
        )
      }
    })
  }

  takeCleanAndOrderData(data: any) {
    this.gatherCleanData(data) // se reunen datos en formato texto
    this.auxDataVar = Array.from(new Set(this.auxDataVar)) // se filtran los duplicados en formato texto
    //se convierten los datos en objectos y se ordenan por título
    this.products = Array.from(this.auxDataVar, item => JSON.parse(item)).sort((item1, item2) => {
      return item1.titulo.toUpperCase().localeCompare(item2.titulo.toUpperCase())
    })
  }

  goBack() {
    this.backEvent.emit('')
  }

  handlePageChange(event: any) {
    this.currentPage = event;
    /*this.loadData();*/
  }
}
