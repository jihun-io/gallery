"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  createdAt: Date;
}

interface Props {
  user: User;
  currentUserId: string;
}

export default function UserEditClient({ user, currentUserId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: user.email,
    name: user.name,
    role: user.role,
    password: "",
    confirmPassword: "",
  });

  const isCurrentUser = user.id === currentUserId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords if changing
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
    }

    setLoading(true);

    try {
      const updateData: {
        email: string;
        name: string;
        role: string;
        password?: string;
      } = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update user");
      }

      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      setError(getErrorMessage(error) || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isCurrentUser) {
      setError("자신의 계정을 삭제할 수 없습니다.");
      return;
    }

    if (!confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      setError(getErrorMessage(error) || "Failed to delete user");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">사용자 편집</h1>
            <p className="text-gray-600">
              {new Date(user.createdAt).toLocaleDateString("ko-KR")}에 생성됨
              {isCurrentUser && (
                <span className="ml-2 text-blue-600">(내 계정)</span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting || isCurrentUser}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          title={isCurrentUser ? "Cannot delete yourself" : "Delete user"}
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          삭제
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isCurrentUser && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          자신의 계정을 수정하고 있습니다. 역할이나 이메일을 변경할 때
          주의하세요.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일 *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름 *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            역할 *
          </label>
          <select
            required
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as "ADMIN" | "EDITOR" | "VIEWER",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="VIEWER">뷰어 - 읽기 전용</option>
            <option value="EDITOR">편집자 - 콘텐츠 관리 가능</option>
            <option value="ADMIN">관리자 - 전체 접근 가능</option>
          </select>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">비밀번호 변경</h3>
          <p className="text-sm text-gray-600 mb-4">
            현재 비밀번호를 유지하려면 비워두세요.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="최소 8글자"
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호 확인"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                변경 사항 저장
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
