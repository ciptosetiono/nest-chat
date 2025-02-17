"use client";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
   
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="text-2xl font-bold text-center w-full">Welcome to Nest Chat App</h1>
        <p className="text-center text-sm">
          This APP build with NestJS, Next.js, TypeScript, MongoDB and Socket.io. 
          It's a simple chat application with JWT authentication and authorization. 
        </p>

        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row w-full">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/auth/login"
          >
            Login
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/auth/signup"
          >
            Sign Up
          </a>
        </div>
      </main>
    </div>
    
  );
}
