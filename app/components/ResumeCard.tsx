// import {Link} from "react-router";
// import ScoreCircle from "~/components/ScoreCircle";
// import {useEffect, useState} from "react";
// import {usePuterStore} from "~/lib/puter";

// const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
//     const { fs } = usePuterStore();
//     const [resumeUrl, setResumeUrl] = useState('');

//     useEffect(() => {
//         const loadResume = async () => {
//             const blob = await fs.read(imagePath);
//             if(!blob) return;
//             let url = URL.createObjectURL(blob);
//             setResumeUrl(url);
//         }

//         loadResume();
//     }, [imagePath]);

//     return (
//         <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
//             <div className="resume-card-header">
//                 <div className="flex flex-col gap-2">
//                     {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
//                     {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
//                     {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
//                 </div>
//                 <div className="flex-shrink-0">
//                     <ScoreCircle score={feedback.overallScore} />
//                 </div>
//             </div>
//             {resumeUrl && (
//                 <div className="gradient-border animate-in fade-in duration-1000">
//                     <div className="w-full h-full">
//                         <img
//                             src={resumeUrl}
//                             alt="resume"
//                             className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
//                         />
//                     </div>
//                 </div>
//                 )}
//         </Link>
//     )
// }
// export default ResumeCard



















import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ 
    resume: { id, companyName, jobTitle, feedback, imagePath, createdAt }, 
    onDelete,
    isDeleting = false
}: { 
    resume: Resume & { createdAt?: string }; 
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
}) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const loadResume = async () => {
            try {
                const blob = await fs.read(imagePath);
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                setResumeUrl(url);
            } catch (error) {
                console.error('Error loading resume image:', error);
            }
        };

        loadResume();
    }, [imagePath, fs]);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) {
            onDelete(id);
        }
    };

    const getScoreTheme = (score: number) => {
        if (score > 85) return {
            gradient: 'from-emerald-400 to-cyan-500',
            glow: 'shadow-lg shadow-emerald-500/30',
            bg: 'from-emerald-50/10 to-cyan-50/5',
            text: 'text-emerald-300',
            border: 'border-emerald-500/30'
        };
        if (score > 70) return {
            gradient: 'from-green-400 to-blue-500',
            glow: 'shadow-lg shadow-green-500/25',
            bg: 'from-green-50/10 to-blue-50/5',
            text: 'text-green-300',
            border: 'border-green-500/30'
        };
        if (score > 60) return {
            gradient: 'from-amber-400 to-orange-500',
            glow: 'shadow-lg shadow-amber-500/25',
            bg: 'from-amber-50/10 to-orange-50/5',
            text: 'text-amber-300',
            border: 'border-amber-500/30'
        };
        return {
            gradient: 'from-rose-400 to-pink-500',
            glow: 'shadow-lg shadow-rose-500/25',
            bg: 'from-rose-50/10 to-pink-50/5',
            text: 'text-rose-300',
            border: 'border-rose-500/30'
        };
    };

    const theme = getScoreTheme(feedback.overallScore);

    if (isDeleting) {
        return (
            <div className="animate-out fade-out duration-500 scale-0 opacity-0 rotate-90">
                {/* Smooth deletion animation */}
            </div>
        );
    }

    return (
        <div 
            className={`relative group perspective-1000 transition-all duration-500 ${
                isDeleting ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Enhanced Delete Button */}
            {onDelete && (
                <button 
                    onClick={handleDelete}
                    className={`
                        absolute -top-3 -right-3 z-30 w-8 h-8 
                        bg-gradient-to-br from-rose-500 to-pink-600 
                        text-white rounded-xl flex items-center justify-center 
                        text-lg font-black transition-all duration-500 
                        backdrop-blur-sm border-2 border-white/80
                        hover:from-rose-600 hover:to-pink-700
                        active:scale-95 shadow-2xl shadow-rose-500/40
                        ${isHovered 
                            ? 'opacity-100 scale-100 rotate-0' 
                            : 'opacity-0 scale-50 rotate-45'
                        }
                        ${isHovered ? 'hover:scale-110 hover:-rotate-90' : ''}
                    `}
                    title="Delete resume"
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        '×'
                    )}
                </button>
            )}

            {/* Enhanced Card */}
            <Link 
                to={`/resume/${id}`} 
                className={`
                    block relative overflow-hidden rounded-3xl transition-all duration-700
                    bg-gradient-to-br ${theme.bg} backdrop-blur-xl
                    border ${theme.border} shadow-2xl
                    transform hover:-translate-y-3 hover:scale-[1.02]
                    animate-in fade-in duration-1000
                    ${isHovered ? 'ring-2 ring-cyan-500/30' : ''}
                `}
            >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Header Section */}
                <div className="p-6 pb-4 relative z-10">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                            {companyName && (
                                <h2 className="text-xl font-bold text-white truncate mb-2">
                                    {companyName}
                                </h2>
                            )}
                            {jobTitle && (
                                <h3 className="text-gray-300 truncate text-sm leading-relaxed">
                                    {jobTitle}
                                </h3>
                            )}
                            {!companyName && !jobTitle && (
                                <h2 className="text-xl font-bold text-white">
                                    Resume
                                </h2>
                            )}
                        </div>
                        
                        {/* Enhanced Score Circle */}
                        <div className={`flex-shrink-0 transform transition-all duration-500 ${
                            isHovered ? 'scale-110' : 'scale-100'
                        } ${theme.glow}`}>
                            <ScoreCircle score={feedback.overallScore} />
                        </div>
                    </div>
                </div>

                {/* Resume Image */}
                {resumeUrl && (
                    <div className="px-6 pb-6 relative z-10">
                        <div className="rounded-2xl overflow-hidden transform transition-all duration-500 group-hover:shadow-2xl border border-white/10">
                            <div className="w-full h-full relative">
                                <img
                                    src={resumeUrl}
                                    alt="resume"
                                    className={`w-full h-48 object-cover object-top transition-transform duration-700 ${
                                        isHovered ? 'scale-105' : 'scale-100'
                                    } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setImageLoaded(true)}
                                />
                                
                                {/* Loading Skeleton */}
                                {!imageLoaded && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-600 animate-pulse rounded-2xl"></div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
                                    <span className="text-white font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-black/50 px-3 py-2 rounded-full backdrop-blur-sm">
                                        View Analysis →
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Score Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50 overflow-hidden">
                    <div 
                        className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-1000 ease-out`}
                        style={{ width: `${feedback.overallScore}%` }}
                    />
                </div>
            </Link>

            {/* Outer Glow */}
            <div className={`absolute -inset-4 bg-gradient-to-r ${theme.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
        </div>
    );
};

export default ResumeCard;
