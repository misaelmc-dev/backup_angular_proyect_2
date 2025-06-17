import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "../../../../services/shared.service";
import {AdviserService} from "../../../../services/adviser.service";
import {forEach} from "lodash";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  id!: any;
  ranked: any[] = [];
  rankingProd = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private adviserService: AdviserService,
    private router: Router
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    /*if (!this.id) {
      this.id = 1
    }*/
    this.getRanked();
  }

  ngOnInit(): void {
  }

  getRanked() {
    if (this.rankingProd) {
      this.getRankingProductivesResearcher();
    } else {
      this.getRankingImpactResearcher();
    }
  }

  getRankingProductivesResearcher() {
    this.rankingProd = true;
    this.adviserService
      .getRankingProductivesResearcher(this.id)
      .subscribe((result: any) => {
        this.ranked = result;
      });
  }

  getRankingImpactResearcher() {
    this.rankingProd = false;
    this.adviserService
      .getRankingImpactResearcher(this.id)
      .subscribe((result: any) => {
        this.ranked = result;
      });
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
