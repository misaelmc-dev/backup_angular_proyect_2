import {Component,OnInit} from '@angular/core';
import {ActivatedRoute,NavigationEnd,Router} from "@angular/router";
import {EstadisticsService} from "../../../../../services/scicom/estadistics.service";
import Swal from "sweetalert2";
import * as Highcharts from "highcharts";
import {toNumber} from "lodash";

@Component({
  selector: 'app-statistics-encounter',
  templateUrl: './statistics-encounter.component.html',
  styleUrls: ['./statistics-encounter.component.css']
})
export class StatisticsEncounterComponent implements OnInit {

    cordId?:number=Number(this.route.snapshot.paramMap.get('id'));

    rorId:number=0;
    typeEventId:number=0;
    typesWorkIds:any[]=[];

    ciclosList:any[]=[];
    selectedEveCampByCiclo:number=0;
    selectedCicloByCiclo:number=0;
    selectedAnioByCiclo:number=0;
    selectedCampusPart:string="0";
    selectedODS:string="0";
    selectedAreas:string="0";

    cartelesCiclo:any[]=[];
    estudiantesCiclo:any[]=[];
    participacionCiclo:any[]=[];
    objetivoCartelesCiclo:number=0;
    objetivoEstudiantesCiclo:number=0;
    objetivoParticipacionCiclo:number=0;
    mayorParicipacionCiclo:number=0;

    cartelesEveCamp:any[]=[];
    estudiantesEveCamp:any[]=[];
    participacionCartelesEveCamp:any[]=[];
    participacionEstudiantesEveCamp:any[]=[];
    usuariosCartelesEveCamp:any[]=[];
    usuariosEstudiantesEveCamp:any[]=[];

    cartelesAnio:any[]=[];
    eventCampAnio:any[]=[];

    campus:any[]=[];

    lin:any[]=[];

    eventPartCampList:any[]=[];
    eventPartCamp:any[]=[];
    eventCartCampList:any[]=[];
    eventCartCamp:any[]=[];
    eventAuthCampList:any[]=[];
    eventAuthCamp:any[]=[];
    eventWorkODSList:any[]=[];
    eventWorkODS:any[]=[];
    eventWorkAreaList:any[]=[];
    eventWorkArea:any[]=[];

    valorPartCampMax:number=0;
    valorCartCampMax:number=0;
    valorAuthCampMax:number=0;
    valorODSMax:number=0;
    valorAreaMax:number=0;

    highchartsOne = Highcharts;
    optionsChartOne!: Highcharts.Options;
    chartOneCategories: any[] = [];
    chartOneSeries: any[] = [];
    showChartOne = false;
    updateFlagOne = false;

    highchartsTwo = Highcharts;
    optionsChartTwo!: Highcharts.Options;
    chartTwoCategories: any[] = [];
    chartTwoSeries: any[] = [];
    showChartTwo = false;
    updateFlagTwo = false;

    constructor(private route:ActivatedRoute,
                public router: Router,
                private estadisticService:EstadisticsService) { }

    ngOnInit(): void {
        if(this.router.url.includes('coord')){
            this.loadCampus()
            this.loadRor()
        }
    }

    loadCiclos(){
        this.estadisticService.getCiclosByTypeAndInstitution(this.typeEventId,this.rorId).subscribe((resCiclos:any) => {
            this.ciclosList=resCiclos
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo para el tipo de evento especificado'});
            console.error(err)
        });
    }

    loadCampus(){
        this.estadisticService.getCampusList(this.cordId).subscribe((resCamp:any) => {
            this.campus=resCamp
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar las participaciones'});
            console.error(err)
        });
    }

    loadRor(){
        this.estadisticService.getRor().subscribe((resRor:any) => {
            for(let r of resRor){
                if(r.id==this.cordId){
                    this.rorId=r.id_ror
                }
            }
            this.loadTiposEvento()
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los rors para la institucion especificada'});
            console.error(err)
        });
    }

