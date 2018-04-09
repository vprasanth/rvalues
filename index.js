const getStdin = require('get-stdin');
const stdinParser = require('./lib/parser');

async function main() {
  try {
    const stdin = await getStdin();
    const instructions = stdinParser(stdin);
    return instructions;
  } catch (e) {
    throw e;
  }
}

main()
  .then(data => console.log(JSON.stringify(data)))
  .catch(e => console.log(e));

function getHome(home, locationQuery) {
  let _home = null;
  let allHomes = [];
  if ((locationQuery.level = 1)) {
    let country = locationQuery.country;
    Object.keys(db[country]).forEach(province => {
      console.log(province);
      Object.keys(db[country][province]).forEach(city => {
        let homes = db[country][province][city];
        console.log(homes);
        for (let i = 0; i < homes.length; i++) {
          if (homes[i].name == home) {
            _home = homes[i];
            return;
          }
        }
      });
    });
  } else {
    throw new Error('Unsupported depth', locationQuery.level);
  }
  console.log(_home);
  console.log(allHomes);
  return _home;
}
