import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";
import {global} from "@angular/compiler/src/util";

@Injectable({
  providedIn: 'root'
})
export class BroadcastingService {

  constructor(private http: HttpClient, private globals: GlobalsVars) {}

  authorize(socketId: any, callback: any, channel: any) {
    const PAYLOAD = {
      socket_id: socketId,
      channel_name: channel.name
    }
    const ENDPOINT = this.globals.base_broadcasting_auth_url
    return this.http.post(ENDPOINT, PAYLOAD)
  }
}