    loadTiposEvento(){
        this.estadisticService.getTiposEvento(this.cordId).subscribe((resTipEve:any) => {
            for(let rte of resTipEve){
                if(rte.codigo_interno=="tipEvEncuentUtec"){this.typeEventId=rte.id}
            }
            //console.log("resTipEve",resTipEve)
            this.loadTiposTrabajo()
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los tipos de evento para la institucion especificada'});
            console.error(err)
        });
    }

    loadTiposTrabajo(){
        this.estadisticService.getTiposTrabajo(this.typeEventId).subscribe((resTipTrab:any) => {
            let idsTrab = [];
            for(let rtt of resTipTrab){
                if(rtt.nombre.includes('Cartel')){
                    idsTrab.push(rtt.id)
                }
            }
            this.typesWorkIds=idsTrab;
            this.loadCiclos()
            this.loadTabPorEventosCampus()
            this.loadTabPorCiclo()
            this.loadTabPorAnio()
            this.loadTabPorCampus('')
            this.loadTabPorODS('')
            this.loadTabPorArea('')

        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo para el tipo de evento especificado'});
            console.error(err)
        });
    }

    loadTabPorEventosCampus(){
        this.loadCartelesEventoCampus()
        this.loadAutoresEventoCampus()
    }

    loadCartelesEventoCampus(){
        this.estadisticService.getCartelesEveCamp(this.typeEventId,this.typesWorkIds,this.rorId,this.selectedEveCampByCiclo).subscribe((resCartelesEveCamp:any) => {
            this.cartelesEveCamp=resCartelesEveCamp
            //console.log("this.cartelesEveCamp",this.cartelesEveCamp)
            this.orderByPart(this.cartelesEveCamp)
            this.loadParticipacionCartelesEveCampus()
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo para el tipo de evento especificado'});
            console.error(err)
        });
    }

    loadParticipacionCartelesEveCampus(){
        const idsParticipacion = this.cartelesEveCamp.map((value: any) => value.id_participacion)
        this.estadisticService.getParticipacionesByIds(idsParticipacion).subscribe((resparticipacionEveCamp:any) => {
            this.participacionCartelesEveCamp=resparticipacionEveCamp
            this.loadUsuariosCartelesEveCampus()
            this.loadObjetivosByParticipacionesCarteles()
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar las participaciones'});
            console.error(err)
        });
    }

    loadUsuariosCartelesEveCampus(){
        const idsUsuarios:any[] = this.participacionCartelesEveCamp.map((value: any) => value.id_usuario)
        this.estadisticService.getUsuariosByIds(idsUsuarios).subscribe((resUsuariosEveCamp:any) => {
            this.usuariosCartelesEveCamp=resUsuariosEveCamp
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar las participaciones'});
            console.error(err)
        });
    }

