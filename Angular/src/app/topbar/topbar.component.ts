import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../local-storage.service";
import {AlertsService} from "../alerts.service";
import {UserDataService} from "../user-data.service";
import {ApiService} from "../api.service";

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

	public query:string="";
	public userName:string = "";
	public alertMessage :string = "";
	public data:any;
	public userID:any;
	public friendRequests:number=0;

	constructor(public auth: AuthService,private router:Router,private localStorage:LocalStorageService,private alerts:AlertsService,private userData:UserDataService,public api:ApiService){  }

	ngOnInit(): void {
		let parsedToken = this.localStorage.getParsedToken();
		this.userName = parsedToken.name;
		this.userID = parsedToken._id;

		this.alerts.onAlertEvent.subscribe((message:string)=>{
			this.alertMessage = message;
		});
		this.alerts.updateNumberOfFriendRequestEvent.subscribe((message:string)=>{
			this.friendRequests--;
		});
		this.userData.getUserData.subscribe((data)=>{
			this.data = data;
			this.friendRequests = data.friendRequests.length;
		});

		let requestObject = {
			type : "GET",
			location : `users/${this.userID}`,
			authorize : true
		}
		this.api.makeRequest(requestObject).then((data:any)=>{
			this.userData.getUserData.emit(data.user);
		})
	}

	public searchForFriends(){
		this.router.navigate(['/search-results',{ query : this.query }]).then(_ =>{ });
	}
}
