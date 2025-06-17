import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import {GlobalsVars} from "./global/globals-vars";
/*import Echo from 'laravel-echo';
import Pusher from 'pusher-js';*/
import {BroadcastingService} from "./services/broadcasting/broadcasting.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scintra-web';
  loggedIn = false;

  constructor(private authService: AuthService, private globalVars: GlobalsVars, private broadcastingService: BroadcastingService)
  {
    //this.loggedIn = this.authService.loggedIn();
    this.loggedIn = true;
/*
    // @ts-ignore
    window.Pusher = Pusher;

    // @ts-ignore
    window.Echo = new Echo({
      authEndpoint: globalVars.base_broadcasting_auth_url,
      broadcaster: 'pusher',
      key: 'c068ba4a5420765bfef1',
      cluster: 'mt1',
      forceTLS: true,
      authorizer: (channel: any, options: any) => {
        return {
          authorize: (socketId: any, callback: any) => {
              broadcastingService.authorize(socketId, callback, channel).subscribe(
                  (response: any) => {
                    callback(null, response)
                  }, (error: any) => {
                    callback(error)
                  }
              )
          }
        };
      },
    });*/


    // @ts-ignore
    /*window.Echo.private(`coord.87`)
        .listen('AlumnoUpdated', (payload: any) => {
          console.log(payload);
        });*/
  }

}
