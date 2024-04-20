import mongoose from "mongoose";

const userSchema = mongoose.Schema({  
userId: { type: String, default: '' },
signupMethod: {
  type: String,
  enum: ['GOOGLE', 'FACEBOOK', 'APPLE', 'CUSTOM'],
},
email: { type: String, default: '' },
name : { type: String, default: '' },
password: { type: String, default: '' },
username : { type: String, default: '' },
displayName: { type: String, default: ''},
role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
UID: { type: String, default: '' },
walletAddress: { type: String, default: '' },
isEmailVerified: { type: Boolean, default: false },
isDeleted: { type: Boolean, default: false },
isActive: { type: Boolean, default: true },
addedOn: { type: Number, default: Date.now() },
modifiedOn: { type: Number, default: Date.now() },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
