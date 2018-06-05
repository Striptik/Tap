const { Router } = require('express');

const router = Router();

class HomeViews {
  constructor({ passport }) {
    this.passport = passport;
    this.notStatics = false; // to remove
  }

  routes() {
    this.notStatics = true; // To remove
    
    router.get('/', (req, res) => {
      res.render('hello', {
        user: 'kevin',
      });
    });
  }

  getRouter() {
    this.routes();
    return router;
  }
}

module.exports = HomeViews;
