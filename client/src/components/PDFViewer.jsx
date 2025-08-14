// src/components/PDFViewer.jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

const PDFViewer = ({ url, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDownload = () => {
    const downloadUrl = url.replace('/upload/fl_pdf_viewer/', '/upload/fl_attachment/');
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = title || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title || 'Document Preview'}</DialogTitle>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={title || 'Document Preview'}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;