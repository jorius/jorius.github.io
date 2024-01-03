/* eslint-disable import/no-extraneous-dependencies */

import '@testing-library/jest-dom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
