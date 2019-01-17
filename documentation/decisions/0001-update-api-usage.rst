Usage of the bulk-update API
============================

Context
=======

The LMS Grades API exposes a set of Gradebook-related endpoints:
https://github.com/edx/edx-platform/blob/master/lms/djangoapps/grades/api/v1/gradebook_views.py
The ``bulk-update`` endpoint defined therein allows for the creation/modification of subsection
grades for multiple users and sections in a single request.  This allows clients of the API to limit
the number of network requests made and to more easily manage client-side data.  Moreover,
the course grade updates that occur during calls to this API are synchronous - the entire update operation
is completed before a response is given to the client.

For decisions made about the implementation of this API, see:
https://github.com/edx/edx-platform/blob/master/lms/djangoapps/grades/docs/decisions/0001-gradebook-api.rst

Decision
========

The Gradebook front-end will post data about a single subsection and user in a single request
to the ``bulk-update`` API.  That is, we currently need only the "update" aspect of this
endpoint, and not the "bulk" aspect, for satisfying the requirements of the current UX.

Status
======

Accepted (circa December 2018)

Consequences
============

This is a scenario in which the implementation of the API is coupled to the
UX that depends on the API.  Because the course grade update is synchronous, it means
the API response can contain the updated subsection and course grade data.  Because
a response from the API contains this data, the UI can operate in a very familiar way:

- A user clicks a button to submit a request with grade update data to the update endpoint.
- On the server, the subsection and course grades are modified.
- In the meantime, the client-side user looks at a spinner.
- A response is returned with updated data and the spinner goes away.
- Updated data is displayed to the user, along with a message indicative of the update.

If the update becomes asynchronous, the user experience outlined above has to change.
Because a single call to this endpoint updates grades data for only a single user,
the endpoint does not necessarily have to utilize an asynchronous operation at this time.
