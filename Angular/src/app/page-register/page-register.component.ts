import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";

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
	constructor(private api:ApiService) {

	}

	ngOnInit(): void {  }

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
		// let pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
		// let re = new RegExp(pattern);
		// if (!re.test(this.credentials.email)){
		// 	this.formError = "Please Enter a valid Email Address.";
		// 	return this.formError;
		// }

		if (this.credentials.password !== this.credentials.confirmPassword){
			this.formError = "The Password entered doesn't match. Please Try Again.";
			return this.formError;
		}

		this.register();
	}
	private register(){
		let requestObject = {
			type:"POST",
			location : "users/register",
			body : this.credentials
		}
		this.api.makeRequest(requestObject).then((val:any)=>{
			if (val.message){
				this.formError = val.message;
			}
			console.log(val);

		}).catch((err:any)=>{
			this.formError = err;
		})
	}
}
