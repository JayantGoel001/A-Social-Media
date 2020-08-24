import { Component, OnInit , Inject} from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import { EventEmitterService } from "../event-emitter.service";
import { AutoUnsubscribe } from '../unsubscribe';

@Component({
    selector: 'app-page-searches',
    templateUrl: './page-searches.component.html',
    styleUrls: ['./page-searches.component.css']
})
@AutoUnsubscribe
export class PageSearchesComponent implements OnInit {
method
    constructor(private api:ApiService,
                private route:ActivatedRoute,
                private title:Title,
                public events:EventEmitterService,
                @Inject(DOCUMENT) private document:Document) { }
    ngOnInit() {
        this.title.setTitle("Search Page");
        this.document.getElementById("sidebarToggleTop").classList.add("d-none");
        let userDataEvent = this.events.getUserData.subscribe((data)=>{
            this.route.params.subscribe(params=>{
                this.query = params.query;
                this.user = data;
                this.getResults();
            });
        });
        this.subscriptions.push(userDataEvent);
    }
    public results;
    public query = this.route.snapshot.params.query;
    private user;
    private subscriptions = [];

    private getResults(){
        let requestObject = {
            location:`users/get-search-results?query=${this.query}`,
            method:"GET"
        }
        this.api.makeRequest(requestObject).then((val,err)=>{
            this.results = val.results;

            for(let result of this.results){
                if (result.friends.includes(this.user._id)) {
                    result.isFriend = true;
                }
                if (result.friend_requests.includes(this.user._id)) {
                    result.haveSentFriendRequest = true;
                }
                if (this.user.friend_requests.includes(result._id)) {
                    result.haveReceivedFriendRequest = true;
                }
            }
        });

    }

}
