import { Component, OnInit } from '@angular/core';
import {GraphSerieAnio, GraphSeries, GraphSerieTipo, GraphSerieVis} from "../../../../interfaces/graph-serie";
import * as Highcharts from "highcharts";
import {AdviserService} from "../../../../services/adviser.service";
import {ActivatedRoute} from "@angular/router";
import {SharedService} from "../../../../services/shared.service";
import * as _ from "lodash";
import {CommonService} from "../../../../services/common.service";


@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})

export class ResearchComponent implements OnInit {

  id!: any;

  visibilidad: any[] = [
    'todos',
    'doaj',
    'scopus',
    'jcr',
    'scielo',
    'conacyt',
    'otros',
  ];
  tiposProductos: any[] = [];
  colleges: any[] = [];
  campus: any[] = [];
  lineasInvestigacion: any[] = [];
  anios = [1, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

  highchartsOne = Highcharts;
  highchartsTwo = Highcharts;
  highchartsThree = Highcharts;
  highchartsFour = Highcharts;
  highchartsFive = Highcharts;
  highchartsSix = Highcharts;

  highchartsOneTitle = 'Producción Científica General'
  highchartsTwoTitle = 'Líneas de Investigación'
  highchartsThreeTitle = 'Productos por cuartiles Scopus'
  highchartsFourTitle = 'Productos por cuartiles Scopus'
  highchartsFiveTitle = 'Productos por cuartiles Scopus'
  highchartsSixTitle = 'Productos por cuartiles Scopus'

  optionsChartOne!: Highcharts.Options;
  chartOneCategories: any[] = [];
  chartOneSeries: any[] = [];
  showChartOne = false;
  serviceResult: any;
  chartOneGraphSeriesAnio: GraphSerieAnio[] = [];
  chartOneGraphSeriesTipo: GraphSerieTipo[] = [];
  chartOneGraphSeriesVisibilidad: GraphSerieVis[] = [];
  selectedChartOne!: any;
  updateFlagOne = false;
  selectedTipoGraphOne = '';
  selectedColegioGraphOne = '';
  selectedCampusGraphOne = '';
  chartOneCriteria = '';

  optionsChartTwo!: Highcharts.Options;
  chartTwoCategories: any[] = [];
  chartTwoSeries: any[] = [];
  showChartTwo = false;
  chartTwoGraphSeries: any[] = [];
  selectedChartTwo: any = 0;
  updateFlagTwo = false;
  chartTwoCriteria = '';
  chartTwoData: any;

  optionsChartThree!: Highcharts.Options;
  chartThreeSeries: any[] = [];
  showChartThree = false;
  yearSelected = '';

  optionsChartFour!: Highcharts.Options;
  chartFourCategories: any[] = [];
  chartFourSeries: any[] = [];
  showChartFour = false;
  serviceResultFour: any;
  chartFourGraphSeries: GraphSeries[] = [];
  selectedChartFour!: any;
  updateFlagFour = false;
  collegeSelectedGraph4 = '';
  campusSelectedGraph4 = '';

  optionsChartFive!: Highcharts.Options;
  chartFiveCategories: any[] = [];
  chartFiveSeries: any[] = [];
  showChartFive = false;
  chartFiveGraphSeries: GraphSeries[] = [];
  selectedType!: any;
  selectedVisibility!: any;
  selectedColegioGraphFive = '';
  selectedCampusGraphFive = '';
  updateFlagFive = false;

  optionsChartSix!: Highcharts.Options;
  chartSixCategories: any[] = [];
  chartSixSeries: any[] = [];
  showChartSix = false;
  updateFlagSix = false;
  collegeSelectedGraph6 = '';
  campusSelectedGraph6 = '';
  chartSixCriteria = '';

  colors: any = Highcharts.getOptions().colors;
  customColors = ['#7561cc', '#3cc6bb', '#f1b34a', '#ff4f00', '#5e84ca', '#003399']

  constructor(
    private adviserService: AdviserService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private commonService: CommonService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getColleges();
    this.loadLines();
    this.getBannerData();

    this.loadGraph1Data();
    this.loadGraph2Data();
    this.loadGraph3Data();
    this.loadGraph4Data();
    this.loadGraph5Data();
    this.loadGraph6Data();

  }

  getBannerData() {
    this.adviserService
      .getAdviserBannerData(this.id)
      .subscribe((result: any) => {
        this.sendEmitter({
          rol: 'adviser',
          id: this.id,
          nombreInstitucion: result.institution.nombre,
          rfc: result.institution.rfc,
          website: result.institution.website,
          url_logo: result.institution.url_foto,
          correoInstitucion: result.institution.correo,
        });
      });
  }

  sendEmitter(value: any) {
    this.sharedService.emitChange(value);
  }

  getColleges = () => {
    this.commonService.getColleges(this.id).subscribe(
      (result: any) => {
        this.colleges = result;
        this.getCampus();
      }
    );
  }

  getCampus = () => {
    this.commonService.getCampus(this.id).subscribe(
      (result: any) => {
        this.campus = result;
      }
    );
  }

  loadLines = () => {
    this.adviserService.getLinesByAdviser(this.id).subscribe(
      (result: any) => {
        this.lineasInvestigacion = result;
      },
      (err: any) => {},
      () => {
      }
    );
  }

  loadGraph1Data() {
    this.chartOneSeries = [];
    this.chartOneCategories = [];
    this.chartOneCriteria = `institucion/${this.id}/investigacion/graph1?por_tipo&id_colegio=${this.selectedColegioGraphOne}`
      + `&id_campus=${this.selectedCampusGraphOne}&por_anio`;
    this.adviserService.getGraph1Data(this.chartOneCriteria).subscribe(
      (result: any) => {
        this.highchartsOneTitle = 'Producción Científica General';
        if(this.selectedColegioGraphOne!=""){
          for(let col of this.colleges){
            if(this.selectedColegioGraphOne==col.id){ this.highchartsOneTitle +='<br>"'+ col.nombre +'"'; }
          }
        }
        if(this.selectedCampusGraphOne!=""){
          for(let camp of this.campus){
            if(this.selectedCampusGraphOne==camp.id){ this.highchartsOneTitle +='<br>"'+ camp.nombre +'"'; }
          }
        }
        this.anios = result.totalesPorAnio.map((elm: any) => elm.anio)
        this.serviceResult = result;
        this.chartOneGraphSeriesAnio = this.serviceResult.totalesPorAnio as GraphSerieAnio[];
        this.chartOneCategories = this.chartOneGraphSeriesAnio.map(
          (item) => item.anio
        );
        this.chartOneSeries.push({
          name: 'Totales por año',
          type: 'column',
          data: this.chartOneGraphSeriesAnio.map((item) => item.count),
          color: '#5e84ca'
        });
      },
      (err: any) => {},
      () => {
        this.initOptionsOne();
      }
    );
  }

  initOptionsOne() {
    this.optionsChartOne = {
      title: {
        text: this.highchartsOneTitle,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      xAxis: [
        {
          categories: this.chartOneCategories,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          title: {
            text: 'Productos',
          },
        },
      ],
      tooltip: {
        shared: true,
      },
      series: this.chartOneSeries,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
    };
    this.showChartOne = true;
  }

  loadGraph2Data() {
    this.chartTwoCategories = [];
    this.chartTwoSeries = [];
    this.chartTwoCriteria = `institucion/${this.id}/investigacion/graph2`;
    if(this.selectedChartTwo!=0){ this.chartTwoCriteria += `?lineas=${this.selectedChartTwo}`;}
    this.adviserService.getGraph2Data(this.chartTwoCriteria).subscribe(
      (result: any) => {
        this.chartTwoGraphSeries = result.porLinea as GraphSeries[];
        let categories: any[] = [];
        let item = this.chartTwoGraphSeries[0];
        this.selectedChartTwo = item.id_l
        this.highchartsTwoTitle = 'Línea de investigación <br>"'+ item.nomb_l +'"';
        let index = this.chartTwoGraphSeries.indexOf(item);
        categories = categories.concat(item.cont.map((item: any) => item.anio));
        this.chartTwoSeries.push({
          name: item.nomb_l,
          data: item.cont.map((item: any) => item.count),
          color: '#ff4f00',
        });

        this.chartTwoCategories = _(categories).sort().value();
        this.chartTwoCategories = _.compact(_.uniq(categories));
        //console.log(this.chartTwoCategories);
      },
      (err: any) => {},
      () => {
        this.initOptionsTwo();
      }
    );
  }

  initOptionsTwo() {
    this.optionsChartTwo = {
      title: {
        text: this.highchartsTwoTitle,
      },
      chart: {
        type: "spline"
      },
      plotOptions: {
        spline: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      xAxis: [
        {
          categories: this.chartTwoCategories,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          title: {
            text: 'Productos',
          },
        },
      ],
      tooltip: {
        shared: true,
      },
      series: this.chartTwoSeries,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
    };
    this.showChartTwo = true;
  }

  loadGraph3Data() {
    const criteria = `institucion/${this.id}/investigacion/graph3`;
    this.adviserService.getGraph3Data(criteria).subscribe(
      (result: any) => {
        this.chartThreeSeries = Object.entries(result).map(([k, v]) => [
          k.charAt(0).toUpperCase() + k.slice(1),
          v,
        ]);
      },
      (err: any) => {},
      () => {
        this.initOptionsThree();
      }
    );
  }

  onGraph3YearChange() {
    const criteria = `institucion/${this.id}/investigacion/graph3?anioDesde=${this.yearSelected}&anioHasta=${this.yearSelected}`;
    this.adviserService.getGraph3Data(criteria).subscribe(
      (result: any) => {
        this.chartThreeSeries = Object.entries(result).map(([k, v]) => [
          k.charAt(0).toUpperCase() + k.slice(1),
          v,
        ]);
        this.optionsChartThree.series = this.chartThreeSeries;
        this.highchartsThreeTitle = 'Productos por cuartiles Scopus';
        this.highchartsThreeTitle = (this.highchartsThreeTitle + ' ' + this.yearSelected)
        this.updateFlagOne = true;
      },
      (err: any) => {
        console.error(err)
      },
      () => {
        this.initOptionsThree();
      }
    );
  }

  initOptionsThree() {
    this.optionsChartThree = {
      chart: {
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: this.highchartsThreeTitle
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          colors: this.customColors,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: '',
          data: this.chartThreeSeries,
        },
      ],
    };
    this.showChartThree = true;
  }

  loadGraph4Data() {
    var criteria = `institucion/${this.id}/investigacion/graph4?por_anio&por_linea&por_visibilidad&por_campus?`;
    if(this.collegeSelectedGraph4!=""){ criteria += `&id_colegio=${this.collegeSelectedGraph4}`;}
    if(this.campusSelectedGraph4!=""){ criteria += `&id_campus=${this.campusSelectedGraph4}`;}
    this.adviserService.getGraph4Data(criteria).subscribe(
      (result: any) => {
        this.serviceResultFour = result;
        let chartFourGraphSeriesAnio = this.serviceResultFour.totalesPorAnio;
        this.highchartsFourTitle = 'Núcleo científico';
        if(this.collegeSelectedGraph4!=""){
          for(let col of this.colleges){
            if(this.collegeSelectedGraph4==col.id){ this.highchartsFourTitle +='<br>"'+ col.nombre +'"'; }
          }
        }
        if(this.campusSelectedGraph4!=""){
          for(let camp of this.campus){
            if(this.campusSelectedGraph4==camp.id){ this.highchartsFourTitle +='<br>"'+ camp.nombre +'"'; }
          }
        }
        this.chartFourCategories = chartFourGraphSeriesAnio.map((item: any) => item.anio);
        this.chartFourSeries.push({
          name: 'Totales por año',
          type: 'column',
          data: chartFourGraphSeriesAnio.map((item: any) => item.count),
          color: '#3cc6bb',
        });
      },
      (err: any) => {},
      () => {
        this.initOptionsFour();
      }
    );
  }

  initOptionsFour() {
    this.optionsChartFour = {
      title: {
        text: this.highchartsFourTitle,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      xAxis: [
        {
          categories: this.chartFourCategories,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          title: {
            text: 'Investigadores activos',
          },
        },
      ],
      tooltip: {
        shared: true,
      },
      series: this.chartFourSeries,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
    };
    this.showChartFour = true;
  }

  loadGraph5Data() {
    this.chartFiveSeries = [];
    this.chartFiveCategories = [];
    this.adviserService.getGraph5ProdYearByVisibility(this.id, Number.parseInt(this.selectedColegioGraphFive),
      Number.parseInt(this.selectedCampusGraphFive)).subscribe(
      (result: any) => {

        let obj = Object.entries(result);
        let keys = Object.keys(result);
        let values = []
        for(let [key, value] of obj) {
          if (key.length > 0){
            values.push(value);
          }
        }

        let doaj = values.map((item: any) => item.doaj);
        let scopus = values.map((item: any) => item.scopus);
        let jcr = values.map((item: any) => item.jcr);
        let conacyt = values.map((item: any) => item.conacyt);
        let scielo = values.map((item: any) => item.scielo);
        let otros = values.map((item: any) => item.otros);

        this.chartFiveCategories = keys;

        this.highchartsFiveTitle = 'Visibilidad';
        if(this.selectedColegioGraphFive!=""){
          for(let col of this.colleges){
            if(this.selectedColegioGraphFive==col.id){ this.highchartsFiveTitle +='<br>"'+ col.nombre +'"'; }
          }
        }
        if(this.selectedCampusGraphFive!=""){
          for(let camp of this.campus){
            if(this.selectedCampusGraphFive==camp.id){ this.highchartsFiveTitle +='<br>"'+ camp.nombre +'"'; }
          }
        }

        this.chartFiveSeries.push({
          name: 'Doaj',
          type: 'column',
          data: doaj,
          color: this.customColors[0]
        });

        this.chartFiveSeries.push({
          name: 'Scopus',
          type: 'column',
          data: scopus,
          color: this.customColors[1]
        });

        this.chartFiveSeries.push({
          name: 'JCR',
          type: 'column',
          data: jcr,
          color: this.customColors[2]
        });

        this.chartFiveSeries.push({
          name: 'Conacyt',
          type: 'column',
          data: conacyt,
          color: this.customColors[3]
        });

        this.chartFiveSeries.push({
          name: 'Scielo',
          type: 'column',
          data: scielo,
          color: this.customColors[4]
        });

        this.chartFiveSeries.push({
          name: 'Otros',
          type: 'column',
          data: otros,
          color: this.customColors[5]
        });

      },
      (err: any) => {},
      () => {
        this.initOptionsFive();
      }
    );
  }

  initOptionsFive() {
    this.optionsChartFive = {
      title: {
        text: this.highchartsFiveTitle,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        },
      },
      xAxis: [
        {
          categories: this.chartFiveCategories,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          title: {
            text: 'Productos',
          },
        },
      ],
      tooltip: {
        shared: true,
      },
      series: this.chartFiveSeries,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
    };
    this.showChartFive = true;
  }


  loadGraph6Data() {
    this.chartSixCategories = [];
    this.chartSixSeries = [];
    this.chartSixCriteria = `institucion/${this.id}/ranking/graph3?`;
    if(this.collegeSelectedGraph6!=""){ this.chartSixCriteria += `&id_colegio=${this.collegeSelectedGraph6}`;}
    if(this.campusSelectedGraph6!=""){ this.chartSixCriteria += `&id_campus=${this.campusSelectedGraph6}`;}
    this.adviserService.getRankingProductivesResearcherFilter(this.chartSixCriteria).subscribe(
      (result: any) => {
        this.highchartsSixTitle = 'Ranking (solo los últimos 3 años)';
        if(this.collegeSelectedGraph6!=""){
          for(let col of this.colleges){
            if(this.collegeSelectedGraph6==col.id){ this.highchartsSixTitle +='<br>"'+ col.nombre +'"'; }
          }
        }
        if(this.campusSelectedGraph6!=""){
          for(let camp of this.campus){
            if(this.campusSelectedGraph6==camp.id){ this.highchartsSixTitle +='<br>"'+ camp.nombre +'"'; }
          }
        }
        this.chartSixCategories = result.map(
          (item: any) => item.nombre
        );
        this.chartSixSeries.push({
          name: 'Publicaciones',
          type: 'bar',
          data: result.map((item: any) => item.cant_prod),
          color: '#f1b34a',
        });

      },
      (err: any) => {},
      () => {
          this.initOptionsSix();
      }
    );
  }

  loadGraph6DataCollege() {
    this.chartSixCategories = [];
    this.chartSixSeries = [];
    this.chartSixCriteria = `institucion/${this.id}/ranking/graph3?id_colegio=${this.collegeSelectedGraph6}&id_campus=${this.campusSelectedGraph6}`;
    this.adviserService.getRankingProductivesResearcherFilter(this.chartSixCriteria).subscribe(
      (result: any) => {

        this.chartSixCategories = result.map(
          (item: any) => item.nombre
        );
        this.chartSixSeries.push({
          name: 'Publicaciones',
          type: 'bar',
          data: result.map((item: any) => item.cant_prod),
        });

        this.optionsChartSix.xAxis = [];
        this.optionsChartSix.xAxis.push({
          categories: this.chartSixCategories,
          crosshair: true,
        });
        this.optionsChartSix.series = this.chartSixSeries;
        this.updateFlagSix = true;

      },
      (err: any) => {},
      () => {
        // this.initOptionsSix();
      }
    );
  }

  initOptionsSix() {
    this.optionsChartSix = {
      title: {
        text: this.highchartsSixTitle,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },

      },
      xAxis: [
        {
          categories: this.chartSixCategories,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          title: {
            text: 'Productos',
          },
          allowDecimals: false
        },
      ],
      tooltip: {
        shared: true,
      },
      series: this.chartSixSeries,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
    };
    this.showChartSix = true;
  }

}
