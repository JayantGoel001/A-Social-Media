import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
	selector: 'app-page-searches',
	templateUrl: './page-searches.component.html',
	styleUrls: ['./page-searches.component.css']
})
export class PageSearchesComponent implements OnInit {

	public results:Array<any> = [];
	public searchQuery = this.route.snapshot.params.query;
	private subscription: any;

	constructor(private api:ApiService,private route:ActivatedRoute,private title:Title) {  }

	ngOnInit(): void {
		this.title.setTitle("Search Results");
		this.subscription = this.route.params.subscribe(params=>{
			this.searchQuery = params.query;
			this.getResults();
		});
	}

	private getResults(){
		let requestObject = {
			type:"GET",
			location:`users/search-results?query=${this.searchQuery}`,
			authorize: true
		}
		this.api.makeRequest(requestObject).then((results:any)=>{
			this.results = results.results;
		});
	}
}
