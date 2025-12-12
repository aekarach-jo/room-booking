import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Moon, Sun, BookOpen } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { access_token } = await authService.login(username, password);
      login(access_token);
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-foreground" />
        )}
      </button>

      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border border-border">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ยินดีต้อนรับ</h1>
          <p className="text-muted-foreground">เข้าสู่ระบบจองห้องเรียน</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors shadow-sm"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">หรือ</span>
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
