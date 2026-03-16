"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {login} from "@/lib/api";
import {toast} from "@/components/optics/sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/optics/card";
import {Input} from "@/components/optics/input";
import {Button} from "@/components/optics/button";
import {Label} from "@/components/optics/label";
import {StaggerButton} from "@/components/ui/stagger-button";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      toast({
        type: "success",
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
      toast({
        type: "error",
        title: "Login failed",
        description: err.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-100 bg-transparent backdrop-blur-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <StaggerButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </StaggerButton>
          </form>
        </CardContent>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="text-primary cursor-pointer underline hover:opacity-80"
            onClick={() => router.push("/register")}
          >
            Create here
          </span>
        </p>
      </Card>
    </div>
  );
}
