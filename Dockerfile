FROM node
RUN npm install -g git+https://github.com/shadiakiki1986/banking-swift-messages-nodejs.git
ENV MONGOHOST ""
COPY entrypoint.sh /

ENTRYPOINT ["bash","entrypoint.sh"]
