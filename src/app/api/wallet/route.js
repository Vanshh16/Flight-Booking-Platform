import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
  try {
    await connectDB();

    const user = await User.findOne({ email: "demo@flight.com" });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const wallet = user.wallet;
    if (wallet === undefined) {
      return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, wallet }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to fetch wallet' }, { status: 500 });
  }
}
