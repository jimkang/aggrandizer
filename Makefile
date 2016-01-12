test:
	node tests/aggrandizer-tests.js

pushall:
	git push origin master && npm publish
