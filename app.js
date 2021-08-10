const express = require('express');
const app = express(); 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const axios = require('axios');
const cheerio = require('cheerio');
const { query } = require('express');
     
PORT = process.env.PORT || 10046; 


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
console.log(shopSearchUrl)
const agent = {"User-Agent":'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'}
axios(shopSearchUrl, headers=agent)
.then(response => res.send(response.data))
.catch(console.error);
});


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
app.listen(PORT, function(){         
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
  });