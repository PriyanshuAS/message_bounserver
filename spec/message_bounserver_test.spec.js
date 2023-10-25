const request = require('supertest');
const { createServer } = require('../message_bounserver'); 
const PORT = 3000;
let server;
let app;

server = createServer();
app = server.listen(PORT);

describe("Server Errors", () => {
    it("should bounce back valid JSON data", async () => {
        const response = await request(app) 
            .post('/')
            .send({ key: "value" })
            .set('Content-Type', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ key: "value" });
    });

    it("should give an error for malformed JSON", async () => {
        const response = await request(app)
            .post('/')
            .send('{"key": "value') 
            .set('Content-Type', 'application/json');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid body content' });
    });

    it("should give an error for malformed XML", async () => {
        const response = await request(app)
            .post('/')
            .send('<key>value') 
            .set('Content-Type', 'application/xml');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid body content' });
    });

    it("should give error for missing content type", async () => {
        const xmlData = '';
        const response = await request(app)
            .post('/')
            .send(xmlData);

        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("abcd");
    });
});

describe("Server Success", () => {
    it("should successfully handle plain text data", async () => {
        const response = await request(app)
            .post('/')
            .send('This is plain text')
            .set('Content-Type', 'text/plain');

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('This is plain text');
    });

    it("should successfully handle JSON data", async () => {
        const jsonData = { key: "value" };
        const response = await request(app)
            .post('/')
            .send(jsonData)
            .set('Content-Type', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(jsonData);
    });

    it("should successfully handle XML data", async () => {
        const xmlData = '<key>value</key>';
        const response = await request(app)
            .post('/')
            .send(xmlData)
            .set('Content-Type', 'application/xml');

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(xmlData);
    });
});
