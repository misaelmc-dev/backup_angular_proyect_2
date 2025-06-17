import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResearcherService } from 'src/app/services/researcher.service';
import { SharedService } from 'src/app/services/shared.service';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-quotes-report',
  templateUrl: './quotes-report.component.html',
  styleUrls: ['./quotes-report.component.css']
})
export class QuotesReportComponent implements OnInit {

  highchartsOne = Highcharts;
  highchartsTwo = Highcharts;
  highchartsThree = Highcharts;
  highchartsFour = Highcharts;

  showChartOne = false;
  showChartTwo = false;
  showChartThree = false;
  showChartFour = false;

  researchId: string;
  categoryOne: any[] = [];
  dataOne: any[] = [];
  optionsOne!: Highcharts.Options;
  categoryTwo: any[] = [];
  dataTwoDoc: any[] = [];
  dataTwoQuotes: any[] = [];
  optionsTwo!: Highcharts.Options;
  categoryThree: any[] = [];
  dataThree: any[] = [];
  optionsThree!: Highcharts.Options;
  categoryFour: any[] = [];
  dataFour: any[] = [];
  optionsFour!: Highcharts.Options;
  years: any[] = [];

  correo!: string;
  orcid_id!: string;
  cargo!: string
  url_foto!: string;
  nombre!: string;

  constructor(
    private researcherService: ResearcherService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.researchId = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.getDataLayout();
  }

  getDataLayout(): void {
    this.researcherService.getResearcherBannerData(this.researchId).subscribe((data: any) => {
      this.correo = data.correo;
      this.orcid_id = data.orcid_id;
      this.cargo = data.cargo;
      this.url_foto = data.url_foto;
      this.nombre = data.nombre;
      this.sendEmitter({
        rol: 'researcher',
        id: this.researchId,
        correo: this.correo,
        orcid_id: this.orcid_id,
        cargo: this.cargo,
        url_foto: this.url_foto,
        nombre: this.nombre,
      });
    }, () => {}, () => {
      this.loadAll();
    });
  }

  sendEmitter(value: any) {
    this.sharedService.emitChange(value);
  }

  loadAll() {
    this.researcherService.getChartTotals(this.researchId).subscribe(
      (result: any) => {
        let yearsCitas = _.map(result.citas.totalesPorAnio, 'anio');
        let yearsProductos = _.map(result.productos.totalesPorAnio, 'anio');
        let mergedArray = yearsCitas.concat(yearsProductos);
        //console.log('Merged',mergedArray);

        let uniques = _.uniqBy(mergedArray, Math.floor);
        //console.log('Uniques',uniques);

        this.years = _.sortBy(uniques);
        //console.log('Years',this.years);

        for (
          let index = 0;
          index < result.citas.totalesPorTipo.length;
          index++
        ) {
          const element = result.citas.totalesPorTipo[index];
          this.categoryOne.push(element.tipo);
          this.dataOne.push(element.count);
        }

        for (
          let index = 0;
          index < result.citasA.totalesPorTipo.length;
          index++
        ) {
          const element = result.citasA.totalesPorTipo[index];
          this.categoryThree.push(element.tipo);
          this.dataThree.push(element.count);
        }

        for (
          let index = 0;
          index < result.citasB.totalesPorTipo.length;
          index++
        ) {
          const element = result.citasB.totalesPorTipo[index];
          this.categoryFour.push(element.tipo);
          this.dataFour.push(element.count);
        }

        for (let i = 0; i < this.years.length; i++) {
          const year = this.years[i];
          this.categoryTwo.push(year);

          let itemCita = _.find(result.citas.totalesPorAnio, { anio: year });

          if (itemCita) {
            this.dataTwoQuotes.push(itemCita.count);
          }else{
            this.dataTwoQuotes.push(0);
          }

          let itemDoc= _.find(result.productos.totalesPorAnio, { anio: year });

          if (itemDoc) {
            this.dataTwoDoc.push(itemDoc.count);
          }else{
            this.dataTwoDoc.push(0);
          }

        }
      },
      (err) => {},
      () => {
        this.initOptionsOne();
        this.initOptionsTwo();
        this.initOptionsThree();
        this.initOptionsFour();
      }
    );
  }

  initOptionsOne() {
    this.optionsOne = {
      title: {
        text: 'Tipología Citante - ' + this.nombre,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
          color: '#7561cc'
        },
      },
      xAxis: {
        categories: this.categoryOne,
      },
      yAxis: {
        title: {
          text: 'Cantidad',
        },
      },
      series: [
        {
          name: 'Producto',
          data: this.dataOne,
          type: 'column',
        },
      ],
      legend: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
    };
    this.showChartOne = true;
  }

  initOptionsThree() {
    this.optionsThree = {
      title: {
        text: 'Citas A - ' + this.nombre,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
          color: '#f1b34a'
        },
      },
      xAxis: {
        categories: this.categoryThree,
      },
      yAxis: {
        title: {
          text: 'Cantidad',
        },
      },
      series: [
        {
          name: 'Tipos',
          data: this.dataThree,
          type: 'column',
        },
      ],
      legend: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
    };
    this.showChartThree = true;
  }

  initOptionsFour() {
    this.optionsFour = {
      title: {
        text: 'Citas B - ' + this.nombre,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
          color: '#3cc6bb'
        },
      },
      xAxis: {
        categories: this.categoryFour,
      },
      yAxis: {
        title: {
          text: 'Cantidad',
        },
      },
      series: [
        {
          name: 'Tipos',
          data: this.dataFour,
          type: 'column',
        },
      ],
      legend: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
    };
    this.showChartFour = true;
  }

  initOptionsTwo() {
    this.optionsTwo = {
      title: {
        text: 'Documentos/Citas por año - ' + this.nombre,
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
          categories: this.years,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: 'Citas',
          },
        },
        {
          // Secondary yAxis
          title: {
            text: 'Documentos',
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
      },
      series: [
        {
          name: 'Citas',
          type: 'column',
          data: this.dataTwoQuotes,
          color: '#5e84ca'
        },
        {
          name: 'Documentos',
          type: 'column',
          yAxis: 1,
          data: this.dataTwoDoc,
          color: '#003399'
        },
      ],
      legend: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
    };
    this.showChartTwo = true;
  }

}
