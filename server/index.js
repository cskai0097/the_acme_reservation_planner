// Import necessary modules
const express = require('express');
const { createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, fetchReservations, createReservation, destroyReservation } = require('./db');

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies in incoming requests
app.use(express.json());

// Route to get all customers from the database
app.get('/api/customers', async (req, res) => {
    const customers = await fetchCustomers(); // Fetch customers using the db function
    res.json(customers); // Respond with the list of customers in JSON format
});

// Route to get all restaurants from the database
app.get('/api/restaurants', async (req, res) => {
    const restaurants = await fetchRestaurants(); // Fetch restaurants using the db function
    res.json(restaurants); // Respond with the list of restaurants in JSON format
});

// Route to get all reservations from the database
app.get('/api/reservations', async (req, res) => {
    const reservations = await fetchReservations(); // Fetch reservations using the db function
    res.json(reservations); // Respond with the list of reservations in JSON format
});

// Route to create a new customer in the database
app.post('/api/customers', async (req, res) => {
    try {
        const { name } = req.body; // Extract the name from the request body
        const newCustomer = await createCustomer(name); // Create a new customer using the db function
        res.status(201).json(newCustomer); // Respond with the newly created customer and a 201 status code
    } catch (error) {
        console.error(error); // Log any errors to the console
        res.status(500).json({ error: 'Internal Server Error' }); // Respond with a 500 status code on error
    }
});

// Route to create a new reservation for a specific customer
app.post('/api/customers/:id/reservations', async (req, res) => {
    const { restaurant_id, date, party_count } = req.body; // Extract reservation details from the request body
    const customer_id = req.params.id; // Extract the customer ID from the URL parameters
    const reservation = await createReservation(date, party_count, restaurant_id, customer_id); // Create a new reservation using the db function
    res.status(201).json(reservation); // Respond with the newly created reservation and a 201 status code
});

// Route to delete a specific reservation for a customer
app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
    const { id } = req.params; // Extract the reservation ID from the URL parameters
    await destroyReservation(id); // Delete the reservation using the db function
    res.status(204).send(); // Respond with a 204 status code to indicate successful deletion without content
});

// Function to set up the database tables and start the server
const setup = async () => {
    await createTables(); // Create the database tables
    app.listen(3000, () => console.log('server listening on port 3000')); // Start the server on port 3000
};

// Call the setup function
setup();
