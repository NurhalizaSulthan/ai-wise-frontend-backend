"use client";
import Checkbox from "@/components/atoms/Checkbox";
import Input from "@/components/atoms/InputField";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">

        {/* // TODO: Hapus kalau udah gak digunakan */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-foreground text-2xl  sm:text-xl">
              Sign In
            </h1>
            <p className="text-sm text-muted">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" type="email" />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    ></span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-muted">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-muted hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
                <div>
                  <Button variant="secondary" className="w-full" size="sm" startIcon={<Icon icon="material-icon-theme:google" width={20} />}>
                    Sign in with Google
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-muted dark:text-muted/50 ">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary/50 dark:text-primary/30"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;