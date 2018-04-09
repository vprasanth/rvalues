module.exports = stdinParser;

const QUERY_PATTERN = '"(.*)" "(.*)"';
const DATA_PATTERN = '"(.*)" "(.*)" (.*)';
const LOCATION_SEPARATOR = '/';

class Store {

  constructor(){
    this._store = {};
  }

  get store() {
    return this._store;
  }

  add(home) {
    const { country, area, city } = home.region;
    const key = home.name;

    if (!this._store[country]) {
      this._store[country] = {};
    };

    if (!this._store[country][area]) {
      this._store[country][area]= {};
    };

    if (!this._store[country][area][city]) {
      this._store[country][area][city] = {};
    };

    if (!this._store[country][area][city][key]) {
      this._store[country][area][city][key] = {};
    };

    this._store[country][area][city][key] = {
      name: home.name,
      rValue: home.rValue
    };
  }

  getHome(home) {
    const regions = home.region;
    const regionDepth = Object.keys(regions).length;
    const homes = [];
    if (regionDepth === 1) {
      const country = regions.country;
      const areas = Object.keys(this.store[country]);
      areas.forEach(area => {
        Object.keys(this.store[country][area]).forEach(city => {
          homes.push(this.store[country][area][city]);
        });
      }); 
    } else if (regionDepth === 2) {
      const { country, area } = regions;
      const cities = Object.keys(this.store[country][area]);
      cities.forEach(city => {
        homes.push(this.store[country][area][city]);
      });
    } else {
      const {country, area, city} = regions;
      homes.push(this.store[country][area][city]);
    }
    return homes;
  }
}

function stdinParser(stdin) {
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
    region: createRegion(m[2])
  };
}

function createEntry(input) {
  const m = input.match(DATA_PATTERN);
  if (!m) return {};
  return {
    name: m[1],
    region: createRegion(m[2]),
    rValue: parseFloat(m[3])
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
