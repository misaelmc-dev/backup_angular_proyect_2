import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import {SharedService} from "../../../../services/shared.service";
import {ActivatedRoute} from "@angular/router";
import {ResearcherService} from "../../../../services/researcher.service";

@Component({
  selector: 'app-sci-prod',
  templateUrl: './sci-prod.component.html',
  styleUrls: ['./sci-prod.component.css']
})
export class SciProdComponent implements OnInit {

  id!: string;

  categoryQuote: any[] = [];
  categoryProduct: any[] = [];
  dataQuote: any[] = [];
  dataProduct: any[] = [];
  optionProductChart: any;
  showChartProduct = false;
  optionQuoteChart: any;
  showChartQuote = false;

  highchartsProduct = Highcharts;
  highchartsQuotes = Highcharts;

  constructor(
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private researcherService: ResearcherService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
  }

}
