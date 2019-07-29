var dal = require('../DAL');

module.exports = {

    get: function (req, res) {
        //by rme
        if (req.query.rme) {
            dal.receiveds.getByRme(req.query.rme, function (err, answer) {
                if (!err) {
                    res.status(201).json(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            //by id - answer length
            if (req.query.id) {
                dal.receiveds.getByIdList(req.query.id, function (err, answer) {
                    if (!err) {
                        res.status(201).json(answer);
                    } else {
                        res.status(500).end();
                    }
                })
            } else {
                res.status(422).json({ message: "Missing required field" })
            }
        }
    },
    delete: function (req, res) {
        if (req.query.id) {
            dal.receiveds.delete(req.query.id, function (err, answer) {
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
        if (req.body.listid && req.body.rmeid && req.body.qtd) {
            dal.receiveds.create(req.body.listid, req.body.rmeid, req.body.qtd, function (err, answer) {
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