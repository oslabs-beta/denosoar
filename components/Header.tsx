export default function Header() {
  return (
    
    <div class="font-mono bg-gray-300 flex w-full justify-between p-5">
      <div class="flex items-center">
        <img
          src="/super-deno.png"
          class="border-2 border-solid border-white w-20 h-20 rounded-full"
        />
        <h1 class="pl-10 text-4xl">Denosoar</h1>
      </div>
      <nav class="flex items-center">
        <a href="/">Home</a>
        <a href="/about" class="pl-8">About</a>
        <a href="/docs" class="pl-8">Docs</a>

        <a
          href="https://github.com/oslabs-beta/denosoar"
          target="_blank"
          rel="noopener noreferrer"
          class="pl-8"
        >
          <img
            src="/icons8-github-100.png"
            class="w-10 h-10 bg-white rounded-full"
          />
        </a>
        <a href="" target="_blank" rel="noopener noreferrer" class="pl-5">
          <img
            src="/icons8-linkedin-circled-100.png"
            class="w-10 h-10 bg-white rounded-full"
          />
        </a>
      </nav>
    </div>
  );
}
