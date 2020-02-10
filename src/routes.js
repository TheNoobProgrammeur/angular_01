import { Router } from 'express';

const axios = require('axios');
const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

routes.get('/hi', async (req, res ) => {
  let catFact = await  catFactGet() ;
  let jockGet = await JockGet();
  let pointGeo = await geoPoint();
  let beerget = await  beerGet();
  let tacos = await tacosGet();
  // data =  JockGet(data);
  return res.send(  {
    catFact,
    joke:jockGet,
    gps:{
      lat: pointGeo[0],
      lgn: pointGeo[1],
    },
    beer: {
      name: beerget.name,
      description: beerget.description
    },
    tacos,
  }  );
});


async function catFactGet() {
  try {
    let  { data } = await  axios.get('https://cat-fact.herokuapp.com/facts/random',{
      params: {
        amount: 3
      }
    });
    return [data[0].text, data[1].text, data[2].text]
  } catch (e) {
    return "Error in request "
  }

}

async function JockGet() {
  try {
    let { data } = await axios.get('https://sv443.net/jokeapi/v2/joke/Programming');

    if(data.joke){
      return data.joke
    }

    return [data.setup, data.delivery]
  } catch (e) {
    return "Error in request "
  }

}

async  function geoPoint() {
  try {
    let {data} = await  axios.get('https://api-adresse.data.gouv.fr/search/',
      {
        params: {
          q:"41 rue du Port",
          limit:1
        }
      });
    return data.features['0'].geometry.coordinates ;
  } catch (e) {
    return "Error in request"
  }

}

async function beerGet() {
  try {
    let {data} = await axios.get('https://api.punkapi.com/v2/beers/random');
    return data[0]
  } catch (e) {
    return "Error in request"
  }

}

async  function tacosGet() {
  try {
    let {data} = await  axios.get('http://taco-randomizer.herokuapp.com/random/')
    return data.shell.name
  }catch (e) {
    return "Error in request"
  }

}

export default routes;
