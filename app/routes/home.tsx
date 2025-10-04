// import type { Route } from "./+types/home";
// import Navbar from "~/components/Navbar";
// import ResumeCard from "~/components/ResumeCard";
// import {usePuterStore} from "~/lib/puter";
// import {Link, useNavigate} from "react-router";
// import {useEffect, useState} from "react";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "Resumind" },
//     { name: "description", content: "Smart feedback for your dream job!" },
//   ];
// }

// export default function Home() {
//   const { auth, kv } = usePuterStore();
//   const navigate = useNavigate();
//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [loadingResumes, setLoadingResumes] = useState(false);

//   useEffect(() => {
//     if(!auth.isAuthenticated) navigate('/auth?next=/');
//   }, [auth.isAuthenticated])

//   useEffect(() => {
//     const loadResumes = async () => {
//       setLoadingResumes(true);

//       const resumes = (await kv.list('resume:*', true)) as KVItem[];

//       const parsedResumes = resumes?.map((resume) => (
//           JSON.parse(resume.value) as Resume
//       ))

//       setResumes(parsedResumes || []);
//       setLoadingResumes(false);
//     }

//     loadResumes()
//   }, []);

//   return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
//     <Navbar />

//     <section className="main-section">
//       <div className="page-heading py-16">
//         <h1>Track Your Applications & Resume Ratings</h1>
//         {!loadingResumes && resumes?.length === 0 ? (
//             <h2>No resumes found. Upload your first resume to get feedback.</h2>
//         ): (
//           <h2>Review your submissions and check AI-powered feedback.</h2>
//         )}
//       </div>
//       {loadingResumes && (
//           <div className="flex flex-col items-center justify-center">
//             <img src="/images/resume-scan-2.gif" className="w-[200px]" />
//           </div>
//       )}

//       {!loadingResumes && resumes.length > 0 && (
//         <div className="resumes-section">
//           {resumes.map((resume) => (
//               <ResumeCard key={resume.id} resume={resume} />
//           ))}
//         </div>
//       )}

//       {!loadingResumes && resumes?.length === 0 && (
//           <div className="flex flex-col items-center justify-center mt-10 gap-4">
//             <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
//               Upload Resume
//             </Link>
//           </div>
//       )}
//     </section>
//   </main>
// }






import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const resumes = (await kv.list('resume:*', true)) as KVItem[];
        const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
        )) || [];
        
        // Sort by creation date (newest first)
        parsedResumes.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setResumes(parsedResumes);
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setLoadingResumes(false);
      }
    }

    loadResumes();
  }, []);

  const handleDeleteResume = async (id: string) => {
    setDeletingIds(prev => new Set(prev).add(id));
    
    // Simulate API call delay
    setTimeout(async () => {
      try {
        await kv.remove(`resume:${id}`);
        setResumes(prev => prev.filter(resume => resume.id !== id));
      } catch (error) {
        console.error('Error deleting resume:', error);
      } finally {
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }, 300);
  };

  const getTotalScore = () => {
    if (resumes.length === 0) return 0;
    const total = resumes.reduce((sum, resume) => sum + resume.feedback.overallScore, 0);
    return Math.round(total / resumes.length);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navbar />

      <section className="relative z-10 main-section">
        {/* Enhanced Header Section */}
        <div className="page-heading py-16 text-center">
          <div className="relative inline-block">
            <h1 className="text-6xl font-black bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-6 animate-in fade-in duration-1000">
              RESUMIND
            </h1>
            <div className="absolute -inset-4 bg-cyan-500/10 blur-xl rounded-full -z-10"></div>
          </div>
          
          {!loadingResumes && resumes?.length === 0 ? (
            <div className="animate-in fade-in duration-1000 delay-300">
              <h2 className="text-2xl text-gray-300 mb-8 font-light">
                No resumes found. Upload your first resume to get AI-powered feedback.
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-8"></div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000 delay-300">
              <h2 className="text-2xl text-gray-300 mb-4 font-light">
                Review your submissions and check AI-powered feedback.
              </h2>
              
              {/* Stats Overview */}
              {resumes.length > 0 && (
                <div className="flex justify-center items-center gap-8 mt-8">
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="text-3xl font-bold text-cyan-400">{resumes.length}</div>
                    <div className="text-gray-400 text-sm">Total Resumes</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="text-3xl font-bold text-green-400">{getTotalScore()}</div>
                    <div className="text-gray-400 text-sm">Avg Score</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="text-3xl font-bold text-purple-400">
                      {Math.max(...resumes.map(r => r.feedback.overallScore))}
                    </div>
                    <div className="text-gray-400 text-sm">Best Score</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading Animation */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="relative">
              <img 
                src="/images/resume-scan-2.gif" 
                className="w-48 h-48 rounded-2xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/20" 
              />
              <div className="absolute -inset-4 bg-cyan-500/10 blur-xl rounded-2xl -z-10"></div>
            </div>
            <p className="text-cyan-200 text-lg mt-6 font-light animate-pulse">
              Loading your career journey...
            </p>
          </div>
        )}

        {/* Resumes Grid */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section animate-in fade-in duration-1000 delay-500">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
              {resumes.map((resume) => (
                <ResumeCard 
                  key={resume.id} 
                  resume={resume} 
                  onDelete={handleDeleteResume}
                  isDeleting={deletingIds.has(resume.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-6 animate-in fade-in duration-1000 delay-500">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center border border-cyan-500/30 backdrop-blur-sm">
                <div className="text-4xl">📄</div>
              </div>
              <p className="text-gray-400 text-lg max-w-md">
                Start your journey to better resumes with AI-powered insights
              </p>
            </div>
            
            <Link 
              to="/upload" 
              className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative px-8 py-4 bg-slate-900 rounded-2xl leading-none flex items-center space-x-4 border border-cyan-500/30">
                <span className="text-cyan-100 group-hover:text-white transition-colors duration-200 text-xl font-semibold">
                  Upload Your First Resume
                </span>
                <span className="text-cyan-400 group-hover:text-cyan-200 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        {!loadingResumes && resumes.length > 0 && (
          <Link 
            to="/upload" 
            className="fixed bottom-8 right-8 z-50 group md:hidden"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-md group-hover:bg-cyan-500/30 transition-all duration-300"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-cyan-500/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                +
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
    </main>
  );
}
