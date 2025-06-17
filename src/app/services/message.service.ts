import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: "root",
})
export class MessageService {

  toastrOptions = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "showDuration": 300,
    "hideDuration": 100,
    "timeOut": 5000,
    "extendedTimeOut": 1000,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  constructor(private toastr: ToastrService) {}

  showPopupMessage(title: string, message: string, type: string) {
    if (type === 'success'){
      this.toastr.success(message, title, this.toastrOptions);
    }else{
      this.toastr.error(message, title, this.toastrOptions);
    }
  }

}
