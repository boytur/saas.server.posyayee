const request = require('supertest');
const { app, server } = require('../../../server');
const { cache } = require('../../../connections/redis');

describe('POST /api/auth/get-otp-register', () => {
    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/auth/get-otp-register')
            .send({})
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('กรุณากรอกข้อมูลให้ครบถ้วน!');
        expect(response.body.missingFields).toEqual(expect.arrayContaining([
            'store_name', 'package_id', 'user_phone', 'user_password', 'user_accepted'
        ]));
    });

    it('should return 400 if phone number format is incorrect', async () => {
        const userData = {
            store_name: 'Test Store',
            package_id: 1,
            user_phone: '123456789',
            user_password: 'password123',
            user_accepted: true
        };

        const response = await request(app)
            .post('/api/auth/get-otp-register')
            .send(userData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('เบอร์โทรศัพท์ไม่ถูกต้อง! กรุณากรอกใหม่ในรูปแบบ 0XXXXXXXXX');
    });

    it('should return 400 if phone number is already registered', async () => {

        const userData = {
            store_name: 'Test Store',
            package_id: 1,
            user_phone: process.env.__TEST__PHONE,
            user_password: 'password123',
            user_accepted: true
        };

        const response = await request(app)
            .post('/api/auth/get-otp-register')
            .send(userData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('เบอร์นี้มีคนใช้งานแล้วค่ะ! \n กรุณาลองใหม่อีกครั้ง');
    });

    it('should return 400 if package_id is not a valid integer', async () => {
        const userData = {
            store_name: 'Test Store',
            package_id: 'invalid',
            user_phone: '0812345678',
            user_password: 'password123',
            user_accepted: true
        };

        const response = await request(app)
            .post('/api/auth/get-otp-register')
            .send(userData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('แพ็คเกจไอดีไม่ถูกต้อง!');
    });

    it('should return 400 if package_id does not exist', async () => {
        const userData = {
            store_name: 'Test Store',
            package_id: 999, 
            user_phone: '0812345678',
            user_password: 'password123',
            user_accepted: true
        };

        const response = await request(app)
            .post('/api/auth/get-otp-register')
            .send(userData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('ไม่มีแพ็คเกจไอดีนี้อยู่จริง!');
    });
    
});

beforeAll(async () => {
    await cache.connect();
    server.listen(4000, () => {
        console.log(`POSYAYEE-V2 app listening on port 4000`);
    });
});

afterAll(async () => {
    await cache.disconnect();
    server.close();
});