import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CollaborationService} from "../../../../../services/collaboration.service";

@Component({
  selector: 'app-colab-center-destino-investigador-coord',
  templateUrl: './colab-center-destino-investigador-coord.component.html',
  styleUrls: ['./colab-center-destino-investigador-coord.component.css']
})
export class ColabCenterDestinoInvestigadorCoordComponent implements OnInit {
  @Input() titulo: string = ''
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

  investigadores: Array<any> = []; //arreglo de investigadores
  showElemList: boolean;
  selectedInvestigadorIdAuxiliar: string //id auxiliar seleccionado al hacer clic
  selectedInvestigadorNombre: string //nombre seleccionado al hacer clic
  currentPage: number //página seleccionada actual en la paginación

  constructor(private collaborationService: CollaborationService) { }

  ngOnInit(): void {
    //se añade el destino actual pq los destinos anteriores no tienen porque saber el que sigue
    this.tiposElementosDestino.push('investigadores')
    //se eliminan los duplicados en los destinos
    this.tiposElementosDestino = Array.from(new Set(this.tiposElementosDestino));
    this.loadInternalData()
    this.showElemList = true
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
        //console.log(data)
        this.gatherCleanData(data)
      }
    )
  }

  gatherCleanData(data: any) { // recursivamente llega y recolecta los datos necesarios
    data.forEach((item: any) => {
      if (item.desglose !== undefined) {
        this.gatherCleanData(item.desglose)
      } else {
        this.investigadores.push(
          {
            idAuxiliar: item.id_auxiliar,
            nombre: item.nombre_inv_dest,
            orcid: item.orcid_inv_dest,
            institucion: item.nombre_institucion,
            prodsColab: item.prods_en_colab,
            colabsIndividuales: item.colabs_individuales
          }
        )
      }
    })
  }

  onBackEventReceived() {
    this.showElemList = true;
  }

  onElementClicked(idAuxiliar: string, nombre: string) {
    this.selectedInvestigadorIdAuxiliar = idAuxiliar
    this.selectedInvestigadorNombre = nombre
    this.showElemList = false
    //console.log('click en ' + id)
  }

  goBack() {
    this.backEvent.emit('')
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

  handlePageChange(event: any) {
    this.currentPage = event;
    /*this.loadData();*/
  }
}
