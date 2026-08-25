"use client";
import Input from "@/components/atoms/InputField";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-lg mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="font-bold text-foreground text-4xl sm:text-xl">
              MASUK
            </h1>
            <p className="text-sm text-muted">
              Silakan masukkan nama lengkap dan kata sandi Anda untuk melanjutkan.
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    Nama Lengkap<span className="text-error">*</span>{" "}
                  </Label>
                  <Input placeholder="Masukkan nama Anda" type="text" />
                </div>
                <div>
                  <Label>
                    Kata Sandi <span className="text-error">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi Anda"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-muted hover:text-primary"
                    >
                      <Icon
                        icon={
                          showPassword
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                        width={20}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    href="/reset-password"
                    className="text-sm text-muted hover:text-primary"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <div>
                  <Button className="w-full">
                    MASUK
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-muted dark:text-muted/50 ">
                Belum memiliki akun?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-semibold hover:text-primary/90 dark:text-primary/30"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
