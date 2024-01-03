// @packages
import * as react from 'react';
import * as redux from 'react-redux';
import React from 'react';

// @componentes
import { HomePage } from '../../pages';

describe('HomePage component tests suite', () => {
  let wrapper;
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  const useEffectSpy = jest.spyOn(react, 'useEffect');
  const useSelectorSpy = jest.spyOn(redux, 'useSelector');

  beforeAll(() => {
    useDispatchSpy.mockImplementation(jest.fn());
    useEffectSpy.mockImplementation((fn) => fn());
    useSelectorSpy.mockImplementationOnce((selectorFn) => selectorFn({ github: { repos: [] } }));

    wrapper = <HomePage />;
  });

  it('should render correctly the HomePage', () => {
    expect(wrapper).toBeDefined();
  });
});
