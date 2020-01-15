import { Injectable } from '@angular/core';
import { ServicesModule } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Banner } from './data-types/common.types';
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
}
