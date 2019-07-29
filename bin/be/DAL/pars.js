var storage = require('./storageRequester');

module.exports = {


    getNewlyCreated: function (projectId, cb) {
        storage('GET', "/tables/pars/rows?filter=status=0 and idprojects=" + projectId + "&order_by=idpars", {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows[JSON.parse(body).list_of_rows.length - 1])
            } else {
                cb(false, "Relational Storage Component not responding");
            }
        })
    },
    getByProject: function (projectId, cb) {
        storage('GET', "/tables/pars/rows?filter=idprojects=" + projectId, {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (parsId, cb) {
        storage('DELETE', "/tables/pars/rows?filter=idpars=" + parsId, {}, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Par is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateStatus: function (parsId, newStatus, cb) {
        storage('PATCH', "/tables/pars/rows?filter=idpars=" + parsId, { status: newStatus }, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Par is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateStatusDescription: function (parsId, newDescription, cb) {
        storage('PATCH', "/tables/pars/rows?filter=idpars=" + parsId, { statusdescription: newDescription }, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Par is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (projectid, status, statusdescription, cb) {
        storage('POST', "/tables/pars/rows", [{ idProjects: projectid, status: status, statusdescription: statusdescription }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Par is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}