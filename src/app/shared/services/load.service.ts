import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { UIService } from "../UIService/ui.service";

@Injectable({providedIn: 'root'})
export class LoadService {

  constructor(private af: AngularFirestore, private uiService: UIService){
  }




}
