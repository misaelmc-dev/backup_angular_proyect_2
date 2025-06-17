import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-evaluation-placeholder',
  templateUrl: './evaluation-placeholder.component.html',
  styleUrls: ['./evaluation-placeholder.component.css']
})
export class EvaluationPlaceholderComponent implements OnInit {

  idEvento: number
  idTipoEval: number
  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.idEvento = params.idevent
      this.idTipoEval = params.idtipeval
      //console.warn('params: ' + JSON.stringify({1: this.idEvento, 2: this.idTipoEval}))
    })
  }

  ngOnInit(): void {}
}
