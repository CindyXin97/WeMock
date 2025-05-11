import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | WeMock',
  description: 'Login to your WeMock account',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 