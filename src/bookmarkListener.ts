import { clip } from "./bookmarker";
import { Action, Message } from "./messages";

chrome.runtime.onMessage.addListener(function listener(received: Message) {
    if (received.action !== Action.CLIP)
        return;
        
    clip(false);
});