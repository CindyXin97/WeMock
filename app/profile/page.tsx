"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type UserProfile = {
  username: string;
  nickname?: string;
  targetRole?: string;
  workExperience?: string;
  practiceAreas?: string[];
  targetIndustry?: string;
  targetCompany?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    username: "",
    nickname: "",
    targetRole: "",
    workExperience: "",
    practiceAreas: [],
    targetIndustry: "",
    targetCompany: "",
  });

  useEffect(() => {
    // 获取用户信息
    const getUserInfo = async () => {
      try {
        setLoading(true);
        // 调用API获取用户信息
        const response = await fetch("/api/auth/me");
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // 用获取到的数据填充表单
          setFormData(data.user || formData);
        } else {
          // 如果API返回错误，可能是未登录
          console.error("Failed to get user info");
          // 这里不做重定向，因为middleware会处理未认证的请求
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "资料已更新",
          description: "您的个人资料已成功保存",
        });
        // 更新本地用户数据
        setUser(formData);
      } else {
        const data = await response.json();
        toast({
          variant: "destructive",
          title: "保存失败",
          description: data.error || "无法更新个人资料",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "保存失败",
        description: "服务器错误，请稍后重试",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      // 调用登出API清除cookie
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // 无论API调用成功与否，都重定向到首页
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">加载中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">个人资料</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/matching')}>
            返回匹配
          </Button>
        </div>
      </div>

      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-blue-800">
              填写个人资料是可选的，但完善资料可以提高匹配度，帮助您找到更合适的练习伙伴。
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">用户名不可更改</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">昵称</Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    value={formData.nickname || ""}
                    onChange={handleChange}
                    placeholder="您希望展示的名称"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetRole">目标岗位</Label>
                  <select
                    id="targetRole"
                    name="targetRole"
                    value={formData.targetRole || ""}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">请选择</option>
                    <option value="DA">数据分析师 (DA)</option>
                    <option value="DS">数据科学家 (DS)</option>
                    <option value="DE">数据工程师 (DE)</option>
                    <option value="Other">其他数据相关岗位</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workExperience">工作年限</Label>
                  <select
                    id="workExperience"
                    name="workExperience"
                    value={formData.workExperience || ""}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">请选择</option>
                    <option value="0">应届生</option>
                    <option value="1-3">1-3年</option>
                    <option value="4-5">4-5年</option>
                    <option value=">5">5年以上</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetIndustry">目标行业</Label>
                  <Input
                    id="targetIndustry"
                    name="targetIndustry"
                    value={formData.targetIndustry || ""}
                    onChange={handleChange}
                    placeholder="例如：互联网、金融、医疗等"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetCompany">目标公司</Label>
                  <Input
                    id="targetCompany"
                    name="targetCompany"
                    value={formData.targetCompany || ""}
                    onChange={handleChange}
                    placeholder="例如：字节跳动、阿里巴巴等"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={saving}>
                  {saving ? "保存中..." : "保存资料"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>模拟面试记录</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">暂无模拟面试记录</p>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLogout}
            variant="destructive"
          >
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
} 