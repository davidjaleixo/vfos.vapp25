var dal = require('../DAL');

module.exports = {
    get: function (req, res) {
        dal.materials.getAll(function (err, answer) {
            if (!err) {
                res.status(201).json(answer);
            } else {
                res.status(500).end();
            }
        })
    },
    delete: function (req, res) {
        if (req.query.id) {
            dal.materials.delete(req.query.id, function (err, answer) {
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
        if (req.body.name) {
            dal.materials.updateName(req.query.id, req.body.name, function (err, answer) {
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
        if (req.body.name) {
            dal.materials.create(req.body.name, function (err, answer) {
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