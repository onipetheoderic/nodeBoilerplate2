var mongoose = require('mongoose');
var ComponentSchema = new mongoose.Schema({
    name: {type:String, required: true},
    inspection_type_id: {type:String, required: true},
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Component', ComponentSchema);