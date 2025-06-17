import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdviserService} from "../../../../services/adviser.service";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  coordId: any;
  projectId: any;
  projectData: any;
  responsable_tecnico = 'Responsable Técnico del Proyecto';
  institucion_financiera = 'Institución financiadora';
  colaboradores: any[] = [];
  productos: any[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private adviserService: AdviserService,
              private router: Router) {
    this.coordId = this.activatedRoute.snapshot.paramMap.get('id');
    this.projectId = this.activatedRoute.snapshot.paramMap.get('proyectId');
    if (!this.coordId) {
      this.coordId = 1;
    }
    if (!this.projectId) {
      this.projectId = 1;
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = () => {
    this.adviserService.getProjectDataById(this.projectId, this.coordId).subscribe((data: any) => {
      this.projectData = data;
    },
      (err: any) => {},
      () => {
        this.loadColaboradores();
        this.loadProductos();
        this.loadEntidadFinanciera();
        this.loadResponsableTecnico();
      });
  }

  loadColaboradores = () => {
    this.colaboradores = [];
    if (this.projectData.colaboradores){
      if (this.projectData.colaboradores.scintra && this.projectData.colaboradores.scintra.length > 0){
        this.colaboradores = this.colaboradores.concat(this.projectData.colaboradores.scintra);
      }
      if (this.projectData.colaboradores.no_scintra && this.projectData.colaboradores.no_scintra.length > 0){
        this.colaboradores = this.colaboradores.concat(this.projectData.colaboradores.no_scintra);
      }
    }
  }

  loadProductos = () => {
    this.productos = [];
    if (this.projectData.productos_scintra && this.projectData.productos_scintra.length > 0){
      this.productos = this.productos.concat(this.projectData.productos_scintra);
    }
    if (this.projectData.productos_no_scintra && this.projectData.productos_no_scintra.length > 0){
      this.productos = this.productos.concat(this.projectData.productos_no_scintra);
    }
  }

  loadEntidadFinanciera = () => {
    if (this.projectData.entidades_financiadoras && this.projectData.entidades_financiadoras.length > 0){
      this.institucion_financiera = this.projectData.entidades_financiadoras[0].institution_name;
    }
  }

  loadResponsableTecnico = () => {
    for (const item of this.colaboradores) {
      if(item.es_respons_tec){
        this.responsable_tecnico = item.nombre;
        break;
      }
    }
  }

  navigateBack = () => {
    this.router.navigate(['/coord', this.coordId, 'projects']);
  }

}
