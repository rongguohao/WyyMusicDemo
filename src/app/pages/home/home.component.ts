import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheets: SongSheet[];

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(private homeSerivce: HomeService) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalizedSheetList();
  }

  ngOnInit() {
  }

  private getBanners() {
    this.homeSerivce.getBanners().subscribe(banners => {
      this.banners = banners;
    });
  }

  private getHotTags() {
    this.homeSerivce.getHotTags().subscribe(tags => {
      this.hotTags = tags;
    });
  }

  private getPersonalizedSheetList() {
    this.homeSerivce.getPersonalSheetList().subscribe(result => {
      this.songSheets = result;
    });
  }

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
