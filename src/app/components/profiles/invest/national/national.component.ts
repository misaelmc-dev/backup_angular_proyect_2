import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CollaborationService} from "../../../../services/collaboration.service";
import {parseInt} from "lodash";
import {GlobalsVars} from "../../../../global/globals-vars";

@Component({
  selector: 'app-national',
  templateUrl: './national.component.html',
  styleUrls: ['./national.component.css']
})
export class NationalComponent implements OnInit {

  researchId!: string;
  url!: string;
  urlWithFilters: string
  startYear: string = null //filtro desde año tal
  endYear: string = null //filtro hasta año tal
  possibleStartYears: Array<number> = [] //años posibles para inicio del rango de años de filtro
  possibleEndYears: Array<number> = [] //años posibles para fin del rango de años de filtro

  constructor(
    private activatedRoute: ActivatedRoute,
    public collaborationService: CollaborationService,
    private globals: GlobalsVars
  ) {
    this.researchId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.url = `${this.globals.base_sig_url}/?solo_nacional&por_investigador&id_investigador=${this.researchId}`
    this.urlWithFilters = `${this.globals.base_sig_url}/?solo_nacional&por_investigador&id_investigador=${this.researchId}`
  }

  ngOnInit(): void {
    this.setPossibleStartYears(this.researchId) //se llenan los posibles valores para años de inicio de filtro
  }

  setPossibleStartYears(id: string) {
    this.collaborationService.getCollaborationData('investigadores', ['anios'],
      null, [parseInt(id)], null, null, null,
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

  loadMap() {
    //se toma el listado de años para filtrar en el mapa
    let yearsToFilterBy: Array<number> = []
    for (let i = parseInt(this.startYear); i <= parseInt(this.endYear); i++) {
      yearsToFilterBy.push(i)
      yearsToFilterBy = Array.from(new Set(yearsToFilterBy))
    }
    this.urlWithFilters = this.url + ('&anios_dest=' + yearsToFilterBy.join(' '))
    this.urlWithFilters = encodeURI(this.urlWithFilters)
  }

  onStartYearChanged() {
    this.setPossibleEndYears(this.startYear)
    this.loadMap()
  }
}
