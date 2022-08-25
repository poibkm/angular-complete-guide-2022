import { OnDestroy } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubsription: Subscription;

  constructor() {}

  ngOnInit() {
    this.firstObsSubsription = interval(1000).subscribe((count) => {
      console.log(count);
    });
  }

  ngOnDestroy(): void {
    this.firstObsSubsription.unsubscribe();
  }
}
