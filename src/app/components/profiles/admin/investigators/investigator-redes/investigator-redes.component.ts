import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SocialNetwoksService} from "../../../../../services/social-netwoks.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-investigator-redes',
  templateUrl: './investigator-redes.component.html',
  styleUrls: ['./investigator-redes.component.css']
})
export class InvestigatorRedesComponent  implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() modal = "";
  @Input() salvar = 0;

  listaItems:any[]=[];
  listaItemsGuardados:any[]=[];
  itemSeleccionado:number=0;
  valorItems:any[]=[];
  itemsGuardados:boolean=false;

  loadingCount:number=0;

  constructor(public redesService: SocialNetwoksService) { }

  ngOnInit(): void {
    this.obtenerTodosItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.salvar!=0){
      this.guardarCambios()
    }else{
      this.obtenerTodosItems()
    }
  }

  obtenerTodosItems(){
    this.listaItems=[];
    this.valorItems=[];
    this.loadingCount++
    this.redesService.getAllRedes().subscribe((resConsultaTotal: any) => {
      this.loadingCount--
      this.listaItems=resConsultaTotal;
      for(let lct of this.listaItems){
        lct.accion="no asignado";
      }
      if(this.id!=0){
        this.obtenerItems();
      }
    }, (err:any) =>{
      this.loadingCount--
      if(err.status != 404){
        Swal.fire({icon: 'error',text: 'No se cargarón las redes sociales'});
        console.error(err)
      }
    });
  }

  obtenerItems(){
    this.loadingCount++
    this.redesService.getRedesByInvestigator(this.id).subscribe((resConsultaInv: any) => {
      this.loadingCount--
      for(let li of this.listaItems){
        for(let rci of resConsultaInv.lista_redes_sociales){
          if(li.id==rci.id){
            li.url=rci.url;
            li.accion="guardado";
          }
        }
      }
      if(resConsultaInv.length!=0){
        this.itemsGuardados=true;
        this.listaItemsGuardados=resConsultaInv.lista_redes_sociales;
      }
    }, (err:any) =>{
      this.loadingCount--
      if(err.status != 404){
        Swal.fire({icon: 'error',text: 'No se cargaron las redes sociales del investigador'});
        console.error(err)
      }
    });
  }

  editarRedSocial(item:number,idRed:number){
    for(let li of this.listaItems){
      if(li.id==idRed){
        if(li.url==undefined){
          li.accion="nuevo";
        }else{
          li.accion="editar";
        }
        li.perfil_url=this.valorItems[item];
      }
    }
  }

  guardarCambios(){
    for(let lc of this.listaItems){
      if(lc.accion=="nuevo"){ this.asociarItemInvestigador(lc) }
      if(lc.accion=="editar"){ this.desasociarItemInvestigador(lc) }
    }
    this.salvar=0;
  }

  asociarItemInvestigador(item:any){
    this.loadingCount++
    this.redesService.addRedToInvestigador(this.id,item.id,item.perfil_url).subscribe(() => {
      this.loadingCount--
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se asioció la red social al investigador'});
      console.error(err)
    });
  }

  desasociarItemInvestigador(item:any){
    this.loadingCount++
    this.redesService.removeRedToInvestigador(this.id,item.id).subscribe(() => {
      this.loadingCount--
      this.asociarItemInvestigador(item);
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'No se desasioció la red social al del investigador'});
      console.error(err)
    });
  }

}
