'use strict'

class Order {

    constructor(type, initPos, endPos) {
        this.type = type;
        this.init = initPos;
        this.end = endPos;
    }

    isOpen() {
        return !! this.end;
    }
}

class OrderBook extends HTMLElement {

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        shadow.innerHTML = `
            <style>
            :host {
                background-color: #131318;
                color: #eee;
                font-size: .8em;
                height: 150px;
                bottom: 200px;
                overflow-y: scroll;
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

        this.orders = [];
        this.body = shadow.querySelector('tbody');
    }

    append(order) {
        this.orders.push(order);
        this.update();
    }

    update() {
        const usdFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

        this.body.innerHTML = '';
        this.orders.forEach(order => {
            const buyPrice = usdFormatter.format(order.buyPrice);
            const sellPrice = usdFormatter.format(order.sellPrice);
            const profit = usdFormatter.format(order.sellPrice - order.buyPrice);

            this.body.innerHTML += `
                <tr>
                    <td>${order.quantity}</td>
                    <td>${buyPrice}</td>
                    <td>${sellPrice}</td>
                    <td>${profit}</td>
                </tr>
            `;
        });
    }
}

customElements.define('order-book', OrderBook);