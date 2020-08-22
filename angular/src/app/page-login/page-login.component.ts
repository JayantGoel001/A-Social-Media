import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-page-login',
    templateUrl: './page-login.component.html',
    styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {
    constructor(
        private api:ApiService,
        private storage:LocalStorageService,
        private router:Router,private title:Title
    ) { }

    ngOnInit(): void {
        this.title.setTitle("Login");
    }

    /**
    * formSubmit
    */
    public formError = "";
    public credentials = {
        email:'',
        password:''
    }
    public formSubmit() {
        this.formError = "";
        if (
            !this.credentials.email||
            !this.credentials.password
        ) {
            return this.formError = "All Fields are Required";
        }

        if (!this.formError) {
            this.login();
        }
    }

    private login(){
        let requestOption = {
            method:"POST",
            location:"users/login",
            body:this.credentials
        }

        this.api.makeRequest(requestOption).then((val)=>{
            if (val.token) {
                this.storage.setToken(val.token);
                this.router.navigate(['/']);
                console.log("loggedIn");
                return ;
            }
            if(val.message) { this.formError = val.message }
        })
    }
}
