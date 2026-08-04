import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Minus,
  Briefcase,
  Home as HomeIcon,
  BookOpen,
  Calendar,
  AlertTriangle,
  Info,
  Sliders,
  Bell,
  Sun,
  Moon,
  Trash2,
  FileText,
  Lock,
  Menu,
  MoreVertical,
  Activity,
  Award,
  CircleCheck,
  Coins
} from 'lucide-react';

/* ==========================================================================
   SPACING & COLOR VALUES FOR REFERENCE
   ========================================================================== */
export const DESIGN_TOKENS = {
  colors: {
    primary: '#1A56A0',
    primaryDark: '#0F3D7A',
    primaryLight: '#E8F0FA',
    accentGold: '#C9A84C',
    success: '#059669',
    warning: '#F97316',
    error: '#EF4444',
    aiAccent: '#EAB308',
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8F9FA',
    bgTertiary: '#F1F3F5',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    borderDefault: '#E5E7EB',
    borderFocus: '#1A56A0'
  }
};

/* ==========================================================================
   1. BUTTONS
   ========================================================================== */
interface DSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const DSButton: React.FC<DSButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A56A0] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-xs rounded-xl',
    lg: 'px-6 py-3.5 text-sm rounded-2xl'
  };

  const variantStyles = {
    primary: 'bg-[#1A56A0] hover:bg-[#0F3D7A] text-white shadow-md shadow-blue-500/10 active:scale-98',
    secondary: 'bg-white hover:bg-gray-50 border border-gray-200 text-[#1A56A0] dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-700/50',
    ghost: 'bg-transparent hover:bg-gray-100/60 dark:hover:bg-slate-800/60 text-[#1A56A0] dark:text-blue-400',
    destructive: 'bg-[#EF4444] hover:bg-red-600 text-white shadow-md shadow-red-500/10 active:scale-98',
    success: 'bg-[#059669] hover:bg-[#047857] text-white shadow-md shadow-green-500/10 active:scale-98',
    icon: 'p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700/60 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-1.5">
          <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

/* ==========================================================================
   2. FORM INPUTS
   ========================================================================== */
interface BaseInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  charCount?: number;
  maxChar?: number;
}

export const DSTextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & BaseInputProps> = ({
  label,
  helperText,
  errorMessage,
  charCount,
  maxChar,
  disabled,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          className={`w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border ${
            errorMessage ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-gray-200 dark:border-slate-700 focus:ring-[#1A56A0]'
          } rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-slate-800/50`}
          {...props}
        />
      </div>
      <div className="flex justify-between items-start mt-1.5 px-1">
        {errorMessage ? (
          <p className="text-[11px] font-semibold text-[#EF4444] flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errorMessage}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-gray-400 dark:text-gray-500">{helperText}</p>
        ) : (
          <div />
        )}
        {maxChar && typeof charCount === 'number' && (
          <span className="text-[11px] text-gray-400">
            {charCount}/{maxChar}
          </span>
        )}
      </div>
    </div>
  );
};

