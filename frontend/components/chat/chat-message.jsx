export default function ChatMessage({message}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-2xl px-4 py-3 max-w-[80%] shadow-md border ${
          isUser
            ? "bg-white/10 border-white/10 backdrop-blur-xl"
            : "bg-white/5 border-white/10 backdrop-blur-xl"
        }`}
      >
        {/* Expense Created */}
        {message.expenseCreated && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-green-400">
              ✅ Expense Created
            </div>

            <div className="border border-white/10 rounded-lg p-3 bg-white/5 text-sm">
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
                className="border border-white/10 rounded-lg p-3 bg-white/5 text-sm"
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

        {/* Normal message */}
        {!message.expenseCreated && !message.expenses && (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
      </div>
    </div>
  );
}
