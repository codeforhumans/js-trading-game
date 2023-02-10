'use strict'


let interval = 0;

const mockData = [
    {open: 0, close: 20, high: 25, low: 5},
    {open: 20, close: 30, high: 40, low: 10},
    {open: 30, close: 0, high: 50, low: 20},
    {open: 0, close: 10, high: 50, low: 50},
];

setInterval(() => {
    const lastIndex = mockData.length - 1;
    const open = mockData[lastIndex].close;
    const close = Math.random() * 100;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) + Math.random() * -5;

    if (interval >= 5) {
        mockData.push({open, close, high, low});
        interval = 0;
        return;
    }

    mockData[lastIndex].close = close;
    mockData[lastIndex].high = Math.max(mockData[lastIndex].high, high, open, close);
    mockData[lastIndex].low = Math.min(mockData[lastIndex].low, low, open, close);

    ++interval;

}, 1000);


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

customElements.define('trading-game', TradingGame);