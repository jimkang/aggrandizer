var jsonfile = require('jsonfile');

var trackChoices = jsonfile.readFileSync(__dirname + '/data/trackchoices.json');

var primaryPrefixProbs = {
  masterTrackPrefixes: 4,
  spacePrefixes: 1,
  tempermentPrefixes: 1
};

var suffixProbs = {
  nobleSuffixes: 5,
  windSuffixes: 2,
  seasonSuffixes: 2,
  landscapeSuffixes: 2,
  beastSuffixes: 2,
  sunsetSuffixes: 2,
  suitSuffixes: 2,
  cardinalVirtueSuffixes: 2,
  foundationsOfMindfulnessSuffixes: 1,
  rightExertionsSuffixes: 1,
  arupajhanaSuffixes: 1,
  divineAbidingsSuffixes: 1,
  fourHorsemenSuffixes: 1
};

function resolveTrackChoices(probable) {
  var tracks = {};
  for (var trackKind in trackChoices) {
    var choiceSets = trackChoices[trackKind];  
    tracks[trackKind] = choiceSets.map(probable.pickFromArray);
  }
  return tracks;
}


function createModifierTrackPicker(probable) {
  var tracks = resolveTrackChoices(probable);

  var trackComboTables = {
    suffix: probable.createRangeTableFromDict(suffixProbs)
  };

  if (probable.roll(5) < 3) {
    // Arch prefixes, no pre-prefixes.
    trackComboTables.prefix = probable.createRangeTableFromDict({
      archPrefixes: 1
    });
  }
  else {
    // Primary-only prefixes and arch preprefixes.
    trackComboTables.prefix = probable.createRangeTableFromDict(primaryPrefixProbs);

    trackComboTables.preprefix = probable.createRangeTableFromDict({
      archPrefixes: 1
    });
  }

  function pickRandomModifierTrack(modifierKind, base) {
    var track;
    var trackComboTable = trackComboTables[modifierKind];
    if (trackComboTable) {
      var trackName = trackComboTable.roll();
      track = tracks[trackName];
    }

    var lowerCaseBase = base.toLowerCase();

    function doesNotContainBase(modifier) {
      return modifier.toLowerCase().indexOf(lowerCaseBase) === -1;
    }

    if (track) {
      track = track.filter(doesNotContainBase);
    }
    return track;
  }

  return pickRandomModifierTrack;
}

module.exports = {
  create: createModifierTrackPicker
};
