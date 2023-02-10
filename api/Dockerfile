from python:3.10-slim

WORKDIR /var/www/api

RUN set -ex \
    && apt update \
    && pip3 install --no-cache-dir -r api/requirements.txt
    && python3 api/main.py
