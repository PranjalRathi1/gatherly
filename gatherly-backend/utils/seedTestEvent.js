const { Event, User } = require('../models');

async function seedTestEvent() {
    try {
        // Check if event already exists
        const existingEvent = await Event.findOne({ title: 'Test Event' });
        if (existingEvent) {
            console.log('🟢 Test event already exists');
            return;
        }

        // Get any existing user to assign as creator
        let user = await User.findOne();

        // If no user exists, create a bot user
        if (!user) {
            console.log('⚠ No user found. Creating TestBot user...');

            user = await User.create({
                username: 'TestBot',
                email: 'testbot@gatherly.com',
                password: '12345678' // will be hashed if your schema hashes passwords
            });

            console.log('✅ TestBot user created');
        }

        // Create test event WITH creator
        await Event.create({
            title: 'Test Event',
            description: 'Permanent test event for development.',
            date: new Date(),
            location: 'Test Location',
            maxAttendees: 50,
            category: 'concert',
            creator: user._id, // 🔥 THIS IS THE FIX
            attendees: []
        });

        console.log('✅ Test event seeded successfully');
    } catch (err) {
        console.error('Error seeding test event:', err);
    }
}

module.exports = seedTestEvent;
