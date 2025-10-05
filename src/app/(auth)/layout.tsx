export default function App({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="bg-blue-400 p-4 fixed left-0 top-0 w-full">
        <h1>Auth </h1>
      </header>
      {children}
    </div>
  );
}
