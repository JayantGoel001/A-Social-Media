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
            this.posts.col1 = val.posts.filter((val,i) => i%4 == 0);
            this.posts.col2 = val.posts.filter((val,i) => i%4 == 1);
            this.posts.col3 = val.posts.filter((val,i) => i%4 == 2);
            this.posts.col4 = val.posts.filter((val,i) => i%4 == 3);
            console.log(this.posts);
        });
    }

    /**
     * newPostContent
     */
    public newPostContent:String = "";
    public newPostTheme:String = this.storage.getPostTheme() || "primary";
    public posts = {
        col1:[""],
        col2:[""],
        col3:[""],
        col4:[""],
    }
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

        let requestObject = {
            location:"users/create-post",
            type:"POST",
            authorize:true,
            body:{
                theme:this.newPostTheme,
                content:this.newPostContent
            }
        }

        this.api.makeRequest(requestObject).then((val)=>{
            console.log(val);
            this.newPostContent = "";
        })
    }
}
