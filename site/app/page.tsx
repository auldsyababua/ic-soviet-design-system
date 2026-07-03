import { redirect } from 'next/navigation';

// The console boots facing the media station.
export default function Home() {
  redirect('/media');
}
