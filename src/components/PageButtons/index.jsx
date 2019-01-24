import React from 'react';
import PropTypes from 'prop-types';
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
        buttonType="outline-primary"
        disabled={!prevPage}
        onClick={() =>
          getPrevNextGrades(
            prevPage,
            selectedCohort,
            selectedTrack,
            match.params.courseId,
          )}
      />
      <Button
        label="Next Page"
        style={{ margin: '20px' }}
        buttonType="outline-primary"
        disabled={!nextPage}
        onClick={() =>
          getPrevNextGrades(
            nextPage,
            selectedCohort,
            selectedTrack,
            match.params.courseId,
          )}
      />
    </div>
  );
}

PageButtons.defaultProps = {
  match: {
    params: {
      courseId: '',
    },
  },
  nextPage: '',
  prevPage: '',
  selectedCohort: null,
  selectedTrack: null,
};

PageButtons.propTypes = {
  getPrevNextGrades: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string,
    }),
  }),
  nextPage: PropTypes.string,
  prevPage: PropTypes.string,
  selectedCohort: PropTypes.shape({
    name: PropTypes.string,
  }),
  selectedTrack: PropTypes.shape({
    name: PropTypes.string,
  }),
};

