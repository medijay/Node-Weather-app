const express = require('express');
const path = require('path');
const hbs = require('hbs');
const forecast = require('./utils/forecast.js');
const geocode = require('./utils/geocode.js')

//set up express app
const app = express();
const port = process.env.PORT || 3000;

//static path setting
const dirPath = path.join(__dirname, '../public');
app.use(express.static(dirPath));

//view path setting
app.set('views', path.join(__dirname, '../templates/partials'));

//set up template engine
app.set('view engine', 'hbs');

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name:'MJ',

    })
});

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'MJ',
        message: 'Hope this works at the time you are using it'
    })
});

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About',
        name: 'MJ'
    })
})

app.get('/weather', (req,res) => {
    const location = req.query.address;
    const jsonData = {
        title: 'Weather',
        name: 'MJ',
        location
    };

    if (!location) {
        jsonData.location = 'No address is entered.'
        res.send(jsonData)
    }
    else {
        geocode(location, (error, {latitude, longitude, location} = {}) => {
            jsonData.location = location;
            if (error) {
                jsonData.forecast = error;
                res.send(jsonData)
            }
            else {
                forecast({latitude, longitude }, (error, { daily, currently}) => {
                    if (error) {
                        jsonData.forecast = error;
                        res.send(jsonData)
                    }
                    else {
                        jsonData.forecast = `${daily.summary} It is currently ${currently.temperature} degrees out. There is ${currently.precipProbabilities}% chance of rain.`;
                        res.send(jsonData)
                    }
                })
            }
        })
    }
})

app.get('*', (req,res) => {
    res.render('404', {
        message: 'Something went wrong with the page you are looking for',
        title: '404',
        name: 'MJ'
    });
})

app.get('/help/*', (req,res) => {
    res.render('404', {message: 'Help articles not found'});
})

app.listen(port, () => {
    console.log('Server is up and running on port' + port);
})