// import ScoreGauge from "~/components/ScoreGauge";
// import ScoreBadge from "~/components/ScoreBadge";

// const Category = ({ title, score }: { title: string, score: number }) => {
//     const textColor = score > 70 ? 'text-green-600'
//             : score > 49
//         ? 'text-yellow-600' : 'text-red-600';

//     return (
//         <div className="resume-summary">
//             <div className="category">
//                 <div className="flex flex-row gap-2 items-center justify-center">
//                     <p className="text-2xl">{title}</p>
//                     <ScoreBadge score={score} />
//                 </div>
//                 <p className="text-2xl">
//                     <span className={textColor}>{score}</span>/100
//                 </p>
//             </div>
//         </div>
//     )
// }

// const Summary = ({ feedback }: { feedback: Feedback }) => {
//     return (
//         <div className="bg-white rounded-2xl shadow-md w-full">
//             <div className="flex flex-row items-center p-4 gap-8">
//                 <ScoreGauge score={feedback.overallScore} />

//                 <div className="flex flex-col gap-2">
//                     <h2 className="text-2xl font-bold">Your Resume Score</h2>
//                     <p className="text-sm text-gray-500">
//                         This score is calculated based on the variables listed below.
//                     </p>
//                 </div>
//             </div>

//             <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
//             <Category title="Content" score={feedback.content.score} />
//             <Category title="Structure" score={feedback.structure.score} />
//             <Category title="Skills" score={feedback.skills.score} />
//         </div>
//     )
// }
// export default Summary






























import { useState } from "react";
import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score, onDelete }: { title: string, score: number, onDelete?: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const textColor = score > 70 ? 'text-green-600'
        : score > 49
        ? 'text-yellow-600' : 'text-red-600';

    const bgColor = score > 70 ? 'bg-green-50 border-green-200'
        : score > 49
        ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

    return (
        <div 
            className={`resume-summary relative border-2 rounded-xl p-4 transition-all duration-300 ${bgColor} ${
                isHovered ? 'scale-[1.02] shadow-lg' : 'scale-100 shadow-md'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Delete Button - Appears on hover */}
            {onDelete && isHovered && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg border-2 border-white"
                    title={`Delete ${title} category`}
                >
                    ×
                </button>
            )}
            
            <div className="category">
                <div className="flex flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Animated Icon based on score */}
                        <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                            score > 70 ? 'bg-green-500 animate-pulse' 
                            : score > 49 ? 'bg-yellow-500' 
                            : 'bg-red-500'
                        }`} />
                        <p className="text-xl font-semibold text-gray-800">{title}</p>
                    </div>
                    <ScoreBadge score={score} />
                </div>
                
                {/* Score with animated progress bar */}
                <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-600">Score</span>
                        <p className="text-2xl font-bold">
                            <span className={textColor}>{score}</span>
                            <span className="text-gray-400">/100</span>
                        </p>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
                                score > 70 ? 'bg-green-500' 
                                : score > 49 ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ 
                                width: `${score}%`,
                                animation: 'growWidth 1s ease-out'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Summary = ({ feedback, onDeleteCategory }: { feedback: Feedback; onDeleteCategory?: (category: string) => void }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Animation on mount
    useState(() => {
        setTimeout(() => setIsVisible(true), 100);
    });

    const getOverallVerdict = (score: number) => {
        if (score > 85) return "Excellent! 🎉";
        if (score > 70) return "Great job! 👍";
        if (score > 50) return "Good start 💪";
        return "Needs improvement 📝";
    };

    const getScoreColor = (score: number) => {
        return score > 70 ? 'text-green-600'
            : score > 49
            ? 'text-yellow-600' : 'text-red-600';
    };

    return (
        <div className={`bg-white rounded-2xl shadow-xl w-full transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl p-6 border-b">
                <div className="flex flex-row items-center gap-8">
                    {/* Animated Score Gauge */}
                    <div className="transform hover:scale-105 transition-transform duration-300">
                        <ScoreGauge score={feedback.overallScore} />
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Your Resume Score
                            </h2>
                            {/* Overall Score Badge */}
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(feedback.overallScore)} bg-white border`}>
                                {getOverallVerdict(feedback.overallScore)}
                            </span>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed">
                            This score is calculated based on the variables listed below. 
                            <span className="block text-sm text-gray-500 mt-1">
                                Hover over categories for more options
                            </span>
                        </p>
                        
                        {/* Quick Stats */}
                        <div className="flex gap-4 mt-2">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{feedback.overallScore}</div>
                                <div className="text-xs text-gray-500">Overall</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {Math.max(feedback.toneAndStyle.score, feedback.content.score, feedback.structure.score, feedback.skills.score)}
                                </div>
                                <div className="text-xs text-gray-500">Best</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {Math.min(feedback.toneAndStyle.score, feedback.content.score, feedback.structure.score, feedback.skills.score)}
                                </div>
                                <div className="text-xs text-gray-500">Needs Work</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="p-6 space-y-4">
                <Category 
                    title="Tone & Style" 
                    score={feedback.toneAndStyle.score} 
                    onDelete={onDeleteCategory ? () => onDeleteCategory('toneAndStyle') : undefined}
                />
                <Category 
                    title="Content" 
                    score={feedback.content.score} 
                    onDelete={onDeleteCategory ? () => onDeleteCategory('content') : undefined}
                />
                <Category 
                    title="Structure" 
                    score={feedback.structure.score} 
                    onDelete={onDeleteCategory ? () => onDeleteCategory('structure') : undefined}
                />
                <Category 
                    title="Skills" 
                    score={feedback.skills.score} 
                    onDelete={onDeleteCategory ? () => onDeleteCategory('skills') : undefined}
                />
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes growWidth {
                    from { width: 0%; }
                    to { width: var(--final-width); }
                }
            `}</style>
        </div>
    )
}

export default Summary;
