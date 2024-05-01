const request = require('supertest');
const app = require('./app'); // Assuming your Express app is defined in app.js

describe('POST /register', () => {
    test('creates a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({ username: 'testuser', password: 'testpassword' });
        
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('User Created');
    });
});

// Write similar test cases for other endpoints...

describe('GET /users',  () => {
    test('returns all users', async () => {
        const response = await request(app).get('/users');
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
