import mongoose from 'mongoose';


async function connectToDatabase() {
    try {
        mongoose.connect('mongodb://localhost:27017/driver');
        console.log('Connected successfully to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

export default connectToDatabase;