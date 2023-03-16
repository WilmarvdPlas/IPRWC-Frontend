import {Component} from '@angular/core';
import {NbDialogRef, NbToastrService} from "@nebular/theme";
import {Account} from "../../../models/account.model";
import {HttpService} from "../../../services/http.service";

@Component({
  selector: 'app-account-management-dialog',
  templateUrl: './account-management-dialog.component.html',
  styleUrls: ['./account-management-dialog.component.scss']
})
export class AccountManagementDialogComponent {

  actionText?: string;
  consequenceText?: string;
  type?: string;
  account?: Account;

  constructor(private dialogRef: NbDialogRef<AccountManagementDialogComponent>, private httpService: HttpService, private toastrService: NbToastrService) {}

  close() {
    this.dialogRef.close();
  }

  confirm() {
    if (this.type == 'ADMINISTRATOR') {
      this.confirmAdministrator();
    } else if (this.type == 'DELETE') {
      this.confirmDelete();
    }
  }

  confirmAdministrator() {
    this.httpService.put('account/' + this.account?.id + '/administrator', undefined).subscribe({
      next: () => {
        this.dialogRef.close();
        this.toastrService.success('Account has been granted administrative rights.', 'Success');
      },
      error: () => {
        this.dialogRef.close();
        this.toastrService.danger('Account could not be granted administrative rights.', 'Error');
      }
    })
  }

  confirmDelete() {
    this.httpService.delete('account/' + this.account?.id).subscribe({
      next: () => {
        this.dialogRef.close();
        this.toastrService.success('Account has been deleted.', 'Success');
      },
      error: () => {
        this.dialogRef.close();
        this.toastrService.danger('Account could not be deleted.', 'Error');
      }
    })
  }

}
