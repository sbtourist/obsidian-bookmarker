# Obsidian Bookmarker

This is an unofficial Chrome Extension to clip a webpage and an optional selection to an Obsidian note, with customizable template.

This starts as a fork of [Obsidian Clipper](https://jplattel.github.io/obsidian-clipper), offering the following improvements and new features:
- Bookmarking/clipping implementation based on the [Local Rest API](https://github.com/coddingtonbear/obsidian-local-rest-api) Obsidian plugin rather than on URL redirect: this makes the clipping and note creation much faster and reliable, also opening up to exciting new features thanks to a tighter integration with your vault.
- Content matching: when bookmarking a new note, the extension will look for existing notes in your vault matching a pre-configured string; this allows to edit
the automatically created note name and still avoid duplicate bookmarks; for example, you can put the bookmark URL in a bullet point of your note and match by that.
- Finally, the original extension has been ported to TypeScript, which will make it easier to maintain it and develop new features.

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

1.  Right-click on the extension icon in the menu, and click on "Options": a webpage will open where you can configure the extension.
2.  You must configure the following:
    -   `Vault URL`: The REST API URL for your vault (from the [Local Rest API](https://github.com/coddingtonbear/obsidian-local-rest-api) Obsidian plugin settings)
    -   `Vault API Key`: The REST API key for your vault (from the [Local Rest API](https://github.com/coddingtonbear/obsidian-local-rest-api) Obsidian plugin settings)
    -   `Match By Content`: If enabled, a new bookmark/clip will be created only if one matching the content provided (see below) doesn't already exist. Please bear in mind notes are always matched by name, even if this is disabled.
    -   `Content Match`: If `Match By Content` is enabled, this is the content existing notes will be matched against. You can use the `{title}` and `{url}` placeholders.
    -   `Note Name`: The name of the note you want to create
3.  You can specify the clipping template using placeholders like `{clip}`, `{date}`, `{month}` or `{year}`.
4.  Decide if you want a markdown clip (HTML is converted to markdown) or plain text by enabling/disabling `Clip HTML as markdown`.
5.  Save and test it!

Once configured, you're now good to go, using it only takes two steps:

1.  Make a selection on a page and click the icon of the extension.
2.  Obsidian will create the specified note within the vault.

## Troubleshooting

Coming soon.

## Roadmap

Coming soon.