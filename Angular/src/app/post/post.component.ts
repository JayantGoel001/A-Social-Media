import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

	@Input() post: any;

	public fakeID : string = "fakeID";

	constructor() {  }

	ngOnInit(): void {
		let removeLeadingNumber = (id:string)=>{
			let isNumber = (n:any)=>{
				n = Number(n);
				return !isNaN(n);
			}
			if (id && isNumber(id[0])){
				id = removeLeadingNumber(id.substr(1));
			}
			return id;
		}
		this.fakeID = removeLeadingNumber(this.post._id);
	}
}
