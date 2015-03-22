var createAggrandizer = require('../index').create;
var _ = require('lodash');
var seedrandom = require('seedrandom');
var createProbable = require('probable').createProbable;

if (process.argv.length < 3) {
  console.log('Usage: node aggrandize.js <base title>');
  process.exit();
}

var baseTitle = process.argv[2];

var aggrandizer = createAggrandizer({
  probable: createProbable({
    random: seedrandom(baseTitle)
  })
});

var titles = aggrandizer.aggrandize({
  baseTitle: baseTitle,
  iterations: 12
});

console.log(titles.map(formatTitle));

function formatTitle(title) {
  var s = '';
  var words = _.compact([title.preprefix, title.prefix, title.base, title.suffix]);
  return words.join(' ');
}
