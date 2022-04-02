import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UIService {
  constructor(private toastr: ToastrService) {}

  loadingStateChanged = new Subject<boolean>();

  showSuccessToast(message: string, title: string) {
    this.toastr.success(message, title);
  }
  showErrorToast(message: string, title: string) {
    this.toastr.error(message, title);
  }
  showWarningToast(message: string, title: string) {
    this.toastr.warning(message, title);
  }
}
