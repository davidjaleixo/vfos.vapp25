var storage = require('./storageRequester');

module.exports = {


    getNewlyCreated: function (projectId, cb) {
        storage('GET', "/tables/pars/rows?filter=idprojects=" + projectId + "&order_by=idpars", {}, function (err, response, body) {
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
    create: function (qtd, description, projectid, materialid, userid, cb) {        
        storage('POST', "/tables/pars/rows", [{ idProjects: projectid, qtd: qtd, description: description, idmaterials: materialid, createdat: new Date().toUTCString(), createdby: userid }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Par is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}