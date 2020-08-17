import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(public auth:AuthService) { }

  ngOnInit(): void {
  }

}
