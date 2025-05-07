
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

interface ImageUploadProps {
  title: string;
  description: string;
  onImageUpload: (image: string) => void;
  className?: string;
}

const ImageUpload = ({ title, description, onImageUpload, className }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setPreview(e.target.result);
        onImageUpload(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card
        className={`relative h-full min-h-[200px] cursor-pointer overflow-hidden ${
          isDragging ? "border-primary" : ""
        } glass-morphism hover:shadow-lg transition-all duration-300`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {preview ? (
          <div className="h-full">
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button variant="ghost" className="text-white">
                Replace Image
              </Button>
            </div>
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="h-12 w-12 text-pirate-400 mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium mb-2 text-gradient">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ImageUpload;
