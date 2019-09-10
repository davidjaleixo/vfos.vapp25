var dal = require('../DAL');

module.exports = {

    get: function (req, res) {
        if (req.query.project) {
            if (req.query.newly) {
                dal.pars.getNewlyCreated(req.query.project, function (err, answer) {
                    if (!err) {
                        res.status(201).json(answer);
                    } else {
                        res.status(500).end();
                    }
                })
            } else {
                dal.pars.getByProject(req.query.project, function (err, answer) {
                    if (!err) {
                        res.status(201).json(answer);
                    } else {
                        res.status(500).end();
                    }
                })
            }
        } else {
            if (req.query.id) {
                dal.pars.getById(req.query.id, function (err, answer) {
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
            console.log("new par with: ", req.body);
            console.log("user requesting: ", req.user);
            dal.pars.create(req.body.qtd ? req.body.qtd : 0, req.body.description ? req.body.description : "no description provided", req.body.project, req.body.materialid, req.user.id, function (err, answer) {
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