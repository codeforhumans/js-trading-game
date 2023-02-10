'use strict';

class ApiClient {

    #url;

    constructor() {
        this.#url = '/api/data.json'
    }

    getData() {
        return fetch(this.#url)
            .then(res => res.json());
    }
}

export default ApiClient;