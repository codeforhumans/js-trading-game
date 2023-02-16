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
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 100%;
            }
            :host candlesticks-chart, :host footer {
                display: flex;
                flex-direction: column;
            }
            :host candlesticks-chart {
                flex: 1;
            }
            :host footer {
                height: 300px;
            }
            </style>
            <slot>
                <candlesticks-chart></candlesticks-chart>
                <footer>
                    <order-transaction></order-transaction>
                    <order-book></order-book>
                </footer>
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