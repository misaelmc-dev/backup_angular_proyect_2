import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ResearcherService} from "../../../../services/researcher.service";
import * as Highcharts from 'highcharts';
import * as _ from "lodash";


@Component({
  selector: 'app-home-res',
  templateUrl: './home-res.component.html',
  styleUrls: ['./home-res.component.css']
})
export class HomeResComponent implements OnInit {

  id!: string;
  researcherName = '';
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
    private activatedRoute: ActivatedRoute,
    private researcherService: ResearcherService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadReasearcherData()
  }

  loadChartsData = () => {
    this.researcherService.getChartTotals(this.id).subscribe(
      (result: any) => {
        let sorted = _.sortBy(result.citas.totalesPorAnio, 'anio');

        let length = sorted.length;
        for (let index = 0; index < length; index++) {
          const element = sorted[index];
          this.categoryQuote.push(element.anio);
          this.dataQuote.push(element.count);
        }

        let sortedProducts = _.sortBy(result.productos.totalesPorAnio, 'anio');
        let quoteLength = sortedProducts.length;
        for (let index = 0; index < quoteLength; index++) {
          const element = sortedProducts[index];
          this.categoryProduct.push(element.anio);
          this.dataProduct.push(element.count);
        }
      },
      (err) => {},
      () => {
        this.initOptionsProducts();
        this.initOptionsQuotes();
      }
    );
  };

  loadReasearcherData = () => {
    this.researcherService.getResearcherBannerData(this.id).subscribe(
      (data: any) => {
        this.researcherName = data.nombre;
      }, () => {
        console.warn('No se pudo recuperar nombre de institución de coordinador')
      }, () => {
        this.loadChartsData();
      }
    )
  }

  initOptionsProducts() {
    this.optionProductChart = {
      title: {
        text: 'Productos por años - ' + this.researcherName,
      },
      xAxis: {
        categories: this.categoryProduct,
      },
      yAxis: {
        title: {
          text: null,
        },
        visible: false,
      },
      series: [
        {
          showInLegend: false,
          name: 'Productos',
          data: this.dataProduct,
          type: 'column',
          color: '#5e84ca'
        },
      ],
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            /*format: '{point.y:.1f}%'*/
            format: '{point.y}'
          }
        }
      }
    };
    this.showChartProduct = true;
  }

  initOptionsQuotes() {
    this.optionQuoteChart = {
      title: {
        text: 'Citas por años - ' + this.researcherName,
      },
      xAxis: {
        categories: this.categoryQuote,
      },
      yAxis: {
        title: {
          text: null,
        },
        visible: false,
      },
      series: [
        {
          showInLegend: false,
          name: 'Citas',
          data: this.dataQuote,
          type: 'column',
          color: '#3cc6bb'
        },
      ],
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            /*format: '{point.y:.1f}%'*/
            format: '{point.y}'
          }
        }
      }
    };
    this.showChartQuote = true;
  }

}
