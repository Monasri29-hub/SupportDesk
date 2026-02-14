import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

interface LoginFormProps {
    role: 'customer' | 'support';
    onBack: () => void;
}

export function LoginForm({ role, onBack }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: role === 'customer' ? 'john.smith@email.com' : 'sarah@supportteam.com',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const success = login(values.email, role);

            if (success) {
                const name = values.email.split('@')[0];
                const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
                toast({
                    title: "Login successful",
                    description: `Welcome back, ${capitalizedName}!`,
                });
                // Navigation is handled by useEffect in LoginPage, but we can also force it here if needed
                // navigate(`/${role}`); 
            } else {
                toast({
                    variant: "destructive",
                    title: "Login failed",
                    description: "Invalid credentials. Please try again.",
                });
            }
            setIsLoading(false);
        }, 1500);
    }

    return (
        <div className="w-full max-w-sm animate-fade-in">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                    {role === 'customer' ? 'Customer Login' : 'Support Login'}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Enter your credentials to access the {role === 'customer' ? 'portal' : 'dashboard'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="name@example.com" className="pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input type="password" placeholder="••••••••" className="pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-4 pt-2">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={onBack}
                            disabled={isLoading}
                        >
                            Back to Selection
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
