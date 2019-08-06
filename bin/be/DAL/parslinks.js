var storage = require('./storageRequester');

module.exports = {
    getByParId: function (parid, cb) {
        storage('GET', "/tables/parslinks/rows?filter=idpars=" + parid, {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (linkid, cb) {
        storage('DELETE', "/tables/parslinks/rows?filter=idparlink=" + linkid, {}, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Par link is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateDescription: function (linkid, newDescription, cb) {
        storage('PATCH', "/tables/parslinks/rows?filter=idparlink=" + linkid, { description: newDescription }, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Par link is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (description, parid, link, cb) {
        storage('POST', "/tables/parslinks/rows", [{ description: description ? description : "no description provided", idpars: parid, link: link ? link : "nolink" }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Material link is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}