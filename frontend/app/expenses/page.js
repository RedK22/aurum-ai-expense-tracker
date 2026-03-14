"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadExpenses(url = "/expenses/") {
    try {
      setLoading(true);

      const data = await apiRequest(url);

      setExpenses(data.results || []);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  if (loading) {
    return <p>Loading expenses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div style={{padding: "20px"}}>
        <h1>Expenses</h1>

        {expenses.length === 0 && <p>No expenses yet</p>}

        {expenses.map((exp) => (
          <div
            key={exp.id}
            style={{borderBottom: "1px solid #ddd", padding: "10px 0"}}
          >
            <strong>{exp.title}</strong>
            <div>
              {exp.amount} • {exp.category?.name}
            </div>
            <div>{exp.date}</div>
          </div>
        ))}

        <div style={{marginTop: "20px"}}>
          {prevPage && (
            <button onClick={() => loadExpenses(prevPage)}>Previous</button>
          )}

          {nextPage && (
            <button onClick={() => loadExpenses(nextPage)}>Next</button>
          )}
        </div>
      </div>
    </>
  );
}
