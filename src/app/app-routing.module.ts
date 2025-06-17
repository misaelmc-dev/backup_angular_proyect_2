import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeAdvComponent} from "./components/profiles/coord/home-adv/home-adv.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {HomeResComponent} from "./components/profiles/invest/home-res/home-res.component";
import {AnalysisComponent} from "./components/profiles/invest/analysis/analysis.component";
import {QuoteDetailComponent} from "./components/profiles/invest/quote-detail/quote-detail.component";
import {CitedByComponent} from "./components/profiles/invest/cited-by/cited-by.component";
import {NationalComponent} from "./components/profiles/invest/national/national.component";
import {InternationalComponent} from "./components/profiles/invest/international/international.component";
import {QuotesReportComponent} from "./components/profiles/invest/quotes-report/quotes-report.component";
import {ValidationComponent} from "./components/profiles/admin/validation/validation.component";
import {QuotesComponent} from "./components/profiles/admin/quotes/quotes.component";
import {ResearchComponent} from "./components/profiles/coord/research/research.component";
import {ImpactDashboardComponent} from "./components/profiles/coord/impact-dashboard/impact-dashboard.component";
import {SourceFormComponent} from './components/profiles/admin/source-form/source-form.component';
import {ValidationFieldsComponent} from "./components/profiles/admin/validation-fields/validation-fields.component";
import {QuoteValidationComponent} from "./components/profiles/admin/quote-validation/quote-validation.component";
import {NotFoundComponent} from "./components/http/not-found/not-found.component";
import {UnauthorizedComponent} from "./components/http/unauthorized/unauthorized.component";
import {EditSourceComponent} from "./components/profiles/admin/edit-source/edit-source.component";
import {NationalAdComponent} from './components/profiles/coord/national-ad/national-ad.component';
import {InternationalAdComponent} from './components/profiles/coord/international-ad/international-ad.component';
import {MyZoneComponent} from "./components/profiles/coord/my-zone/my-zone.component";
import {MyZoneInvestComponent} from "./components/profiles/invest/my-zone-invest/my-zone-invest.component";
import {MyImpactComponent} from "./components/profiles/coord/my-impact/my-impact.component";
import {MyImpactInvestComponent} from "./components/profiles/invest/my-impact-invest/my-impact-invest.component";
import {ProjectsComponent} from "./components/profiles/coord/projects/projects.component";
import {ProjectDetailsComponent} from './components/profiles/coord/project-details/project-details.component';
import {ProductionComponent} from "./components/profiles/invest/production/production.component";
import {CoauthorsComponent} from "./components/profiles/invest/coauthors/coauthors.component";
import {AccountLayoutComponent} from "./components/auth/account-layout/account-layout.component";
import {PageComponent} from "./components/layouts/page/page.component";
import {NonAuthGuard} from "./guards/non-auth.guard";
import {ForgotPasswordEmailComponent} from "./components/auth/forgot-password-email/forgot-password-email.component";
import {ForgotPasswordNewPasswdComponent} from "./components/auth/forgot-password-new-passwd/forgot-password-new-passwd.component";
import {
  ProductValidationSelectionBySimilarityComponent
} from "./components/profiles/admin/product-validation-selection-by-similarity/product-validation-selection-by-similarity.component";
import {ColabCenterMainCoordComponent} from "./components/profiles/coord/colab-center/colab-center-main/colab-center-main-coord.component";
import {NewProductComponent} from "./components/profiles/admin/new-product/new-product.component";
import {NewCitationComponent} from "./components/profiles/admin/new-citation/new-citation.component";
import {UvmLoginCallbackComponent} from "./components/auth/uvm-login-callback/uvm-login-callback.component";
import {EventListComponent} from "./components/profiles/scicom/event-list/event-list.component";
import {EventDetailsComponent} from "./components/profiles/scicom/event-type-api/event-details/event-details.component";
import {EventNewComponent} from "./components/profiles/scicom/event-new/event-new.component";
import {ScicomGuard} from "./guards/scicom.guard";
import {EventParticipantsComponent} from "./components/profiles/scicom/event-participants/event-participants.component";
import {EventUpdateComponent} from "./components/profiles/scicom/event-type-api/event-update/event-update.component";
import {EventUpdateEncounterComponent} from "./components/profiles/scicom/event-type-encounter/event-update-encounter/event-update-encounter.component";
import {EventUpdateForumComponent} from "./components/profiles/scicom/event-type-forum/event-update-forum/event-update-forum.component";
import {EventPaticipationNewComponent} from "./components/profiles/scicom/event-paticipation-new/event-paticipation-new.component";
import {EventPaticipationDetailsComponent} from "./components/profiles/scicom/event-paticipation-details/event-paticipation-details.component";
import {EventWorkNewComponent} from "./components/profiles/scicom/event-work-new/event-work-new.component";
import {VerFichaTecnicaGuard} from "./guards/scicom/ver-ficha-tecnica.guard";
import {VerCampusEventoGuard} from "./guards/scicom/ver-campus-evento.guard";
import {VerTiposEvalEventoGuard} from "./guards/scicom/ver-tipos-eval-evento.guard";
import {VerTiposPagoEventoGuard} from "./guards/scicom/ver-tipos-pago-evento.guard";
import {VerTiposParticipacionEventoGuard} from "./guards/scicom/ver-tipos-participacion-evento.guard";
import {VerTiposTrabajoEventoGuard} from "./guards/scicom/ver-tipos-trabajo-evento.guard";
import {VerColaboradoresEventoGuard} from "./guards/scicom/ver-colaboradores-evento.guard";
import {VerArchivosEventoGuard} from "./guards/scicom/ver-archivos-evento.guard";
import {EvaluationComponent} from "./components/profiles/scicom/evaluation/evaluation.component";
import {
  EvaluationPlaceholderComponent
} from "./components/profiles/scicom/evaluation-placeholder/evaluation-placeholder.component";
import {WorkPaymentsComponent} from "./components/profiles/scicom/work-payments/work-payments.component";
import {WorkPayDetailComponent} from "./components/profiles/scicom/work-pay-detail/work-pay-detail.component";
import {AgregarPagoEstimuloApiTrabajoGuard} from "./guards/scicom/agregar-pago-estimulo-api-trabajo.guard";
import {WorksScicomComponent} from "./components/profiles/admin/works-scicom/works-scicom.component";
import {ToolSourceComponent} from "./components/profiles/scicom/tool-source/tool-source.component";
import {
  ToolSourceSimilarComponent
} from "./components/profiles/scicom/tool-source-similar/tool-source-similar.component";
import {ToolSumarySourceComponent} from "./components/profiles/scicom/tool-sumary-source/tool-sumary-source.component";
import {
  EventDetailsEncounterComponent
} from "./components/profiles/scicom/event-type-encounter/event-details-encounter/event-details-encounter.component";
import {
  EventParticipationsEncounterComponent
} from "./components/profiles/scicom/event-type-encounter/event-participations-encounter/event-participations-encounter.component";
import {
  EventDetailsForumComponent
} from "./components/profiles/scicom/event-type-forum/event-details-forum/event-details-forum.component";
import {
  EventParticipationsForumComponent
} from "./components/profiles/scicom/event-type-forum/event-participations-forum/event-participations-forum.component";
import {EventParticipationNewEncounterComponent} from "./components/profiles/scicom/event-type-encounter/event-participation-new-encounter/event-participation-new-encounter.component";
import {EventParticipationNewForumComponent} from "./components/profiles/scicom/event-type-forum/event-participation-new-forum/event-participation-new-forum.component";
import {EventParticipationFilesEncounterComponent} from "./components/profiles/scicom/event-type-encounter/event-participation-files-encounter/event-participation-files-encounter.component";
import {EventParticipationDetailsEncounterComponent} from "./components/profiles/scicom/event-type-encounter/event-participation-details-encounter/event-participation-details-encounter.component";
import {EventParticipationFilesForumComponent} from "./components/profiles/scicom/event-type-forum/event-participation-files-forum/event-participation-files-forum.component";
import {EventParticipationDetailsForumComponent} from "./components/profiles/scicom/event-type-forum/event-participation-details-forum/event-participation-details-forum.component";
import {StatisticsApiComponent} from "./components/profiles/scicom/event-type-api/statistics-api/statistics-api.component";
import {StatisticsEncounterComponent} from "./components/profiles/scicom/event-type-encounter/statistics-encounter/statistics-encounter.component";
import {StatisticsForumComponent} from "./components/profiles/scicom/event-type-forum/statistics-forum/statistics-forum.component";
import {TelescopeComponent} from "./components/telescope/telescope/telescope.component";
import {LinesResearchComponent} from "./components/profiles/admin/lines-research/lines-research.component";
import {StudentsComponent} from "./components/profiles/admin/students/students.component";
import {KnowledgeAreasComponent} from "./components/profiles/admin/knowledge-areas/knowledge-areas.component";
import {UniversityCampusComponent} from "./components/profiles/admin/university-campus/university-campus.component";
import {ResearchCentersComponent} from "./components/profiles/admin/research-centers/research-centers.component";
import {AccessRightsComponent} from "./components/profiles/admin/access-rights/access-rights.component";
import {SchoolsComponent} from "./components/profiles/admin/schools/schools.component";
import {DisciplinesComponent} from "./components/profiles/admin/disciplines/disciplines.component";
import {LanguagesComponent} from "./components/profiles/admin/languages/languages.component";
import {CountriesComponent} from "./components/profiles/admin/countries/countries.component";
import {TypesProductComponent} from "./components/profiles/admin/types-product/types-product.component";
import {TypesProjectComponent} from "./components/profiles/admin/types-project/types-project.component";
import {InstitutionsRorComponent} from "./components/profiles/admin/institutions-ror/institutions-ror.component";
import {
  InstitutionsScintraComponent
} from "./components/profiles/admin/institutions-scintra/institutions-scintra.component";
import {InvestigatorsComponent} from "./components/profiles/admin/investigators/investigators.component";
import {SourcesComponent} from "./components/profiles/admin/sources/sources.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
    /*component: NotFoundComponent*/
  },
  {
    path: '',
    component: PageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'coord/:id',
        /*canActivate: [CoordGuard],*/
        children: [
          {
            path: '',
            component: HomeAdvComponent
          },
          {
            path: 'research',
            component: ResearchComponent,
          },
          {
            path: 'impact-dashboard',
            component: ImpactDashboardComponent,
          },
          {
            path: 'national-ad',
            component: NationalAdComponent,
          },
          {
            path: 'international-ad',
            component: InternationalAdComponent,
          },
          {
            path: 'myzone',
            children: [
              {
                path: 'production',
                component: MyZoneComponent,
              },
              {
                path: 'impact',
                component: MyImpactComponent,
              },
            ]
          },
          {
            path: 'projects',
            component: ProjectsComponent,
          },
          {
            path: 'project/:proyectId',
            component: ProjectDetailsComponent,
          },
          {
            path: 'colab-center',
            component: ColabCenterMainCoordComponent,
          },
          {
            path: 'tool-source',
            component: ToolSourceComponent,
          },
          {
            path: 'tool-similar-source',
            component: ToolSourceSimilarComponent,
          },
          {
            path: 'tool-sumary-source',
            component: ToolSumarySourceComponent,
          },
          {
            path: 'statistics-api',
            component: StatisticsApiComponent,
          },
          {
            path: 'statistics-encounter',
            component: StatisticsEncounterComponent,
          },
          {
            path: 'statistics-forum',
            component: StatisticsForumComponent,
          },
          {
            path: '**',
            redirectTo: '/not-found',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'invest/:id',
        /*canActivate: [InvestGuard],*/
        children: [
          {
            path: '',
            component: HomeResComponent
          },
          {
            path: 'analysis',
            component: AnalysisComponent
          },
          {
            path: 'quote-detail/:productId',
            component: QuoteDetailComponent,
          },
          {
            path: 'quotes/:productId',
            component: CitedByComponent,
          },
          {
            path: 'national',
            component: NationalComponent,
          },
          {
            path: 'international',
            component: InternationalComponent,
          },
          {
            path: 'sci-prod',
            component: ProductionComponent,
          },
          {
            path: 'coauthors',
            component: CoauthorsComponent,
          },
          {
            path: 'quotes-report',
            component: QuotesReportComponent,
          },
          {
            path: 'tool-source',
            component: ToolSourceComponent,
          },
          {
            path: 'tool-similar-source',
            component: ToolSourceSimilarComponent,
          },
          {
            path: 'tool-sumary-source',
            component: ToolSumarySourceComponent,
          },
          {
            path: 'myzone',
            children: [
              {
                path: 'production',
                component: MyZoneInvestComponent,
              },
              {
                path: 'impact',
                component: MyImpactInvestComponent,
              },
            ]
          },
          {
            path: '**',
            redirectTo: '/not-found',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'admin',
        /*canActivate:[AdminGuard],*/
        children: [
          {
            path: 'products',
            component: ValidationComponent,
          },
          /*{
            path: 'sources',
            component: SourceComponent,
          },*/
          {
            path: 'quotes/:id',
            component: QuotesComponent,
          },
          {
            path: 'source-form',
            component: SourceFormComponent,
          },
          {
            path: 'edit-source/:id',
            component: EditSourceComponent,
          },
          {
            path: 'validation-form/:id',
            component: ValidationFieldsComponent,
          },
          {
            path: 'quote-validation/:id',
            component: QuoteValidationComponent,
          },
          {
            path: 'validation/products/:id/similar',
            component: ProductValidationSelectionBySimilarityComponent
          },
          {
            path: 'new-product',
            component: NewProductComponent,
          },
          {
            path: 'new-citation/:id',
            component: NewCitationComponent,
          },
          {
            path: 'works-scicom',
            component: WorksScicomComponent,
          },
          {
            path: 'tool-source',
            component: ToolSourceComponent,
          },
          {
            path: 'tool-similar-source',
            component: ToolSourceSimilarComponent,
          },
          {
            path: 'tool-sumary-source',
            component: ToolSumarySourceComponent,
          },
          {
            path: 'line-research',
            component: LinesResearchComponent,
          },
          {
            path: 'students',
            component: StudentsComponent,
          },
          {
            path: 'knowledge-areas',
            component: KnowledgeAreasComponent,
          },
          {
            path: 'university-campus',
            component: UniversityCampusComponent,
          },
          {
            path: 'research-centers',
            component: ResearchCentersComponent,
          },
          {
            path: 'access-rights',
            component: AccessRightsComponent,
          },
          {
            path: 'schools',
            component: SchoolsComponent,
          },
          {
            path: 'disciplines',
            component: DisciplinesComponent,
          },
          {
            path: 'sources-list',
            component: SourcesComponent,
          },
          {
            path: 'languages',
            component: LanguagesComponent,
          },
          {
            path: 'countries',
            component: CountriesComponent,
          },
          {
            path: 'types-product',
            component: TypesProductComponent,
          },
          {
            path: 'types-project',
            component: TypesProjectComponent,
          },
          {
            path: 'institution-ror',
            component: InstitutionsRorComponent,
          },
          {
            path: 'institution',
            component: InstitutionsScintraComponent,
          },
          {
            path: 'investigators',
            component: InvestigatorsComponent,
          },
          {
            path: '',
            redirectTo: 'products',
            pathMatch: 'full'
          },
          {
            path: '**',
            redirectTo: '/not-found',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'scicom',
        children: [
          {
            path: 'event-list',
            component: EventListComponent,
          },
          {
            path: 'event-new',
            /*canActivate: [CoordGuard],*/
            canDeactivate:[ScicomGuard],
            component: EventNewComponent,
          },
          {
            path: 'tool-source',
            component: ToolSourceComponent,
          },
          {
            path: 'tool-similar-source',
            component: ToolSourceSimilarComponent,
          },
          {
            path: 'tool-sumary-source',
            component: ToolSumarySourceComponent,
          },
          {
            path: 'api',
            children: [
              {
                path: 'event-details/:idevent',
                canActivate:[VerFichaTecnicaGuard],
                component: EventDetailsComponent,
              },
              {
                path: 'event-update/:idevent/datos-generales',
                canActivate:[VerFichaTecnicaGuard],
                component: EventUpdateComponent,
              },
              {
                path: 'event-update/:idevent/event-campus',
                canActivate:[VerCampusEventoGuard],
                component: EventUpdateComponent,
              },
              {
                path: 'event-update/:idevent/event-evaluation',
                canActivate:[VerTiposEvalEventoGuard],
                component: EventUpdateComponent,
              },
              {
                path: 'event-update/:idevent/event-payments',
                canActivate:[VerTiposPagoEventoGuard],
                component: EventUpdateComponent,
              },
              {
                path: 'event-update/:idevent/event-type-participations',
                canActivate:[VerTiposParticipacionEventoGuard],
                component: EventUpdateComponent,
              },
              {
                path: 'event-update/:idevent/event-work',
                canActivate:[VerTiposTrabajoEventoGuard],
                component: EventUpdateComponent,
              },
              {
                path: 'event-update/:idevent/event-collaborators',
                canActivate:[VerColaboradoresEventoGuard],
                component: EventUpdateComponent,
              },
              {
                path: ':idevent/event-files',
                canActivate:[VerArchivosEventoGuard],
                component: EventUpdateComponent,
              },
              {
                path: ':idevent/event-participations',
                component: EventParticipantsComponent,
              },
              {
                path: ':idevent/event-participation-new/:iduser',
                component: EventPaticipationNewComponent,
              },
              {
                path: ':idevent/event-participation-details/:idpart',
                component: EventPaticipationDetailsComponent,
              },
              {
                path: ':eventoId/evaluation/:trabajoId/:idtipeval',
                component: EvaluationComponent,
              },
              {
                path: 'event-work-new',
                component: EventWorkNewComponent,
              },
              {
                path: ':idevent/work-evaluation/:idtipeval',
                component: EvaluationPlaceholderComponent,
              },
              {
                path: ':idevent/work-payments',
                canActivate: [AgregarPagoEstimuloApiTrabajoGuard],
                component: WorkPaymentsComponent,
              },
              {
                path: ':eventoId/work-pay-detail/:trabajoId',
                canActivate: [AgregarPagoEstimuloApiTrabajoGuard],
                component: WorkPayDetailComponent,
              },
              {
                path: '**',
                redirectTo: '/not-found',
                pathMatch: 'full'
              }
            ]
          },
          {
            path: 'encuentro',
            children: [
              {
                path: 'event-details/:idevent',
                canActivate:[VerFichaTecnicaGuard],
                component: EventDetailsEncounterComponent,
              },
              {
                path: 'event-update/:idevent/datos-generales',
                canActivate:[VerFichaTecnicaGuard],
                component: EventUpdateEncounterComponent,
              },
              {
                path: 'event-update/:idevent/event-campus',
                canActivate:[VerFichaTecnicaGuard],
                component: EventUpdateEncounterComponent,
              },
              {
                path: 'event-update/:idevent/event-ods',
                canActivate:[VerFichaTecnicaGuard],
                component: EventUpdateEncounterComponent,
              },
              {
                path: 'event-update/:idevent/event-collaborators',
                canActivate:[VerColaboradoresEventoGuard],
                component: EventUpdateEncounterComponent,
              },
              {
                path: ':idevent/event-files',
                canActivate:[VerArchivosEventoGuard],
                component: EventUpdateEncounterComponent,
              },
              {
                path: ':idevent/event-participations',
                component: EventParticipationsEncounterComponent,
              },
              {
                path: ':idevent/event-participation-new/:iduser',
                component: EventParticipationNewEncounterComponent
              },
              {
                path: ':idevent/event-participation-details/:idpart',
                component: EventParticipationDetailsEncounterComponent,
              },
              {
                path: ':event-participation-files',
                component: EventParticipationFilesEncounterComponent
              },
              {
                path: '**',
                redirectTo: '/not-found',
                pathMatch: 'full'
              }
            ]
          },
          {
            path: 'foro',
            children: [
              {
                path: 'event-details/:idevent',
                canActivate:[VerFichaTecnicaGuard],
                component: EventDetailsForumComponent,
              },
              {
                path: 'event-update/:idevent/datos-generales',
                canActivate:[VerFichaTecnicaGuard],
                component: EventUpdateForumComponent,
              },
              {
                path: 'event-update/:idevent/event-campus',
                canActivate:[VerFichaTecnicaGuard],
                component: EventUpdateForumComponent,
              },
              {
                path: 'event-update/:idevent/event-ods',
                canActivate:[VerFichaTecnicaGuard],
                component: EventUpdateForumComponent,
              },
              {
                path: 'event-update/:idevent/event-collaborators',
                canActivate:[VerColaboradoresEventoGuard],
                component: EventUpdateForumComponent,
              },
              {
                path: ':idevent/event-files',
                canActivate:[VerArchivosEventoGuard],
                component: EventUpdateForumComponent,
              },
              {
                path: ':idevent/event-participations',
                component: EventParticipationsForumComponent,
              },
              {
                path: ':idevent/event-participation-new/:iduser',
                component: EventParticipationNewForumComponent
              },
              {
                path: ':idevent/event-participation-details/:idpart',
                component: EventParticipationDetailsForumComponent,
              },
              {
                path: ':event-participation-files',
                component: EventParticipationFilesForumComponent
              },
              {
                path: '**',
                redirectTo: '/not-found',
                pathMatch: 'full'
              }
            ]
          },
          {
            path: '',
            redirectTo: 'event-list',
            pathMatch: 'full'
          },
          {
            path: '**',
            redirectTo: '/not-found',
            pathMatch: 'full'
          },
          {
            path: ':coord',
            children: [
              {
                path: '**',
                redirectTo: '/not-found',
                pathMatch: 'full'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: AccountLayoutComponent,
    children: [
      {
        path: 'login',
        canActivate: [NonAuthGuard],
        component: LoginComponent
      },
    ]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordEmailComponent
  },
  {
    path: 'uvmlogincallback',
    canActivate: [NonAuthGuard],
    component: UvmLoginCallbackComponent
  },
  {
    path: 'reset-password/:token',
    component: ForgotPasswordNewPasswdComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: 'telescope',
    component: TelescopeComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
