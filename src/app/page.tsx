import { SceneGenerator } from '@/components/SceneGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              AI Movie Scene Generator
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your creative ideas into stunning cinematic experiences. 
              Our AI creates complete 5-scene movie scripts and generates professional videos for each scene.
            </p>
            
            {/* Feature Highlights */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm">
                <div className="text-3xl mb-3">🎬</div>
                <h3 className="font-semibold text-gray-800 mb-2">Script Generation</h3>
                <p className="text-sm text-gray-600">
                  AI creates compelling 5-scene movie scripts from your ideas
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm">
                <div className="text-3xl mb-3">🎥</div>
                <h3 className="font-semibold text-gray-800 mb-2">Video Creation</h3>
                <p className="text-sm text-gray-600">
                  Professional quality videos generated for each scene
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-gray-800 mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">
                  Watch your ideas come to life in minutes, not hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <SceneGenerator />
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Powered by advanced AI technology for creative storytelling
            </p>
            <div className="mt-4 flex justify-center space-x-8 text-sm text-gray-500">
              <span>• Script Generation with Claude</span>
              <span>• Video Creation with Veo-3</span>
              <span>• Real-time Processing</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}