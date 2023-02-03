'use strict';

// this should be a web component
// and shouldn't handle the drawing
class Game {

    constructor(canvasEl, walletEl, buyEl, sellEl, currentOrderEl, context2d, data) {
        this.element = canvasEl;
        this.walletEl = walletEl;
        this.buyEl = buyEl;
        this.sellEl = sellEl;
        this.currentOrderEl = currentOrderEl;
        this.context = context2d;
        this.data = data;
        this.orders = [];
        this.lastMouseOffset = {};

        this.buyEl.addEventListener('click', event => {
            if (event.target.disabled) {
                return;
            }

            const wallet = parseFloat(this.walletEl.innerText.substring(1,));
            const order = {
                quantity: wallet / this.data[this.data.length - 1].close,
                open: true
            };

            event.target.disabled = true;
            this.sellEl.removeAttribute('disabled');
            this.currentOrderEl.innerText = new Intl.NumberFormat('en-US').format(order.quantity);
            this.walletEl.innerText = '$0';

            this.orders.push(order);
        });

        this.sellEl.addEventListener('click', event => {
            if (event.target.disabled) {
                return;
            }

            const profit = this.data[this.data.length - 1].close * this.orders[this.orders.length - 1].quantity;

            event.target.disabled = true;
            this.buyEl.removeAttribute('disabled');

            this.walletEl.innerText = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(profit);
            this.currentOrderEl.innerText = '0';

            this.orders[this.orders.length - 1].open = false;
        });

        this.element.addEventListener('mousemove', e => {
            this.drawCursor(e);
            this.lastMouseOffset = {offsetX: e.offsetX, offsetY: e.offsetY}
        });

        this.resize();
    }

    resize() {
        const docSize = document.body.getBoundingClientRect();
        const headerSize = document.querySelector('header').getBoundingClientRect();
        const footerSize = this.buyEl.parentNode.getBoundingClientRect();

        this.element.width = docSize.width;
        this.element.height = window.innerHeight - headerSize.height - footerSize.height;

        this.draw();
    }

    updateData(data) {
        this.data = data;
        this.draw();
        this.drawCursor(this.lastMouseOffset);
    }

    clearDraw() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }

    draw() {
        this.clearDraw();

        const center = Math.floor(this.element.height / 2);
        const horizontalLines = 20;

        this.context.lineWidth = 1;

        for (let i = 1; i <= horizontalLines; i++) {
            const posY = (this.element.height / horizontalLines) * i;
            this.context.beginPath();
            this.context.fillStyle = '#1f1f27';
            this.context.strokeStyle = '#1f1f27';
            this.context.setLineDash([]);
            this.context.moveTo(0, posY);
            this.context.lineTo(this.element.width - 80, posY);
            this.context.stroke();
            this.context.fillStyle = '#fff';
            this.context.fillText(Math.floor(center - posY), this.element.width - 40, posY);
        }

        for (let i = 0; i < Math.ceil(this.element.width / 40); i++) {
            this.context.beginPath();
            this.context.fillStyle = '#1f1f27';
            this.context.fillRect(Math.max(i, 1) * 38, 0, 1, this.element.height);
        }

         // 80 for the price label
        const maxCandles = this.element.width / (CandleStick.width() + 10 + 80);

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

            this.context.fillStyle = candle.isBear() ? '#508850' : '#bd4343';
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
                this.context.shadowBlur = 10;
                this.context.shadowColor = this.context.fillStyle;
                this.context.lineWidth = 2;
                this.context.setLineDash([2, 2]);
                this.context.moveTo(0, center - candle.close);
                this.context.lineTo(this.element.width, center - candle.close);
                this.context.stroke();
                this.context.fillRect(this.element.width - 80, center - candle.close - 12, 80, 24);
                this.context.textAlign = 'center';
                this.context.fillStyle = '#fff';
                this.context.fillText(
                    Math.ceil(candle.close),
                    this.element.width - 40,
                    center - candle.close + 4
                );
                this.context.shadowBlur = 0;
                this.context.shadowColor = '#fff';
                this.context.lineWidth = 1;
            }
        });
    }

    drawCursor(event) {
        const centerY = this.element.height / 2;
        const textX = this.element.width - 40;
        
        this.draw();

        this.context.strokeStyle = '#fff';
        this.context.lineWidth = .8;
        this.context.setLineDash([4, 4]);

        this.context.beginPath();
        this.context.moveTo(0, event.offsetY);
        this.context.lineTo(this.element.width, event.offsetY);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(event.offsetX, 0);
        this.context.lineTo(event.offsetX, this.element.height);
        this.context.stroke();

        this.context.beginPath();
        this.context.fillStyle = '#1f1f27';
        this.context.fillRect(textX - 40, event.offsetY - 12, 80, 24);
        this.context.fillStyle = '#fff'; 
        this.context.fillText(centerY - event.offsetY, textX, event.offsetY + 5);

        this.context.fillStyle = '#fff';
        this.context.strokeStyle = '#fff';
        this.context.lineWidth = 1;
        this.context.setLineDash([1]);
    }
}