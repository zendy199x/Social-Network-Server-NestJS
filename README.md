<h1 align="center">Social Network Server</h1>

Project uses [NestJS](https://nestjs.com/) and [Typeorm](https://typeorm.io/).

# Scenario

You are making the RESTful API for next social network application!
To kick things off, your product owner has asked you to begin working on features to allow users to follow other users. Sounds simple, right?

# User stories

0. As a user, I can register a new account with email, username, password.
1. As a registered user, I can login with username / email & password.
2. As a forgetful user, I want to be able to request a password reset email.
3. As a user, I should receive an email with a secure link to reset my password.
4. As a logged-in user, I want to be able to view and update my user profile information.
5. As a logged-in user, I want to be able to log out of my account.
6. As a logged-in user, I can follow/unfollow another user.
7. As a logged-in user, I can view my following.
8. As a logged-in user, I can view my followers.
9. As a logged-in user, I can view my new followers in current month.
10. As a logged-in user, I can view top 10 users with most followers.

**What Does Following and Followers Mean?**
  - Following refers to the list of users that you follow.
  - Followers are the users that follow you.

# Requiremens

1. Design database:
  - Use PostgreSQL
  - Use UUID for ID generator
  - Good definition for association, foreign key, constraint, index, ...
2. Write RESTful API to implement above requirement
3. Must have unit tests for your code


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
