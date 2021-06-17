const { Schema } = require("mongoose");

module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            customerId: { type:Schema.Types.ObjectId,ref:"customer"},
            orderNo: String,
            orderAmount: Number,
            orderDetail: [{
                productId: { type:Schema.Types.ObjectId,ref:"product"},
                qty: Number,
                price: Number
            }],
            status: {type: Number, default: 1},
            isCancel: {type: Number, default: 0},
            isRefund: {type: Number, default: 0}
        },
        { timestamps: true }
    );
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    schema.index({orderNo: 'text', orderAmount: 'text', 'orderDetail.price': 'text'});

    const User = mongoose.model("order", schema);
    return User;
};