export default function ChatMessage({message}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg px-4 py-3 max-w-[80%] ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {/* Expense Created */}
        {message.expenseCreated && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-green-500">
              ✅ Expense Created
            </div>

            <div className="border rounded-md p-3 bg-background text-sm">
              <div className="font-medium">{message.expenseCreated.title}</div>

              <div className="text-lg font-semibold">
                ₹{message.expenseCreated.amount}
              </div>

              <div className="text-xs text-muted-foreground">
                {message.expenseCreated.category} •{" "}
                {message.expenseCreated.date}
              </div>
            </div>
          </div>
        )}

        {/* Expense List */}
        {message.expenses && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">Expenses</div>

            {message.expenses.map((e, i) => (
              <div
                key={i}
                className="border rounded-md p-3 bg-background text-sm"
              >
                <div className="font-medium">
                  ₹{e.amount} — {e.title}
                </div>

                <div className="text-xs text-muted-foreground">
                  {e.category} • {e.date}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Normal AI message */}
        {!message.expenseCreated && !message.expenses && (
          <p className="text-sm">{message.content}</p>
        )}
      </div>
    </div>
  );
}
