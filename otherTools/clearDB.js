const mongoose = require('mongoose');
const connectDB = require('../src/db/connect');
const User = require('../src/db/models/user');
const Monitor = require('../src/db/models/monitor');
const Alert = require('../src/db/models/alert');
const logger = require('../src/utils/logger');

const clearDatabase = async () => {
    await connectDB();
    try {
        await User.deleteMany({});
        logger.info('Collection User cleared.');
        await Monitor.deleteMany({});
        logger.info('Collection Monitor cleared.');
        await Alert.deleteMany({});
        logger.info('Collection Alert cleared.');
        console.log('\n✅ Database cleared successfully!');
    } catch (error) {
        logger.error('❌ Error clearing database:', error);
    } finally {
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

clearDatabase();