module.exports = function(keys) {
    var values = keys[0].value.split(" ");
    return [{
        key: "backgroundColor",
        value: values[0]
    }];
};
