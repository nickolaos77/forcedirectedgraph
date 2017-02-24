const express = require('express');

const app = express();

PORT         = process.env.PORT || 3000;
app.use(express.static('public'));

app.listen(PORT, function portListener (){
  console.log('Server started at port: ' + PORT)
});
