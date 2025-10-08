import { NextResponse } from 'next/server';
import Flutterwave from 'flutterwave-node-v3';
import { BankDetails } from '@/hooks/use-rewards';

// IMPORTANT: Add your Flutterwave keys to a .env.local file
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY!,
  process.env.FLUTTERWAVE_SECRET_KEY!
);

// A mapping from bank names to their official Flutterwave bank codes
const bankCodes: { [key: string]: string } = {
    "Access Bank": "044",
    "Fidelity Bank": "070",
    "First City Monument Bank (FCMB)": "214",
    "First Bank of Nigeria": "011",
    "Guaranty Trust Bank (GTB)": "058",
    "Union Bank of Nigeria": "032",
    "United Bank for Africa (UBA)": "033",
    "Zenith Bank": "057",
    "Citibank Nigeria": "023",
    "Ecobank Nigeria": "050",
    "Heritage Bank": "030",
    "Keystone Bank": "082",
    "Kuda Bank": "50211",
    "Opay": "999991",
    "Palmpay": "999992",
    "Polaris Bank": "076",
    "Stanbic IBTC Bank": "221",
    "Standard Chartered Bank": "068",
    "Sterling Bank": "232",
    "SunTrust Bank Nigeria": "100",
    "Titan Trust Bank": "102",
    "Wema Bank": "035",
};

export async function POST(request: Request) {
  if (!process.env.FLUTTERWAVE_SECRET_KEY) {
    return NextResponse.json(
      { message: "Server configuration error: Flutterwave secret key is missing." },
      { status: 500 }
    );
  }

  try {
    const { amount, bankDetails } = (await request.json()) as { amount: number; bankDetails: BankDetails };

    if (!amount || !bankDetails) {
      return NextResponse.json({ message: 'Missing amount or bank details' }, { status: 400 });
    }

    const bankCode = bankCodes[bankDetails.bankName];
    if (!bankCode) {
        return NextResponse.json({ message: `Bank '${bankDetails.bankName}' is not supported.` }, { status: 400 });
    }

    const transferDetails = {
      account_bank: bankCode,
      account_number: bankDetails.accountNumber,
      amount: amount,
      narration: 'AdWatch Reward Payout',
      currency: 'NGN',
      reference: `adwatch_payout_${Date.now()}`,
      callback_url: 'https://webhook.site/b3e505b0-fe02-430e-a538-22bbb616ecc8', // Recommended for production
      debit_currency: 'NGN',
    };

    const response = await flw.Transfer.initiate(transferDetails);
    
    if (response.status === 'success') {
        return NextResponse.json({
            status: 'success',
            message: 'Transfer initiated successfully.',
            transferId: response.data.id
        });
    } else {
        // Forward the error message from Flutterwave
        return NextResponse.json({ message: response.message || 'Failed to initiate transfer.' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('FLUTTERWAVE_ERROR', error);
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
