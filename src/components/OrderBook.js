'use strict'

class OrderBook extends HTMLElement {

    #orders
    #body

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        shadow.innerHTML = `
            <style>
            :host {
                background-color: #131318;
                color: #eee;
                font-size: .8em;
                bottom: 200px;
                padding: 1em;
            }
            :host table {
                width: 100%;
            }
            :host h2 {
                margin-bottom: 1em;
            }
            :host thead th, :host tbody td {
                padding: .5em 1em;
            }
            :host tbody tr:nth-child(odd) {
                background-color: #1b1b22;
            }
            </style>
            <slot>
                <table>
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Buy price</th>
                            <th>Sell price</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </slot>
        `;

        this.#orders = [];
        this.#body = shadow.querySelector('tbody');
    }

    append(order) {
        this.#orders.push(order);
        this.update();
    }

    update() {
        const usdFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

        this.#body.innerHTML = '';
        this.#orders.forEach(order => {
            const buyPrice = usdFormatter.format(order.buyPrice);
            const buyPriceTotal = usdFormatter.format(order.buyPrice * order.quantity);
            const sellPrice = usdFormatter.format(order.sellPrice);
            const sellPriceTotal = usdFormatter.format(order.sellPrice * order.quantity);
            const profit = usdFormatter.format(order.sellPrice - order.buyPrice);

            this.#body.innerHTML += `
                <tr>
                    <td>${order.quantity}</td>
                    <td>${buyPrice} <small>(${buyPriceTotal})</small></td>
                    <td>${sellPrice} <small>(${sellPriceTotal})</small></td>
                    <td>${profit}</td>
                </tr>
            `;
        });
    }
}

export default OrderBook;