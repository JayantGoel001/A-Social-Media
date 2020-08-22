import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { UserDataService } from "../user-data.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public auth:AuthService,private centralUserData:UserDataService) { }

  ngOnInit(): void {
      this.centralUserData.getUserData.subscribe((user)=>{
          this.userId = user._id;
      })
  }

  public userData = { };
  public userId:String = "";

}
