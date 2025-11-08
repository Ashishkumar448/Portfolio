export default function AboutPage() {
  return (
    <div className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-300">
            Full-stack developer passionate about creating amazing web experiences
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Hello, I'm a Developer</h2>
              <p className="text-gray-300 mb-4">
                I'm a passionate full-stack developer with expertise in modern web technologies. 
                I love creating efficient, scalable, and user-friendly applications that solve real-world problems.
              </p>
              <p className="text-gray-300 mb-4">
                With experience in both frontend and backend development, I enjoy working on projects 
                that challenge me to learn new technologies and improve my skills continuously.
              </p>
              <p className="text-gray-300">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source 
                projects, or sharing my knowledge through blog posts and tutorials.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-6xl">👨💻</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">Frontend Development</h3>
            <p className="text-gray-300">React, Next.js, TypeScript, Tailwind CSS</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Backend Development</h3>
            <p className="text-gray-300">Node.js, Express, MongoDB, PostgreSQL</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Cloud & DevOps</h3>
            <p className="text-gray-300">AWS, Docker, CI/CD, Git</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">My Journey</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Started Learning</h3>
                <p className="text-gray-300">Began my journey with HTML, CSS, and JavaScript</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Full-Stack Development</h3>
                <p className="text-gray-300">Expanded to backend technologies and databases</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Professional Experience</h3>
                <p className="text-gray-300">Working on real-world projects and building amazing applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}