'use strict';

const gameEl = document.getElementById('game');
const closedOrdersTbodyEl = document.querySelector('#orders tbody');

const game = new Game(
    gameEl,
    document.getElementById('wallet'),
    document.querySelector('form button.buy'),
    document.querySelector('form button.sell'),
    document.querySelector('form span'),
    gameEl.getContext('2d'),
    mockData,

);

game.onCloseOrder(orders => {
    closedOrdersTbodyEl.innerHTML = '';
    orders.forEach(order => {
        closedOrdersTbodyEl.innerHTML += `
            <tr>
                <td>${order.quantity}</td>
                <td>${order.buyPrice}</td>
                <td>${order.sellPrice}</td>
                <td>${order.profit}</td>
            </tr>
        `;
    })
});

window.addEventListener('resize', () => game.resize());

setInterval(() => {
    game.updateData(mockData);
}, 1000)