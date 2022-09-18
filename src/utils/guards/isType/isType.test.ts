import isType from './index';

type TestObj = {
  test: 'test',
};

const testObj = {
  test: 'test',
};

describe('Object type guard check.', () => {
  it('Type check must pass.', () => {
    expect(isType<TestObj>(testObj, 'test')).toBeTruthy();
  });

  it('Type check should not pass.', () => {
    expect(isType<TestObj>(testObj, 'falsy_test')).toBeFalsy();
  });
});
