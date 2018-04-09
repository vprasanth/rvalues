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
    const key = home.name;
    const regionDepth = Object.keys(regions).length;
    let homes = [];
    let foundHome;
    if (regionDepth === 1) {
      const country = regions.country;
      const areas = Object.keys(this.store[country]);
      areas.forEach(area => {
        Object.keys(this.store[country][area]).forEach(city => {
          homes = Object.assign(homes, this.store[country][area][city]);
        });
      }); 
    } else if (regionDepth === 2) {
      const { country, area } = regions;
      const cities = Object.keys(this.store[country][area]);
      cities.forEach(city => {
        homes = Object.assign(homes, this.store[country][area][city]);
      });
    } else {
      const {country, area, city} = regions;
      homes = Object.assign(homes, this.store[country][area][city]);
    }

    foundHome = homes[key];
    let homesWithBetterEffiency = 0;
    let total = 0;

    Object.keys(homes).forEach(key => {
      total++;
      if(homes[key].rValue > foundHome.rValue) {
        homesWithBetterEffiency++;
      }
    });

    return {
      name: foundHome.name,
      region: home.rawRegion,
      rating: rating(homesWithBetterEffiency/total)
    }
  }
}

function rating(value) {
  value = value * 100;
  if (value >= 90 && value < 100) {
    return 1
  }
  else if (value >= 80 && value < 90) {
    return 2;
  }
  else if (value >= 70 && value < 80) {
    return 3;
  }
  else if (value >= 60 && value < 70) {
    return 4;
  }
  else if (value >= 50 && value < 60) {
    return 5;
  }
  else if (value >= 40 && value < 50) {
    return 6;
  }
  else if (value >= 30 && value < 40) {
    return 7;
  }
  else if (value >= 20 && value < 30) {
    return 8;
  }
  else if (value >= 10 && value < 20) {
    return 9;
  }
  return 10;
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
