<h1 align="center">Social Network Server</h1>

Project uses [NestJS](https://nestjs.com/) and [Typeorm](https://typeorm.io/).

## 📦 General Information

```bash
- Node version: v18.8.0
- NestJS version: v10.0.0
- Typeorm version: v0.3.17
- Typescript version: v5.1.3
```

## 📦 Docker Container

```bash
# Create or run docker container
$ docker-compose up
```

## 📦 Migration

```bash
Run migration

# Use npm
$ npm run migrate:up

-----------------or-----------------

# Use yarn
$ yarn migrate:up
```

## 📦 Install & Run

```bash
$ git clone git@gitlab.com:techleadgo/crewcall-api.git
$ cd crewcall-api

# Use npm
Install package
$ npm install

Run
$ npm run start:dev

Start stripe webhook listener
$ npm run stripe:listen

-----------------or-----------------

# Use yarn
Install package
$ yarn install
Run
$ yarn start:dev
Start stripe webhook listener
$ yarn stripe:listen
```

## 🔨 Build

```bash
# Use npm
$ npm install
$ npm run build

# Use yarn
$ yarn install
$ yarn build
```

For project initialization, create environment-specific files such as `development.env`, `staging.env`, or `production.env` in `src/config/environments`. Please adhere to the format outlined in the `sample.env` file.

## Design Database
- [Database ERM](https://drive.google.com/drive/folders/100W6EBI5LtzHs69LuX6HdjzA7v5CpcHl?usp=drive_link)
