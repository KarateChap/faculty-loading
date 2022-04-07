import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { FacultyService } from 'src/app/shared/services/faculty.service';

@Component({
  selector: 'app-load-main',
  templateUrl: './load-main.component.html',
  styleUrls: ['./load-main.component.css'],
})
export class LoadMainComponent implements OnInit, OnDestroy {
  activeFacultyId = '';
  activeFaculty: Faculty;
  facultySubs: Subscription;

  constructor(
    private route: ActivatedRoute,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    this.activeFacultyId = this.route.snapshot.params['id'];
    this.facultyService.fetchActiveFaculty(this.activeFacultyId);
    this.facultySubs = this.facultyService.activeFacultyChanged.subscribe(
      (faculty) => {
        this.activeFaculty = faculty;
      }
    );
  }
  ngOnDestroy(): void {
    this.facultySubs.unsubscribe();
  }
}
