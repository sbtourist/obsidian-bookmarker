export interface Options {
  obsidianVaultURL: string,
  obsidianVaultKey: string,
  obsidianNoteName: string,
  obsidianNoteFormat: string,
  matchByQuery: boolean,
  obsidianQuery: string,
  selectAsMarkdown: boolean,
  datetimeFormat: string,
  dateFormat: string,
  timeFormat: string
}

export function create(document?: Document): Options {
  return {
    obsidianVaultURL: (document && document.getElementById('obsidian_vault_url').value) || '',
    obsidianVaultKey: (document && document.getElementById('obsidian_vault_key').value) || '',
    obsidianNoteName: (document && document.getElementById('obsidian_note_name').value) || '',
    obsidianNoteFormat: (document && document.getElementById('obsidian_note_format').value) || `> {clip}\nClipped from [{title}]({url}) at {date}.`,
    matchByQuery: (document && document.getElementById('match_by_query').checked) || false,
    obsidianQuery: (document && document.getElementById('obsidian_query').value) || '',
    selectAsMarkdown: (document && document.getElementById('select_as_markdown').checked) || false,
    datetimeFormat: (document && document.getElementById('datetime_format').value) || "YYYY-MM-DD HH:mm:ss",
    dateFormat: (document && document.getElementById('date_format').value) || "YYYY-MM-DD",
    timeFormat: (document && document.getElementById('time_format').value) || "HH:mm:ss"
  }
};

export function getStorageData(): Promise<Options> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      return resolve(result as Options);
    });
  });
}

export function setStorageData(data: Options): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      return resolve();
    });
  });
}

export function getStorageItem<Key extends keyof Options>(
  key: Key,
): Promise<Options[Key]> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      return resolve((result as Options)[key]);
    });
  });
}

export function setStorageItem<Key extends keyof Options>(
  key: Key,
  value: Options[Key],
): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      return resolve();
    });
  });
}

export async function initializeStorageWithDefaults(defaults: Options) {
  const currentStorageData = await getStorageData();
  const newStorageData = Object.assign({}, defaults, currentStorageData);
  await setStorageData(newStorageData);
}
