const express = require("express");

const { withdrawController } = require("../controllers/withdraw.controller");

const withdrawRouter = express.Router();

withdrawRouter.post("/",  withdrawController);

module.exports = withdrawRouter;
