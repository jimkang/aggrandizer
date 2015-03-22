var test = require('tape');
var createAggrandizer = require('../index').create;
var _ = require('lodash');
var seedrandom = require('seedrandom');
var createProbable = require('probable').createProbable;

test('Track slot', function trackSlot(t) {
  t.plan(9);

  var aggrandizer = createAggrandizer({
    probable: {
      rollDie: function mockRollDie(sides) {
        return sides - 1;
      },
      roll: function mockRoll(sides) {
        return sides - 1;
      },
      createRangeTableFromDict: function noOp() {},
      pickFromArray: function mockPickFromArray(array) {
        return array[0];
      }
    }
  });

  var slot = aggrandizer.createTrackSlot();

  t.equal(
    slot.getModifier(), undefined, 'Slot returns no modifier if not activated.'
  );

  slot.activate(['good', 'better', 'best', 'bestest']);

  t.equal(
    slot.getModifier(),
    'better',
    'Slot returns second in track because it "andomly decides to start there.'
  );


  t.equal(
    slot.getModifier(),
    'best',
    'Slot returns third in track.'
  );

  slot.freeze();

  t.equal(
    slot.getModifier(),
    'best',
    'Slot returns third in track again because the slot is frozen.'
  );


  t.equal(
    slot.getModifier(),
    'best',
    'Slot returns third in track again because the slot is frozen.'
  );

  slot.thaw();

  t.equal(
    slot.getModifier(),
    'bestest',
    'Slot moves on, returns last in track because the slot is now thawed.'
  );

  t.equal(
    slot.getModifier(),
    'bestest',
    'Slot keeps returning last in track because the track is completed.'
  );

  t.equal(slot.getState(), 'completed', 'State is "completed".');

  t.equal(
    slot.getModifier(),
    'bestest',
    'Slot keeps returning last in track because the track is completed.'
  );
});

test('Integration test', function runIt(t) {
  t.plan(1);

  var aggrandizer = createAggrandizer({
    probable: createProbable({
      random: seedrandom(new Date().toISOString())
    })
  });

  var titles = aggrandizer.aggrandize({
    baseTitle: 'Yob',
    iterations: 12
  });

  console.log(titles.map(formatTitle));
  t.equal(titles.length, 12, 'Generates the right number of titles.');
});

function formatTitle(title) {
  var s = '';
  var words = _.compact([title.preprefix, title.prefix, title.base, title.suffix]);
  return words.join(' ');
}
