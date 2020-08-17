import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-page-feed',
    templateUrl: './page-feed.component.html',
    styleUrls: ['./page-feed.component.css']
})
export class PageFeedComponent implements OnInit {

    constructor(private auth:AuthService) { }

    ngOnInit(): void {
    }

}
