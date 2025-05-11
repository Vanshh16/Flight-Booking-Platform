import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  userId: String,
  balance: Number,
});

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
