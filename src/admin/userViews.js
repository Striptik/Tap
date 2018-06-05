const { Router } = require('express');
const router = Router();

class UserViews {
  constructor({ passport }) {
    this.passport = passport;
    this.notStatics = false; // to remove
  }

  routes() {
    this.notStatics = true; // To remove
  }

  getRouter() {
    this.routes();
    return router;
  }
}

module.exports = UserViews;