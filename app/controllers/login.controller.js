const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../models");
const { validationResult } = require('express-validator');
const Customer = db.customer;
var status = 'failed';
var message = '';
var data = [];

exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            status: status,
            message: 'Something went wrong',
            data: errors
        });
    }
    // check already exist
    Customer.findOne({ email: req.body.email }, function (err, customer) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        if (!customer) return res.status(404).send({
            status: status,
            message: 'No customer found, Please register',
            data: data
        });

        var passwordIsValid = bcrypt.compareSync(req.body.password, customer.password);
        if (!passwordIsValid) return res.status(401).send({
            status: status,
            message: 'Invalid email or password',
            data: data
        });
        var token = jwt.sign({ id: customer._id }, 'admin', {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({
            status: 'success',
            message: 'Login successfully',
            data: {
                token: token
            }
        });
    });
};

exports.register = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            status: status,
            message: 'Something went wrong',
            data: errors
        });
    }
    Customer.findOne({ email: req.body.email }, function (err, customer) {
        if (err) return res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
        if (customer) return res.status(500).send({
            status: status,
            message: 'Customer already exist',
            data: data
        });

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        Customer.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        },
            function (err, user) {
                if (err) return res.status(500).send({
                    status: status,
                    message: 'Something went wrong',
                    data: data
                })
                // create a token
                var token = jwt.sign({ id: user._id }, 'admin', {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({
                    status: 'success',
                    message: 'Register successfully',
                    data: {
                        token: token,
                        customer: user
                    }
                });
            });
    });

};