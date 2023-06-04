# Obsidian Bookmarker

This is an unofficial Chrome Extension to clip a webpage and an optional selection to an Obsidian note, with customizable template.

This starts as a fork of [Obsidian Clipper](https://jplattel.github.io/obsidian-clipper), offering the following improvements and new features:
- Bookmarking/clipping implementation based on the [Local Rest API](https://github.com/coddingtonbear/obsidian-local-rest-api) Obsidian plugin rather than on URL redirect: this makes the clipping and note creation much faster and reliable.
- Text matching of existing notes to avoid duplicate bookmarks.

Practically speaking, this transforms your Obsidian vault in a fast and powerful bookmark manager!

## Installing

### Prerequisites

1. Install the [Local Rest API](https://github.com/coddingtonbear/obsidian-local-rest-api) Obsidian plugin to your vault.
2. Download the plugin certificate via the plugin settings.
3. Install the certificate as a trusted authority in `chrome://settings/certificates`.
4. Obsidian must be running.

### Manually (packed)

Coming soon.

### Manually (unpacked)

1.  Download/clone this repository.
2.  Navigate to the [Chrome Extension](chrome://extensions) and enable developer mode (top right of your window).
3.  Load unpacked extension and navigate to the `src` folder of this repository you just downloaded or cloned.
4.  Chrome will now build the extension and you can use the extension menu to pin in to the user interface.
5.  You're now ready to configure the extension, see steps below.

## Usage & Settings

1.  Right-click on the extension icon in the menu, and click on options.
2.  A webpage should open where you can configure the options for this extension
3.  You must configure the following:
    -   `Vault URL`: The REST API URL for your vault (from the [Local Rest API](https://github.com/coddingtonbear/obsidian-local-rest-api) Obsidian plugin settings)
    -   `Vault API Key`: The REST API key for your vault (from the [Local Rest API](https://github.com/coddingtonbear/obsidian-local-rest-api) Obsidian plugin settings)
    -   `Note Name`: The name of the note you want to create or append to
    -   `Note Match`: If provided, a note matching the given string will be searched and if found appended to
    -   `Clip as New`: If enabled, a new bookmark/clip will be created only if one with the same name (or match if provided) doesn't already exist
4.  You can specify the clipping template using placeholders like `{clip}`, `{date}`, `{month}` or `{year}`.
5.  Decide if you want a markdown clip (HTML is converted to markdown and added to your clipboard) or plain text.
6.  You can test with the 'Test Configuration' button. 

Once configured, you're now good to go, using it only takes two steps:

1.  Make a selection on a page and click the icon of the extension.
2.  Obsidian will create or append to the specified note within the vault.

## Troubleshooting

Coming soon.

## Roadmap

Coming soon.