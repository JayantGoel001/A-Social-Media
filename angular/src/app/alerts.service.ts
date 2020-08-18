import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AlertsService {
    onAlertEvent : EventEmitter<String> = new EventEmitter() ;
    
    constructor() { }

}
