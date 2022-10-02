/*
https://medium.com/nuances-of-programming/%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D0%B3%D0%BE-%D0%B2%D0%B5%D0%B1-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0-%D1%81-%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E-node-js-%D0%B8-express-80915da83c60
*/

const path = require('path');

let express = require('express'),
    app = express(),
    port = Number(process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, 'gymprogressive')))

app.get('/', function(req, res) {
   //res.send('Express is working');
   res.sendFile(`${__dirname}/gymprogressive/index.html`);
});

app.listen(port, function() {
   console.log('Application listening on port ' + port + '!');
});