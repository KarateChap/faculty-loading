import { LoadItem } from "./load-item.model";

export interface Load{
  facultyName: string;
  facultyId: string;
  department: string;
  chairperson: string;
  semester: string;
  schoolYear: string;
  loadItems: LoadItem [];
}
