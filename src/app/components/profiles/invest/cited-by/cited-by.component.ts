import { Component, OnInit } from '@angular/core';
import {map, tap} from "rxjs/operators";
import {Quote, QuotePageable} from "../../../../interfaces/quote";
import {QuoteService} from "../../../../services/quote.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ValidationService} from "../../../../services/validation.service";

@Component({
  selector: 'app-cited-by',
  templateUrl: './cited-by.component.html',
  styleUrls: ['./cited-by.component.css']
})
export class CitedByComponent implements OnInit {

  metadata!: QuotePageable;
  quoteData: Quote[] = [];
  id: any;
  productId: any;
  title = '';
  showLoadingBar: boolean = false;

  filter = '';
  criteria!: string;
  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'citedByPagination';
  responsive = true;

  constructor(
    private quotesService: QuoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    // this.getProductData();
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.criteria = `productos/${this.productId}/citas?s=${encodeURIComponent(this.filter)}&page=${this.pageNumber}&page_size=${this.pageSize}`;
    this.quotesService
      .getQuotesByProductId(this.criteria)
      .pipe(
        /*tap((result: any) => console.log(result)),*/
        map((result: any) => {
          this.metadata = result;
          this.quoteData = this.metadata.data;
          this.totalItems = this.metadata.total;
        })
      )
      .subscribe((response: any) => {
      });
  }

  onPaginateChange(event: any): void {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;

    this.quotesService
      .getPagedQuotesByProduct(this.productId, page)
      .pipe(
        map((result: any) => {
          this.metadata = result;
          this.quoteData = this.metadata.data;
        })
      )
      .subscribe();
  }

  getProductData(): void {
    this.validationService
      .getProductById(this.productId)
      .subscribe((result: any) => {
        this.title = result.titulo;
      });
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadQuotes();
  }

}
