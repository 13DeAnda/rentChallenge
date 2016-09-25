const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

var Converter = require("csvtojson").Converter;
var converter = new Converter({});
var _ = require('lodash'); 

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

module.exports = {
  getEstimate: getEstimate,
  getMedian: getMedian
};


//SERVER
if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}
app.listen(3000);

//API
app.get('/api/rent/estimate', function(req, res) {
  var rooms = Number(req.query.rooms);
  var bath = Number(req.query.bath);
  var sqft = Number(req.query.sqft);

  //obtain csv data from json
  converter.fromFile("./challenge_data.csv",function(err,result){
    if(err){
      console.log("there was an error while trying to convert the csv file: ", err);
      res.send(400);
    }
    else{
      var priceEstimate = getEstimate(result, rooms, bath, sqft);
      
      res.send({estimate: priceEstimate});
    }
      
  });
  converter = new Converter({});
});

//would get the median sqft cost of all the apartments with similar number of rooms and bathrooms
function getEstimate(data, rooms, bath, sqft){
  var averagePrices = [];  
  
  if(!data || !rooms || !bath || ! sqft){
    return null;
  }
  else{
    _.forEach(data, function(apartment){
      if(apartment.bedrooms == rooms && apartment.bathrooms == bath){
        var pricePerSqf = apartment.price/apartment['square-foot'];
        averagePrices.push(pricePerSqf);
      }
    });

    var medianCost = getMedian(averagePrices);

    return medianCost? Math.round(sqft*medianCost): null;  
  }
};

function getMedian(values){
  if(!values || values.length === 0){
    return null;
  }
  else{
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
      
    if(values.length % 2){
      return values[half];
    }     
    else{
      return (values[half-1] + values[half]) / 2.0;
    }           
  }     
};
