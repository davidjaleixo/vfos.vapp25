var dal = require('../DAL');

module.exports = {

    get: function (req, res) {
        //by material id
        if (req.query.material) {
            dal.materialslink.getByMaterialId(req.query.material, function (err, answer) {
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
        if (req.body.material) {
            dal.materialslink.create(req.body.description, req.body.material, req.body.link, function (err, answer) {
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
            dal.materialslink.delete(req.query.id, function (err, answer) {
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