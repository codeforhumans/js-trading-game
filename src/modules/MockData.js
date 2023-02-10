'use strict';

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

export default mockData;