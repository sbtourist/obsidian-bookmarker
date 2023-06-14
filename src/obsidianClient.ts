export class ObsidianClient {
    baseURL: string;
    key: string;

    public constructor(baseURL: string, key: string) {
        this.baseURL = baseURL;
        this.key = key;
    }

    public getNoteByName(noteName: string): Promise<Response> {
        const headers = this.makeHeaders();
        const noteUrl = `${this.baseURL}/vault/${encodeURIComponent(noteName)}`    
        headers.append("Content-Type", "application/json");

        const fetchOptions = {
            method: "GET",
            headers: headers
        }
        return fetch(noteUrl, fetchOptions);
    }

    public searchNoteByQuery(query: string): Promise<Response> {
        const headers = this.makeHeaders();
        const searchUrl = `${this.baseURL}/search/simple/?query=${encodeURIComponent(query)}`
        headers.append("Content-Type", "application/json");

        const fetchOptions = {
            method: "POST",
            headers: headers
        }
        return fetch(searchUrl, fetchOptions);
    }

    public putNote(noteName: string, noteBody: string): Promise<Response> {
        const headers = this.makeHeaders();
        const noteUrl = `${this.baseURL}/vault/${encodeURIComponent(noteName)}`    
        headers.append("Content-Type", "text/markdown");

        const fetchOptions = {
            method: "POST",
            headers: headers,
            body: noteBody
        }
        return fetch(noteUrl, fetchOptions);
    }

    private makeHeaders() {
        const headers = new Headers();
        headers.append("Authorization", "Bearer " + this.key);
        return headers;
    }
}