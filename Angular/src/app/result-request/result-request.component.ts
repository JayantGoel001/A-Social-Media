import { Component, OnInit, Input } from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-result-request',
  templateUrl: './result-request.component.html',
  styleUrls: ['./result-request.component.css']
})
export class ResultRequestComponent implements OnInit {
	@Input() resultRequest: any;
	@Input() use: any;

	constructor(public api: ApiService) {  }

	ngOnInit(): void {

	}

	public accept(){

	}
	public decline(){

	}
	public sendMessage(){

	}

}
