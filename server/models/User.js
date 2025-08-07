import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    phone: String,
    referenceNumber: String,
    department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
    //return back if getTotalRegisteredStudents stop working.
    // program: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
    level: String,
    password: String,
     isRegistered: {
    type: Boolean,
    default: false,
  },
    isOnline: { type: Boolean, default: false },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
