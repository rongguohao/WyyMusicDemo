import { Injectable } from '@angular/core';
import { ServicesModule } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { environment } from '../../environments/environment';
import { SongSheet, Song } from './data-types/common.types';
import { SongService } from './song.service';

@Injectable({
    providedIn: ServicesModule
})
export class SheetService {

    constructor(private http: HttpClient, private songService: SongService) { }

    getSongSheetDetail(id: number): Observable<SongSheet> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get(environment.apiUrl + 'playlist/detail', { params }).pipe(map((res: { playlist: SongSheet }) => res.playlist));
    }

    playSheet(id: number): Observable<Song[]> {
        return this.getSongSheetDetail(id).pipe(pluck('tracks'), switchMap(tracks => {
            return this.songService.getSongList(tracks);
        }));
    }
}