export const DSPasswordInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & BaseInputProps> = ({
  label,
  helperText,
  errorMessage,
  disabled,
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          className={`w-full pl-4 pr-11 py-3 text-sm bg-white dark:bg-slate-800 border ${
            errorMessage ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-gray-200 dark:border-slate-700 focus:ring-[#1A56A0]'
          } rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
        >
          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
        </button>
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const DSSearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & BaseInputProps> = ({
  label,
  helperText,
  errorMessage,
  disabled,
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Search className="h-4 w-4" />
        </span>
        <input
          id={id}
          type="text"
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-800 border ${
            errorMessage ? 'border-[#EF4444]' : 'border-gray-200 dark:border-slate-700'
          } rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent focus:outline-none transition-all disabled:opacity-50`}
          {...props}
        />
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const DSTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & BaseInputProps> = ({
  label,
  helperText,
  errorMessage,
  charCount,
  maxChar,
  disabled,
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        disabled={disabled}
        rows={4}
        className={`w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border ${
          errorMessage ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-gray-200 dark:border-slate-700 focus:ring-[#1A56A0]'
        } rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50`}
        {...props}
      />
      <div className="flex justify-between items-start mt-1.5 px-1">
        {errorMessage ? (
          <p className="text-[11px] font-semibold text-[#EF4444] flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errorMessage}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-gray-400 dark:text-gray-500">{helperText}</p>
        ) : (
          <div />
        )}
        {maxChar && typeof charCount === 'number' && (
          <span className="text-[11px] text-gray-400">
            {charCount}/{maxChar}
          </span>
        )}
      </div>
    </div>
  );
};

interface Option {
  value: string;
  label: string;
}

export const DSSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & BaseInputProps & { options: Option[] }> = ({
  label,
  helperText,
  errorMessage,
  options,
  disabled,
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          disabled={disabled}
          className={`w-full pl-4 pr-10 py-3 text-sm bg-white dark:bg-slate-800 border ${
            errorMessage ? 'border-[#EF4444]' : 'border-gray-200 dark:border-slate-700'
          } rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent focus:outline-none transition-all disabled:opacity-50 appearance-none`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown className="h-4.5 w-4.5" />
        </span>
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const DSMultiSelect: React.FC<{
  label?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
}> = ({ label, options, selectedValues, onChange, placeholder = "Select items...", helperText, errorMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== value));
  };

  return (
    <div className="w-full text-left relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[46px] w-full px-3.5 py-2 bg-white dark:bg-slate-800 border ${
          errorMessage ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
        } rounded-xl text-sm flex flex-wrap gap-1.5 items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-[#1A56A0]`}
      >
        <div className="flex flex-wrap gap-1.5">
          {selectedValues.length === 0 ? (
            <span className="text-gray-400 dark:text-gray-500 text-xs">{placeholder}</span>
          ) : (
            selectedValues.map(val => {
              const labelText = options.find(o => o.value === val)?.label || val;
              return (
                <span key={val} className="inline-flex items-center gap-1 bg-[#E8F0FA] text-[#1A56A0] dark:bg-slate-700 dark:text-blue-300 px-2 py-0.5 rounded-lg text-xs font-bold">
                  {labelText}
                  <button type="button" onClick={(e) => handleRemove(val, e)} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown className={`h-4.5 w-4.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto p-1.5">
          {options.map(opt => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => handleToggle(opt.value)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                  isSelected ? 'bg-[#E8F0FA] text-[#1A56A0] dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-slate-700/60 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            );
          })}
        </div>
      )}

      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const DSCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled }) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-left select-none text-xs font-bold text-gray-700 dark:text-gray-300">
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded text-[#1A56A0] border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-[#1A56A0]"
      />
      <span className={disabled ? 'opacity-55' : ''}>{label}</span>
    </label>
  );
};

export const DSRadio: React.FC<{
  label: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ label, name, checked, onChange, disabled }) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-left select-none text-xs font-bold text-gray-700 dark:text-gray-300">
      <input
        type="radio"
        name={name}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-[#1A56A0] border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-[#1A56A0]"
      />
      <span className={disabled ? 'opacity-55' : ''}>{label}</span>
    </label>
  );
};

export const DSToggleSwitch: React.FC<{
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled }) => {
  return (
    <div className="flex items-center justify-between text-left py-1">
      {label && <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1A56A0] focus:ring-offset-2 ${
          checked ? 'bg-[#1A56A0]' : 'bg-gray-200 dark:bg-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export const DSFileUpload: React.FC<{
  label?: string;
  onFileSelect: (file: File) => void;
  accept?: string;
  helperText?: string;
  errorMessage?: string;
}> = ({ label, onFileSelect, accept = ".pdf,.dwg,.zip,.jpg,.png", helperText, errorMessage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#1A56A0] bg-[#E8F0FA]/40 dark:bg-slate-800/40'
            : selectedFile
            ? 'border-[#059669] bg-green-50/20 dark:bg-green-950/5'
            : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/40'
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        {selectedFile ? (
          <div className="space-y-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{selectedFile.name}</p>
              <p className="text-[10px] text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              Ready to Upload
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Drag & drop technical files here</p>
              <p className="text-[10px] text-gray-400 mt-1">or click to browse from device</p>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Supports PDF, CAD (DWG), ZIP or Images</p>
          </div>
        )}
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const DSNigerianPhoneInput: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  helperText?: string;
}> = ({ label = "Phone Number", value, onChange, errorMessage, helperText }) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative flex rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-[#1A56A0] focus-within:border-transparent transition-all">
        <div className="flex items-center gap-1.5 px-3 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 select-none">
          <span className="text-base">🇳🇬</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">+234</span>
        </div>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          placeholder="8012345678"
          className="flex-1 px-4 py-3 text-sm bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none placeholder-gray-400"
        />
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText || "Enter 10 digits without leading 0"}</p>
      ) : null}
    </div>
  );
};

export const DSCurrencyInput: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  helperText?: string;
  placeholder?: string;
}> = ({ label, value, onChange, errorMessage, helperText, placeholder = "0.00" }) => {
  const formatNaira = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (!raw) return '';
    return Number(raw).toLocaleString('en-NG');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    onChange(raw);
  };

  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400 dark:text-gray-500">
          ₦
        </span>
        <input
          type="text"
          value={formatNaira(value)}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full pl-9 pr-4 py-3 text-sm bg-white dark:bg-slate-800 border ${
            errorMessage ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
          } rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent focus:outline-none transition-all`}
        />
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const DSDatePicker: React.FC<React.InputHTMLAttributes<HTMLInputElement> & BaseInputProps> = ({
  label,
  helperText,
  errorMessage,
  id,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type="date"
          className={`w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border ${
            errorMessage ? 'border-[#EF4444]' : 'border-gray-200 dark:border-slate-700'
          } rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent focus:outline-none transition-all`}
          {...props}
        />
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const DSNumberInput: React.FC<{
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  helperText?: string;
  errorMessage?: string;
}> = ({ label, value, onChange, min = 0, max = 999, helperText, errorMessage }) => {
  const handleInc = () => {
    if (value < max) onChange(value + 1);
  };
  const handleDec = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center w-36 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={handleDec}
          disabled={value <= min}
          className="p-3 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/60 disabled:opacity-30 cursor-pointer"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex-1 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
          {value}
        </span>
        <button
          type="button"
          onClick={handleInc}
          disabled={value >= max}
          className="p-3 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/60 disabled:opacity-30 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {errorMessage ? (
        <p className="text-[11px] font-semibold text-[#EF4444] mt-1.5 px-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">{helperText}</p>
      ) : null}
    </div>
  );
};

/* ==========================================================================
   3. CARDS
   ========================================================================== */
export const DSCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

export const DSInteractiveCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer ${className}`} {...props}>
      {children}
    </div>
  );
};

export const DSGlassCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`glass-panel rounded-3xl p-6 shadow-lg border border-white/25 dark:border-slate-700/10 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const DSStatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { val: string; isPositive: boolean };
}> = ({ icon, label, value, trend }) => {
  return (
    <DSCard className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-[#E8F0FA] text-[#1A56A0] dark:bg-slate-700 dark:text-blue-400 flex items-center justify-center font-bold">
        {icon}
      </div>
      <div className="text-left flex-1">
        <p className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider leading-none mb-1">{label}</p>
        <h3 className="text-xl font-bold font-sora tracking-tight text-gray-900 dark:text-white leading-none">{value}</h3>
      </div>
      {trend && (
        <div className={`text-right text-xs font-bold px-2 py-1 rounded-lg ${
          trend.isPositive ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {trend.val}
        </div>
      )}
    </DSCard>
  );
};

export const DSProfileCard: React.FC<{
  avatar: string | React.ReactNode;
  name: string;
  role: string;
  badge?: React.ReactNode;
  bio?: string;
}> = ({ avatar, name, role, badge, bio }) => {
  return (
    <DSCard className="text-center space-y-4">
      <div className="relative inline-block mx-auto">
        {typeof avatar === 'string' ? (
          <img src={avatar} alt={name} className="h-20 w-20 rounded-full object-cover border-4 border-[#E8F0FA] dark:border-slate-700 mx-auto" />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xl font-black text-[#1A56A0] dark:text-blue-400 mx-auto border-4 border-[#E8F0FA] dark:border-slate-700">
            {avatar}
          </div>
        )}
        {badge && <div className="absolute -bottom-1 -right-1">{badge}</div>}
      </div>
      <div>
        <h4 className="text-sm font-bold font-sora text-gray-900 dark:text-white">{name}</h4>
        <p className="text-[10px] uppercase font-black tracking-wider text-[#1A56A0] dark:text-blue-400 mt-1">{role}</p>
      </div>
      {bio && <p className="text-xs text-gray-500 leading-relaxed dark:text-gray-400">{bio}</p>}
    </DSCard>
  );
};

export const DSProductCard: React.FC<{
  image: string;
  name: string;
  price: number;
  rating: number;
  onAction?: () => void;
}> = ({ image, name, price, rating, onAction }) => {
  return (
    <DSInteractiveCard className="p-0 overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          <img src={image} alt={name} className="h-full w-full object-cover" />
          <div className="absolute top-2 right-2 bg-white/85 dark:bg-slate-900/85 px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-900 dark:text-white flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#EAB308] stroke-[#EAB308]" /> {rating.toFixed(1)}
          </div>
        </div>
        <div className="p-4 text-left">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">{name}</h4>
          <p className="text-sm font-black text-[#1A56A0] dark:text-blue-400 font-sora mt-2">₦{price.toLocaleString('en-NG')}</p>
        </div>
      </div>
      <div className="p-4 pt-0">
        <DSButton size="sm" className="w-full text-[10px]" onClick={onAction}>
          View Details
        </DSButton>
      </div>
    </DSInteractiveCard>
  );
};

export const DSHousePlanCard: React.FC<{
  image: string;
  title: string;
  beds: number;
  baths: number;
  area: number;
  cost: number;
  onAction?: () => void;
}> = ({ image, title, beds, baths, area, cost, onAction }) => {
  return (
    <DSInteractiveCard className="p-0 overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover" />
          <div className="absolute top-2 left-2 bg-blue-600/95 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded">
            Pre-designed Plan
          </div>
        </div>
        <div className="p-4 text-left space-y-2">
          <h4 className="text-xs font-bold font-sora text-gray-900 dark:text-white line-clamp-1">{title}</h4>
          <div className="grid grid-cols-3 gap-2 py-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 border-y border-gray-100 dark:border-slate-700/80">
            <div>🛏️ {beds} Beds</div>
            <div>🛁 {baths} Baths</div>
            <div>📐 {area} sqm</div>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] font-bold uppercase text-gray-400 leading-none">Est. Build Cost</span>
            <span className="text-xs font-black text-green-600 dark:text-green-400 font-sora">₦{cost.toLocaleString('en-NG')}</span>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <DSButton size="sm" variant="secondary" className="w-full text-[10px] gap-1.5" onClick={onAction}>
          View Blueprint <ArrowRight className="h-3.5 w-3.5" />
        </DSButton>
      </div>
    </DSInteractiveCard>
  );
};

export const DSProfessionalCard: React.FC<{
  avatar: string;
  name: string;
  profession: string;
  rating: number;
  badges: string[]; // COREN, ARCON, NIOB etc.
  onAction?: () => void;
}> = ({ avatar, name, profession, rating, badges, onAction }) => {
  return (
    <DSCard className="text-left flex flex-col justify-between h-full">
      <div className="space-y-3">
        <div className="flex gap-3">
          <img src={avatar} alt={name} className="h-14 w-14 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{name}</h4>
            <p className="text-[10px] uppercase font-black tracking-wider text-[#1A56A0] dark:text-blue-400 mt-0.5">{profession}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="h-3 w-3 fill-[#EAB308] stroke-[#EAB308]" />
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {badges.map(b => (
            <span key={b} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-700/50 text-[#1A56A0] dark:text-blue-300 font-black text-[9px] uppercase tracking-wider border border-blue-100 dark:border-slate-700">
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
        <DSButton size="sm" className="w-full text-[10px] py-2" onClick={onAction}>
          Connect / Hire
        </DSButton>
      </div>
    </DSCard>
  );
};

export const DSEquipmentCard: React.FC<{
  image: string;
  name: string;
  pricePerDay: number;
  location: string;
  isAvailable?: boolean;
  onAction?: () => void;
}> = ({ image, name, pricePerDay, location, isAvailable = true, onAction }) => {
  return (
    <DSInteractiveCard className="p-0 overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          <img src={image} alt={name} className="h-full w-full object-cover" />
          <div className={`absolute top-2 right-2 px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
            isAvailable ? 'bg-green-600' : 'bg-red-500'
          }`}>
            {isAvailable ? 'Available' : 'Leased'}
          </div>
        </div>
        <div className="p-4 text-left space-y-2">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug line-clamp-1">{name}</h4>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold">
            <MapPin className="h-3.5 w-3.5 text-[#1A56A0]" /> {location}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-black text-[#1A56A0] dark:text-blue-400 font-sora">₦{pricePerDay.toLocaleString('en-NG')}</span>
            <span className="text-[10px] text-gray-400 font-bold">/ day</span>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <DSButton size="sm" className="w-full text-[10px]" onClick={onAction} disabled={!isAvailable}>
          Lease Equipment
        </DSButton>
      </div>
    </DSInteractiveCard>
  );
};

export const DSJobCard: React.FC<{
  title: string;
  company: string;
  location: string;
  salary: string;
  type?: string;
  onAction?: () => void;
}> = ({ title, company, location, salary, type = "Full-Time", onAction }) => {
  return (
    <DSCard className="text-left flex flex-col justify-between hover:shadow-md transition-all">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/25 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
              {type}
            </span>
            <h4 className="text-xs font-bold font-sora text-gray-900 dark:text-white mt-1.5">{title}</h4>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{company}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-[11px] text-gray-400 font-bold pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gray-400" /> {location}
          </div>
          <div className="flex items-center gap-1 text-[#1A56A0] dark:text-blue-400">
            <Coins className="h-3.5 w-3.5 text-[#1A56A0]" /> {salary}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <DSButton size="sm" variant="secondary" className="w-full text-[10px]" onClick={onAction}>
          Apply Instantly
        </DSButton>
      </div>
    </DSCard>
  );
};

/* ==========================================================================
   4. NAVIGATION
   ========================================================================== */
export const DSTopNav: React.FC<{
  logoText?: string;
  links: { label: string; active?: boolean; onClick: () => void }[];
  userName: string;
  userRole: string;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}> = ({ logoText = "My Engineering App", links, userName, userRole, onThemeToggle, isDarkMode }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-gray-100 dark:border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-[#1A56A0] text-white flex items-center justify-center font-black rounded-lg text-sm">
          M
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white hidden sm:inline">
          {logoText}
        </span>
      </div>
      
      <nav className="hidden md:flex items-center gap-4">
        {links.map((link) => (
          <button
            key={link.label}
            onClick={link.onClick}
            className={`text-[11px] font-black uppercase tracking-wider hover:text-[#1A56A0] cursor-pointer ${
              link.active ? 'text-[#1A56A0]' : 'text-gray-500'
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button onClick={onThemeToggle} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
          {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
        <div className="text-right leading-none hidden xs:block">
          <p className="text-[11px] font-bold text-gray-900 dark:text-white">{userName}</p>
          <p className="text-[9px] font-bold uppercase text-blue-600 dark:text-blue-400 mt-0.5">{userRole}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-800 dark:text-blue-200 flex items-center justify-center text-xs font-bold">
          {userName.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export const DSSidebar: React.FC<{
  links: { label: string; icon: React.ReactNode; active?: boolean; onClick: () => void }[];
  collapsed?: boolean;
}> = ({ links, collapsed = false }) => {
  return (
    <aside className={`bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 h-screen transition-all flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-50 dark:border-slate-800 flex items-center gap-2">
        <div className="h-8 w-8 bg-[#1A56A0] text-white rounded-lg flex items-center justify-center font-black">M</div>
        {!collapsed && <span className="font-extrabold text-xs uppercase tracking-wider text-gray-900 dark:text-white">Workspace</span>}
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(l => (
          <button
            key={l.label}
            onClick={l.onClick}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-xs font-bold transition-colors cursor-pointer ${
              l.active
                ? 'bg-[#E8F0FA] text-[#1A56A0] dark:bg-[#1A56A0]/25 dark:text-blue-400'
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {l.icon}
            {!collapsed && <span>{l.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export const DSBreadcrumb: React.FC<{
  items: { label: string; onClick?: () => void }[];
}> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500">
      {items.map((it, idx) => (
        <React.Fragment key={it.label}>
          {idx > 0 && <span className="text-gray-300 dark:text-gray-700">/</span>}
          {it.onClick ? (
            <button onClick={it.onClick} className="hover:text-[#1A56A0] cursor-pointer">
              {it.label}
            </button>
          ) : (
            <span className="text-gray-700 dark:text-gray-300">{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export const DSTabs: React.FC<{
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          className={`py-3.5 px-4 text-xs uppercase font-extrabold tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === t.id
              ? 'border-[#1A56A0] text-[#1A56A0] dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export const DSBottomNav: React.FC<{
  items: { label: string; icon: React.ReactNode; active?: boolean; onClick: () => void }[];
}> = ({ items }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex justify-around py-2.5 px-2 md:hidden z-40">
      {items.map(it => (
        <button
          key={it.label}
          onClick={it.onClick}
          className={`flex flex-col items-center gap-1 cursor-pointer select-none ${
            it.active ? 'text-[#1A56A0]' : 'text-gray-400'
          }`}
        >
          {it.icon}
          <span className="text-[10px] font-bold">{it.label}</span>
        </button>
      ))}
    </nav>
  );
};

export const DSPagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-slate-800/80">
      <DSButton
        size="sm"
        variant="secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="gap-1 text-[10px]"
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </DSButton>
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <DSButton
        size="sm"
        variant="secondary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="gap-1 text-[10px]"
      >
        Next <ChevronRight className="h-4 w-4" />
      </DSButton>
    </div>
  );
};

export const DSStepsIndicator: React.FC<{
  steps: string[];
  currentStep: number;
}> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
      {steps.map((st, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        return (
          <div key={st} className="flex flex-col items-center z-10 text-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
              isCompleted
                ? 'bg-green-600 border-green-600 text-white'
                : isActive
                ? 'bg-[#1A56A0] border-[#1A56A0] text-white'
                : 'bg-white border-gray-200 text-gray-400 dark:bg-slate-800 dark:border-slate-700'
            }`}>
              {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span className={`text-[10px] font-bold mt-1.5 ${isActive ? 'text-[#1A56A0] dark:text-blue-400' : 'text-gray-400'}`}>
              {st}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ==========================================================================
   5. FEEDBACK COMPONENTS
   ========================================================================== */
export const DSAlert: React.FC<{
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  onClose?: () => void;
}> = ({ type = 'info', title, description, onClose }) => {
  const styles = {
    info: 'bg-[#E8F0FA]/80 border-l-4 border-[#1A56A0] text-blue-900 dark:bg-blue-950/20 dark:text-blue-300',
    success: 'bg-green-50/80 border-l-4 border-[#059669] text-green-900 dark:bg-green-950/20 dark:text-green-300',
    warning: 'bg-orange-50/80 border-l-4 border-[#F97316] text-orange-900 dark:bg-orange-950/20 dark:text-orange-300',
    error: 'bg-red-50/80 border-l-4 border-[#EF4444] text-red-900 dark:bg-red-950/20 dark:text-red-300'
  };

  const icons = {
    info: <Info className="h-4 w-4 text-[#1A56A0] shrink-0" />,
    success: <Check className="h-4 w-4 text-[#059669] shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-[#F97316] shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
  };

  return (
    <div className={`p-4 rounded-xl flex gap-3 items-start justify-between text-left ${styles[type]}`}>
      <div className="flex gap-2.5 items-start">
        {icons[type]}
        <div>
          <h5 className="text-xs font-bold leading-none">{title}</h5>
          {description && <p className="text-[11px] font-medium leading-relaxed opacity-85 mt-1">{description}</p>}
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-75 cursor-pointer shrink-0">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const DSModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, size = 'md', children }) => {
  if (!isOpen) return null;

  const widthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs" onClick={onClose} />
      <div className={`w-full ${widthStyles[size]} bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl relative z-10 animate-fade-in`}>
        <div className="flex justify-between items-center mb-4 border-b border-gray-50 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black font-sora text-gray-900 dark:text-white uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export const DSConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <DSModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-left space-y-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">{message}</p>
        <div className="flex gap-2 justify-end pt-2 border-t border-gray-50 dark:border-slate-800">
          <DSButton size="sm" variant="secondary" onClick={onClose}>
            {cancelText}
          </DSButton>
          <DSButton size="sm" variant="destructive" onClick={onConfirm}>
            {confirmText}
          </DSButton>
        </div>
      </div>
    </DSModal>
  );
};

export const DSDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  anchor?: 'left' | 'right';
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, anchor = 'right', children }) => {
  if (!isOpen) return null;

  const anchorStyle = anchor === 'right' ? 'right-0 slide-in-right' : 'left-0 slide-in-left';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className={`fixed top-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-l dark:border-slate-800 p-6 shadow-2xl z-10 flex flex-col justify-between ${anchorStyle}`}>
        <div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
            <h3 className="text-xs font-black font-sora text-gray-900 dark:text-white uppercase tracking-wider">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DSTooltip: React.FC<{
  content: string;
  children: React.ReactNode;
}> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-900 text-white dark:bg-slate-800 text-[10px] font-bold rounded-lg whitespace-nowrap shadow-md leading-none animate-fade-in">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
        </div>
      )}
    </div>
  );
};

export const DSPopover: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
}> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={popRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>
      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 animate-fade-in text-left">
          {children}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   6. DATA DISPLAY
   ========================================================================== */
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export function DSTable<T>({
  columns,
  data,
  onRowClick
}: {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 dark:border-slate-800/80 rounded-2xl">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 text-gray-500 uppercase tracking-widest font-black">
            {columns.map(col => (
              <th key={col.header} className="p-4 py-3.5">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-gray-400 dark:text-gray-500">
                No data available in table
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr
                key={rIdx}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? 'hover:bg-gray-50 dark:hover:bg-slate-800/40 cursor-pointer' : ''}`}
              >
                {columns.map(col => (
                  <td key={col.header} className="p-4 py-3.5 text-gray-700 dark:text-gray-300 font-medium">
                    {col.render ? col.render(row) : (row[col.key as keyof T] as unknown as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const DSBadge: React.FC<{
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}> = ({ variant = 'neutral', children }) => {
  const styles = {
    success: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/25 dark:text-green-300 dark:border-green-800/40',
    warning: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/25 dark:text-orange-300 dark:border-orange-800/40',
    error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/25 dark:text-red-300 dark:border-red-800/40',
    info: 'bg-blue-50 text-[#1A56A0] border-blue-200 dark:bg-blue-950/25 dark:text-blue-300 dark:border-blue-800/40',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700'
  };

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export const DSTag: React.FC<{
  label: string;
  onRemove?: () => void;
}> = ({ label, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 dark:bg-slate-800 dark:border-slate-700 px-2.5 py-1 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300">
      {label}
      {onRemove && (
        <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500 cursor-pointer">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export const DSAvatar: React.FC<{
  src?: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline';
}> = ({ src, initials, size = 'md', status }) => {
  const sizeStyles = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg'
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img src={src} alt={initials} className={`${sizeStyles[size]} rounded-full object-cover`} />
      ) : (
        <div className={`${sizeStyles[size]} rounded-full bg-[#E8F0FA] text-[#1A56A0] dark:bg-slate-700 dark:text-blue-400 font-black flex items-center justify-center`}>
          {initials}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white dark:border-slate-900 ${
          status === 'online' ? 'bg-[#059669]' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
};

export const DSAvatarGroup: React.FC<{
  avatars: { src?: string; initials: string }[];
  limit?: number;
}> = ({ avatars, limit = 4 }) => {
  const shown = avatars.slice(0, limit);
  const extra = avatars.length - limit;

  return (
    <div className="flex -space-x-2.5 overflow-hidden">
      {shown.map((av, idx) => (
        <DSAvatar key={idx} src={av.src} initials={av.initials} size="sm" />
      ))}
      {extra > 0 && (
        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-extrabold flex items-center justify-center text-[10px] border border-white dark:border-slate-900 z-10">
          +{extra}
        </div>
      )}
    </div>
  );
};

export const DSRatingStars: React.FC<{
  rating: number;
  count?: number;
}> = ({ rating, count }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => {
        const fillPercent = Math.max(0, Math.min(1, rating - star + 1));
        return (
          <Star
            key={star}
            className={`h-4 w-4 ${
              fillPercent >= 0.8
                ? 'fill-[#EAB308] stroke-[#EAB308]'
                : fillPercent > 0.2
                ? 'fill-[#EAB308]/50 stroke-[#EAB308]'
                : 'text-gray-200 dark:text-slate-800'
            }`}
          />
        );
      })}
      {count !== undefined && (
        <span className="text-xs text-gray-400 dark:text-gray-500 font-bold ml-1">({count})</span>
      )}
    </div>
  );
};

export const DSProgressBar: React.FC<{
  percent: number;
}> = ({ percent }) => {
  return (
    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
      <div className="bg-[#1A56A0] h-full transition-all duration-300" style={{ width: `${percent}%` }} />
    </div>
  );
};

export const DSSkeletonLoader: React.FC<{
  variant?: 'card' | 'text' | 'avatar' | 'table-row';
}> = ({ variant = 'text' }) => {
  const animations = "animate-pulse bg-gray-100 dark:bg-slate-800 rounded-xl";
  
  if (variant === 'card') {
    return (
      <div className="p-4 border border-gray-100 dark:border-slate-800/80 rounded-2xl space-y-3 bg-white dark:bg-slate-900">
        <div className={`${animations} h-36 w-full`} />
        <div className={`${animations} h-4 w-2/3`} />
        <div className={`${animations} h-3 w-1/2`} />
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={`${animations} h-12 w-12 rounded-full`} />;
  }

  if (variant === 'table-row') {
    return (
      <div className="flex gap-4 p-4 border-b border-gray-50 dark:border-slate-800">
        <div className={`${animations} h-4 w-1/4`} />
        <div className={`${animations} h-4 w-1/3`} />
        <div className={`${animations} h-4 w-1/6`} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`${animations} h-4.5 w-full`} />
      <div className={`${animations} h-3.5 w-5/6`} />
    </div>
  );
};

export const DSEmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, onAction }) => {
  return (
    <div className="text-center py-12 px-4 max-w-sm mx-auto space-y-4">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-[#E8F0FA] text-[#1A56A0] dark:bg-slate-800 dark:text-blue-400 flex items-center justify-center">
        <Sliders className="h-8 w-8" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-xs font-black font-sora text-gray-900 dark:text-white uppercase tracking-wider">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">{description}</p>
      </div>
      {actionText && onAction && (
        <DSButton size="sm" onClick={onAction}>
          {actionText}
        </DSButton>
      )}
    </div>
  );
};

export const DSErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = "Operation Failed", message, onRetry }) => {
  return (
    <div className="p-6 border border-red-100 dark:border-red-950/45 rounded-2xl bg-red-50/10 text-center max-w-sm mx-auto space-y-4">
      <div className="mx-auto h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/45 text-[#EF4444] flex items-center justify-center">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h5 className="text-xs font-black font-sora text-gray-900 dark:text-white uppercase tracking-wider">{title}</h5>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{message}</p>
      </div>
      {onRetry && (
        <DSButton size="sm" variant="destructive" onClick={onRetry}>
          Try Again
        </DSButton>
      )}
    </div>
  );
};

/* ==========================================================================
   7. CHARTS (Responsive SVG Implementation)
   ========================================================================== */
export const DSLineChart: React.FC<{
  data: { label: string; value: number }[];
}> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 10);
  const points = data.map((d, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxVal) * 80; // keep 20px padding top/bottom
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full bg-white dark:bg-slate-800/60 p-4 border border-gray-100 dark:border-slate-800 rounded-2xl text-left">
      <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5">
        <Activity className="h-3.5 w-3.5 text-[#1A56A0]" /> Structural Load Dynamics
      </h5>
      <div className="h-32 w-full relative">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" className="dark:stroke-slate-800" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" className="dark:stroke-slate-800" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(0,0,0,0.1)" strokeWidth="1" className="dark:stroke-slate-700" />
          
          {/* Main Line */}
          <polyline
            fill="none"
            stroke="#1A56A0"
            strokeWidth="2.5"
            points={points}
          />
          {/* Dots */}
          {data.map((d, idx) => {
            const x = (idx / (data.length - 1)) * 100;
            const y = 100 - (d.value / maxVal) * 80;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="3"
                className="fill-[#1A56A0] stroke-white dark:stroke-slate-900"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-400">
        {data.map(d => <span key={d.label}>{d.label}</span>)}
      </div>
    </div>
  );
};

export const DSBarChart: React.FC<{
  data: { label: string; value: number }[];
}> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 10);
  return (
    <div className="w-full bg-white dark:bg-slate-800/60 p-4 border border-gray-100 dark:border-slate-800 rounded-2xl text-left">
      <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-1.5">
        <Sliders className="h-3.5 w-3.5 text-[#1A56A0]" /> Procurement Statistics
      </h5>
      <div className="flex items-end justify-between h-28 pt-2">
        {data.map(d => {
          const pct = (d.value / maxVal) * 100;
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-6 bg-[#E8F0FA] dark:bg-slate-700 rounded-t-lg relative group overflow-hidden h-24 flex items-end">
                <div className="w-full bg-[#1A56A0] rounded-t-lg transition-all" style={{ height: `${pct}%` }} />
              </div>
              <span className="text-[9px] font-bold text-gray-400">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================================================
   8. SPECIALISED COMPONENTS
   ========================================================================== */
export const DSVerificationBadge: React.FC<{
  type: 'COREN' | 'ARCON' | 'NIOB' | 'VERIFIED';
}> = ({ type }) => {
  const configs = {
    COREN: { 
      label: 'COREN Registered', 
      colors: 'bg-[#1A56A0]/5 text-[#1A56A0] border-solid border-[#1A56A0]/40 dark:bg-[#1A56A0]/10 dark:text-blue-300 dark:border-[#1A56A0]/50',
      icon: <ShieldCheck className="h-3.5 w-3.5" />
    },
    ARCON: { 
      label: 'ARCON Certified', 
      colors: 'bg-[#1A56A0]/5 text-[#1A56A0] border-dashed border-[#1A56A0]/50 dark:bg-[#1A56A0]/10 dark:text-blue-300 dark:border-[#1A56A0]/60',
      icon: <Award className="h-3.5 w-3.5" />
    },
    NIOB: { 
      label: 'NIOB Builder', 
      colors: 'bg-[#1A56A0]/5 text-[#1A56A0] border-dotted border-[#1A56A0]/60 dark:bg-[#1A56A0]/10 dark:text-blue-300 dark:border-[#1A56A0]/70',
      icon: <Briefcase className="h-3.5 w-3.5" />
    },
    VERIFIED: { 
      label: 'MEA Verified', 
      colors: 'bg-[#1A56A0]/5 text-[#1A56A0] border-2 border-[#1A56A0]/30 dark:bg-[#1A56A0]/10 dark:text-blue-300 dark:border-[#1A56A0]/50',
      icon: <Sparkles className="h-3.5 w-3.5" />
    }
  };

  const current = configs[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${current.colors}`}>
      {current.icon}
      {current.label}
    </span>
  );
};

export const DSNairaDisplay: React.FC<{
  value: number;
  className?: string;
}> = ({ value, className = "text-base font-black font-sora" }) => {
  return (
    <span className={`${className} text-gray-950 dark:text-white`}>
      <span className="text-gray-400 dark:text-gray-500 font-bold mr-0.5">₦</span>
      {value.toLocaleString('en-NG')}
    </span>
  );
};

export const DSLocationTag: React.FC<{
  city: string;
  state: string;
}> = ({ city, state }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 text-[10px] font-bold text-gray-500 dark:text-gray-400">
      <MapPin className="h-3.5 w-3.5 text-[#1A56A0]" />
      <span>{city}, {state}</span>
    </div>
  );
};

export const DSRoleBadge: React.FC<{
  role: string;
}> = ({ role }) => {
  const normalized = role.toLowerCase();
  let style = "bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700";

  if (normalized.includes('super')) {
    style = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-800/40";
  } else if (normalized.includes('admin')) {
    style = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800/40";
  } else if (normalized.includes('professional') || normalized.includes('labour') || normalized.includes('company')) {
    style = "bg-blue-50 text-[#1A56A0] border-blue-200 dark:bg-blue-950/25 dark:text-blue-300 dark:border-blue-800/40";
  } else if (normalized.includes('student')) {
    style = "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/25 dark:text-sky-300 dark:border-sky-800/40";
  } else if (normalized.includes('seller') || normalized.includes('owner') || normalized.includes('manufacture')) {
    style = "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/25 dark:text-green-300 dark:border-green-800/40";
  }

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${style}`}>
      {role}
    </span>
  );
};

export const DSAISuggestionCard: React.FC<{
  suggestion: string;
  onApply?: () => void;
}> = ({ suggestion, onApply }) => {
  return (
    <div className="p-5 border border-amber-200/80 rounded-2xl bg-amber-50/40 dark:bg-amber-950/10 text-left relative overflow-hidden space-y-3">
      <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-amber-400/5 to-transparent rounded-bl-full pointer-events-none" />
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
        <Sparkles className="h-4.5 w-4.5 animate-pulse" /> Ecosystem Copilot Intelligence
      </div>
      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">{suggestion}</p>
      {onApply && (
        <DSButton size="sm" variant="secondary" className="border-amber-200 text-amber-700 hover:bg-amber-100/50 dark:border-amber-900/30 dark:text-amber-300 text-[10px] py-1.5" onClick={onApply}>
          Apply AI Suggestion
        </DSButton>
      )}
    </div>
  );
};

export const DSEscrowStatusBadge: React.FC<{
  status: 'AWAITING_FUNDS' | 'FUNDED' | 'DISBURSING' | 'COMPLETED' | 'DISPUTED';
}> = ({ status }) => {
  const configs = {
    AWAITING_FUNDS: { label: 'Awaiting Escrow', colors: 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700' },
    FUNDED: { label: 'Escrow Funded', colors: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/25 dark:text-blue-300 dark:border-blue-800/40' },
    DISBURSING: { label: 'Disbursing', colors: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/25 dark:text-orange-300 dark:border-orange-800/40' },
    COMPLETED: { label: 'Completed & Released', colors: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/25 dark:text-green-300 dark:border-green-800/40' },
    DISPUTED: { label: 'Under Review / Dispute', colors: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/25 dark:text-red-300 dark:border-red-800/40' }
  };

  const current = configs[status];

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${current.colors}`}>
      {current.label}
    </span>
  );
};
