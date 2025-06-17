import {Component, Input, OnInit} from '@angular/core';
import {CollaborationService} from "../../../../../services/collaboration.service";

@Component({
  selector: 'app-colab-center-origen-investigador-coord',
  templateUrl: './colab-center-origen-investigador-coord.component.html',
  styleUrls: ['./colab-center-origen-investigador-coord.component.css']
})
export class ColabCenterOrigenInvestigadorCoordComponent implements OnInit {
  @Input() titulo: string = 'Sin título'
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

  selectedElemId: number //id de elemento seleccionado al hacer clic
  internalColabsData: any[] //datos de colaboración interna
  showElemList: boolean;
  currentPage: number //página seleccionada actual en la paginación

  constructor(private collaborationService: CollaborationService) {}

  ngOnInit(): void {
    this.loadInternalData()
    this.showElemList = true;
  }

  loadInternalData() {
    this.collaborationService.getCollaborationData(
      'investigadores',
      null,
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
    )
      .subscribe(
        (data: any) => {
          this.internalColabsData = data;
        }
      )
  }

  onElementClicked(id: number, name: string) {
    //todo hacer algo con el evento
    this.titulo = name
    this.selectedElemId = id
    this.showElemList = false
    //console.log('click en ' + id)
  }

  onBackEventReceived() {
    this.showElemList = true;
  }

  newObjectReference(object: object) {
    return JSON.parse(JSON.stringify(object))
  }

  handlePageChange(event: any) {
    this.currentPage = event;
    /*this.loadData();*/
  }
}
