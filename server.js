const express = require('express');
const hbs = require('hbs'); //handlebars
const fs = require('fs');

var app = express();

//configure partial capabilities
  hbs.registerPartials(__dirname + '/views/partials'); //takes dir to partial folder as arg

//+++++++++++++ HBS Configuration +++++++++++++++
// app.set(); //key , value pairs as arguments
  app.set('view engine' , 'hbs');
//+++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++ Middleware Registration +++++++++++++++++++++++
app.use((req, res, next) => {

  //getting time stamp
  var now = new Date().toString();
  var log = `${now} : ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log' , log + '\n' , (err) => {  //3 args 1) File name 2) what to write
  //3) error handler statement
    if(err){
        console.log('Unable to append to server.log.');
    }
  });
  next(); //call next to start executing handlers
});

app.use((req, res, next) => res.render('maintenance.hbs'));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++use a static web page from a folder+++++++++++++++++++
app.use(express.static(__dirname + '/public')); //run on browser : http://localhost:3000/help.html
//+++++++++++ Helper Registration +++++++++++++++

//registering a helper function
hbs.registerHelper('getCurrentYear' , ()=>{  //2 args: 1) name of function 2) function: what to return when called
  return new Date().getFullYear();
});

hbs.registerHelper('ScreamIt' , (text) => {
    return text.toUpperCase();
});

//++++++++   List of handlebars (for root/home , about, and bad pages) ++++++++++

  //creating handler for http request
  app.get('/' , (request, response)=> {  //2 args: 1) URL 2) function, what to give when site is visited
  // '/' means root page
    response.render('home.hbs', {
      pageTitle : 'Home Page',
      welcomeMessage : 'Welcome !!'
    });
  });


  app.get('/about' , (req, res)=>{  //run: http://localhost:3000/about
    //res.send('About Page');
    res.render('about.hbs', { //passing second arg as data object
      pageTitle : 'About Page',
    });

  });

  app.get('/bad' , (req,res)=>{
    res.send({
      errorMessage: 'Unable to handle request'
    });
  });

  app.listen(3000, () => { //2 args: 1) port number as arg 2) function, do something while page loads
    console.log('Server is up on port 3000');
  });

  //run in browser: http://localhost:3000/
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
