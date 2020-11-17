const express = require('express')

const home = new express.Router()

home.get('/', (req, res) => {
    res.send({
        "name": "Mukesh Kumar Bagariya",
        "skills": "C, Java, Python, Android, Node"
    })
});

module.exports = home
