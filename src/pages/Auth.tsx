
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signIn, signUp, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login Error',
            description: error.message,
            variant: 'destructive'
          });
        }
      } else {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName
        });
        if (error) {
          toast({
            title: 'Signup Error',
            description: error.message,
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-12 px-4">
        <h2 className="text-3xl font-display font-semibold text-center mb-6">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-coffee hover:bg-coffee-dark"
            disabled={loading}
          >
            {isLogin ? 'Login' : 'Create Account'}
          </Button>
        </form>
        
        <div className="text-center mt-4">
          <Button 
            variant="link" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin 
              ? 'Need an account? Sign up' 
              : 'Already have an account? Login'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
