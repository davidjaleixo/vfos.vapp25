var storage = require('./storageRequester');

module.exports = {

    getByIdList: function (listId, cb) {
        storage('GET', "/tables/received/rows?filter=idlist=" + listId, {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getByRme: function (rmeId, cb) {
        storage('GET', "/tables/received/rows?filter=idrme=" + rmeId + "&order_by=idreceived", {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (receivedId, cb) {
        storage('DELETE', "/tables/received/rows?filter=idreceived=" + receivedId, {}, function (err, response, body) {
            if (!err) {
                cb(false, { message: "Received is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (listId, rmeId, qtd, cb) {
        storage('POST', "/tables/received/rows", [{ idList: listId, idRme: rmeId, qtd: qtd }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Received is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}