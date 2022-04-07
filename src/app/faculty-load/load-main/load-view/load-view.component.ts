import { Component, Input, OnInit } from '@angular/core';
import { Faculty } from 'src/app/shared/models/faculty.model';

@Component({
  selector: 'app-load-view',
  templateUrl: './load-view.component.html',
  styleUrls: ['./load-view.component.css']
})
export class LoadViewComponent implements OnInit {
  @Input() activeFaculty: Faculty;
  constructor() { }

  ngOnInit(): void {
  }

}
