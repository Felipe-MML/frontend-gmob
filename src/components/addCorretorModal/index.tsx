"use client";
import { useState, FormEvent } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";

import { CreateCorretorDto } from "@/services/corretorService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IMaskInput } from "react-imask";

interface addCorretorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (corretorData: CreateCorretorDto) => Promise<void>;
}
const AddCorretorModal = ({ open, onClose, onSave }: addCorretorModalProps) => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (senha !== confirmarSenha) {
      setError("As senhas não correspondem.");
      return;
    }
    try {
      await onSave({
        nome_completo: nomeCompleto,
        email,
        telefone,
        cpf,
        senha,
      });

      setNomeCompleto("");
      setEmail("");
      setTelefone("");
      setCpf("");
      setSenha("");
      setConfirmarSenha("");
      setError(null);
      setMostrarSenha(false);
      onClose();
    } catch (error) {
      setError("Erro ao cadastrar corretor. Verifique os dados");
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <DialogTitle className="text-lg font-bold">
            Adicionar Novo Corretor
          </DialogTitle>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Campos do formulário */}
            <div>
              <label htmlFor="nome">Nome Completo</label>
              <input
                id="nome"
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Digite o Nome do Corretor..."
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Digite o Email do Corretor..."
              />
            </div>
            <div>
              <label htmlFor="telefone">Telefone</label>
              <IMaskInput
                mask="(00) 00000-0000"
                id="telefone"
                type="text"
                value={telefone}
                onAccept={(value: any) => setTelefone(value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>
            <div>
              <label htmlFor="cpf">CPF</label>
              <IMaskInput
                mask="000.000.000-00"
                id="cpf"
                type="text"
                value={cpf}
                onAccept={(value: any) => setCpf(value)}
                required
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label htmlFor="senha">Senha</label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Digite a Senha do Corretor..."
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <div className="relative">
                <input
                  id="confirmarSenha"
                  type={mostrarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 pr-10"
                  placeholder="Confirme a senha..."
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddCorretorModal;
