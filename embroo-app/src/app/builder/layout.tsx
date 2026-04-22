import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Builder — Embroo India',
  description: 'Customize your embroidered garment with our interactive 3D builder.',
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
