// https://deno.land/manual@v1.27.1/examples/manage_dependencies
// Import all dependencies into this file, and then we export everything. Then import modules in the files as needed.
export { Application, Router } from "https://deno.land/x/oak/mod.ts";

// @deno-types="https://denopkg.com/soremwar/deno_types/react/v16.13.1/react.d.ts"
import React from 'https://jspm.dev/react@17.0.2';

// @deno-types="https://denopkg.com/soremwar/deno_types/react-dom/v16.13.1/server.d.ts"
import ReactDOMServer from 'https://jspm.dev/react-dom@17.0.2/server';

// @deno-types="https://denopkg.com/soremwar/deno_types/react-dom/v16.13.1/react-dom.d.ts"
import ReactDOM from 'https://jspm.dev/react-dom@17.0.2';

export { React, ReactDOM, ReactDOMServer };

