FROM node
RUN npm install --quiet -g git+https://github.com/shadiakiki1986/banking-swift-messages-nodejs.git # > /dev/null
ENV MONGOHOST ""
COPY entrypoint.sh .
ENTRYPOINT ["bash","entrypoint.sh"]
