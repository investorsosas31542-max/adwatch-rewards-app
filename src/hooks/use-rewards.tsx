"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  paymentMethod: 'bank' | 'ewallet' | string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface RewardsContextType {
  balance: number;
  addReward: (amount: number) => void;
  bankDetails: BankDetails | null;
  saveBankDetails: (details: BankDetails) => void;
  transactions: Transaction[];
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

const NAIRA_RATE = 1500; // Mock exchange rate: 1 USD = 1500 NGN

// This function will call our new backend API route
async function initiateRealTransfer(amountInNaira: number, details: BankDetails) {
  try {
    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInNaira,
        bankDetails: details,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Transfer failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Transfer initiation failed:', error);
    throw error;
  }
}

export const RewardsProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedBalance = localStorage.getItem('adwatch_balance');
      const storedBankDetails = localStorage.getItem('adwatch_bankDetails');
      const storedTransactions = localStorage.getItem('adwatch_transactions');
      
      if (storedBalance) setBalance(JSON.parse(storedBalance));
      if (storedBankDetails) setBankDetails(JSON.parse(storedBankDetails));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  const handleAutoTransfer = useCallback(async (rewardAmount: number, details?: BankDetails | null) => {
    const targetBankDetails = details || bankDetails;

    if (targetBankDetails) {
        if (rewardAmount <= 0) return;

        const amountInNaira = rewardAmount * NAIRA_RATE;

        try {
            // Initiate the real transfer via our secure backend route
            await initiateRealTransfer(amountInNaira, targetBankDetails);

            const newTransaction: Transaction = {
                id: new Date().toISOString(),
                amount: amountInNaira,
                date: format(new Date(), "PPp"),
                status: 'Completed',
            };

            setTransactions(prev => {
                const updatedTransactions = [newTransaction, ...prev];
                try {
                    localStorage.setItem('adwatch_transactions', JSON.stringify(updatedTransactions));
                } catch (e) { console.error(e); }
                return updatedTransactions;
            });

            toast({
                title: "⚡ Instant Payout Sent!",
                description: `₦${amountInNaira.toLocaleString()} is on its way to your ${targetBankDetails.bankName} account.`,
                className: 'bg-green-100 border-green-300 text-green-800'
            });

            // If we are transferring a pre-existing balance, clear it.
            if (details) {
                setBalance(0);
                localStorage.setItem('adwatch_balance', JSON.stringify(0));
            }
        } catch (error: any) {
            console.error("Payout failed:", error);
            toast({
                variant: "destructive",
                title: "Payout Failed",
                description: error.message || "Could not process the transfer. Please try again later.",
            });
        }
    }
}, [bankDetails, toast]);


  const addReward = useCallback((amount: number) => {
    if (bankDetails) {
      // If bank details exist, transfer the reward directly.
      handleAutoTransfer(amount);
    } else {
      // Otherwise, add it to the pending balance.
      setBalance(prevBalance => {
          const newBalance = prevBalance + amount;
          try {
              localStorage.setItem('adwatch_balance', JSON.stringify(newBalance));
               toast({
                  title: "Reward Added to Balance",
                  description: `You earned $${amount.toFixed(2)}. Add a payout method to withdraw.`,
              });
          } catch (error) {
              console.error("Failed to save balance to localStorage", error);
          }
          return newBalance;
      });
    }
  }, [bankDetails, handleAutoTransfer, toast]);

  const saveBankDetails = (details: BankDetails) => {
    setBankDetails(details);
    try {
      localStorage.setItem('adwatch_bankDetails', JSON.stringify(details));
      toast({
        title: "Payment Details Saved",
        description: "Your payment information has been updated.",
      });
    } catch (error) {
      console.error("Failed to save bank details to localStorage", error);
    }
    
    if (balance > 0) {
       handleAutoTransfer(balance, details);
    }
  };

  if (!isInitialized) {
    return null; 
  }

  return (
    <RewardsContext.Provider value={{ balance, addReward, bankDetails, saveBankDetails, transactions }}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = (): RewardsContextType => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};
