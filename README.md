[![Build Status](https://api.travis-ci.com/edx/frontend-app-gradebook.svg?branch=master)](https://travis-ci.com/edx/frontend-app-gradebook)
[![Codecov](https://img.shields.io/codecov/c/gh/openedx/frontend-app-gradebook)](https://app.codecov.io/gh/openedx/frontend-app-gradebook)
[![npm_version](https://img.shields.io/npm/v/@edx/frontend-app-gradebook.svg)](@edx/frontend-app-gradebook)
[![npm_downloads](https://img.shields.io/npm/dt/@edx/frontend-app-gradebook.svg)](@edx/frontend-app-gradebook)
[![license](https://img.shields.io/npm/l/@edx/frontend-app-gradebook.svg)](@edx/frontend-app-gradebook)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Gradebook

Gradebook allows course staff to view, filter, and override subsection grades for a course. Additionally for Masters courses, Gradebook enables bulk management of subsection grades.

Jump to:

- [Should I use Gradebook in my course?](#should-i-use-gradebook-in-my-course)
- [Quickstart](#quickstart)

For existing documentation see:

- Basic Usage: [Review Learner Grades (read-the-docs)](https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/student_progress/course_grades.html#review-learner-grades-on-the-instructor-dashboard)
- Bulk Grade Management: [Override Learner Subsection Scores in Bulk (read-the-docs)](https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/student_progress/course_grades.html#override-learner-subsection-scores-in-bulk)

## Should I use Gradebook in my course?

### What does this offer over the legacy gradebook?

The micro-frontend offers a great deal more granularity when searching for problems, an easy interface for editing grades, an 
audit trail for seeing who edited what grade and what reason they gave (if any) for doing so.

UsageProblems can be filtered by student as in the traditional gradebook, but can also be filtered by scores to see who
scored within a certain range, and by assignment types (note: Not problem types, but categories like ‘Exams’ or
‘Homework’).

### What does the legacy gradebook offer that this project does not?

This project does not (yet, at least) create any graphs, which the traditional gradebook does. It also does not give
quick links to the problems for the instructor to visit. It expects the instructor to be familiar with the problems they
are grading and which unit they refer to.

The gradebook is expected to be much more performant for larger numbers of students as well. The Instructor Dashboard
link for the legacy gradebook reports that "this feature is available only to courses with a small number of enrolled 
learners." However, this project comes with no such warning.

### Who should not change to this gradebook?

Groups whose instructors need not ever manually override grades do not need this project, but may not be any worse off
depending on their needs. Instructors that expect to review grades infrequently enough that not having a direct link
to the problem in question will have a worse UX than the legacy gradebook provides. Instructors that rely on the graphs
generated by the current gradebook might find the lack of autogenerated graphs to be frustrating.

## Quickstart

### Installation

To install gradebook into your project:
```
npm i --save @edx/frontend-app-gradebook
```

## Running the UI Standalone

To install the project please refer to the [`edX Developer Stack`](https://github.com/openedx/devstack) instructions.

The web application runs on port **1994**, so when you go to `http://localhost:1994/course-v1:edX+DemoX+Demo_Course` you should see the UI (assuming you have such a Demo Course in your devstack).  Note that you always have to provide a course id to actually see a gradebook.

If you don't, you can see the log messages for the docker container by executing `make gradebook-logs` in the `devstack` directory.

Note that starting the container executes the `npm run start` script which will hot-reload JavaScript and Sass files changes, so you should (:crossed_fingers:) not need to do anything (other than wait) when making changes.

## Configuring for local use in edx-platform

Assuming you've got the UI running at `http://localhost:1994`, you can configure the LMS in edx-platform
to point to your local gradebook from the instructor dashboard by putting this setting in `lms/env/private.py`:
```
WRITABLE_GRADEBOOK_URL = 'http://localhost:1994'
```

There are also several edx-platform waffle and feature flags you'll have to enable from the Django admin:

1. Grades > Persistent grades enabled flag.  Add this flag if it doesn't exist,
check the ``enabled`` and ``enabled for all courses`` boxes.

2. Waffle > Switches.  Add the ``grades.assume_zero_grade_if_absent`` switch and make it active.

3. Waffle_utils > Waffle flag course overrides.  Activate waffle flags for courses where you want to enable Gradebook functionality:
    - Enable Gradebook by adding the ``grades.writable_gradebook`` add checking the ``enabled`` box.
    - Enable Bulk Grade Management by adding the ``grades.bulk_management`` flag and checking the ``enabled`` box.

    Alternatively, you could add these as regular waffle flags to enable the functionality for all courses.

**NOTE:** IF the above flags are not configured correctly, the gradebook may appear to work, but will return bogus
numbers for grades. If your gradebook isn't accepting your changes, or the changes aren't resulting in sane, 
recalculated grade values, verify you've set all flags correctly.

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

See the [`@edx/frontend-auth`](https://github.com/edx-unsupported/frontend-auth) repo for information about securing routes in your application that require user authentication.
