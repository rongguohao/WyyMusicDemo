import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-types/common.types';
import { Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/internal/operators';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {

    constructor(
        private homeSerivce: HomeService,
        private singerService: SingerService) {

    }


    resolve(): Observable<HomeDataType> {
        return forkJoin([
            this.homeSerivce.getBanners(),
            this.homeSerivce.getHotTags(),
            this.homeSerivce.getPersonalSheetList(),
            this.singerService.getEnterSinger()
        ]).pipe(first());
    }
}
