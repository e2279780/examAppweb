/**
 * FileUpload.jsx
 * 
 * Composant d'upload de fichiers avec preview et progression
 * 
 * SECTION 4 : Firebase Storage
 * 
 * Props:
 * - onUploadSuccess: function - Callback avec l'URL du fichier uploadé
 * - userId: string - L'ID de l'utilisateur
 */

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { uploadFile } from '../services/storageService';

/**
 * STYLED COMPONENTS
 */

const Container = styled.div`
  background: rgba(31, 41, 55, 0.5);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 2px dashed #374151;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: rgba(31, 41, 55, 0.8);
  }

  &.dragging {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const UploadIcon = styled.div`
  font-size: 2rem;
`;

const Label = styled.label`
  color: #d1d5db;
  font-size: 0.95rem;
  text-align: center;
  cursor: pointer;

  strong {
    color: #93c5fd;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  margin: 1rem auto;
`;

const Preview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  display: block;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

const ProgressContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #1f2937;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.85rem;
  color: #9ca3af;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fecaca;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #a7f3d0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
`;

const FileName = styled.div`
  font-size: 0.85rem;
  color: #9ca3af;
  text-align: center;
`;

/**
 * COMPOSANT PRINCIPAL
 */

const FileUpload = ({ onUploadSuccess, userId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * Gérer la sélection de fichier
   */
  const handleFileSelect = (file) => {
    setError(null);
    setSuccess(false);

    if (!file) return;

    // Vérifier le type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Type non autorisé. Utilisez JPG, PNG, WebP ou PDF.');
      return;
    }

    // Vérifier la taille
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Le fichier dépasse 5MB');
      return;
    }

    setSelectedFile(file);

    // Créer un preview pour les images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null); // PDF n'a pas de preview
    }
  };

  /**
   * Click sur l'input file
   */
  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Changement de l'input file
   */
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Drag and drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Upload du fichier
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      console.log('📤 Upload en cours:', selectedFile.name);

      // Upload avec progression
      const downloadUrl = await uploadFile(selectedFile, userId, (prog) => {
        setProgress(prog);
      });

      console.log('✅ Upload réussi! URL:', downloadUrl);

      setSuccess(true);
      setProgress(100);

      // Appeler la callback avec l'URL
      if (onUploadSuccess) {
        onUploadSuccess(downloadUrl);
      }

      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setProgress(0);
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);

    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload');
      console.error(err);
      setIsUploading(false);
    }
  };

  /**
   * Retirer le fichier sélectionné
   */
  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={isDragging ? 'dragging' : ''}
    >
      {!selectedFile ? (
        <UploadArea onClick={handleInputClick}>
          <UploadIcon>📁</UploadIcon>
          <Label>
            <strong>Cliquez ou déposez un fichier</strong>
            <br />
            (JPG, PNG, WebP, PDF - max 5MB)
          </Label>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleInputChange}
          />
        </UploadArea>
      ) : (
        <>
          {preview && (
            <PreviewContainer>
              <Preview src={preview} alt="Preview" />
              <RemoveButton
                onClick={handleRemove}
                disabled={isUploading}
                title="Retirer"
              >
                ✕
              </RemoveButton>
            </PreviewContainer>
          )}

          {!preview && (
            <FileName>📄 {selectedFile.name}</FileName>
          )}

          {isUploading && (
            <ProgressContainer>
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
              <ProgressText>
                {progress.toFixed(0)}% - {selectedFile.name}
              </ProgressText>
            </ProgressContainer>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>✅ Upload réussi!</SuccessMessage>}

          {!success && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.8rem',
                background: isUploading
                  ? 'linear-gradient(to right, #6b7280, #4b5563)'
                  : 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                border: 'none',
                color: 'white',
                borderRadius: '0.5rem',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                opacity: isUploading ? 0.6 : 1,
              }}
            >
              {isUploading ? `⏳ Upload en cours...` : '🚀 Upload'}
            </button>
          )}
        </>
      )}
    </Container>
  );
};

export default FileUpload;
