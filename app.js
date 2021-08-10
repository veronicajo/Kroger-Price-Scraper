const express = require('express');
const app = express(); 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const axios = require('axios');
const cheerio = require('cheerio');
     
// PORT = process.env.PORT || 10046; 


/*
    FUNCTIONS
*/

function findData($) {  
  const obj = $('.AutoGrid');
  const price = obj.find('[typeof=Price]')['0']['attribs'].value;
  const productDesc = obj.find('[data-qa=cart-page-item-description]')['0']['children'][0].data;
  
  const priceDict = {};
  priceDict['price'] = price;
  priceDict['itemDesc'] = productDesc;

  return priceDict;
}


/*
  ROUTES
*/

app.get('/', (req, res) => {
  const searchTerm = req.query.search;
  const shopSearchUrl = `https://www.target.com/s?searchTerm=${searchTerm}`;
  axios(shopSearchUrl)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(console.error);
  });

// app.get('/', (req, res) => {
// const searchTerm = req.query.search;
// const shopSearchUrl = `https://www.kroger.com/search?query=${searchTerm}&searchType=default_search&fulfillment=all`;
// const agent = {"User-Agent":'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'}
// axios(shopSearchUrl, headers=agent)
// .then(response => {
//     const htmlPage = response.data;
//     const $ = cheerio.load(htmlPage);
//     const obj = $('.AutoGrid');
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     if (obj[0] == undefined) {
//       res.send({price: "No results."})
//     } else {
//       const price = obj.find('[typeof=Price]')['0']['attribs'].value;
//       const productDesc = obj.find('[data-qa=cart-page-item-description]')['0']['children'][0].data;
      
//       res.send(findData($));
//     }
// })
// .catch(console.error);
// });


function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.send('error', { error: err })
}


/*
    LISTENER
*/
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);