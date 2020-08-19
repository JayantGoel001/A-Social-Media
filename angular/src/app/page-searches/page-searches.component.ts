import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-page-searches',
    templateUrl: './page-searches.component.html',
    styleUrls: ['./page-searches.component.css']
})
export class PageSearchesComponent implements OnInit {

    constructor(private api:ApiService,
                private route:ActivatedRoute,private title:Title) { }
    ngOnInit() {
        this.title.setTitle("Search Page");
        this.subscription = this.route.params.subscribe(params=>{
            this.query = params.query;
            this.getResults();
        });
    }
    public results;
    public query = this.route.snapshot.params.query;
    public subscription;

    private getResults(){
        let requestObject = {
            location:`users/get-search-results?query=${this.query}`,
            type:"GET",
            authorize:true
        }
        this.api.makeRequest(requestObject).then((val,err)=>{
            this.results = val.results;
        });

    }

}
