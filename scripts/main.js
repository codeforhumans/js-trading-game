'use strict';

const gameEl = document.getElementById('game');

const game = new Game(
    gameEl,
    document.getElementById('wallet'),
    document.querySelector('form button.buy'),
    document.querySelector('form button.sell'),
    document.querySelector('form span'),
    gameEl.getContext('2d'),
    mockData
);

window.addEventListener('resize', () => game.resize());

setInterval(() => {
    game.updateData(mockData);
}, 1000)