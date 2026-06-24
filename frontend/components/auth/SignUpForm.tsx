"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import Checkbox from "@/components/atoms/Checkbox";
import Input from "@/components/atoms/InputField";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        {/* TODO: Hapus kalau sudah tidak digunakan */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted transition-colors hover:text-primary"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-foreground text-2xl sm:text-xl">
              Sign Up
            </h1>

            <p className="text-sm text-muted">
              Enter your email and password to sign up!
            </p>
          </div>

          <form>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    First Name <span className="text-danger">*</span>
                  </Label>

                  <Input
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="sm:col-span-1">
                  <Label>
                    Last Name <span className="text-danger">*</span>
                  </Label>

                  <Input
                    type="text"
                    id="lname"
                    name="lname"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label>
                  Email <span className="text-danger">*</span>
                </Label>

                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label>
                  Password <span className="text-danger">*</span>
                </Label>

                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-muted hover:text-primary"
                  >
                    <Icon
                      icon={showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"}
                      width={20}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  className="w-5 h-5 mt-0.5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />

                <p className="text-sm font-normal text-muted">
                  By creating an account means you agree to the{" "}
                  <span className="text-foreground font-medium">
                    Terms and Conditions
                  </span>
                  , and our{" "}
                  <span className="text-foreground font-medium">
                    Privacy Policy
                  </span>
                </p>
              </div>

              <div>
                <Button className="w-full" size="sm">
                  Sign Up
                </Button>
              </div>

              <div>
                <Button
                  variant="secondary"
                  className="w-full"
                  size="sm"
                  startIcon={
                    <Icon icon="material-icon-theme:google" width={20} />
                  }
                >
                  Sign up with Google
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-muted">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:text-primary/70">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}