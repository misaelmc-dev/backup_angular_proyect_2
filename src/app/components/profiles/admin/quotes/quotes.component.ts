import { Component, OnInit } from '@angular/core';
import {Quote} from "../../../../interfaces/quote";
import {ValidationService} from "../../../../services/validation.service";
import {QuoteService} from "../../../../services/quote.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "../../../../services/message.service";

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {

  dataSource: any;
  quoteData: any[] = [];
  productId: any;
  title = '';
  showLoadingBar: boolean = false;

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'quotePagination';
  responsive = true;
  criteria!: string;
  filter = '';

  constructor(
    private validationService: ValidationService,
    private quotesService: QuoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getProductData();
    this.loadQuotes();
  }

  loadQuotes(): void {
    if (this.productId) {
      this.validationService.getUnvalidatedQuotesByProductId(parseInt(this.productId)).subscribe((quotes: any) => {
        this.quoteData = quotes as Quote[];
      });
    }
  }

  getProductData() : void {
    this.validationService.getProductById(this.productId).subscribe((result: any) => {
      this.title = result.titulo;
    });
  }

  deleteQuote(quoteId: number) : void {
    let idQuote = quoteId.toString();
    this.quotesService.deleteQuote(idQuote).subscribe((data: any) => {
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'Se ha eliminado la cita correctamente.',
          'success'
        );
        this.getProductData();
        this.loadQuotes();
      }, (err)=>{
        console.error(err);
        this.messageService.showPopupMessage('Ha ocurrido un error al eliminar la cita.', 'error', 'red');
      },
      ()=>{});
  }

  /*openConfirmationDeleteDialog(quote_id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDeleteComponent, {
      width: '300px',
      data: { id: quote_id , type: 'cita'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status === 'ok') {
        this.deleteQuote(quote_id);
      }
    });
  }*/

  redirectToForm(): void {
    this.router.navigate(['/admin_valform',  this.productId]);
  }

  redirectToQuotesForm(id: string): void {
    this.router.navigate(['/quote', id]);
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadQuotes();
  }

}
