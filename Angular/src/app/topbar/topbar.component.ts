import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../local-storage.service";
import {EventEmitterService} from "../event-emitter.service";
import {UserDataService} from "../user-data.service";
import {ApiService} from "../api.service";
import { AutoUnsubscribe } from "../unsubscribe";

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
@AutoUnsubscribe
export class TopbarComponent implements OnInit {

	public query:string="";
	public userName:string = "";
	public alertMessage :string = "";
	public data:any;
	public userID:any;
	public friendRequests:number=0;
	public subscriptions = [];

	constructor(
		public auth: AuthService,
		private router:Router,
		private localStorage:LocalStorageService,
		private alerts:EventEmitterService,
		private userData:UserDataService,
		public api:ApiService
	) {  }

	ngOnInit(): void {
		let parsedToken = this.localStorage.getParsedToken();
		this.userName = parsedToken.name;
		this.userID = parsedToken._id;

		let alertEvent = this.alerts.onAlertEvent.subscribe((message:string)=>{
			this.alertMessage = message;
		});

		let friendAlert = this.alerts.updateNumberOfFriendRequestEvent.subscribe((message:string)=>{
			if (this.friendRequests>0) {
				this.friendRequests--;
			}
		});
		let userDataEvent = this.userData.getUserData.subscribe((data)=>{
			this.data = data;
			this.friendRequests = data.friendRequests.length;
		});

		let requestObject = {
			method : "GET",
			location : `users/get-user-data/${this.userID}`
		}
		this.api.makeRequest(requestObject).then((data:any)=>{
			this.userData.getUserData.emit(data.user);
		})
		// @ts-ignore
		this.subscriptions.push(alertEvent,friendAlert,userDataEvent);
	}

	public searchForFriends(){
		this.router.navigate(['/search-results',{ query : this.query }]).then(_ =>{ });
	}
}
