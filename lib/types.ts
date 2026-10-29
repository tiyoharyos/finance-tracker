export type CategoryType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
};

export type Transaction = {
  id: string;
  amount: number;
  note: string | null;
  transaction_date: string; // yyyy-MM-dd
  category_id: string | null;
};

export type ActionState = { error?: string; ok?: boolean } | undefined;
