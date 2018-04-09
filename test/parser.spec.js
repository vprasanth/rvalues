const expect = require('chai').expect;
const parser = require('../lib/parser');
const fs = require('fs');
const path = require('path');
const sample = fs.readFileSync(path.join(__dirname, 'sample-input'), {encoding: 'utf-8'});

describe('Parser', () => {

  it('should be a function', () => {
    expect(parser).to.be.a('function');
  });

  it('should not throw if empty string passed in', () => {
    expect(parser('')).to.be.a('object');
  });

  it('should process sample data and get correct values', () => {
    const a = [{ name: 'John Doe', region: 'Canada', rating: 4 },
      { name: 'John Doe', region: 'Canada/Ontario', rating: 5 },
      { name: 'Alicia Yazzie', region: 'US/Arizona', rating: 10 }];

    const result = parser(sample);
    const query = result.query;

    for(let i = 0; i < query.length; i++) {
      let home = result.store.getHome(query[i]);
      expect(home.name).to.equal(a[i].name);
      expect(home.region).to.equal(a[i].region);
      expect(home.rating).to.equal(a[i].rating);
    }

  });

});

