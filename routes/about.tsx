import Header from '../components/Header.tsx';

export default function About(){

    const names: string[][]= [['Katie Angelopoulos','https://github.com/kangelopoulos' ], [ 'David Russo', 'https://github.com/RussoDavid'],['Mohammed Sebbagh', 'https://github.com/moha99ed'],['Ethan Liu', 'https://github.com/eliu080893'] ]
    

    return(
    <div>
        <Header />
       <h1 class='ml-4 text-6xl mt-4 mb-4'>About Denosoar</h1>
       <p class='mr-4 ml-4 text-lg' >Denosoar is an open source memory tool that is used to track potential memory leaks for applications built with Deno.  Denosoar analyzes and displays in real time the RSS(resident set size), Heap Total, Heap Usage and External Memory using easy to read charts </p>
        <h3 class='text-2xl ml-4 mt-4'> Meet the Engineers behind Denosoar</h3>
        <ul class='mt-6 ml-4'> 
            {names.map((el, index) => <li class='text-lg mt-6  w-1/6' key={index}>{el[0]} <a href={el[1]} ><img 
              src="/icons8-github-100.png"
              class="w-10 h-10 bg-white rounded-full"
            /> </a>
            </li>)}
        </ul>
        
    </div>
    )
    
}