# IF App

## System requirements
- [http://www.mongodb.org/](MongoDB) with imported IF data
- [http://nodejs.org/](node.js)
- npm (bundled with node.js)


## Database
At the moment, the DB needs to have the following specifications:
- use the default anonymous Mongo user
- host: localhost
- database: incendios

As part of improving the system, we will read these values from a JSON. You can edit `db.js` if you have a different setup, but please *do not commit it*.

Collections, specific to the app, *cannot be different*:
- geoadminareas


## Installation

After the first `git clone`, you need to install submodules as follows:
```
$ git submodule init
$ git submodule update
```
This step will need to be repeated everytime a new submodule is added. Please do include it in release notes, if necessary.


Make to have **MongoDB running** and install node dependencies:
```
$ cd /path/to/app && npm install
```


## Run

**Don't forget to have MongoDB running**

Run the app with `nodemon`, installed as dependency.
```
$ nodemon app.js
```

Open your app in the browser, typically at [http://localhost:3000](http://localhost:3000).
