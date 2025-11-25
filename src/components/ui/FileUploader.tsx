import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    initialFiles?: File[];
    maxFiles?: number;
    accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onFilesSelected,
    initialFiles = [],
    maxFiles = 10,
    accept = "image/*",
}) => {
    const [files, setFiles] = useState<File[]>(initialFiles);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            processFiles(newFiles);
        }
    };

    const processFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter((file) => file.type.startsWith("image/"));

        if (validFiles.length !== newFiles.length) {
            toast.warning("Apenas arquivos de imagem são permitidos.");
        }

        const totalFiles = [...files, ...validFiles];

        if (totalFiles.length > maxFiles) {
            toast.error(`Você pode enviar no máximo ${maxFiles} imagens.`);
            return;
        }

        setFiles(totalFiles);
        onFilesSelected(totalFiles);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files);
            processFiles(newFiles);
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-300 hover:border-violet-400"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept={accept}
                    onChange={handleFileChange}
                />
                <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600 text-center">
                    <span className="font-semibold text-violet-600">Clique para enviar</span>{" "}
                    ou arraste e solte
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF até {maxFiles} arquivos
                </p>
            </div>

            {files.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="relative group aspect-square">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover rounded-md border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
