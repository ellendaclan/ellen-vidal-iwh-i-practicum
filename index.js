const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load .env variables
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: ROUTE 1 - Homepage route
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${process.env.HUBSPOT_CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.send('Error loading homepage');
    }
});

// TODO: ROUTE 2 - Show form to create/update
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object' });
});

// TODO: ROUTE 3 - Handle form submit
app.post('/update-cobj', async (req, res) => {
    const objectId = req.body.objectId; // Optional: update existing
    const properties = {
        "example_property": req.body.example_property
    };

    const url = objectId
        ? `https://api.hubapi.com/crm/v3/objects/${process.env.HUBSPOT_CUSTOM_OBJECT_TYPE}/${objectId}`
        : `https://api.hubapi.com/crm/v3/objects/${process.env.HUBSPOT_CUSTOM_OBJECT_TYPE}`;

    const headers = {
        Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        if (objectId) {
            await axios.patch(url, { properties }, { headers });
        } else {
            await axios.post(url, { properties }, { headers });
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send('Error updating custom object');
    }
});

// Start server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
