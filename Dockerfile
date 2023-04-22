FROM node:18.12-alpine

ENV TZ = Asia/Bangkok
 
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers 
RUN npm config set unsafe-perm true
RUN npm install --quiet node-gyp -g

# RUN apk add tzdata \
#     && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
#     && echo $TZ > /etc/timezone \
#     && npm install \
#     && mkdir -p /app/ssl

WORKDIR /app

COPY . /app

RUN npm install -g pm2 && npm install express express-winston winston && npm install

EXPOSE 8000



CMD pm2 start pm2.json --no-daemon

