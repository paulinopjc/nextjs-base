'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditorType } from 'tinymce';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  name?: string;
  id?: string;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  height = 600,
}) => {
  const editorRef = useRef<TinyMCEEditorType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const smallScreen = window.matchMedia('(max-width: 1023.5px)');

    const updateDarkMode = () => setIsDarkMode(darkMode.matches);
    const updateScreenSize = () => setIsSmallScreen(smallScreen.matches);

    updateDarkMode();
    updateScreenSize();

    darkMode.addEventListener('change', updateDarkMode);
    smallScreen.addEventListener('change', updateScreenSize);

    return () => {
      darkMode.removeEventListener('change', updateDarkMode);
      smallScreen.removeEventListener('change', updateScreenSize);
    };
  }, []);

  return (
    <Editor
      apiKey="n2k27n86fjs4ztbpg8pu6tgkf2bssqcx2ci2yi68xc1w58q2"
      value={value}
      onEditorChange={onChange}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      init={{
        height: isSmallScreen ? 300 : height,
        onboarding: false,
        menubar: 'file edit view insert format tools table help',
        plugins:
          'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
        toolbar:
          'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent | forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        file_picker_callback: (callback, _value, meta) => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute(
            'accept',
            meta.filetype === 'image' ? 'image/*' : 'video/*,audio/*'
          );

          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            const data = await res.json();
            let publicUrl = data.url;

            if (!publicUrl) {
              alert('Upload failed');
              return;
            }

            // ✅ Normalize URL to remove any ../ or ./ and ensure starts with /cms/
            publicUrl = `/cms/${publicUrl.split('/cms/').pop()}`;

            if (meta.filetype === 'image') {
              callback(publicUrl, { alt: file.name });
            } else if (meta.filetype === 'media') {
              callback(publicUrl, {
                source: publicUrl,
                alt: file.name,
              });
            } else {
              callback(publicUrl, { text: file.name });
            }
          };

          input.click();
        },
        image_caption: true,
        quickbars_selection_toolbar:
          'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image table',
        skin: isDarkMode ? 'oxide-dark' : 'oxide',
        content_css: isDarkMode ? 'dark' : 'default',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
      }}
    />
  );
};

export default TinyMCEEditor;
