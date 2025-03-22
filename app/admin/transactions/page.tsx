import * as React from "react";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import SearchInput from "@/components/others/SearchInput";
import ExportButton from "@/components/admin/export";
import Pagination from "@/components/admin/pagination";
import CleartButton from "@/components/admin/appointment/clear-button";
import SearchInputDate from "@/components/others/SearchInput Date";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string"
      ? searchParams.search.trim()
      : undefined;
  const date =
    typeof searchParams.date === "string" && searchParams.date.trim()
      ? searchParams.date
      : undefined;

  const where: Prisma.TransactionWhereInput = {
    ...(search
      ? { transactionId: { contains: search, mode: "insensitive" } }
      : {}),
    ...(date
      ? {
          createdAt: {
            gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
          },
        }
      : {}),
  };

  const transactions = await db.transaction.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { appointment: true },
  });

  const totalTransactions = await db.transaction.count({ where });
  const totalPages = Math.ceil(totalTransactions / limit);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Transactions</h2>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            {!date && <SearchInput />}
            {!search && <SearchInputDate type="date" />}
            <CleartButton search={search || date} />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <ExportButton type="transaction" />
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_1fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div>Transaction ID</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Payment Method</div>
              <div>Created At</div>
            </div>

            <div className="divide-y">
              {transactions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No transactions found
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_1fr_auto] gap-4 p-4 hover:bg-gray-50 text-left"
                  >
                    <div>{transaction?.transactionId?.toUpperCase()}</div>
                    <div>₹{transaction.amount.toFixed(2)}</div>
                    <div
                      className={
                        transaction.status === "COMPLETED"
                          ? "text-green-500"
                          : transaction.status === "PENDING"
                            ? "text-yellow-500"
                            : transaction.status === "FAILED"
                              ? "text-red-500"
                              : "text-blue-500"
                      }
                    >
                      {transaction.status}
                    </div>
                    <div>{transaction.paymentMethod || "N/A"}</div>
                    <div>
                      {format(
                        new Date(transaction.createdAt),
                        "dd/MM/yyyy hh:mm a",
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Pagination
          searchParams={searchParams}
          total={totalTransactions}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
