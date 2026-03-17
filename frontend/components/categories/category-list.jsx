"use client";

import {useEffect, useState} from "react";
import {apiRequest, getCategories} from "@/lib/api";

import CategoryItem from "./category-item";
import CreateCategoryDialog from "./create-category-dialog";

import {Skeleton} from "@/components/ui/skeleton";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
    setLoading(false);
  }, []);

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories</h2>

        <CreateCategoryDialog onCreated={addCategory} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
