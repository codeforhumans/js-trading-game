'use strict'

import mockData from '../modules/MockData.js';

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
        this.#chart.updateData(mockData);
        this.#transaction.updateStockPrice(mockData[mockData.length - 1].close);
    }

    updateBook(event) {
        this.#book.append(event.detail);
    }
}

export default TradingGame;