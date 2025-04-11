import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/supabase/actions";
import Link from "next/link";

export function LoginForm() {
  return (
    <Card className="max-w-xl w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login with your Google account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={login}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" name="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" name="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
        <div className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-semibold">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
