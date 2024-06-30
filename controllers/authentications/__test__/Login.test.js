const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, server } = require('../../../server');

describe('POST /api/auth/login', () => {
    it('should log in user and return tokens', async () => {
        const userData = {
            user_phone: process.env.__TEST__PHONE,
            user_password: process.env.__TEST__PASS
        };

        const response = await request(app)
            .post('/api/auth/login')
            .send(userData)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('ล็อกอินสำเร็จค่ะ!');
        expect(response.body.user).toBeDefined();
        expect(response.body.uuid).toBeDefined();

        // Validate tokens
        const refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
        const accessToken = response.headers['set-cookie'][1].split(';')[0].split('=')[1];

        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH);
        const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET);

        expect(decodedRefresh.user).toEqual(expect.objectContaining({
            user_id: expect.any(String),
        }));

        expect(decodedAccess.user).toEqual(expect.objectContaining({
            user_id: expect.any(String),
        }));
    });

    it('should return 400 if phone number or password is null', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({})
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('กรุณาป้อนเบอร์โทรศัพท์หรือรหัสผ่าน!');
    });

    it('should return 404 if user is not found', async () => {
        const userData = {
            user_phone: "nonexistent_phone_number",
            user_password: "password"
        };

        const response = await request(app)
            .post('/api/auth/login')
            .send(userData)
            .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('ไม่พบผู้ใช้งาน!');
    });

    it('should return 403 if user account is inactive', async () => {
        // Mock user with inactive account
        const userData = {
            user_phone: process.env.__TEST__PHONE_NOT_ACCTIVE,
            user_password: process.env.__TEST__USER_NOT_ACCTIVE
        };

        const response = await request(app)
            .post('/api/auth/login')
            .send(userData)
            .expect(403);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('บัญชีนี้ไม่สามารถใช้งานได้ กรุณาติดต่อ posyayee!');
    });

    it('should return 401 if user password is incorrect', async () => {
        const userData = {
            user_phone: process.env.__TEST__PHONE,
            user_password: "incorrect_password"
        };

        const response = await request(app)
            .post('/api/auth/login')
            .send(userData)
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('รหัสผ่านไม่ถูกต้อง!');
    })
});

beforeAll(async () => {
    server.listen(4000, () => {
        console.log(`POSYAYEE-V2 app listening on port 4000`);
    });
});

afterAll(async () => {
    server.close();
});
