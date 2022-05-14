import { LoadItem } from "./load-item.model";

export interface UserLoad {
  id: string;
  year: string;
  semester: string;
  department: string;
  chairpersonName: string;
  status: string;
  dateSubmitted: Date;
  comment: string;
  idNumber: string;
  loadItem: LoadItem[];
}
