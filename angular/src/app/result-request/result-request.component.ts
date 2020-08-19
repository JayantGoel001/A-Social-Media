import { Component, OnInit,Input } from '@angular/core';
import { ApiService } from "../api.service";
import { LocalStorageService } from "../local-storage.service";

@Component({
    selector: 'app-result-request',
    templateUrl: './result-request.component.html',
    styleUrls: ['./result-request.component.css']
})
export class ResultRequestComponent implements OnInit {
    @Input() resultRequest;
    @Input() use;

    constructor(public api:ApiService,
                public storage:LocalStorageService) { }

    ngOnInit(): void {
    }

    /**
     * Accept
     */
    public Accept() {
        var id = this.resultRequest._id;
        console.log(`Accepted Friend Request ${this.resultRequest._id}`);
        this.api.resolveFriendRequest("accept",id).then((val)=>{
            console.log(val);

        });
    }
    public Decline() {
        var id = this.resultRequest._id;
        console.log(`Declined Friend Request`);
        this.api.resolveFriendRequest("decline",id).then((val)=>{
            console.log(val);
        });
    }

}
