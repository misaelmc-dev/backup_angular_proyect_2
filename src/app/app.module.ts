import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {GlobalsVars} from "./global/globals-vars";
import {SharedService} from "./services/shared.service";
import {ValidationService} from "./services/validation.service";
import {CatalogsService} from "./services/catalogs.service";
import {MessageService} from "./services/message.service";
import {QuoteService} from "./services/quote.service";
import {ResearcherService} from "./services/researcher.service";
import {ExportService} from "./services/export.service";
import {AdviserService} from "./services/adviser.service";
import {IndexComponent} from './components/index/index.component';
import {HomeAdmComponent} from './components/profiles/admin/home-adm/home-adm.component';
import {HomeAdvComponent} from './components/profiles/coord/home-adv/home-adv.component';
import {HomeResComponent} from './components/profiles/invest/home-res/home-res.component';
import {HeaderComponent} from './components/layouts/header/header.component';
import {FooterComponent} from './components/layouts/footer/footer.component';
import {BodyComponent} from './components/layouts/body/body.component';
import {RankingComponent} from './components/profiles/coord/ranking/ranking.component';
import {SearchAdvComponent} from './components/profiles/coord/search-adv/search-adv.component';
import {AuthenticationInterceptor} from "./interceptors/authentication-interceptor.service";
import {PageComponent} from './components/layouts/page/page.component';
import {ProductionComponent} from './components/profiles/invest/production/production.component';
import {ImpactComponent} from './components/profiles/invest/impact/impact.component';
import {CoauthorsComponent} from './components/profiles/invest/coauthors/coauthors.component';
import {SidebarComponent} from "./components/layouts/sidebar/sidebar.component";
import {AnalysisComponent} from './components/profiles/invest/analysis/analysis.component';
import {QuoteDetailComponent} from './components/profiles/invest/quote-detail/quote-detail.component';
import {QuotesAComponent} from './components/profiles/invest/quotes-a/quotes-a.component';
import {QuotesBComponent} from './components/profiles/invest/quotes-b/quotes-b.component';
import {QuotesComponent} from './components/profiles/admin/quotes/quotes.component';
import {CitedByComponent} from './components/profiles/invest/cited-by/cited-by.component';
import {NationalComponent} from './components/profiles/invest/national/national.component';
import {InternationalComponent} from './components/profiles/invest/international/international.component';
import {SafePipe} from "./pipes/safe.pipe";
import {QuotesReportComponent} from './components/profiles/invest/quotes-report/quotes-report.component';
import {HighchartsChartModule} from "highcharts-angular";
import {QuoteValidationComponent} from './components/profiles/admin/quote-validation/quote-validation.component';
import {ValidationComponent} from './components/profiles/admin/validation/validation.component';
import {ValidationFieldsComponent} from './components/profiles/admin/validation-fields/validation-fields.component';
import {InternationalAdComponent} from './components/profiles/coord/international-ad/international-ad.component';
import {NationalAdComponent} from './components/profiles/coord/national-ad/national-ad.component';
import {ResearchComponent} from './components/profiles/coord/research/research.component';
import {ImpactDashboardComponent} from './components/profiles/coord/impact-dashboard/impact-dashboard.component';
import {SourceComponent} from './components/profiles/admin/source/source.component';
import {SourceFormComponent} from './components/profiles/admin/source-form/source-form.component';
import {EditSourceComponent} from './components/profiles/admin/edit-source/edit-source.component';
import {CatalogsComponent} from './components/profiles/admin/catalogs/catalogs.component';
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SciProdComponent} from './components/profiles/invest/sci-prod/sci-prod.component';
import {NavigationDirective} from './directives/navigation.directive';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InfoBannerComponent} from './components/layouts/info-banner/info-banner.component';
import {ServerHttpInterceptor} from "./interceptors/server-http.interceptor";
import {CookieService} from "ngx-cookie-service";
import {NotFoundComponent} from './components/http/not-found/not-found.component';
import {UnauthorizedComponent} from './components/http/unauthorized/unauthorized.component';
import {AuthResponseInterceptor} from "./interceptors/auth-response-interceptor.service";
import {VisibilityTotalsComponent} from './components/layouts/visibility-totals/visibility-totals.component';
import {VisibilityTotalsDirective} from './directives/visibility-totals.directive';
import {ConcatNamePipe} from './pipes/concat-name.pipe';
import {MyZoneComponent} from './components/profiles/coord/my-zone/my-zone.component';
import {ProjectsComponent} from './components/profiles/coord/projects/projects.component';
import {ProjectDetailsComponent} from './components/profiles/coord/project-details/project-details.component';
import {OrderModule} from "ngx-order-pipe";
import {TempComponent} from './components/profiles/admin/temp/temp.component';
import {AccountLayoutComponent} from "./components/auth/account-layout/account-layout.component";
import {CommonModule} from "@angular/common";
import {LoginComponent} from "./components/auth/login/login.component";
import {ForgotPasswordEmailComponent} from './components/auth/forgot-password-email/forgot-password-email.component';
import {ForgotPasswordNewPasswdComponent} from './components/auth/forgot-password-new-passwd/forgot-password-new-passwd.component';
import {CacheInterceptor} from "./interceptors/cache.interceptor";
import {ProductValidationSelectionBySimilarityComponent} from './components/profiles/admin/product-validation-selection-by-similarity/product-validation-selection-by-similarity.component';
import {ColabCenterMainCoordComponent} from './components/profiles/coord/colab-center/colab-center-main/colab-center-main-coord.component';
import {ColabCenterOrigenInstitucionCoordComponent} from './components/profiles/coord/colab-center/colab-center-origen-institucion-coord/colab-center-origen-institucion-coord.component';
import {ColabCenterOrigenColegioCoordComponent} from './components/profiles/coord/colab-center/colab-center-origen-colegio-coord/colab-center-origen-colegio-coord.component';
import {ColabCenterOrigenLineaCoordComponent} from './components/profiles/coord/colab-center/colab-center-origen-linea-coord/colab-center-origen-linea-coord.component';
import {ColabCenterOrigenInvestigadorCoordComponent} from './components/profiles/coord/colab-center/colab-center-origen-investigador-coord/colab-center-origen-investigador-coord.component';
import {ColabCenterDestinoSeleccionCoordComponent} from './components/profiles/coord/colab-center/colab-center-destino-seleccion-coord/colab-center-destino-seleccion-coord.component';
import {ColabCenterDestinoProductoCoordComponent} from './components/profiles/coord/colab-center/colab-center-destino-producto-coord/colab-center-destino-producto-coord.component';
import {ColabCenterDestinoAnioCoordComponent} from './components/profiles/coord/colab-center/colab-center-destino-anio-coord/colab-center-destino-anio-coord.component';
import {ColabCenterDestinoInvestigadorCoordComponent} from './components/profiles/coord/colab-center/colab-center-destino-investigador-coord/colab-center-destino-investigador-coord.component';
import {ColabCenterDesgloseDestinoSeleccionCoordComponent} from './components/profiles/coord/colab-center/colab-center-desglose-destino-seleccion-coord/colab-center-desglose-destino-seleccion-coord.component';
import {ColabCenterDestinoInstitucionCoordComponent} from './components/profiles/coord/colab-center/colab-center-destino-institucion-coord/colab-center-destino-institucion-coord.component';
import {ColabCenterDestinoPaisCoordComponent} from './components/profiles/coord/colab-center/colab-center-destino-pais-coord/colab-center-destino-pais-coord.component';
import {NewProductComponent} from './components/profiles/admin/new-product/new-product.component';
import {NewCitationComponent} from './components/profiles/admin/new-citation/new-citation.component';
import {UvmLoginCallbackComponent} from './components/auth/uvm-login-callback/uvm-login-callback.component';
import {EventDetailsComponent} from './components/profiles/scicom/event-type-api/event-details/event-details.component';
import {EventListComponent} from './components/profiles/scicom/event-list/event-list.component';
import {EventCampusComponent} from './components/profiles/scicom/event-type-api/event-campus/event-campus.component';
import {EventEvaluationComponent} from './components/profiles/scicom/event-type-api/event-evaluation/event-evaluation.component';
import {EventPaymentsComponent} from './components/profiles/scicom/event-type-api/event-payments/event-payments.component';
import {EventWorkComponent} from './components/profiles/scicom/event-type-api/event-work/event-work.component';
import {EventFilesComponent} from './components/profiles/scicom/event-files/event-files.component';
import {DaterangerDirective} from './directives/dateranger.directive';
import {EventNewComponent} from './components/profiles/scicom/event-new/event-new.component';
import {LoadingModalComponent} from './components/layouts/loading-modal/loading-modal.component';
import {EventParticipantsComponent} from './components/profiles/scicom/event-participants/event-participants.component';
import {EventUpdateComponent} from './components/profiles/scicom/event-type-api/event-update/event-update.component';
import {EventCollaboratorsComponent} from './components/profiles/scicom/event-type-api/event-collaborators/event-collaborators.component';
import {EventTypeParticipationsComponent} from './components/profiles/scicom/event-type-api/event-type-participants/event-type-participations.component';
import {EventPaticipationDetailsComponent} from './components/profiles/scicom/event-paticipation-details/event-paticipation-details.component';
import {EventPaticipationNewComponent} from "./components/profiles/scicom/event-paticipation-new/event-paticipation-new.component";
import {EventWorkNewComponent} from './components/profiles/scicom/event-work-new/event-work-new.component';
import {WorkEvaluationsComponent} from './components/profiles/scicom/work-evaluations/work-evaluations.component';
import {PopoverDirective} from './directives/popover.directive';
import {TooltipDirective} from './directives/tooltip.directive';
import {EvaluationComponent} from './components/profiles/scicom/evaluation/evaluation.component';
import {EvaluationPlaceholderComponent} from './components/profiles/scicom/evaluation-placeholder/evaluation-placeholder.component';
import {WorkPaymentsComponent} from './components/profiles/scicom/work-payments/work-payments.component';
import {WorkPayDetailComponent} from './components/profiles/scicom/work-pay-detail/work-pay-detail.component';
import {WorksScicomComponent} from './components/profiles/admin/works-scicom/works-scicom.component';
import {ToolSourceComponent} from './components/profiles/scicom/tool-source/tool-source.component';
import {ToolSourceSimilarComponent} from './components/profiles/scicom/tool-source-similar/tool-source-similar.component';
import {ToolSumarySourceComponent} from './components/profiles/scicom/tool-sumary-source/tool-sumary-source.component';
import { ColabCenterOrigenCampusCoordComponent } from './components/profiles/coord/colab-center/colab-center-origen-campus-coord/colab-center-origen-campus-coord.component';
import { EventNewApiComponent } from './components/profiles/scicom/event-type-api/event-new-api/event-new-api.component';
import { EventNewForumComponent } from './components/profiles/scicom/event-type-forum/event-new-forum/event-new-forum.component';
import { EventNewEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-new-encounter/event-new-encounter.component';
import { EventFilesForumComponent } from './components/profiles/scicom/event-type-forum/event-files-forum/event-files-forum.component';
import { EventCollaboratorsForumComponent } from './components/profiles/scicom/event-type-forum/event-collaborators-forum/event-collaborators-forum.component';
import { EventFilesEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-files-encounter/event-files-encounter.component';
import { EventCollaboratorsEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-collaborators-encounter/event-collaborators-encounter.component';
import { EventUpdateEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-update-encounter/event-update-encounter.component';
import { EventUpdateForumComponent } from './components/profiles/scicom/event-type-forum/event-update-forum/event-update-forum.component';
import { EventDetailsEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-details-encounter/event-details-encounter.component';
import { EventDetailsForumComponent } from './components/profiles/scicom/event-type-forum/event-details-forum/event-details-forum.component';
import { EventParticipationsEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-participations-encounter/event-participations-encounter.component';
import { EventParticipationsForumComponent } from './components/profiles/scicom/event-type-forum/event-participations-forum/event-participations-forum.component';
import { EventCampusEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-campus-encounter/event-campus-encounter.component';
import { EventCampusForumComponent } from './components/profiles/scicom/event-type-forum/event-campus-forum/event-campus-forum.component';
import { EventParticipationNewEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-participation-new-encounter/event-participation-new-encounter.component';
import { EventParticipationNewForumComponent } from './components/profiles/scicom/event-type-forum/event-participation-new-forum/event-participation-new-forum.component';
import { EventParticipationPronosticEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-participation-pronostic-encounter/event-participation-pronostic-encounter.component';
import { EventParticipationFilesEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-participation-files-encounter/event-participation-files-encounter.component';
import { EventParticipationDetailsEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-participation-details-encounter/event-participation-details-encounter.component';
import { EventParticipationWorksEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-participation-works-encounter/event-participation-works-encounter.component';
import { EventParticipationCartelsEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-participation-cartels-encounter/event-participation-cartels-encounter.component';
import { EventObjectivesEncounterComponent } from './components/profiles/scicom/event-type-encounter/event-objectives-encounter/event-objectives-encounter.component';
import { EventObjectivesForumComponent } from './components/profiles/scicom/event-type-forum/event-objectives-forum/event-objectives-forum.component';
import { EventParticipationCartelsForumComponent } from './components/profiles/scicom/event-type-forum/event-participation-cartels-forum/event-participation-cartels-forum.component';
import { EventParticipationDetailsForumComponent } from './components/profiles/scicom/event-type-forum/event-participation-details-forum/event-participation-details-forum.component';
import { EventParticipationFilesForumComponent } from './components/profiles/scicom/event-type-forum/event-participation-files-forum/event-participation-files-forum.component';
import { EventParticipationPronosticForumComponent } from './components/profiles/scicom/event-type-forum/event-participation-pronostic-forum/event-participation-pronostic-forum.component';
import { EventParticipationWorksForumComponent } from './components/profiles/scicom/event-type-forum/event-participation-works-forum/event-participation-works-forum.component';
import { StatisticsApiComponent } from './components/profiles/scicom/event-type-api/statistics-api/statistics-api.component';
import { StatisticsEncounterComponent } from './components/profiles/scicom/event-type-encounter/statistics-encounter/statistics-encounter.component';
import { StatisticsForumComponent } from './components/profiles/scicom/event-type-forum/statistics-forum/statistics-forum.component';
import { TelescopeComponent } from './components/telescope/telescope/telescope.component';
import {ModalInstitutionReportComponent} from "./components/profiles/scicom/event-type-forum/modal-institution-report/modal-institution-report.component";
import { MyZoneInvestComponent } from './components/profiles/invest/my-zone-invest/my-zone-invest.component';
import { MyImpactComponent } from './components/profiles/coord/my-impact/my-impact.component';
import { MyImpactInvestComponent } from './components/profiles/invest/my-impact-invest/my-impact-invest.component';
import { LinesResearchComponent } from './components/profiles/admin/lines-research/lines-research.component';
import { StudentsComponent } from './components/profiles/admin/students/students.component';
import { KnowledgeAreasComponent } from './components/profiles/admin/knowledge-areas/knowledge-areas.component';
import { UniversityCampusComponent } from './components/profiles/admin/university-campus/university-campus.component';
import { ResearchCentersComponent } from './components/profiles/admin/research-centers/research-centers.component';
import { AccessRightsComponent } from './components/profiles/admin/access-rights/access-rights.component';
import { SchoolsComponent } from './components/profiles/admin/schools/schools.component';
import { DisciplinesComponent } from './components/profiles/admin/disciplines/disciplines.component';
import { LanguagesComponent } from './components/profiles/admin/languages/languages.component';
import { CountriesComponent } from './components/profiles/admin/countries/countries.component';
import { TypesProductComponent } from './components/profiles/admin/types-product/types-product.component';
import { TypesProjectComponent } from './components/profiles/admin/types-project/types-project.component';
import { InstitutionsRorComponent } from './components/profiles/admin/institutions-ror/institutions-ror.component';
import { InstitutionsScintraComponent } from './components/profiles/admin/institutions-scintra/institutions-scintra.component';
import { ModalReportAnualComponent } from './components/profiles/scicom/modal-report-anual/modal-report-anual.component';
import { ModalReportInstitutionComponent } from './components/profiles/scicom/modal-report-institution/modal-report-institution.component';
import { InvestigatorsComponent } from './components/profiles/admin/investigators/investigators.component';
import { InvestigatorCampusComponent } from './components/profiles/admin/investigators/investigator-campus/investigator-campus.component';
import { InvestigatorSchoolsComponent } from './components/profiles/admin/investigators/investigator-schools/investigator-schools.component';
import { InvestigatorCentersComponent } from './components/profiles/admin/investigators/investigator-centers/investigator-centers.component';
import { InvestigatorRedesComponent } from './components/profiles/admin/investigators/investigator-redes/investigator-redes.component';
import { InvestigatorLinesComponent } from './components/profiles/admin/investigators/investigator-lines/investigator-lines.component';
import { InvestigatorSniAreasComponent } from './components/profiles/admin/investigators/investigator-sni-areas/investigator-sni-areas.component';
import { InvestigatorSniLevelsComponent } from './components/profiles/admin/investigators/investigator-sni-levels/investigator-sni-levels.component';
import { SourcesComponent } from './components/profiles/admin/sources/sources.component';
import { SourceSimilarComponent } from './components/profiles/admin/sources/source-similar/source-similar.component';
import { SourceLanguagesComponent } from './components/profiles/admin/sources/source-languages/source-languages.component';
import { SourceCountryComponent } from './components/profiles/admin/sources/source-country/source-country.component';
import { SourceResearchTopicsComponent } from './components/profiles/admin/sources/source-research-topics/source-research-topics.component';
import { SourceQuartilsComponent } from './components/profiles/admin/sources/source-quartils/source-quartils.component';
import { SourceLifetimesComponent } from './components/profiles/admin/sources/source-lifetimes/source-lifetimes.component';
import { SourceHistoryComponent } from './components/profiles/admin/sources/source-history/source-history.component';
import { Select2Directive } from './directives/select2.directive';
import { FiltroAvanzadoComponent } from './components/layouts/filtro-avanzado/filtro-avanzado.component';
import { FiltroCheckboxComponent } from './components/layouts/filtro-checkbox/filtro-checkbox.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountLayoutComponent,
    IndexComponent,
    HomeAdmComponent,
    HomeAdvComponent,
    HomeResComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    RankingComponent,
    SearchAdvComponent,
    PageComponent,
    ProductionComponent,
    ImpactComponent,
    CoauthorsComponent,
    SidebarComponent,
    AnalysisComponent,
    QuoteDetailComponent,
    QuotesAComponent,
    QuotesBComponent,
    QuotesComponent,
    CitedByComponent,
    NationalComponent,
    InternationalComponent,
    SafePipe,
    QuotesReportComponent,
    QuoteValidationComponent,
    ValidationComponent,
    ValidationFieldsComponent,
    InternationalAdComponent,
    NationalAdComponent,
    ResearchComponent,
    ImpactDashboardComponent,
    SourceComponent,
    SourceFormComponent,
    EditSourceComponent,
    CatalogsComponent,
    SciProdComponent,
    NavigationDirective,
    InfoBannerComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    VisibilityTotalsComponent,
    VisibilityTotalsDirective,
    ConcatNamePipe,
    MyZoneComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    TempComponent,
    LoginComponent,
    ForgotPasswordEmailComponent,
    ForgotPasswordNewPasswdComponent,
    ProductValidationSelectionBySimilarityComponent,
    ColabCenterMainCoordComponent,
    ColabCenterOrigenInstitucionCoordComponent,
    ColabCenterOrigenColegioCoordComponent,
    ColabCenterOrigenLineaCoordComponent,
    ColabCenterOrigenInvestigadorCoordComponent,
    ColabCenterDestinoSeleccionCoordComponent,
    ColabCenterDestinoProductoCoordComponent,
    ColabCenterDestinoAnioCoordComponent,
    ColabCenterDestinoInvestigadorCoordComponent,
    ColabCenterDesgloseDestinoSeleccionCoordComponent,
    ColabCenterDestinoInstitucionCoordComponent,
    ColabCenterDestinoPaisCoordComponent,
    NewProductComponent,
    NewCitationComponent,
    UvmLoginCallbackComponent,
    EventDetailsComponent,
    EventListComponent,
    EventCampusComponent,
    EventEvaluationComponent,
    EventPaymentsComponent,
    EventWorkComponent,
    EventFilesComponent,
    DaterangerDirective,
    EventNewComponent,
    LoadingModalComponent,
    EventParticipantsComponent,
    EventUpdateComponent,
    EventCollaboratorsComponent,
    EventTypeParticipationsComponent,
    EventPaticipationDetailsComponent,
    EventPaticipationNewComponent,
    EventWorkNewComponent,
    WorkEvaluationsComponent,
    PopoverDirective,
    TooltipDirective,
    EvaluationComponent,
    EvaluationPlaceholderComponent,
    WorkPaymentsComponent,
    WorkPayDetailComponent,
    WorksScicomComponent,
    ToolSourceComponent,
    ToolSourceSimilarComponent,
    ToolSumarySourceComponent,
    ColabCenterOrigenCampusCoordComponent,
    EventNewApiComponent,
    EventNewForumComponent,
    EventNewEncounterComponent,
    EventFilesForumComponent,
    EventCollaboratorsForumComponent,
    EventFilesEncounterComponent,
    EventCollaboratorsEncounterComponent,
    EventUpdateEncounterComponent,
    EventUpdateForumComponent,
    EventDetailsEncounterComponent,
    EventDetailsForumComponent,
    EventParticipationsEncounterComponent,
    EventParticipationsForumComponent,
    EventCampusEncounterComponent,
    EventCampusForumComponent,
    EventParticipationNewEncounterComponent,
    EventParticipationNewForumComponent,
    EventParticipationPronosticEncounterComponent,
    EventParticipationFilesEncounterComponent,
    EventParticipationDetailsEncounterComponent,
    EventParticipationWorksEncounterComponent,
    EventParticipationCartelsEncounterComponent,
    EventObjectivesEncounterComponent,
    EventObjectivesForumComponent,
    EventParticipationCartelsForumComponent,
    EventParticipationDetailsForumComponent,
    EventParticipationFilesForumComponent,
    EventParticipationPronosticForumComponent,
    EventParticipationWorksForumComponent,
    StatisticsApiComponent,
    StatisticsEncounterComponent,
    StatisticsForumComponent,
    TelescopeComponent,
    ModalInstitutionReportComponent,
    MyZoneInvestComponent,
    MyImpactComponent,
    MyImpactInvestComponent,
    LinesResearchComponent,
    StudentsComponent,
    KnowledgeAreasComponent,
    UniversityCampusComponent,
    ResearchCentersComponent,
    AccessRightsComponent,
    SchoolsComponent,
    DisciplinesComponent,
    LanguagesComponent,
    CountriesComponent,
    TypesProductComponent,
    TypesProjectComponent,
    InstitutionsRorComponent,
    InstitutionsScintraComponent,
    ModalReportAnualComponent,
    ModalReportInstitutionComponent,
    InvestigatorsComponent,
    InvestigatorCampusComponent,
    InvestigatorSchoolsComponent,
    InvestigatorCentersComponent,
    InvestigatorRedesComponent,
    InvestigatorLinesComponent,
    InvestigatorSniAreasComponent,
    InvestigatorSniLevelsComponent,
    SourcesComponent,
    SourceSimilarComponent,
    SourceLanguagesComponent,
    SourceCountryComponent,
    SourceResearchTopicsComponent,
    SourceQuartilsComponent,
    SourceLifetimesComponent,
    SourceHistoryComponent,
    Select2Directive,
    FiltroAvanzadoComponent,
    FiltroCheckboxComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    OrderModule,
    CommonModule,
  ],
  providers: [
    HttpClient,
    GlobalsVars,
    SharedService,
    ValidationService,
    CatalogsService,
    MessageService,
    QuoteService,
    ResearcherService,
    ExportService,
    AdviserService,
    CookieService,
    { //este interceptor siempre debe ir primero para verificar la autenticación desde el backend
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },/*
    { //todo NO OLVIDAR APAGAR ESTE INTERCEPTOR ANTES DE SUBIR A PRODUCCIÓN, es solo para pruebas en local OJOOO
      provide: HTTP_INTERCEPTORS,
      useClass: ServerHttpInterceptor,
      multi: true
    }*/
  ],
  exports: [
    TooltipDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
