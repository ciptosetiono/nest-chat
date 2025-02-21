"use client";

export default function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold">Welcome to Nest Chat</h1>
        <p className="py-6">
          This Chat App build with NestJS, Next.js, TypeScript, MongoDB and Socket.io. 
          It's a simple chat application with JWT authentication and authorization. 
        </p>
        <a className="btn btn-primary" href="/auth/register">Get Started</a>
      </div>
    </div>
  </div>
    
  );
}
