import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ResearcherService} from "../../../../services/researcher.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ValidationService} from "../../../../services/validation.service";

@Component({
  selector: 'app-new-citation',
  templateUrl: './new-citation.component.html',
  styleUrls: ['./new-citation.component.css']
})
export class NewCitationComponent implements OnInit {

  newCitationFormGroup: FormGroup
  productId: string

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private validationService: ValidationService) {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id') // se toma el id de producto de la url
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  saveAndRedirect() {
    if (this.productId && this.newCitationFormGroup.controls.titulo.value) {
      const titulo = this.newCitationFormGroup.controls.titulo.value
      const idProducto = parseInt(this.productId)
      //console.log([titulo, idProducto])
      this.validationService.createCitation(titulo, idProducto).subscribe(
        (idCreado: any) => {
          this.redirectToValidation(idCreado)
        }
      )

    }
  }

  redirectToValidation(citationId: number) {
    this.router.navigate(['/admin/quote-validation/' + citationId])
  }

  public initializeForm() {
    this.newCitationFormGroup = new FormGroup({
      titulo: new FormControl(''),
    });
  }

}
