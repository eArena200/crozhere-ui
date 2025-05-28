const arenas = [
  {
    id: 1,
    name: 'Alpha Arena',
    image: '/arena.jpg', // Placeholder, can be replaced with unique images
    description: 'High-end gaming PCs, VR setups, and a vibrant atmosphere for competitive and casual gamers.',
  },
  {
    id: 2,
    name: 'Beta Zone',
    image: '/arena.jpg',
    description: 'Spacious arena with the latest consoles and a dedicated tournament stage.',
  },
  {
    id: 3,
    name: 'Omega Lounge',
    image: '/arena.jpg',
    description: 'Cozy lounge with retro games, snacks, and a chill vibe for friends and families.',
  },
];

import Image from 'next/image';

export default function ArenaList() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">Available Arenas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {arenas.map((arena) => (
            <div key={arena.id} className="bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={arena.image}
                  alt={arena.name}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-white">{arena.name}</h3>
                <p className="text-gray-300 mb-4 flex-1">{arena.description}</p>
                <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 