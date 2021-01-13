const sum = require('./testFunctions');
const createUserName = require('./app.js');
const tipsHeight = require('./public/script.js')

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});


if($('.tipsInputGroup').height() > 100){
  $('.tipsInputGroup').addClass('recipeTipEditScrlbr')
}

test('check height', () => {
  expect(tipsHeight(1, 2)).toBe(3);
});



test('create user name', () => {
  expect(createUserName( {firstName: 'jenni', lastName : 'ppp'})).toBe('jp');
});
