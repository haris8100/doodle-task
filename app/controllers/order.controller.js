const db = require("../models");
const Order = db.order;
const Customer = db.customer;
var status = 'failed';
var message = '';
var data = [];

exports.create = (req, res) => {
    Order.findOne({ orderNo: req.body.orderNo }, function (err, orders) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        if (orders) return res.status(500).send({
            status: status,
            message: 'Order already placed',
            data: data
        });

        Order.create({
            customerId: req.customerId,
            orderNo: req.body.orderNo,
            orderAmount: req.body.orderAmount,
            orderDetail: req.body.orderDetail
        },
            function (err, user) {
                if (err) return res.status(500).send({
                    status: status,
                    message: 'Something went wrong',
                    data: data
                })

                res.status(200).send({
                    status: 'success',
                    message: 'Ordered successfully',
                    data: user
                });
            });
    });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Order.findOne({ orderNo: req.body.orderNo, _id: { $ne: id } }, function (err, orders) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        if (orders) return res.status(500).send({
            status: status,
            message: 'Order No already exist',
            data: data
        });

        var body = {
            customerId: req.customerId,
            orderNo: req.body.orderNo,
            orderAmount: req.body.orderAmount,
            orderDetail: req.body.orderDetail
        };

        Order.findByIdAndUpdate(id, body, { useFindAndModify: false })
            .then(order => {
                if (!order) {
                    res.status(404).send({
                        status: status,
                        message: 'Maybe order was not found',
                        data: data
                    });
                } else {
                    status = "success";
                    res.send({
                        status: status,
                        message: 'Order updated successfully',
                        data: order
                    });
                }
            })
    });

}

exports.cancel = (req, res) => {

    var newvalues = { $set: { isCancel: 1 } };
    Order.updateOne({ _id: req.body.id }, newvalues, function (err, order) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        status = "success";
        res.send({
            status: status,
            message: 'Order cancelled successfully',
            data: data
        });
    });
}

exports.list = async (req, res) => {
    // for sorting
    var sortKey = (req.query.sortKey != undefined) ? req.query.sortKey : '_id';
    var sortType = (req.query.sortType == 'ASC') ? 1 : -1;
    const sort  = {}
    sort[sortKey]   = sortType
    // for searching
    var searchString = req.query.search;
    // for limit and offset
    var limit = parseInt(req.query.limit);
    var skip = parseInt(req.query.skip);

    var search = req.query.search;
 
    if(search != undefined){
        Order.find({ $text: { $search: search } }).limit(limit).skip(skip).sort(sort).exec((err, docs) => {
            res.send(docs)
        });
    } else {
        Order.find().limit(limit).skip(skip).sort(sort).exec((err, docs) => {
            res.send(docs)
        });
    }

}

exports.getByDate = (req, res) => {
    var reqDate = req.query.reqDate;

    var start = new Date(reqDate);
    start.setHours(0, 0, 0, 0);
    var end = new Date(reqDate);
    end.setHours(23, 59, 59, 999);

    Order.find({
        "createdAt": { "$gte": start, "$lt": end }
    }).countDocuments(function (err, orders) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        return res.status(200).send({
            status: status,
            message: 'Order count get successfully',
            data: { count: orders }
        });

    });
}

exports.getByCustomer = (req, res) => {

    Customer.find().then(data => {
        var final = [];
        data.forEach(element => {
            var ary = [];
            ary.id = element._id;
            ary.name = element.name;
            Order.find({
                "customerId": element._id
            }).countDocuments(function (err, count) {
                ary.count = count;
            });
            final.push(ary);
        });
        console.log(final)
    })

    // Order.distinct("customerId").then(data => {
    //     console.log(data)
    // })

}