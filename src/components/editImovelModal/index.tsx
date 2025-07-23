"use client";
import { useState, useEffect, FormEvent } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogBackdrop,
} from "@headlessui/react";
import { Imovel, UpdateImovelDto } from "@/services/imovelService";

interface EditImovelModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (id: number, imovelData: UpdateImovelDto) => Promise<void>;
    imovel: Imovel | null;
}

const EditImovelModal = ({
    open,
    onClose,
    onSave,
    imovel,
}: EditImovelModalProps) => {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [endereco, setEndereco] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (imovel) {
            setTitulo(`${imovel.rua}, ${imovel.numero}`); // ou algum outro critério para título
            setDescricao(imovel.descricao || "");
            setValor(imovel.valor.toString());
            setEndereco(`${imovel.rua}, ${imovel.numero}, ${imovel.cidade} - ${imovel.estado}`);
        }
    }, [imovel]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!imovel) return;

        try {
            await onSave(imovel.imovel_id, {
                descricao,
                valor: parseFloat(valor),
                rua: imovel.rua,
                numero: imovel.numero,
                cidade: imovel.cidade,
                estado: imovel.estado,
                status: imovel.status,
                complemento: imovel.complemento,
                numero_comodos: imovel.numero_comodos,
            });
        } catch (err) {
            setError("Erro ao atualizar imóvel. Verifique os dados.");
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
                        Editar Imóvel
                    </DialogTitle>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label>Título</label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label>Descrição</label>
                            <textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label>Valor</label>
                            <input
                                type="number"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label>Endereço</label>
                            <input
                                type="text"
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default EditImovelModal;
