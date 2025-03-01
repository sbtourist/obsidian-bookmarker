import { Options, getStorageData } from "./storage";
import { AlertMessage, ClipMessage } from "./messages";
import * as moment from 'moment';
import * as rangy from 'rangy';
import TurndownService from "turndown";
import { success, warn } from "./alerter";

export async function clip(testing: boolean) {
    const options: Options = await getStorageData();
    console.log("Clipping with options: ", options);

    const title = document.title.replace(/\//g, '');
    const url = window.location.href;
    const date = moment().format(options.dateFormat);
    const datetime = moment().format(options.datetimeFormat);
    const time = moment().format(options.timeFormat);
    const day = moment().format("DD");
    const month = moment().format("MM");
    const year = moment().format("YYYY");
    const zettel = moment().format("YYYYMMDDHHmmss");
    
    let selection;
    let link;
    let fullLink;
    
    // If we're testing..
    if (testing) {
        selection = "This is a test clipping from the Obsidian Bookmarker"
    } else if (options.selectAsMarkdown) {
        // Get the HTML selected
        let sel = rangy.getSelection().toHtml();

        // Turndown to markdown
        let turndown = new TurndownService();

        // This rule constructs url to be absolute URLs for links & images
        let turndownWithAbsoluteURLs = turndown.addRule('baseUrl', {
            filter: ['a', 'img'],
            replacement: function (content, el, options) {
                if (el.nodeName === 'IMG') {
                    link =  (el as HTMLElement).getAttributeNode('src').value;
                    fullLink = new URL(link, url);
                    return `![${content}](${fullLink.href})`;
                } else if (el.nodeName === 'A') {
                    link =  (el as HTMLElement).getAttributeNode('href').value;
                    fullLink = new URL(link, url);
                    return `[${content}](${fullLink.href})`;
                }
            }
        })

        selection = turndownWithAbsoluteURLs.turndown(sel);
    } else {
        // Otherwise plaintext
        selection = window.getSelection().toString();
    }

    // Replace the placeholders: (with regex so multiples are replaced as well..)
    let note = options.obsidianNoteFormat;
    let obsidianQuery= options.obsidianQuery;
    note = note.replace(/{clip}/g, selection);
    note = note.replace(/{date}/g, date);
    note = note.replace(/{datetime}/g, datetime);
    note = note.replace(/{time}/g, time);
    note = note.replace(/{day}/g, day);
    note = note.replace(/{month}/g, month);
    note = note.replace(/{year}/g, year);
    note = note.replace(/{url}/g, url);
    note = note.replace(/{title}/g, title);
    note = note.replace(/{zettel}/g, zettel);
    obsidianQuery = obsidianQuery.replace(/{url}/g, url);
    obsidianQuery = obsidianQuery.replace(/{title}/g, title);

    // Clip the og:image if it exists
    if (document.querySelector('meta[property="og:image"]')) {
        let image = document.querySelector('meta[property="og:image"]').content;
        note = note.replace(/{og:image}/g, `![](${image})`) // image only works in the content of the note
    } else {
        note = note.replace(/{og:image}/g, "");
    }

    // replace the placeholder in the title, taking into account invalid note names and removing special 
    // chars like \/:#^\[\]|?  that result in no note being created... * " \ / < > : | ?
    let noteName = options.obsidianNoteName;
    noteName = noteName.replace(/{date}/g, date.replace(/[\/":#^\[\]|?<>]/g, ''));
    noteName = noteName.replace(/{day}/g, day.replace(/[\/":#^\[\]|?<>]/g, ''));
    noteName = noteName.replace(/{month}/g, month.replace(/[\/":#^\[\]|?<>]/g, ''));
    noteName = noteName.replace(/{year}/g, year.replace(/[\/":#^\[\]|?<>]/g, ''));
    noteName = noteName.replace(/{url}/g, url.replace(/[\/":#^\[\]|?<>]/g, ''));
    noteName = noteName.replace(/{title}/g, title.replace(/[\/":#^\[\]|?<>]/g, ''));
    noteName = noteName.replace(/{zettel}/g, zettel.replace(/[\/":#^\[\]|?<>]/g, ''));
    noteName = noteName.replace(/{datetime}/g, datetime.replace(/[\/":#^\[\]|?<>]/g, ''));
    noteName = noteName.replace(/{time}/g, time.replace(/[\/":#^\[\]|?<>]/g, ''));
    
    // Send a clipping messsage
    let message: ClipMessage = new ClipMessage({
        bookmark: { name: noteName, body: note },
        testing: testing,
        obsidianURL: options.obsidianVaultURL,
        obsidianKey: options.obsidianVaultKey,
        matchByQuery: options.matchByQuery,
        obsidianQuery: obsidianQuery
    });
    console.log("Sending clipping message: ", message);
    chrome.runtime.sendMessage<ClipMessage, AlertMessage>(message).then(alert => {
        if (alert.success)
            success(alert.text);
        else
            warn(alert.text);
    });
}


