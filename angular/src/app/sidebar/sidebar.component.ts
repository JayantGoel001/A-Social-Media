import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public auth:AuthService) { }

  ngOnInit(): void {
  }

}
