import { Injectable } from '@angular/core';
import { ServicesModule } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Banner, HotTag, SongSheet } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get(environment.apiUrl + 'banner').pipe(map((res: { banners: Banner[] }) => res.banners));
  }

  getHotTags(): Observable<HotTag[]> {
    return this.http.get(environment.apiUrl + 'playlist/hot').pipe(map((res: { tags: HotTag[] }) => {
      return res.tags.sort((x:HotTag,y:HotTag)=>{
        return x.position-y.position
      }).slice(0,5);
    }));
  }

  getPersonalSheetList() {
    return this.http.get(environment.apiUrl + 'personalized').pipe(map((res: { result: SongSheet[] }) => res.result.slice(0,16)));
  }
}
