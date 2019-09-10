var dal = require('../DAL');

module.exports = {
    get: function (req, res) {
        if (req.query.newly) {
            dal.rmes.getNewlyCreated(function (err, answer) {
                if (!err) {
                    res.status(201).json(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            if (req.query.par) {
                dal.rmes.getByPars(req.query.par, function (err, answer) {
                    if (!err) {
                        res.status(201).json(answer);
                    } else {
                        res.status(500).end();
                    }
                })
            } else {
                if (req.query.project) {
                    dal.rmes.getDescribedByProject(req.query.project, function (err, answer) {
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

    },
    delete: function (req, res) {
        if (req.query.id) {
            dal.rmes.delete(req.query.id, function (err, answer) {
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
        if (req.body.status != null && req.body.comment) {
            dal.rmes.updateStatus(req.query.id, req.body.status, req.body.comment, function (err, answer) {
                if (!err) {
                    res.status(200).send(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            if (req.body.statusdescription) {
                dal.rmes.updateStatusDescription(req.query.id, req.body.statusdescription, function (err, answer) {
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
        console.log("new rme: ", req.body);
        if (req.body.par) {
            dal.rmes.create(req.body.qtd, req.body.status, req.body.description, req.user.id, req.body.par, function (err, answer) {
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