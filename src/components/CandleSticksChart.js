'use strict';

import CandleStick from '../modules/CandleStick.js';

class CandleSticksChart extends HTMLElement {

    #data;
    #canvas;
    #context;
    #priceLabelWidth;
    #lastMousePosition;
    #horizontalLines;
    #highestPrice;
    #lowestPrice;
    #priceFraction;

    constructor() {

        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <style>
            :host {
                cursor: crosshair;
            }
            </style>
            <slot>
                <canvas></canvas>
            </slot>
        `;

        this.#data    = [];
        this.#canvas  = shadow.querySelector('canvas');
        this.#context = this.#canvas.getContext('2d');

        this.#canvas.height = shadow.host.getBoundingClientRect().height;
        this.#canvas.width = shadow.host.getBoundingClientRect().width;

        this.#priceLabelWidth = 80;
        this.#lastMousePosition = {offsetX: 0, offsetY: 0};
        this.#horizontalLines = 15;
        this.#highestPrice = 0;
        this.#lowestPrice = 0;
        this.#priceFraction = 0;

        this.drawCursor = this.drawCursor.bind(this);

        this.#canvas.addEventListener('mousemove', e => this.draw() || this.drawCursor(e));
        this.#canvas.addEventListener('mouseout', e => this.draw());

        this.draw();
    }

    drawCursor(event) {

        if (event) {
            this.#lastMousePosition = {offsetX: event.offsetX, offsetY: event.offsetY};
        }

        const textX = this.#canvas.width - 40;
        const price = parseFloat(this.#highestPrice - (event.offsetY * this.#priceFraction) / (this.#canvas.height / this.#horizontalLines)).toFixed(2);
        this.#context.strokeStyle = '#aab';
        this.#context.lineWidth = .8;
        this.#context.setLineDash([4, 4]);

        this.#context.beginPath();
        this.#context.moveTo(0, event.offsetY);
        this.#context.lineTo(this.#canvas.width, event.offsetY);
        this.#context.stroke();

        this.#context.beginPath();
        this.#context.moveTo(event.offsetX, 0);
        this.#context.lineTo(event.offsetX, this.#canvas.height);
        this.#context.stroke();

        this.#context.beginPath();
        this.#context.fillStyle = '#1f1f27';
        this.#context.fillRect(textX - 40, event.offsetY - 12, this.#priceLabelWidth, 24);
        this.#context.fillStyle = '#fff'; 
        this.#context.fillText(price, textX, event.offsetY + 5);

        this.#context.fillStyle = '#aab';
        this.#context.strokeStyle = '#aab';
        this.#context.lineWidth = 1;
        this.#context.setLineDash([1]);
    }

    draw() {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        this.#context.lineWidth = 1;
        this.#context.font = '14px sans-serif';
        this.#context.textAlign = 'center';

        for (let i = 0; i <= this.#horizontalLines; i++) {
            const posY = this.#canvas.height / this.#horizontalLines * i;
            this.#context.beginPath();
            this.#context.fillStyle = '#1f1f27';
            this.#context.strokeStyle = '#1f1f27';
            this.#context.setLineDash([]);
            this.#context.moveTo(0, posY);
            this.#context.lineTo(this.#canvas.width - this.#priceLabelWidth, posY);
            this.#context.stroke();
            this.#context.fillStyle = '#aab';
            this.#context.fillText(parseFloat(i * this.#priceFraction - this.#highestPrice).toFixed(2), this.#canvas.width - 40, posY);
        }

        for (let i = 0; i < Math.ceil(this.#canvas.width / 40); i++) {
            this.#context.beginPath();
            this.#context.fillStyle = '#1f1f27';
            this.#context.fillRect(Math.max(i, 1) * 38, 0, 1, this.#canvas.height);
        }

        const highestVolume = Math.max(...this.#data.flatMap(c => c.volume));

        this.#data.forEach((json, index) => {
            const candle = new CandleStick(
                json.open,
                json.close,
                json.high,
                json.low,
                json.volume
            );

            this.#context.fillStyle = candle.isBear() ? '#bd4343' : '#508850';
            this.#context.strokeStyle = this.#context.fillStyle;

            const candlePosY = (this.#canvas.height / this.#horizontalLines) * ((this.#highestPrice - Math.max(candle.open, candle.close)) / this.#priceFraction);
            const candleHeight  = (this.#canvas.height / this.#horizontalLines) * ((this.#highestPrice - Math.min(candle.open, candle.close)) / this.#priceFraction) - candlePosY;

            this.#context.fillRect(
                index * (CandleStick.width() + 10),
                candlePosY,
                CandleStick.width(),
                candleHeight
            );

            const candleHighPosY = (this.#canvas.height / this.#horizontalLines) * ((this.#highestPrice - candle.high) / this.#priceFraction);
            const candleHighHeight = (this.#canvas.height / this.#horizontalLines) * ((this.#highestPrice - candle.low) / this.#priceFraction) - candleHighPosY;

            this.#context.fillRect(
                Math.floor((CandleStick.width() + 10) * index + CandleStick.width() / 2),
                candleHighPosY,
                candle.highLowWidth(),
                candleHighHeight
            );

            this.#context.globalAlpha = .4;

            const volumeHeight = ((this.#canvas.height / 3) * candle.volume) / highestVolume;

            this.#context.fillRect(
                index * (CandleStick.width() + 10),
                this.#canvas.height - volumeHeight,
                CandleStick.width(),
                volumeHeight
            );

            this.#context.globalAlpha = 1;

            if (this.#data.length === (index + 1)) {
                const posY = (this.#canvas.height / this.#horizontalLines) * ((this.#highestPrice - candle.close) / this.#priceFraction)
                this.#context.beginPath();
                this.#context.shadowBlur = 10;
                this.#context.shadowColor = this.#context.fillStyle;
                this.#context.lineWidth = 2;
                this.#context.setLineDash([2, 2]);
                this.#context.moveTo(0, posY);
                this.#context.lineTo(this.#canvas.width, posY);
                this.#context.stroke();
                this.#context.fillRect(this.#canvas.width - this.#priceLabelWidth, posY - 12, this.#priceLabelWidth, 24);
                this.#context.fillStyle = '#fff';
                this.#context.fillText(
                    parseFloat(candle.close).toFixed(2),
                    this.#canvas.width - 40,
                    posY + 4
                );
                this.#context.shadowBlur = 0;
                this.#context.shadowColor = '#aab';
                this.#context.lineWidth = 1;
            }
        });

        this.drawCursor(this.#lastMousePosition);
    }

    updateData(data) {
        const maxCandles = Math.floor((this.#canvas.width - this.#priceLabelWidth) / (CandleStick.width() + 10));

        this.#data = data.length > maxCandles
            ? [...data].slice(-Math.abs(maxCandles))
            : data;

        const priceRange = 4;
        const dataFlat = this.#data.flatMap(c => c.close);

        this.#highestPrice = Math.max(...dataFlat) + priceRange;
        this.#lowestPrice = Math.min(...dataFlat) - priceRange;
        this.#priceFraction = (this.#highestPrice - this.#lowestPrice) / this.#horizontalLines;

        this.draw();
    }
}

export default CandleSticksChart;