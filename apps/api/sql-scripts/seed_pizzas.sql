-- Create admin user (password: admin123)
INSERT INTO users (id, email, phone_number, first_name, last_name, password, role)
VALUES (
  gen_random_uuid(),
  'admin@preciouspizza.com',
  '12345678',
  'Admin',
  'User',
  crypt('admin123', gen_salt('bf')),
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Define constants for reuse
WITH category_ids AS (
  SELECT '11111111-1111-1111-1111-111111111111'::uuid AS classic_id
)
INSERT INTO categories (id, name)
SELECT classic_id, 'Classic' FROM category_ids
ON CONFLICT DO NOTHING;

-- Insert 5 pizzas
WITH category_ids AS (
  SELECT '11111111-1111-1111-1111-111111111111'::uuid AS classic_id
)
INSERT INTO pizzas (id, name, description, price, category_id)
SELECT * FROM (
  VALUES
    ('22222222-2222-2222-2222-222222222221'::uuid, 'Margherita', 'Fresh tomatoes, mozzarella cheese, and basil on a thin crust', 12.99),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'Pepperoni', 'Classic pepperoni with mozzarella cheese and tomato sauce', 14.99),
    ('22222222-2222-2222-2222-222222222223'::uuid, 'Hawaiian', 'Ham and pineapple with mozzarella cheese', 13.99),
    ('22222222-2222-2222-2222-222222222224'::uuid, 'Vegetarian', 'Bell peppers, onions, mushrooms, olives, and tomatoes', 13.49),
    ('22222222-2222-2222-2222-222222222225'::uuid, 'Meat Lovers', 'Pepperoni, sausage, bacon, and ham with extra cheese', 16.99)
) AS pizzas(id, name, description, price)
CROSS JOIN category_ids
ON CONFLICT DO NOTHING;
