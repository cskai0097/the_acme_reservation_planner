const { Client } = require('pg');
const {v4: uuidv4 } = require('uuid');
const dbUrl = process.env.DATABASE_URL || 'postgres://localhost/the_acme_reservation_planner';
const client = new Client({
    connectionString: dbUrl
});

async function createTables() {
    await client.connect();
    await client.query(`
        DROP TABLE IF EXISTS reservations, customers, restaurants CASCADE;`);
    await client.query(`
        CREATE TABLE customers (
            id UUID PRIMARY KEY,
            name TEXT NOT NULL
        );`);
        await client.query(`CREATE TABLE restaurants (
            id UUID PRIMARY KEY,
            name TEXT NOT NULL
        );`);
        await client.query(`CREATE TABLE reservations (
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
            customer_id UUID REFERENCES customers(id) NOT NULL
        );`);
};
const createCustomer = async (name) => {
    const id = uuidv4();
    const res = await client.query(
        `INSERT INTO customers (id, name) VALUES ($1, $2) RETURNING *;`,
        [id, name]);
    return res.rows[0];
};
const createRestaurant = async (name) => {
    const id = uuidv4();
    const res = await client.query(
        `INSERT INTO restaurants (id, name) VALUES ($1, $2) RETURNING *;`,
        [id, name]);
    return res.rows[0];
};
const fetchCustomers = async () => {
    const res = await client.query(`
        SELECT * FROM customers;`);
    return res.rows;
};
const fetchRestaurants = async () => {
    const res = await client.query(`
        SELECT * FROM restaurants;`);
    return res.rows;
};
const fetchReservations = async () => {
    const res = await client.query(`
        SELECT * FROM reservations;`);
    return res.rows;
};
const createReservation = async (date, party_count, restaurant_id, customer_id) => {
    const res = await client.query(`
        INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *`,[date, party_count, restaurant_id, customer_id]);
    return res.rows[0];
};
const destroyReservation = async (id) => {
    await client.query(`DELETE FROM reservations WHERE id = $1`, [id]);
};

module.exports  = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    destroyReservation,
};