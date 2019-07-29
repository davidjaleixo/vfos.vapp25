var dal = require('../DAL');

module.exports = {

    get: function (req, res) {
        //by projectid
        console.log("get");
        if (req.query.projectid) {
            dal.materialsreceived.getAllbyProject(req.query.projectid, function (err, answer) {
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