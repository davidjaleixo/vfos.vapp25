var storage = require('./storageRequester');

module.exports = {
    getAll: function (cb) {
        storage('GET', "/tables/materials/rows", {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (materialId, cb) {
        storage('DELETE', "/tables/materials/rows?filter=idmaterials=" + materialId, {}, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Material is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateName: function (materialId, newName, cb) {
        storage('PATCH', "/tables/materials/rows?filter=idmaterials=" + materialId, { name: newName }, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Material is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (name, cb) {
        storage('POST', "/tables/materials/rows", [{ name: name }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Material is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}