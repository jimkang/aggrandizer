var createModifierTrackPicker = require('./modifier-track-picker').create;
var defaultProbable = require('probable');
var _ = require('lodash');

function createAggrandizer(opts) {
  var probable;

  if (opts) {
    probable = opts.probable;
  }

  if (!probable) {
    probable = defaultProbable;
  }

  var pickRandomModifierTrack = createModifierTrackPicker(probable);

  function createTracker(track) {
    var trackIndex = -1;

    function getNext() {
      trackIndex += 1;
      return getCurrent();
    }

    function getCurrent() {
      var current;
      if (trackIndex < track.length) {
        current = track[trackIndex];
      }
      else {
        current = track[track.length - 1];
      }
      return current;
    }

    function trackIsComplete() {
      return (trackIndex >= track.length);
    }

    function getTrack() {
      return track;
    }

    return {
      getNext: getNext,
      getCurrent: getCurrent,
      trackIsComplete: trackIsComplete,
      getTrack: getTrack
    };
  }

  function createTrackSlot(opts) {
    var slotState = 'none';
    var tracker;

    function getModifier() {
      if (slotState === 'active') {
        var modifier = tracker.getNext();
        if (tracker.trackIsComplete()) {
          slotState = 'completed';
        }

        return modifier;
      }
      else if (slotState === 'frozen' || slotState === 'completed') {
        return tracker.getCurrent();
      }
      else {
        return undefined;
      }
    }

    function activate(track) {
      slotState = 'active';
      
      var howMuchToUse = Math.max(probable.rollDie(track.length), 3);
      var whereToStart = probable.roll(track.length - howMuchToUse + 1);
      var trackSample = track.slice(whereToStart, whereToStart + howMuchToUse);

      tracker = createTracker(trackSample);
    }

    function freeze() {
      slotState = 'frozen';
    }

    function thaw() {
      slotState = 'active';
    }

    function getState() {
      return slotState;
    }

    function getTracker() {
      return tracker;
    }

    return {
      getModifier: getModifier,
      activate: activate,
      freeze: freeze,
      thaw: thaw,
      getState: getState,
      getTracker: getTracker
    }
  }

  function aggrandize(opts) {
    var titles = [];

    var baseTitle = opts.baseTitle;
    var iterations = opts.iterations;

    var slots = {
      prefix: createTrackSlot(),
      preprefix: createTrackSlot(),
      suffix: createTrackSlot()
    };

    for (var i = 0; i < opts.iterations; ++i) {      
      updateSlotStates(slots, baseTitle);
      var title = {
        preprefix: slots.preprefix.getModifier(),
        prefix: slots.prefix.getModifier(),
        suffix: slots.suffix.getModifier(),
        base: baseTitle
      };
      titles.push(title);
    }

    return titles;
  }

  function updateSlotStates(slots, base) {
    var prefixState = slots.prefix.getState();
    var preprefixState = slots.preprefix.getState();
    var suffixState = slots.suffix.getState();

    // console.log('prefprefixState', preprefixState);
    // console.log('prefixState', prefixState);
    // console.log('suffixState', suffixState);
    // console.log('--------')

    var track;

    if (prefixState === 'none' && suffixState === 'none') {
      // 2/3 chance of activating something.
      if (probable.roll(3) > 0) {
        // 2/3 chance of activating the prefix slot, 1/3 suffix.
        if (probable.roll(3) > 0) {
          track = pickRandomModifierTrack('prefix', base);
          if (track) {
            slots.prefix.activate(track);
          }
        }
        else {
          track = pickRandomModifierTrack('suffix', base);
          if (track) {
            slots.suffix.activate(track);
          }
        }
      }
    }
    else if (prefixState === 'active') {
      // 1/4 chance of freezing the prefix and starting something else.
      if (probable.roll(4) === 0) {
        // 3/5 chance of activating pre-prefix, 2/5 suffix.
        if (probable.roll(5) < 3) {
          if (preprefixState === 'none') {
            track = pickRandomModifierTrack('preprefix', base);
            if (track) {
              slots.prefix.freeze();
              slots.preprefix.activate(track);
            }
          }
        }
        else {
          if (suffixState === 'none' && 
            titleIsSuffixableWithPrefixSlot(slots.prefix)) {

            track = pickRandomModifierTrack('suffix', base);
            if (track) {
              slots.prefix.freeze();
              slots.suffix.activate(track);
            }
          }
        }
      }
    }
    else if (prefixState === 'frozen' && suffixState === 'completed') {
      slots.prefix.thaw();
    }
    else if (prefixState === 'frozen' && preprefixState === 'completed') {
      slots.prefix.thaw();
    }
    else if (suffixState === 'completed' && prefixState === 'none') {
      // 1/3 chance of starting prefix.
      if (probable.roll(3) === 0) {
        slots.prefix.activate(pickRandomModifierTrack('prefix', base));
      }
    }
    else if (prefixState === 'completed' && suffixState === 'none') {
      // 1/3 chance of starting suffix.
      if (titleIsSuffixableWithPrefixSlot(slots.prefix) && 
        probable.roll(3) === 0) {

        slots.suffix.activate(pickRandomModifierTrack('suffix', base));
      }
    }
  }

  return {
    aggrandize: aggrandize,
    createTrackSlot: createTrackSlot,
    formatTitle: formatTitle
  };
}

function titleIsSuffixableWithPrefixSlot(prefixSlot) {
  return (prefixSlot.getTracker().getCurrent().indexOf('The Great') === -1)  
}

function formatTitle(genderIndex, title) {
  var words = _.compact([
    title.preprefix,
    title.prefix,
    title.base,
    title.suffix
  ]);
  var genderPicker = _.curry(pickGenderInString)(genderIndex);
  var wordsGendered =  words.map(genderPicker);
  return wordsGendered.join(' ');
}

function pickGenderInString(genderIndex, s) {
  var selection = s;
  var choices = s.split('|');
  if (genderIndex < choices.length) {
    selection = choices[genderIndex];
  }
  return selection;
}

module.exports = {
  create: createAggrandizer
};
