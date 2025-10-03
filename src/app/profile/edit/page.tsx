"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface UpdateUser {
  firstName: string;
  lastName: string;
  ppUrl?: string;
  interests: string[];
}

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<UpdateUser>({
    firstName: "",
    lastName: "",
    ppUrl: "",
    interests: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // fetch current user info
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/session"); // next-auth session
        const session = await res.json();

        if (!session?.user?.id) {
          router.push("/api/auth/signin");
          return;
        }

        const userRes = await fetch(`/api/users/${session.user.id}`);
        if (userRes.ok) {
          const user = await userRes.json();
          setForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            ppUrl: user.ppUrl || "",
            interests: user.interests || [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const resSession = await fetch("/api/auth/session");
      const session = await resSession.json();

      if (!session?.user?.id) {
        router.push("/api/auth/signin");
        return;
      }

      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update user");

      router.push("/profile"); // go back to profile
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleInterestsChange(value: string) {
    setForm((prev) => ({
      ...prev,
      interests: value.split(",").map((i) => i.trim()),
    }));
  }

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900 py-10">
      <div className="max-w-xl mx-auto bg-white dark:bg-stone-800 rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-gray-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-gray-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Picture URL
            </label>
            <input
              type="text"
              name="ppUrl"
              value={form.ppUrl}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-gray-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Interests (comma separated)
            </label>
            <input
              type="text"
              name="interests"
              value={form.interests.join(", ")}
              onChange={(e) => handleInterestsChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-gray-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-stone-600 bg-gray-100 dark:bg-stone-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-stone-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
