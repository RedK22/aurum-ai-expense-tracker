"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {apiRequest} from "@/lib/api";
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

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiRequest("/auth/signup/", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      toast({
        type: "success",
        title: "Registration successful",
        description: `Account created for ${username}. Please log in.`,
      });
      router.push("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
      toast({
        type: "error",
        title: "Registration failed",
        description: err.message || "Could not create account",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-100 bg-transparent backdrop-blur-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
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
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Creating..." : "Sign Up"}
            </StaggerButton>
          </form>
        </CardContent>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer underline hover:opacity-80"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
      </Card>
    </div>
  );
}
