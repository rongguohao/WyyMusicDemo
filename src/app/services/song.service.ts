import { Injectable } from '@angular/core';
import { ServicesModule } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { environment } from '../../environments/environment';
import { SongUrl, Song } from './data-types/common.types';

@Injectable({
    providedIn: ServicesModule
})
export class SongService {

    constructor(private http: HttpClient) { }

    getSongUrl(ids: string): Observable<SongUrl[]> {
        const params = new HttpParams().set('id', ids);
        return this.http.get(environment.apiUrl + 'song/url', { params }).pipe(map((res: { data: SongUrl[] }) => res.data));
    }

    // getSongList(songs: Song | Song[]): Observable<Song[]> {
    //     const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    //     const ids = songArr.map(item => item.id).join(',');
    //     return Observable.create(observer => {
    //         this.getSongUrl(ids).subscribe(urls => {
    //             observer.next(this.generateSongList(songArr, urls));

    //         });
    //     });
    // }

        getSongList(songs: Song | Song[]): Observable<Song[]> {
        const songArr = Array.isArray(songs) ? songs.slice() : [songs];
        const ids = songArr.map(item => item.id).join(',');
        return this.getSongUrl(ids).pipe(map(urls => {
            return this.generateSongList(songArr, urls);
        }));
    }

    private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
        const result = [];
        songs.forEach(song => {
            const url = urls.find(a => a.id === song.id);
            if (url) {
                result.push({ ...song, url });
            }
        });
        return result;
    }
}
