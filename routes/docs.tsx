import Header from '../components/Header.tsx';


export default function Docs () {
    
        const  children= [
            { name: "What's DenoSoar", href: "#" },
            { name: "Getting Started", href: "#" },
            { name: "Guide", href: "#" },
            { name: "Showcase", href: "#" },
            { name: "Contributions and Issues", href: "#" },
            { name: "Release Notes", href: "#" },
        ]

    return (
        <div >
            <Header />
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <aside class="w-64" aria-label="Sidebar">
                <div class="w-60 h-full shadow-md bg-white px-1 absolute" key="Documentations">
                    <br />
                    <div class="font-extrabold">Menu</div>
                        <ul class="space-y-6">
                            {children.map((child) => (
                            <li class="mt-4" key={child.name}>
                                <a
                                class="w-full text-left text-[#635454] p-3 rounded-lg text-sm hover:bg-[#ded5ad] hover:text-[#17313b] hover:scale-110 duration-300"
                                href={child.href}>
                                    {child.name}
                                </a>
                            </li>
                             ))}
                        </ul>

                    </div>
            </aside>
            <main class="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                <h1 class="mx-auto max-w-screen-md font-bold text-5xl">Welcome to DenoSoar</h1>
                <p class="mx-auto max-w-screen-md">
                    <br />
                    Denosoar is an open source memory tool that is used to track potential memory leaks for applications built with Deno. Denosoar analyzes and displays in real time the RSS(resident set size), Heap Total, Heap Usage and External Memory using easy to read charts

.
                </p><br/>
                <h2 class="mx-auto max-w-screen-md font-bold text-3xl">Getting started</h2>
                <p >
                    <ul class="mx-auto max-w-screen-md">
                        <li>list of commands to follow with GIF or CLI snippets</li>
                        <li class = "border rounded shadow-md mx-auto box-content bg-[#0a0a0a]  text-[#7ef005] font mono  max-w-screen-md p-4 border-4 ...">
                        deno run --allow-read --allow-env --allow-net --allow-run test/leaky.ts
                        </li>
                    </ul>
                </p><br/>

                <h2 class="mx-auto max-w-screen-md font-bold text-3xl">Guide</h2>
                <p class="mx-auto max-w-screen-md">
                    <ul class="mx-auto max-w-screen-md">
                        <li >
                            list of commands to follow with GIF or CLI snippets
                        </li>
                    </ul>
                </p><br/>
                <h2 class="mx-auto max-w-screen-md font-bold text-3xl">Showcase</h2>
                <p class="mx-auto max-w-screen-md">
                    <ul class="mx-auto max-w-screen-md">
                        <li>
                            list of commands to follow with GIF or CLI snippets
                        </li>
                    </ul>
                </p><br/>

                <h2 class="mx-auto max-w-screen-md font-bold text-3xl">Contributions and Issues</h2>
                <p class="mx-auto max-w-screen-md">
                    <ul class="mx-auto max-w-screen-md">
                        <li>
                            list of commands to follow with GIF or CLI snippets
                        </li>
                    </ul>
                </p><br/>
                <h2 class="mx-auto max-w-screen-md font-bold text-3xl">Release notes</h2>
                <p class="mx-auto max-w-screen-md">
                    <ul class="mx-auto max-w-screen-md">
                        <li>
                            list of commands to follow with GIF or CLI snippets
                        </li>
                    </ul >
                </p>
                

            </main>
            </div>
        </div>
        )
    
}