import { NgModule } from '@angular/core';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderComponent } from '../wy-slider/wy-slider.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';



@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    WySliderModule
  ],
  exports: [
    WyPlayerComponent
  ]
})
export class WyPlayerModule { }
