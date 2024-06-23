import React from "react";
import { Input } from "./ui/input";

const AmountFilter = ({
  amount,
  setAmount,
}: {
  amount: string;
  setAmount: (amount: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-muted-foreground">Minimum Amount in €</p>
      <Input
        type="number"
        placeholder="Amount"
        className="w-[150px] bg-white"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>
  );
};

export default AmountFilter;
