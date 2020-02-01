import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { getSongList, getPlayList, getCurrentIndex } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {


  constructor(
    private store$: Store<AppStoreModule>
  ) {
    const appStore$ = this.store$.select('player');

    const stateArr = [{
      type: getSongList,
      cb: list => this.watchList(list,'songList')
    },
    {
      type: getPlayList,
      cb: list => this.watchList(list,'playerList')
    },
    {
      type: getCurrentIndex,
      cb: list => this.watchCurrentIndex(list)
    }]

    stateArr.forEach(item=>{
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    });
  }

  ngOnInit() {

  }

  private watchList(list: Song[],type:string ) {
    console.log('list', list);
  }

  private watchCurrentIndex(index:number){
    console.log('list:',index);
  }
}
