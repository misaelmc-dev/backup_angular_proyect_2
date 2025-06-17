import { Component, OnInit } from '@angular/core';
import {GraphSerieAnio, GraphSeries} from "../../../../interfaces/graph-serie";
import {AdviserService} from "../../../../services/adviser.service";
import {ActivatedRoute} from "@angular/router";
import {SharedService} from "../../../../services/shared.service";
import * as Highcharts from "highcharts";
import {CommonService} from "../../../../services/common.service";
import * as _ from "lodash";

@Component({
  selector: 'app-impact-dashboard',
  templateUrl: './impact-dashboard.component.html',
  styleUrls: ['./impact-dashboard.component.css']
})
export class ImpactDashboardComponent implements OnInit {

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
  years: any[] = [];
  lineas: any[] = [];
  campus: any[] = [];

  highchartsOne = Highcharts;
  highchartsTwo = Highcharts;
  highchartsThree = Highcharts;
  highchartsFour = Highcharts;

  optionsChartOne!: Highcharts.Options;
  chartOneCategories: any[] = [];
  chartOneSeries: any[] = [];
  showChartOne = false;
  selectedColegioGraphOne = 0;
  selectedCampusGraphOne = 0;
  updateFlagOne = false;

  optionsChartTwo!: Highcharts.Options;
  chartTwoCategories: any[] = [];
  chartTwoSeries: any[] = [];
  showChartTwo = false;
  chartTwoGraphSeries: GraphSeries[] = [];
  selectedChartTwo: any = 0;
  updateFlagTwo = false;
  lineasInvestigacion: any[] = [];
  lineasInvestigacionSimples: any[] = [];

  optionsChartThree!: Highcharts.Options;
  chartThreeCategories: any[] = [];
  chartThreeSeries: any[] = [];
  showChartThree = false;
  serviceResultThree: any;
  updateFlagThree = false;
  selectedColegioGraphThree = ''
  selectedCampusGraphThree = ''

  optionsChartFour!: Highcharts.Options;
  chartFourCategories: any[] = [];
  chartFourSeries: any[] = [];
  showChartFour = false;
  updateFlagFour = false;
  collegeSelectedGraph4 = '';
  campusSelectedGraph4 = '';

  highchartsOneTitle = 'Impacto global'
  highchartsTwoTitle = 'Líneas de Investigación'
  highchartsTreeTitle = 'Relación Citas y Productos'
  highchartsFourTitle = 'Ranking (solo los últimos 3 años)'

  colors: any = Highcharts.getOptions().colors;

  constructor(
    private adviserService: AdviserService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private commonService: CommonService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getBannerData();
    this.loadLines();
    this.loadYears();
    this.getColleges();
    this.getProductTypes();
  }

  getBannerData() {
    this.adviserService
      .getAdviserBannerData(this.id)
      .subscribe((result: any) => {
        this.loadCampus();
        this.sendEmitter({
          rol: 'adviser',
          id: this.id,
          nombreInstitucion: result.institution.nombre,
          rfc: result.institution.rfc,
          website: result.institution.website,
          url_logo: result.institution.url_foto,
          correoInstitucion: result.institution.correo
        });
      });
  }

  getColleges = () => {
    this.commonService.getColleges(this.id).subscribe(
      (result: any) => {
        this.colleges = result;
        this.loadCampus();
      }
    );
  }

  getProductTypes = () => {
    this.commonService.getTipoProductos().subscribe(
      (result: any) => {
        this.tiposProductos = result;
      }
    );
  }

  sendEmitter(value: any) {
    this.sharedService.emitChange(value);
  }

  loadLines() {
    this.adviserService
      .getLinesByAdviser(this.id)
      .subscribe((result: any) => {
        this.lineasInvestigacion = result;
        this.lineasInvestigacionSimples = result;
        this.loadGraph2Data();
      });
  }

  loadCampus() {
    this.adviserService
      .getCampusByAdviser(this.id)
      .subscribe((result: any) => {
        this.campus = result;
        this.loadGraph1Data();
        this.loadGraph3Data();
        this.loadGraph6Data();
      });
  }

  loadYears() {
    this.adviserService
      .getYearsByAdviser(this.id)
      .subscribe((result: any) => {
        this.years = result;
      });
  }

