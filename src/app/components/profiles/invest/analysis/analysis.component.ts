import { Component, OnInit } from '@angular/core';
import {ProductPageable} from "../../../../interfaces/product-research";
import {ResearcherService} from "../../../../services/researcher.service";
import {ActivatedRoute} from "@angular/router";
import {SharedService} from "../../../../services/shared.service";

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

  researcherId!: string;
  metadata!: any;
  criteria = '';

  dataSource: any[] = [];
  correo!: string;
  orcid_id!: string;
  cargo!: string
  url_foto!: string;
  nombre!: string;

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'analysisPagination';
  responsive = true;

  constructor(
    private researcherService: ResearcherService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.researcherId = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.getDataLayout();
    this.loadAllData();
  }

  sendEmitter(value: any) {
    this.sharedService.emitChange(value);
  }

  getDataLayout(): void {
    this.researcherService.getResearcherBannerData(this.researcherId).subscribe((data: any) => {
      this.correo = data.correo;
      this.orcid_id = data.orcid_id;
      this.cargo = data.cargo;
      this.url_foto = data.url_foto;
      this.nombre = data.nombre;
      this.sendEmitter({
        rol: 'researcher',
        id: this.researcherId,
        correo: this.correo,
        orcid_id: this.orcid_id,
        cargo: this.cargo,
        url_foto: this.url_foto,
        nombre: this.nombre,
      });
    });
  }

  loadAllData = () => {
    this.criteria = `investigador/${this.researcherId}/productos?page=${this.pageNumber}&page_size=${this.pageSize}`;
    this.researcherService
      .getProductByResearcher(this.criteria)
      .subscribe((result: any) => {
        this.metadata = result;
        this.dataSource = this.metadata.data;
        this.loadCoautores()
        this.totalItems = this.metadata.total;
      });
  };

  loadCoautores(){
    for(let ds of this.dataSource){
      ds.coautores_ordenados = ds.coautores_ordenados.sort((a:any,b:any)=>a.orden-b.orden);
      let auxCoautores = ds.coautores_ordenados;
      auxCoautores = auxCoautores.filter((item:any) => item.orden != null)
      for(let co of ds.coautores_ordenados){
        if(co.orden==null){ auxCoautores.push(co) }
      }
      ds.coautores_ordenados = auxCoautores;
    }
    //console.log("this.dataSource",this.dataSource)
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadAllData();
  }


}
