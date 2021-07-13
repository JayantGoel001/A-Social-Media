import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";

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

	constructor(private api:ApiService) {

	}

	ngOnInit(): void {  }

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
			type:"POST",
			location : "users/login",
			body : this.credentials
		}
		this.api.makeRequest(requestObject).then((val:any)=>{
			console.log(val);
		}).catch((err:any)=>{
			console.log(err);
		});
	}
}
