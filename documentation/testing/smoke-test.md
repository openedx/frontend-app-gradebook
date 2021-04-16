# Smoke Test

Designed to be a catalog of major Gradebook locations and operations to aid in testing. This should be updated with new feature changes.

## Quickstart

Check that the items below are complete and continue to [Test Plan](#test-plan). Otherwise, followed the [Detailed Setup](#detailed-setup) below.

- [ ] Course set up with graded content
- [ ] Gradebook & feature toggle set up for course
- [ ] Course has a Master's track
- [ ] Different types of students enrolled in course (e.g. Master's, TA's)
- [ ] Gradebook started

## Test Plan

Visit a course as an instructor/staff then **Instructor** tab > **Student Admin** sub-tab > click **Show Gradebook**. Should navigate to `<root-url>:1994/{course-id}`.

Confirm the following workflows:

- [ ] Grades table results can be filtered from the "Filter" panel
    - [ ] The "Edit Filters" button renders for any course.
    - Click the "Edit Filters" button to open the "Filter" panel
    - [ ] Filter panel shows the sections: Assignments, Overall Grade, Student Groups, Include Course Team Members.
    - **Note:** Filters are cumulative and act with other applied filters.
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

- [ ] Users can be searched/filtered using the Search box
    - [ ] Search bar renders for all courses
    - [ ] Entering characters into the searchbox filters students on top of already applied filters.
    - Note: characters can appear anywhere in a name or email, even though emails are only shown for masters-track students. It doesn't appear that search actually works for student keys.

- [ ] Grades table "Score View"
    - [ ] Score View selector renders with the options: Absolute, Percent
    - [ ] Changing the Score View dropdown to Percent shows scores as percentages in the assignment columns (can be over 100%)
    - [ ] Changing the Score View dropdown to Absolute shows scores as {awarded-points}/{possible-points} values, rounded to 2 decimal points
        - [ ] For unattempted problems score shows '0'
        - [ ] for attempted problems, score always shows an {awarded-points}/{possible-points} value
    - [ ] Total Course Grade always shows scores as percentages (including 0% for unattempted)

- [ ] Grades table display
    - [ ] Grades table shows with columns: Username, Email, {numbered-assignments}, Total
    - [ ] Usernames appear in the username column
    - [ ] Student external keys (where applicable) also appear in the username column
    - [ ] Student emails appear in the email column (only for masters-track students)
    - [ ] Assignment scores show in assignment columns
    - [ ] Total Course Grade shows in the Total Course Grade column

- [ ] Grade overrides
    - [ ] Clicking on an assignment score in the Grades table opens the "Edit Grades" modal
    - [ ] Assignment name, student username, original grade, and current grade show at the top of the modal.
    - [ ] A history of grade overrides including date, grader, reason, and adjusted grade shows (if previously overridden)
    - [ ] An entry with the current time appears in the table with areas to enter adjusted grades and reasons for adjusting
    - Enter an adjusted grade (float) and reason (string)
    - [ ] Modal can be navigated away from by clicking outside the modal, clicking the 'x' button, or hitting 'Cancel'
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
    - [ ] Clicking the "Bulk Management" tab shows the Bulk Management page
    - [ ] Bulk Management history table appears with columns: Gradebook, Download Summary, Who, When
    - [ ] Previous Bulk Management imports (if applicable) appear in the table
    - Click the "Import Grades" button and select the modified CSV file.
    - [ ] Verify that the "CSV processing" banner appears.
    - Wait a few minutes for processing to complete and reload the page.
    - Navigate back to the "Bulk Management" tab.
    - [ ] Verify that a new entry appears in the results table indicating how many students were affected by the bulk grade change.
    - Click the "Download Summary" link to see the summary of changes from the bulk grade changes.
    - [ ] Verify that students are shown with modified subsections and actions: "No Action" for unchanged users, "Success" for successful overrides.

- [ ] *Masters only*: Interventions report
    - Open a non-masters-track course.
    - [ ] Verify that the "Interventions" tab does not appear.
    - [ ] Verify that the "Interventions" button does not appear.
    - Open a masters-track course.
    - [ ] Verify that the "Interventions" tab appears to the right of the "Grades" tab.
    - [ ] Verify that the "Interventions" button appears.
    - Click on the "Interventions" button to generate a CSV students and activity info.
