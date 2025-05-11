import dynamic from "next/dynamic";

// Use dynamic import to disable server-side rendering for this component
const TestComponent = dynamic(() => import("../test"), { ssr: false });

export default function TestPage() {
  return <TestComponent />;
} 