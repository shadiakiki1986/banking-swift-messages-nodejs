FROM node
WORKDIR /code/bsmn
COPY . .
RUN npm install --quiet \
  && ln -s /code/bsmn/bin/swift2json /usr/local/bin/swift2json \
  && ls -al /usr/local/bin/swift2json \
  && chmod 777 /usr/local/bin/swift2json
# RUN npm install --quiet -g git+https://github.com/shadiakiki1986/banking-swift-messages-nodejs.git # > /dev/null
ENV MONGOHOST ""
COPY entrypoint.sh .
ENTRYPOINT ["bash","entrypoint.sh"]
