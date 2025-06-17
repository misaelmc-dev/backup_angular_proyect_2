import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  isLogged: boolean = false;

  constructor(private authService: AuthService) {
    //this.isLogged = this.authService.loggedIn();
    this.isLogged = true;
  }

  ngOnInit(): void {
    //console.log('Porbando page')
  }

}
