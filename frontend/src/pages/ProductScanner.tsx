import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CameraIcon, ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, PlayIcon, PauseIcon, ClockIcon, FunnelIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface AnalysisResult {
    classification: string;
    detected_object: string;
    hardness_score: number;
    confidence: number;
    fragility_class: string;
    recommended_zone: string;
    handling_instructions: string;
    analysis_details?: {
        top_predictions: Array<{
            object: string;
            confidence: number;
            type: string;
        }>;
        soft_likelihood: number;
        hard_likelihood: number;
        agreement_score: number;
    };
    timestamp?: string;
    image?: string;
}

const ProductScanner: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [liveResult, setLiveResult] = useState<AnalysisResult | null>(null);
    const [history, setHistory] = useState<AnalysisResult[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'hard' | 'soft'>('all');
    const liveIntervalRef = useRef<NodeJS.Timeout | null>(null);


    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('productScanHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('productScanHistory', JSON.stringify(history));
        }
    }, [history]);

    // Cleanup live mode on unmount
    useEffect(() => {
        return () => {
            if (liveIntervalRef.current) {
                clearInterval(liveIntervalRef.current);
            }
        };
    }, []);

    const captureLiveFrame = useCallback(async () => {
        if (webcamRef.current && isLiveMode) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                await analyzeLiveFrame(imageSrc);
            }
        }
    }, [isLiveMode]);

    const analyzeLiveFrame = async (imageSrc: string) => {
        try {
            const res = await fetch(imageSrc);
            const blob = await res.blob();
            const file = new File([blob], "live_capture.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/v1/vision/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const resultWithTimestamp = {
                ...response.data,
                timestamp: new Date().toISOString(),
                image: imageSrc
            };

            setLiveResult(resultWithTimestamp);
        } catch (error) {
            console.error('Error analyzing live frame:', error);
        }
    };

    const toggleLiveMode = () => {
        if (!isLiveMode) {
            // Start live mode
            setIsLiveMode(true);
            setImgSrc(null);
            setResult(null);
            toast.success('Live analysis mode activated');

            // Capture and analyze every 2 seconds
            liveIntervalRef.current = setInterval(() => {
                captureLiveFrame();
            }, 2000);
        } else {
            // Stop live mode
            setIsLiveMode(false);
            setLiveResult(null);
            if (liveIntervalRef.current) {
                clearInterval(liveIntervalRef.current);
                liveIntervalRef.current = null;
            }
            toast.success('Live analysis mode deactivated');
        }
    };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
            setIsLiveMode(false);
            if (liveIntervalRef.current) {
                clearInterval(liveIntervalRef.current);
                liveIntervalRef.current = null;
            }
        }
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
        setResult(null);
    };

    const analyzeImage = async () => {
        if (!imgSrc) return;

        setIsScanning(true);
        try {
            // Convert base64 to blob
            const res = await fetch(imgSrc);
            const blob = await res.blob();
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/v1/vision/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const resultWithTimestamp = {
                ...response.data,
                timestamp: new Date().toISOString(),
                image: imgSrc
            };

            setResult(resultWithTimestamp);

            // Add to history
            setHistory(prev => [resultWithTimestamp, ...prev].slice(0, 50)); // Keep last 50

            toast.success('Analysis complete!');
        } catch (error) {
            console.error('Error analyzing image:', error);
            toast.error('Failed to analyze image. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };

    const saveLiveResult = () => {
        if (liveResult) {
            setHistory(prev => [liveResult, ...prev].slice(0, 50));
            toast.success('Live result saved to history!');
        }
    };

    const filteredHistory = history.filter(item => {
        if (filterType === 'all') return true;
        if (filterType === 'hard') return item.classification === 'Hard';
        if (filterType === 'soft') return item.classification === 'Soft';
        return true;
    });

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('productScanHistory');
        toast.success('History cleared!');
    };


    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Product Vision Scanner</h1>
                    <p className="text-slate-400">Real-time AI analysis for product classification and handling.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Camera/Image Section */}
                    <div className="card flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                        {!imgSrc ? (
                            <>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover rounded-lg"
                                    videoConstraints={{ facingMode: "environment" }}
                                />

                                {/* Live Analysis Overlay */}
                                {isLiveMode && liveResult && (
                                    <div className="absolute top-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-indigo-500/50 animate-fade-in z-20">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-slate-300 font-medium">LIVE ANALYSIS</span>
                                            </div>
                                            <button
                                                onClick={saveLiveResult}
                                                className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white transition-colors"
                                            >
                                                Save
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-bold text-lg">{liveResult.classification}</p>
                                                <p className="text-indigo-400 text-sm">{liveResult.detected_object}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${liveResult.classification === 'Hard'
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                                }`}>
                                                {Math.round(liveResult.confidence * 100)}%
                                            </div>
                                        </div>
                                        <div className="mt-2 flex gap-2">
                                            <div className="flex-1 bg-slate-700/50 rounded px-2 py-1">
                                                <p className="text-xs text-slate-400">Hardness</p>
                                                <p className="text-white font-bold">{liveResult.hardness_score.toFixed(2)}</p>
                                            </div>
                                            <div className="flex-1 bg-slate-700/50 rounded px-2 py-1">
                                                <p className="text-xs text-slate-400">Fragility</p>
                                                <p className={`font-bold ${liveResult.fragility_class === 'High' ? 'text-red-400' :
                                                    liveResult.fragility_class === 'Medium' ? 'text-yellow-400' :
                                                        'text-green-400'
                                                    }`}>{liveResult.fragility_class}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Camera Controls */}
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
                                    <button
                                        onClick={toggleLiveMode}
                                        className={`btn-secondary flex items-center gap-2 shadow-xl ${isLiveMode ? 'bg-red-600 hover:bg-red-700 border-red-500' : ''
                                            }`}
                                    >
                                        {isLiveMode ? (
                                            <>
                                                <PauseIcon className="h-5 w-5" />
                                                Stop Live
                                            </>
                                        ) : (
                                            <>
                                                <PlayIcon className="h-5 w-5" />
                                                Live Mode
                                            </>
                                        )}
                                    </button>
                                    {!isLiveMode && (
                                        <button
                                            onClick={capture}
                                            className="btn-primary flex items-center gap-2 shadow-xl"
                                        >
                                            <CameraIcon className="h-6 w-6" />
                                            Capture
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="relative w-full h-full">
                                <img src={imgSrc} alt="Captured" className="w-full h-full object-contain rounded-lg" />
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
                                    <button onClick={retake} className="btn-secondary flex items-center gap-2">
                                        <ArrowPathIcon className="h-5 w-5" />
                                        Retake
                                    </button>
                                    {!result && (
                                        <button onClick={analyzeImage} disabled={isScanning} className="btn-primary flex items-center gap-2">
                                            {isScanning ? (
                                                <>
                                                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircleIcon className="h-5 w-5" />
                                                    Analyze
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        <div className="card h-full">
                            <h3 className="text-xl font-semibold text-white mb-6">Analysis Results</h3>

                            {!result ? (
                                <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
                                    <CameraIcon className="h-16 w-16 mb-4 opacity-20" />
                                    <p>Capture and analyze an image to see results</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Classification Badge */}
                                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <div>
                                            <p className="text-sm text-slate-400">Classification</p>
                                            <h2 className="text-3xl font-bold text-white">{result.classification}</h2>
                                            {result.detected_object && (
                                                <p className="text-sm text-indigo-400 mt-1 font-medium">
                                                    Detected: {result.detected_object}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${result.classification === 'Hard'
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                            }`}>
                                            {Math.round(result.confidence * 100)}% Confidence
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <p className="text-sm text-slate-400 mb-1">Hardness Score</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-2xl font-bold text-white">{result.hardness_score.toFixed(2)}</span>
                                                <span className="text-xs text-slate-500 mb-1">/ 1.0</span>
                                            </div>
                                            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2">
                                                <div
                                                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                                                    style={{ width: `${result.hardness_score * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <p className="text-sm text-slate-400 mb-1">Fragility Class</p>
                                            <p className={`text-xl font-bold ${result.fragility_class === 'High' ? 'text-red-400' :
                                                result.fragility_class === 'Medium' ? 'text-yellow-400' :
                                                    'text-green-400'
                                                }`}>
                                                {result.fragility_class}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Analysis Details - Top Predictions */}
                                    {result.analysis_details && result.analysis_details.top_predictions && (
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <h4 className="font-semibold text-white mb-3">Top Predictions</h4>
                                            <div className="space-y-2">
                                                {result.analysis_details.top_predictions.map((pred: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-slate-500 font-mono text-sm">#{idx + 1}</span>
                                                            <span className="text-slate-300">{pred.object}</span>
                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${pred.type === 'Soft'
                                                                ? 'bg-purple-500/20 text-purple-400'
                                                                : 'bg-blue-500/20 text-blue-400'
                                                                }`}>
                                                                {pred.type}
                                                            </span>
                                                        </div>
                                                        <span className="text-slate-400 text-sm">{Math.round(pred.confidence * 100)}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Analysis Details - Likelihood Scores */}
                                    {result.analysis_details && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                                <p className="text-sm text-slate-400 mb-2">Soft Likelihood</p>
                                                <div className="flex items-end gap-2 mb-2">
                                                    <span className="text-xl font-bold text-purple-400">
                                                        {Math.round((result.analysis_details.soft_likelihood || 0) * 100)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-700 h-1.5 rounded-full">
                                                    <div
                                                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000"
                                                        style={{ width: `${(result.analysis_details.soft_likelihood || 0) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                                <p className="text-sm text-slate-400 mb-2">Hard Likelihood</p>
                                                <div className="flex items-end gap-2 mb-2">
                                                    <span className="text-xl font-bold text-blue-400">
                                                        {Math.round((result.analysis_details.hard_likelihood || 0) * 100)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-700 h-1.5 rounded-full">
                                                    <div
                                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                                                        style={{ width: `${(result.analysis_details.hard_likelihood || 0) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Agreement Score */}
                                    {result.analysis_details && result.analysis_details.agreement_score !== undefined && (
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm text-slate-400">Prediction Agreement</p>
                                                <span className={`text-sm font-bold ${result.analysis_details.agreement_score > 0.8 ? 'text-green-400' :
                                                    result.analysis_details.agreement_score > 0.6 ? 'text-yellow-400' :
                                                        'text-orange-400'
                                                    }`}>
                                                    {Math.round(result.analysis_details.agreement_score * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-700 h-1.5 rounded-full">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-1000 ${result.analysis_details.agreement_score > 0.8 ? 'bg-green-500' :
                                                        result.analysis_details.agreement_score > 0.6 ? 'bg-yellow-500' :
                                                            'bg-orange-500'
                                                        }`}
                                                    style={{ width: `${result.analysis_details.agreement_score * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">
                                                {result.analysis_details.agreement_score > 0.8
                                                    ? 'High confidence - predictions strongly agree'
                                                    : result.analysis_details.agreement_score > 0.6
                                                        ? 'Moderate confidence - some prediction variance'
                                                        : 'Lower confidence - consider manual verification'}
                                            </p>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                Recommended Zone
                                            </h4>
                                            <p className="text-slate-300">{result.recommended_zone}</p>
                                        </div>

                                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                                                Handling Instructions
                                            </h4>
                                            <p className="text-slate-300">{result.handling_instructions}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ClockIcon className="h-6 w-6 text-indigo-400" />
                        Scan History
                    </h2>
                    <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'all'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterType('hard')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'hard'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            Hard
                        </button>
                        <button
                            onClick={() => setFilterType('soft')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'soft'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            Soft
                        </button>
                        {history.length > 0 && (
                            <button
                                onClick={clearHistory}
                                className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-l border-slate-700"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed">
                        <ClockIcon className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500">No scan history available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredHistory.map((item, index) => (
                            <div key={index} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-colors group">
                                <div className="relative h-32 bg-slate-900">
                                    {item.image ? (
                                        <img src={item.image} alt={item.detected_object} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <CameraIcon className="h-8 w-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold shadow-lg ${item.classification === 'Hard'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-purple-500 text-white'
                                            }`}>
                                            {item.classification}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white truncate pr-2" title={item.detected_object}>
                                            {item.detected_object}
                                        </h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <span className="text-slate-400">Confidence</span>
                                        <span className="text-indigo-400 font-medium">{Math.round(item.confidence * 100)}%</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`px-2 py-0.5 rounded bg-slate-700 ${item.fragility_class === 'High' ? 'text-red-400' :
                                            item.fragility_class === 'Medium' ? 'text-yellow-400' :
                                                'text-green-400'
                                            }`}>
                                            {item.fragility_class} Fragility
                                        </span>
                                        <span className="text-slate-500">
                                            Score: {item.hardness_score.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ProductScanner;
