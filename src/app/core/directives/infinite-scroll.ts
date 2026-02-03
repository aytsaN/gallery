import { Directive, ElementRef, inject, OnDestroy, OnInit, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll implements OnInit, OnDestroy {
  scrolled = output();

  private el = inject(ElementRef);
  private observer = new IntersectionObserver(
    ([entries]) => {
      if (entries.isIntersecting) {
        this.scrolled.emit();
      }
    },
    { root: null, threshold: 1.0 },
  );

  ngOnInit() {
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
