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
            :host #profit-result {
                background-color: #fff;
                border: 2px solid #111;
                border-radius: 1em;
                left: 40%;
                padding: 2em;
                position: absolute;
                top: 20%;
                transition: visibility .3s linear, opacity .3s linear;
            }
            :host #profit-result.hidden {
                visibility: hidden;
                opacity: 0;
            }
            :host #profit-result.positive {
                background: #efe;
                border-color: green;
                color: green;
            }
            :host #profit-result.positive svg.negative {
                display: none;
            }
            :host #profit-result.positive svg.positive {
                display: block;
            }
            :host #profit-result.negative {
                background-color: #fee;
                border-color: red;
                color: red;
            }
            :host #profit-result.negative svg.positive {
                display: none;
            }
            :host #profit-result.negative svg.negative {
                display: block;
            }
            </style>
            <slot>
                <candlesticks-chart></candlesticks-chart>
                <footer>
                    <order-transaction></order-transaction>
                    <order-book></order-book>
                </footer>
                <div id="profit-result" class="hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="positive">
                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="negative">
                        <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                    </svg>
                    Your profit is <strong>$0</strong>
                </div>
            </slot>
        `;

        this.#chart = shadow.querySelector('candlesticks-chart');
        this.#transaction = shadow.querySelector('order-transaction');
        this.#book = shadow.querySelector('order-book');

        this.updateData = this.updateData.bind(this);
        this.updateBook = this.updateBook.bind(this);

        this.#transaction.addEventListener('orderSold', event => this.showProfit(event.detail) || this.updateBook(event.detail));

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

    showProfit(order) {
        const profit = order.buyPrice - order.sellPrice;
        const usdFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
        const profitResultElement = this.shadowRoot.getElementById('profit-result');

        profitResultElement.classList.add(profit > 0 ? 'positive' : 'negative');
        profitResultElement.classList.remove('hidden');
        this.shadowRoot.querySelector('#profit-result strong').innerText = usdFormatter.format(profit);

        setInterval(() => profitResultElement.classList.add('hidden'), 6000);
    }

    updateBook(order) {
        this.#book.append(order);
    }
}

export default TradingGame;