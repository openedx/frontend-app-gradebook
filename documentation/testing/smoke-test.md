# Smoke Test

Designed to be a catalog of major Gradebook locations and operations to aid in testing 

## Prerequisites

### Quickstart

Check that the items below are complete and continue to [Test Plan](#test-plan). Otherwise, followed the [Detailed Setup](#detailed-setup) below.

- [ ] Set up a course with graded content as a course author in Studio (`{studio-url}/course/{course-id}`)
    - [ ] Set a grading policy with Assignment Types
    - [ ] Create a subsection with scored content (problems, ORAs, multiple choice, etc.)
    - [ ] Set graded subsection Assignment type

- [ ] Enable Gradebook for course as an admin user in Django Admin (`{lms-url}/admin`)
    - [ ] Django Admin > Grades > Persistet Grades Enabled flag enabled globally or for course
    - [ ] Django Admin > 
    - [ ] Django Admin > Waffle Utils > Waffle Flag Course Overrides:
        - [ ] `grades.writeable_gradebook` enabled for course
        - [ ] `grades.bulk_management` enabled for course

- [ ] Create a Master's track
    - [ ] Django Admin > Enrollment? > Tracks

- [ ] Student permutation setup
    - [ ] Enroll students in the course
    - [ ] Enroll a student in the Matsers track `{lms-url}/support/enrollment`
    - [ ] Give a student an external ID (TODO: need instructions)

- [ ] Start Gradebook

### Detailed Setup

If the checklist is incomplete, follow below for detailed setup instructions.

**Set up a course with graded content**

**Enable Gradebook for course**

See README.md for more detailed instructions.

**Create a Master's track for testing Master's-only features**

**Start Gradebook**

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
    - [ ] Clicking the "Bulk Managment" tab shows the Bulk Managment page
    - [ ] "Import Grades" button appears
    - [ ] Bulk Management history table appears with columns: Gradebook, Download Summary, Who, When
    - [ ] Previous Bulk Managment imports (if applicable) appear in the table

### Functional tests

Tests to verify most functional interactions/workflows.

- [ ] Filter panel (filters are cumulative and act with other applied filters)
    - [ ] Assignments pane
        - [ ] Applying the Assignment Types filter shows only the selected assignment type
        - [ ] Applying an Assignment filter shows only the selected assignment
        - [ ] With an Assignment already selected, setting a min/max grade shows only students with grades for the assignment within the filtered range
    -[ ] Overall Grade pane
        - [ ] Applying a Min/Max Grade filter shows only students with Total Course Grades within the filtered range
    - [ ] Student Groups pane
        - [ ] Applying a Tracks filter shows only students of the matching track
        - [ ] Applying a Cohorts filter shows only students of the matching cohort
    - [ ] Show Staff Users
        - [ ] Selecting Show Staff Users includes staff, instructor, beta-tester, and TAs in output.
    - [ ] Search
        - [ ] Entering characters into the searchbox filters students on top of already applied filters. Note: characters can appear anywhere in a name or email, even though emails are only shown for masters-track students. It doesn't appear that search actually works for student keys.

- [ ] Gradebook score view
    - [ ] Changing the Score View dropdown to Percent shows scores as percentages in the assignment columns (can be over 100%)
    - [ ] Changing the Score View dropdown to Absolute shows scores as {awarded-points}/{possible-points} values, rounded to 2 decimal points
        - [ ] For unattempted problems score shows '0'
        - [ ] for attempted problems, score always shows an {awarded-points}/{possible-points} value
    - [ ] Total Course Grade always shows scores as percentages (including 0% for unattempted)

- [ ] Gradebook table view
    - [ ] Usernames appear in the username column
    - [ ] Student external keys (where applicable) also appear in the username column
    - [ ] Student emails (where applicable) appear in the email column
    - [ ] Assignment scores show in assignment columns
    - [ ] Total Course Grade shows in the Total Course Grade column

- [ ] Grade overrides
    - [ ] Clicking on an assignment score in the Grades table opens the "Edit Grades" modal
    - [ ] Staff has an area to enter in adjusted grade and reason for override
    - [ ] Clicking "Save Grade" applies the override, shows the successful "grade has been edited" banner and updates scrore in grades table (may take a few seconds)
    - [ ] Opening back up the "Edit Grades" modal shows the change as an entry in the override history table.

- [ ] *Masters only*: Bulk management
    - Open a non-masters-track course.
    - [ ] Verify that the "Bulk Management" tab does not appear.
    - [ ] Verify that the "Bulk Managment" button does not appear.
    - Open a masters-track course.
    - [ ] Verify that the "Bulk Management" tab appears to the right of the "Grades" tab.
    - [ ] Verify that the "Bulk Managment" button appears.
    - Click the "Bulk Management" button. This downloads existing student/assigment info.
    - [ ] Open the downloaded CSV and verify that students and assignments in the file match applied filters/searches.
    - Add values in the "new_override-{subsection-short-id}" columns for student grades to be overridden and save the CSV file.
    - Click the "Bulk Management" tab to show the Bulk Managment window.
    - Click the "Import Grades" button and select the modified CSV file.
    - [ ] Verify that the "CSV processing" banner appears.
    - Wait a few minutes for processing to complete and reload the page.
    - Navigate back to the "Bulk Management" tab.
    - [ ] Verify that a new entry appears in the results table indicating how many students were affected by the bulk grade change.
    - Click the "Download Summary" link to see the summary of changes from the bulk grade changes.
    - [ ] Verify that students are shown with modified subsections and actions: "No Action" for unchanged users, "Success" for sucessful overrides.

- [ ] *Masters only*: Interventions report
    - Click on the "Interventions" button to generate a CSV students and activity info.