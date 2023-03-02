import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private toaster: ToastrService) {}

  ngOnInit() {
    this.toaster.success('kaas', 'titel')
  }

}
