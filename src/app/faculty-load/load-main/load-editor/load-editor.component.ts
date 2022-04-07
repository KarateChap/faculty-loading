import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Faculty } from 'src/app/shared/models/faculty.model';

@Component({
  selector: 'app-load-editor',
  templateUrl: './load-editor.component.html',
  styleUrls: ['./load-editor.component.css']
})
export class LoadEditorComponent implements OnInit {
  @Input() activeFaculty: Faculty;
  displayedColumns = [
    'code',
    'subjectTitle',
    'units',
    'preReq',
    'subjectSemester',
    'subjectYear',
    'department',
  ];
  dataSource = new MatTableDataSource<void>();

  constructor() { }

  ngOnInit(): void {

  }

  doFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
