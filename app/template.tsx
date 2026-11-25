/** Remounts on every navigation, so each page arrives with the same short blur-in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
