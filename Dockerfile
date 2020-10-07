FROM node:12.10.0
WORKDIR /var/code/
ADD . /var/code/
RUN npm install
ENTRYPOINT [ "bash" ]
