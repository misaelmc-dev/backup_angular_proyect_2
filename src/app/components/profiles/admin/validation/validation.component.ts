import { Component, OnInit } from '@angular/core';
import {Product} from "../../../../interfaces/product";
import {ValidationService} from "../../../../services/validation.service";
import {Router} from "@angular/router";
import {MessageService} from "../../../../services/message.service";
import {CommonService} from "../../../../services/common.service";
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import {map} from "rxjs/operators";
import {parseInt} from "lodash";
import {parse} from "@angular/compiler/src/render3/view/style_parser";


@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  dataSource!:any;
  validationData: Product[] = [];
  selectedId: any;
  showLoadingBar: boolean = false;

  filterTitle = '';
  filterInvest = '';
  filterYear = '';
  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'validationPagination';
  responsive = true;
  criteria!: string;
  investList: any[] = [];
  yearList: any[] = [];
  muestraValidados: boolean //determina si deben mostrarse solo validados, o solo sin validar

  constructor(
    private validationService: ValidationService,
    private router: Router,
    private messageService: MessageService,
    private commonService: CommonService,
  ) {
    this.muestraValidados = false;
  }

  ngOnInit(): void {
    this.showLoadingBar = true;
    this.loadInvestigadores();
    this.loadValidations();
  }

  loadValidations(): void {
    this.showLoadingBar = true
    this.criteria = `validacion/productos/pendientes?s=${encodeURIComponent(this.filterTitle)}&i=${encodeURIComponent(this.filterInvest)}&anioDesde=${this.filterYear}&anioHasta=${this.filterYear}`;
    if (this.muestraValidados)
      this.criteria = `validacion/validados/productos?anios=${encodeURIComponent(this.filterYear)}&search=${encodeURIComponent(this.filterTitle)}&idsInvestigadores=${encodeURIComponent(this.filterInvest)}`
    this.validationService.getAllValidations(this.criteria).subscribe(
      (validations: any) => {
        this.validationData = validations;
        let pagination = this.commonService.paginateItems(this.validationData, this.pageNumber, this.pageSize);
        this.dataSource = pagination.data;
        //console.log(this.dataSource)
        this.totalItems = pagination.total;
        this.loadYearsValidations();
      },
      (err) => {
        //console.log(err);
      },
      () => {
        this.showLoadingBar = false;
      }
    );
  }

  loadYearsValidations(): void {
    this.criteria = `validacion/productos/pendientes?s=${encodeURIComponent(this.filterTitle)}&i=${encodeURIComponent(this.filterInvest)}`;
    if (this.muestraValidados)
      this.criteria = `myzone/productos?no_paginate=&search=${encodeURIComponent(this.filterTitle)}&idsInvestigadores=${encodeURIComponent(this.filterInvest)}`
    this.validationService.getAllValidations(this.criteria)
      .subscribe((data: any) => {
        this.yearList =  _(data).map('anio').uniq().sort().value();
      });

  }

  loadInvestigadores(): void {
    this.commonService.getInvestigadoresList().subscribe(
      (res: any) => {
        this.investList = res;
      },
      (err) => {
        //console.log(err);
      },
      () => {
      }
    );
  }

  deleteProduct(productId: string): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar el siguiente producto?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.showLoadingBar = true;
        this.validationService.deleteProduct(productId).subscribe(
          (data: any) => {
            this.loadValidations();
            this.messageService.showPopupMessage(
              'Se ha eliminado el producto correctamente.',
              'check_circle',
              'success'
            );
          },
          (err) => {
            console.error(err);
            this.messageService.showPopupMessage(
              'Error',
              'Ha ocurrido un error al eliminar el producto.',
              'error'
            );
          },
          () => {
            this.showLoadingBar = false;
          }
        );

      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })


  }

  invalidateProduct(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de desvalidar el producto?' +
        '\n Esto desvalidará todos los campos del producto, así como ' +
        'todas sus citas, pero no eliminará ningún dato. Tranquil@',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.showLoadingBar = true;
        this.validationService.invalidateProduct(id).subscribe(
          (data: any) => {
            this.messageService.showPopupMessage(
              'Se ha desvalidado el producto correctamente.',
              'check_circle',
              'success'
            );
            this.loadValidations();
          },
          (err) => {
            console.error(err);
            this.messageService.showPopupMessage(
              'Error',
              'Ha ocurrido un error al desvalidar el producto.',
              'error'
            );
          },
          () => {
            this.showLoadingBar = false;
          }
        );

      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  redirectToForm(id: string): void {
    this.router.navigate(['admin/validation-form', id]);
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadValidations();
  }

}
