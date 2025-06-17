import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {ValidationService} from "../../../../services/validation.service";
import {QuoteService} from "../../../../services/quote.service";
import {MessageService} from "../../../../services/message.service";
import {Coauthor} from "../../../../interfaces/coauthor";
import {Ror} from "../../../../interfaces/ror";
import {CatalogsService} from "../../../../services/catalogs.service";
import {Language} from "../../../../interfaces/language";

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.css']
})
export class CatalogsComponent implements OnInit, OnChanges {

  @Input() id = '';
  @Input() is_product = false;
  @Input() salvar_coautores = false;

  edit = false;
  coautoresDS: any[] = [];
  subjectsDS: any[] = [];
  languagesDS: any[] = [];
  coauthorsReady = false;
  subjectsReady = false;
  languagesReady = false;
  possibleCoauthors: any = [];
  animacionCambio:number = 0;
  animacionPrevCambio:number = 0;

  data: Coauthor = {
    id: '',
    nombre: '',
    rors: new Array(0),
    orcid_id: '',
    validated: false,
    edit: false,
  };
  rors: Ror[] = [];
  selectedRor: Ror = {
    id: 0,
    institution_name: '',
    country: '',
  };
  textCriteria = '';

  languages: Language [] = []
  language: Language = {
    id: 0,
    nombre: '',
    id_639_1: ''
  };

  subject = '';

  saveToLoad: boolean = true;
  correspondencia:boolean = false;

  constructor(
    private validationService: ValidationService,
    private quoteService: QuoteService,
    private messageService: MessageService,
    private catalogsService: CatalogsService,
  ) { }

  ngOnInit(): void {
    this.loadCoauthors();
    if (this.is_product) {
      this.loadSubjects();
      this.loadLanguages();
      this.loadAllLanguages();
    }
  }

  ngOnChanges(){
    this.loadCoauthors();
  }

  clearDataCoauthor = () => {
    this.edit = false;
    this.data = {
      id: '',
      nombre: '',
      rors: new Array(0),
      orcid_id: '',
      validated: false,
      edit: false,
    };
    this.correspondencia=false;
  }

  fillDataCoauthor = (obj: any) => {
    this.emptyPossibleCoauthors();
    this.edit = true;
    this.data = {
      id: obj.id,
      nombre: obj.nombre,
      rors: obj.institutions,
      orcid_id: obj.orcid_id,
      validated: obj.validated,
      edit: true,
    };
    this.data.rors = this.data.rors.filter(item => {
      return item.id != undefined
    })
    this.selectedRor = null
    this.textCriteria = ''
    this.correspondencia=obj.correspondencia;
    //console.log(this.data);
  }

  loadSubjects(): void {
    this.validationService.getSubjectsByProductId(this.id).subscribe(
      (data: any) => {
        this.subjectsDS = data;
      },
      // The 2nd callback handles errors.
      (err) => {
        //console.error(err);
      },
      // The 3rd callback handles the "complete" event.
      () => {
        this.subjectsReady = true;
      }
    );
  }

  loadLanguages(): void {
    this.validationService.getProductById(this.id).subscribe(
      (data: any) => {
        this.languagesDS = data.idiomas;
      },
      // The 2nd callback handles errors.
      (err) => {
        //console.error(err);
      },
      // The 3rd callback handles the "complete" event.
      () => {
        this.languagesReady = true;
      }
    );
  }

