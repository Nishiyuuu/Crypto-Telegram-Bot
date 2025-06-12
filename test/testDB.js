const connectDB = require('../src/db/connect');
const mongoose = require('mongoose');
const User = require('../src/db/models/user');
const Monitor = require('../src/db/models/monitor');
const Alert = require('../src/db/models/alert');

const testDatabase = async () => {
    await connectDB();

    console.log('\n--- Testing User Model ---');
    try {
        const testUserId = 12345;
        // Find or create a user
        let user = await User.findOneAndUpdate(
            { userId: testUserId },
            { $setOnInsert: { language: 'ua', isVIP: false } },
            { upsert: true, new: true }
        );
        console.log('User created/found:', user);

        // Update user
        user.isVIP = true;
        await user.save();
        console.log('User updated to VIP:', user);

        const foundUser = await User.findOne({ userId: testUserId });
        console.log('Found user:', foundUser);

    } catch (error) {
        console.error('Error with User model:', error.message);
    }

    console.log('\n--- Testing Monitor Model ---');
    try {
        const testUserId = 12345;
        // Add a monitor entry
        const monitorEntry = await Monitor.create({ userId: testUserId, coin: 'BTC' });
        console.log('Monitor entry added:', monitorEntry);

        // Find monitor entries for the user
        const userMonitors = await Monitor.find({ userId: testUserId });
        console.log('User monitors:', userMonitors);

    } catch (error) {
        console.error('Error with Monitor model:', error.message);
    }

    console.log('\n--- Testing Alert Model ---');
    try {
        const testUserId = 12345;
        // Add an alert entry
        const alertEntry = await Alert.create({ userId: testUserId, coin: 'ETH', percent: 5, interval: 1 });
        console.log('Alert entry added:', alertEntry);

        // Find active alerts for the user
        const userAlerts = await Alert.find({ userId: testUserId, active: true });
        console.log('User alerts:', userAlerts);

    } catch (error) {
        console.error('Error with Alert model:', error.message);
    }

    mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
};

testDatabase();