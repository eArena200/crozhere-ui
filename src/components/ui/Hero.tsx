import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center h-[60vh] min-h-[400px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/arena.jpg"
          alt="Gaming Arena"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-30 z-10" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Book Your Ultimate Gaming Experience
        </h1>
        <p className="text-lg sm:text-2xl text-gray-200 mb-8 max-w-2xl drop-shadow">
          Reserve your spot at the best game arena in town. Play, compete, and connect!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#book"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition text-center"
          >
            Book Now
          </a>
          <a
            href="#register-arena"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition text-center"
          >
            Register Your Arena
          </a>
        </div>
      </div>
    </section>
  );
} 