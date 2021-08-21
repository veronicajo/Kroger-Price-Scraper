const express = require('express');
const app = express(); 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const axios = require('axios');
const cheerio = require('cheerio');
     
app.set('port', 8403);


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
  const shopSearchUrl = `https://www.kroger.com/search?query=${searchTerm}&searchType=default_search&fulfillment=all`;
  console.log(shopSearchUrl)
  axios(shopSearchUrl)
  .then(response => {
      const htmlPage = response.data;
      const $ = cheerio.load(htmlPage);
      const obj = $('.AutoGrid');
      res.setHeader('Access-Control-Allow-Origin', '*');

      if (obj[0] == undefined) {
        res.send({price: "No results."})
      } else {
        const price = obj.find('[typeof=Price]')['0']['attribs'].value;
        const productDesc = obj.find('[data-qa=cart-page-item-description]')['0']['children'][0].data;
        
        res.send(findData($));
      }
  })
  .catch(console.error);
});


// app.post('/', (req, res, next) => {
    
//     const shopSearchUrl = `https://www.kroger.com/search?query=${searchTerm}&searchType=default_search&fulfillment=all`;

//     axios(shopSearchUrl)
//     .then(response => {
//         const htmlPage = response.data;
//         const $ = cheerio.load(htmlPage);
//         const obj = $('.AutoGrid');

//         const price = obj.find('[typeof=Price]')['0']['attribs'].value;
//         const productDesc = obj.find('[data-qa=cart-page-item-description]')['0']['children'][0].data;
        
//         res.send(findData($));
//     })
//     .catch(console.error);
//   });

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
app.listen(app.get('port'), function(){
    console.log(`Express started on http://${process.env.HOSTNAME}:${app.get('port')}; press Ctrl-C to terminate.`);
  });