# Denosoar

Welcome to Denosoar, a first of it's kind live memory tracking and load testing tool built specifically for Deno.

## Getting Started

To get started with Denosoar, execute the following command in the terminal. 

    deno install --allow-read --allow-write --allow-net --allow-env --allow-run --name denosoar https://deno.land/x/denosoar/mod.ts
    
This command will give you access to Denosoar's CLI command suite. 

## Tutorial
////// DENOSOAR EXAMPLE NEEDS TO BE LOOKED AT //////
Now that you have the CLI tools installed, a quick example has been provided to try out denosoar via the command line. Simply execute: 

    denosoar --example
    
Denosoar will then begin generating it's own memory data details. This can be recorded to a csv file or accessed via the live tracking GUI and be used to explore these tools. 


## Open the GUI

Now that you have an example server generating data, navigate to the GUI. This can be done by opening denosoar.deno.dev in a browser of your choice or by executing the command: 
    
    denosoar --gui
    
To get started, type in 3000 where it says Enter port number and hit Connect. 

You should see the memory graph being to generate data live. Always make sure that the port you enter matches the port that you intialize a Denosoar server with. This is the only port Denosoar will stream data to. 


## Changing the Sampling Frequency 

The sampling frequency will default to 10 seconds when the server is initialized. To change the sampling frequency you can use the GUI or you can alter the frequency directly from the command line. To do so for our example, execute the following command: 

    denosoar --freq 3000 20
    
The command will change the frequency for the Denosoar server that is listening on 3000 to 1 data collection per 20 seconds. The command template is as follows: 

    denosoar --freq port-number seconds-between-data-collection
    
The command will fail if you have not initalized a Denosoar server on an application to the port you are accessing. 


## Start Recording

To start recording your data to a CSV file, you can either navigate to the GUI, connecting to the appropriate port, and click 'Start Recording,' or you can type directly into the CLI: 

    denosoar --start-recording port-number
    
For the example, this would be: 
    
    denosoar --start-recording 3000
    
This will record the data that the server is generating to a CSV file. The first line of the file will be headers for the columns. The headers will appear as follows: 

    x,committed,heapTotal,heapUsed,external,rss
    
Where x is the number of seconds Denosoar started recording in this file. The headers must appear in this exact order to be analyzed by the Denosoar GUI. The GUI cannot analyze CSVs of another style. Do not alter the CSV generated by Denosoar if you plan to process them in the GUI. 

To process the data, navigate to denosoar.deno.dev and click on the Upload your CSV section. Then, drag and drop your Denosoar generated CSV into the upload box and your memory graph will be generated below. 


## Stop Recording

To stop recording to a CSV file, either navigate to the GUI, connect to the port and hit 'Stop Recording.' Or type the following command directly into your terminal: 

    denosoar --stop-recording port-number
    
For the example, this will be: 
    
    denosoar --stop-recording 3000
   

## Load Test 

To initialize a load test, you can either navigate to the GUI and utilize the load testing section of the Home page. Or, you can type the following command: 

    denosoar --lt url concurrency rps duration
    
-- this needs work

Let's try it. Make sure the example is listening on port 3000 and type the following command into the terminal: 

    denosoar --lt https://localhost:3000 1000 1000 


## Initializing Denosoar

Now that you've downloaded the CLI functionality and made it through the tutorial, let's move on to your project. In your entrypoint server file, add the following import: 

    import { init } as denosoar from "https://deno.land/x/denosoar@v0.0.2/mod.ts";
    
init() is a function accepting one parameter, an unused port to which our server will stream memory data directly from your process. Invoke init(port: number) and the server will be spun up in your application and being generating data. The default frequency for data generation is 10 seconds. 
