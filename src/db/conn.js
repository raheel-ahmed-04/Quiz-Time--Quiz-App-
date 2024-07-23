const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Taha9753:Unchartered3.@tahacluster.wxaybwk.mongodb.net/quiztime",
      // "mongodb+srv://raheelgenius747:Raheel123@raheelcluster.66esims.mongodb.net/QuizTime",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`The DB is connected with ${mongoose.connection.host}`);
  } catch (error) {
    console.error("DB connection error:", error);
  }
};

connectDB();
