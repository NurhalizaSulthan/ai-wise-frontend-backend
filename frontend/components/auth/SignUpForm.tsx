"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import Input from "@/components/atoms/InputField";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";

export default function SignUpForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  // Form data
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validasi
    if (!nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!password) {
      setError("Kata sandi wajib diisi.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      console.log("API URL:", apiUrl);

      const response = await fetch(`${apiUrl}/api/v1/pengawas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: nama.trim(),
          role: "Pengawas",
          password: password,
        }),
      });

      console.log("Status:", response.status);
      console.log("URL:", response.url);

      const data = await response.json();

      console.log("Register response:", data);

      if (!response.ok) {
        setError(data.message || "Pendaftaran gagal.");
        return;
      }

      setSuccess("Pendaftaran berhasil. Silakan masuk.");

      // Setelah berhasil daftar, arahkan ke signin
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label>
                  Nama Lengkap
                  <span className="text-error">*</span>
                </Label>

                <Input
                  placeholder="Masukkan nama Anda"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div>
                <Label>
                  Kata Sandi
                  <span className="text-error">*</span>
                </Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  Konfirmasi Kata Sandi
                  <span className="text-error">*</span>
                </Label>

                <div className="relative">
                  <Input
                    type={confirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi kata sandi Anda"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
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

              {error && <p className="text-sm text-error">{error}</p>}

              {success && <p className="text-sm text-green-500">{success}</p>}

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "MEMPROSES..." : "DAFTAR"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-muted dark:text-muted/50">
              Sudah punya akun?{" "}
              <Link
                href="/signin"
                className="text-primary font-semibold hover:text-primary/90 dark:text-primary/30"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