  deleteSubject(id: string): void {
    this.validationService.deleteSubjectProduct(id).subscribe(
      (result) => {
        this.loadSubjects();
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'Los datos se han eliminado correctamente.',
          'success'
        );
      },
      // The 2nd callback handles errors.
      (err) => {
        //console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al eliminar los datos del tópico.',
          'error'
        );
      },
      // The 3rd callback handles the "complete" event.
      () => {
      }
    );
  }

  deleteLanguage(id: string): void {
    this.validationService.deleteLanguageProduct(this.id, id).subscribe(
      (result) => {
        this.loadLanguages();
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'Los datos se han eliminado correctamente.',
          'success'
        );
      },
      // The 2nd callback handles errors.
      (err) => {
        //console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al eliminar los datos del idioma.',
          'error'
        );
      },
      // The 3rd callback handles the "complete" event.
      () => {
      }
    );
  }

  validateSubject(id: string): void {
    this.validationService.validateSubjectProduct(id).subscribe(
      (result) => {
        this.loadSubjects();
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'El tópico se ha validado correctamente.',
          'success'
        );
      },
      // The 2nd callback handles errors.
      (err) => {
        //console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al validar el tópico.',
          'error'
        );
      },
      // The 3rd callback handles the "complete" event.
      () => {
      }
    );
  }

  validateLanguage(id: string): void {
    this.validationService.validateLanguageProduct(this.id, id).subscribe(
      (result) => {
        this.loadLanguages();
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'El idioma se ha validado correctamente.',
          'success'
        );
      },
      // The 2nd callback handles errors.
      (err) => {
        //console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al validar el idioma.',
          'error'
        );
      },
      // The 3rd callback handles the "complete" event.
      () => {
      }
    );
  }

  loadCoauthors(): void {
    if (this.is_product) {
      this.loadCoauthorsProduct();
    } else {
      this.loadCoauthorsQuotes();
    }
  }

  loadCoauthorsProduct(): void {
    let dataCoauthorsProduct: any[] = [];
    if (this.is_product) {
      this.validationService.getCoauthorsByProductId(this.id).subscribe(
        (data: any) => {
          this.animacionCambio=this.animacionPrevCambio;
          data.forEach((item: any) => {
            let element = {
              id: item.id,
              nombre: item.nombre,
              orden:item.orden,
              correspondencia:item.correspondencia,
              orcid_id: item.orcid_id,
              validated: item.validated,
              institutions_names_string: '',
              countries_names_string: '',
              institutions: new Array(1)
            };
            if (item.rors && item.rors.length > 0) {
              element.institutions = item.rors
              element.institutions_names_string = element.institutions.map(item => item.institution_name).join('<br>')
              element.countries_names_string = element.institutions.map(item => item.country).join('<br>')
            }
            dataCoauthorsProduct.push(element);
          });

          this.coautoresDS = dataCoauthorsProduct;
          this.coautoresDS = this.coautoresDS.sort((a,b)=>a.orden-b.orden);
          this.obtenerCoautoresByOrden(dataCoauthorsProduct);
        },
        // The 2nd callback handles errors.
        (err: any) => {
          //console.error(err);
        },
        // The 3rd callback handles the "complete" event.
        () => {
          this.coauthorsReady = true;
        }
      );
    }
  }

  loadCoauthorsQuotes(): void {
    let dataCoauthorsQuotes: any[] = [];
    this.quoteService.getCoauthorsByQuoteId(this.id).subscribe(
      (data: any) => {
        this.salvar_coautores=false;
        this.animacionCambio=this.animacionPrevCambio;
        data.forEach((item: any) => {
          let element = {
            id: item.id,
            nombre: item.nombre,
            orden:item.orden,
            orcid_id: item.orcid_id,
            validated: item.validated,
            institutions_names_string: '',
            countries_names_string: '',
            institutions: new Array(1)
          };
          if (item.rors && item.rors.length > 0) {
            element.institutions = item.rors
            element.institutions_names_string = element.institutions.map(item => item.institution_name).join('<br>')
            element.countries_names_string = element.institutions.map(item => item.country).join('<br>')
          }
          dataCoauthorsQuotes.push(element);
        });
        //console.log("dataCoauthorsQuotes",dataCoauthorsQuotes);
        this.coautoresDS = dataCoauthorsQuotes;
        this.coautoresDS = this.coautoresDS.sort((a,b)=>a.orden-b.orden);
        this.obtenerCoautoresByOrden(dataCoauthorsQuotes);
      },
      // The 2nd callback handles errors.
      (err: any) => {
        //console.error(err);
      },
      // The 3rd callback handles the "complete" event.
      () => {
        //console.log(this.coautoresDS);
        this.coauthorsReady = true;
      }
    );
  }

  obtenerCoautoresByOrden(coautores:any){
    let auxArrayCoautores = coautores ;
    for(let c of coautores){
      if(!c.orden){
        auxArrayCoautores = auxArrayCoautores.filter((item:any) => item.id != c.id)
        auxArrayCoautores.push(c)
      }
    }
    let auxCantOrden:number=1;
    for(let c of auxArrayCoautores){
      c.ordenTemp=auxCantOrden
      auxCantOrden++
    }
    this.coautoresDS = this.coautoresDS.sort((a,b)=>a.ordenTemp-b.ordenTemp);
    this.coautoresDS = auxArrayCoautores;
    if(this.saveToLoad){
      this.saveToLoad = false;
      this.updateOrdenAllCoautors()
    }
    //console.log("auxArrayCoautores",auxArrayCoautores);
  }

  updateOrdenAllCoautors(){
    if (this.is_product) {
      this.updateOrderAllCoautorsProduct()
    } else {
      this.updateOrderAllCoautorsQuote()
    }
  }

  updateOrderAllCoautorsProduct(){
    let auxCoautoresReOrder:any[] = this.coautoresDS.filter(item => item.orden === null);
    for(let acro of auxCoautoresReOrder){
      this.validationService.updateCoauthorProductOrder(acro.id,acro.ordenTemp).subscribe((response: any) => {
        this.loadCoauthorsProduct();
      });
    }
  }

  updateOrderAllCoautorsQuote(){
    let auxCoautoresReOrder:any[] = this.coautoresDS.filter(item => item.orden === null);
    for(let acro of auxCoautoresReOrder){
      this.quoteService.updateCoauthorQuoteOrder(acro.id,acro.ordenTemp).subscribe((response: any) => {
        this.loadCoauthorsQuotes();
      });
    }
  }

  changeOrden(id:number,orden:number){
    if (this.is_product) {
      this.updateOrdenCoautorProduct(id,orden);
    } else {
      this.updateOrdenCoautorQuote(id,orden)
    }
    this.animacionPrevCambio=orden;
  }

  changeCorrespondencia(value:boolean){
    this.correspondencia=value;
  }

  updateOrdenCoautorProduct(id:number,orden:number){
    this.validationService.updateCoauthorProductOrder(id,orden).subscribe((response: any) => {
      this.loadCoauthorsProduct()
    });
  }

  updateOrdenCoautorQuote(id:number,orden:number){
    this.quoteService.updateCoauthorQuoteOrder(id,orden).subscribe((response: any) => {
      this.loadCoauthorsQuotes()
    });
  }

  deleteCoauthor(id: string): void {
    if (this.is_product) {
      this.deleteCoauthorProduct(id);
    } else {
      this.deleteCoauthorQuotes(id);
    }
  }

  deleteCoauthorProduct(id: string): void {
    if (this.is_product) {
      this.validationService.deleteCoauthorProduct(id).subscribe(
        (result: any) => {
          this.loadCoauthorsProduct();
          //this.updateOrder();
          this.messageService.showPopupMessage(
            'Felicitaciones',
            'Los datos se han eliminado correctamente.',
            'success'
          );
        },
        // The 2nd callback handles errors.
        (err: any) => {
          //console.error(err);
          this.messageService.showPopupMessage(
            'Error',
            'Ha ocurrido un error al eliminar los datos del coautor.',
            'error'
          );
        },
        // The 3rd callback handles the "complete" event.
        () => {
        }
      );
    }
  }

  deleteCoauthorQuotes(id: string): void {
    this.quoteService.deleteCoauthorQuote(id).subscribe(
      (result: any) => {
        this.loadCoauthorsQuotes();
        //this.updateOrder();
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'Los datos se han eliminado correctamente.',
          'success'
        );
        this.loadCoauthorsQuotes();
      },
      // The 2nd callback handles errors.
      (err: any) => {
        //console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al eliminar los datos del coautor.',
          'error'
        );
      },
      // The 3rd callback handles the "complete" event.
      () => {
      }
    );
  }

  loadRorData(institution: string) {
    const result = this.rors.filter(
      (item) => item.institution_name === institution
    )[0];
    /*this.data.ror = result.id.toString();
    this.data.country = result.country;*/
  }

  loadAllRors(): void {
    if (this.textCriteria.length > 1) {
      this.catalogsService
        .getAllRorsByText(this.textCriteria)
        .subscribe((response: any) => {
          this.rors = response;
          //selecciona el primer resultado de todos los ror
          this.selectedRor = null
          /*if (this.rors.length !== 0) {
            this.selectedRor = this.rors[0];
          }*/
        });
    } else {
      this.messageService.showPopupMessage(
        'Pocos caracteres',
        'Debe entrar más de 1 caracter para realizar la búsqueda.',
        'error'
      );
    }
  }

  loadAllLanguages(): void {
    this.catalogsService.getAllLanguages().subscribe((response: any) => {
        this.languages = response;
      },
      (err)=>{},
      ()=>{

      });
  }

  createLanguage(): void {
    this.validationService
      .createLanguageProduct(this.id, this.language.id.toString())
      .subscribe(
        (response) => {
          this.loadLanguages();
          this.messageService.showPopupMessage(
            'Felicidades',
            'Se ha insertado el idioma correctamente.',
            'success'
          );
        },
        // The 2nd callback handles errors.
        (err) => {
          //console.error(err);
          this.messageService.showPopupMessage(
            'Error',
            'Ha ocurrido un error al insertar el idioma del tópico.',
            'error'
          );
        },
        // The 3rd callback handles the "complete" event.
        () => {}
      );
  }

  createSubject(): void {
    this.validationService.createSubjectProduct(this.id, this.subject).subscribe(
      (response) => {
        this.loadSubjects();
        this.messageService.showPopupMessage(
          'Felicidades',
          'Se ha insertado el tópico correctamente.',
          'success'
        );
      },
      // The 2nd callback handles errors.
      (err) => {
        //console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al insertar los datos del tópico.',
          'error'
        );
      },
      // The 3rd callback handles the "complete" event.
      () => {}
    );
  }

  updateCoauthorProduct(): void {
    //console.log('Update Product Coauthor');
    this.validationService
      .updateCoauthorProduct(
        this.data.id,
        this.data.nombre,
        this.data.orcid_id,
        this.data.rors.map(item => item.id),
        this.data.validated
      )
      .subscribe(
        (response: any) => {
          if(this.correspondencia){
            this.updateCorrespondenciaCoautorsProduct(this.data.id)
          }else{
            this.loadCoauthorsProduct();
          }
          this.messageService.showPopupMessage(
            'Felicidades',
            'Los datos se han actualizado correctamente.',
            'success'
          );
        },
        // The 2nd callback handles errors.
        (err: any) => {
          //console.error(err);
          this.messageService.showPopupMessage(
            'Error',
            'Ha ocurrido un error al actualizar los datos del coautor.',
            'error'
          );
        },
        // The 3rd callback handles the "complete" event.
        () => {
          this.loadCoauthorsProduct();
        }
      );
  }

  createCoauthorProduct(): void {
    //console.log('Create Product Coauthor');
    this.validationService
      .createCoauthorProduct(
        this.id,
        this.data.nombre,
        this.data.orcid_id,
        this.data.rors.map(item => item.id),
        this.data.validated
      )
      .subscribe(
        (response: any) => {
          this.updateOrdenCoautorProduct(response.id_creado,this.coautoresDS.length+1);
          if(this.correspondencia){
            this.updateCorrespondenciaCoautorsProduct(this.data.id)
          }else{
            this.loadCoauthorsProduct();
          }
        },
        // The 2nd callback handles errors.
        (err: any) => {
          //console.error(err);
          this.messageService.showPopupMessage(
            'Error',
            'Ha ocurrido un error al insertar los datos del coautor.',
            'error'
          );
        },
        // The 3rd callback handles the "complete" event.
        () => {
          this.loadCoauthorsProduct();
        }
      );

  }

  updateCoauthorQuote(): void {
    //console.log('Update Quote Coauthor');
    this.quoteService
      .UpdateCoauthorQuote(
        this.data.id,
        this.data.nombre,
        this.data.orcid_id,
        this.data.rors.map(item => item.id),
        this.data.validated
      )
      .subscribe(
        (response) => {
          if(this.correspondencia){
            this.updateCorrespondenciaCoautorsQuotes(this.data.id)
          }else{
            this.loadCoauthorsQuotes();
          }
          this.messageService.showPopupMessage(
            'Los datos se han actualizado correctamente.',
            'Felicitaciones',
            'success'
          );
        },
        // The 2nd callback handles errors.
        (err) => {
          //console.error(err);
          this.messageService.showPopupMessage(
            'Ha ocurrido un error al actualizar los datos del coautor.',
            'error',
            'error'
          );
        },
        // The 3rd callback handles the "complete" event.
        () => {
          this.loadCoauthorsQuotes();
        }
      );
  }

  createCoauthorQuote(): void{
    //console.log('Create Quote Coauthor');
    this.quoteService
      .createCoauthorQuote(
        this.id,
        this.data.nombre,
        this.data.orcid_id,
        this.data.rors.map(item => item.id),
        this.data.validated
      )
      .subscribe(
        (response:any) => {
          this.updateOrdenCoautorQuote(response.id_creado,this.coautoresDS.length+1)
          if(this.correspondencia){
            this.updateCorrespondenciaCoautorsQuotes(this.data.id)
          }else{
            this.loadCoauthorsQuotes();
          }
          this.messageService.showPopupMessage(
            'Se ha insertado el coautor correctamente.',
            'Felicitaciones',
            'success'
          );
        },
        // The 2nd callback handles errors.
        (err:any) => {
          //console.error(err);
          this.messageService.showPopupMessage(
            'Ha ocurrido un error al insertar los datos del coautor.',
            'error',
            'error'
          );
        },
        // The 3rd callback handles the "complete" event.
        () => {
          this.loadCoauthorsQuotes();
        }
      );
  }

  updateCorrespondenciaCoautorsProduct(idCoautor:any): void {
    let auxCoautorsCorrespondencia = this.coautoresDS.filter(item => item.correspondencia !== false)
    if(auxCoautorsCorrespondencia.length>0){
      let cont = 0;
      for (let c of auxCoautorsCorrespondencia) {
        this.validationService.updateCoauthorProductCorrespondencia(c.id,false).subscribe((response: any) => {
          cont++
          if(auxCoautorsCorrespondencia.length==cont){
            this.validationService.updateCoauthorProductCorrespondencia(idCoautor,true).subscribe((response: any) => {
              this.loadCoauthorsProduct()
            });
          }
        });
      }
    }else{
      this.validationService.updateCoauthorProductCorrespondencia(idCoautor,true).subscribe((response: any) => {
        this.loadCoauthorsProduct()
      });
    }
  }

  updateCorrespondenciaCoautorsQuotes(idCoautor:any): void {
    let auxCoautorsCorrespondencia = this.coautoresDS.filter(item => item.correspondencia !== false)
    if(auxCoautorsCorrespondencia.length>0){
      let cont = 0;
      for (let c of auxCoautorsCorrespondencia) {
        this.quoteService.updateCoauthorQuoteCorrespondencia(c.id,false).subscribe((response: any) => {
          cont++
          if(auxCoautorsCorrespondencia.length==cont){
            this.quoteService.updateCoauthorQuoteCorrespondencia(idCoautor,true).subscribe((response: any) => {
              this.loadCoauthorsProduct()
            });
          }
        });
      }
    }else{
      this.quoteService.updateCoauthorQuoteCorrespondencia(idCoautor,true).subscribe((response: any) => {
        this.loadCoauthorsProduct()
      });
    }
  }

  onPossibleAuthorSelected(value: any) {
    value = this.unknownToObject(value)
    this.data = {
      id: this.data.id,
      nombre: value.nombre_coautor,
      rors: value.rors,
      orcid_id: value.orcid_id,
      validated: false,
      edit: false,
    };
    //this.textCriteria = value.institution_name
    //this.loadAllRors()
    this.emptyPossibleCoauthors()
    //console.log(this.data);
    //console.log (`Selected index => ${this.unknownToObject(index)}`);
  }

  getPossibleCoauthors(term: any) {
    const onResolve = (data: any) => {
      this.possibleCoauthors = data.slice(0,3).map((item: any) => {
        item.institutions_names_with_country_string
          = item.rors.map((item: any) => item.institution_name + ' (' + item.nombre_pais + ')').join('<br>')
        //item.countries_names_string = item.rors.map((item: any) => item.nombre_pais).join('<br>')
        return item
      })
    }
    if (this.is_product) {
      this.validationService.getProductCoauthors(term).subscribe(onResolve)
    } else {
      this.quoteService.getCiteCoauthors(term).subscribe(onResolve)
    }
  }

  emptyPossibleCoauthors() {
    this.possibleCoauthors = [];
  }

  unknownToObject ($elem: any) {
    return JSON.parse(JSON.stringify($elem));
  }

  addAfiliacion() {
    let ror = this.selectedRor
    this.data.rors.push({
      id: ror.id,
      institution_name: ror.institution_name,
      country: ror.country
    })
    //console.log(this.data.rors.map(item => item.id))
  }

  deleteAfiliacion(id: number) {
    this.data.rors = this.data.rors.filter(item => item.id !== id)
  }

  loadStylesRow(orden:number) {
    let style = "";
    if(orden==this.animacionCambio){ style += "red-border-color "}
    return style;
  }
}
