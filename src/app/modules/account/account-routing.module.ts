import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountLayoutComponent } from 'src/app/components/auth/account-layout/account-layout.component';
import {LoginComponent} from "../../components/auth/login/login.component";

const routes: Routes = [
  {
    path: '', component: AccountLayoutComponent,
    children: [
      { path: 'logi', component: LoginComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
