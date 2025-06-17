import { Component, OnInit } from '@angular/core';
import {EventService} from "../../../../services/event.service";
import Swal from "sweetalert2";
import {AdminService} from "../../../../services/admin.service";
import {FuentesScicomService} from "../../../../services/scicom/fuentes-scicom.service";
import {ParticipacionScicomService} from "../../../../services/scicom/participacion-scicom.service";
import {TrabajoScicomService} from "../../../../services/scicom/trabajo-scicom.service";

@Component({
  selector: 'app-works-scicom',
  templateUrl: './works-scicom.component.html',
  styleUrls: ['./works-scicom.component.css']
})
export class WorksScicomComponent implements OnInit {

  tituloSearch:string="";

  tiposEvento:any[]=[];

  instituciones:any[]=[];

  trabajos:any[]=[];
  dataSource!:any;
  sugerenciasTitulos:any[]=[];

  conSugerencia:boolean = false;
  tipoEventoSelected:number=0;
  institucionSelected:number=0;
  tituloSugerencia:any[]=[];

  loadingCount:number=0;

  pageNumbers:number = 0;
  pageNumber:number = 1;
  pageNumbersArray:any=[];
  pageStart:number = 0;
  pageEnd:number = 0;
  pageSize:number = 10;
  totalItems:number = 0;
  labelPagination:string = '';

  constructor(private eventService: EventService,
              private adminService: AdminService,
              private participacionesService: ParticipacionScicomService,
              private trabajosScicomService: TrabajoScicomService,
              private fuentesService: FuentesScicomService,
  ) { }

  ngOnInit(): void {
    this.loadTiposEventoList()
    this.loadInstitucionesList()
    this.loadTrabajosList()
    this.loadTrabajosSugeridos()
  }

  loadTiposEventoList() {
    this.loadingCount++
    this.eventService.getTypeEventList().subscribe((res: any) => {
      this.loadingCount--
      this.tiposEvento = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de tipos de evento'});
      console.error(err)
    });
  }

  loadInstitucionesList() {
    this.loadingCount++
    this.adminService.getInstitutions().subscribe((res: any) => {
      this.loadingCount--
      this.instituciones = res;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de instituciones'});
      console.error(err)
    });
  }

  loadTrabajosList() {
    this.loadingCount++
    this.eventService.getWorkListAdmin().subscribe((res: any) => {
      this.loadingCount--
      this.trabajos = res
      this.dataSource = this.trabajos;
      this.loadPagination();
      this.loadParticipaciones()
      this.loadFuentes()
      this.loadAutoresTrabajos()
      this.loadMetadatos()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de trabajos'});
      console.error(err)
    });
  }

  loadTrabajosSugeridos(){
    this.loadingCount++
    this.eventService.getProductScintra().subscribe((res: any) => {
      const idsTrabajos:any = [];
      const ids:any = [];
      for(var i in res){ids.push(res[i]);}
      const auxSugerencias:any = [];
      for(let s of ids){auxSugerencias.push(s[0])}
      this.sugerenciasTitulos = auxSugerencias;
      for(let t of this.trabajos){
        t.sugerenciasTitulos = [];
        let auxSugerenciasTitulo:any = [];
        for(let st of auxSugerencias){
          if(t.id==st.id_trabajo){
            auxSugerenciasTitulo.push(st)
          }
          t.sugerenciasTitulos=auxSugerenciasTitulo
        }
      }
      this.dataSource = this.trabajos;
      for(let i of ids){idsTrabajos.push(i[0].id_trabajo);}
      for(let t of this.trabajos){
        t.trabajoSugerido = false
        for(let ts of idsTrabajos){
          if(t.id==ts){t.trabajoSugerido = true}
        }
      }
      this.dataSource = this.trabajos;
      this.loadSugerenciasMetadatos()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los trabajos sugeridos'});
      console.error(err)
    });
  }

