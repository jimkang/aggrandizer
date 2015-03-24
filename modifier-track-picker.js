var trackChoices = {
  primaryOnlyPrefixes: [
    ['Expert', 'Senior', 'Professional'],
    ['Chief', 'Prime'],
    ['Master', 'Champion'],
    ['Grandmaster', 'Head']
  ],
  archPrefixes: [
    ['High', 'Superior'],
    ['Arch', 'Grand', 'Principal'],
    ['The Great', 'The Number One']
  ],
  nobleSuffixes: [
    ['Knight', 'Captain', 'Ascendant'],
    ['Lady|Lord', 'Commander', 'General'],
    ['Supreme', 'Director-General', 'Overlady|Overlord'],
    ['Goddess|God', 'Potentate']
  ],
  windSuffixes: [
    ['of the North Wind'],
    ['of the West Wind'],
    ['of the South Wind'],
    ['of the East Wind']
  ],
  seasonSuffixes: [
    ['of Summer'],
    ['of Autumn', 'of Fall'],
    ['of Winter'],
    ['of Spring'],
    ['of Flowers']
  ],
  landscapeSuffixes: [
    ['of the Earth', 'of the Sky', 'of the Heavens'],
    ['of the Sea'],
    ['of the Stars']
  ],
  beastSuffixes: [
    ['of Dragons', 'of Snakes', 'of the Phoenix', 'of Wolves'],
    ['of Whales', 'of Eagles', 'of Crows', 'of Owls'],
    ['of Narwhals', 'of Unicorns', 'of Ravens', 'of the Lammergeier']
  ],
  sunsetSuffixes: [
    ['of the Dawn'],
    ['of the Dusk'],
    ['of the Twilight']
  ],
  suitSuffixes: [
    ['of Clubs'],
    ['of Diamonds'],
    ['of Hearts'],
    ['of Spades']
  ],
  cardinalVirtueSuffixes: [
    ['of Justice'],
    ['of Prudence'],
    ['of Fortitude'],
    ['of Temperance']
  ]
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
    suffix: probable.createRangeTableFromDict({
      nobleSuffixes: 4,
      windSuffixes: 2,
      seasonSuffixes: 2,
      landscapeSuffixes: 2,
      beastSuffixes: 1,
      sunsetSuffixes: 1,
      suitSuffixes: 1,
      cardinalVirtueSuffixes: 1
    })
  };

  if (probable.roll(5) < 3) {
    // Arch prefixes, no pre-prefixes.
    trackComboTables.prefix = probable.createRangeTableFromDict({
      archPrefixes: 1
    });
  }
  else {
    // primaryOnly prefixes and arch preprefixes.
    trackComboTables.prefix = probable.createRangeTableFromDict({
      primaryOnlyPrefixes: 1
    });

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
