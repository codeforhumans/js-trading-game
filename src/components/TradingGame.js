'use strict'

import ApiClient from '../modules/ApiClient.js';

class TradingGame extends HTMLElement {

    #chart
    #transaction
    #book

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        shadow.innerHTML = `
            <style>
            </style>
            <slot>
                <candlesticks-chart></candlesticks-chart>
                <order-transaction></order-transaction>
                <order-book></order-book>
            </slot>
        `;

        this.#chart = shadow.querySelector('candlesticks-chart');
        this.#transaction = shadow.querySelector('order-transaction');
        this.#book = shadow.querySelector('order-book');

        this.updateData = this.updateData.bind(this);
        this.updateBook = this.updateBook.bind(this);

        this.#transaction.addEventListener('orderSold', this.updateBook);

        // convert to event?
        setInterval(this.updateData, 1000);

        this.updateData();
    }

    updateData() {
        new ApiClient().getData()
            .then(data => {
                this.#chart.updateData(data);
                this.#transaction.updateStockPrice(data[data.length - 1].close);
            });
    }

    updateBook(event) {
        this.#book.append(event.detail);
    }
}

export default TradingGame;