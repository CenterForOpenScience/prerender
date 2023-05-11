FROM node:16-alpine

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

RUN apk add --update-cache chromium tini \
 && rm -rf /var/cache/apk/* /tmp/*

USER node
WORKDIR "/home/node"

COPY ./package.json .

RUN npm install --no-package-lock

COPY ./server.js .
COPY ./lib ./lib

EXPOSE 3000

ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]
