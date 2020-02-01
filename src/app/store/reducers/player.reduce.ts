import { PlayMode } from 'src/app/share/wy-ui/wy-player/play-type';
import { Song } from 'src/app/services/data-types/common.types';
import {on, Action, createReducer } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetPlayMode, SetSongList, SetCurrentIndex } from '../actions/play.actions';

export class PlayState {
    // 播放状态
    playing: boolean;

    // 播放模式
    playMode: PlayMode;

    // 歌曲列表
    songList: Song[];

    // 播放列表
    playList: Song[];

    // 当前正在播放的索引
    currentIndex: number;
}

export const initialState: PlayState = {
    playing: false,
    songList: [],
    playList: [],
    playMode: { type: 'loop', label: '循环' },
    currentIndex: -1
};


const reducer = createReducer(
    initialState,
    // tslint:disable-next-line:no-shadowed-variable
    on(SetPlaying, (state, { playing }) => ({ ...state, playing })),
    // tslint:disable-next-line:no-shadowed-variable
    on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
    // tslint:disable-next-line:no-shadowed-variable
    on(SetSongList, (state, { songList }) => ({ ...state, songList })),
    // tslint:disable-next-line:no-shadowed-variable
    on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
    // tslint:disable-next-line:no-shadowed-variable
    on(SetCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex })),
);

export function playReducer(state: PlayState, action: Action) {
    return reducer(state, action);
}

