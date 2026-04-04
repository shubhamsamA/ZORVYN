import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
 username:{ type: String, unique: true , required: true},
  email: { type: String, unique: true , required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["viewer", "analyst", "admin"],
    default: "viewer",
  },
  isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

export default User;
