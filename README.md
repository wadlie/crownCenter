# Crown Center

Sequelize, Express, and React Application for the CROWN Project's Data Pipeline.

## Back end
## Starting App

**Without Migrations**

```
npm install
npm start
```

**With Migrations**

```
npm install
node_modules/.bin/sequelize db:migrate
npm start
```

We will also need a Postgres database on localhost for development. 
Create a Postgres DB with:
* username: postgres
* password: postgres
* db name: api

*Enviroment variables can be found in the .env file*

Open [http://localhost:3000](http://localhost:3000). 

## Running Tests

We have added some [Mocha](https://mochajs.org) based test. You can run them by `npm test`


## Setup in Details

In order to understand how this application has been built, you can find the
executed steps in the following snippet. You should be able to adjust those
steps according to your needs. Please note that the view and the routes aren't
described. You can find those files in the repo.

#### Sequelize 

```
# generate models
node_modules/.bin/sequelize init
node_modules/.bin/sequelize model:create --name User --attributes username:string
node_modules/.bin/sequelize model:create --name Task --attributes title:string
```

We are using `.sequelizerc` setup change config path for migrations. You can read more about this in [migration docs](http://docs.sequelizejs.com/manual/tutorial/migrations.html#the-sequelizerc-file)

```js
// .sequelizerc
const path = require('path');

module.exports = {
  'config': path.resolve('config', 'config.js')
}
```

You will now have a basic express application with some additional directories
(config, models, migrations). Also you will find two migrations and models.
One for the `User` and one for the `Task`.

In order to associate the models with each other, you need to change the models
like this:

```js
// task.js
// ...
  Task.associate = function(models) {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.User);
    Task.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  }
// ...
```

```js
// user.js
// ...
  User.associate = function(models) {
    User.hasMany(models.Task);
  }
// ...
```

This association will create an attribute `UserId` in `Task` model. We have to amend our `create-task` migration and add this column.

```js
// xxxxxxx-create-task.js
// ...
  UserId: {
    type: Sequelize.INTEGER,
    onDelete: "CASCADE",
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
// ...
```

If you want to use the automatic table creation that sequelize provides,
you have to adjust the `bin/www` file to this:

```js
#!/usr/bin/env node

var app = require('../app');
var debug = require('debug')('init:server');
var http = require('http');
var models = require("../models");

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function () {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});

function normalizePort(val) { /* ... */ }
function onError(error) { /* ... */ }
function onListening() { /* ... */ }
```

And finally you have to adjust the `config/config.js` to fit your environment.
Once thats done, your database configuration is ready!

## Folder Structure
### models
models contains all of our entities (IE tables) that our application will need. Models have properties and associations. 
```
'use strict';
module.exports = (sequelize, DataTypes) => {
  var Farmer = sequelize.define('Farmer', {
    lastname: DataTypes.STRING,
    username: DataTypes.STRING
  });

  Farmer.associate = function(models) {
    models.Farmer.hasMany(models.Farm);
  };
  return Farmer;
};
```
### controllers
controllers are the middlemen for our models and routes. Controller will handle the logics for how data will be distributed to our routes including getting, updating, and removing contents from our database.

```
function getFarmer(req, res) {
    Farmers.findById(req.params.id)
    .then(farmer => {
        res.send(farmer)
    })
}
```

### routes
The routes folder contains the endpoints for our REST API. Routes should communicate with their respective controller to get information. 


```
var farmerController = require("../controllers/farmerController")
... 


router.get('/:id', authMiddleware.checkAuth, farmerController.getFarmer)

```

### app.js
After creating your models/controllers/routes, we need to specify the endpoint in which we can request that information.
We do this in app.js:

```
var farmer  = require('./routes/farmer');
...
app.use('/api/farmer', farmer);

```
Now our farmer end points can be targets at `localhost:3000/api/farmer/:id`


## Runnign a Docker image
To run the docker image, first build:
`sudo docker build -t crown-dev .`

This should build up a docker image tagged with 'crown-dev'

After you have your docker image, you have to run it and mount a local volume to register changes made to your app.

`sudo docker run --network=host -v /home/benny/CS/CMSC435/crown/crownCenter:/api/ crown-dev`

--network=host allows us to listen on local ports (we need this for our postgres db). 

* -v /home/benny/CS/CMSC435... is where our local volume is. Change this to match your local volume
* :/api/ is where the volume is made available. 
* crown-dev is the image name we want to run

