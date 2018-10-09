const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only',
  }),
]

const userSchema = new Schema({
  name:   {
    type: String,
    required: [true,'Error "name" is required'],
    validate: nameValidator
  },
  gender: {
    type: String,
    required: [true, 'Error "gender" is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Error "phone number" is required']
  },
  address : {
    type: String,
    required: [true, 'Error "address" is required']
  },
  email: {
    type: String,
    required: [true, 'Error "email" is required'],
    validate: nameValidator
  },
  password: {
    type: String
  },
  isOauth: {
    type : Boolean
  },
  todoList: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
}, {
    timestamps : true
});

const User = mongoose.model('User', userSchema);

module.exports = User