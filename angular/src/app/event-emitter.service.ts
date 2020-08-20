import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EventEmitterService {
    onAlertEvent : EventEmitter<String> = new EventEmitter() ;
    updateNumberOfFriendRequestsEvent : EventEmitter<String> = new EventEmitter() ;


    constructor() { }

}
