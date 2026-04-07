const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  connectionString: 'postgresql://postgres.wftdcqgueuelimbakhhx:Thaheshan0911%23@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Cleaning up and seeding 20 sample orders (5 per month)...');
    
    // Get valid restaurant and user
    const resResult = await client.query('SELECT id FROM restaurants LIMIT 1');
    const userResult = await client.query('SELECT id FROM users WHERE role = \'customer\' LIMIT 1');
    
    if (resResult.rows.length === 0 || userResult.rows.length === 0) {
      console.error('No restaurant or customer found.');
      return;
    }
    
    const restaurantId = resResult.rows[0].id;
    const userId = userResult.rows[0].id;

    // Clean up existing orders for this restaurant to avoid clutter
    await client.query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE restaurant_id = $1)', [restaurantId]);
    await client.query('DELETE FROM orders WHERE restaurant_id = $1', [restaurantId]);

    const menuResult = await client.query('SELECT id, name, price FROM menu_items WHERE restaurant_id = $1 LIMIT 5', [restaurantId]);
    const items = menuResult.rows;

    const statuses = ['order_placed', 'start_prep', 'in_progress', 'served'];
    const now = new Date();
    
    for (let i = 0; i < 4; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        console.log(`Generating 5 orders for month index -${i}`);
        
        for (let j = 0; j < 5; j++) {
            const orderId = uuidv4();
            const orderDate = new Date(monthDate);
            orderDate.setDate(Math.floor(Math.random() * 25) + 1);
            orderDate.setHours(Math.floor(Math.random() * 10) + 10, Math.floor(Math.random() * 60));
            
            // Ensure no future dates
            if (orderDate > now) {
                orderDate.setDate(now.getDate() - 1);
            }

            const tableNum = Math.floor(Math.random() * 10) + 1;
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Random items
            const orderItems = items.sort(() => 0.5 - Math.random()).slice(0, 2);
            const subtotal = orderItems.reduce((s, it) => s + parseFloat(it.price), 0);
            const tax = Math.round(subtotal * 0.1 * 100) / 100;
            const total = subtotal + tax;

            await client.query(
                `INSERT INTO orders (id, user_id, restaurant_id, table_number, subtotal, tax_fee, grand_total, payment_method, order_status, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [orderId, userId, restaurantId, tableNum, subtotal, tax, total, 'cash', status, orderDate]
            );

            for (const item of orderItems) {
                await client.query(
                    `INSERT INTO order_items (id, order_id, menu_item_id, name, quantity, price)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [uuidv4(), orderId, item.id, item.name, 1, item.price]
                );
            }
        }
    }
    
    console.log('Successfully seeded 20 sample orders across 4 months.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
