
import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './CKEditorComponent.css';

interface CKEditorComponentProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

const CKEditorComponent: React.FC<CKEditorComponentProps> = ({
  value,
  onChange,
  placeholder = "Write your cover letter here..."
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  console.log("CKEditor component rendered with value:", value);
  
  useEffect(() => {
    // Reset error state when component mounts
    setEditorError(null);
  }, []);

  const handleEditorReady = (editor: any) => {
    console.log("CKEditor is ready to use!", editor);
    setIsEditorReady(true);
    setEditorError(null);
  };

  const handleEditorError = (error: any, details: any) => {
    console.error("CKEditor error:", error, details);
    setEditorError("Editor failed to load. Please refresh the page.");
  };

  const handleEditorChange = (event: any, editor: any) => {
    try {
      const data = editor.getData();
      console.log("CKEditor content changed:", data);
      onChange(data);
    } catch (error) {
      console.error("Error getting editor data:", error);
    }
  };

  if (editorError) {
    return (
      <div className="ck-editor-wrapper">
        <div className="border border-red-300 rounded-md p-4 bg-red-50">
          <p className="text-red-600 text-sm">{editorError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ck-editor-wrapper">
      {!isEditorReady && (
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <p className="text-gray-600 text-sm">Loading editor...</p>
        </div>
      )}
      <div style={{ display: isEditorReady ? 'block' : 'none' }}>
        <CKEditor
          editor={ClassicEditor}
          data={value}
          onChange={handleEditorChange}
          onReady={handleEditorReady}
          onError={handleEditorError}
          config={{
            placeholder,
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              '|',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              '|',
              'blockQuote',
              'insertTable',
              '|',
              'undo',
              'redo'
            ],
            heading: {
              options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
              ]
            }
          }}
        />
      </div>
    </div>
  );
};

export default CKEditorComponent;
