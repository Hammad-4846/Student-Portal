const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GrowtXUser',
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GrowtXAdmin',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});



assignmentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


const Assignment = mongoose.model('GrowtXAssignment', assignmentSchema);
module.exports = Assignment;
