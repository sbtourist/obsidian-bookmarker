import { initializeStorageWithDefaults, create } from './storage';
import { ClipMessage, Clip, Message, Action, AlertMessage } from './messages';
import { ObsidianClient } from './obsidianClient';

chrome.runtime.onInstalled.addListener(() => {
    initializeStorageWithDefaults(create());
});
chrome.runtime.onInstalled.addListener(function (object) {
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") }, function (tab) { });
    }
});

chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, new ClipMessage());
});

chrome.runtime.onMessage.addListener(function listener(received: Message, _, sendResponse) {
    if (received.action !== Action.CLIP)
        return;

    const clip: Clip = (received as ClipMessage).clip;
    console.log("Received clipping message: ", clip);

    const obsidianClient = new ObsidianClient(clip.obsidianURL, clip.obsidianKey);
    console.log("Connecting to Obsidian at: ", clip.obsidianURL);

    const matchByQuery = clip.matchByQuery;
    const obsidianQuery = clip.obsidianQuery;
    const noteBody = clip.bookmark.body;
    let noteName = clip.bookmark.name + ".md";

    checkNoteExists(noteName, obsidianQuery, matchByQuery, obsidianClient, sendResponse).then(exist => {
        if (!exist) {
            obsidianClient.putNote(noteName, noteBody).then((response) => {
                if (response.ok) {
                    sendResponse(new AlertMessage('Bookmarked!', true));
                }
                else {
                    response.text().then(message => {
                        sendResponse(new AlertMessage('Error: ' + message, false));
                    });
                }
            }).catch(error => {
                handleError(error, sendResponse);
            });
        }
    }).catch(error => {
        handleError(error, sendResponse);
    });

    return true;
});

async function checkNoteExists(noteName: string, obsidianQuery: string, matchByQuery: boolean, obsidianClient: ObsidianClient, sendResponse: (m: AlertMessage) => void): Promise<boolean> {
    return obsidianClient.getNoteByName(noteName).then(exists => {
        if (exists.ok) {
            sendResponse(new AlertMessage('Not bookmarking because a note by the same name already exists', false));
            return new Promise((c, r) => { return true });
        }
        else if (matchByQuery) {
            return obsidianClient.searchNoteByQuery(obsidianQuery).then(match => {
                return match.json().then(result => {
                    if (result.length >= 1) {
                        sendResponse(new AlertMessage(`Not bookmarking because matching ${result.length} existing note(s)`, false));
                        return true;
                    }
                    return false;
                });
            });
        }
        return new Promise((c, r) => { return false });
    });
}

function handleError(error: any, sendResponse: (response?: any) => void) {
    console.log("Error: " + error);
    if (error.message.includes("Failed to fetch"))
        sendResponse(new AlertMessage('Cannot connect to Obsidian!', false));
    else
        sendResponse(new AlertMessage('Unknwon error: ' + error.message, false));
}