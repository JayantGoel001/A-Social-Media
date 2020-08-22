import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from "./local-storage.service";
import { EventEmitterService } from "./event-emitter.service";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = "http://localhost:3000";
    private successHandler(value){
        return value;
    }
    private errorHandler(value){
        return value;
    }
    constructor(private http:HttpClient,
                private storage:LocalStorageService,
                private events:EventEmitterService) { }

    public makeRequest(requestObject):any {
        let method = requestObject.method.toLowerCase();
        if (!method) {
            return console.log("No method Specified in the request object.");
        }
        let body = requestObject.body || {};
        let location = requestObject.location;
        if (!location) {
            return console.log("No location Specified in the request object");
        }
        let url = `${this.baseUrl}/${location}`;
        let httpOptions = {};

        if (this.storage.getToken()) {
            httpOptions = {
                headers:new HttpHeaders({
                    'Authorization':`Bearer ${this.storage.getToken()}`
                })
            }
        }

        if (method == "get") {
            return this.http.get(url,httpOptions).toPromise()
            .then(this.successHandler).catch(this.errorHandler);
        }


        if (method == "post") {
            return this.http.post(url,body,httpOptions).toPromise()
            .then(this.successHandler).catch(this.errorHandler);
        }
        console.log("Could not make the request.Make Sure a method of GET or Post is Supplied");
    }

    public makeFriendRequest(to:String) {
        let from = this.storage.getParsedToken()._id;

        let requestObject = {
            location:`users/make-friend-request/${from}/${to}`,
            method:"POST"
        }

        return new Promise((resolve,reject)=>{
            this.makeRequest(requestObject).then((val)=>{
                if (val.statusCode === 201) {
                    this.events.onAlertEvent.emit("Succesfully sent a friend request.");
                }
                else{
                    this.events.onAlertEvent.emit("Something went wrong. We could not send friend request.Perhaps you already sent a friend request to this user.");
                }
                resolve(val);
            });

        });

    }

    public resolveFriendRequest(resolution,id){
        let to = this.storage.getParsedToken()._id;

        return new Promise((resolve,reject)=>{
            let requestObject = {
                location:
                `users/resolve-friend-request/${id}/${to}?resolution=${resolution}`,
                method:"POST"
            }

            this.makeRequest(requestObject).then((val)=>{
                if (val.statusCode === 201) {
                    this.events.updateNumberOfFriendRequestsEvent.emit()
                    let resolutioned = (resolution == "accept")? "Accepted": "Declined";
                    this.events.onAlertEvent.emit(`Succesfully ${resolutioned} friend request.`);
                }
                else{
                    this.events.onAlertEvent.emit(`Something went Wrong and we could not handle your friend request.`);
                }
                resolve(val);
            });
        });
    }
}
