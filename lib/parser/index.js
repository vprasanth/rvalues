const Store = require('../store').Store;
module.exports = parser;

const QUERY_PATTERN = '"(.*)" "(.*)"';
const DATA_PATTERN = '"(.*)" "(.*)" (.*)';
const LOCATION_SEPARATOR = '/';

function parser(stdin) {
  const input = stdin ? stdin.split('\n') : [''];
  const insert = [];
  const query = [];
  const store = new Store();

  input.forEach(line => {
    if (line) {
      if (isQuery(line)) {
        query.push(createQuery(line));
      } else {
        let home = createEntry(line);
        store.add(home);
        insert.push(home);
      }
    }
  });
  return {insert, query, store};
}

function isQuery(input) {
  return (input.match(/"$/) || []).length == 1;
}

function createQuery(input) {
  const m = input.match(QUERY_PATTERN);
  if (!m) return {};
  return {
    name: m[1],
    region: createRegion(m[2]),
    rawRegion: m[2]
  };
}

function createEntry(input) {
  const m = input.match(DATA_PATTERN);
  if (!m) return {};
  return {
    name: m[1],
    region: createRegion(m[2]),
    rValue: parseFloat(m[3]),
    rawRegion: m[2]
  };
}

function createRegion(input) {
  const locationLevel = (input.match(/\//g) || []).length;

  if (!locationLevel && input) {
    return {
      country: input
    };
  } else {
    const locationChunks = input.split(LOCATION_SEPARATOR);
    switch(locationLevel) {
      case 1:
        return {
          country: locationChunks[0],
          area: locationChunks[1]
        };
      case 2:
        return {
          country: locationChunks[0],
          area: locationChunks[1],
          city: locationChunks[2]
        };
      default:
        console.log('Can not parse region 😨', input);
    }
  }
}
