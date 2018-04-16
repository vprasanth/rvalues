class DataStore {

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
    const NATION_WIDE = 1;
    const AREA_WIDE = 2;
    const AREA = 0;
    const CITY = 1;

    const region = home.region;
    const key = home.name;
    const regionSearchSize = Object.keys(region).length;
    let homes = [];
    let homeToReturn;

    if (regionSearchSize === NATION_WIDE) {
      const country = region.country;
      const areas = Object.keys(this.store[country]);
      const cityAreaPairs = areas
        .reduce((acc, currentArea) => [...acc, ...Object.keys(this.store[country][currentArea]).map(city => [currentArea, city])], []);
      homes = cityAreaPairs.reduce((acc, pair) => Object.assign(acc, this.store[country][pair[AREA]][pair[CITY]]), {});
    } else if (regionSearchSize === AREA_WIDE) {
      const { country, area } = region;
      const cities = Object.keys(this.store[country][area]);
      homes = cities.reduce((acc, currentCity) => Object.assign(acc, this.store[country][area][currentCity]), {});
    } else {
      // City wide search
      const {country, area, city} = region;
      homes = Object.assign(homes, this.store[country][area][city]);
    }

    homeToReturn = homes[key];

    let total = 0;
    const betterHomesPercentage = Object.keys(homes).reduce((acc, curr) => {
      total++;
      if (homes[curr].rValue > homeToReturn.rValue) {
        return ++acc;
      } else {
        return acc;
      }
    }, 0);

    return {
      name: homeToReturn.name,
      region: home.rawRegion,
      rating: rating(betterHomesPercentage/total)
    }
  }
}

function rating(value) {
  return Math.ceil((100-(100*value))/10);
}

module.exports = { DataStore, rating };

