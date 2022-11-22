import { assert } from "https://deno.land/std/testing/asserts.ts";

export default function loadtest(url: string, concurrency: string, rps: string, duration:string) {
  // const array = new Array(10).fill(url);
  // console.log(array);

  const numbered = Number(concurrency);
  const n = 1000;

  function getRequests(url: string, concurrency: number): any[] {
    // console.log('L13 : now Invoking getRequests');
    return new Array(concurrency).fill(
      new Promise((resolve) => {
        const res = fetch(url);
        return resolve(res);
      }),
    );
  }

  const siegeInterval = setInterval(async () => {
    const response = await Promise.all(getRequests(url, Number(concurrency)));
    console.log(response);
  }, n / Number(rps));

  setTimeout( ()=> clearInterval(siegeInterval), Number(duration))

  // Deno.test("Load test", async () => {
  //   let status200 = 0, statusNon200 = 0;
  //   const totalRequests = 50000;
  //   for (let i = 0; i < 50; i++) {
  //     const responses = await Promise.all(getRequests("https://deno.land"));
  //     for (const s of responses) {
  //       s === 200 ? status200++ : statusNon200++;
  //     }
  //   }
  //   assert(status200 === totalRequests);
  // });


}
