import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {Source} from "../../../../interfaces/source";
import {CatalogsService} from "../../../../services/catalogs.service";
import {QuoteService} from "../../../../services/quote.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "../../../../services/message.service";
import {map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import {toString} from "lodash";

@Component({
  selector: 'app-quote-validation',
  templateUrl: './quote-validation.component.html',
  styleUrls: ['./quote-validation.component.css']
})
export class QuoteValidationComponent implements OnInit {

  quote_id: any;
  is_product = false;
  title = '';
  quoteData: any;
  quoteDataSaved: any;
  productTypes: any[] = [];
  sources: any[] = [];
  selectedSourceId = '';
  filteredSourcesOptions!: Observable<Source[]>;
  filteredPublisherOptions!: Observable<string[]>;
  quoteFormBuilder: FormBuilder = new FormBuilder();
  quoteForm = this.quoteFormBuilder.group({
    titulo: new FormControl(''),
    doi: new FormControl(''),
    url: new FormControl(''),
    anio: new FormControl(''),
    autocita_autor: new FormControl(''),
    autocita_journal: new FormControl(''),
    in_scopus: new FormControl(''),
    in_jcr: new FormControl(''),
    source_title: new FormControl(''),
    issne: new FormControl(''),
    issni: new FormControl(''),
    source_volume: new FormControl(''),
    source_issue: new FormControl(''),
    source_page: new FormControl(''),
    journal: new FormControl(''),
    tipo: new FormControl(''),
    in_scielo: new FormControl(''),
    in_conacyt: new FormControl(''),
    in_doaj: new FormControl('')
  });
  coautoresDS: any[] = [];
  selectedSource : Source = {
    id: 0,
    titulo: '',
    publisher: '',
    rights_uri: '',
  };
  coauthorsReady = false;
  textCriteria = '';
  filter = '';
  criteria = '';
  sourceFormGroup: FormGroup //formGroup del formulario de búsqueda de fuentes

  fuenteDepredadora:boolean=false;

  guardarCoautores:boolean=false;

  constructor(
    private catalogsService: CatalogsService,
    private quoteService: QuoteService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    /*public dialog: MatDialog*/
  ) {}

  ngOnInit() {
    this.quote_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadProductTypes();
  }

  private _filterSources(value: string): Source[] {
    const filterValue = value.toLowerCase();
    return this.sources.filter(option => option.titulo.toLowerCase().indexOf(filterValue) === 0);
  }


  loadProductTypes(): void {
    this.catalogsService.getAllProductsTypes().subscribe((result: any) => {
      this.productTypes = result;
      //this.quoteForm.controls.tipo.setValue('Article');
      this.getQuoteData();
    });
  }

  getQuoteData(): void {
    this.quoteService.getQuoteById(this.quote_id).subscribe(
      (data: any) => {
        this.quoteData = data;
        this.quoteDataSaved = data;
        //console.log("this.quoteData",this.quoteData);
        this.selectedSourceId = this.quoteData.fuente
        this.title = this.quoteData.titulo;
        this.quoteForm = this.quoteFormBuilder.group({
          titulo: new FormControl(this.quoteData.titulo),
          doi: new FormControl(this.quoteData.DOI),
          url: new FormControl(this.quoteData.url),
          anio: new FormControl(this.quoteData.anio),
          autocita_autor: new FormControl(this.quoteData.autocita_autor),
          autocita_journal: new FormControl(this.quoteData.autocita_journal),
          in_scopus: new FormControl(this.quoteData.in_scopus),
          in_jcr: new FormControl(this.quoteData.in_jcr),
          source_title: new FormControl(this.quoteData.source_title),
          issne: new FormControl(''),
          issni: new FormControl(''),
          source_volume: new FormControl(this.quoteData.source_volume),
          source_issue: new FormControl(this.quoteData.source_issue),
          source_page: new FormControl(this.quoteData.source_page),
          journal: new FormControl(this.quoteData.journal),
          tipo: new FormControl(this.quoteData.idTipo),
          in_scielo: new FormControl(this.quoteData.in_scielo),
          in_conacyt: new FormControl(this.quoteData.in_conacyt),
          in_doaj: new FormControl(this.quoteData.in_doaj),
        });
        this.quoteForm.controls.tipo.setValue((this.quoteData.idTipo) ? this.quoteData.idTipo : 0);
        if (this.quoteData.fuente) {
          this.quoteForm.controls.source_title.setValue(this.quoteData.fuente.titulo);
          this.catalogsService.getSourceById(this.quoteData.fuente.id).subscribe((resSour: any) => {
            if(resSour.length > 0){
              this.quoteForm.controls.issne.setValue(resSour[0].issn_e)
              this.quoteForm.controls.issni.setValue(resSour[0].issn_i)
              this.selectedSourceId = toString(this.selectedSource.id)
              this.selectedSource.id = this.quoteData.fuente.id
              this.fuenteDepredadora = resSour[0].depredadora;
            }
          });
        }

      },
      (err) => {
        console.error(err)
      },
      () => {}
    );
  }

  onSelectSource() {
    if(this.selectedSource.id!=0){
      //console.log("this.selectedSource",this.selectedSource)
      const source = this.sources.find(value => { return value.id == this.selectedSource.id})
      this.quoteForm.controls.source_title.setValue(source.titulo);
      this.quoteForm.controls.issne.setValue(source.issn_e);
      this.quoteForm.controls.issni.setValue(source.issn_i);
    }
  }

  loadSourcesByCriteria(): void {
    if (this.textCriteria.length > 1) {
      this.catalogsService
        .getSearchSources(this.textCriteria)
        .subscribe((response: any) => {
          this.sources = response;
          //console.log(this.sources);
        });
    } else {
      this.messageService.showPopupMessage(
        'Pocos caracteres',
        'Debe entrar más de 1 caracter para realizar la búsqueda.',
        'error'
      );
    }
  }

  formatIssn(titulo:string,issn_e:string,issn_i:string){
    //console.log("this.sourcesList",this.sources)
    var tit:string = "";
    if((issn_e===null || issn_e==="") && (issn_i===null || issn_i==="")){
      tit = titulo
    }else if((issn_e!==null || issn_e!=="") && (issn_i===null || issn_i==="")){
      tit = titulo +"  [ "+issn_e+" ]"
    }else if((issn_e===null || issn_e==="") && (issn_i!==null || issn_i!=="")){
      tit = titulo +"  [ "+issn_i+" ]"
    }else{
      tit = titulo +"  [ "+issn_e+" , "+issn_i+" ]"
    }
    return tit
  }

  submit = (formData: any) => {
    let data:any = {};
    if(formData.titulo!=this.quoteDataSaved.titulo){ data.titulo=formData.titulo }
    if(formData.doi!=this.quoteDataSaved.DOI){ data.DOI=formData.doi }
    if(formData.url!=this.quoteDataSaved.url){ data.url=formData.url }
    if(formData.anio!=this.quoteDataSaved.anio){ data.anio=formData.anio }
    if(formData.autocita_autor!=this.quoteDataSaved.autocita_autor){ data.autocita_autor=formData.autocita_autor }
    if(formData.autocita_journal!=this.quoteDataSaved.autocita_journal){ data.autocita_journal=formData.autocita_journal }
    if(formData.source_title!=this.quoteDataSaved.source_title){ data.source_title=formData.source_title }
    if(formData.source_volume!=this.quoteDataSaved.source_volume){ data.source_volume=formData.source_volume }
    if(formData.source_issue!=this.quoteDataSaved.source_issue){ data.source_issue=formData.source_issue }
    if(formData.source_page!=this.quoteDataSaved.source_page){ data.source_page=formData.source_page }
    if(formData.tipo!=this.quoteDataSaved.tipo && formData.tipo!=0){ data.tipo=formData.tipo }
    if(formData.in_scopus!=this.quoteDataSaved.in_scopus){ data.in_scopus=formData.in_scopus }
    if(formData.in_jcr!=this.quoteDataSaved.in_jcr){ data.in_jcr=formData.in_jcr }
    if(formData.in_scielo!=this.quoteDataSaved.in_scielo){ data.in_scielo=formData.in_scielo }
    if(formData.in_conacyt!=this.quoteDataSaved.in_conacyt){ data.in_conacyt=formData.in_conacyt }
    if(formData.in_doaj!=this.quoteDataSaved.in_doaj){ data.in_doaj=formData.in_doaj }
    if(this.selectedSource.id!=this.quoteDataSaved.fuente && this.selectedSource.id!=0){ data.fuente=this.selectedSource.id }
    this.quoteService.updateQuote(this.quote_id, data).subscribe((resData: any) => {
        this.ngOnInit()
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'Se ha editado la cita correctamente.',
          'success'
        );
      }, (err)=>{
        console.error(err);
        this.messageService.showPopupMessage('Error', 'Ha ocurrido un error al editar la cita.', 'error');
      },
      ()=>{});
  };


  cancel = () => {
    this.router.navigate(['admin/quotes', this.quoteData.producto.id]);
  };

  onFieldValidationError = (err: any) => {
    //console.error(err);
    this.messageService.showPopupMessage(
      'Error',
      'Ha ocurrido un error al validar el campo.',
      'error'
    )
  }

  onFieldValidationSuccess = (data: any) => {
    this.ngOnInit();
    this.messageService.showPopupMessage(
      'Felicidades',
      'La validación se ha realizado correctamente.',
      'success'
    )
  }

  validateTitulo = () => {
    this.quoteService.validateQuoteTitle(this.quote_id, true, this.quoteForm.controls.titulo.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateDOI = () => {
    this.quoteService.validateQuoteDoi(this.quote_id, true, this.quoteForm.controls.doi.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateURL = () => {
    this.quoteService.validateQuoteUrl(this.quote_id, true, this.quoteForm.controls.url.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateAnio = () => {
    this.quoteService.validateQuoteYear(this.quote_id, true, this.quoteForm.controls.anio.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateAutocitaAutor = () => {
    this.quoteService
      .validateQuoteAutocitaAutor(this.quote_id, true, this.quoteForm.controls.autocita_autor.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateAutocitaJournal = () => {
    this.quoteService
      .validateQuoteAutocitaJournal(this.quote_id, true,
        this.quoteForm.controls.autocita_journal.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateSourceTitle = () => {
    this.quoteService
      .validateQuoteSource(this.quote_id, true, this.selectedSource.id)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateSourceVolume = () => {
    this.quoteService
      .validateQuoteSourceVolume(this.quote_id, true, this.quoteForm.controls.source_volume.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateSourceIssue = () => {
    this.quoteService
      .validateQuoteSourceIssue(this.quote_id, true, this.quoteForm.controls.source_issue.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateSourcePage = () => {
    this.quoteService
      .validateQuoteSourcePage(this.quote_id, true, this.quoteForm.controls.source_page.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateTipo = () => {
    this.quoteService.validateQuoteTipo(this.quote_id, true, this.quoteForm.controls.tipo.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateScopus = () => {
    this.quoteService.validateScopus(this.quote_id, true, this.quoteForm.controls.in_scopus.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
  };

  validateJcr = () => {
    this.quoteService.validateJcr(this.quote_id, true, this.quoteForm.controls.in_jcr.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
  };

  validateScielo = () => {
    this.quoteService.validateScielo(this.quote_id, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateConacyt = () => {
    this.quoteService.validateConacyt(this.quote_id, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateDoaj = () => {
    this.quoteService.validateDoaj(this.quote_id, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateQuote = () => {
    this.salvarCoautores();
    Swal.fire({
      title: '¿Estás segur@ de validar la cita?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Ok',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.quoteService.validateQuote(this.quote_id, true).subscribe(
          (data: any) => {
            this.messageService.showPopupMessage(
              'Felicitaciones',
              'La validación se ha realizado correctamente.',
              'success'
            );
            this.router.navigate(['admin/products']);
            this.cancel();
          },
          (err) => {
            console.error(err);
            this.messageService.showPopupMessage(
              'Error',
              'Ha ocurrido un error al validar la cita.',
              'error'
            );
          },
          () => {}
        );

      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  salvarCoautores(){
    this.guardarCoautores=true;
  }

}
