import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { SetSongList, SetPlayList, SetCurrentIndex } from 'src/app/store/actions/play.actions';
import { AppStoreModule } from 'src/app/store';
import { Store, StoreModule } from '@ngrx/store';

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
  singers: Singer[];

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(
    private homeSerivce: HomeService,
    private singerService: SingerService,
    private sheetService: SheetService,
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, tags, songs, artists]) => {
      this.banners = banners;
      this.hotTags = tags;
      this.songSheets = songs;
      this.singers = artists;
    });
  }

  ngOnInit() {
  }


  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(list => {
      this.store$.dispatch(SetSongList({ songList: list }));
      this.store$.dispatch(SetPlayList({ playList: list }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
    });
  }
}
