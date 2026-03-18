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
      let message = "Login failed";

      if (err?.status === 429) {
        message = err.message || "Too many login attempts. Please wait.";
      } else if (err?.status === 401) {
        message = "Incorrect username or password.";
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);

      toast({
        type: "error",
        title: "Login failed",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Welcome back. Enter your credentials.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <StaggerButton
              type="submit"
              className="bg-white/10 w-full border border-white/30 backdrop-blue-xl text-white"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </StaggerButton>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span
              className="text-primary cursor-pointer underline hover:opacity-80"
              onClick={() => router.push("/register")}
            >
              Create here
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
