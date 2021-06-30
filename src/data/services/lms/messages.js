import { StrictDict } from 'utils';

export default StrictDict({
  errors: {
    missingAssignment: (
      'Gradebook LMS API requires assignment to be set to filter by min/max assig. grade'
    ),
    unhandledResponse: 'unhandled response error',
  },
});
