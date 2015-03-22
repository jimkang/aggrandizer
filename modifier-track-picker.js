var trackChoices = {
  primaryOnlyPrefixes: [
    ['Expert', 'Senior', 'Professional', 'Guru'],
    ['Chief', 'Prime'],
    ['Master', 'Champion', "Head"],
    ['Grandmaster']
  ],
  archPrefixes: [
    ['High', 'Superior'],
    ['Arch', 'Grand', 'Principal'],
    ['Supreme'],
    ['The Great']
  ],
  nobleSuffixes: [
    ['Knight', 'Captain'],
    ['Lady|Lord'],
    ['General', 'Commander', 'Director-General', 'Overlady|Overlord'],
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
    ['of Autumn'],
    ['of Winter'],
    ['of Spring'],
    ['of Flowers']
  ],
  landscapeSuffixes: [
    ['of the Earth', 'of the Sky'],
    ['of the Sea'],
    ['of the Stars']
  ],
  beastSuffixes: [
    ['of Dragons', 'of Snakes'],
    ['of Whales', 'of Eagles'],
    ['of Narwhals', 'of Unicorns']
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
      nobleSuffixes: 10,
      windSuffixes: 3,
      seasonSuffixes: 2,
      landscapeSuffixes: 2,
      beastSuffixes: 1
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

  function pickRandomModifierTrack(modifierKind) {
    var track;
    var trackComboTable = trackComboTables[modifierKind];
    if (trackComboTable) {
      var trackName = trackComboTable.roll();
      track = tracks[trackName];
    }
    return track;
  }

  return pickRandomModifierTrack;
}

module.exports = {
  create: createModifierTrackPicker
};
