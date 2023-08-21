import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import {LocalStorageService} from "../local-storage.service";
import {Router} from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.component.html',
  styleUrls: ['./page-register.component.css']
})

export class PageRegisterComponent implements OnInit {

	public formError:String = "";
	public credentials = {
		firstName : '',
		lastName : '',
		email : '',
		password : '',
		confirmPassword : ''
	}

	constructor(
		private api:ApiService,
		public storage:LocalStorageService,
		private router:Router,
		private title:Title
	) {

	}

	ngOnInit(): void {
		this.title.setTitle("A Social Media - Register");
	}

	public formSubmit():any{
		this.formError = "";
		if (
			!this.credentials.firstName ||
			!this.credentials.lastName ||
			!this.credentials.email ||
			!this.credentials.password ||
			!this.credentials.confirmPassword
		){
			this.formError = "All Fields are required.";
			return this.formError;
		}

		let pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
		let re = new RegExp(pattern);
		if (!re.test(this.credentials.email)){
			this.formError = "Please Enter a valid Email Address.";
			return this.formError;
		}

		if (this.credentials.password !== this.credentials.confirmPassword){
			this.formError = "The Password entered doesn't match. Please Try Again.";
			return this.formError;
		}

		this.register();
	}
	private register(){
		let requestObject = {
			method:"POST",
			location : "api/register",
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
			this.formError = err;
		})
	}
}
