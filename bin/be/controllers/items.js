var dal = require('../DAL');

module.exports = {
    get: function (req, res) {
        if (req.query.par) {
            dal.items.getByPar(req.query.par, function (err, answer) {
                if (!err) {
                    res.status(201).json(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            res.status(422).json({ message: "Missing required field" })
        }
    },
    delete: function (req, res) {
        if (req.query.id) {
            dal.items.delete(req.query.id, function (err, answer) {
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
    update: function (req, res) {
        if (req.body.qtd) {
            dal.items.updateQtd(req.query.id, req.body.qtd, function (err, answer) {
                if (!err) {
                    res.status(200).send(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            if (req.body.description) {
                dal.items.updateQtd(req.query.id, req.body.description, function (err, answer) {
                    if (!err) {
                        res.status(200).send(answer);
                    } else {
                        res.status(500).end();
                    }
                })
            } else {
                res.status(422).json({ message: "Missing required field" })
            }
        }
    },
    create: function (req, res) {
        if (req.body.parid && req.body.materialid && req.body.qtd && req.body.description) {
            dal.items.create(req.body.parid, req.body.materialid, req.body.qtd, req.body.description, function (err, answer) {
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