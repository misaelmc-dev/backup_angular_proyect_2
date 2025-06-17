import { Component, OnInit } from '@angular/core';
import {GlobalsVars} from "../../../global/globals-vars";

@Component({
  selector: 'app-telescope',
  templateUrl: './telescope.component.html',
  styleUrls: ['./telescope.component.css']
})
export class TelescopeComponent implements OnInit {

  constructor(public globals: GlobalsVars) { }

  ngOnInit(): void {
  }

}
