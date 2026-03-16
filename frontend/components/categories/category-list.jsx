"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

import CategoryItem from "./category-item";
import CreateCategoryDialog from "./create-category-dialog";

import {Skeleton} from "@/components/ui/skeleton";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const data = await apiRequest("/categories/");
      const list = Array.isArray(data) ? data : data.results || [];
      setCategories(list);
    } catch (err) {
      console.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- LOCAL STATE UPDATES ---------- */

  function addCategory(category) {
    setCategories((prev) => [...prev, category]);
  }

  function updateCategory(updatedCategory) {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
    );
  }

  function removeCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateCategoryDialog onCreated={addCategory} />
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onUpdated={updateCategory}
            onDeleted={removeCategory}
          />
        ))}
      </div>
    </div>
  );
}
