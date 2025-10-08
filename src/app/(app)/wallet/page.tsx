"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRewards, BankDetails, Transaction } from "@/hooks/use-rewards";
import { Landmark, WalletCards, Briefcase, Users, History, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const bankDetailsSchema = z.object({
  accountHolder: z.string().min(2, "Name must be at least 2 characters."),
  accountNumber: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit NUBAN."),
  bankName: z.string().min(3, "Please select a bank."),
  paymentMethod: z.string(),
});

const nigerianBanks = [
    "Access Bank", "Fidelity Bank", "First City Monument Bank (FCMB)",
    "First Bank of Nigeria", "Guaranty Trust Bank (GTB)", "Union Bank of Nigeria",
    "United Bank for Africa (UBA)", "Zenith Bank", "Citibank Nigeria",
    "Ecobank Nigeria", "Heritage Bank", "Keystone Bank", "Kuda Bank",
    "Opay", "Palmpay", "Polaris Bank", "Stanbic IBTC Bank", "Standard Chartered Bank",
    "Sterling Bank", "SunTrust Bank Nigeria", "Titan Trust Bank", "Wema Bank",
];

export default function WalletPage() {
  const { toast } = useToast();
  const { bankDetails, saveBankDetails, transactions } = useRewards();
  const [paymentMethod, setPaymentMethod] = useState(bankDetails?.paymentMethod || "bank");

  const form = useForm<z.infer<typeof bankDetailsSchema>>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountHolder: bankDetails?.accountHolder || "",
      accountNumber: bankDetails?.accountNumber || "",
      bankName: bankDetails?.bankName || "",
      paymentMethod: bankDetails?.paymentMethod || "bank",
    },
  });
  
  function onSubmit(values: z.infer<typeof bankDetailsSchema>) {
    saveBankDetails(values);
    toast({
      title: "Payment Details Saved",
      description: "Your payment information has been updated successfully.",
    });
  }

  const maskAccountNumber = (num: string) => {
    return `******${num.slice(-4)}`;
  }

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Prototype Simulation</AlertTitle>
        <AlertDescription>
          This is a prototype application. The rewards and transfers are simulations and do not involve real money. No funds will be sent to your bank account.
        </AlertDescription>
      </Alert>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><WalletCards/> Payout Methods</CardTitle>
              <CardDescription>
                Manage your Nigerian payment methods for instant withdrawals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bankDetails && (
                <div className="mb-6 rounded-lg border bg-muted p-4 space-y-1">
                  <p className="text-sm font-medium text-foreground">{bankDetails.accountHolder}</p>
                  <p className="text-sm text-muted-foreground">{bankDetails.bankName}</p>
                  <p className="text-sm text-muted-foreground font-mono">{maskAccountNumber(bankDetails.accountNumber)}</p>
                  <p className="text-xs text-muted-foreground pt-1">({bankDetails.paymentMethod === 'bank' ? 'Bank Account' : 'e-Wallet'})</p>
                </div>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={(value) => { field.onChange(value); setPaymentMethod(value); }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank"><div className="flex items-center gap-2"><Landmark/> Bank Transfer</div></SelectItem>
                            <SelectItem value="ewallet"><div className="flex items-center gap-2"><Briefcase/> e-Wallet (Opay/Palmpay)</div></SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{paymentMethod === 'bank' ? 'Bank Name' : 'e-Wallet Provider'}</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={`Select a ${paymentMethod === 'bank' ? 'bank' : 'provider'}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentMethod === 'bank' 
                             ? nigerianBanks.filter(b => !['Opay', 'Palmpay'].includes(b)).map(bank => <SelectItem key={bank} value={bank}>{bank}</SelectItem>)
                             : ['Opay', 'Palmpay'].map(wallet => <SelectItem key={wallet} value={wallet}>{wallet}</SelectItem>)
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="0123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Emeka" {...field} />
                        </FormControl>
                        <FormDescription>
                          Ensure this matches the name on your account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Save Details</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Transaction History</CardTitle>
                <CardDescription>
                  A record of all your instant payouts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount (NGN)</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell className="font-medium">{tx.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-green-600">{tx.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>You have no transactions yet.</p>
                    <p className="text-sm">Watch some ads to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
             <Alert className="border-green-300 bg-green-50 text-green-900">
              <WalletCards className="h-4 w-4 !text-green-700" />
              <AlertTitle className="text-green-800">Lightning-Fast Transfers</AlertTitle>
              <AlertDescription>
                All rewards are instantly and automatically transferred to your saved payout method as soon as you earn them. No delays!
              </AlertDescription>
            </Alert>
        </div>
      </div>
    </div>
  );
}
