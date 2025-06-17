import { Injectable, ElementRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as XLSXX from 'xlsx-js-style';
import { ExcelJson } from '../interfaces/excel-json';
import {isSet} from "lodash";

const EXCEL_EXTENSION = '.xlsx';
const CSV_EXTENSION = '.csv';
const CSV_TYPE = 'text/plain;charset=utf-8';

@Injectable()
export class ExportService {
  constructor() { }

  /**
   * Creates excel from the table element reference.
   *
   * @param element DOM table element reference.
   * @param fileName filename to save as.
   */
  public exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);

  }

  /**
   * Creates XLSX option from the Json data. Use this to customise the sheet by adding arbitrary rows and columns.
   *
   * @param json Json data to create xlsx.
   * @param fileName filename to save as.
   */
  public exportJsonToExcel(json: ExcelJson[], fileName: string): void {
    // inserting first blank row
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      json[0].data,
      this.getOptions(json[0])
    );

    for (let i = 1, length = json.length; i < length; i++) {
      // adding a dummy row for separation
      XLSX.utils.sheet_add_json(
        worksheet,
        [{}],
        this.getOptions(
          {
            data: [],
            skipHeader: true
          }, -1)
      );
      XLSX.utils.sheet_add_json(
        worksheet,
        json[i].data,
        this.getOptions(json[i], -1)
      );
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  /**
   * Creates XLSX option from the data.
   *
   * @param json Json data to create xlsx.
   * @param origin XLSX option origin.
   * @returns options XLSX options.
   */
  private getOptions(json: ExcelJson, origin?: number): any {
    // adding actual data
    const options = {
      skipHeader: true,
      origin: -1,
      header: Array<string>()
    };
    options.skipHeader = json.skipHeader ? json.skipHeader : false;
    if (!options.skipHeader && json.header && json.header.length) {
      options.header = json.header;
    }
    if (origin) {
      options.origin = origin ? origin : -1;
    }
    return options;
  }

  /**
   * Saves the file on client's machine via FileSaver library.
   *
   * @param buffer The data that need to be saved.
   * @param fileName File name to save as.
   * @param fileType File type to save as.
   */
  public saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  }

  /**
   * Creates an array of data to csv. It will automatically generate title row based on object keys.
   *
   * @param rows array of data to be converted to CSV.
   * @param fileName filename to save as.
   * @param columns array of object properties to convert to CSV. If skipped, then all object properties will be used for CSV.
   */
  public exportToCsv(rows: object[], fileName: string, columns?: string[]) {
    const separator = ',';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns?.length) {
        return columns.includes(k);
      } else {
        return true;
      }
    });
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map((row: any) => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
    this.saveAsFile(csvContent, `${fileName}${CSV_EXTENSION}`, CSV_TYPE);
  }

  /**
   * Creates XLSX option from the Json data. Use this to customise the sheet by adding arbitrary rows and columns.
   *
   * @param json Json data to create xlsx.
   * @param fileName filename to save as.
   */
  public exportArrayToExcel(json: ExcelJson[], fileName: string): void {
    //Declare json data values in array
    let array: any[] = json[0].data ;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      json[0].data,
      this.getOptions(json[0])
    );
    if(array[0]['M']){
      worksheet["!cols"] = [{width:15},{width:35},{width:38},{width:30},{width:22},{width:25},{width:30},{width:50},{width:35},{width:26},{width:25},{width:25},{width:25}];
    }else{
      worksheet["!cols"] = [{width:15},{width:40},{width:40},{width:32},{width:15},{width:25},{width:18}];
    }
    //loop through the array and assign a color when they match
    for (let i = 1, length = json.length; i < length; i++) {
      XLSX.utils.sheet_add_json(
        worksheet,
        [{}],
        this.getOptions(
          {
            data: [],
            skipHeader: true
          }, -1)
      );
      XLSX.utils.sheet_add_json(
        worksheet,
        json[i].data,
        this.getOptions(json[i], -1)
      );
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participaciones");
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportRegistrosToExcel(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data ;
    //Validate number of columns and assign the width of each column
    let arraycolumns:any[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U'];
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++){
      let col:any = arraycolumns[j];
      array[0][col] = {
        v:array[0][col],
        s:{
          font:{bold:true,sz:12,color:{rgb:"000000"}},
          border: {
            top:{style:"thin",color: "000000"},
            right:{style:"thin",color: "000000"},
            bottom:{style:"thin",color: "000000"},
            left:{style:"thin",color: "000000"}
          },
          alignment:{vertical:'top',wrapText:true}
        }
      }
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSXX.WorkSheet = XLSXX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    //Validate number of columns and assign the width of each column
    worksheet["!cols"] = [
      {width:25},//A
      {width:50},//B
      {width:35},//C
      {width:25},//D
      {width:50},//E
      {width:50},//F
      {width:50},//G
      {width:50},//H
      {width:50},//I
      {width:40},//J
      {width:40},//K
      {width:25},//L
      {width:40},//M
      {width:40},//N
      {width:25},//O
      {width:50},//P
      {width:20},//Q
      {width:20},//R
      {width:22},//S
      {width:22}//T
    ];

    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
          if(col=="U"){

          }else if(col=="L"){

            var avance1 = array[i]["U"] * 100
            var avance2 = ( array[i]["L"] * 100 / avance1 )
            var avance_color = "FFFFFF";

            if(avance2 >= 100){
              avance_color = "98ff66";
            }else if(avance2 <= 99 && avance2 >= 80){
              avance_color = "feff00";
            }else if(avance2 <= 79 && avance2 >= 65){
              avance_color = "ffc200";
            }else if(avance2 < 65){
              avance_color = "f50504";
            }

            if(array[i][col]==null || array[i][col]==""){
              array[i][col] = "Desconocido";
              avance_color = "ffffff";
            }else{
              array[i][col] = array[i][col]+"%";
            }

            array[i][col] = {
              v: array[i][col],
              s: {
                font:{bold:true,sz:11,color:{rgb:"000000"}},
                fill: {fgColor: {rgb: avance_color}},
                alignment: {vertical: 'top', wrapText: true},
                border: {
                  top: {style: "thin", color: "000000"},
                  right: {style: "thin", color: "000000"},
                  bottom: {style: "thin", color: "000000"},
                  left: {style: "thin", color: "000000"}
                }
              }
            }

            arrayrows.push(array[i][col]);
          }else if(col=="O"){

            var avance1 = array[i]["U"] * 100
            var avance2 = ( array[i]["O"] * 100 / avance1 )
            var avance_color = "FFFFFF";

            //console.log("avance2",avance2);

            if(avance2 >= 100){
              avance_color = "98ff66";
            }else if(avance2 <= 99 && avance2 >= 80){
              avance_color = "feff00";
            }else if(avance2 <= 79 && avance2 >= 65){
              avance_color = "ffc200";
            }else if(avance2 < 65){
              avance_color = "f50504";
            }

            if(array[i][col]==null || array[i][col]==""){
              array[i][col] = "Desconocido";
              avance_color = "ffffff";
            }else{
              array[i][col] = array[i][col]+"%";
            }

            array[i][col] = {
              v: array[i][col],
              s: {
                font:{bold:true,sz:11,color:{rgb:"000000"}},
                fill: {fgColor: {rgb: avance_color}},
                alignment: {vertical: 'top', wrapText: true},
                border: {
                  top: {style: "thin", color: "000000"},
                  right: {style: "thin", color: "000000"},
                  bottom: {style: "thin", color: "000000"},
                  left: {style: "thin", color: "000000"}
                }
              }
            }
            arrayrows.push(array[i][col]);
          }else {
            if (array[i][col] == null || array[i][col] == "") {
              array[i][col] = 'Desconocido'
            }
            array[i][col] = {
              v: array[i][col], s: {
                fill: {fgColor: {rgb: "FFFFFF"}},
                alignment: {vertical: 'top', wrapText: true},
                border: {
                  top: {style: "thin", color: "000000"},
                  right: {style: "thin", color: "000000"},
                  bottom: {style: "thin", color: "000000"},
                  left: {style: "thin", color: "000000"}
                }
              }
            }
            arrayrows.push(array[i][col]);
          }
      }
      //assign data from rows in worksheet
      XLSXX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportRep2ToExcel(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data ;
    //Validate number of columns and assign the width of each column
    let arraycolumns:any[] = ['A','B','C','D','E'];
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++){
      let col:any = arraycolumns[j];
      array[0][col] = {
        v:array[0][col],
        s:{
          font:{bold:true,sz:12,color:{rgb:"000000"}},
          border: {
            top:{style:"thin",color: "000000"},
            right:{style:"thin",color: "000000"},
            bottom:{style:"thin",color: "000000"},
            left:{style:"thin",color: "000000"}
          },
          alignment:{vertical:'top',wrapText:true}
        }
      }
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSXX.WorkSheet = XLSXX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    //Validate number of columns and assign the width of each column
    worksheet["!cols"] = [
      {width:12},//A
      {width:40},//B
      {width:25},//C
      {width:25},//D
      {width:25},//E
    ];

    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        array[i][col] = {
            v: array[i][col], s: {
              fill: {fgColor: {rgb: "FFFFFF"}},
              alignment: {vertical: 'top', wrapText: true},
              border: {
                top: {style: "thin", color: "000000"},
                right: {style: "thin", color: "000000"},
                bottom: {style: "thin", color: "000000"},
                left: {style: "thin", color: "000000"}
              }
            }
          }
          arrayrows.push(array[i][col]);
      }
      //assign data from rows in worksheet
      XLSXX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportRep3ToExcel(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data ;
    //Validate number of columns and assign the width of each column
    let arraycolumns:any[] = ['A','B','C','D','E','F','G','H','I'];
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++){
      let col:any = arraycolumns[j];
      array[0][col] = {
        v:array[0][col],
        s:{
          font:{bold:true,sz:12,color:{rgb:"000000"}},
          border: {
            top:{style:"thin",color: "000000"},
            right:{style:"thin",color: "000000"},
            bottom:{style:"thin",color: "000000"},
            left:{style:"thin",color: "000000"}
          },
          alignment:{vertical:'top',wrapText:true}
        }
      }
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSXX.WorkSheet = XLSXX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    //Validate number of columns and assign the width of each column
    worksheet["!cols"] = [
      {width:12},//A
      {width:40},//B
      {width:12},//C
      {width:40},//D
      {width:20},//E
      {width:23},//F
      {width:25},//G
      {width:15},//H
      {width:15}//I
    ];

    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        array[i][col] = {
          v: array[i][col], s: {
            fill: {fgColor: {rgb: "FFFFFF"}},
            alignment: {vertical: 'top', wrapText: true},
            border: {
              top: {style: "thin", color: "000000"},
              right: {style: "thin", color: "000000"},
              bottom: {style: "thin", color: "000000"},
              left: {style: "thin", color: "000000"}
            }
          }
        }
        arrayrows.push(array[i][col]);
      }
      //assign data from rows in worksheet
      XLSXX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportRep4ToExcel(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data ;
    //Validate number of columns and assign the width of each column
    let arraycolumns:any[] = ['A','B','C','D','E','F','G'];
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++){
      let col:any = arraycolumns[j];
      array[0][col] = {
        v:array[0][col],
        s:{
          font:{bold:true,sz:12,color:{rgb:"000000"}},
          border: {
            top:{style:"thin",color: "000000"},
            right:{style:"thin",color: "000000"},
            bottom:{style:"thin",color: "000000"},
            left:{style:"thin",color: "000000"}
          },
          alignment:{vertical:'top',wrapText:true}
        }
      }
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSXX.WorkSheet = XLSXX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    //Validate number of columns and assign the width of each column
    worksheet["!cols"] = [
      {width:12},//A
      {width:40},//B
      {width:20},//C
      {width:23},//D
      {width:25},//E
      {width:15},//F
      {width:15}//G
    ];

    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        array[i][col] = {
          v: array[i][col], s: {
            fill: {fgColor: {rgb: "FFFFFF"}},
            alignment: {vertical: 'top', wrapText: true},
            border: {
              top: {style: "thin", color: "000000"},
              right: {style: "thin", color: "000000"},
              bottom: {style: "thin", color: "000000"},
              left: {style: "thin", color: "000000"}
            }
          }
        }
        arrayrows.push(array[i][col]);
      }
      //assign data from rows in worksheet
      XLSXX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportReporteEventoToExcelConCiclos(json: ExcelJson[], fileName: string, num_cols:number, num_ciclos:number): void {

    var cols:number=num_cols-1;
    var ciclos:number=num_ciclos;
    var cols_total:number=cols-(2+(2*ciclos));
    let array: any[] = json[0].data ;
    var arrayrows = [];

    for (let i = 0; i < array.length; i++) {
      var flag1 = 1;
      var flag2 = 1;

      var bold = false;
      var size = 11;
      var horizontal = "left";
      var vertical = "top";
      if(i==0){
        bold = true;
        size = 16;
        horizontal = "center";
        vertical = "center";
      }
      if(i==2){
        bold = true;
        size = 14;
        horizontal = "center";
        vertical = "center";
      }
      if(i==3){
        bold = true;
        size = 12;
      }
      for (let j = 0; j <= cols; j++) {
        var fgColor:string="ffffff";
        var color:string="000000";
        if(array[i][j]===null){
          array[i][j]="Desconocido";
        }
        if(j==0){
          fgColor="ffffff";
        }else if(j==cols-4 || j==cols-3 || j==cols-2 || j==cols-1 || j==cols){
          fgColor="dce6f1";
        }else if(j==cols-9 || j==cols-8 || j==cols-7 || j==cols-6 || j==cols-5){
          fgColor="ebf1de";
        }else{
          if(flag2<=ciclos){
            fgColor="f50504";
            if(flag1==1 || flag1==2){
              if(i==2){
                fgColor="ffffff";
              }else{
                fgColor="fabf8f";
              }
            }else if(flag1==3 || flag1==4 || flag1==5 || flag1==6 || flag1==7){
              fgColor="ddd9c4";
            }else if(flag1==8 || flag1==9 || flag1==10 || flag1==11){
              fgColor="f2dcdb";
            }else if(flag1==12){
              fgColor="f2dcdb";
              flag1=0;
              flag2=flag2+1;
            }
            flag1=flag1+1;
          }
        }
        if(i==0){
          fgColor="225CA7";
          color="ffffff";
        }
        array[i][j] = {
          v: array[i][j], s: {
            font:{bold:bold,sz:size,color:{rgb:color}},
            fill: {fgColor: {rgb: fgColor}},
            alignment: {vertical: vertical, horizontal: horizontal, wrapText: true},
            border: {
              top: {style: "thin", color: "000000"},
              right: {style: "thin", color: "000000"},
              bottom: {style: "thin", color: "000000"},
              left: {style: "thin", color: "000000"}
            }
          }
        }

      }
    }

    for (let i = 4, length = array.length; i < length; i++) {
      for (let j = 0; j <= cols; j++) {
        if(array[0][j].v == "Color") {
          var jl = j-1;
          var avance_color = array[i][j].v;
          var letre_color = "000000";
          var negritas= false;
          var avance = "";
          if(avance_color==="f50504"){letre_color = "ffffff";negritas=true;}
          if(array[i][jl].v!="Desconocido"){avance=" %";}else{avance=""}
          array[i][jl] = {
            v: array[i][jl].v+avance,
            s: {
              font: {bold: negritas, sz: 11, color: {rgb: letre_color}},
              fill: {fgColor: {rgb: avance_color}},
              alignment: {vertical: 'top', wrapText: true},
              border: {
                top: {style: "thin", color: "000000"},
                right: {style: "thin", color: "000000"},
                bottom: {style: "thin", color: "000000"},
                left: {style: "thin", color: "000000"}
              }
            }
          }
        }
      }
    }

    var worksheet: XLSXX.WorkSheet = XLSXX.utils.json_to_sheet(
      [],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );

    worksheet["!rows"] = [
      {hpt:30},{hpt:20},{hpt:30},{hpt:30}
    ];

    if(ciclos==1){
      worksheet["!cols"] = [
        {width:40},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:40},{width:40},{width:50},{width:40},{width:40},{width:40},{width:50},{width:40}
      ];
      worksheet["!merges"] = [
        {s:{r:0,c:0},e:{r:0,c:cols_total}},{s:{r:1,c:0},e:{r:1,c:cols_total}},
        {s:{r:2,c:1},e:{r:2,c:2}},{s:{r:2,c:3},e:{r:2,c:6}},{s:{r:2,c:7},e:{r:2,c:10}},
        {s:{r:2,c:11},e:{r:2,c:14}},{s:{r:2,c:15},e:{r:2,c:18}},
      ];
    }else if(ciclos==2){
      worksheet["!cols"] = [
        {width:40},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:40},{width:40},{width:50},{width:40},{width:40},{width:40},{width:50},{width:40}
      ];
      worksheet["!merges"] = [
        {s:{r:0,c:0},e:{r:0,c:cols_total}},{s:{r:1,c:0},e:{r:1,c:cols_total}},
        {s:{r:2,c:1},e:{r:2,c:2}},{s:{r:2,c:3},e:{r:2,c:6}},{s:{r:2,c:7},e:{r:2,c:10}},
        {s:{r:2,c:11},e:{r:2,c:12}},{s:{r:2,c:13},e:{r:2,c:16}},{s:{r:2,c:17},e:{r:2,c:20}},
        {s:{r:2,c:21},e:{r:2,c:24}},{s:{r:2,c:25},e:{r:2,c:28}},
      ];
    }else if(ciclos==3){
      worksheet["!cols"] = [
        {width:40},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:40},{width:40},{width:50},{width:40},{width:40},{width:40},{width:50},{width:40}
      ];
      worksheet["!merges"] = [
        {s:{r:0,c:0},e:{r:0,c:cols_total}},{s:{r:1,c:0},e:{r:1,c:cols_total}},
        {s:{r:2,c:1},e:{r:2,c:2}},{s:{r:2,c:3},e:{r:2,c:6}},{s:{r:2,c:7},e:{r:2,c:10}},
        {s:{r:2,c:11},e:{r:2,c:12}},{s:{r:2,c:13},e:{r:2,c:16}},{s:{r:2,c:17},e:{r:2,c:20}},
        {s:{r:2,c:21},e:{r:2,c:22}},{s:{r:2,c:23},e:{r:2,c:26}},{s:{r:2,c:27},e:{r:2,c:30}},
        {s:{r:2,c:31},e:{r:2,c:34}},{s:{r:2,c:35},e:{r:2,c:38}},
      ];
    }else if(ciclos==4){
      worksheet["!cols"] = [
        {width:40},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:40},{width:40},{width:50},{width:40},{width:40},{width:40},{width:50},{width:40}
      ];
      worksheet["!merges"] = [
        {s:{r:0,c:0},e:{r:0,c:cols_total}},{s:{r:1,c:0},e:{r:1,c:cols_total}},
        {s:{r:2,c:1},e:{r:2,c:2}},{s:{r:2,c:3},e:{r:2,c:6}},{s:{r:2,c:7},e:{r:2,c:10}},
        {s:{r:2,c:11},e:{r:2,c:12}},{s:{r:2,c:13},e:{r:2,c:16}},{s:{r:2,c:17},e:{r:2,c:20}},
        {s:{r:2,c:21},e:{r:2,c:22}},{s:{r:2,c:23},e:{r:2,c:26}},{s:{r:2,c:27},e:{r:2,c:30}},
        {s:{r:2,c:31},e:{r:2,c:32}},{s:{r:2,c:33},e:{r:2,c:36}},{s:{r:2,c:37},e:{r:2,c:40}},
        {s:{r:2,c:41},e:{r:2,c:44}},{s:{r:2,c:45},e:{r:2,c:48}},
      ];
    }else if(ciclos==5){
      worksheet["!cols"] = [
        {width:40},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:35},{width:25},{width:12},{width:20},{width:35},{width:50},{width:12},{width:25},{width:40},{width:55},
        {width:40},{width:40},{width:50},{width:40},{width:40},{width:40},{width:50},{width:40}
      ];
      worksheet["!merges"] = [
        {s:{r:0,c:0},e:{r:0,c:cols_total}},{s:{r:1,c:0},e:{r:1,c:cols_total}},
        {s:{r:2,c:1},e:{r:2,c:2}},{s:{r:2,c:3},e:{r:2,c:6}},{s:{r:2,c:7},e:{r:2,c:10}},
        {s:{r:2,c:11},e:{r:2,c:12}},{s:{r:2,c:13},e:{r:2,c:16}},{s:{r:2,c:17},e:{r:2,c:20}},
        {s:{r:2,c:21},e:{r:2,c:22}},{s:{r:2,c:23},e:{r:2,c:26}},{s:{r:2,c:27},e:{r:2,c:30}},
        {s:{r:2,c:31},e:{r:2,c:32}},{s:{r:2,c:33},e:{r:2,c:36}},{s:{r:2,c:37},e:{r:2,c:40}},
        {s:{r:2,c:41},e:{r:2,c:42}},{s:{r:2,c:43},e:{r:2,c:46}},{s:{r:2,c:47},e:{r:2,c:50}},
        {s:{r:2,c:51},e:{r:2,c:54}},{s:{r:2,c:55},e:{r:2,c:58}},
      ];
    }

    for (let i = 0, length = array.length; i < length; i++) {
      for (let j = 0; j <= cols; j++) {
        if(array[1][j].v != "Color") {
          arrayrows.push(array[i][j]);
        }

      }
      //assign data from rows in worksheet
      XLSXX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportReporteEventoToExcelSinCiclos(json: ExcelJson[], fileName: string): void {

    var cols = 10;
    let array: any[] = json[0].data ;
    var arrayrows = [];

    var size:number=11;
    var horizontal:string="center";
    var bold:boolean=true;
    var fgColor:string="000000";
    var color:string="000000";
    var avance:string="";

    for (let i = 0, length = array.length; i < length; i++) {
      if (i==0){
        size=16;
        horizontal="center";
        bold=true;
        fgColor="225CA7";
        color="ffffff";
      }else if (i==1){
        size=16;
        horizontal="center";
        bold=true;
        fgColor="ffffff";
        color="000000";
      }else if (i==2){
        size=14;
        horizontal="center";
        bold=true;
        fgColor="ffffff";
        color="000000";
      }else if (i==3){
        size=12;
        horizontal="left";
        bold=true;
        fgColor="ffffff";
        color="000000";
      }else{
        size=11;
        horizontal="left";
        bold=false;
        fgColor="ffffff";
        color="000000";
      }
      for (let j = 0; j <= cols; j++) {
        if(array[i][j]===null){
          array[i][j]="Desconocido";
        }else{
          if(j==4 || j==9){avance=" %";}else{avance=""}
        }
        if(i>1){
          if(j==0 ){fgColor="D3D6DA";}
          if(j==1 || j==2 || j==3 || j==4){fgColor="8db4e2";}
          if(j==5 || j==6 || j==7 || j==8){fgColor="E6F1FA";}
        }

        array[i][j] = {
          v: array[i][j]+avance, s: {
            font: {bold: bold, sz: size, color: {rgb: color}},
            fill: {fgColor: {rgb: fgColor}},
            alignment: {vertical: "center", horizontal: horizontal, wrapText: true},
            border: {
              top: {style: "thin", color: "000000"},
              right: {style: "thin", color: "000000"},
              bottom: {style: "thin", color: "000000"},
              left: {style: "thin", color: "000000"}
            }
          }
        }

        if(i==1 || i==2){
          if(j==0){
            array[i][j] = {
              v: array[i][j].v, s: {
                font: {bold: bold, sz: size, color: {rgb: "ffffff"}},
                fill: {fgColor: {rgb: "ffffff"}},
                alignment: {vertical: "center", horizontal: horizontal, wrapText: true},
                border: {
                  top: {style: "thin", color: "ffffff"},
                  right: {style: "thin", color: "ffffff"},
                  bottom: {style: "thin", color: "ffffff"},
                  left: {style: "thin", color: "ffffff"}
                }
              }
            }
          }
        }


      }
    }

    for (let i = 4, length = array.length; i < length; i++) {
      for (let j = 0; j <= cols; j++) {
        if(array[3][j].v == "Color") {
          var jl = j-1;
          var avance_color = array[i][j].v;
          var letre_color = "000000";
          var negritas= false;
          if(avance_color==="f50504"){letre_color = "ffffff";negritas=true;}
          array[i][jl] = {
            v: array[i][jl].v,
            s: {
              font: {bold: negritas, sz: 11, color: {rgb: letre_color}},
              fill: {fgColor: {rgb: avance_color}},
              alignment: {vertical: 'top', wrapText: true},
              border: {
                top: {style: "thin", color: "000000"},
                right: {style: "thin", color: "000000"},
                bottom: {style: "thin", color: "000000"},
                left: {style: "thin", color: "000000"}
              }
            }
          }
        }
      }
    }

    var worksheet: XLSXX.WorkSheet = XLSXX.utils.json_to_sheet(
      [],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );

    worksheet["!cols"] = [
      {width:42},{width:14},{width:22},{width:37},{width:37},{width:14},{width:25},{width:40},{width:45}
    ];

    worksheet["!rows"] = [
      {hpt:30},{hpt:30},{hpt:30}
    ];

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
      { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } },
      { s: { r: 2, c: 5 }, e: { r: 2, c: 8 } },
    ];

    for (let i = 0, length = array.length; i < length; i++) {
      for (let j = 0; j <= cols; j++) {
        if(array[3][j].v != "Color") {
          arrayrows.push(array[i][j]);
        }
      }
      //assign data from rows in worksheet
      XLSXX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportArrayToExcelColor(json: ExcelJson[], fileName: string): void {
    //console.log("json",json)
    //Declare json data values in array
    let array: any[] = json[0].data ;
    //Validate number of columns and assign the width of each column
    let arraycolumns:any[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++){
      let col:any = arraycolumns[j];
      array[0][col] = {
        v:array[0][col],
        s:{
          font:{bold:true,sz:11,color:{rgb:"FFFFFF" }},
          border:{
            top:{style:"thin",color: "000000"},
            left:{style:"thin",color: "000000"}
          },
          fill:{fgColor:{rgb:"215CA6"}},
          alignment:{vertical:'top'}
        }
      }
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSXX.WorkSheet = XLSXX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    //Validate number of columns and assign the width of each column
    worksheet["!cols"] = [{width:15},{width:35},{width:35},{width:32},{width:23},{width:25},{width:30},{width:40},{width:50},{width:35},{width:26},{width:25},{width:25},{width:25}];

    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        if(col=='A' || col=='B' || col=='C' || col=='D' || col=='E' || col=='F' || col=='G'){
          if(array[i][col]==null){array[i][col]='Desconocido'}
          if(array[i][col]!=''){
            array[i][col] = {
              v:array[i][col],
              s:{
                alignment:{vertical:'top',wrapText:true},
                fill:{fgColor:{rgb:"e7e7e7"}},
                border:{top:{style:"thin",color: "000000"},
                        right:{style:"thin",color: "000000"},
                        bottom:{style:"thin",color: "000000"},
                        left:{style:"thin",color: "000000"}
                }
              }
            }
          }else{
            array[i][col]={v:array[i][col],s: {
                fill: {fgColor: {rgb: "e7e7e7"}},
                alignment: {vertical: 'top', wrapText: true},
                border: {
                  top:{style:"thin",color: "000000"},
                  right:{style:"thin",color: "000000"},
                  bottom:{style:"thin",color: "000000"},
                  left:{style:"thin",color: "000000"}
                }
              }
                          }
          }
          arrayrows.push(array[i][col]);
        }else{
          if(array[i][1]!=''){
            array[i][col] = {v:array[i][col],
                             s:{
                               border:{
                                 top:{style:"thin",color: "000000"},
                                 right:{style:"thin",color: "000000"},
                                 bottom:{style:"thin",color: "000000"},
                                 left:{style:"thin",color: "000000"}
                               },
                                alignment:{vertical:'top',wrapText:true}
                               }
                            };
          }
          arrayrows.push(array[i][col]);
        }
      }
      //assign data from rows in worksheet
      XLSXX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participaciones");
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportJsonToExcelMyZone(json: ExcelJson[], fileName: string): void {
    // inserting first blank row
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      json[0].data,
      this.getOptions(json[0])
    );

    worksheet["!cols"] = [
      {width:40},{width:30},{width:40},{width:10},{width:10},{width:20},{width:40},{width:60},{width:50}
    ];

    for (let i = 1, length = json.length; i < length; i++) {
      // adding a dummy row for separation
      XLSX.utils.sheet_add_json(
        worksheet,
        [{}],
        this.getOptions(
          {
            data: [],
            skipHeader: true
          }, -1)
      );
      XLSX.utils.sheet_add_json(
        worksheet,
        json[i].data,
        this.getOptions(json[i], -1)
      );
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    // save to file
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportJsonToExcelMyImpact(json: ExcelJson[], fileName: string): void {
    // inserting first blank row
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      json[0].data,
      this.getOptions(json[0])
    );

    worksheet["!cols"] = [
      {width:40},{width:35},{width:40},{width:40},{width:7},{width:40},{width:15},{width:50},{width:15},{width:50},{width:7},{width:40},{width:40},{width:40}
    ];

    for (let i = 1, length = json.length; i < length; i++) {
      // adding a dummy row for separation
      XLSX.utils.sheet_add_json(
        worksheet,
        [{}],
        this.getOptions(
          {
            data: [],
            skipHeader: true
          }, -1)
      );
      XLSX.utils.sheet_add_json(
        worksheet,
        json[i].data,
        this.getOptions(json[i], -1)
      );
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    // save to file
    XLSXX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

}

