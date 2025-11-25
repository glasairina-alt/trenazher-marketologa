import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserWithRole {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  created_at: string;
  role: "admin" | "user" | "premium_user";
}

type UserRole = "admin" | "user" | "premium_user";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentAuthUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  const isAdmin = currentAuthUser?.role === "admin";

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [authLoading, currentAuthUser]);

  const checkAdminAccess = async () => {
    if (!currentAuthUser) {
      navigate("/");
      return;
    }

    if (currentAuthUser.role !== "admin") {
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав администратора",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    await loadUsers();
  };

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get<{ users: UserWithRole[] }>('/api/users');
      setUsers(response.users);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось загрузить пользователей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      if (newRole === "admin") {
        toast({
          title: "Действие запрещено",
          description: "Только суперадминистратор может назначать роль admin",
          variant: "destructive",
        });
        return;
      }

      await api.patch<{ user: UserWithRole }>(`/api/users/${userId}/role`, {
        role: newRole,
      });

      toast({
        title: "Роль изменена",
        description: "Роль пользователя успешно обновлена",
      });

      loadUsers();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось изменить роль",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserName) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      setAddingUser(true);

      // Create user via admin endpoint (sets created_by_admin = true)
      await api.post('/api/users', {
        email: newUserEmail,
        password: newUserPassword,
        name: newUserName,
        phone: null,
        role: 'premium_user',
      });

      toast({
        title: "Пользователь добавлен",
        description: "Новый пользователь с полным доступом успешно создан",
      });

      setIsAddUserOpen(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserName("");
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать пользователя",
        variant: "destructive",
      });
    } finally {
      setAddingUser(false);
    }
  };

  if (authLoading || loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Админ-панель</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/content")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Управление контентом
            </Button>
            <Button onClick={() => setIsAddUserOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить пользователя
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Управление пользователями</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Пользователи не найдены
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Дата регистрации</th>
                      <th className="text-left py-3 px-4">Роль</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border">
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          {new Date(user.created_at).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={user.role || "user"}
                            onValueChange={(value: UserRole) =>
                              handleRoleChange(user.id, value)
                            }
                            disabled={user.id === currentAuthUser?.id || user.role === "admin"}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="premium_user">Premium User</SelectItem>
                              <SelectItem value="admin" disabled>
                                Admin
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить пользователя с полным доступом</DialogTitle>
            <DialogDescription>
              Создайте нового пользователя с ролью Premium User. У него будет полный доступ к сервису без оплаты, но без права управлять администраторами.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Имя пользователя"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                data-testid="input-admin-add-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                data-testid="input-admin-add-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                data-testid="input-admin-add-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddUserOpen(false);
                setNewUserEmail("");
                setNewUserPassword("");
                setNewUserName("");
              }}
            >
              Отмена
            </Button>
            <Button onClick={handleAddUser} disabled={addingUser}>
              {addingUser ? "Создание..." : "Создать пользователя"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
