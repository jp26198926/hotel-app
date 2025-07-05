"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast";
import {
  Database,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  FileText,
  HardDrive,
  Folder,
  Settings,
  Play,
  X,
} from "lucide-react";

export default function MaintenancePage() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { showSuccess, showError } = useToast();

  const analyzeUploads = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/admin/maintenance");
      const data = await response.json();

      if (data.success) {
        setAnalysisData(data.data);
        showSuccess("Upload analysis completed successfully!");
      } else {
        showError(data.error || "Failed to analyze uploads");
      }
    } catch (error) {
      console.error("Error analyzing uploads:", error);
      showError("Error analyzing uploads");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const cleanupFiles = async (directory = null) => {
    setIsCleaningUp(true);
    try {
      const response = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "cleanup",
          directory: directory,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const { deletedFiles, deletedSize } = data.data;
        showSuccess(
          `Cleanup completed! Deleted ${deletedFiles} files (${formatBytes(deletedSize)})`
        );
        // Refresh analysis
        await analyzeUploads();
      } else {
        showError(data.error || "Failed to cleanup files");
      }
    } catch (error) {
      console.error("Error cleaning up files:", error);
      showError("Error cleaning up files");
    } finally {
      setIsCleaningUp(false);
      setShowConfirmDialog(false);
      setSelectedDirectory(null);
    }
  };

  const handleCleanupClick = (directory = null) => {
    setSelectedDirectory(directory);
    setShowConfirmDialog(true);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTotalOrphanedSize = () => {
    if (!analysisData) return 0;
    return analysisData.cleanupResults.reduce((total, result) => {
      return total + result.files.reduce((fileTotal, file) => fileTotal + file.size, 0);
    }, 0);
  };

  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const response = await fetch("/api/admin/maintenance");
        const data = await response.json();

        if (data.success) {
          setAnalysisData(data.data);
          showSuccess("Upload analysis completed successfully!");
        } else {
          showError(data.error || "Failed to analyze uploads");
        }
      } catch (error) {
        console.error("Error analyzing uploads:", error);
        showError("Error analyzing uploads");
      } finally {
        setIsAnalyzing(false);
      }
    };

    performAnalysis();
  }, [showSuccess, showError]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              System Maintenance
            </h1>
            <p className="text-gray-600">
              Manage and clean up orphaned files in upload directories
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={analyzeUploads}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Uploads'}
          </button>

          {analysisData && analysisData.orphanedFiles > 0 && (
            <button
              onClick={() => handleCleanupClick()}
              disabled={isCleaningUp}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {isCleaningUp ? 'Cleaning...' : 'Clean All Orphaned Files'}
            </button>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysisData.totalFiles}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orphaned Files</p>
                  <p className="text-2xl font-bold text-red-600">
                    {analysisData.orphanedFiles}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wasted Space</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatBytes(getTotalOrphanedSize())}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <HardDrive className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Directory Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Directory Analysis
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {analysisData.cleanupResults.map((result, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            /uploads/{result.directory}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {result.totalFiles} total files, {result.orphanedFiles} orphaned
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {result.orphanedFiles > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-red-600 font-medium">
                              {formatBytes(
                                result.files.reduce((total, file) => total + file.size, 0)
                              )} wasted
                            </span>
                            <button
                              onClick={() => handleCleanupClick(result.directory)}
                              disabled={isCleaningUp}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Clean
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Clean</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {result.orphanedFiles > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Orphaned Files:
                        </p>
                        <div className="max-h-32 overflow-y-auto">
                          {result.files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="flex items-center justify-between py-1"
                            >
                              <span className="text-sm text-gray-600 font-mono">
                                {file.filename}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatBytes(file.size)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Errors */}
          {analysisData.errors.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Errors
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {analysisData.errors.map((error, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border border-red-200 rounded p-3"
                    >
                      <p className="text-sm font-medium text-red-800">
                        {error.directory || error.file}: {error.error}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Cleanup
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              {selectedDirectory
                ? `orphaned files in the "${selectedDirectory}" directory`
                : "all orphaned files"
              }? This will permanently remove{" "}
              {selectedDirectory
                ? analysisData.cleanupResults.find(r => r.directory === selectedDirectory)?.orphanedFiles || 0
                : analysisData.orphanedFiles
              } files.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => cleanupFiles(selectedDirectory)}
                disabled={isCleaningUp}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {isCleaningUp ? 'Deleting...' : 'Delete Files'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setSelectedDirectory(null);
                }}
                disabled={isCleaningUp}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
