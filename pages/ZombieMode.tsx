
import React, { useState } from 'react';

interface Props {
  onExit: () => void;
}

const ZombieMode: React.FC<Props> = ({ onExit }) => {
  const [disguise, setDisguise] = useState<'CODE' | 'FIGMA'>('CODE');

  return (
    <div className="fixed inset-0 bg-black z-[100] cursor-none overflow-hidden">
      <div className="absolute top-4 right-4 z-[110] flex gap-2">
        <button 
          onClick={() => setDisguise('CODE')} 
          className={`px-3 py-1 text-[8px] border ${disguise === 'CODE' ? 'border-green-500 text-green-500' : 'border-gray-800 text-gray-500'}`}
        >
          CODE
        </button>
        <button 
          onClick={() => setDisguise('FIGMA')} 
          className={`px-3 py-1 text-[8px] border ${disguise === 'FIGMA' ? 'border-green-500 text-green-500' : 'border-gray-800 text-gray-500'}`}
        >
          FIGMA
        </button>
        <button onClick={onExit} className="px-3 py-1 text-[8px] border border-red-900 text-red-900">EXIT</button>
      </div>

      {disguise === 'CODE' ? (
        <div className="p-8 font-mono text-[10px] text-blue-300 leading-normal select-none">
          <p className="text-gray-500">// Initialize cluster module</p>
          <p>const cluster = require('cluster');</p>
          <p>const http = require('http');</p>
          <p>const numCPUs = require('os').cpus().length;</p>
          <p>&nbsp;</p>
          <p>if (cluster.isMaster) {'{'}</p>
          <p className="pl-4 text-gray-500">// Fork workers.</p>
          {/* Fix: Escape '<' character to avoid JSX parsing error "Property 'numCPUs' does not exist on type 'JSX.IntrinsicElements'" */}
          <p className="pl-4">for (let i = 0; i &lt; numCPUs; i++) {'{'}</p>
          <p className="pl-8 text-green-400">cluster.fork();</p>
          <p className="pl-4">{'}'}</p>
          <p className="pl-4">cluster.on('exit', (worker, code, signal) => {'{'}</p>
          <p className="pl-8">console.log(`worker ${'{worker.process.pid}'} died`);</p>
          <p className="pl-4">{'}'});</p>
          <p>{'}'} else {'{'}</p>
          <p className="pl-4 text-gray-500">// Workers can share any TCP connection</p>
          <p className="pl-4 text-gray-500">// In this case it is an HTTP server</p>
          <p className="pl-4">http.createServer((req, res) => {'{'}</p>
          <p className="pl-8">res.writeHead(200);</p>
          <p className="pl-8">res.end('hello world\n');</p>
          <p className="pl-4">{'}'}).listen(8000);</p>
          <p>{'}'}</p>
          <p>&nbsp;</p>
          <p className="animate-pulse">_</p>
        </div>
      ) : (
        <div className="flex h-screen bg-[#1e1e1e]">
          <div className="w-16 border-r border-black flex flex-col items-center py-4 gap-4">
            <div className="w-4 h-4 border border-gray-600" />
            <div className="w-4 h-4 rounded-full border border-gray-600" />
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-gray-600" />
          </div>
          <div className="flex-1 p-8">
            <div className="w-full h-full border border-gray-800 flex items-center justify-center">
              <div className="w-64 h-64 border border-gray-700 relative">
                <div className="absolute top-0 left-0 -translate-x-full pr-2 text-[8px] text-gray-600">640px</div>
                <div className="absolute top-0 left-0 -translate-y-full pb-2 text-[8px] text-gray-600">640px</div>
              </div>
            </div>
          </div>
          <div className="w-48 border-l border-black p-4">
            <p className="text-[10px] text-gray-500 mb-4 font-sans">Design System</p>
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-800 rounded" />
              <div className="h-2 w-2/3 bg-gray-800 rounded" />
              <div className="h-2 w-3/4 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 text-[8px] text-gray-700">
        魂归天外模式 - 已屏蔽所有推送
      </div>
    </div>
  );
};

export default ZombieMode;
