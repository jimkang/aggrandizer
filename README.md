aggrandizer
===========

Progressively aggrandizes a title.

Installation
------------

    npm install aggrandizer

Usage
-----

    var createAggrandizer = require('aggrandizer').create;
    var aggrandizer = createAggrandizer();
    var titles = aggrandizer.aggrandize({
      baseTitle: 'Yob',
      iterations: 12
    });

    console.log(titles.map(formatTitle));

Output:

    [
      'Yob',
      'High Yob',
      'Principal Yob',
      'Supreme Yob',
      'Supreme Yob Knight',
      'Supreme Yob Lady|Lord',
      'Supreme Yob General',
      'Supreme Yob General',
      'The Great Yob General',
      'The Great Yob General',
      'The Great Yob General',
      'The Great Yob General' 
    ]

The progression is random. A title may stick for every iterations, or it may stick only for one iteration.

The generated titles are objects that look like this:

    [
      {
        "base": "Yob"
      },
      {
        "suffix": "of the North Wind",
        "base": "Yob"
      },
      {
        "suffix": "of the West Wind",
        "base": "Yob"
      },
      {
        "suffix": "of the South Wind",
        "base": "Yob"
      },
      {
        "suffix": "of the East Wind",
        "base": "Yob"
      },
      {
        "suffix": "of the East Wind",
        "base": "Yob"
      },
      {
        "prefix": "Expert",
        "suffix": "of the East Wind",
        "base": "Yob"
      },
      {
        "preprefix": "Superior",
        "prefix": "Expert",
        "suffix": "of the East Wind",
        "base": "Yob"
      },
      {
        "preprefix": "Principal",
        "prefix": "Prime",
        "suffix": "of the East Wind",
        "base": "Yob"
      },
      {
        "preprefix": "Supreme",
        "prefix": "Master",
        "suffix": "of the East Wind",
        "base": "Yob"
      },
      {
        "preprefix": "Supreme",
        "prefix": "Grandmaster",
        "suffix": "of the East Wind",
        "base": "Yob"
      },
      {
        "preprefix": "Supreme",
        "prefix": "Grandmaster",
        "suffix": "of the East Wind",
        "base": "Yob"
      }
    ]

Tests
-----

Run tests with `make test`.

License
-------

MIT.
