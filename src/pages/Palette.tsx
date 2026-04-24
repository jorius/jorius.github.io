const Palette = () => {

  const darkThemeColors = [
    { name: 'Midnight Blue', code: 'MB', hex: '#001427' },
    { name: 'Deep Navy', code: 'DN', hex: '#1A1F3A' },
    { name: 'Slate Blue', code: 'SB', hex: '#2D3561' },
    { name: 'Electric Cyan', code: 'EC', hex: '#7BDFF2' },
    { name: 'Purple Haze', code: 'PH', hex: '#6A66A3' },
    { name: 'Lavender Mist', code: 'LM', hex: '#C3ACCE' },
    { name: 'Warm Sand', code: 'WS', hex: '#EAD2AC' },
    { name: 'Hot Pink', code: 'HP', hex: '#FF006E' },
    { name: 'Neon Magenta', code: 'NM', hex: '#FF1B8D' },
    { name: 'Bright Blue', code: 'BB', hex: '#3A86FF' },
    { name: 'Electric Green', code: 'EG', hex: '#06FFA5' },
    { name: 'Cyber Yellow', code: 'CY', hex: '#FFBE0B' },
    { name: 'Cyan Glow', code: 'CG', hex: '#00F5FF' },
  ];

  const lightThemeColors = [
    { name: 'Light Gray', code: 'LG', hex: '#EBE9E9' },
    { name: 'Pure White', code: 'PW', hex: '#FFFFFF' },
    { name: 'Silver Gray', code: 'SG', hex: '#BBBBBF' },
    { name: 'Almost Black', code: 'AB', hex: '#020100' },
    { name: 'Ocean Blue', code: 'OB', hex: '#0E79B2' },
    { name: 'Deep Purple', code: 'DP', hex: '#592E83' },
  ];

  const ColorCard = ({ name, code, hex }: { name: string; code: string; hex: string }) => {
    const isLight = hex === '#FFFFFF' || hex === '#EBE9E9' || hex === '#BBBBBF';

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div
          className="h-32 flex items-center justify-center relative"
          style={{ backgroundColor: hex }}
        >
          <div className={`absolute inset-0 flex items-center justify-center ${isLight ? 'text-gray-800' : 'text-white'} font-mono text-sm opacity-0 hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm`}>
            {hex}
          </div>
        </div>
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900">{name}</h3>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-bold text-gray-700">{code}</span>
          </div>
          <p className="text-xs font-mono text-gray-600">{hex}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-3 text-gray-900 font-mono">jorius.me</h1>
            <p className="text-xl text-gray-600">Color Palette Reference</p>
          </div>

          {/* Dark Theme Colors */}
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Dark Theme</h2>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {darkThemeColors.map((color) => (
                <ColorCard key={color.hex} {...color} />
              ))}
            </div>
          </section>

          {/* Light Theme Colors */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Light Theme</h2>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {lightThemeColors.map((color) => (
                <ColorCard key={color.hex} {...color} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Palette;
