const fs = require('fs');
const path = require('path');
const jokes = require('./jokes/index.json');

let lastJokeId = 0;
jokes.forEach(jk => jk.id = ++lastJokeId);

const types = Array.from(new Set(jokes.map(joke => joke.type)));

const randomJoke = () => {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

/**
 * Get N random jokes from a jokeArray
 */
const randomN = (jokeArray, n) => {
  const limit = jokeArray.length < n ? jokeArray.length : n;
  const randomIndicesSet = new Set();

  while (randomIndicesSet.size < limit) {
    const randomIndex = Math.floor(Math.random() * jokeArray.length);
    if (!randomIndicesSet.has(randomIndex)) {
      randomIndicesSet.add(randomIndex);
    }
  }

  return Array.from(randomIndicesSet).map(randomIndex => {
    return jokeArray[randomIndex];
  });
};

const randomTen = () => randomN(jokes, 10);

const randomSelect = (number) => randomN(jokes, number);

const jokeByType = (type, n) => {
  return randomN(jokes.filter(joke => joke.type === type), n);
};

const count = Object.keys(jokes).length;

/**
 * @param {Number} id - joke id
 * @returns a single joke object or undefined
 */
const jokeById = (id) => (jokes.filter(jk => jk.id === id)[0]);

/**
 * Get paginated jokes
 * @param {Number} from - start index
 * @param {Number} to - end index
 * @param {Number} number - number of jokes to return
 * @returns {Object} - paginated jokes and hasMore flag
 */
const getPaginatedJokes = (from, to, number) => {
  const paginatedJokes = jokes.slice(from, to).slice(0, number);
  const hasMore = to < jokes.length;
  return { jokes: paginatedJokes, hasMore };
};

/**
 * Add a new joke
 * @param {Object} joke - joke object with type, setup, and punchline
 * @returns {Object} - the added joke with id
 */
const addJoke = (joke) => {
  const newJoke = { ...joke, id: ++lastJokeId };
  jokes.push(newJoke);
  fs.writeFileSync(path.join(__dirname, './jokes/index.json'), JSON.stringify(jokes, null, 2));
  return newJoke;
};

module.exports = { jokes, types, randomJoke, randomN, randomTen, randomSelect, jokeById, jokeByType, count, getPaginatedJokes, addJoke };