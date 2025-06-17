import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ValidationService} from "../../../../services/validation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogsService} from "../../../../services/catalogs.service";
import {MessageService} from "../../../../services/message.service";

@Component({
  selector: 'app-validation-fields',
  templateUrl: './validation-fields.component.html',
  styleUrls: ['./validation-fields.component.css']
})
export class ValidationFieldsComponent implements OnInit {

  productId: string //id de producto
  quotesAmountToValidate: number //cantidad de citas de producto actual pendientes de validar
  productData: any //datos del producto según la base de datos
  productDataSaved: any //datos guardados del producto según la base de datos
  validationFormGroup: FormGroup //formGroup del formulario de validación
  sourceFormGroup: FormGroup //formGroup del formulario de búsqueda de fuentes
  productTypesList: any[] = [] //tipos de producto disponibles en la base
  rightsList: any[] = [] // rights disponibles en la base
  sourcesList: any[] = [] //fuentes disponibles en la base

  fuenteDepredaora:boolean=false;
  guardarCoautores:boolean=false;

  constructor(
    private validationService: ValidationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private catalogsService: CatalogsService,
    private messageService: MessageService
  )
  {
    this.initializeProductData() //se inicializa los datos de los productos
    this.productId = this.activatedRoute.snapshot.paramMap.get('id') // se toma el id de producto de la url
  }

  private initializeSourceSearchForm() {
    this.sourceFormGroup = new FormGroup({
      id: new FormControl(''),
      titulo: new FormControl(''),
    })
  }

  public initializeValidationForm() {
    this.validationFormGroup = new FormGroup({
      titulo: new FormControl(''),
      doi: new FormControl(''),
      url: new FormControl(''),
      right: new FormControl('0'),
      fuente: new FormControl(''),
      fuenteId: new FormControl(''),
      rights_uri: new FormControl({value: '', disabled: true}),
      description: new FormControl(''),
      publisher: new FormControl({value: '', disabled: true}),
      issne: new FormControl({value: '', disabled: true}),
      issni: new FormControl({value: '', disabled: true}),
      volumenFuente: new FormControl(''),
      numeroFuente: new FormControl(''),
      paginaFuente: new FormControl(''),
      anio: new FormControl(''),
      linkCitas: new FormControl(''),
      nombreInvest: new FormControl({value: '', disabled: true}),
      investList: new FormControl([]),
      tipo: new FormControl('0'),
      scopus: new FormControl(false),
      jcr: new FormControl(false),
      scielo: new FormControl(false),
      conacyt: new FormControl(false),
      doaj: new FormControl(false),
    });
  }

  ngOnInit() {
    //se crea e inicializa el formulario de validación
    this.initializeValidationForm();
    //se crea e inicializa el formulario de búsqueda y selección de fuentes
    this.initializeSourceSearchForm();
    this.loadProductTypes();
    this.loadRights();
    this.getCantidadCitasSinValidar();
    this.loadProductData();
  }

  //inicializa la variabla product data a valores default
  initializeProductData() {
    this.productData = { //initial product data
      titulo: '',
      tipo: null,
      tipo_validado: false,
      anio: null,
      anio_validado: false,
      DOI: null,
      DOI_validado: false,
    };
  }

  loadProductTypes(): void {
    this.catalogsService.getAllProductsTypes().subscribe((result: any) => {
      this.productTypesList = result;
    });
  }

  loadRights(): void {
    this.catalogsService.getAllRights().subscribe((result: any) => {
      this.rightsList = result;
    });
  }

  getCantidadCitasSinValidar(): void {
    this.validationService
      .getUnvalidatedQuotesCountByProductId(parseInt(this.productId))
      .subscribe((count: number) => {
        this.quotesAmountToValidate = count;
      });
  }

  redirectToForm(): void {
    this.router.navigate(['admin/quotes', this.productId]);
  }

  //se cargan desde el backend los datos del producto
  loadProductData(): void {
    this.validationService.getProductById(this.productId).subscribe(
      (data: any) => {
        this.productData = data; // se asigna copia local de los datos del producto del backend
        this.productDataSaved = data; // se asigna copia local de los datos del producto del backend
        //console.log("this.productData",this.productData);
        this.setProductDataToValidationForm()
        //si hay fuente, se llena con ella el campo de búsqueda del form de búsqueda de fuente
        if (this.productData.fuente) {
          this.validationFormGroup.controls.fuente.setValue(this.productData.fuente.titulo)
          this.sourceFormGroup.controls.titulo.setValue(this.productData.fuente.titulo)
        }
      },
      (err) => {
        if (err.status == 404)
          this.router.navigate(['/not-found'])
        else
          console.error(err);
      }
    );
  }

