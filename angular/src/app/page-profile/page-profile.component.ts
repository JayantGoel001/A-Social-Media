import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-page-profile',
    templateUrl: './page-profile.component.html',
    styleUrls: ['./page-profile.component.css']
})
export class PageProfileComponent implements OnInit {

    constructor(private title:Title) { }

    ngOnInit(): void {
        this.title.setTitle("Your Profile");
    }

}
