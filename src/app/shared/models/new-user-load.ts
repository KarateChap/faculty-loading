import { LoadItem } from "./load-item.model";

export interface NewUserLoad {
  year: string;
  semester: string;
  department: string;
  chairpersonName: string;
  status: string;
  dateSubmitted: Date;
  comment: string;
  idNumber: string;
  loadItem: LoadItem[];
  notification: Notification[];
}
