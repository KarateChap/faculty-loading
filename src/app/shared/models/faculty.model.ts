import { FacultySchedule } from "./faculty-schedule.model";

export interface Faculty{
  id: string;
  idNumber: string;
  fullName: string;
  department: string;
  facultySchedule: FacultySchedule [];
  startYear: string;
  endYear: string;
  semester: string;
  chairpersonName: string;
}

