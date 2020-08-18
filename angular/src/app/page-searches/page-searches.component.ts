import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-page-searches',
    templateUrl: './page-searches.component.html',
    styleUrls: ['./page-searches.component.css']
})
export class PageSearchesComponent implements OnInit {

    constructor(private api:ApiService,private route:ActivatedRoute) { }

    ngOnInit() {
    }
    public result;
    public query = this.route.snapshot.params.query;

}
