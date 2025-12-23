require('dotenv').config();
const mongoose = require('mongoose');
const { Restaurant, MenuItem, Category } = require('./models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nibuna2102_db_user:Nibuna21%4026@delivery.b7aig5d.mongodb.net/?appName=Delivery';

const categories = [
    { name: 'Pizza' },
    { name: 'Burgers' },
    { name: 'Indian' },
    { name: 'Chinese' },
    { name: 'Desserts' },
    { name: 'Beverages' }
];

const restaurants = [
    {
        name: 'Pizza Palace',
        address: '123 Main Street, Downtown',
        cuisine: 'Italian',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
    },
    {
        name: 'Burger House',
        address: '456 Oak Avenue, Central',
        cuisine: 'American',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
    },
    {
        name: 'Spice Garden',
        address: '789 Curry Lane, East Side',
        cuisine: 'Indian',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
    },
    {
        name: 'Dragon Wok',
        address: '321 Noodle Street, Chinatown',
        cuisine: 'Chinese',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400'
    },
    {
        name: 'Sweet Treats',
        address: '654 Dessert Boulevard, West End',
        cuisine: 'Desserts & Bakery',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'
    }
];

const menuItems = {
    'Pizza Palace': [
        { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' },
        { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and cheese', price: 14.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300' },
        { name: 'Veggie Supreme', description: 'Bell peppers, onions, mushrooms, olives', price: 13.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=300' },
        { name: 'BBQ Chicken Pizza', description: 'BBQ sauce, grilled chicken, red onions', price: 15.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300' },
        { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 4.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24f9e6?w=300' }
    ],
    'Burger House': [
        { name: 'Classic Cheeseburger', description: 'Beef patty, cheese, lettuce, tomato', price: 9.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
        { name: 'Double Bacon Burger', description: 'Two patties, bacon, cheese, special sauce', price: 13.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300' },
        { name: 'Veggie Burger', description: 'Plant-based patty with fresh veggies', price: 10.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300' },
        { name: 'Chicken Burger', description: 'Crispy chicken, mayo, lettuce', price: 10.49, category: 'Burgers', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300' },
        { name: 'French Fries', description: 'Crispy golden fries', price: 3.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300' },
        { name: 'Milkshake', description: 'Chocolate, vanilla, or strawberry', price: 4.99, category: 'Beverages', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300' }
    ],
    'Spice Garden': [
        { name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', price: 14.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300' },
        { name: 'Paneer Tikka Masala', description: 'Cottage cheese in spiced gravy', price: 12.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300' },
        { name: 'Biryani', description: 'Fragrant rice with spices and meat', price: 13.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300' },
        { name: 'Naan Bread', description: 'Soft flatbread baked in tandoor', price: 2.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
        { name: 'Samosa (2 pcs)', description: 'Crispy pastry with spiced potato filling', price: 4.99, category: 'Indian', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' }
    ],
    'Dragon Wok': [
        { name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts', price: 13.99, category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300' },
        { name: 'Sweet & Sour Pork', description: 'Crispy pork in tangy sauce', price: 14.49, category: 'Chinese', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300' },
        { name: 'Vegetable Fried Rice', description: 'Wok-fried rice with mixed vegetables', price: 9.99, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
        { name: 'Chow Mein', description: 'Stir-fried noodles with vegetables', price: 10.99, category: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300' },
        { name: 'Spring Rolls (4 pcs)', description: 'Crispy vegetable rolls', price: 5.99, category: 'Chinese', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=300' }
    ],
    'Sweet Treats': [
        { name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 6.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
        { name: 'Cheesecake', description: 'Creamy New York style cheesecake', price: 7.49, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=300' },
        { name: 'Ice Cream Sundae', description: 'Vanilla ice cream with toppings', price: 5.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300' },
        { name: 'Brownie', description: 'Fudgy chocolate brownie', price: 4.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=300' },
        { name: 'Fruit Tart', description: 'Fresh seasonal fruits on pastry', price: 6.49, category: 'Desserts', image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=300' }
    ]
};

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await Restaurant.deleteMany({});
        await MenuItem.deleteMany({});
        await Category.deleteMany({});

        // Insert categories
        console.log('Inserting categories...');
        await Category.insertMany(categories);
        console.log(`Inserted ${categories.length} categories`);

        // Insert restaurants and menu items
        console.log('Inserting restaurants and menu items...');
        for (const restaurantData of restaurants) {
            const restaurant = await Restaurant.create(restaurantData);
            console.log(`Created restaurant: ${restaurant.name}`);

            const items = menuItems[restaurant.name];
            if (items) {
                const menuItemsWithRestaurant = items.map(item => ({
                    ...item,
                    restaurantId: restaurant._id
                }));
                await MenuItem.insertMany(menuItemsWithRestaurant);
                console.log(`  Added ${items.length} menu items`);
            }
        }

        console.log('\n✅ Database seeded successfully!');
        console.log(`Total Restaurants: ${restaurants.length}`);
        console.log(`Total Menu Items: ${Object.values(menuItems).flat().length}`);

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
