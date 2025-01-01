###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18 As development

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

RUN npm install --frozen-lockfile

COPY --chown=node:node .env .env
COPY --chown=node:node . .

RUN npm run prisma:generate

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18 As build

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/templates ./templates
COPY --chown=node:node --from=build /usr/src/app/.env .env

# Start the server using the production build
CMD [ "node", "dist/main.js" ]