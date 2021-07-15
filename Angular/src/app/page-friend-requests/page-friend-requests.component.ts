import { Component, OnInit } from '@angular/core';
import {UserDataService} from "../user-data.service";

@Component({
	selector: 'app-page-friend-requests',
	templateUrl: './page-friend-requests.component.html',
	styleUrls: ['./page-friend-requests.component.css']
})
export class PageFriendRequestsComponent implements OnInit {
	public data:any

	constructor(private userData :UserDataService) {  }

	ngOnInit(): void {
		this.userData.getUserData.subscribe((data)=>{
			this.data = data;
			console.log(this.data);
		});
	}


}
