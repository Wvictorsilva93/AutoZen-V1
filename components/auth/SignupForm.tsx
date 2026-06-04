"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, User, Phone, Mail, Lock } from "lucide-react";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    responsibleName: "",
    whatsapp: "",
    email: "",
    password: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup:", { ...formData, acceptTerms });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="companyName" className="text-sm font-medium text-text-primary">
          Nome da Empresa
        </label>
        <div className="relative">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            id="companyName"
            type="text"
            placeholder="Sua empresa"
            value={formData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            className="pl-11"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="responsibleName" className="text-sm font-medium text-text-primary">
          Responsável
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            id="responsibleName"
            type="text"
            placeholder="Seu nome completo"
            value={formData.responsibleName}
            onChange={(e) => handleChange("responsibleName", e.target.value)}
            className="pl-11"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="whatsapp" className="text-sm font-medium text-text-primary">
          WhatsApp
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            id="whatsapp"
            type="tel"
            placeholder="(00) 00000-0000"
            value={formData.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            className="pl-11"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-email" className="text-sm font-medium text-text-primary">
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            id="signup-email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="pl-11"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium text-text-primary">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            id="signup-password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="pl-11"
            required
            minLength={8}
          />
        </div>
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          required
        />
        <label
          htmlFor="terms"
          className="text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors leading-relaxed"
        >
          Aceito os{" "}
          <a href="#" className="text-blue-glow hover:text-blue-primary font-medium">
            termos de uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-blue-glow hover:text-blue-primary font-medium">
            política de privacidade
          </a>
        </label>
      </div>

      <Button type="submit" className="w-full mt-6" disabled={!acceptTerms}>
        Criar Empresa
      </Button>
    </form>
  );
}