  // hace lo siguiente básicamente this.productData => validationFormGroup
  setProductDataToValidationForm() {
    //console.log("this.productData",this.productData)
    this.validationFormGroup.controls.titulo.setValue(this.productData.titulo)
    this.validationFormGroup.controls.doi.setValue(this.productData.DOI)
    this.validationFormGroup.controls.url.setValue(this.productData.url)
    this.validationFormGroup.controls.description.setValue(this.productData.description)
    this.validationFormGroup.controls.anio.setValue(this.productData.anio)
    this.validationFormGroup.controls.linkCitas.setValue(this.productData.linkCitas)
    this.validationFormGroup.controls.nombreInvest.setValue(this.productData.nombreInvest)
    if (this.productData.tipo)
      this.validationFormGroup.controls.tipo.setValue(this.productData.idTipo)
    if (this.productData.right)
      this.validationFormGroup.controls.right.setValue(this.productData.right.id)
    if (this.productData.fuente) {
      this.validationFormGroup.controls.fuente.setValue(this.productData.fuente.titulo)
      this.validationFormGroup.controls.fuenteId.setValue(this.productData.fuente.id)
      this.validationFormGroup.controls.rights_uri.setValue(this.productData.fuente.rights_uri)
      this.validationFormGroup.controls.publisher.setValue(this.productData.fuente.publisher)
      this.catalogsService.getSourceById(this.productData.fuente.id).subscribe((resSour: any) => {
        if(resSour.length > 0){
          this.validationFormGroup.controls.issne.setValue(resSour[0].issn_e)
          this.validationFormGroup.controls.issni.setValue(resSour[0].issn_i)
          this.fuenteDepredaora = resSour[0].depredadora;
        }
      });
    }
    this.validationFormGroup.controls.scopus.setValue(this.productData.in_scopus)
    this.validationFormGroup.controls.jcr.setValue(this.productData.in_jcr)
    this.validationFormGroup.controls.scielo.setValue(this.productData.in_scielo)
    this.validationFormGroup.controls.conacyt.setValue(this.productData.in_conacyt)
    this.validationFormGroup.controls.doaj.setValue(this.productData.in_doaj)
    this.validationFormGroup.controls.volumenFuente.setValue(this.productData.volumen_fuente)
    this.validationFormGroup.controls.numeroFuente.setValue(this.productData.numero_fuente)
    this.validationFormGroup.controls.paginaFuente.setValue(this.productData.pagina_fuente)
  }

  loadSourcesByCriteria(): void {
    const sourceSearchByText = this.sourceFormGroup.controls.titulo.value
    if (sourceSearchByText.length > 1) {
      this.catalogsService
        .getSearchSources(sourceSearchByText)
        .subscribe((response: any) => {
          this.sourcesList = response;
        });
    } else {
      this.messageService.showPopupMessage(
        'Pocos caracteres',
        'Debe entrar más de 1 caracter para realizar la búsqueda.',
        'error'
      );
    }
  }

  selectSource() {
    const currentSourceId = this.sourceFormGroup.controls.id.value
    this.sourceFormGroup.controls.titulo.setValue(this.sourcesList.find(value => {
      //console.log('value.id: ' + value.id + ' currentSourceId: ' + currentSourceId)
      return value.id == currentSourceId
    }).titulo)
  }

  onSourceSelected() {
    const currentSourceId = this.sourceFormGroup.controls.id.value
    this.validationFormGroup.controls.fuente.setValue(this.sourceFormGroup.controls.titulo.value)
    this.validationFormGroup.controls.fuenteId.setValue(this.sourceFormGroup.controls.id.value)
    const source = this.sourcesList.find(value => { return value.id == currentSourceId })
    //console.log("source",this.sourcesList)
    this.validationFormGroup.controls.rights_uri.setValue(source.rights_uri)
    this.validationFormGroup.controls.publisher.setValue(source.publisher)
    this.validationFormGroup.controls.issne.setValue(source.issn_e)
    this.validationFormGroup.controls.issni.setValue(source.issn_i)
  }

