import { create, setStorageData, getStorageData } from "./storage";
import { clip } from "./bookmarker"
import { success, warn } from "./alerter"

// Saves options to chrome.storage
function storeOptions(testing: boolean) {
    const options = create(document);
    if (options.matchByQuery && options.obsidianQuery.length == 0) {
        warn('Match by content is enabled but no content to match is provided');
        return;
    }

    setStorageData(options).then(_ => {
        if (!testing)
            success('Options saved!');
    });
}

// DOM functions
function save() {
    storeOptions(false);
}

function test() {
    storeOptions(true);
    clip(true);
}

function restoreOptions() {
    getStorageData().then(options => {
        document.getElementById('obsidian_vault_url').value = options.obsidianVaultURL;
        document.getElementById('obsidian_vault_key').value = options.obsidianVaultKey;
        document.getElementById('obsidian_note_name').value = options.obsidianNoteName;
        document.getElementById('obsidian_note_format').value = options.obsidianNoteFormat;
        document.getElementById('select_as_markdown').checked = options.selectAsMarkdown;
        document.getElementById('match_by_query').checked = options.matchByQuery;
        document.getElementById('obsidian_query').value = options.obsidianQuery;
        document.getElementById('datetime_format').value = options.datetimeFormat;
        document.getElementById('date_format').value = options.dateFormat;
        document.getElementById('time_format').value = options.timeFormat;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', save);
document.getElementById('test').addEventListener('click', test);