  loadMetadatos(){
    const idsTrabajos = this.trabajos.map((value: any) => value.id)
    this.loadingCount++
    this.eventService.getMetadatosTrabajosAdmin(idsTrabajos).subscribe((res:any) => {
      this.loadingCount--
      for(let t of this.trabajos){
        t.metadatos = []
        for(let m of res){
          if(t.id==m.id_trabajo){t.metadatos.push(m)}
        }
      }
      var auxTrabajosSinCertificar = this.newObjectReference(this.trabajos)
      var auxtrabajoCertificado = false
      for(let t of this.trabajos){
        auxtrabajoCertificado = false
        for(let m of t.metadatos){
          if(m.productos_count!=0){
            auxtrabajoCertificado = true
          }
        }
        if(auxtrabajoCertificado){
          auxTrabajosSinCertificar = auxTrabajosSinCertificar.filter((value: any) => value.id != t.id);
        }
      }
      this.trabajos = this.newObjectReference(auxTrabajosSinCertificar)
      this.dataSource = this.trabajos;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las participaciones del evento y trabajos especificados'});
      console.error(err)
    });
  }

  loadSugerenciasMetadatos(){
    const idsnp = this.sugerenciasTitulos.map((value: any) => value.id_np)
    this.loadingCount++
    this.eventService.getSugerenciasProductScintra(idsnp).subscribe((res:any) => {
      this.loadingCount--
      this.tituloSugerencia = res
      for(let t of this.trabajos){
        t.productosScitraSugerencia = []
        if(t.sugerenciasTitulos.length!=0){
          for(let st of t.sugerenciasTitulos){
            for(let ps of res){
              if(ps.id==st.id_np){
                t.productosScitraSugerencia.push(ps);
              }
            }
          }
        }
      }
      this.dataSource = this.trabajos;
      console.log("this.dataSource",this.dataSource)
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las participaciones del evento y trabajos especificados'});
      console.error(err)
    });
  }

  cargarParticipacionesSuscripcion(idsPart: Array<number> = undefined) {
    return this.participacionesService.getParticipacionesAdmin(idsPart)
  }

  loadParticipaciones(){
    const idsPaticipaciones = this.trabajos.map((value: any) => value.id_participacion)
    let suscripcionParticipaciones = this.cargarParticipacionesSuscripcion(idsPaticipaciones)
    this.loadingCount++
    suscripcionParticipaciones.subscribe((res:any) => {
      this.loadingCount--
      for(let t of this.trabajos){
        for(let p of res){
          if(t.id_participacion==p.id){t.participacion = p}
        }
      }
      this.dataSource = this.trabajos;
      this.loadUsuarios()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las participaciones del evento y trabajos especificados'});
      console.error(err)
    });
  }

  cargaUsuariosScicomSuscripcion(idsUsuariosScicom: Array<number>) {
    return this.eventService.getUsuariosTrabajosAdmin(idsUsuariosScicom)
  }

  loadUsuarios(){
    const idsUsuarios = this.trabajos.map((value: any) => value.participacion.id_usuario)
    let suscripcionUsuarios = this.cargaUsuariosScicomSuscripcion(idsUsuarios)
    this.loadingCount++
    suscripcionUsuarios.subscribe((res:any) => {
      this.loadingCount--
      for(let t of this.trabajos){
        for(let u of res){
          if(t.participacion.id_usuario){
            if(t.participacion.id_usuario==u.id){t.usuarioRegistra = u}
          }
        }
      }
      this.dataSource = this.trabajos;
      this.loadEvento()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las participaciones del evento y trabajos especificados'});
      console.error(err)
    });
  }

  loadEvento(){
    const idsUsuarios = this.trabajos.map((value: any) => value.usuarioRegistra.id_user)
    this.loadingCount++
    this.eventService.getEventListAdmin(idsUsuarios).subscribe((res:any) => {
      this.loadingCount--
      for(let t of this.trabajos){
        t.evento = [];
        for(let e of res){
          if(t.usuarioRegistra.id_evento==e.id){t.evento = e}
        }
      }
      this.dataSource = this.trabajos;
      this.loadInstituciones()
      this.loadTiposEvento()
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las participaciones del evento y trabajos especificados'});
      console.error(err)
    });
  }

