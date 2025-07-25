import React, { useState, useEffect } from 'react';
import { RicoEditorProps, EditorState } from './types';
import { clsx } from 'clsx';

export function RicoEditor({ 
  user, 
  file, 
  apiKey, 
  theme = 'light', 
  className 
}: RicoEditorProps) {
  const [state, setState] = useState<EditorState>({
    isLoading: true,
    currentView: 'linear',
    documentTitle: 'Untitled Document',
    content: null,
    lastSaved: null
  });

  useEffect(() => {
    // Initialize Firebase connection and load document
    console.log(`Initializing Rico Editor for user: ${user}, file: ${file}`);
    
    // Simulate loading
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        documentTitle: `Document ${file}`
      }));
    }, 1000);
  }, [user, file, apiKey]);

  const toggleView = () => {
    setState(prev => ({
      ...prev,
      currentView: prev.currentView === 'linear' ? 'block' : 'linear'
    }));
  };

  if (state.isLoading) {
    return (
      <div className={clsx('rico-editor-loading', className)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Rico Editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('rico-editor', theme, className)} style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}>
      {/* Document Header */}
      <div className="rico-editor-header border-b p-4 flex items-center justify-between" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb' }}>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold" style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}>
            {state.documentTitle}
          </h1>
          <span className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
            User: {user}
          </span>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}>View:</span>
          <button
            onClick={toggleView}
            className="px-3 py-1 rounded-md transition"
            style={{ 
              backgroundColor: theme === 'dark' ? '#4f46e5' : '#3b82f6', 
              color: '#ffffff' 
            }}
          >
            {state.currentView === 'linear' ? '📝 Linear' : '🧱 Block'}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rico-editor-toolbar border-b p-2 flex items-center gap-2" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb' }}>
        <button className="p-2 rounded transition" style={{ backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb' }}>
          <strong style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}>B</strong>
        </button>
        <button className="p-2 rounded transition" style={{ backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb' }}>
          <em style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}>I</em>
        </button>
        <button className="p-2 rounded transition" style={{ backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb' }}>
          <u style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}>U</u>
        </button>
        <div className="border-l mx-2 h-6" style={{ borderColor: theme === 'dark' ? '#6b7280' : '#d1d5db' }}></div>
        <button className="px-3 py-1 text-sm rounded transition" style={{ backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb', color: theme === 'dark' ? '#f9fafb' : '#111827' }}>
          Share
        </button>
        <button className="px-3 py-1 text-sm rounded transition" style={{ backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb', color: theme === 'dark' ? '#f9fafb' : '#111827' }}>
          Export
        </button>
      </div>

      {/* Editor Area */}
      <div className="rico-editor-content flex-1 p-4" style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}>
        {state.currentView === 'linear' ? (
          <div className="linear-editor">
            <div className="min-h-96 p-4 border rounded" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#ffffff', borderColor: theme === 'dark' ? '#6b7280' : '#d1d5db' }}>
              <p className="italic" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                Linear Editor (Quill) - Coming Soon
              </p>
              <p className="mt-4" style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}>
                This will be the rich text editor where users can write and format text in a traditional document style.
              </p>
            </div>
          </div>
        ) : (
          <div className="block-editor">
            <div className="min-h-96 p-4 border rounded" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#ffffff', borderColor: theme === 'dark' ? '#6b7280' : '#d1d5db' }}>
              <p className="italic" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                Block Editor (Notion-style) - Coming Soon
              </p>
              <div className="mt-4 space-y-2">
                <div className="p-2 border-l-4 rounded" style={{ borderLeftColor: '#3b82f6', backgroundColor: theme === 'dark' ? '#1e3a8a' : '#dbeafe' }}>
                  <span style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}>📝 Text Block</span>
                </div>
                <div className="p-2 border-l-4 rounded" style={{ borderLeftColor: '#10b981', backgroundColor: theme === 'dark' ? '#064e3b' : '#d1fae5' }}>
                  <span style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}>📋 List Block</span>
                </div>
                <div className="p-2 border-l-4 rounded" style={{ borderLeftColor: '#8b5cf6', backgroundColor: theme === 'dark' ? '#581c87' : '#ede9fe' }}>
                  <span style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}>🖼️ Image Block</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="rico-editor-status border-t p-2 text-sm flex justify-between" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb', color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
        <span>File: {file}</span>
        <span>
          {state.lastSaved ? `Saved ${state.lastSaved.toLocaleTimeString()}` : 'Not saved'}
        </span>
      </div>
    </div>
  );
} 