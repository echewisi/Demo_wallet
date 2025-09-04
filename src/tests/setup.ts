import dotenv from 'dotenv';


dotenv.config({ path: './.env.test' });


process.env['NODE_ENV'] = 'test';
process.env['DB_HOST'] = process.env['TEST_DB_HOST'] || 'localhost';
process.env['DB_USER'] = process.env['TEST_DB_USER'] || 'root';
process.env['DB_PASSWORD'] = process.env['TEST_DB_PASSWORD'] || '';
process.env['DB_NAME'] = process.env['TEST_DB_NAME'] || 'demo_wallet_test';
process.env['ADJUTOR_SECRET_KEY'] = 'test-secret-key';
process.env['FAUX_TOKEN'] = 'test-faux-token';


jest.setTimeout(30000);
