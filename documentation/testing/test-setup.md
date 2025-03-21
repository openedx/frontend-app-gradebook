# Test Setup

Instructions for setting up environments and data for testing Gradebook.

## Set up a course with graded content

A course with graded content is the first prerequisite to testing. Use an existing course (e.g. the DemoX Demonstration Course in Devstack) or see [Building and Running an edX Course > Developing Your Course](https://docs.openedx.org/en/latest/educators/quickstarts/build_a_course.html) for notes on how to develop a course from scratch.

Notably, the course needs a grading policy and subsections with scoreable content.
After creating subsections with content, they need to be configured with an "Assignment Type" to be included in grading.

Suggested resources:
- [Establishing a Grading Policy For Your Course](https://docs.openedx.org/en/latest/educators/how-tos/data/manage_learner_grades.html#review-how-grading-is-configured-for-your-course)
- [Adding Exercises and Tools](https://docs.openedx.org/en/latest/educators/concepts/exercise_tools/about_problems_exercises_tools.html)
- [Set the Assignment Type and Due Date for a Subsection](https://docs.openedx.org/en/latest/educators/how-tos/course_development/set_subsection_problem_date.html#set-the-assignment-type-and-due-date-for-a-subsection)

## Enable Gradebook for course

See README.md #Quickstart for more detailed instructions.

As an admin user, visit Django Admin (`{lms-url}/admin`) to modify features.
- In Grades > Persistent Grades Enabled flag, click "Add persistent grades enabled flag"
    - [ ] Enable the flag globally or for the course and click "Save"
- In Django-Waffle > Switches, click "Add switch"
    - [ ] Set name to `grades.assume_zero_grade_if_absent`, select "Active", and click "Save"
- In Waffle_Utils > Waffle flag course overrides:
    - [ ] Add a new flag called `grades.writeable_gradebook`, select "Force On", and enable it for your course

## Enable Bulk Management

Bulk Management is an added feature to allow modifying grades in bulk via CSV upload. Bulk Management is default enabled for Master's track courses but can be selectively enabled for other courses with a waffle flag following the steps below.

- In Waffle_Utils > Waffle flag course overrides:
    - [ ] Add a new flag called `grades.bulk_management`, select "Force On", and enable it for your course.

## Create a Master's track for testing Master's-only features

[source - note: possibly outdated, edx.org-specific](https://openedx.atlassian.net/wiki/spaces/MS/pages/1453818012/Add+a+learner+into+a+master+s+track)

Add a Master's track in your course:
- As an admin user, go to Django Admin (`{lms-url}/admin`) > Course Modes and add a new course mode
- Set the Mode to "Master's"
- Set any valid price and currency values
- Click "Save"

Enroll a student in the Master's track:
- As a staff/admin user, go to `{lms-url}/support/enrollment`
- Search for the username or email of student to enroll
- In the results table row matching the user/course, click the "Change Enrollment" button
- Select the "Master's" enrollment mode and click "Submit enrollment change"

## Setup different types of students in course

To fully test features the course should have at least:
- [ ] An audit-track student
- [ ] A master's-track student
- [ ] A staff member
- [ ] A non-staff user