    loadObjetivosByParticipacionesCarteles(){
        const idsParticipacion = this.estudiantesEveCamp.map((value: any) => value.id_participacion)
        //console.log("idsParticipacion",idsParticipacion)
        this.estadisticService.getObjetivosByIdsPart(idsParticipacion).subscribe((resObjCart:any) => {
            for(let r of resObjCart){
                for(let c of this.cartelesEveCamp){
                    if(r.id_participacion == c.id_participacion){
                        if(r.real_value_url.includes('/api/scicom/trabajos/')){
                            c.pronosticoCarteles=r.valor_objetivo
                        }
                    }
                }
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los objetivos de las participaciones'});
            console.error(err)
        });
    }

    loadTabPorCiclo(){
        this.loadCartelesCiclo()
        this.loadEstudiantesCiclo()
        this.loadParticipacionesCiclo()
    }

    loadAutoresEventoCampus(){
        this.estadisticService.getAutoresEveCamp(this.typeEventId,this.typesWorkIds,this.rorId,this.selectedEveCampByCiclo).subscribe((resAutoresEveCamp:any) => {
            this.estudiantesEveCamp=resAutoresEveCamp
            //console.log("this.estudiantesEveCamp",this.estudiantesEveCamp)
            this.orderByPart(this.estudiantesEveCamp)
            this.loadParticipacionAutoresEveCampus()
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo para el tipo de evento especificado'});
            console.error(err)
        });
    }

    loadParticipacionAutoresEveCampus(){
        const idsParticipacion = this.estudiantesEveCamp.map((value: any) => value.id_participacion)
        this.estadisticService.getParticipacionesByIds(idsParticipacion).subscribe((resparticipacionEveCamp:any) => {
            this.participacionEstudiantesEveCamp=resparticipacionEveCamp
            this.loadUsuariosAutoresEveCampus()
            this.loadObjetivosByParticipacionesAutores()
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar las participaciones'});
            console.error(err)
        });
    }

    loadUsuariosAutoresEveCampus(){
        const idsUsuarios:any[] = this.participacionCartelesEveCamp.map((value: any) => value.id_usuario)
        this.estadisticService.getUsuariosByIds(idsUsuarios).subscribe((resUsuariosEveCamp:any) => {
            this.usuariosEstudiantesEveCamp=resUsuariosEveCamp
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar las participaciones'});
            console.error(err)
        });
    }

    loadObjetivosByParticipacionesAutores(){
        let idsParticipacion:any = this.estudiantesEveCamp.map((value: any) => value.id_participacion)
        this.estadisticService.getObjetivosByIdsPart(idsParticipacion).subscribe((resObjEst:any) => {
            for(let r of resObjEst){
                for(let e of this.estudiantesEveCamp){
                    if(r.id_participacion == e.id_participacion){
                        if(r.real_value_url.includes('/api/scicom/autorestrabajo/')){
                            e.pronosticoEstudiantes=r.valor_objetivo
                        }
                    }
                }
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los objetivos de las participaciones'});
            console.error(err)
        });
    }

    loadCartelesCiclo(){
        this.estadisticService.getCartelesCiclo(this.typeEventId,this.typesWorkIds,this.rorId,this.selectedCicloByCiclo).subscribe((resCartelesCiclo:any) => {
            this.cartelesCiclo=resCartelesCiclo
            this.orderBy(this.cartelesCiclo)
            this.loadObjetivosByCartelesCiclo()
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo para el tipo de evento especificado'});
            console.error(err)
        });
    }

    loadObjetivosByCartelesCiclo(){
        const idsEventos = this.cartelesCiclo.map((value: any) => value.id_evento)
        this.estadisticService.getObjetivosByIdsEvent(idsEventos).subscribe((resObjCart:any) => {
            for(let r of resObjCart){
                for(let c of this.cartelesCiclo){
                    if(r.participacion.usuario.id_evento == c.id_evento){
                        if(r.real_value_url.includes('/api/scicom/trabajos/')){
                            if(c.pronosticoCarteles!=undefined){
                                c.pronosticoCarteles=toNumber(c.pronosticoCarteles)+toNumber(r.valor_objetivo)
                            }else{
                                c.pronosticoCarteles=r.valor_objetivo
                            }
                        }
                    }
                }
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los objetivos de las participaciones'});
            console.error(err)
        });
    }

    loadEstudiantesCiclo(){
        this.estadisticService.getAutoresCiclo(this.typeEventId,this.typesWorkIds,this.rorId,this.selectedCicloByCiclo).subscribe((resEstudiantesCiclo:any) => {
            this.estudiantesCiclo=resEstudiantesCiclo
            this.orderBy(this.estudiantesCiclo)
            this.loadObjetivosByEstudiantesCiclo()
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo para el tipo de evento especificado'});
            console.error(err)
        });
    }

    loadObjetivosByEstudiantesCiclo(){
        const idsEventos = this.estudiantesCiclo.map((value: any) => value.id_evento)
        this.estadisticService.getObjetivosByIdsEvent(idsEventos).subscribe((resObjCart:any) => {
            for(let r of resObjCart){
                for(let c of this.estudiantesCiclo){
                    if(r.participacion.usuario.id_evento == c.id_evento){
                        if(r.real_value_url.includes('/api/scicom/autorestrabajo/')){
                            if(c.pronosticoEstudiantes!=undefined){
                                c.pronosticoEstudiantes=toNumber(c.pronosticoEstudiantes)+toNumber(r.valor_objetivo)
                            }else{
                                c.pronosticoEstudiantes=r.valor_objetivo
                            }
                        }
                    }
                }
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los objetivos de las participaciones'});
            console.error(err)
        });
    }

    loadParticipacionesCiclo(){
        this.estadisticService.getParticipacionCiclo(this.typeEventId,this.rorId,this.selectedCicloByCiclo).subscribe((resParticipacionCiclo:any) => {
            this.participacionCiclo=resParticipacionCiclo
            for(let pc of this.participacionCiclo){
                if(pc.count_participaciones>this.mayorParicipacionCiclo){
                    this.mayorParicipacionCiclo=pc.count_participaciones
                }
            }
            this.mayorParicipacionCiclo++
            this.orderBy(this.participacionCiclo)
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los tipos de trabajo para el tipo de evento especificado'});
            console.error(err)
        });
    }

    loadTabPorAnio(){
        this.loadCartelesAnio()
        this.loadEventCampAnio()
    }

    loadCartelesAnio(){
        this.estadisticService.getCartelesAnio(this.typeEventId,this.typesWorkIds,this.rorId,this.selectedAnioByCiclo).subscribe((rescartelAnio:any) => {
            this.cartelesAnio=rescartelAnio
            this.loadGraphDataOne()
            //console.log("this.cartelesAnio",this.cartelesAnio)
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los carteles por año'});
            console.error(err)
        });
    }

    loadEventCampAnio(){
        this.estadisticService.getEventCampAnio(this.typeEventId,this.typesWorkIds,this.rorId,this.selectedAnioByCiclo).subscribe((resEveCampAnio:any) => {
            this.eventCampAnio=resEveCampAnio
            this.loadGraphDataTwo()
            //console.log("this.eventCampAnio",this.eventCampAnio)
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los eventos de campus por año'});
            console.error(err)
        });
    }

    loadTabPorCampus(cargar:string){
        this.loadPartByCamp(cargar)
        this.loadCartByCamp(cargar)
        this.loadAuthByCamp(cargar)
    }

    loadPartByCamp(cargar:string){
        this.estadisticService.getPartByCamp(this.typeEventId,this.rorId).subscribe((resPartCamp:any) => {
            if(cargar==''){
                this.eventPartCampList=resPartCamp
                this.eventPartCamp=resPartCamp
            }else if(cargar=='recargar'){
                if(this.selectedCampusPart=='0'){
                    this.eventPartCampList=resPartCamp
                    this.eventPartCamp=resPartCamp
                }else{
                    this.eventPartCamp = this.eventPartCampList.filter( (epc: any) => epc.nombre_campus_reg == this.selectedCampusPart)
                }
            }
            var valor_previo: number = 0;
            for(let epv of this.eventPartCampList){
                if(epv.count_participaciones>valor_previo){
                    this.valorPartCampMax = epv.count_participaciones
                }
                valor_previo = parseInt(epv.count_participaciones)
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los foros campus por campus'});
            console.error(err)
        });
    }

    loadCartByCamp(cargar:string){
        this.estadisticService.getCartByCamp(this.typeEventId,this.typesWorkIds,this.rorId).subscribe((resPartCamp:any) => {
            if(cargar==''){
                this.eventCartCampList=resPartCamp
                this.eventCartCamp=resPartCamp
            }else if(cargar=='recargar'){
                if(this.selectedCampusPart=='0'){
                    this.eventCartCampList=resPartCamp
                    this.eventCartCamp=resPartCamp
                }else{
                    this.eventCartCamp = this.eventCartCampList.filter( (epc: any) => epc.nombre_campus_reg == this.selectedCampusPart)
                }
            }
            var valor_previo: number = 0;
            for(let epv of this.eventCartCampList){
                if(epv.count_trabajos>valor_previo){
                    this.valorCartCampMax = epv.count_trabajos
                }
                valor_previo = parseInt(epv.count_trabajos)
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los foros campus por campus'});
            console.error(err)
        });
    }

    loadAuthByCamp(cargar:string){
        this.estadisticService.getAuthByCamp(this.typeEventId,this.typesWorkIds,this.rorId).subscribe((resPartCamp:any) => {
            if(cargar==''){
                this.eventAuthCampList=resPartCamp
                this.eventAuthCamp=resPartCamp
            }else if(cargar=='recargar'){
                if(this.selectedCampusPart=='0'){
                    this.eventAuthCampList=resPartCamp
                    this.eventAuthCamp=resPartCamp
                }else{
                    this.eventAuthCamp = this.eventAuthCampList.filter( (epc: any) => epc.nombre_campus_reg == this.selectedCampusPart)
                }
            }
            var valor_previo: number = 0;
            for(let epv of this.eventAuthCampList){
                if(epv.count_autores_trab>valor_previo){
                    this.valorAuthCampMax = epv.count_autores_trab
                }
                valor_previo = parseInt(epv.count_autores_trab)
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los foros campus por campus'});
            console.error(err)
        });
    }

    loadTabPorODS(cargar:string){
        this.loadWorksByODS(cargar)
    }

    loadWorksByODS(cargar:string){
        this.estadisticService.getCartByODS(this.typeEventId,this.typesWorkIds,this.rorId).subscribe((resWorksODS:any) => {
            if(cargar==''){
                this.eventWorkODSList=resWorksODS
                this.eventWorkODS=resWorksODS
            }else if(cargar=='recargar'){
                if(this.selectedODS=='0'){
                    this.eventWorkODSList=resWorksODS
                    this.eventWorkODS=resWorksODS
                }else{
                    this.eventWorkODS=this.eventWorkODSList.filter( (epc: any) => epc.nombre_ods == this.selectedODS)
                }
            }
            var valor_previo: number = 0;
            for(let epv of this.eventWorkODSList){
                if(epv.count_trabajos>valor_previo){
                    this.valorODSMax = epv.count_trabajos
                }
                valor_previo = parseInt(epv.count_trabajos)
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los trabajos por ODS'});
            console.error(err)
        });
    }

    loadTabPorArea(cargar:string){
        this.loadWorksByArea(cargar)
    }

    loadWorksByArea(cargar:string){
        this.estadisticService.getCartByAreas(this.typeEventId,this.typesWorkIds,this.rorId).subscribe((resWorksArea:any) => {
            if(cargar==''){
                this.eventWorkAreaList=resWorksArea
                this.eventWorkArea=resWorksArea
            }else if(cargar=='recargar'){
                if(this.selectedAreas=='0'){
                    this.eventWorkAreaList=resWorksArea
                    this.eventWorkArea=resWorksArea
                }else{
                    this.eventWorkArea=this.eventWorkAreaList.filter( (epc: any) => epc.nombre_area_conocimiento == this.selectedAreas)
                }
            }
            var valor_previo: number = 0;
            for(let epv of this.eventWorkAreaList){
                if(epv.count_trabajos>valor_previo){
                    this.valorAreaMax = epv.count_trabajos
                }
                valor_previo = parseInt(epv.count_trabajos)
            }
        }, (err:any) =>{
            Swal.fire({icon: 'error',text: 'Error al cargar los trabajos por ODS'});
            console.error(err)
        });
    }

    loadWidthCarteles(cantidad:number,pronostico?:any){
        if(pronostico){
            var total:number=(cantidad*100)/pronostico
        }else{
            var total:number=(cantidad*100)/this.objetivoCartelesCiclo;
        }
        var color = ""
        if(total>=90){
            color="background-color:green;"
        }else if(total<=89 && total>=79){
            color="background-color:orange;"
        }else if(total<=78 && total>=69){
            color="background-color:yellow;"
        }else if(total<69){
            color="background-color:red;"
        }
        var cadena:string="width:"+total+"%;"+color;
        return cadena
    }

    loadWidthEstudiantes(cantidad:number,pronostico?:any){
        if(pronostico){
            var total:number=(cantidad*100)/pronostico
        }else{
            var total:number=(cantidad*100)/this.objetivoEstudiantesCiclo;
        }
        var color = ""
        if(total>=90){
            color="background-color:green;"
        }else if(total<=89 && total>=79){
            color="background-color:orange;"
        }else if(total<=78 && total>=69){
            color="background-color:yellow;"
        }else if(total<69){
            color="background-color:red;"
        }
        var cadena:string="width:"+total+"%;"+color;
        return cadena
    }

    loadWidth(cantidad:number,maximaCantidad:number){
        var total:number=(cantidad*100)/maximaCantidad;
        var cadena:string="width:"+total+"%;";
        return cadena
    }

    loadWidthParticipacion(cantidad:number){
        var total:number=(cantidad*100)/this.mayorParicipacionCiclo;
        var color = "background-color:yellow;"
        var cadena:string="width:"+total+"%;"+color;
        return cadena
    }

    loadWidthParticipacion2(cantidad:number){
        var total:number=(cantidad*100)/this.valorPartCampMax;
        var cadena:string="width:"+total+"%;";
        return cadena
    }

    loadWidthParticipacion3(cantidad:number){
        var total:number=(cantidad*100)/this.valorCartCampMax;
        var cadena:string="width:"+total+"%;";
        return cadena
    }

    loadWidthParticipacion4(cantidad:number){
        var total:number=(cantidad*100)/this.valorAuthCampMax;
        var cadena:string="width:"+total+"%;";
        return cadena
    }

    orderBy(sin_orden:any) {
        let con_orden:any[]=sin_orden
        con_orden.sort((n1,n2) => {
            if (n1.id_evento>n2.id_evento){return -1}
            if (n1.id_evento<n2.id_evento){return 1}
            return 0;
        });
    }

    orderByPart(sin_orden:any) {
        let con_orden:any[]=sin_orden
        con_orden.sort((n1,n2) => {
            if (n1.id_participacion>n2.id_participacion){return -1}
            if (n1.id_participacion<n2.id_participacion){return 1}
            return 0;
        });
    }

    loadGraphDataOne() {
        this.chartOneCategories = [];
        this.chartOneSeries = [];
        let anios:any = [];
        let carteles:any = [];
        for(let c of this.cartelesAnio){
            anios.push(c.create_time_anio_trab)
            carteles.push(c.count_trabajos)
        }
        this.chartOneSeries=[{name:"Carteles",data:carteles,color: '#006fff'}];
        this.chartOneCategories=anios
        this.initOptionsOne();
    }

    loadGraphDataTwo() {
        this.chartTwoCategories = [];
        this.chartTwoSeries = [];
        let anios:any = [];
        let carteles:any = [];
        for(let c of this.eventCampAnio){
            anios.push(c.create_time_anio_part)
            carteles.push(c.count_participaciones)
        }
        this.chartTwoSeries=[{name:"Eventos por campus",data:carteles,color: '#006fff'}];
        this.chartTwoCategories=anios
        this.initOptionsTwo();
    }

    initOptionsOne() {
        this.optionsChartOne = {
            chart: {
                type: 'line',
            },
            title: {
                text: 'Carteles por año',
            },
            plotOptions: {
                series: {
                    pointStart: 2023
                }
            },
            xAxis: [
                {
                    categories: this.chartOneCategories,
                    crosshair: true,
                },
            ],
            yAxis: [
                {
                    title: {
                        text: 'Carteles',
                    },
                    tickInterval: 1
                },
            ],
            tooltip: {
                shared: true,
            },
            series: this.chartOneSeries,
            credits: {
                enabled: false,
            },
            legend: {
                enabled: false,
            },
        };
        this.showChartOne = true;
    }

    initOptionsTwo() {
        this.optionsChartTwo = {
            chart: {
                type: 'line',
            },
            title: {
                text: 'Eventos de campus por año',
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                }
            },
            xAxis: [
                {
                    categories: this.chartTwoCategories,
                    crosshair: true,
                },
            ],
            yAxis: [
                {
                    title: {
                        text: 'Eventos',
                    },
                    tickInterval: 1
                },
            ],
            tooltip: {
                shared: true,
            },
            series: this.chartTwoSeries,
            credits: {
                enabled: false,
            },
            legend: {
                enabled: false,
            },
        };
        this.showChartTwo = true;
    }

    protected readonly Highcharts = Highcharts;
}
