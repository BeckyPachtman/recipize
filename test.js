const sum = require('./testFunctions');
const createUserName = require('./app.js');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});


test('create user name', () => {
  expect(createUserName( {firstName: 'jenni', lastName : 'ppp'})).toBe('jp');
});
