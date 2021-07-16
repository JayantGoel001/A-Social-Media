import {Component, Inject, OnInit} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.css']
})
export class PageProfileComponent implements OnInit {

	constructor(
		private title: Title,
		@Inject(DOCUMENT) private document : Document
	) {

	}

	ngOnInit(): void {
		this.title.setTitle("A Social Media - Profile");
		if (this.document.getElementById("sidebarToggleTop")) {
			// @ts-ignore
			this.document.getElementById("sidebarToggleTop").classList.add("d-none");
		}
	}

}
