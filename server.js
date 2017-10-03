const express = require('express'),
      app = express()

app.use(express.static(__dirname + '/static'))

const port = process.env.PORT || 8080
app.listen(port,function(){
  console.log(`Server listening on port ${port}`)
})
