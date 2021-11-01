'use strict'

const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const app = express();

app.use(express.static(__dirname + '/public'));

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.get('/', async (req, res, next) => {
    try {
        const response = await axios.get('https://615485ee2473940017efaed3.mockapi.io/assessment');
        const usersList = response.data;
        res.render('users', {
            users: usersList,
            toggleShowDetails: true
        });
    } catch (error) {
        next(error.response.body);
    }
})

app.get('/details/:id', async (req, res, next) => {
    const arrayIndex = Number(req.params.id);
    if (arrayIndex && Number.isInteger(arrayIndex) && arrayIndex <= 50 && arrayIndex > 0) {
        try {
            const response = await axios.get('https://615485ee2473940017efaed3.mockapi.io/assessment');
            const usersList = response.data.filter((userArrayIndex) => userArrayIndex.id === arrayIndex.toString());
            res.render('users', {
                userDetails: usersList[0],
                toggleShowDetails: false
            });
        } catch (error) {
            next(error.response.body);
        }
    } else {
        next('error');
    }
})

app.use((err, req, res, next) => {
    res.status(404);
    res.send('An error occured');
});

app.listen(3000, () => {
    console.log('app listening on port 3000');
})

module.exports = app;