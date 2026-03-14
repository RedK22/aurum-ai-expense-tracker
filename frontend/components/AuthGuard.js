"use client";

const {useRouter} = require("next/navigation");
const {useEffect} = require("react");

export default function AuthGuard({children}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
    }
  }, []);

  return children;
}
