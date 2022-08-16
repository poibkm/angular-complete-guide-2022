import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-servers",
  templateUrl: "./servers.component.html",
  // template: "<app-server></app-server><app-server></app-server>",
  styleUrls: ["./servers.component.css"],
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  serverCreationStatus: string = "No server was created";
  serverName = "Test Server";

  constructor() {
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000);
  }

  ngOnInit(): void {}

  onCreateServer() {
    this.serverCreationStatus = "Server was created!";
  }

  onUpdateServerName(event: Event) {
    this.serverName = (<HTMLInputElement>event.target).value;
  }
}
