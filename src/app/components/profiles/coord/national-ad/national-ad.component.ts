import { Component, OnInit } from '@angular/core';
import {EstadisticsService} from "../../../../services/scicom/estadistics.service";
import {AdviserService} from "../../../../services/adviser.service";
import {ActivatedRoute} from "@angular/router";
import {CollaborationService} from "../../../../services/collaboration.service";
import {parseInt} from "lodash";
import {GlobalsVars} from "../../../../global/globals-vars";
import Swal from "sweetalert2";

@Component({
  selector: 'app-national-ad',
  templateUrl: './national-ad.component.html',
  styleUrls: ['./national-ad.component.css']
})
export class NationalAdComponent implements OnInit {

  id!: any;
  url!: string;
  urlWithFilters: string
  startYear: string = null //filtro desde año tal
  endYear: string = null //filtro hasta año tal
  possibleStartYears: Array<number> = [] //años posibles para inicio del rango de años de filtro
  possibleEndYears: Array<number> = [] //años posibles para fin del rango de años de filtro
  colegioOrigen: number = null //colegio para filtrar
  lineaOrigen: number = null //línea de investigación origen para filtrar
  possibleColegios: Array<any> = [] //colegios posibles {id, nombre} para filtrar
  possibleLineas: Array<any> = [] //líneas de investigación posibles {id, nombre} para filtrar

  campusOrigen: number = null
  campusList:any[]=[];

  constructor(private activatedRoute: ActivatedRoute,
              public estadisticService: EstadisticsService,
              public collaborationService: CollaborationService,
              private globals: GlobalsVars) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.url = `${this.globals.base_sig_url}/?solo_nacional&por_institucion&id_institucion=${this.id}`
    this.urlWithFilters = `${this.globals.base_sig_url}/?solo_nacional&por_institucion&id_institucion=${this.id}`
  }

  ngOnInit(): void {
    this.setPossibleStartYears(this.id) //se llenan los posibles valores para años de inicio de filtro
    this.setPossibleColegios(this.id) //se llenan los posibles valores para filtrar por colegio
    this.setPossibleLineas(this.id) //se llenan los posibles valores para filtrar por línea de investigación
    this.loadCampusList()
  }

  setPossibleStartYears(id: string) {
    this.collaborationService.getCollaborationData('instituciones', ['anios'],
      [parseInt(id)], null, null, null, null,
      null, null, null, null, true,
      null, null).subscribe(
      //tod ok
      (collabsData: any) => {
        collabsData[0].desglose.forEach((collabsDataDesgloseItem: any) => {
          this.possibleStartYears.push(collabsDataDesgloseItem.anio)
          this.possibleStartYears = Array.from(new Set(this.possibleStartYears))
          this.startYear = Math.min.apply(Math, this.possibleStartYears).toString()
        })
        this.setPossibleEndYears(this.startYear)
      }
    )
  }

  setPossibleEndYears(startYear: string){
    let sYear = parseInt(startYear)
    this.possibleEndYears = [];
    let nextYear = (new Date()).getFullYear() + 1;
    for (let index = sYear; index < nextYear ; index++) {
      this.possibleEndYears.push(index);
    }
    this.endYear = ((new Date()).getFullYear()).toString();
  }

  setPossibleColegios(id: string) {
    this.collaborationService.getCollaborationData('colegios', null,
      [parseInt(id)], null, null, null, null,
      null, null, null, null, true,
      null, null).subscribe(
      //tod ok
      (collabsData: any) => {
        collabsData.forEach((collabsDataItem: any) => {
          this.possibleColegios.push({id: collabsDataItem.id, nombre: collabsDataItem.nombre})
        })
      }
    )
  }

  setPossibleLineas(id: string) {
    this.collaborationService.getCollaborationData('lineas', null,
      [parseInt(id)], null, null, null, null,
      null, null, null, null, true,
      null, null).subscribe(
      //tod ok
      (collabsData: any) => {
        collabsData.forEach((collabsDataItem: any) => {
          this.possibleLineas.push({id: collabsDataItem.id, nombre: collabsDataItem.nombre})
        })
      }
    )
  }

  loadMap() {
    //se toma el listado de años para filtrar en el mapa
    let yearsToFilterBy: Array<number> = []
    for (let i = parseInt(this.startYear); i <= parseInt(this.endYear); i++) {
      yearsToFilterBy.push(i)
      yearsToFilterBy = Array.from(new Set(yearsToFilterBy))
    }
    this.urlWithFilters = this.url + ('&anios_dest=' + yearsToFilterBy.join(' '))
    // @ts-ignore
    if (this.colegioOrigen && this.colegioOrigen != 'null')
      this.urlWithFilters += ('&colegios_orig=' + this.colegioOrigen)
    // @ts-ignore
    if (this.lineaOrigen && this.lineaOrigen != 'null')
      this.urlWithFilters += ('&lineas_orig=' + this.lineaOrigen)
    if (this.campusOrigen)
      this.urlWithFilters += ('&campus_orig=' + this.campusOrigen)
    this.urlWithFilters = encodeURI(this.urlWithFilters)
  }

  onStartYearChanged() {
    this.setPossibleEndYears(this.startYear)
    this.loadMap()
  }

  loadCampusList(){
    this.estadisticService.getCampusList(this.id).subscribe((resCamp:any) => {
      this.campusList=resCamp
    }, (err:any) =>{
      Swal.fire({icon: 'error',text: 'Error al cargar las participaciones'});
      console.error(err)
    });
  }

}
