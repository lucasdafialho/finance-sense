import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'default' | 'white' | 'gradient';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 40,
  variant = 'default' 
}) => {
  const colors = {
    default: {
      primary: '#77C9A4',
      secondary: '#548687',
      accent: '#A1EBD0'
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#F0F0F0',
      accent: '#FFFFFF'
    },
    gradient: {
      primary: 'url(#gradient-primary)',
      secondary: 'url(#gradient-secondary)',
      accent: 'url(#gradient-accent)'
    }
  };

  const currentColors = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#77C9A4" />
            <stop offset="100%" stopColor="#548687" />
          </linearGradient>
          <linearGradient id="gradient-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A1EBD0" />
            <stop offset="100%" stopColor="#77C9A4" />
          </linearGradient>
          <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#548687" />
            <stop offset="100%" stopColor="#A1EBD0" />
          </linearGradient>
        </defs>
      )}
      
      {/* Círculo externo */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill={currentColors.accent}
        opacity="0.2"
      />
      
      {/* Círculo principal */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill={currentColors.primary}
      />
      
      {/* Símbolo de dinheiro estilizado */}
      <path
        d="M50 20 C50 20, 35 25, 35 40 C35 48, 40 52, 50 52 C60 52, 65 56, 65 64 C65 79, 50 84, 50 84"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Linha vertical do cifrão */}
      <line
        x1="50"
        y1="15"
        x2="50"
        y2="28"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="72"
        x2="50"
        y2="85"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Elementos decorativos - gráfico de crescimento */}
      <path
        d="M20 70 L30 60 L40 65 L50 45"
        stroke={currentColors.secondary}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />
      
      {/* Pontos do gráfico */}
      <circle cx="20" cy="70" r="2" fill={currentColors.secondary} opacity="0.8" />
      <circle cx="30" cy="60" r="2" fill={currentColors.secondary} opacity="0.8" />
      <circle cx="40" cy="65" r="2" fill={currentColors.secondary} opacity="0.8" />
      <circle cx="50" cy="45" r="2" fill={currentColors.secondary} opacity="0.8" />
    </svg>
  );
};

export const LogoWithText: React.FC<{ className?: string; size?: number }> = ({ 
  className = '',
  size = 40 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Logo size={size} variant="gradient" />
      <div className="ml-3">
        <h1 className="text-xl font-bold text-finance-text dark:text-white leading-none">
          FinanceSense
        </h1>
        <p className="text-xs text-muted-foreground">
          Inteligência Financeira
        </p>
      </div>
    </div>
  );
}; 