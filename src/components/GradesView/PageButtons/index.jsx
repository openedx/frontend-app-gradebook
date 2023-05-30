import React from 'react';

import { Button } from '@edx/paragon';

import usePageButtonsData from './hooks';

export const PageButtons = () => {
  const { prev, next } = usePageButtonsData();

  return (
    <div
      className="d-flex justify-content-center"
      style={{ paddingBottom: '20px' }}
    >
      <Button
        style={{ margin: '20px' }}
        variant="outline-primary"
        disabled={prev.disabled}
        onClick={prev.onClick}
      >
        {prev.text}
      </Button>
      <Button
        style={{ margin: '20px' }}
        variant="outline-primary"
        disabled={next.disabled}
        onClick={next.onClick}
      >
        {next.text}
      </Button>
    </div>
  );
};

PageButtons.propTypes = {};

export default PageButtons;
