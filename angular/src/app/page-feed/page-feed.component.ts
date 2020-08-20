import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { Title } from "@angular/platform-browser";
import { LocalStorageService } from "../local-storage.service";
import { EventEmitterService } from "../event-emitter.service";

@Component({
    selector: 'app-page-feed',
    templateUrl: './page-feed.component.html',
    styleUrls: ['./page-feed.component.css']
})
export class PageFeedComponent implements OnInit {

    constructor(
        private api:ApiService,
        private title:Title,
        private storage:LocalStorageService,
        private events:EventEmitterService
    ) { }

    ngOnInit() {
        this.title.setTitle("A Social Media - Feed");
        let requestObject = {
            type:"GET",
            location:"users/generate-feed",
            authorize:true
        }

        this.api.makeRequest(requestObject).then((val)=>{
            console.log(val);
        });
    }

    /**
     * newPostContent
     */
    public newPostContent:String = "";
    public newPostTheme:String = this.storage.getPostTheme() || "primary";

    /**
     * changeTheme
     */
    public changeTheme(newTheme) {
        this.newPostTheme = newTheme;
        this.storage.setPostTheme(newTheme);
    }

    /**
     * createPost
     */
    public createPost() {
        if (this.newPostContent.length==0) {
            return this.events.onAlertEvent.emit("No Content For Your Post was Provided.");
        }
        console.log(this.newPostContent);
    }
}
