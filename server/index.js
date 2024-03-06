const express = require('express');
const { createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, fetchReservations, createReservation, destroyReservation } = require('./db');

const app = express();
app.use(express.json());

app.get('/api/customers', async(req, res) => {
    const customers = await fetchCustomers();
    res.json(customers);
});
app.get('/api/restaurants', async (req, res) => {
    const restaurants = await fetchRestaurants();
    res.json(restaurants);
});
app.get('/api/reservations', async (req, res) => {
    const reservations = await fetchReservations();
    res.json(reservations);
});
app.post('/api/customers', async (req, res) => {
    try {
        const { name } = req.body; // Assuming the customer's name is sent in the request body
        const newCustomer = await createCustomer(name);
        res.status(201).json(newCustomer); // Send back the newly created customer
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/customers/:id/reservations', async (req, res) => {
    const { restaurant_id , date, party_count } = req.body;
    const customer_id = req.params.id;
    const reservation = await createReservation(date, party_count, restaurant_id, customer_id);
    res.status(201).json(reservation);
});
app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
    const { id } = req.params;
    await destroyReservation(id);
    res.status(204).send();
});

const setup = async () => {
    await createTables();
    app.listen(3000, () => console.log('server listening on port 3000'));
};
setup();