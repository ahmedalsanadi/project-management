import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';


export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: authService.getUser,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}


export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Refresh user data after login
    },
  });
}


export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.removeQueries({ queryKey: ['user'] }); // clear user data after logout
    },
  });
}
