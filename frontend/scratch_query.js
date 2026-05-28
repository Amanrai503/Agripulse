const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:1234@localhost:5432/crop_dev',
});

async function run() {
  try {
    const res = await pool.query('SELECT * FROM disease_library LIMIT 5');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
