var test = require('tape');
var createAggrandizer = require('../index').create;
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

test('No redundancy', function redundancy(t) {
  t.plan(36);

  var aggrandizer = createAggrandizer({
    probable: createProbable({
      random: seedrandom('Lady')
    })
  });

  var titles = aggrandizer.aggrandize({
    baseTitle: 'Lady',
    iterations: 12
  });

  function checkTitleForRedundancy(title) {
    var base = title.base.toLowerCase();
    t.ok(
      !title.preprefix || title.preprefix.toLowerCase().indexOf(base) === -1,
      'Preprefix ' + title.preprefix + ' is not redundant.'
    );
    t.ok(
      !title.prefix || title.prefix.toLowerCase().indexOf(base) === -1,
      'Prefix ' + title.prefix + ' is not redundant.'
    );
    t.ok(
      !title.suffix || title.suffix.toLowerCase().indexOf(base) === -1,
      'Suffix ' + title.suffix + ' is not redundant.'
    );
  }
  titles.forEach(checkTitleForRedundancy);
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

  console.log(titles.map(aggrandizer.formatTitle));
  t.equal(titles.length, 12, 'Generates the right number of titles.');
});
