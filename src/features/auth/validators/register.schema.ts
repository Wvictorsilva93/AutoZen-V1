// AutoZen - Register Validation Schema
import { z } from 'zod';

export const registerSchema = z.object({
  // Dados da Empresa
  companyName: z
    .string()
    .min(3, 'Nome da empresa deve ter no mínimo 3 caracteres')
    .max(100, 'Nome da empresa muito longo'),
  
  cnpj: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val),
      'CNPJ inválido (formato: 00.000.000/0000-00)'
    ),
  
  companyPhone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Formato: (00) 00000-0000'),
  
  companyEmail: z
    .string()
    .email('Email da empresa inválido'),
  
  // Dados do Responsável
  responsibleName: z
    .string()
    .min(3, 'Nome do responsável deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  
  responsiblePhone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Formato: (00) 00000-0000'),
  
  // Credenciais
  email: z
    .string()
    .email('Email inválido'),
  
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirme a senha'),
  
  // Termos
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Você deve aceitar os termos de uso'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
