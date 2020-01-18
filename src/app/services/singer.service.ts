import { Injectable } from '@angular/core';
import { ServicesModule } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../environments/environment';
import { Singer } from './data-types/common.types';
import queryString from 'query-string';

class SingerParams {
    offset: number;
    limit: number;
    cat?: string;
}
const defaultParams: SingerParams = {
    offset: 0,
    limit: 9,
    cat: '5001'
};

@Injectable({
    providedIn: ServicesModule
})
export class SingerService {

    constructor(private http: HttpClient) { }

    getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
        const params = new HttpParams({ fromString: queryString.stringify(args) });
        return this.http.get(environment.apiUrl + 'artist/list', { params }).pipe(map((res: { artists: Singer[] }) => res.artists));
    }
}
