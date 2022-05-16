import { NewNotification } from "./new-notification.model";

export interface NewUser {
  idNumber: string;
  email: string;
  fullName: string;
  department: string;
  isActivated: boolean;
  startDate: any;
  endDate: any;
  notification: NewNotification[];
}
