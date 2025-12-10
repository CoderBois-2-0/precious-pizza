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

-- Create a category for pizzas
INSERT INTO categories (id, name)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Classic')
ON CONFLICT DO NOTHING;

-- Insert 5 pizzas
INSERT INTO pizzas (id, name, description, price, category_id)
VALUES 
  (
    '22222222-2222-2222-2222-222222222221',
    'Margherita',
    'Fresh tomatoes, mozzarella cheese, and basil on a thin crust',
    12.99,
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Pepperoni',
    'Classic pepperoni with mozzarella cheese and tomato sauce',
    14.99,
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    '22222222-2222-2222-2222-222222222223',
    'Hawaiian',
    'Ham and pineapple with mozzarella cheese',
    13.99,
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    '22222222-2222-2222-2222-222222222224',
    'Vegetarian',
    'Bell peppers, onions, mushrooms, olives, and tomatoes',
    13.49,
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    '22222222-2222-2222-2222-222222222225',
    'Meat Lovers',
    'Pepperoni, sausage, bacon, and ham with extra cheese',
    16.99,
    '11111111-1111-1111-1111-111111111111'
  )
ON CONFLICT DO NOTHING;
