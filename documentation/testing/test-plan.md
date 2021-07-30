# Test Plan

Designed to be a catalog of major Gradebook workflows to aid in testing. This should be kept up-to-date with new feature changes.

## Quickstart

Check that the items below are complete and continue to [Workflow Tests](#workflow-tests). Otherwise, followed the detailed setup in [test-setup.md](./test-setup.md).

- [ ] Course set up with graded content.
- [ ] Gradebook & feature toggles set up for course.
- [ ] Course has a Master's track for testing Master's-only features.
- [ ] Different types of students enrolled in course (e.g. Master's, TA's).
- [ ] Gradebook running.

## Workflow Tests

Visit a course as an instructor/staff then **Instructor** tab > **Student Admin** sub-tab > click **Show Gradebook**. Should navigate to `<root-url>:1994/{course-id}`.

Confirm the following workflows:

- [ ] Grades table results can be filtered from the "Filter" panel.
    - The "Edit Filters" button renders for all courses.
    - Click the "Edit Filters" button to open the "Filter" panel.
    - [ ] Filter panel shows the sections: Assignments, Overall Grade, Student Groups, Include Course Team Members.
    - **Note:** Filters are cumulative and act with other applied filters.
    - Assignments pane
        - [ ] Applying the "Assignment Types" filter limits the assignment columns show in the grades table to the selected assignment types.
        - [ ] Applying an "Assignment" filter shows only the selected assignment column in the grades table.
        - [ ] With an "Assignment" filter already selected, setting a "Min/Max Grade" filter shows only student rows with grades for the assignment within the filtered range.
    - Overall Grade pane
        - [ ] Applying a "Min/Max Grade" filter shows only students with Total Course Grades within the filtered range.
    - Student Groups pane
        - [ ] Applying a "Tracks" filter shows only student rows matching the selected track.
        - [ ] Applying a "Cohorts" filter shows only student rows matching the selected cohort.
    - Include Course Team Members pane
        - By default, any user with a course role (e.g. staff, beta testers, TA's) are hidden from the grades table.
        - [ ] Selecting "Include Course Team Members" shows course team members in the grades table.
        - [ ] Deselecting "Include Course Team Members" shows only students without course roles in the grades table.

- [ ] Users can be searched/filtered using the Search box.
    - The Search Box renders for all courses.
    - [ ] Entering characters into the Search Box filters students on top of already applied filters.
    - Note: characters can appear anywhere in a name or email, even though emails are only shown for masters-track students. It doesn't appear that search actually works for student keys.

- [ ] Grades table "Score View" allows selecting how scores are displayed.
    - [ ] The "Score View" selector renders with the options: Absolute, Percent.
    - [ ] Changing the "Score View" dropdown to "Percent" shows scores as percentages in the assignment columns (note that scores can be over 100%).
    - [ ] Changing the "Score View" dropdown to "Absolute" shows scores as {awarded-points}/{possible-points} values, rounded to 2 decimal points.
        - [ ] For unattempted problems score shows '0'.
        - [ ] For attempted problems, score always shows an {awarded-points}/{possible-points} value.
    - [ ] "Total Course Grade" always shows scores as percentages (including 0% for unattempted).

- [ ] Grades table displays correctly.
    - [ ] The grades table shows with columns: Username, Email, {numbered-assignments}, Total.
    - [ ] Usernames appear in the "Username" column.
    - [ ] Student external keys (where applicable) also appear in the "Username" column.
    - [ ] Student emails appear in the "Email" column only for masters-track students.
    - [ ] Assignment scores show in their respective assignment columns.
    - [ ] Total course grade shows in the "Total Course Grade" column.

- [ ] Grade overrides can be applied.
    - [ ] Clicking on an assignment score in the grades table opens the "Edit Grades" modal.
    - [ ] "Assignment name", "Student username", "Original grade", and "Current grade" display in the modal.
    - [ ] A history of grade overrides including "Date", "Grader", "Reason", and "Adjusted Grade" shows (if the subsection was previously overridden).
    - [ ] An entry with the current time appears in the table with areas to enter adjusted grades and reasons for adjusting.
    - Enter an "Adjusted Grade" and "Reason" for the override.
    - [ ] Modal can be navigated away from by clicking outside the modal, clicking the "x" button, or hitting "Cancel".
    - [ ] Clicking "Save Grade" applies the override, shows the successful "grade has been edited" banner and updates score in grades table (may take a few seconds).
    - [ ] Opening back up the "Edit Grades" modal shows the change as an entry in the override history table.

- [ ] *Master's (or selectively-enabled) only*: "Bulk Management" allows overriding grades in bulk.
    - Open a non-masters-track course.
    - [ ] Verify that the "Bulk Management" button does not appear.
    - [ ] Verify that the "Download Interventions" interface does not appear.
    - Open a masters-track course.
    - [ ] Verify that the "Bulk Management History" button appears at the right of the header.
    - [ ] Verify that the "Download Interventions" interface appears.
    - [ ] Verify that the "Download Grades" button appears.
    - [ ] Verify that the "Import Grades" button appears.
    - Click the "Download Grades" button. This downloads existing student/assignment info.
    - [ ] Open the downloaded CSV and verify that students and assignments in the file match applied filters/searches.
    - Navigate to Bulk Management History tab.
    - [ ] Clicking the "ViewBulk Management History" tab shows the Bulk Management History view.
    - [ ] The bulk management history table appears with columns: "Gradebook", "Download Summary", "Who", "When".
    - [ ] Previous bulk management imports (if applicable) appear in the table.
    - Add values in the "new_override-{subsection-short-id}" columns for student grades to be overridden and save the CSV file.
    - Navigate back to Gradebook view
    - Click the "Import Grades" button and select the modified CSV file.
    - [ ] Verify that the "CSV processing" banner appears.
    - Wait for processing to complete and reload the page. (Can take seconds to minutes depending on environment and size of the override.)
    - [ ] Verify that Import Grades Success toast appears (and disappears after 5 seconds)
    - Navigate back to the "Bulk Management History" view.
    - [ ] Verify that a new entry appears in the results table indicating how many students were affected by the bulk grade change.
    - Click the "Download Summary" link to see the summary of changes from the bulk grade changes.
    - [ ] Verify that students are shown with modified subsections and actions: "No Action" for unchanged users, "Success" for successful overrides.

- [ ] *Masters only*: Interventions report shows student activity in the course.
    - Open a non-masters-track course.
    - [ ] Verify that the "View Bulk Management History" button does not appear.
    - [ ] Verify that the "Interventions" interface does not appear.
    - [ ] Verify that the "Download Grades" and "Import Grades" buttons do not appear.
    - Open a masters-track course.
    - [ ] Verify that the "View Bulk Management History" button appears at the right of the header.
    - [ ] Verify that the "Interventions" interface appears.
    - [ ] Verify that the "Download Grades" and "Import Grades" buttons appear.
    - Click on the "Download Interventions" button to generate a CSV students and activity info.
    - Open the interventions report and verify student info and activity info appear.
