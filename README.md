[![Build Status](https://api.travis-ci.org/edx/gradebook.svg?branch=master)](https://travis-ci.org/edx/gradebook) [![Coveralls](https://img.shields.io/coveralls/edx/gradebook.svg?branch=master)](https://coveralls.io/github/edx/gradebook)
[![npm_version](https://img.shields.io/npm/v/@edx/gradebook.svg)](@edx/gradebook)
[![npm_downloads](https://img.shields.io/npm/dt/@edx/gradebook.svg)](@edx/gradebook)
[![license](https://img.shields.io/npm/l/@edx/gradebook.svg)](@edx/gradebook)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# gradebook

Please tag **@edx/educator-neem** on any PRs or issues.

## Introduction

The front-end of our editable Gradebook feature.

## Usage

To install gradebook into your project:
```
npm i --save @edx/gradebook
```

## Running the UI Standalone

After cloning the repository, run `make up-detached` in the `gradebook` directory - this will build and start the `gradebook` web application in a docker container.

The web application runs on port **1991**, so when you go to `http://localhost:1991` you should see the UI.

If you don't, you can see the log messages for the docker container by executing `make logs` in the `gradebook` directory.

Note that `make up-detached` executes the `npm run start` script which will hot-reload JavaScript and Sass files changes, so you should (:crossed_fingers:) not need to do anything (other than wait) when making changes.

## Configuring for local use in edx-platform

Assuming you've got the UI running at `http://localhost:1991`, you can configure the LMS in edx-platform
to point to your local gradebook from the instructor dashboard by putting this settings in `lms/env/private.py`:
```
WRITABLE_GRADEBOOK_URL = 'http://localhost:1991'
```

## Directory Structure

* `config`
  * Directory for [`webpack`](https://webpack.js.org/) configurations
* `public`
  * Entry point for the single-page application - `gradebook` has a single `index.html` file
* `src`
  * `components`
    * Directory for presentational `React` components
  * `containers`
    * Directory for container `React` components
  * `data`
    * `actions`
      * Directory for `Redux` action creators
    * `constants`
    * `reducers`
      * Directory for `Redux` reducers

## Authentication with backend API services

See the [`@edx/frontend-auth`](https://github.com/edx/frontend-auth) repo for information about securing routes in your application that require user authentication.
