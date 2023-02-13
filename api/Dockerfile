from python:3.10-slim

COPY . /var/www/api
WORKDIR /var/www/api

RUN set -ex \
    && apt update \
    && pip3 install --no-cache-dir -r requirements.txt

CMD ["python3", "main.py"]
