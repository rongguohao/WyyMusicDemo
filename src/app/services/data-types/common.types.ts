export class Banner {
    targetId: number;
    url: string;
    imageUrl: string;
}


export class HotTag {
    id: number;
    name: string;
    position: number;
}

export class SongSheet {
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
    tracks: Song[];
}

export class Singer {
    id: number;
    name: string;
    picUrl: string;
    albumSize: number;
}

export type Song = {
    id: number;
    name: string;
    url: string;
    ar: Singer[];
    dt: number;
    al: { id: number; name: string; picUrl: string }
}

export type SongUrl = {
    id: number;
    url: string;
}