  loadGraph1Data() {
    this.chartOneSeries = [];
    this.chartOneCategories = [];
    var criteria = `institucion/${this.id}/impacto/graph1?por_anio&por_tipo&por_visibilidad`;
    if(this.selectedColegioGraphOne!=0){ criteria += `&id_colegio=${this.selectedColegioGraphOne}`;}
    if(this.selectedCampusGraphOne!=0){ criteria += `&id_campus=${this.selectedCampusGraphOne}`;}
    this.adviserService.getImpactGraph1(criteria).subscribe(
      (result: any) => {
        this.highchartsOneTitle = 'Impacto global';
        if(this.selectedColegioGraphOne!=0){
          for(let col of this.colleges){
            if(this.selectedColegioGraphOne==col.id){ this.highchartsOneTitle +='<br>"'+ col.nombre +'"'; }
          }
        }
        if(this.selectedCampusGraphOne!=0){
          for(let camp of this.campus){
            if(this.selectedCampusGraphOne==camp.id){ this.highchartsOneTitle +='<br>"'+ camp.nombre +'"'; }
          }
        }
        this.chartOneCategories = result.totalesPorAnio.map(
          (item: any) => item.anio
        );
        this.chartOneSeries.push({
          name: 'Totales por año',
          type: 'column',
          data: result.totalesPorAnio.map((item: any) => item.count),
          color: '#7561cc'
        });
      },
      (err: any) => {},
      () => {
        this.initOptionsOne();
      }
    );
  }

  loadGraph2Data() {
    this.lineasInvestigacion = [];
    this.chartTwoCategories = [];
    this.chartTwoSeries = [];
    this.adviserService.getImpactGraph2Data(this.id).subscribe(
      (result: any) => {
        this.chartTwoGraphSeries = result.porLinea as GraphSeries[];
        let categories: any[] = [];
        let item = this.chartTwoGraphSeries[0];
        this.selectedChartTwo = item.id_l
        this.highchartsTwoTitle = 'Línea de investigación <br>"'+ item.nomb_l +'"'
        let index = this.chartTwoGraphSeries.indexOf(item);
        categories = categories.concat(item.cont.map((item) => item.anio));
        this.chartTwoSeries.push({
          name: item.nomb_l,
          data: item.cont.map((item) => item.count),
          color: '#ff4f00'
        });

        this.adviserService.getAniosProductivos(this.id).subscribe((anios: any)=>{
          this.chartTwoCategories = anios;
        },
          (err: any) => {},
          () => {
            this.initOptionsTwo();
          });

      }
    );
  }

