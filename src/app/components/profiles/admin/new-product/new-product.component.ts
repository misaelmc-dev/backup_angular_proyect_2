import { Component, OnInit } from '@angular/core';
import {ResearcherService} from "../../../../services/researcher.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {ValidationService} from "../../../../services/validation.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  researcherList: Array<any> = [] //lista de posibles investigadores
  newProductFormGroup: FormGroup

  constructor(private researcherService: ResearcherService,
              private router: Router,
              private validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm()
    this.loadResearcherList()
  }

  loadResearcherList() {
    this.researcherService.getResearcherList(null, this.newProductFormGroup.controls.filtroInvestigador.value)
      .subscribe(
      (data: any) => {
      this.researcherList = data
        //console.log(data)
    })
  }

  saveAndRedirect() {
    if (this.newProductFormGroup.controls.titulo.value && this.newProductFormGroup.controls.investigador.value) {
      const titulo = this.newProductFormGroup.controls.titulo.value
      const idInvestigador = this.newProductFormGroup.controls.investigador.value
      this.validationService.createProduct(titulo, idInvestigador).subscribe(
        (idCreado: any) => {
          this.redirectToValidation(idCreado)
        }
      )

    }
  }

  redirectToValidation(productId: number) {
    this.router.navigate(['/admin/validation-form/' + productId])
  }

  public initializeForm() {
    this.newProductFormGroup = new FormGroup({
      titulo: new FormControl(''),
      investigador: new FormControl('0'),
      filtroInvestigador: new FormControl('')
    });
  }
}
