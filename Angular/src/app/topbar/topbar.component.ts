import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

	public query:string="";

	constructor(public auth: AuthService,private router:Router){  }

	ngOnInit(): void { }

	public searchForFriends(){
		this.router.navigate(['/search-results',{ query : this.query }]).then(_ =>{ });
	}
}
