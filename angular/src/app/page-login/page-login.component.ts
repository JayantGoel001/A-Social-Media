import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

  constructor(private api:ApiService) { }

  ngOnInit(): void {}

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
          type:"POST",
          location:"users/login",
          body:this.credentials
      }

      this.api.makeRequest(requestOption).then((val)=>{
          console.log(val);
      })
  }

}
