import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "../local-storage.service";

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

	public query:string="";
	public userName:string = "";
	constructor(public auth: AuthService,private router:Router,private localStorage:LocalStorageService){  }

	ngOnInit(): void {
		this.userName = this.localStorage.getParsedToken().name;
	}

	public searchForFriends(){
		this.router.navigate(['/search-results',{ query : this.query }]).then(_ =>{ });
	}
}
