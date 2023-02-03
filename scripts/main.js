'use strict';

const gameEl = document.getElementById('game');

const game = new Game(
    gameEl,
    document.querySelector('form button.buy'),
    document.querySelector('form button.sell'),
    gameEl.getContext('2d'),
    mockData
);

window.addEventListener('resize', () => game.resize());

// loads updated mock data
setInterval(() => {
    game.updateData(mockData);
}, 1000)