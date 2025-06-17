import { Component, OnInit } from '@angular/core';
import {AdviserService} from "../../../../services/adviser.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-search-adv',
  templateUrl: './search-adv.component.html',
  styleUrls: ['./search-adv.component.css']
})
export class SearchAdvComponent implements OnInit {

  id!: any;
  researchers: any[] = [];
  searchCriteria = '';

  constructor(private adviserService: AdviserService,
              private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    if (!this.id) {
      this.id = 1
    }
  }

  findResearcher() {
    if (this.searchCriteria.length > 2){
      this.adviserService
        .findResearcher(this.id, this.searchCriteria)
        .subscribe((result: any) => {
          this.researchers = result;
        });
    }else {
      this.researchers = [];
    }
  }

  getGoogleScholar(listaRedes: Array<any>) {
    for (let i = 0; i < listaRedes.length; i++) {
      if (listaRedes[i].url.includes('scholar.google')) {
        return listaRedes[i].url;
      }
    }
    return null;
  }

  getLinkedIn(listaRedes: Array<any>) {
    for (let i = 0; i < listaRedes.length; i++) {
      if (listaRedes[i].url.includes('linkedin.com/')) {
        return listaRedes[i].url;
      }
    }
    return null;
  }

  getResearchGate(listaRedes: Array<any>) {
    for (let i = 0; i < listaRedes.length; i++) {
      if (listaRedes[i].url.includes('researchgate.net/')) {
        return listaRedes[i].url;
      }
    }
    return null;
  }

  getMendeley(listaRedes: Array<any>) {
    for (let i = 0; i < listaRedes.length; i++) {
      if (listaRedes[i].url.includes('mendeley.com/')) {
        return listaRedes[i].url;
      }
    }
    return null;
  }

  getOrcid(listaRedes: Array<any>) {
    for (let i = 0; i < listaRedes.length; i++) {
      if (listaRedes[i].url.includes('orcid.org/')) {
        return listaRedes[i].url;
      }
    }
    return null;
  }

}
