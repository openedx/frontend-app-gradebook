import React from 'react';
import { shallow } from 'enzyme';

import { Icon, StatefulButton } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import { NetworkButton, mapStateToProps, buttonStates } from '.';

jest.mock('@edx/frontend-platform/i18n', () => ({
  FormattedMessage: () => 'FormattedMessage',
}));
jest.mock('@edx/paragon', () => ({
  Icon: () => 'Icon',
  StatefulButton: () => 'StatefulButton',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: { shouldShowSpinner: (state) => ({ shouldShowSpinner: state }) },
  },
}));

describe('NetworkButton component', () => {
  describe('snapshots', () => {
    let el;
    let btnProps;
    const props = {
      className: 'test-class',
      label: {
        id: 'label-id',
        defaultMessage: 'test button label',
        description: 'test button label description',
        showSpinner: false,
      },
    };
    beforeEach(() => {
      props.onClick = jest.fn();
      el = shallow(<NetworkButton {...props} />);
      btnProps = el.find(StatefulButton).props();
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    it('sets labels to translated label prop', () => {
      expect(btnProps.labels).toEqual({
        default: (<FormattedMessage {...props.label} />),
        pending: (<FormattedMessage {...props.label} />),
      });
    });
    describe('export icons', () => {
      it('sets icons with spinner pending icon and download default', () => {
        expect(btnProps.icons).toEqual({
          pending: (<Icon className="fa mr-2 fa-spinner fa-spin" />),
          default: (<Icon className="fa mr-2 fa-download" />),
        });
      });
    });
    describe('import icons', () => {
      it('sets icons with spinner pending icon and upload default', () => {
        el.setProps({ import: true });
        expect(el.find(StatefulButton).props().icons).toEqual({
          pending: (<Icon className="fa mr-2 fa-spinner fa-spin" />),
          default: (<Icon className="fa mr-2 fa-upload" />),
        });
      });
    });
    describe('buttonState', () => {
      it('is set to pending state if props.showSpinner', () => {
        expect(btnProps.state).toEqual(buttonStates.default);
      });
      it('is set to pending state if props.showSpinner', () => {
        el.setProps({ showSpinner: true });
        expect(el.find(StatefulButton).props().state).toEqual(buttonStates.pending);
        expect(btnProps.state).toEqual(buttonStates.default);
      });
    });
  });
  describe('mapStateToProps', () => {
    const testState = { a: 'wrinkle', in: 'time' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('showSpinner from root shouldShowSpinner selector', () => {
      expect(mapped.showSpinner).toEqual(selectors.root.shouldShowSpinner(testState));
    });
  });
});
