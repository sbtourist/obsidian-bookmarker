export enum Action {
    ALERT = 'ALERT',
    CLIP = 'CLIP',
}

export interface Bookmark {
    name: string;
    body: string;
}

export interface Clip {
    bookmark: Bookmark;
    obsidianURL: string;
    obsidianKey: string;
    matchByQuery: boolean;
    obsidianQuery: string;
    testing: boolean;
}

export class Message {
    action: Action;

    constructor(action: Action) {
        this.action = action;
    }
}

export class ClipMessage extends Message {
    clip: Clip;

    constructor(clip?: Clip) {
        super(Action.CLIP);
        this.clip = clip;
    }
}

export class AlertMessage extends Message {
    text: string;
    success: boolean;

    constructor(text: string, success: boolean) {
        super(Action.ALERT);
        this.text = text;
        this.success = success;
    }
}