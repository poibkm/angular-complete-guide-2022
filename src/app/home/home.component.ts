import { OnDestroy } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { interval, Subscription, Observable } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubsription: Subscription;

  constructor() {}

  ngOnInit() {
    /* this.firstObsSubsription = interval(1000).subscribe((count) => {
      console.log(count);
    }); */
    let count = 0;
    const customIntervalObservable = new Observable<number>((observer) => {
      setInterval(() => {
        observer.next(count++);
      }, 1000);
    });

    this.firstObsSubsription = customIntervalObservable.subscribe(
      (data: number) => {
        console.log(data);
      }
    );
  }

  ngOnDestroy(): void {
    this.firstObsSubsription.unsubscribe();
  }
}