  loadInstituciones(){
    const idsRors = this.trabajos.map((value: any) => value.evento.rors_editoras[0].id)
    this.loadingCount++
    this.eventService.getInstitucionList(idsRors).subscribe((res:any) => {
      this.loadingCount--
      for(let t of this.trabajos){
        t.institucion = [];
        for(let i of res){
          if(t.evento.rors_editoras[0].id==i.id_ror){t.institucion = i}
        }
      }
      this.dataSource = this.trabajos;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las participaciones del evento y trabajos especificados'});
      console.error(err)
    });
  }

  loadTiposEvento(){
    for(let t of this.trabajos){
      t.eventoTipo = [];
      for(let et of this.tiposEvento){
        if(t.evento.id_tipo_evento==et.id){t.eventoTipo = et}
      }
    }
    this.dataSource = this.trabajos;
  }

  cargaAutoresDeTrabajoSuscripcion(idsTrab:Array<number> = undefined) {
    return this.trabajosScicomService.getAutoresDeTrabajoAdmin(idsTrab)
  }

  loadAutoresTrabajos(){
    const idsTrabajos = this.trabajos.map((value: any) => value.id)
    let suscripcionAutores = this.cargaAutoresDeTrabajoSuscripcion(idsTrabajos)
    this.loadingCount++
    suscripcionAutores.subscribe((res:any) => {
      this.loadingCount--
      for(let t of this.trabajos){
        t.autores = [];
        for(let a of res){
          if(t.id==a.id_trabajo){
            t.autores.push(a)
          }
        }
      }
      this.dataSource = this.trabajos;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar los autores de los trabajos'});
      console.error(err)
    });
  }

  cargarFuentesSuscripcion(idsTrabajos: Array<number> = undefined) {
    return this.fuentesService.getFuentesDeTrabajo(idsTrabajos)
  }

  loadFuentes(){
    const idsTrabajos = this.trabajos.map((value: any) => value.id)
    let suscripcionFuentes = this.cargarFuentesSuscripcion(idsTrabajos)
    this.loadingCount++
    suscripcionFuentes.subscribe((res:any) => {
      this.loadingCount--
      for(let t of this.trabajos){
        t.fuente = "";
        for(let d of res){
          if(t.id_fuente==d.id){
            t.fuente = d
          }
        }
      }
      this.dataSource = this.trabajos;
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar las fuentes de los trabajos especificados'});
      console.error(err)
    });
  }

  handlePageChange(event: any){
    this.pageNumber = event;
    this.loadTrabajosList();
  }

  newObjectReference(object: any) {
    return JSON.parse(JSON.stringify(object))
  }

