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

-- Insert categories
INSERT INTO categories (id, name)
VALUES
  ('396241b9-dc78-4d95-a8b0-64b4b6807159'::uuid, 'Special'),
  ('04b0eb61-fce4-4f8f-a94b-e59138e00da8'::uuid, 'Classic'),
  ('f4e21ab5-8088-42bb-b3c4-c83bf3bc3fd2'::uuid, 'Folded'),
  ('520c5147-7a2a-43cc-ab12-5d940cbfcc94'::uuid, 'Mexican')
ON CONFLICT DO NOTHING;

-- Insert pizzas
INSERT INTO pizzas (id, name, price, description, category_id, is_visible)
VALUES
  ('6add53ed-dc73-4827-9acc-1388d5063830'::uuid, 'Four Cheese', '15.49', 'Mozzarella, gorgonzola, parmesan, and goat cheese', '04b0eb61-fce4-4f8f-a94b-e59138e00da8'::uuid, true),
  ('a19dc5d2-8984-4490-abda-1c93ed5e77ee'::uuid, 'Po-ta-toes', '17.29', 'Potatoes, Serrano, Parmesan', '396241b9-dc78-4d95-a8b0-64b4b6807159'::uuid, true),
  ('0384f92c-c409-4999-a576-6123c3b81b8c'::uuid, 'Spicy Hobbit', '19.49', 'Mozzarella, Tomatoesauce, Ham, Bacon, Garlic, jalapenõs & Chili', '520c5147-7a2a-43cc-ab12-5d940cbfcc94'::uuid, true),
  ('42c23d38-6364-4125-83b3-d580d2cefe42'::uuid, 'Margherita', '11.79', 'Fresh tomatoes, mozzarella cheese, and basil on a thin crust', '04b0eb61-fce4-4f8f-a94b-e59138e00da8'::uuid, true),
  ('eea2b25a-899b-4b55-964f-b671d27e655e'::uuid, 'Pepperoni', '13.49', 'Classic pepperoni with mozzarella cheese and tomato sauce', '04b0eb61-fce4-4f8f-a94b-e59138e00da8'::uuid, true),
  ('2bf56d39-313e-4a9f-8299-98007057c079'::uuid, 'Hawaiian', '13.89', 'Ham and pineapple with mozzarella cheese', '396241b9-dc78-4d95-a8b0-64b4b6807159'::uuid, true),
  ('9fc3e97e-40cb-4adb-a963-63e2a50e443b'::uuid, 'Vegetarian', '11.89', 'Bell peppers, onions, mushrooms, olives, and tomatoes', '04b0eb61-fce4-4f8f-a94b-e59138e00da8'::uuid, true),
  ('b8ce1129-e693-4fd8-8d0f-dfab96feb7d3'::uuid, 'Meat Lovers', '16.99', 'Pepperoni, sausage, bacon, and ham with extra cheese', '04b0eb61-fce4-4f8f-a94b-e59138e00da8'::uuid, true),
  ('06b7cbff-638f-4a5b-9269-6bc3d1041999'::uuid, 'Meat''s back on the menu boys!', '19.99', 'Pepperoni, sausage, bacon, chicken, ham, cheese, chili, red peppers', '396241b9-dc78-4d95-a8b0-64b4b6807159'::uuid, true),
  ('649e37d2-c134-4420-989d-6abc54e79138'::uuid, 'Orc Belly', '15.65', 'Ham, Mozzarella, Spaghetti, Tomatosause and Parmesan', 'f4e21ab5-8088-42bb-b3c4-c83bf3bc3fd2'::uuid, true)
ON CONFLICT DO NOTHING;
