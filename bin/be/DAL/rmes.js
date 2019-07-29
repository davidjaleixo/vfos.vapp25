var storage = require('./storageRequester');

module.exports = {
    getByPars: function (parsId, cb) {
        storage('GET', "/tables/rmes/rows?filter=idpars=" + parsId, {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (rmesId, cb) {
        storage('DELETE', "/tables/rmes/rows?filter=idrmes=" + rmesId, {}, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Rme is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateStatus: function (rmesId, newStatus, cb) {
        storage('PATCH', "/tables/rmes/rows?filter=idrmes=" + rmesId, { status: newStatus }, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Rme is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateStatusDescription: function (rmesId, newDescription, cb) {
        storage('PATCH', "/tables/rmes/rows?filter=idrmes=" + rmesId, { statusdescription: newDescription }, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Rme is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (status, statusdescription, cb) {
        storage('POST', "/tables/rmes/rows", [{ status: status, statusdescription: statusdescription }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Rme is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getNewlyCreated: function (cb) {
        storage('GET', "/tables/rmes/rows?filter=status=0 ", {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows[JSON.parse(body).list_of_rows.length - 1])
            } else {
                cb(false, "Relational Storage Component not responding");
            }
        })
    },
}