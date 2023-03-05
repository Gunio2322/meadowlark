const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const express = require('express')
const Connect = require('connect-pg-simple')
const session = require('express-session')
const mongoose = require('mongoose')
const AdminJSMongoose = require("@adminjs/mongoose")
const { Book } = require('./bookModel/book.model.js')
const PORT = 3333


const DEFAULT_ADMIN = {
  email: 'developer@admin.com',
  password: 'administrator',
}

// handle authentication
const authenticate = async (email, password) => {
  //condition to check for correct login details
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    //if the condition is true
    return Promise.resolve(DEFAULT_ADMIN)
  }
  //if the condition is false
  return null
}


AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
})

const start = async () => {
  const app = express()
  const mongooseDB = await mongoose.connect('mongodb://127.0.0.1:27017/ajs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));

  const BookResourceOptions = {
    databases: [mongooseDB],
    resource: Book 
    
  };
 

  

  const adminOptions = {
    rootPath: "/admin",
    resources: [BookResourceOptions],
   
  }

  const admin = new AdminJS(adminOptions);
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "AdminJS",
      cookiePassword: "Secret",
    },
    null,
    {
      store: mongooseDB,
      resave: true,
      saveUninitialized: true,
      secret: 'Secret',
      name: 'adminjs',
    }
  );
  app.use(admin.options.rootPath, adminRouter)


  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()


