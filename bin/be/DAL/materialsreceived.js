var storage = require('./storageRequester');

module.exports = {
    getAllbyProject: function (projectid, cb) {
        storage('GET', "/tables/materials_received/rows?filter=idprojects=" + projectid, {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}