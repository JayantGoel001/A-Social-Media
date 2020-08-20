import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { ApiService } from "../api.service";
import { LocalStorageService } from "../local-storage.service";

@Component({
    selector: 'app-result-request',
    templateUrl: './result-request.component.html',
    styleUrls: ['./result-request.component.css']
})
export class ResultRequestComponent implements OnInit {
    @Input() resultRequest;
    @Output() resultRequestChange = new EventEmitter<any>();
    @Input() use;

    constructor(public api:ApiService,
                public storage:LocalStorageService) { }

    ngOnInit(): void {
        if (this.resultRequest.haveSentFriendRequest) {
            this.haveSentFriendRequest = true;
        }
        if (this.resultRequest.haveReceivedFriendRequest) {
            this.haveReceivedFriendRequest = true;
        }
        if (this.resultRequest.isFriend) {
            this.isFriend = true;
        }
    }

    /**
     * Accept
     */
    public Accept() {
        this.updateRequest();
        var id = this.resultRequest._id;
        console.log(`Accepted Friend Request ${this.resultRequest._id}`);
        this.api.resolveFriendRequest("accept",id).then((val)=>{
            console.log(val);
        });
    }
    public Decline() {
        this.updateRequest();
        var id = this.resultRequest._id;
        console.log(`Declined Friend Request`);
        this.api.resolveFriendRequest("decline",id).then((val)=>{
            console.log(val);
        });
    }

    private updateRequest(){
        this.resultRequestChange.emit(this.resultRequest._id);
    }

    public haveSentFriendRequest:boolean = false;
    public haveReceivedFriendRequest:boolean = false;
    public isFriend:boolean = false;


}
