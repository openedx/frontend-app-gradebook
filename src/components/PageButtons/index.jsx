import React from 'react';
import { Button } from '@edx/paragon';


export default function PageButtons({
  prevPage, nextPage, selectedTrack, selectedCohort, getPrevNextGrades, match,
}) {
  return (
    <div
      className="d-flex justify-content-center"
      style={{ paddingBottom: '20px' }}
    >
      <Button
        label="Previous Page"
        style={{ margin: '20px' }}
        buttonType="primary"
        disabled={!prevPage}
        onClick={() => getPrevNextGrades(prevPage, selectedCohort, selectedTrack, match.params.courseId)}
      />
      <Button
        label="Next Page"
        style={{ margin: '20px' }}
        buttonType="primary"
        disabled={!nextPage}
        onClick={() => getPrevNextGrades(nextPage, selectedCohort, selectedTrack, match.params.courseId)}
      />
    </div>
  );
}

