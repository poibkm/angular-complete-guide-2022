import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from "@angular/core";

@Directive({
  selector: "[appBetterHighlight]",
})
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor: string = "transparent";
  // Aliases are optional
  @Input("appBetterHighlight") highlightColor: string = "lightblue";
  // @Input() highlightColor: string = "lightblue";

  @HostBinding("style.backgroundColor") backgroundColor: string;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    /* this.renderer.setStyle(
      this.elRef.nativeElement,
      "background-color",
      "lightblue"
    ); */
    this.backgroundColor = this.defaultColor;
  }

  @HostListener("mouseenter") mouseover(eventData: Event) {
    /* this.renderer.setStyle(
      this.elRef.nativeElement,
      "background-color",
      "lightblue"
    ); */
    this.backgroundColor = this.highlightColor;
  }

  @HostListener("mouseleave") mouseleave(eventData: Event) {
    /* this.renderer.setStyle(
      this.elRef.nativeElement,
      "background-color",
      "transparent"
    ); */
    this.backgroundColor = this.defaultColor;
  }
}
