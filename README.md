# CineMatch - Backend - TMDB

CineMatch is an advanced movie search and recommendation platform built using React.js (frontend) and NestJS (backend), integrating AI-powered search to enhance user experience.  Users can explore trending movies, search by keywords or AI queries, and manage their watchlist, favorites, and ratings.

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)

## About

Final project

Advanced Web Programming

### Tech Stack
- Front-end: Reactjs, Material UI, react-router, react-hook-form
- Back-end: Nestjs, Prisma, MongoDB, Passportjs

## Deployment

Front-end: https://movie-review-fe-rose.vercel.app/

Back-end: https://movie-review-be-hhs7.onrender.com/docs

## Installation

```
git clone https://github.com/nxhawk/movie-review-be.git
cd movie-review-be
```

## Usage

```
npm install
npm run prisma:generate
npm run start:dev
```

Then create a `.env` file

```sh
cp .env.example .env
```

Then goto http://localhost:3001/docs

## Features

### Authentication Flow
- Sign Up
- Sign In with email and password
- Sign In with Google
- Sign In with Facebook
- Account activation by email
- Verify access token
- Refresh token
- Sign out
- Managing sign-in and sign-out UI states for users
- Restrict feature access based on the user’s role
- Use a popular authentication library
- Forgot password and renew password by email

### Home page
- Search panel
- Trending movies by today, this week
- Latest trailers
- Popular movies
- Overall information: header, footer, ...

###  Simple Search
- Search results
- Filtering
- LLM search

### AI search
-  LLM movie search: For example, when asked "Sea adventure animation movies," the website would list movies that match the request.
- AI navigation:  For example, when asked "Casts of Moana," the website would redirect to the cast listing for the Moana movie.

### Movie details
- Quick information about the movie
- Rating
- Mark as favorite
- Add to watch list
- Casts
- Reviews
- Recommendations
  - Similar movie recommendations based on user history or genres of current selection
  -  Similar movies based on vectors search with reasoned match:  Movies are recommended based on vector search, which analyzes similarities in themes, genres, and other features to provide a reasoned match.

### Cast details
- Quick info
- Acting list

### User profile
- Watchlist
- Favorite list
- Rating list

### Bonus
- Dockerize (development, production)
- CI/CD
- Speech to text
- Reponsive

## Contributing

This project was created and is actively maintained by:

- [21120447 Nguyễn Nhật Hào](https://github.com/nxhawk)
- [21120453 Tô Phương Hiếu](https://github.com/phuonghieuto)