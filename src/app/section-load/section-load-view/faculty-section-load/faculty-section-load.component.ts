import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadService } from 'src/app/shared/services/load.service';

@Component({
  selector: 'app-faculty-section-load',
  templateUrl: './faculty-section-load.component.html',
  styleUrls: ['./faculty-section-load.component.css']
})
export class FacultySectionLoadComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) private passedData: any, private loadService: LoadService) { }
  activeFaculty: any;
  ngOnInit(): void {
    this.activeFaculty = this.passedData.activeFaculty;
    console.log(this.activeFaculty);
  }

}
