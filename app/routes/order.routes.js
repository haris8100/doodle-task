module.exports = app => {
    const order = require("../controllers/order.controller.js");
    const VerifyToken = require("../middleware/VerifyToken.js");

    var router = require("express").Router();
  
    router.post("/create",VerifyToken, order.create);
    router.post("/cancel",VerifyToken, order.cancel);
    router.put("/update/:id",VerifyToken, order.update);
    router.get("/list",VerifyToken, order.list);
    router.get("/getOrderByDate",VerifyToken, order.getByDate);
    router.get("/getOrderByCustomer",VerifyToken, order.getByCustomer);
  
    app.use('/api/order/', router);
  };