  certificarTrabajo(idTrabajo:number,conjunto_meta:number,id_np:number){
    var nombreTrabajo:string = ''
    var nombreProducto:string = ''
    for(let t of this.trabajos){
      if(t.id==idTrabajo){
        for(let st of t.sugerenciasTitulos){
          for(let ts of this.tituloSugerencia){
            if(id_np==ts.id){
              nombreProducto = ts.titulo
            }
          }
          for(let m of t.metadatos){
            if(m.id==st.id_conj_meta){
              nombreTrabajo = m.titulo
            }
          }
        }
      }
    }
    Swal.fire({
      html:'Está a punto de certificar el siguiente trabajo scicom: "'+nombreTrabajo+'", con base en el ' +
        'producto Scintra titulado"'+nombreProducto+'".<br> Esta acción marcará el este trabajo como <br>' +
        '"Verificado por Habilis" en el módulo Scicom',
      icon:'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, Certificar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.certificarMetadatoProducto(idTrabajo,conjunto_meta,id_np)
      }
    })
  }

  certificarTrabajoManualmente(idTrabajo:number,conjunto_meta: any){
    Swal.fire({
      html:'Está a punto de certificar manualmente el siguiente trabajo scicom: "'+(conjunto_meta.filter((item: any) => !!(item) ).pop().titulo)+'" con ID: '
        + idTrabajo +',.<br> Esta acción marcará este trabajo como <br>' +
        '"Verificado por Habilis" en el módulo Scicom',
      icon:'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, certificar',
    }).then((result) => {
      if (result.isConfirmed) {
        //crear producto a la medida de relleno en scintra
        //console.warn(conjunto_meta);
        this.certificarMetadatoProductoManual(conjunto_meta.filter((item: any) => !!(item) ).pop().id)
      }
    })
  }

  certificarMetadatoProducto(idTrabajo:number,idMetadato:number,id_np:number){
    this.loadingCount++
    this.eventService.asignProductosToMetadatos(idMetadato,id_np).subscribe((res: any) => {
      this.loadingCount--
      this.dataSource = this.dataSource.filter((value: any) => value.id != idTrabajo);
      Swal.fire({
        icon: 'success',
        title: 'Se ha certificado el trabajo',
        showConfirmButton: false,
        timer: 2000
      })
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al cargar la lista de trabajos'});
      console.error(err)
    });
  }

  certificarMetadatoProductoManual(idConjMetaTrab:number){
    this.loadingCount++
    this.eventService.generateAndAsignProductosToMetadatos(idConjMetaTrab).subscribe((res: any) => {
      this.loadingCount--
      this.ngOnInit()
      Swal.fire({
        icon: 'success',
        title: 'Se ha certificado manualmente el trabajo',
        showConfirmButton: false,
        timer: 2000
      })
    }, (err:any) =>{
      this.loadingCount--
      Swal.fire({icon: 'error',text: 'Error al certificar manualmente el trabajo'});
      console.error(err)
    });
  }

  filtrarTrabajos() {
    this.dataSource = this.newObjectReference(this.trabajos)
    if(this.tituloSearch != ''){this.filtrarTituloSearch(this.tituloSearch)}
    if(this.conSugerencia != false){this.filtrarSugerencias()}
    if(this.tipoEventoSelected != 0){this.filtrarTipoEvento()}
    if(this.institucionSelected != 0){this.filtrarInstitucion()}
    this.pageNumber = 1;
    this.loadPagination();
  }

  filtrarTituloSearch(search: string) {
    const auxTrab = this.dataSource.filter((value: any) => {
      const metadatos = value.metadatos
      const aux = metadatos.filter((value: any) => {
        if (!value.titulo || !value.resumen)
          return false
        return (value.titulo.toLowerCase().includes(search.toLowerCase())
          || value.resumen.toLowerCase().includes(search.toLowerCase()))
      })
      return aux.length > 0
    })
    this.dataSource = this.newObjectReference(auxTrab)
  }

  filtrarSugerencias(){
    let auxTrab = []
    for(let t of this.dataSource){
      if(t.trabajoSugerido==true){
        auxTrab.push(t)
      }
    }
    this.dataSource = this.newObjectReference(auxTrab)
  }

  filtrarTipoEvento(){
    let auxTrab = []
    for(let t of this.dataSource){
      if(t.eventoTipo.id==this.tipoEventoSelected){
        auxTrab.push(t)
      }
    }
    this.dataSource = this.newObjectReference(auxTrab)
  }

  filtrarInstitucion(){
    let auxTrab = []
    for(let t of this.dataSource){
      if(t.institucion.id==this.institucionSelected){
        auxTrab.push(t)
      }
    }
    this.dataSource = this.newObjectReference(auxTrab)
  }

  cleanFilters(){
    this.tituloSearch = '';
    this.tipoEventoSelected = 0;
    this.institucionSelected = 0;
    this.dataSource = this.newObjectReference(this.trabajos)
    this.filtrarTrabajos()
    this.pageNumber = 1;
    this.loadPagination();
  }

  loadPagination = (pageValue?:any) => {
    this.totalItems = this.dataSource.length;
    this.pageNumbers = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbersArray = [];
    for(var i=1 ; i<=this.pageNumbers ; i++){
      this.pageNumbersArray.push({"id":i});
    }
    if(pageValue){
      if(pageValue=='prev'){
        this.pageNumber = this.pageNumber-1;
      }else if(pageValue=='next'){
        this.pageNumber = this.pageNumber+1;
      }else{
        this.pageNumber = pageValue;
      }
    }
    this.pageEnd = this.pageNumber * this.pageSize;
    this.pageStart = this.pageEnd - (this.pageSize - 1);
    if(this.pageNumber==this.pageNumbers){
      this.pageEnd = this.totalItems;
    }
    this.labelPagination = "Muestra eventos del "+this.pageStart+" al "+this.pageEnd+", Total: "+this.totalItems;
  }

  redirectToBlank(url: string) {
    window.open(url,'_blank')
  }
}
