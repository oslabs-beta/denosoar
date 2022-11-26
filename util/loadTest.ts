export default function loadtest(url: string, concurrency: string, rps: string, duration:string) {

  const n = 1000;

  function getRequests(url: string, concurrency: number): any[] {
    return new Array(concurrency).fill(
      new Promise((resolve) => {
        const res = fetch(url);
        return resolve(res);
      })
    );
  }

  const siegeInterval = setInterval(async () => {
    const response = await Promise.all(getRequests(url, Number(concurrency)));
    console.log(response);
  }, n / Number(rps));

  setTimeout( ()=> clearInterval(siegeInterval), Number(duration))
}