  onSelectLineaInvestigacionChange() {
    this.chartTwoCategories = [];
    this.chartTwoSeries = [];
    let id = parseInt(this.selectedChartTwo);
    this.adviserService.getImpactGraph2Data(this.id).subscribe(
      (result: any) => {

        let series = result.porLinea.find((x: any) => x !== undefined && x.id_l == id)
        //let series = result.porLinea as GraphSeries[];
        let categories: any[] = ['No hay datos'];
        let item = []
        if (series) {
          item = series.cont.filter((item: any) => item.anio !== null);
          categories = item.map((item: any) => item.anio);
        }
        //console.log(JSON.stringify(series))
        var auxNombre = '';
        for(let li of this.lineasInvestigacionSimples){
          if(li.id==this.selectedChartTwo){
            auxNombre=li.nombre;
          }
        }

        this.chartTwoSeries.push({
          name: auxNombre,
          data: item.length > 0 ? item.map((obj: any) => obj.count) : [0],
          color: this.colors[0],
        });
        this.highchartsTwoTitle = 'Línea de investigación <br>"'+ auxNombre +'"'
        this.chartTwoCategories = _(categories).sort().value();
        this.chartTwoCategories = _.compact(_.uniq(categories));
        this.optionsChartTwo.xAxis = [];
        this.optionsChartTwo.xAxis.push({
          categories: this.chartTwoCategories,
          crosshair: true,
        });
        this.optionsChartTwo.series = this.chartTwoSeries;
        this.updateFlagTwo = true;
      },
      (err: any) => {},
      () => {
        this.initOptionsTwo();
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
            text: 'Citas',
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

  initOptionsTwo() {
    this.optionsChartTwo = {
      chart: {
        type: 'spline',
      },
      title: {
        text: this.highchartsTwoTitle,
      },
      plotOptions: {
        spline: {
          dataLabels: {
            enabled: true
          },
        }
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
            text: 'Citas',
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
    this.chartThreeCategories = [];
    this.chartThreeSeries = [];
    this.adviserService.getImpactGraph3Data(this.id, Number.parseInt(this.selectedColegioGraphThree),
      Number.parseInt(this.selectedCampusGraphThree)).subscribe(
      (result: any) => {
        let prodCriteria = `institucion/${this.id}
          /investigacion/graph1?por_tipo=&por_anio&por_visibilidad&anioDesde=2012`;
        if(this.selectedColegioGraphThree!=""){ prodCriteria += `&id_colegio=${this.selectedColegioGraphThree}`;}
        if(this.selectedCampusGraphThree!=""){ prodCriteria += `&id_campus=${this.selectedCampusGraphThree}`;}
        this.adviserService.getGraph1Data(prodCriteria).subscribe(
          (prod: any) => {
            this.highchartsTreeTitle = 'Relación Citas y Productos';
            if(this.selectedColegioGraphThree!=""){
              for(let col of this.colleges){
                if(this.selectedColegioGraphThree==col.id){ this.highchartsTreeTitle +='<br>"'+ col.nombre +'"'; }
              }
            }
            if(this.selectedCampusGraphThree!=""){
              for(let camp of this.campus){
                if(this.selectedCampusGraphThree==camp.id){ this.highchartsTreeTitle +='<br>"'+ camp.nombre +'"'; }
              }
            }
            this.serviceResultThree = result;
            let chartThreeGraphSeriesAnio = this.serviceResultThree.totalesPorAnio;
            this.chartThreeCategories = chartThreeGraphSeriesAnio.map(
              (item: any) => item.anio
            );
            //this.chartThreeCategories = prod.totalesPorAnio.map((item: any) => item.anio)
            this.chartThreeCategories = Array.from( new Set(this.chartThreeCategories.concat(prod.totalesPorAnio.map((item: any) => item.anio)))).sort()
            let citasData = []
            let prodsData = []
            for(let year of this.chartThreeCategories) {
              let citaSerie = result.totalesPorAnio.filter((value: any) => value.anio == year).pop()
              let citasCount = (citaSerie != undefined) ? citaSerie.count : 0
              let prodSerie = prod.totalesPorAnio.filter((value: any) => value.anio == year).pop()
              let prodCount = (prodSerie != undefined) ? prodSerie.count : 0
              citasData.push(citasCount)
              prodsData.push(prodCount)
            }
            //let yearsList = this.newObjectReference(this.chartThreeCategories)
            this.chartThreeSeries.push({
              name: 'Citas',
              type: 'column',
              data: citasData,
              color: '#5e84ca'
            });
            let prodResult = prod;
            let chartOneGraphSeriesAnio = prodResult.totalesPorAnio as GraphSerieAnio[];
            this.chartThreeSeries.push({
              name: 'Productos',
              type: 'column',
              data: prodsData,
              color: '#003399'
            });
          },
          (err: any) => {},
          () => {
            this.initOptionsThree();
          }
        );

      },
      (err: any) => {},
      () => {
        //this.initOptionsThree();
      }
    );
  }

  loadGraph6Data() {
    this.chartFourCategories = [];
    this.chartFourSeries = [];
    this.adviserService.getRankingImpactResearcher(this.id).subscribe(
      (result: any) => {
        this.chartFourCategories = result.map(
          (item: any) => item.nombre
        );
        this.chartFourSeries.push({
          name: 'Citas',
          type: 'bar',
          data: result.map((item: any) => item.cant_citas),
          color: '#3cc6bb'
        });

      },
      (err: any) => {},
      () => {
        this.initOptionsFour();
      }
    );
  }

  loadGraph6DataCollege() {
    this.chartFourCategories = [];
    this.chartFourSeries = [];
    let chartFourCriteria = `institucion/${this.id}/ranking/graph4?`;
    if(this.collegeSelectedGraph4!=""){ chartFourCriteria += `&id_colegio=${this.collegeSelectedGraph4}`;}
    if(this.campusSelectedGraph4!=""){ chartFourCriteria += `&id_campus=${this.campusSelectedGraph4}`;}
    this.adviserService.getRankingImpactResearcherFilter(chartFourCriteria).subscribe(
      (result: any) => {
        this.highchartsFourTitle = 'Ranking (solo los últimos 3 años)';
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
        this.chartFourCategories = result.map(
          (item: any) => item.nombre
        );
        this.chartFourSeries.push({
          name: 'Ranking',
          type: 'bar',
          data: result.map((item: any) => item.cant_citas),
        });

        this.optionsChartFour.xAxis = [];
        this.optionsChartFour.xAxis.push({
          categories: this.chartFourCategories,
          crosshair: true,
        });
        this.optionsChartFour.series = this.chartFourSeries;
        this.updateFlagFour = true;

      },
      (err: any) => {},
      () => {
        this.initOptionsFour();
      }
    );
  }

  initOptionsThree() {
    this.optionsChartThree = {
      title: {
        text: this.highchartsTreeTitle,
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
          categories: this.chartThreeCategories,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          title: {
            text: 'Citas/Productos',
          },
        },
      ],
      tooltip: {
        shared: true,
      },
      series: this.chartThreeSeries,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
      },
    };
    this.showChartThree = true;
  }

  initOptionsFour() {
    this.optionsChartFour = {
      title: {
        text: this.highchartsFourTitle,
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
          categories: this.chartFourCategories,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          title: {
            text: 'Citas',
          },
          allowDecimals: false
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

}
