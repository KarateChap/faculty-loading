import { Component, OnInit } from '@angular/core';
import { UIService } from '../shared/UIService/ui.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private uiService: UIService) { }

  ngOnInit(): void {
  }

  openToast(){
    this.uiService.showWarningToast('This is a success Message!', 'Success');
  }

}
