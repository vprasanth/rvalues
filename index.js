const getStdin = require('get-stdin');
const stdinParser = require('./lib/parser');

async function main() {
  try {
    const stdin = await getStdin();
    const instructions = stdinParser(stdin);
    let results = [];

    instructions.query.forEach(q => {
      results.push(instructions.store.getHome(q));
    });

    return results;
  } catch (e) {
    throw e;
  }
}

main()
  .then(result => {
    result.forEach(home => {
      console.log(`"${home.name}" "${home.region}" ${home.rating}`);
    });
  })
  .catch(e => console.log(e));

