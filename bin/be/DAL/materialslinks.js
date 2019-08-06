var storage = require('./storageRequester');

module.exports = {
    getByMaterialId: function (materialid, cb) {
        storage('GET', "/tables/materialslinks/rows?filter=idmaterials=" + materialid, {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (linkid, cb) {
        storage('DELETE', "/tables/materialslinks/rows?filter=idlink=" + linkid, {}, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Material link is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateDescription: function (linkid, newDescription, cb) {
        storage('PATCH', "/tables/materialslinks/rows?filter=idlink=" + linkid, { description: newDescription }, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Material link is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (description, materialid, link, cb) {
        storage('POST', "/tables/materialslinks/rows", [{ description: description ? description : "no description provided", idmaterials: materialid, link: link ? link : "nolink" }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Material link is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}