import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Shield, User as UserIcon } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type UserRole = "admin" | "user";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  role: UserRole | null;
}

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/");
        return;
      }

      setCurrentUser(user);

      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin access:', error);
        navigate("/");
        return;
      }

      if (roleData?.role !== 'admin') {
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав администратора",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadUsers();
    } catch (error) {
      console.error('Error:', error);
      navigate("/");
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Получаем токен сессии
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session');
      }

      // Вызываем edge function для получения списка пользователей
      const { data: usersData, error: usersError } = await supabase.functions.invoke('list-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (usersError) throw usersError;

      // Получаем роли пользователей
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Объединяем данные
      const usersWithRoles: UserWithRole[] = (usersData?.users || []).map((user: any) => {
        const roleEntry = rolesData?.find(r => r.user_id === user.id);
        return {
          id: user.id,
          email: user.email || 'Нет email',
          created_at: user.created_at,
          role: roleEntry?.role || null,
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // Проверяем, существует ли запись роли
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingRole) {
        // Обновляем существующую роль
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Создаем новую запись роли
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });

        if (error) throw error;
      }

      toast({
        title: "Роль обновлена",
        description: `Роль пользователя успешно изменена на ${newRole}`,
      });

      loadUsers();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Панель администратора</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Управление пользователями</CardTitle>
            <CardDescription>
              Просмотр и изменение ролей пользователей
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Загрузка...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Пользователи не найдены</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Дата регистрации</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.role === 'admin' && (
                              <Shield className="h-4 w-4 text-primary" />
                            )}
                            <span className={user.role === 'admin' ? 'text-primary font-medium' : ''}>
                              {user.role === 'admin' ? 'Администратор' : user.role === 'user' ? 'Пользователь' : 'Нет роли'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role || 'user'}
                            onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                            disabled={user.id === currentUser?.id}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Пользователь</SelectItem>
                              <SelectItem value="admin">Администратор</SelectItem>
                            </SelectContent>
                          </Select>
                          {user.id === currentUser?.id && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Нельзя изменить свою роль
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
