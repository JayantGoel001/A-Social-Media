import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../local-storage.service";
import {AlertsService} from "../alerts.service";

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

	public query:string="";
	public userName:string = "";
	public alertMessage :string = "";

	constructor(public auth: AuthService,private router:Router,private localStorage:LocalStorageService,private alerts:AlertsService){  }

	ngOnInit(): void {
		this.userName = this.localStorage.getParsedToken().name;
		this.alerts.onAlertEvent.subscribe((message:string)=>{
			this.alertMessage = message;
		});
	}

	public searchForFriends(){
		this.router.navigate(['/search-results',{ query : this.query }]).then(_ =>{ });
	}
}
