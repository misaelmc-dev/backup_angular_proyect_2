import { Component, OnInit } from '@angular/core';
import {SourcePageable} from "../../../../interfaces/source";
import {CatalogsService} from "../../../../services/catalogs.service";
import {MessageService} from "../../../../services/message.service";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})
export class SourceComponent implements OnInit {

  metadata!: SourcePageable;
  dataSource!:any;

  pageNumber = 1;
  pageSize = 10;
  totalItems = 0;
  paginationId = 'sourcePagination';
  responsive = true;
  searchText = "";

  constructor(
    private catalogsService: CatalogsService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.loadSources();
  }

  loadSources(): void {
    this.catalogsService.getPagedSources(this.searchText, this.pageNumber, this.pageSize).subscribe((result: any) => {
      this.metadata = result;
      this.dataSource = result.data;
      this.totalItems = this.metadata.total;
      this.pageSize = parseInt(this.metadata.per_page);
    });
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadSources();
  }

  redirectToForm(id: string) {
    this.router.navigate(['admin/edit-source', id]);
  }

  deleteSource = (id: string): void => {
    this.catalogsService.deleteSourceById(id).subscribe((result: any) => {
      this.messageService.showPopupMessage(
        'Felicitaciones',
        'Se ha eliminado la fuente correctamente.',
        'success'
      );
      this.loadSources();
    }, (err) => {
      console.error(err);
      this.messageService.showPopupMessage(
        'Error',
        'Ha ocurrido un error al eliminar la fuente.',
        'error'
      );
    });
  };

}
