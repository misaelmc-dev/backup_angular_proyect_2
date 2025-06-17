 import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ResearcherService} from "../../../../services/researcher.service";
import * as Highcharts from "highcharts";
import HighchartsNetworkgraph from "highcharts/modules/networkgraph";
import HighchartsExporting from "highcharts/modules/exporting";
import {CommonService} from "../../../../services/common.service";
import {ExportService} from "../../../../services/export.service";
import {ExcelJson} from "../../../../interfaces/excel-json";
import {ActivatedRoute} from "@angular/router";

HighchartsNetworkgraph(Highcharts);
HighchartsExporting(Highcharts);

@Component({
  selector: 'app-coauthors',
  templateUrl: './coauthors.component.html',
  styleUrls: ['./coauthors.component.css']
})
export class CoauthorsComponent implements OnInit, AfterViewInit {

  id!: string;

  data: any[] = [];
  nodes: any[] = [];
  coauthors: any;
  options: any;
  nombre!: string;
  total_prod!: string;
  total_prod_colab!: string;
  percent!: string;

  highcharts = Highcharts;

  criteria!: string;
  pageNumber = 1;
  pageSize = 6;
  totalItems = 0;
  paginationId = 'coauthorsPagination';
  responsive = true;

  dataSource: any[] = [];

  orderHeader: string = '';
  isDescending = false;

  showLoadingBar: boolean = false;

  fullScreen: boolean = false;

  constructor(private researcherService: ResearcherService,
              private commonService: CommonService,
              private exportService: ExportService,
              private activatedRoute: ActivatedRoute,) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    //this.table.offset = 5;
    //this.loadData();
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  sort(header: string) {
    this.orderHeader = header;
    this.isDescending = !this.isDescending;
  }

  loadData = () => {
    this.researcherService.getCoauthors(this.id).subscribe(
      (result: any) => {
        this.showLoadingBar = true;
        this.coauthors = result[0];
        this.nombre = this.coauthors.nombre;
        this.researcherService.getProductTypeTotals(this.id).subscribe(
          (data:any) => {
            this.total_prod = data.total;
            this.researcherService.getTotalesDeColaboracion(parseInt(this.id)).subscribe(
              (data2: any) => {
                this.total_prod_colab = data2[0].desglose[0].prods_en_colab
                let percent =
                  (data2[0].desglose[0].prods_en_colab * 100/ data.total);
                this.percent = percent.toString();
                this.coauthors.percent = percent;

                this.dataSource = this.coauthors.desglose;

                /*let pagination = this.commonService.paginateItems(this.coauthors.colabs, this.pageNumber, this.pageSize);
                this.dataSource = pagination.data;
                this.totalItems = pagination.total;*/

                for (let index = 0; index < this.coauthors.desglose.length; index++) {
                  const element = this.coauthors.desglose[index].desglose[0];
                  //console.log(element)
                  const name = element.nombre_inv_dest+':'+element.prods_en_colab;
                  let colab = [this.nombre, name];
                  //console.log(colab)
                  this.data.push(colab);
                  let colorNode = this.getColor(element.prods_en_colab);
                  this.nodes.push({
                    id: name,
                    marker: {
                      radius: element.prods_en_colab,
                    },
                    color: colorNode,
                  });
                }
                this.showLoadingBar = false;
              }, ()=>{},
              () => {
                this.drawChart();
              })
          })
      },
      (err) => {},
      () => {
      }
    );
  }

  loadPageData = () => {
    this.researcherService.getCoauthors(this.id).subscribe(
      (result: any) => {
        this.coauthors = result[0];
        this.nombre = this.coauthors.nombre;
        this.researcherService.getProductTypeTotals(this.id).subscribe(
          (data:any) => {
            this.total_prod = data.total
            this.researcherService.getTotalesDeColaboracion(parseInt(this.id)).subscribe(
              (data2: any) => {
                this.total_prod_colab = data2[0].desglose[0].prods_en_colab
                let percent =
                  (data2[0].desglose[0].prods_en_colab * 100) / this.coauthors.total_prod;
                this.percent = percent.toString();
                this.coauthors.percent = percent;

                let pagination = this.commonService.paginateItems(this.coauthors.desglose, this.pageNumber, this.pageSize);
                this.dataSource = pagination.data;
                this.totalItems = pagination.total;
              })
          })
      },
      (err) => {},
      () => {
        // this.drawChart();
      }
    );
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadPageData();
  }

  getColor(cant_colab: number): string {
    let color = '';
    switch (true) {
      case cant_colab >= 0 && cant_colab < 4:
        color = '#032B44';
        break;
      case cant_colab >= 4 && cant_colab < 8:
        color = '#081D58';
        break;
      case cant_colab >= 8 && cant_colab < 13:
        color = '#253494';
        break;
      case cant_colab >= 13 && cant_colab < 20:
        color = '#0047AB';
        break;
      case cant_colab >= 20 && cant_colab < 26:
        color = '#0065BD';
        break;
      case cant_colab >= 26 && cant_colab < 31:
        color = '#4682B4';
        break;
      case cant_colab >= 31 && cant_colab < 36:
        color = '#1ABC9C';
        break;
      case cant_colab >= 36 && cant_colab < 41:
        color = '#00BFFF';
        break;
      case cant_colab > 40:
        color = '#45B3FA';
        break;
    }
    return color;
  }

  drawChart() {
    var colors = Highcharts.getOptions().colors;
    this.options = {
      chart: {
        type: 'networkgraph',
      },
      title: {
        text: 'Coautoría',
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            enableSimulation: true,
            integration: 'verlet',
            linkLength: 100
          },
        },
      },
      series: [
        {
          // marker: {
          //   radius: 13,
          // },
          dataLabels: {
            enabled: true,
            linkFormat: '',
          },
          id: 'lang-tree',
          data: this.data,
          nodes: this.nodes
        },
      ],
      credits: {
        enabled: false
      }
    };
  }


  exportToExcel(): void {

    this.researcherService.getCoauthors(this.id).subscribe(
      (result: any) => {
        this.coauthors = result[0];
        this.nombre = this.coauthors.nombre;

        this.researcherService.getProductTypeTotals(this.id).subscribe(
          (data:any) => {
            this.total_prod = data.total;
            this.researcherService.getTotalesDeColaboracion(parseInt(this.id)).subscribe(
              (data2: any) => {
                this.total_prod_colab = data2[0].desglose[0].prods_en_colab;
                let percent =
                  (this.coauthors.total_prod_colab * 100) / this.coauthors.total_prod;
                this.percent = percent.toString();
                this.coauthors.percent = percent;
                const edata: Array<ExcelJson> = [];
                const udt: ExcelJson = {
                  data: [
                    {
                      A: 'Colaborador',
                      B: 'Colaboraciones',
                      C: 'Institución',
                      D: 'País'
                    }, // table header
                  ],
                  skipHeader: true,
                };
                this.coauthors.desglose.forEach((item: any) => {
                  udt.data.push({
                    A: item.desglose[0].nombre_inv_dest,
                    B: item.desglose[0].prods_en_colab,
                    C: item.desglose[0].nombre_institucion,
                    D: item.desglose[0].nombre_pais
                  });
                });
                edata.push(udt);
                this.exportService.exportJsonToExcel(edata, 'Colaboraciones_' + this.nombre);
            })
        })
      },
      (err) => {},
      () => {
        // this.drawChart();
      }
    );
  }





}
