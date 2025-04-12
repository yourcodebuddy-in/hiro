import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/supabase/actions";
import Link from "next/link";

export function RegisterForm() {
  return (
    <Card className="max-w-xl w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Create an account with your email and password</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={signup}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                name="email"
                required
                defaultValue="demo2@demo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                name="password"
                required
                defaultValue="1234567890"
              />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
