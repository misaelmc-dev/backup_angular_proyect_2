import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-event-paticipation-details',
  templateUrl: './event-paticipation-details.component.html',
  styleUrls: ['./event-paticipation-details.component.css']
})
export class EventPaticipationDetailsComponent implements OnInit {

  cordId?:number = Number(this.route.snapshot.paramMap.get('coord'));
  eventoId?:number = Number(this.route.snapshot.paramMap.get('idevent'));
  participacionId?:number = Number(this.route.snapshot.paramMap.get('idpart'));

  participacion:any[]=[];
  participacionUsuario:any[]=[];
  typeParticipation:any[]=[];
  typeParticipationAsign:any[]=[];
  typeParticipationNoAsign:any[]=[];
  participationEstatus:any[]=[];

  loadingCount: number = 0; //cuenta el número de elementos cargando

  constructor(private eventService: EventService,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.loadParticipation();
    this.loadUsuariosEvento();
    this.loadTypeParticipationList();
    this.loadParticipationEstatus();
  }

  loadParticipation(){
    this.loadingCount++
    this.eventService.getParticipationById(this.eventoId,this.participacionId).subscribe((res: any) => {
      this.loadingCount--
      this.participacion = res;
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la participación especificada'});
      console.error(err)
    });
  }

  loadUsuariosEvento = () => {
    if(this.eventoId!=0){
      this.loadingCount++
      this.eventService.getUsuariosEvento(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.participacionUsuario = res;
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar la participación especificada [carga de usuarios scicom]'});
        console.error(err)
      });
    }
  }

  loadTypeParticipationList(){
    this.loadingCount++
    this.eventService.getParticipationList(this.eventoId).subscribe((res: any) => {
      this.loadingCount--
      this.typeParticipation = res ;
      this.loadingCount++
      this.eventService.getParticipationAsign(this.eventoId).subscribe((res: any) => {
        this.loadingCount--
        this.typeParticipationNoAsign = this.typeParticipation;
        for(let camp of res[0].tipos_de_participacion){
          this.typeParticipationNoAsign = this.typeParticipationNoAsign.filter( (tp:any) => tp.id != camp.pivot.id_tipo_participacion );
        }
        this.typeParticipationAsign = this.typeParticipation;
        for(let camp of this.typeParticipationNoAsign){
          this.typeParticipationAsign = this.typeParticipationAsign.filter( (tp:any) => tp.id != camp.id );
        }
      }, (err:any) =>{
        this.loadingCount--
        Swal.fire({icon: 'error',text: 'Error al cargar la participación [carga de tipos de participación evento]'});
        console.error(err)
      });
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la participación'});
      console.error(err)
    });
  }

  loadParticipationEstatus(){
    this.loadingCount++
    this.eventService.getParticipationEstatus().subscribe((res: any) => {
      this.loadingCount--
      this.participationEstatus = res;
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la participaicón [carga de estatus de participaciones]'});
      console.error(err)
    });
  }

  changeEstatus(statId:number){
    this.loadingCount++
    this.eventService.updateParticipation(this.participacionId, statId).subscribe(() => {
      this.loadingCount--
      this.loadParticipation()
      Swal.fire({icon: 'success',text: 'Se cambió el estatus de la participación'});
    }, (err) => {
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se cambió el estatus de la participación'});
      console.error(err)
    })
  }

}


