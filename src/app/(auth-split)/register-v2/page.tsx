"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Github, User } from "lucide-react";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
import { Separator } from "@dashboardpack/core/components/ui/separator";

export default function RegisterV2Page() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.info("Demo mode — no backend connected");
  }

  return (
    <>
      <title>Create Account — Zenith Dashboard</title>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started with your free account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Terms agreement */}
        <div className="flex items-start gap-2">
          <Checkbox id="terms" className="mt-0.5" required />
          <Label
            htmlFor="terms"
            className="font-normal text-sm leading-snug"
          >
            I agree to the{" "}
            <Link
              href="#"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Privacy Policy
            </Link>
          </Label>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>

      {/* Separator */}
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
          Or continue with
        </span>
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button">
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
        <Button variant="outline" type="button">
          <Github className="size-4" />
          GitHub
        </Button>
      </div>

      {/* Sign in link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login-v2"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
