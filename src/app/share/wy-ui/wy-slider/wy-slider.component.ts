import {
  Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild,
  Input, Inject, ChangeDetectorRef, OnDestroy, forwardRef
} from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { tap, filter, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent } from './wy-slider-helper';
import { getElementOffset, NzTreeHigherOrderServiceToken } from 'ng-zorro-antd';
import { limitNumberInRang, getPercent } from 'src/app/utils/number';
import { inArray } from 'src/app/utils/array';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WySliderComponent),
    multi: true
  }]
})
export class WySliderComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() wyVertical = false;

  @Input() wyMin = 0;

  @Input() wyMax = 100;

  @Input() bufferOffset: SliderValue = 0;

  private sliderDom: HTMLDivElement;

  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private dragStart$: Observable<number>;

  private dragEnd$: Observable<Event>;

  private dragMove$: Observable<number>;

  private dragStartU: Subscription | null;

  private dragEndU: Subscription | null;

  private dragMoveU: Subscription | null;

  private isDragging = false;

  value: SliderValue = null;
  offset: SliderValue = null;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag();
  }

  private createDraggingObservables() {

    const orientField = this.wyVertical ? 'pageY' : 'pageX';

    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: FilterFunc, pluckKey } = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start)
        .pipe(
          filter(FilterFunc),
          tap(sliderEvent),
          pluck(...pluckKey),
          map((position: number) => this.findClosestValue(position))
        );

      source.end$ = fromEvent(this.doc, end);

      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(FilterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }


  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$ && !this.dragStartU) {
      this.dragStartU = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.dragMoveU) {
      this.dragMoveU = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && !this.dragEndU) {
      this.dragEndU = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unSubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$) {
      this.dragStartU.unsubscribe();
      this.dragStartU = null;
    }
    if (inArray(events, 'move') && this.dragMove$) {
      this.dragMoveU.unsubscribe();
      this.dragMoveU = null;
    }
    if (inArray(events, 'end') && this.dragEnd$) {
      this.dragEndU.unsubscribe();
      this.dragEndU = null;
    }
  }

  private onDragStart(value: number) {
    this.toggleDragMoving(true);
    this.setValue(value);
  }

  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      this.cdr.markForCheck(); // 手动进行变更检测
    }
  }

  private onDragEnd() {
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private setValue(value: number, needCheck = false) {
    if (needCheck) {
      if (this.isDragging) { return; }
      this.value = this.formateValue(value);
      this.updateTrackAndHandles();
    } else {
      if (!this.valuesEqual(this.value, value)) {
        this.value = value;
        this.updateTrackAndHandles();
        this.onValueChange(this.value);
      }
    }
  }

  private formateValue(value: SliderValue): SliderValue {
    let res = value;
    if (this.assertValueValid(value)) {
      res = this.wyMin;
    } else {
      res = limitNumberInRang(value, this.wyMin, this.wyMax);
    }
    return res;
  }

  // 判断是否是NaN
  private assertValueValid(value: SliderValue) {
    return isNaN(typeof value !== 'number' ? parseFloat(value) : value);
  }



  private valuesEqual(valA: SliderValue, valB: SliderValue): boolean {
    if (typeof valA !== typeof valB) {
      return false;
    }
    return valA === valB;
  }

  private updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    this.cdr.markForCheck();
  }

  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(this.wyMin, this.wyMax, value);
  }

  private toggleDragMoving(movable: boolean) {
    if (movable) {
      this.isDragging = movable;
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unSubscribeDrag(['move', 'end']);
    }
  }

  private findClosestValue(position: number): number {
    // 获取滑块总长度
    const sliderLength = this.getSliderLength();
    // 滑块（左，上）端点位置
    const sliderStart = this.getSliderStartPosition();

    // 滑块当前位置 / 滑块总长
    const ratio = limitNumberInRang((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = this.wyVertical ? 1 - ratio : ratio;

    return ratioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }

  private getSliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }

  ngOnDestroy(): void {
    this.unSubscribeDrag();
  }

  private onValueChange(value: SliderValue): void { }

  private onTouched(): void { }


  writeValue(value: SliderValue): void {
    this.setValue(value, true);
  }
  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }


}
