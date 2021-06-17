module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            productName: String,
            productCode: String,
            price: Number,
        },
        { timestamps: true }
    );
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const User = mongoose.model("product", schema);
    return User;
};