  formatIssn(titulo:string,issn_e:string,issn_i:string){
    //console.log("this.sourcesList",this.sourcesList)
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

  submit = () => {
    console.log("this.validationFormGroup",this.validationFormGroup.value);
    console.log("this.productDataSaved",this.productDataSaved);
    let formData:any = this.validationFormGroup.value;
    const fuenteId = this.validationFormGroup.controls.fuenteId.value
    const rightId = this.validationFormGroup.controls.right.value
    const tipoId = this.validationFormGroup.controls.tipo.value
    let data:any = {};
    if(formData.titulo!=this.productDataSaved.titulo){ data.titulo=formData.titulo }
    if(formData.doi!=this.productDataSaved.DOI){ data.DOI=formData.doi }
    if(formData.url!=this.productDataSaved.url){ data.url=formData.url }
    if(fuenteId!=this.productDataSaved.fuente && fuenteId!=0){ data.fuente=fuenteId }
    if(formData.description!=this.productDataSaved.description){ data.description=formData.description }
    if(formData.anio!=this.productDataSaved.anio){ data.anio=formData.anio }
    if(tipoId!=this.productDataSaved.tipo && tipoId!=0){ data.tipo=tipoId }
    if(rightId!=this.productDataSaved.right && rightId!=0){ data.right=rightId }
    if(formData.scopus!=this.productDataSaved.in_scopus && formData.scopus!=undefined){ data.in_scopus=formData.scopus }
    if(formData.jcr!=this.productDataSaved.in_jcr && formData.jcr!=undefined){ data.in_jcr=formData.jcr }
    if(formData.scielo!=this.productDataSaved.in_scielo && formData.scielo!=undefined){ data.in_scielo=formData.scielo }
    if(formData.conacyt!=this.productDataSaved.in_conacyt && formData.conacyt!=undefined){ data.in_conacyt=formData.conacyt }
    if(formData.doaj!=this.productDataSaved.in_doaj && formData.doaj!=undefined){ data.in_doaj=formData.doaj }
    if(formData.volumenFuente!=this.productDataSaved.volumen_fuente){ data.volumen_fuente=formData.volumenFuente }
    if(formData.numeroFuente!=this.productDataSaved.numero_fuente){ data.numero_fuente=formData.numeroFuente }
    if(formData.paginaFuente!=this.productDataSaved.pagina_fuente){ data.pagina_fuente=formData.paginaFuente }

    console.log("data",data);

    this.validationService.updateProduct(this.productId, data).subscribe(
      () => {
        this.ngOnInit() // se recarga el componente después de la actualización
        this.messageService.showPopupMessage(
          'Felicidades',
          'La validación se ha realizado correctamente.',
          'success'
        );
      },
      (err: any) => {
        console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al editar el producto.',
          'error'
        );
      }
    );
  };

  cancel = () => {
    this.router.navigate(['/admin/products']);
  };

  validateTitulo = () => {
    this.validationService.validateProductTitle(this.productId, true, this.validationFormGroup.controls.titulo.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
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

  validateDOI = () => {
    this.validationService.validateProductDoi(this.productId, true, this.validationFormGroup.controls.doi.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateURL = () => {
    this.validationService.validateProductUrl(this.productId, true, this.validationFormGroup.controls.url.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
  };

  validateRight = () => {
    const rightId = this.validationFormGroup.controls.right.value
    this.validationService.validateProductRight(this.productId, true, (rightId > 0) ? rightId : null)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError
      );
  };

  validateDescription = () => {
    this.validationService
      .validateProductDescription(this.productId, true, this.validationFormGroup.controls.description.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
  };

  validatePublisher = () => {
    this.validationService.validateProductPublisher(this.productId, true, this.validationFormGroup.controls.publisher.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
  };

  validateAnio = () => {
    this.validationService.validateProductYear(this.productId, true, this.validationFormGroup.controls.anio.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError
    );
  };

  validateScopus = () => {
    this.validationService
      .validateProductScopus(this.productId, true, this.validationFormGroup.controls.scopus.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
  };

  validateJcr = () => {
    this.validationService
      .validateProductJcr(this.productId, true, this.validationFormGroup.controls.jcr.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
  };

  validateTipo = () => {
    const tipoId = this.validationFormGroup.controls.tipo.value
    this.validationService.validateProductTipo(this.productId, true, (tipoId > 0) ? tipoId : null)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError);
  };

  validateFuente = () => {
    this.validationService
      .validateProductSource(this.productId, true, this.sourceFormGroup.controls.id.value)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateProduct = () => {
    // redirigir al form de validación por similaridad
    this.salvarCoautores()
    this.router.navigate([`admin/validation/products/${this.productId}/similar`])
  };

  validateSourceVolume = () => {
    this.validationService
      .validateSourceVolumen(this.productId, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateSourceIssue = () => {
    this.validationService
      .validateSourceNumber(this.productId, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateSourcePage = () => {
    this.validationService
      .validateSourcePage(this.productId, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateScielo = () => {
    this.validationService
      .validateScielo(this.productId, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateConacyt = () => {
    this.validationService
      .validateConacyt(this.productId, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  validateDoaj = () => {
    this.validationService
      .validateDoaj(this.productId, true)
      .subscribe(this.onFieldValidationSuccess, this.onFieldValidationError)
  };

  salvarCoautores(){
    this.guardarCoautores=true;
  }

  validarVolumen(){
    var auxVolumen :string = this.validationFormGroup.controls.volumenFuente.value;
    if(auxVolumen.length>20){
      this.validationFormGroup.controls.volumenFuente.setValue(auxVolumen.slice(0,20))
    }
  }

  validarNumero(){
    var auxNumero :string = this.validationFormGroup.controls.numeroFuente.value;
    if(auxNumero.length>20){
      this.validationFormGroup.controls.numeroFuente.setValue(auxNumero.slice(0,20))
    }
  }

  validarPagina(){
    var auxPagina :string = this.validationFormGroup.controls.paginaFuente.value;
    if(auxPagina.length>20){
      this.validationFormGroup.controls.paginaFuente.setValue(auxPagina.slice(0,20))
    }
  }

}
