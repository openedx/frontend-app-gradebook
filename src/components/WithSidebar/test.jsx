import React from 'react';
import { shallow } from 'enzyme';

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
        const getVal = () => el.instance().sidebarClassNames.split(' ');
        it('returns a "sidebar" classname', () => {
          expect(getVal()).toContain('sidebar');
        });
        it('includes an open className iff props.open', () => {
          expect(getVal()).not.toContain('open');
          el.setProps({ open: true });
          expect(getVal()).toContain('open');
        });
        it('includes a d-none className iff props.isClosed', () => {
          expect(getVal()).toContain('d-none');
          el.setProps({ isClosed: false });
          expect(getVal()).not.toContain('d-none');
        });
      });
      describe('contentClassNames', () => {
        const getVal = () => el.instance().contentClassNames.split(' ');
        it('includes sidebar-contents and position-relative classNames', () => {
          expect(getVal()).toContain('sidebar-contents');
          expect(getVal()).toContain('position-relative');
        });
        it('includes an opening class iff props.isOpening', () => {
          expect(getVal()).not.toContain('opening');
          el.setProps({ isOpening: true });
          expect(getVal()).toContain('opening');
        });
      });
    });
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<WithSidebar {...props} />);
        const sidebarClassNames = 'sidebar-class-names';
        const contentClassNames = 'content-class-names';
        jest.spyOn(el.instance(), 'sidebarClassNames', 'get').mockReturnValue(sidebarClassNames);
        jest.spyOn(el.instance(), 'contentClassNames', 'get').mockReturnValue(contentClassNames);
        expect(el.instance().render()).toMatchSnapshot();
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
