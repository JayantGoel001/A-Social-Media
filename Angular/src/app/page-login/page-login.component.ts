import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import {LocalStorageService} from "../local-storage.service";
import {Router} from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

	public readonly credentials = {
		email : '',
		password : ''
	}
	public formError = "";

	constructor(
		private api:ApiService,
		public storage:LocalStorageService,
		private router:Router,
		private title:Title
	) {

	}

	ngOnInit(): void {
		this.title.setTitle("A Social Media - Login");
	}

	public formSubmit():any{
		this.formError = "";
		if (
			!this.credentials.email ||
			!this.credentials.password
		){
			this.formError = "All Fields are required.";
			return this.formError;
		}
		// let pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
		// let re = new RegExp(pattern);
		// if (!re.test(this.credentials.email)){
		// 	this.formError = "Please Enter a valid Email Address.";
		// 	return this.formError;
		// }

		this.logIn();
	}
	private logIn(){
		let requestObject = {
			method:"POST",
			location : "api/login",
			body : this.credentials
		}
		this.api.makeRequest(requestObject).then((val:any)=>{
			if (val.message){
				this.formError = val.message;
			}
			if (val.token){
				this.storage.setToken(val.token);
				this.router.navigate(['/']).then(_ => {  });
				return;
			}
		}).catch((err:any)=>{
			console.log(err);
		});
	}
}
