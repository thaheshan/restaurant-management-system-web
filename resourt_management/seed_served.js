const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  connectionString: 'postgresql://postgres.wftdcqgueuelimbakhhx:Thaheshan0911%23@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Cleaning and seeding 20 SERVED orders...');
    
    // Get valid IDs
    const res = await client.query('SELECT id FROM restaurants LIMIT 1');
    const user = await client.query('SELECT id FROM users WHERE role = \'customer\' LIMIT 1');
    
    if (res.rows.length === 0 || user.rows.length === 0) {
      console.error('No restaurant or customer found.');
      return;
    }
    
    const rid = res.rows[0].id;
    const uid = user.rows[0].id;
    const items = (await client.query('SELECT id, name, price FROM menu_items WHERE restaurant_id = $1 LIMIT 5', [rid])).rows;

    // Clean up
    await client.query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE restaurant_id = $1)', [rid]);
    await client.query('DELETE FROM orders WHERE restaurant_id = $1', [rid]);

    const now = new Date();
    for (let i = 0; i < 4; i++) {
        const mDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        console.log(`Generating month -${i}`);
        for (let j = 0; j < 5; j++) {
            const oid = uuidv4();
            const oDate = new Date(mDate);
            oDate.setDate(Math.floor(Math.random() * 25) + 1);
            oDate.setHours(10 + Math.random() * 8, Math.random() * 60);
            
            if (oDate > now) oDate.setDate(now.getDate() - 1);
            
            const oitems = items.sort(() => 0.5 - Math.random()).slice(0, 2);
            const subtotal = oitems.reduce((s, it) => s + parseFloat(it.price), 0);
            const total = subtotal * 1.1;

            await client.query(
                `INSERT INTO orders (id, user_id, restaurant_id, table_number, subtotal, tax_fee, grand_total, order_status, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [oid, uid, rid, Math.floor(Math.random()*10)+1, subtotal, subtotal * 0.1, total, 'served', oDate]
            );

            for (const it of oitems) {
                await client.query(
                    `INSERT INTO order_items (id, order_id, menu_item_id, name, quantity, price)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [uuidv4(), oid, it.id, it.name, 1, it.price]
                );
            }
        }
    }
    console.log('Done: 20 served orders seeded.');
  } catch (err) {
    console.error('Seed Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
