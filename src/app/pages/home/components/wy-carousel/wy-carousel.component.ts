import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush // 变更检测
})
export class WyCarouselComponent implements OnInit {

  @Input() activeIndex = 0;
  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();
  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;
  constructor() { }

  ngOnInit() {
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.changeSlide.emit(type);
  }
}
