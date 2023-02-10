'use strict';

class CandleStick {

    constructor(open, close, high, low) {
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
    }

    isBear() {
        return this.open > this.close;
    }

    static width() {
        return 5;
    }

    highLowWidth() {
        return 1;
    }

    height() {
        return this.isBear()
            ? this.open - this.close
            : this.close - this.open;
    }

    highLowHeight() {
        return this.high - this.low;
    }
}

class CandleSticksChart extends HTMLElement {

    #data
    #canvas
    #context


    constructor() {

        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <style>
            :host {
                cursor: crosshair;
                display: block;
                min-height: 600px; // make this dynamic
            }
            :host canvas {
                display: block;
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

        this.#canvas.addEventListener('mousemove', event => this.drawCursor(event));

        this.draw();
    }

    drawCursor(event) {
        const centerY = this.#canvas.height / 2;
        const textX = this.#canvas.width - 40;
        
        this.draw();

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
        this.#context.fillRect(textX - 40, event.offsetY - 12, 80, 24);
        this.#context.fillStyle = '#fff'; 
        this.#context.fillText(centerY - event.offsetY, textX, event.offsetY + 5);

        this.#context.fillStyle = '#aab';
        this.#context.strokeStyle = '#aab';
        this.#context.lineWidth = 1;
        this.#context.setLineDash([1]);
    }

    draw() {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        const center = Math.floor(this.#canvas.height / 2);
        const horizontalLines = 20;

        this.#context.lineWidth = 1;
        this.#context.font = '14px sans-serif';
        this.#context.textAlign = 'center';

        for (let i = 1; i <= horizontalLines; i++) {
            const posY = (this.#canvas.height / horizontalLines) * i;
            this.#context.beginPath();
            this.#context.fillStyle = '#1f1f27';
            this.#context.strokeStyle = '#1f1f27';
            this.#context.setLineDash([]);
            this.#context.moveTo(0, posY);
            this.#context.lineTo(this.#canvas.width - 80, posY);
            this.#context.stroke();
            this.#context.fillStyle = '#aab';
            this.#context.fillText(Math.floor(center - posY), this.#canvas.width - 40, posY);
        }

        for (let i = 0; i < Math.ceil(this.#canvas.width / 40); i++) {
            this.#context.beginPath();
            this.#context.fillStyle = '#1f1f27';
            this.#context.fillRect(Math.max(i, 1) * 38, 0, 1, this.#canvas.height);
        }

         // 80 for the price label
        const maxCandles = this.#canvas.width / (CandleStick.width() + 10 + 80);

        const data = this.#data.length > maxCandles
            ? this.#data.slice(-Math.abs(maxCandles))
            : this.#data;

        data.forEach((json, index) => {
            const candle = new CandleStick(
                json.open,
                json.close,
                json.high,
                json.low
            );

            this.#context.fillStyle = candle.isBear() ? '#bd4343' : '#508850';
            this.#context.strokeStyle = this.#context.fillStyle;

            this.#context.fillRect(
                index * (CandleStick.width() + 10),
                center - Math.max(candle.open, candle.close),
                CandleStick.width(),
                candle.height()
            );

            this.#context.fillRect(
                Math.floor((CandleStick.width() + 10) * index + CandleStick.width() / 2),
                center - Math.max(candle.high, candle.low),
                candle.highLowWidth(),
                candle.highLowHeight()
            );

            if (this.#data.length === (index + 1)) {
                this.#context.beginPath();
                this.#context.shadowBlur = 10;
                this.#context.shadowColor = this.#context.fillStyle;
                this.#context.lineWidth = 2;
                this.#context.setLineDash([2, 2]);
                this.#context.moveTo(0, center - candle.close);
                this.#context.lineTo(this.#canvas.width, center - candle.close);
                this.#context.stroke();
                this.#context.fillRect(this.#canvas.width - 80, center - candle.close - 12, 80, 24);
                this.#context.fillStyle = '#fff';
                this.#context.fillText(
                    Math.ceil(candle.close),
                    this.#canvas.width - 40,
                    center - candle.close + 4
                );
                this.#context.shadowBlur = 0;
                this.#context.shadowColor = '#aab';
                this.#context.lineWidth = 1;
            }
        });
    }

    updateData(data) {
        this.#data = data;
        this.draw();
    }
}

customElements.define('candlesticks-chart', CandleSticksChart);