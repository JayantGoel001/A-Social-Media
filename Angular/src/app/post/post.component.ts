import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

	@Input() post: any;

	public fakeID : string = "fakeID";
	public fontSize : number = 18;
	public align : string = "left";

	constructor() {

	}

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
		if (this.post.content.length<40){
			this.fontSize = 22;
		}
		if (this.post.content.length<24){
			this.fontSize = 28;
			this.align = "center";
		}
		if (this.post.content.length<14){
			this.fontSize = 32;
		}
		if (this.post.content.length<8){
			this.fontSize = 44;
		}
		if (this.post.content.length<5){
			this.fontSize = 62;
		}
	}
}
