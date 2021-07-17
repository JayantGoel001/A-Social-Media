import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {UserDataService} from "../user-data.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


	public data:any = {  };

	constructor(
		public auth: AuthService,
		private userData : UserDataService
	) {

	}
	ngOnInit(): void {
		this.userData.getUserData.subscribe((data)=>{
			this.data = data;
		});
	}
}
