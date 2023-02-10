'use strict'

class OrderTransaction extends HTMLElement {

    #wallet
    #price
    #openTransaction
    #buyElement
    #sellElement
    #balanceElement

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        shadow.innerHTML = `
            <style>
            :host {
                align-items: center;
                display: flex;
                column-gap: 2em;
                justify-content: space-evenly;
                padding: 2em 1em;
            }
            :host span {
                background-color: #0b0b0e;
                border: 4px solid #1f1f27;
                border-radius: 1em;
                color: #556;
                display: inline-block;
                flex: none;
                font-weight: bold;
                padding: 1em 0;
                text-align: center;
                width: 10em;
            }
            :host .btn {
                border-width: 1px;
                border-style: solid;
                border-radius: 1em;
                color: white;
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                padding: 1em 1.5em;
                width: 100%;
            }
            :host .btn.buy {
                background-color: #508850;
                border-color: #66b366;
            }
            :host .btn.buy:not(:disabled) {
                animation: ping-buy 2s ease-in-out infinite;
            }
            :host .btn.buy:hover {
                background-color: #66b366;
                border-color: #7bff00;
            }
            :host .btn.sell {
                background-color: #bd4343;
                border-color: #eb3a3a;
            }
            :host .btn.sell:not(:disabled) {
                animation: ping-sell 2s ease-in-out infinite;
            }
            :host .btn.sell:hover {
                background-color: #eb3a3a;
                border-color: #ff746f;
            
            }
            :host .btn.buy:disabled, :host .btn.buy:disabled:hover,
            :host .btn.sell:disabled, :host .btn.sell:disabled:hover {
                background-color: #494a50;
                border-color: #595a61;
                box-shadow: inset .5em .5em 1em #383941;
                color: #9496a0;
            }
            @keyframes ping-buy {
                70%, 80% {
                    border-color: #7bff00;
                    box-shadow: 0 0 .8em #66b366;
                }
            }
            @keyframes ping-sell {
                40%, 50% {
                    border-color: #ff746f;
                    box-shadow: 0 0 .8em #eb3a3a;
                }
            }
            </style>
            <slot>
                <button class="btn buy" type="button">Buy</button>
                <span>$1000</span>
                <button class="btn sell" disabled type="button">Sell</button>
            </slot>
        `;

        this.#wallet = 1000;
        this.#price = 0;
        this.#openTransaction = null;

        this.#buyElement = shadow.querySelector('button.buy');
        this.#sellElement = shadow.querySelector('button.sell');
        this.#balanceElement = shadow.querySelector('span');

        this.buy = this.buy.bind(this);
        this.sell = this.sell.bind(this);

        this.#buyElement.addEventListener('click', this.buy);
        this.#sellElement.addEventListener('click', this.sell);
    }

    buy(event) {
        if (this.#openTransaction
            || this.#price <= 0
            || this.#wallet < this.#price
        ) {
            return;
        }

        this.#openTransaction = {
            buyPrice: this.#price,
            quantity: this.#wallet / this.#price,
        };

        this.updateBalance(0);
        
        event.target.disabled = true;
        this.#sellElement.removeAttribute('disabled');
        
    }

    sell(event) {
        if (!this.#openTransaction) {
            return;
        }

        this.#openTransaction = {...this.#openTransaction, sellPrice: this.#price};

        this.dispatchEvent(new CustomEvent('orderSold', {
            composed: true,
            bubbles: true,
            detail: this.#openTransaction,
        }));

        this.updateBalance(this.#openTransaction.sellPrice * this.#openTransaction.quantity);

        this.#openTransaction = null;

        event.target.disabled = true;
        this.#buyElement.removeAttribute('disabled');
    }

    updateBalance() {
        const usdFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
        this.#balanceElement.innerText = usdFormatter.format(this.#wallet);
    }

    updateStockPrice(price) {
        this.#price = price;
    }

    updateBalance(balance) {
        this.#wallet = balance;
        const usdFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
        this.#balanceElement.innerText = usdFormatter.format(balance);
    }
}

customElements.define('order-transaction', OrderTransaction);