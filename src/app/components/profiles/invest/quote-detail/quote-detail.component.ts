import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SharedService} from "../../../../services/shared.service";
import {ResearcherService} from "../../../../services/researcher.service";
import {ValidationService} from "../../../../services/validation.service";

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.css']
})
export class QuoteDetailComponent implements OnInit {

  researchId!: any;
  productId!: any;
  correo!: string;
  orcid_id!: string;
  cargo!: string;
  url_foto!: string;
  nombre!: string;

  constructor(private activatedRoute: ActivatedRoute,
              private sharedService: SharedService,
              private researcherService: ResearcherService,
              private validationService: ValidationService) {
    this.researchId = this.activatedRoute.snapshot.paramMap.get('id');
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
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
    });
  }

  sendEmitter(value: any) {
    this.sharedService.emitChange(value);
  }

}
