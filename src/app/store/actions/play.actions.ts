import { createAction, props } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/play-type';

export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean }>());

export const SetPlayList = createAction('[player] Set playList', props<{ playList: Song[] }>());

export const SetSongList = createAction('[player] Set songList', props<{ songList: Song[] }>());

export const SetPlayMode = createAction('[player] Set playMode', props<{ playMode: PlayMode }>());

export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{ currentIndex: number }>());
