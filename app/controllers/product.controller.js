const db = require("../models");
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const Product = db.product;
var status = 'failed';
var message = '';
var data = [];
global.__basedir = __dirname;
var path = "/var/www/html/node/task/uploads/"


exports.import = (req, res) => {
    importExcel(path + req.file.filename);
    res.json({
        'status': status,
        'message': 'File uploaded/import successfully!',
        'data': []
    });
};

function importExcel(filePath) {
    console.log(filePath);
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'Sheet1',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'id',
                B: 'productName',
                C: 'productCode',
                D: 'price'
            }
        }]
    });
    console.log(excelData);

    excelData.Sheet1.forEach(function (arrayItem) {

        Product.findOne({ productCode: arrayItem.productCode }, function (err, product) {
            if (product) {
                Product.updateOne({ _id: product._id }, {$set: { productName: arrayItem.productName, price: arrayItem.price} },
                    function (err, user) {
                        if (err) return res.status(500).send({
                            status: status,
                            message: 'Something went wrong',
                            data: data
                        })
                    });
            } else {
                Product.create({
                    productName: arrayItem.productName,
                    price: arrayItem.price,
                    productCode: arrayItem.productCode
                },
                    function (err, user) {
                        if (err) return res.status(500).send({
                            status: status,
                            message: 'Something went wrong',
                            data: data
                        })
                    });
            }
        });
    });

    fs.unlinkSync(filePath);
}

exports.list = (req, res) => {
    Product.find()
      .then(data => {
        status = 'success';  
        res.send({
            status : status,
            message : 'Product listed successfully',
            data : data
        });
      })
      .catch(err => {
        res.status(500).send({
            status: status,
            message: 'Something went wrong',
            data: data
        });
      });
};