// This runs in the background, waiting for the toolbar icon to be clicked.
// It then loads the libraries required and runs the clip.js script via run.js.
// clip.js copies the content and sends a message to the background worker.
// Then this script, the background worker, sends the proper requests to the Obsidian REST API.

chrome.action.onClicked.addListener(async function (tab) {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: [
            "lib/webbrowser-polyfill.js",
            "lib/jquery.js",
            "lib/rangy.js",
            "lib/moment.js",
            "lib/turndown.js",
        ]
    }, () => {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['run.js']
        })
    })
});

chrome.runtime.onMessage.addListener(async function listener(result) {
    console.log(result)
    const clipAsNewNote = result.clipAsNewNote
    const existingNoteMatchString = result.existingNoteMatchString
    const note = result.note
    
    const baseURL = result.url;
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + result.key);

    let noteName = result.noteName + ".md"

    if (existingNoteMatchString) {
        headers.append("Content-Type", "application/json");
        const options = {
            method: "POST",
            headers: headers
        }
        const searchUrl = `${baseURL}/search/simple/?query=${encodeURIComponent(existingNoteMatchString)}`
        const result = await (await fetch(searchUrl, options)).json();
        if (result.length > 1) {
            chrome.notifications.create('', {
                title: 'Obsidian Bookmarker',
                message: 'Not bookmarking because multiple notes match the following text: ' + existingNoteMatchString,
                iconUrl: 'icons/favicon-48x48.png',
                type: 'basic'
            });
            return;
        }
        else if (result.length == 1 && result[0]) {
            noteName = result[0].filename;
        }
        headers.delete("Content-Type")
    }

    const noteUrl = `${baseURL}/vault/${encodeURIComponent(noteName)}`

    if (clipAsNewNote) {
        headers.append("Content-Type", "application/json");
        const options = {
            method: "GET",
            headers: headers
        }
        const exists = await fetch(noteUrl, options);
        if (exists.ok) {
            chrome.notifications.create('', {
                title: 'Obsidian Bookmarker',
                message: 'Not bookmarking because the following note already exists: ' + noteName,
                iconUrl: 'icons/favicon-48x48.png',
                type: 'basic'
            });
            return;
        }
        headers.delete("Content-Type")
    }

    headers.append("Content-Type", "text/markdown");
    const options = {
        method: "POST",
        headers: headers,
        body: note
    }
    fetch(noteUrl, options).then((response) => {
        if (response.ok)
            chrome.notifications.create('', {
                title: 'Obsidian Bookmarker',
                message: 'Bookmarked at: ' + noteName,
                iconUrl: 'icons/favicon-48x48.png',
                type: 'basic'
            });
        else
            response.text().then((message) => console.log(message));
    });
});

// On install open the options page:
chrome.runtime.onInstalled.addListener(function (object) {
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") }, function (tab) {});
    }
});