# Start with base node image
FROM node:carbon

# Set environment properties
ENV DIRPATH services
ENV SERVICE web
ENV PORT 9001
WORKDIR $DIRPATH

# Add package.json and config.js from parent
ADD $DIRPATH/package.json package.json
ADD $DIRPATH/config.js config.js

# Build the project
RUN npm install

# Add the project
ADD $DIRPATH/$SERVICE $SERVICE
ADD ui/build $SERVICE/static
ADD ui/src/images $SERVICE/images

HEALTHCHECK CMD bash timeout 2 bash -c "</dev/tcp/localhost/$PORT"; echo $?

EXPOSE $PORT
CMD ["node","web/index.js"]
