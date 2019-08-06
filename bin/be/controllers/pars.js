var dal = require('../DAL');

module.exports = {
    
    get: function (req, res) {
        if (req.query.project) {
            if(req.query.newly){
                dal.pars.getNewlyCreated(req.query.project, function(err, answer){
                    if(!err){
                        res.status(201).json(answer);
                    }else{
                        res.status(500).end();
                    }
                })
            }else{
                dal.pars.getByProject(req.query.project, function (err, answer) {
                    if (!err) {
                        res.status(201).json(answer);
                    } else {
                        res.status(500).end();
                    }
                })
            }
        } else {
            res.status(422).json({ message: "Missing required field" })
        }
    },
    delete: function (req, res) {
        if (req.query.id) {
            dal.pars.delete(req.query.id, function (err, answer) {
                if (!err) {
                    res.status(200).send(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            res.status(422).json({ message: "Missing required field" })
        }
    },
    create: function (req, res) {
        if (req.body.project && req.body.materialid) {
            dal.pars.create(qtd ? qtd : 0, description ? description : "no description provided", req.body.project, materialid, req.user.id, function (err, answer) {
                if (!err) {
                    res.status(201).json(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            res.status(422).json({ message: "Missing required fields" })
        }
    }
}