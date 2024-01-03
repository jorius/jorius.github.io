// @utils
import { parseStringParams } from '../../utils';

describe('String utils tests suite', () => {
  it('should parse a single string param', () => {
    const input = 'some_url/{0}';
    const output = 'some_url/some_value';
    const param = 'some_value';

    expect(parseStringParams(input, param)).toEqual(output);
  });

  it('should parse multiple string param', () => {
    const input = 'some_url/{0}/{1}';
    const output = 'some_url/1/2';
    const param1 = '1';
    const param2 = '2';

    expect(parseStringParams(input, param1, param2)).toEqual(output);
  });
});
