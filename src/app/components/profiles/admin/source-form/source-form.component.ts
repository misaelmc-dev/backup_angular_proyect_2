import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {Publisher} from "../../../../interfaces/publisher";
import {Language} from "../../../../interfaces/language";
import {Country} from "../../../../interfaces/country";
import {CatalogsService} from "../../../../services/catalogs.service";
import {MessageService} from "../../../../services/message.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Source} from "../../../../interfaces/source";
import {CommonService} from "../../../../services/common.service";

@Component({
  selector: 'app-source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.css']
})
export class SourceFormComponent implements OnInit {

  subjects: string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  publishers: any[] = [];
  publishersFilteredOptions!: Observable<Publisher[]>;
  languages: Language[] = [];
  languageControl: FormControl = new FormControl();
  languagesFilteredOptions!: Observable<Language[]>;
  countries: Country[] = [];
  countryControl: FormControl = new FormControl();
  countryFilteredOptions!: Observable<Country[]>;
  selectedLanguage: number = 0;
  selectedCountry: number = 0;

  sourceFormBuilder: FormBuilder = new FormBuilder();
  sourceForm!: FormGroup;
  frecuencies: string[] = [];
  productTypes: any[] = [];
  textCriteria = '';
  selectedPublisher = '';
  clasif_conacyt: any[] = [];

  constructor(
    private catalogsService: CatalogsService,
    private messageService: MessageService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.loadPublishers();
    this.loadLanguages();
    this.loadCountry();
    this.loadProductTypes();
    this.loadFrecuencies();
    this.getClasificacionConacyt();
    this.sourceForm = this.sourceFormBuilder.group({
      titulo: new FormControl(''),
      issn_e: new FormControl(''),
      issn_i: new FormControl(''),
      frecuencia: new FormControl(''),
      publisher: new FormControl(''),
      fi: new FormControl(''),
      jcr_q: new FormControl(''),
      scopus_q: new FormControl(''),
      aa_autor: new FormControl(''),
      aa_lector: new FormControl(''),
      area: new FormControl(''),
      url_normas: new FormControl(''),
      plantillas: new FormControl(''),
      coverletter: new FormControl(''),
      cites_score: new FormControl(''),
      doaj: new FormControl(''),
      jcr: new FormControl(''),
      scopus: new FormControl(''),
      conacyt: new FormControl(''),
      apc_costo: new FormControl(''),
      license_condition: new FormControl(''),
      persistent_article_identifier: new FormControl(''),
      article_meta_includes_orcid: new FormControl(''),
      clasif_conacyt: new FormControl(''),
      create_time: new FormControl(''),
      update_time: new FormControl(''),
      deleted_at: new FormControl(''),
      proceeding: new FormControl(''),
      acceso_abierto: new FormControl(''),
      idioma: new FormControl(''),
      pais: new FormControl(''),
      rights_uri: new FormControl(''),
      tipo_fuente: new FormControl(''),
      scielo: new FormControl(''),
      isbn: new FormControl(''),
      subjects: new FormControl(''),
    });
  }

  loadLanguages(): void {
    this.catalogsService.getAllLanguages().subscribe((result: any) => {
      this.languages = result;
    });
  }

  loadCountry(): void {
    this.catalogsService.getAllCountries().subscribe((result: any) => {
      this.countries = result;
    });
  }

  loadPublishers(): void {
    this.catalogsService.getAllPublishers(this.textCriteria).subscribe((result: any) => {
      result.map((strValue: string) => {
        if (strValue !== null) {
          this.publishers.push(strValue);
        }
      });
    });
  }

  loadProductTypes(): void {
    this.catalogsService.getAllProductsTypes().subscribe((result: any) => {
      this.productTypes = result.map( (item: { tipo: any; }) => item.tipo);
    });
  }

  loadFrecuencies() {
    this.frecuencies = this.catalogsService.getFrecuencies();
  }

  add(event: any): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.subjects.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(subject: string): void {
    const index = this.subjects.indexOf(subject);

    if (index >= 0) {
      this.subjects.splice(index, 1);
    }
  }

  submit(formData: any) {
    let data = formData;
    //console.log(data);
    data.create_time = new Date().getTime();
    data.update_time = new Date().getTime();
    data.deleted_at = null;
    data.research_topics = data.subjects.split(',');

    this.catalogsService.createSource(data).subscribe(
      (result) => {
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'Se ha creado fuente correctamente.',
          'success'
        );
      },
      (err) => {
        console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al crear la fuente.',
          'error'
        );
      },
      () => {}
    );
  }

  getLanguage(id: number): string {
    return !id ? '' : this.languages.find(item => item.id === id)!.nombre;
  }

  getCountry(id: number): string {
    return !id ? '' : this.countries.find(item => item.ISO_3166_1_num === id)!.nombre;
  }

  cancel = () => {
    this.router.navigate(['admin/sources']);
  }

  loadPublishersByCriteria(): void {
    if (this.textCriteria.length > 1) {
      this.catalogsService
        .getAllPublishers(this.textCriteria)
        .subscribe((response: any) => {
          this.publishers = response;
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
    this.sourceForm.controls['publisher'].setValue(this.selectedPublisher);
  }

  getClasificacionConacyt = () => {
    this.commonService.getClasificacionConacyt().subscribe((result: any) => {
      this.clasif_conacyt = result;
    });
  }

}
