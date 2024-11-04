import { Music2 } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function LoginButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
    >
      <Music2 className="h-5 w-5" />
      <span>Connect with Spotify</span>
    </button>
  );
}