const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, server } = require('../../../server');


describe('POST /api/auth/refresh', () => {

    it('should return 403 if no refresh token is provided', async () => {
        const response = await request(app)
            .get('/api/auth/refresh')
            .expect(403);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Refresh token not available for this application.');
    });

    it('should return 401 if refresh token is invalid', async () => {
        const response = await request(app)
            .get('/api/auth/refresh')
            .set('Cookie', [`refresh_token=invalidtoken`])
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid token!');
    });

    it('should refresh tokens successfully with a valid refresh token', async () => {

        const user = {
            "user_id": "3",
            "user_acc_verify": true,
            "user_fname": "แสงจันทร์",
            "user_lname": "แสนคราม",
            "user_phone": "0990717548",
            "user_role": "owner",
            "user_email": null,
            "user_image": null,
            "store_id": "2",
            "store": {
                "store_id": "2",
                "store_name": "ร้านค้าแม่ยาหยี",
                "store_remaining": 28,
                "store_address": "85 หมู่ 11 ตำบลนาเกษม อำเภอ ทุ่งศรีอุดม จังหวัด อุบลราชธานี 34160",
                "store_phone": "0990717548",
                "store_taxid": null,
                "store_image": null,
                "store_active": true,
                "package_id": 1
            },
            "setting": {
                "stt_id": "1",
                "stt_peep_sound": true,
                "stt_alway_print": false,
                "stt_out_stock_value": 5,
                "createdAt": "2024-05-05T00:00:00.000Z",
                "updatedAt": "2024-05-05T00:00:00.000Z",
                "store_id": "2"
            },
            "package": {
                "package_id": 1,
                "package_name": "ฟรี"
            }
        }

        const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH, { expiresIn: '30d' });

        const response = await request(app)
            .get('/api/auth/refresh')
            .set('Cookie', [`refresh_token=${refreshToken}`])
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Refresh token successfully');
        expect(response.body.user).toBeDefined();
        expect(response.body.uuid).toBeDefined();

        const cookies = response.headers['set-cookie'];
        expect(cookies).toEqual(expect.arrayContaining([
            expect.stringContaining('access_token='),
        ]));
    });
});

beforeAll(async () => {
    server.listen(4000, () => {
        console.log(`POSYAYEE-V2 app listening on port 4000`);
    });
});

afterAll(async () => {
    server.close();
});
