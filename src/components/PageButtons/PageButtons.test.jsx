import renderer from 'react-test-renderer';
import PageButtons from '.';

const createInput = function createInput(prevPage, nextPage) {
  return {
    prevPage,
    nextPage,
    selectedTrack: 't',
    selectedCohort: 'c',
    getPrevNextGrades() {},
  };
};

describe('PageButtons', () => {
  const assertPageButtonsSnapshot = function assertPageButtonsSnapshot(input) {
    const pb = renderer.create(PageButtons(input));
    const tree = pb.toJSON();
    expect(tree).toMatchSnapshot();
  };

  it('prev null, next null', () => {
    assertPageButtonsSnapshot(createInput(null, null));
  });

  it('prev null, next not null', () => {
    assertPageButtonsSnapshot(createInput(null, 'np'));
  });

  it('prev not null, next null', () => {
    assertPageButtonsSnapshot(createInput('pp', null));
  });

  it('prev not null, next not null', () => {
    assertPageButtonsSnapshot(createInput('pp', 'np'));
  });
});
