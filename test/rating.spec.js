const expect = require('chai').expect;
const rating = require('../lib/store').rating;

describe('Rating functionn', () => {

  it('should be a function', () => {
    expect(rating).to.be.a('function');  
  });

  describe('Rating', () => {

    it(`should be 10 if no other home has a better r-value`, () => {
      expect(rating(0)).to.equal(10);
    });

    it(`should be 1 if all homes have a better r-value`, () => {
      expect(rating(0.9)).to.equal(1);
    });

    it(`should be 2 if 83 percent homes have a better r-value`, () => {
      expect(rating(0.83)).to.equal(2);
    });

    it(`should be 3 if 73 percent homes have a better r-value`, () => {
      expect(rating(0.73)).to.equal(3);
    });

    it(`should be 4 if 63 percent homes have a better r-value`, () => {
      expect(rating(0.63)).to.equal(4);
    });

    it(`should be 5 if 50 percent homes have a better r-value`, () => {
      expect(rating(0.50)).to.equal(5);
    });

    it(`should be 6 if 47 percent homes have a better r-value`, () => {
      expect(rating(0.47)).to.equal(6);
    });

    it(`should be 7 if 33 percent homes have a better r-value`, () => {
      expect(rating(0.33)).to.equal(7);
    });

    it(`should be 8 if 29 percent homes have a better r-value`, () => {
      expect(rating(0.2999)).to.equal(8);
    });

    it(`should be 9 if 13 percent homes have a better r-value`, () => {
      expect(rating(0.13)).to.equal(9);
    });

  });

});

