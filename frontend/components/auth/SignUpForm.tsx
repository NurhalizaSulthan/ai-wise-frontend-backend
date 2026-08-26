"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import Input from "@/components/atoms/InputField";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-lg mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="font-bold text-foreground text-xl sm:text-xl">
              DAFTAR
            </h1>
            <p className="text-sm text-muted">
              Silakan lengkapi data Anda untuk membuat akun.
            </p>
          </div>
          <form>
            <div className="space-y-5">
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
              <div>
                <Label>
                  Konfirmasi Kata Sandi <span className="text-error">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input
                    type={confirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi kata sandi Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPassword(!confirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-muted hover:text-primary"
                  >
                    <Icon
                      icon={
                        confirmPassword
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                      width={20}
                    />
                  </button>
                </div>
              </div>
              <div>
                <Button className="w-full" size="sm">
                  DAFTAR
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-muted dark:text-muted/50 ">
              Sudah punya akun?{" "}
              <Link href="/signin" className="text-primary font-semibold hover:text-primary/90 dark:text-primary/30">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}