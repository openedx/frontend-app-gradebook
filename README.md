[![Build Status](https://api.travis-ci.org/edx/frontend-app-gradebook.svg?branch=master)](https://travis-ci.org/edx/frontend-app-gradebook) [![Coveralls](https://img.shields.io/coveralls/edx/frontend-app-gradebook.svg?branch=master)](https://coveralls.io/github/edx/frontend-app-gradebook)
[![npm_version](https://img.shields.io/npm/v/@edx/frontend-app-gradebook.svg)](@edx/frontend-app-gradebook)
[![npm_downloads](https://img.shields.io/npm/dt/@edx/frontend-app-gradebook.svg)](@edx/frontend-app-gradebook)
[![license](https://img.shields.io/npm/l/@edx/frontend-app-gradebook.svg)](@edx/frontend-app-gradebook)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# gradebook

Please tag **@edx/educator-neem** on any PRs or issues.

## Introduction

The front-end of our editable Gradebook feature.

## Usage

To install gradebook into your project:
```
npm i --save @edx/frontend-app-gradebook
```

## Running the UI Standalone

To install the project please refer to the [`edX Developer Stack`](https://github.com/edx/devstack) instructions.

The web application runs on port **1994**, so when you go to `http://localhost:1994/course-v1:edX+DemoX+Demo_Course` you should see the UI (assuming you have such a Demo Course in your devstack).  Note that you always have to provide a course id to actually see a gradebook.

If you don't, you can see the log messages for the docker container by executing `make gradebook-logs` in the `devstack` directory.

Note that starting the container executes the `npm run start` script which will hot-reload JavaScript and Sass files changes, so you should (:crossed_fingers:) not need to do anything (other than wait) when making changes.

## Configuring for local use in edx-platform

Assuming you've got the UI running at `http://localhost:1994`, you can configure the LMS in edx-platform
to point to your local gradebook from the instructor dashboard by putting this settings in `lms/env/private.py`:
```
WRITABLE_GRADEBOOK_URL = 'http://localhost:1994'
```

There are also several edx-platform waffle and feature flags you'll have to enable from the Django admin:

1. Grades > Persistent grades enabled flag.  Add this flag if it doesn't exist,
check the ``enabled`` and ``enabled for all courses`` boxes.

2. Waffle > Switches.  Add the ``grades.assume_zero_grade_if_absent`` switch and make it active.

3. Waffle_utils > Waffle flag course overrides.  You want to activate this flag for any course
in which you'd like to enable the gradebook.  Add a course override flag using a course id and the flag name
``grades.writable_gradebook``.  Make sure to check the ``enabled`` box.  Alternatively, you could add this as a
regular waffle flag to enable the gradebook for all courses.

## Running tests

1. Assuming that you're operating in the context of the edX devstack,
run `gradebook-shell` from your devstack directory.  This will start a bash shell inside your
running gradebook container.
2. Run `make test` (which executes `npm run test`).  This will run all of the gradebook tests.

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
