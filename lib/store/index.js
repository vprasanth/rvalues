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
  /**
   * This is a pretty inefficient algorithm,
   * I would have liked to improve the lookup
   * performance, either by rethinking the 
   * data structure, or sorting the data upfront,
   * unfortunately I didn't have as much time
   * as I planned over the weekend.
   */
  getHome(home) {
    const region = home.region;
    const key = home.name;
    const regionDepth = Object.keys(region).length;
    let homes = [];
    let foundHome;

    if (regionDepth === 1) {
      const country = region.country;
      const areas = Object.keys(this.store[country]);
      const cityAreaPairs = areas
        .reduce((acc, currentArea) => [...acc, ...Object.keys(this.store[country][currentArea]).map(city => [currentArea, city])], []);
      homes = cityAreaPairs.reduce((acc, pair) => Object.assign(acc, this.store[country][pair[0]][pair[1]]), {});
    } else if (regionDepth === 2) {
      const { country, area } = region;
      const cities = Object.keys(this.store[country][area]);
      homes = cities.reduce((acc, currentCity) => Object.assign(acc, this.store[country][area][currentCity]), {});
    } else {
      const {country, area, city} = region;
      homes = Object.assign(homes, this.store[country][area][city]);
    }

    foundHome = homes[key];

    let total = 0;
    const betterHomesPercentage = Object.keys(homes).reduce((acc, curr) => {
      total++;
      if (homes[curr].rValue > foundHome.rValue) {
        return ++acc;
      } else {
        return acc;
      }
    }, 0);

    return {
      name: foundHome.name,
      region: home.rawRegion,
      rating: rating(betterHomesPercentage/total)
    }
  }
}

function rating(value) {
  return Math.ceil((100-(100*value))/10);
}

module.exports = { Store, rating };

