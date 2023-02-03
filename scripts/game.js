'use strict';

// this should be a web component
// and shouldn't handle the drawing
class Game {

    constructor(canvasEl, buyEl, sellEl, context2d, data) {
        this.element = canvasEl;
        this.buyElement = buyEl;
        this.sellElement = sellEl;
        this.context = context2d;
        this.data = data;
        this.orders = [];

        this.element.addEventListener('mousemove', e => this.drawCursor(e));
        this.buyElement.addEventListener('click', () => alert('test'));
        this.sellElement.addEventListener('click', () => alert('test'));

        this.resize();
    }

    resize() {
        const docSize = document.body.getBoundingClientRect();
        const headerSize = document.querySelector('header').getBoundingClientRect();
        const footerSize = this.buyElement.parentNode.getBoundingClientRect();

        this.element.width = docSize.width;
        this.element.height = window.innerHeight - headerSize.height - footerSize.height;

        this.draw();
    }

    updateData(data) {
        this.data = data;
        this.draw();
    }

    clearDraw() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }

    draw() {
        this.clearDraw();

        const center = Math.floor(this.element.height / 2);

        this.context.fillStyle = '#335';

        for (let i = 0; i < Math.ceil(this.element.height / 40); i++) {
            this.context.fillRect(0, Math.max(i, 1) * 40, this.element.width - 64, 1);
        }

        for (let i = 0; i < Math.ceil(this.element.width / 40); i++) {
            this.context.fillRect(Math.max(i, 1) * 38, 0, 1, this.element.height);
        }

        const maxCandles = this.element.width / (CandleStick.width() + 10);

        const data = this.data.length > maxCandles
            ? this.data.slice(-Math.abs(maxCandles))
            : this.data;

        data.forEach((json, index) => {
            const candle = new CandleStick(
                json.open,
                json.close,
                json.high,
                json.low
            );

            this.context.fillStyle = candle.isBear() ? '#c33' : '#393';
            this.context.strokeStyle = this.context.fillStyle;

            this.context.fillRect(
                index * (CandleStick.width() + 10),
                center - Math.max(candle.open, candle.close),
                CandleStick.width(),
                candle.height()
            );

            this.context.fillRect(
                Math.floor((CandleStick.width() + 10) * index + CandleStick.width() / 2),
                center - Math.max(candle.high, candle.low),
                candle.highLowWidth(),
                candle.highLowHeight()
            );

            if (this.data.length === (index + 1)) {
                this.context.beginPath();
                this.context.setLineDash([2]);
                this.context.moveTo(0, center - candle.close);
                this.context.lineTo(this.element.width, center - candle.close);
                this.context.stroke();
            }
        });
        
        this.drawPrices(center);
    }

    drawCursor(event) {
        this.draw();

        this.context.strokeStyle = '#99d';

        this.context.beginPath();
        this.context.setLineDash([2]);
        this.context.moveTo(0, event.offsetY);
        this.context.lineTo(this.element.width, event.offsetY);
        this.context.stroke();

        this.context.beginPath();
        this.context.setLineDash([2]);
        this.context.moveTo(event.offsetX, 0);
        this.context.lineTo(event.offsetX, this.element.height);
        this.context.stroke();
    }

    // fix positioning
    drawPrices() {
        const prices = this.data.slice(0, -1).map(data => data.close);
        const higherPrice = Math.ceil(Math.max(...prices));
        const maxPrices = Math.ceil(higherPrice + (higherPrice / 2));
        const priceX = this.element.width - 40;

        this.context.beginPath();
        this.context.font = '14px Helvetica';
        console.log(higherPrice);
        for (let i = 0; i < maxPrices; i++) {
            let price = higherPrice - i;
            let priceY = higherPrice - (i * 10);
            this.context.fillStyle = '#aaa';
            this.context.fillText(price, priceX, i * 30);
        }
    }
}