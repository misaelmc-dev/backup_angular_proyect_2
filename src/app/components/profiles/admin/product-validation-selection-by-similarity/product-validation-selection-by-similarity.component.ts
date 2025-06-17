import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ValidationService} from "../../../../services/validation.service";
import Swal from "sweetalert2";
import {MessageService} from "../../../../services/message.service";

@Component({
  selector: 'app-product-validation-selection-by-similarity',
  templateUrl: './product-validation-selection-by-similarity.component.html',
  styleUrls: ['./product-validation-selection-by-similarity.component.css']
})
export class ProductValidationSelectionBySimilarityComponent implements OnInit, DoCheck {

  public mainProductId: number
  public mainProduct: any
  private _pageLoading: boolean
  public similarProducts: any
  private similarProductsLoaded = false
  private mainProductLoaded = false
  public products: any = null
  private productsToValidate: number[] = []

  constructor(public activatedRoute: ActivatedRoute,
              public validationService: ValidationService,
              public messageService: MessageService,
              public router: Router)
  {
    this.mainProductId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || '');
    this.productsToValidate.push(this.mainProductId)
  }

  getCoautoresNames (coautores: any) {
    if (coautores) {
      if (coautores instanceof Array) {
        return coautores.map((elem) => {
          if (typeof elem == 'string')
            return elem
          else
            return elem.nombre
        })
      } else
        return coautores
    } else
      return coautores
  }

  getFuenteName(fuente: any): string {
    if (fuente) {
      if (fuente instanceof Object)
        return fuente.titulo
      else
        return fuente
    } else
      return fuente
  }

  getMainProduct() {
    this.mainProductLoaded = false;
    this.validationService.getProductById(this.mainProductId.toString()).subscribe(
      (data: any) => {
        this.mainProduct = data;
        this.mainProductLoaded = true;
      },
      (err) => {
        console.error(err);
      },
    );
  }

  getSimilarProducts(): void {
    this.similarProductsLoaded = false;
    this.validationService.getSimilarValidatableProductsFrom(this.mainProductId).subscribe(
      (data: any) => {
        this.similarProducts = data;
        this.similarProductsLoaded = true;
      },
      (err) => {
        console.error(err);
      },
    );
  }

  ngOnInit(): void {
    this.getMainProduct()
    this.getSimilarProducts()
  }

  ngDoCheck(): void {
    this.pageLoading = !(this.mainProductLoaded && this.similarProductsLoaded)
    if (this.products == null && this.pageLoading == false) { //si no se ha llenado aún la lista de productos, llénala
      this.products = [this.mainProduct].concat(this.similarProducts)
    }
  }

  get pageLoading(): boolean {
    return this._pageLoading;
  }

  set pageLoading(value: boolean) {
    this._pageLoading = value;
  }

  onValidationCheckBoxChanged(target: any, prodId: number) {
    if (target.checked) {
      this.addToProductsToValidate(prodId)
    } else {
      this.deleteFromProductsToValidate(prodId)
    }
    //console.log('A validar: ', JSON.stringify(this.productsToValidate))
  }

  addToProductsToValidate(id: number) {
    if(this.productsToValidate.indexOf(id) === -1) {
      this.productsToValidate.push(id)
    }
  }

  deleteFromProductsToValidate (id: number) {
    let index = this.productsToValidate.indexOf(id)
    if(index !== -1) {
      this.productsToValidate = this.productsToValidate.filter((elem) => {
        return !(elem == id)
      })
    }
  }

  validateProducts() {

    Swal.fire({
      title: '¿Estás seguro de querer validar los productos seleccionados? Si lo hace, todos ellos tomarán forma '
        + 'de copia casi exacta (coautores se copian con los cambios necesarios según investigador) '
        + 'del original (citas incluidas) y quedarán validados en el sistema',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Sí, confirmo',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.validationService.validateProduct(this.mainProductId.toString(), true).subscribe(
          () => {
            this.messageService.showPopupMessage(
              'Felicitaciones',
              'La validación del producto base se ha realizado correctamente.',
              'success'
            );
              /*this.productsToValidate = this.productsToValidate.splice(this.productsToValidate.indexOf(this.mainProductId))
              console.log(this.mainProductId)
              console.log(this.productsToValidate)*/
              this.validationService.validateSimilarProducts(this.mainProductId, this.productsToValidate).subscribe(
                () => {
                  this.messageService.showPopupMessage(
                    'Felicitaciones',
                    'La validación se ha realizado correctamente.',
                    'success'
                  );
                  this.router.navigate(['admin/products']);
                },
                (err) => {
                  console.error(err);
                  this.messageService.showPopupMessage(
                    'Error',
                    'Se validó el producto base, pero ha ocurrido un error al validar los productos similares.',
                    'error'
                  );
                }
              )
          },
          (err) => {
            console.error(err);
            this.messageService.showPopupMessage(
              'Error',
              'Ha ocurrido un error al validar el producto base principal.',
              'error'
            );
          }
        );

      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })



  };

}
