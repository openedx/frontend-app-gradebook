import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import {
  WithSidebar,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      filterMenu: {
        isClosed: jest.fn(state => ({ isClosed: state })),
        isOpening: jest.fn(state => ({ isOpening: state })),
        open: jest.fn(state => ({ open: state })),
      },
    },
  },
}));
jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    app: {
      filterMenu: {
        handleTransitionEnd: jest.fn().mockName('handleTransitionEnd'),
      },
    },
  },
}));

describe('WithSidebar', () => {
  let props = {
    sidebar: (<div>Some Sidebar Content</div>),
    children: (<b>aby in a bi</b>),
    isClosed: true,
    isOpening: false,
    open: false,
  };

  beforeEach(() => {
    props = {
      ...props,
      handleSlideDone: jest.fn().mockName('handleSlideDone'),
    };
  });

  describe('Component', () => {
    describe('behavior', () => {
      let el;
      beforeEach(() => {
        el = shallow(<WithSidebar {...props} />);
      });
      describe('sidebarClassNames', () => {
        const getVal = () => [
          ...el.instance.props.className.split(' '),
          ...el.instance.children[0].props.className.split(' '),
          ...el.instance.children[1].props.className.split(' '),
        ];
        it('returns a "sidebar" classname', () => {
          expect(getVal()).toContain('sidebar');
        });
        it('includes an open className iff props.open', () => {
          expect(getVal()).not.toContain('open');
          el = shallow(<WithSidebar {...props} open />);
          expect(getVal()).toContain('open');
        });
        it('includes a d-none className iff props.isClosed', () => {
          expect(getVal()).toContain('d-none');
          el = shallow(<WithSidebar {...props} isClosed={false} />);
          expect(getVal()).not.toContain('d-none');
        });
      });
      describe('contentClassNames', () => {
        const getVal = () => el.instance.children[1].props.className.split(' ');
        it('includes sidebar-contents and position-relative classNames', () => {
          expect(getVal()).toContain('sidebar-contents');
          expect(getVal()).toContain('position-relative');
        });
        it('includes an opening class iff props.isOpening', () => {
          expect(getVal()).not.toContain('opening');
          el = shallow(<WithSidebar {...props} isOpening />);
          expect(getVal()).toContain('opening');
        });
      });
    });
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<WithSidebar {...props} />);
        expect(el.snapshot).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    const testState = { A: 'laska' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('open from app.filterMenu.open', () => {
      expect(mapped.open).toEqual(selectors.app.filterMenu.open(testState));
    });
    test('isClosed from app.filterMenu.isClosed', () => {
      expect(mapped.isClosed).toEqual(selectors.app.filterMenu.isClosed(testState));
    });
    test('open from app.filterMenu.isOpening', () => {
      expect(mapped.isOpening).toEqual(selectors.app.filterMenu.isOpening(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    describe('handleSlideDone', () => {
      test('from thunkActions.app.filterMenu.handleTransitionEnd', () => {
        expect(mapDispatchToProps.handleSlideDone).toEqual(
          thunkActions.app.filterMenu.handleTransitionEnd,
        );
      });
    });
  });
});
