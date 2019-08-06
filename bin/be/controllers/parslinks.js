var dal = require('../DAL');

module.exports = {

    get: function (req, res) {
        //by par id
        if (req.query.par) {
            dal.parslinks.getByParId(req.query.par, function (err, answer) {
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
    create: function (req, res) {
        if (req.body.par) {
            dal.parslinks.create(req.body.description, req.body.par, req.body.link, function (err, answer) {
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
            dal.parslinks.delete(req.query.id, function (err, answer) {
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
}