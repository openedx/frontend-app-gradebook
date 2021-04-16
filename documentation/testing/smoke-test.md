# Smoke Test

Designed to be a catalog of major Gradebook locations and operations to aid in testing. This should be updated with new feature changes.

## Quickstart

Check that the items below are complete and continue to [Test Plan](#test-plan). Otherwise, followed the [Detailed Setup](#detailed-setup) below.

- [ ] Course set up with graded content
- [ ] Gradebook & feature toggle set up for course
- [ ] Course has a Master's track
- [ ] Different types of students enrolled in course (e.g. Master's, TA's)
- [ ] Gradebook started

## Detailed Setup

### Set up a course with graded content

A course with graded content is the first prerequisite to testing. Use an existing course (e.g. the DemoX Demonstration Course in Devstack) or see [Building and Running an edX Course > Developing Your Course](https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/developing_course/index.html) for notes on how to develop a course from scratch.

Notably, the course needs a grading policy and subsections with scorable content.
After creating subsections with content,  to configure subsections for inclusion in grading.

- [ ] As a course author, set up a course with graded content in Studio (`{studio-url}/course/{course-id}`)
- [ ] Set a grading policy with Assignment Types (see [Establishing a Grading Policy For Your Course](https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/grading/index.html))
- [ ] Create a subsection with scored content (see [Adding Exercises and Tools](https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/grading/index.html))
- [ ] Set graded subsection Assignment type (see [Set the Assignment Type and Due Date for a Subsection](https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/developing_course/course_subsections.html#set-the-assignment-type-and-due-date-for-a-subsection))

### Enable Gradebook and feature toggles for course

See README.md #Quickstart for more detailed instructions.

As an admin user, visit Django Admin (`{lms-url}/admin`) to modify features.
- In Grades > Persistent Grades Enabled flag, click "Add persistent grades enabled flag"
    - [ ] Enable the flag globally or for the course and click "Save"
- In Django-Waffle > Switches, click "Add switch"
    - [ ] Set name to `grades.assume_zero_grade_if_absent`, select "Active", and click "Save"
- In Waffle_Utils > Waffle flag course overrides:
    - [ ] Add a new flag called `grades.writeable_gradebook`, select "Force On", and enable it for your course
    - [ ] Add a new flag called `grades.bulk_management`, select "Force On", and enable it for your course

### Create a Master's track for testing Master's-only features

[source](https://openedx.atlassian.net/wiki/spaces/MS/pages/1453818012/Add+a+learner+into+a+master+s+track)

Add a Master's track in your course:
- As an admin user, go to Django Admin > Course Modes and add a new course mode
- Set the Mode to "Master's"
- Set any valid price and currency values
- Click "Save"

Enroll a student in the Master's track:
- As a staff/admin user, go to `{lms-url}/support/enrollment`
- Search for the username or email of student to enroll
- In the results table row matching the user/course, click the "Change Enrollment" button
- Select the "Master's" enrollment mode and click "Submit enrollment change"

### Setup different types of students in course

To fully test features the course should have at least:
- [ ] An audit-track student
- [ ] A master's-track student
    - Enrolled in a program w/ external ID (TODO - add external ID instructions)
- [ ] A staff member
- [ ] A non-staff 

### Start Gradebook

See README.md for more detailed instructions.

## Test Plan

Visit a course as an instructor/staff then **Instructor** tab > **Student Admin** sub-tab > click **Show Gradebook**. Should navigate to `<root-url>:1994/{course-id}`

### Render tests

Simplest tests to verify that all page elements appear and navigation works.

- [ ] Page renders
- [ ] Grades Tab renders
    - [ ] Search bar renders
    - [ ] "Edit Filters" button renders
    - [ ] Score View selector (Absolute/Percent) renders
    - [ ] Grades table shows with columns: Username, Email, {numbered-assignments}, Total
    - [ ] Students appear in Grades table
    - [ ] *Masters only*: Bulk Management button appears
    - [ ] *Masters only*: Interventions button appears
- [ ] Filter panel renders
    - [ ] Clicking "Edit Filters" opens the "Filter" panel
    - [ ] Filter panel shows the sections: Assignments, Overall Grade, Student Groups, Show Staff Members
- [ ] Edit grades modal renders
    - [ ] Clicking on an assignment grade in the Grades table opens the "Edit Grades" modal
    - [ ] Assignment name, student username, original grade, and current grade show at the top
    - [ ] A history of grade overrides including date, grader, reason, and adjusted grade shows
    - [ ] An entry with the current time appears with areas to enter adjusted grades and reasons for adjusting
    - [ ] Cancel and save buttons appear
    - [ ] Modal can be navigated away from by clicking outside the modal, clicking the 'x' button, or hitting 'Cancel'
- [ ] *Masters only*: Bulk management. Should not appear for courses without a Masters track.
    - [ ] Clicking the "Bulk Management" tab shows the Bulk Management page
    - [ ] "Import Grades" button appears
    - [ ] Bulk Management history table appears with columns: Gradebook, Download Summary, Who, When
    - [ ] Previous Bulk Management imports (if applicable) appear in the table

### Functional tests

Tests to verify most functional interactions/workflows.

- [ ] Grades table results can be filtered from the "Filter" panel
    - Click the "Edit Filters" button to open the "Filter" panel
    - Filter panel shows the sections: Assignments, Overall Grade, Student Groups, Include Course Team Members. Filters are cumulative and act with other applied filters.
    - Assignments pane
        - [ ] Applying the Assignment Types filter shows only the selected assignment type
        - [ ] Applying an Assignment filter shows only the selected assignment
        - [ ] With an Assignment already selected, setting a min/max grade shows only students with grades for the assignment within the filtered range
    - Overall Grade pane
        - [ ] Applying a Min/Max Grade filter shows only students with Total Course Grades within the filtered range
    - Student Groups pane
        - [ ] Applying a Tracks filter shows only students of the matching track
        - [ ] Applying a Cohorts filter shows only students of the matching cohort
    - Include Course Team Members pane
        - Normally, any user with a course role (e.g. staff, beta testers, TA's) are hidden from the grades table.
        - [ ] Selecting "Include Course Team Members" shows course team members in the grades table.
    - Search box
        - [ ] Entering characters into the searchbox filters students on top of already applied filters. Note: characters can appear anywhere in a name or email, even though emails are only shown for masters-track students. It doesn't appear that search actually works for student keys.

- [ ] Grades table "Score View"
    - [ ] Changing the Score View dropdown to Percent shows scores as percentages in the assignment columns (can be over 100%)
    - [ ] Changing the Score View dropdown to Absolute shows scores as {awarded-points}/{possible-points} values, rounded to 2 decimal points
        - [ ] For unattempted problems score shows '0'
        - [ ] for attempted problems, score always shows an {awarded-points}/{possible-points} value
    - [ ] Total Course Grade always shows scores as percentages (including 0% for unattempted)

- [ ] Grades table display
    - [ ] Usernames appear in the username column
    - [ ] Student external keys (where applicable) also appear in the username column
    - [ ] Student emails appear in the email column (only for masters-track students)
    - [ ] Assignment scores show in assignment columns
    - [ ] Total Course Grade shows in the Total Course Grade column

- [ ] Grade overrides
    - [ ] Clicking on an assignment score in the Grades table opens the "Edit Grades" modal
    - [ ] Staff has an area to enter in adjusted grade and reason for override
    - [ ] Clicking "Save Grade" applies the override, shows the successful "grade has been edited" banner and updates score in grades table (may take a few seconds)
    - [ ] Opening back up the "Edit Grades" modal shows the change as an entry in the override history table.

- [ ] *Masters only*: Bulk management
    - Open a non-masters-track course.
    - [ ] Verify that the "Bulk Management" tab does not appear.
    - [ ] Verify that the "Bulk Management" button does not appear.
    - Open a masters-track course.
    - [ ] Verify that the "Bulk Management" tab appears to the right of the "Grades" tab.
    - [ ] Verify that the "Bulk Management" button appears.
    - Click the "Bulk Management" button. This downloads existing student/assignment info.
    - [ ] Open the downloaded CSV and verify that students and assignments in the file match applied filters/searches.
    - Add values in the "new_override-{subsection-short-id}" columns for student grades to be overridden and save the CSV file.
    - Click the "Bulk Management" tab to show the Bulk Management window.
    - Click the "Import Grades" button and select the modified CSV file.
    - [ ] Verify that the "CSV processing" banner appears.
    - Wait a few minutes for processing to complete and reload the page.
    - Navigate back to the "Bulk Management" tab.
    - [ ] Verify that a new entry appears in the results table indicating how many students were affected by the bulk grade change.
    - Click the "Download Summary" link to see the summary of changes from the bulk grade changes.
    - [ ] Verify that students are shown with modified subsections and actions: "No Action" for unchanged users, "Success" for successful overrides.

- [ ] *Masters only*: Interventions report
    - Click on the "Interventions" button to generate a CSV students and activity info.