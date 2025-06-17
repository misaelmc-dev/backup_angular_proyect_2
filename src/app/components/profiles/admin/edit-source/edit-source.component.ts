import { Component, OnInit } from '@angular/core';
import {Language} from "../../../../interfaces/language";
import {Country} from "../../../../interfaces/country";
import {Publisher} from "../../../../interfaces/publisher";
import {map, startWith} from "rxjs/operators";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {CatalogsService} from "../../../../services/catalogs.service";
import {MessageService} from "../../../../services/message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import * as jquery from 'jquery';
import {Source} from "../../../../interfaces/source";
import {CommonService} from "../../../../services/common.service";

@Component({
  selector: 'app-edit-source',
  templateUrl: './edit-source.component.html',
  styleUrls: ['./edit-source.component.css']
})
export class EditSourceComponent implements OnInit {

  id: any;
  subjects: string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  publishers: any[] = [];
  publisherControl: FormControl = new FormControl();
  publishersFilteredOptions!: Observable<Publisher[]>;
  languages: Language[] = [];
  languageControl: FormControl = new FormControl();
  languagesFilteredOptions!: Observable<Language[]>;
  countries: Country[] = [];
  countryControl: FormControl = new FormControl();
  countryFilteredOptions!: Observable<Country[]>;
  selectedLanguage: number = 0;
  frecuencies: string[] = [];
  frecuenciesControl: FormControl = new FormControl();

  sourceFormBuilder: FormBuilder = new FormBuilder();
  sourceForm!: FormGroup;
  productTypes: any[] = [];
  productTypesControl: FormControl = new FormControl();
  sources: any[] = [];
  textCriteria = '';
  selectedPublisher = '';
  clasif_conacyt: any[] = [];

  constructor(
    private catalogsService: CatalogsService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) {
    this.id = this.activatedRoute.snapshot.params["id"];
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

  ngOnInit(): void {
    // this.loadPublishers();
    this.loadLanguages();
    this.loadCountry();
    this.loadProductTypes();
    this.loadFrecuencies();
    this.getClasificacionConacyt();
    this.loadClientData();
  }

  loadClientData = () => {
    this.catalogsService.getSourceById(this.id).subscribe((result: any) => {
      let data = result[0];
      //console.log(data);
      let country;
      let language;
      if (data.paises[0]) {
        country = data.paises[0].ISO_3166_1_num;
        this.countryControl.setValue(country);
      }
      if (data.idiomas[0]) {
        language = data.idiomas[0].id;
        this.languageControl.setValue(language);
      }
      if (data.research_topics.length > 0) {
        //this.subjects = data.research_topics.map( (item: { topic: any; }) => item.topic);
        this.subjects = data.research_topics.map( (item: { topic: any; }) => item.topic);
        //console.log(this.subjects.join(','));
      }
      this.productTypesControl.setValue(data.tipo);
      this.frecuenciesControl.setValue(data.frecuencia);
      this.publisherControl.setValue(data.publisher);
      this.sourceForm = this.sourceFormBuilder.group({
        titulo: new FormControl(data.titulo),
        issn_e: new FormControl(data.issn_e),
        issn_i: new FormControl(data.issn_i),
        publisher: this.publisherControl,
        fi: new FormControl(data.fi),
        jcr_q: new FormControl(data.jcr_q),
        scopus_q: new FormControl(data.scopus_q),
        aa_autor: new FormControl(data.aa_autor),
        aa_lector: new FormControl(data.aa_lector),
        area: new FormControl(data.area),
        url_normas: new FormControl(data.url_normas),
        plantillas: new FormControl(data.plantillas),
        coverletter: new FormControl(data.coverletter),
        cites_score: new FormControl(data.cites_score),
        doaj: new FormControl(data.doaj),
        jcr: new FormControl(data.jcr),
        scopus: new FormControl(data.scopus),
        conacyt: new FormControl(data.conacyt),
        apc_costo: new FormControl(data.apc_costo),
        license_condition: new FormControl(data.license_condition),
        persistent_article_identifier: new FormControl(data.persistent_article_identifier),
        article_meta_includes_orcid: new FormControl(data.article_meta_includes_orcid),
        clasif_conacyt: new FormControl(data.clasif_conacyt),
        create_time: new FormControl(data.create_time),
        update_time: new FormControl(data.update_time),
        editorial: new FormControl(data.editorial),
        proceeding: new FormControl(data.proceeding),
        acceso_abierto: new FormControl(data.acceso_abierto),
        scielo: new FormControl(data.scielo),
        rights_uri: new FormControl(data.rights_uri),
        isbn: new FormControl(data.isbn),
        subjects: new FormControl(this.subjects.join(',')),
        tipo_fuente: new FormControl(data.tipo_fuente),
        frecuencia: this.frecuenciesControl,
        idioma: this.languageControl,
        pais: this.countryControl,
      });
    });
  }

  loadLanguages = (): void => {
    this.catalogsService.getAllLanguages().subscribe((result: any) => {
      this.languages = result;
    });
  };

  loadCountry = (): void => {
    this.catalogsService.getAllCountries().subscribe((result: any) => {
      this.countries = result;
    });
  }

  loadPublishers = (): void => {
    this.catalogsService.getAllPublishers(this.textCriteria).subscribe((result: any) => {
      result.map((strValue: string) => {
        if (strValue !== null) {
          this.publishers.push(strValue);
        }
      });
    });
  }

  loadProductTypes = (): void => {
    this.catalogsService.getAllProductsTypes().subscribe((result: any) => {
      this.productTypes = result.map( (item: { tipo: any; }) => item.tipo);
    });
  }

  loadFrecuencies = (): void => {
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

  remove = (subject: string): void => {
    const index = this.subjects.indexOf(subject);

    if (index >= 0) {
      this.subjects.splice(index, 1);
    }
  }

  submit = (formData: any) => {
    let data = formData;
    data.create_time = new Date().getTime();
    data.update_time = new Date().getTime();
    data.deleted_at = null;
    data.research_topics = data.subjects.split(',');

    this.catalogsService.updateSource(this.id ,data).subscribe(
      (result:any) => {
        this.messageService.showPopupMessage(
          'Felicitaciones',
          'Se ha editado la fuente correctamente.',
          'success'
        );
        this.router.navigate(['admin/sources']);
      },
      (err:any) => {
        console.error(err);
        this.messageService.showPopupMessage(
          'Error',
          'Ha ocurrido un error al editar la fuente.',
          'error'
        );
      },
      () => {}
    );
  };

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
