const createUserName = require('./app.js');

test('create user name', () => {
  expect(createUserName({firstName: 'Jenni', lastName : 'Ppp'})).toBe('JP');
});
