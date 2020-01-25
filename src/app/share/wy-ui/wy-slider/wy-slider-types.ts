import { Observable } from 'rxjs';

export class WySliderStyle {
    width?: string | null;
    height?: string | null;
    left?: string | null;
    bottom?: string | null;
}


export class SliderEventObserverConfig {
    start: string;
    move: string;
    end: string;
    filter: (e: Event) => boolean;
    pluckKey: string[];
    startPlucked$?: Observable<number>;
    moveResolved$?: Observable<number>;
    end$?: Observable<Event>;
}


export type SliderValue = number | null;
