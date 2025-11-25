import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { ArrowLeft, Plus, Settings, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [deleteUserEmail, setDeleteUserEmail] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

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

  const handleDeleteClick = (userId: number, userEmail: string) => {
    setDeleteUserId(userId);
    setDeleteUserEmail(userEmail);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;

    try {
      setDeletingUser(true);

      await api.delete(`/api/users/${deleteUserId}`);

      toast({
        title: "Пользователь удален",
        description: "Пользователь успешно удален из системы",
      });

      setIsDeleteDialogOpen(false);
      setDeleteUserId(null);
      setDeleteUserEmail("");
    } catch (error: any) {
      // Handle 404 specifically (user already deleted in another session)
      if (error.message?.includes('не найден') || error.message?.includes('not found')) {
        toast({
          title: "Пользователь уже удален",
          description: "Этот пользователь был удален в другой сессии",
        });
        setIsDeleteDialogOpen(false);
        setDeleteUserId(null);
        setDeleteUserEmail("");
      } else {
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось удалить пользователя",
          variant: "destructive",
        });
      }
    } finally {
      setDeletingUser(false);
      // Always refresh the list to handle concurrent deletions
      loadUsers();
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
                      <th className="text-left py-3 px-4">Действия</th>
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
                            <SelectTrigger className="w-[180px]" data-testid={`select-role-${user.id}`}>
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
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(user.id, user.email)}
                            disabled={user.id === currentAuthUser?.id}
                            data-testid={`button-delete-user-${user.id}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить пользователя <strong>{deleteUserEmail}</strong>?
              Это действие нельзя отменить. Все данные пользователя будут безвозвратно удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setDeleteUserId(null);
                setDeleteUserEmail("");
              }}
              data-testid="button-cancel-delete"
            >
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletingUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deletingUser ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
