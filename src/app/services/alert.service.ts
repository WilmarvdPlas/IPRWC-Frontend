  import { Injectable } from '@angular/core';
import swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  fireDeleteWarning(text: string) {
    return swal.fire({
      title: 'Weet u het zeker?',
      text: text,
      icon: 'warning',
      iconColor: '',
      showCancelButton: true,
      confirmButtonColor: '',
      cancelButtonColor: '',
      confirmButtonText: 'Ja, verwijder het',
      cancelButtonText: 'Nee, annuleer het',
    })
  }

  fireSuccess(text: string) {
    return swal.fire({
      title: 'Gelukt!',
      text: text,
      icon: 'success',
      iconColor: '',
      confirmButtonColor: '',
      confirmButtonText: 'Ok',
    })
  }

  fireError(text: string) {
    return swal.fire({
      title: 'Helaas!',
      text: text,
      icon: 'error',
      iconColor: '',
      confirmButtonColor: '',
      confirmButtonText: 'Ok',
    })
  }
}
