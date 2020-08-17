import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

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
    constructor(private http:HttpClient) { }
    /**
    * makeRequest
    */
    public makeRequest(requestObject):any {
        let type = requestObject.type.toLowerCase();
        if (!type) {
            return console.log("No type Specified in the request object.");
        }
        let body = requestObject.body || {};
        let location = requestObject.location;
        if (!location) {
            return console.log("No location Specified in the request object");
        }
        let url = `${this.baseUrl}/${location}`;
        let httpOptions = {};
        if (type == "get") {
            return this.http.get(url,httpOptions).toPromise().then(this.successHandler).catch(this.errorHandler);
        }

        if (type == "post") {
            return this.http.post(url,body,httpOptions).toPromise().then(this.successHandler).catch(this.errorHandler);
        }
        console.log("Could not make the request.Make Sure a type of GET or Post is Supplied");
    }
}
