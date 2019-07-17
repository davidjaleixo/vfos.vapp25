var storage = require('./storageRequester');

module.exports = {
    getByPar: function(parId, cb){
        storage('GET', "/tables/list/rows?filter=idpars=" + parId, {}, function(err, response, body){
            if(!err){
                cb(false, JSON.parse(body).list_of_rows)
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function(parsId, cb){
        storage('DELETE', "/tables/list/rows?filter=idpars="+parsId, {}, function(err, response, body){
            if(!err){
                cb(false, {message: "Par is deleted"})
            } else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateQtd: function(itemId, newQtd, cb){
        storage('PATCH', "/tables/list/rows?filter=idlist="+itemId, {qtd: newQtd}, function(err, response, body){
            if(!err){
                cb(false, {message: "Item is updated"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateDescription: function(itemId, newDescription, cb){
        storage('PATCH', "/tables/list/rows?filter=idlist="+itemId, {description: newDescription}, function(err, response, body){
            if(!err){
                cb(false, {message: "Item is updated"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function(parId, materialId, qtd, description, cb){
        storage('POST', "/tables/list/rows", [{idPars: parId, idMaterials: materialId, qtd: qtd, description: description}], function(error, response, body){
            if(!error){
                cb(false, {message: "Item is created"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}