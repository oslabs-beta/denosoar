# Denosoar

Welcome to Denosoar, a first of it's kind live memory tracking and load testing tool built specifically for Deno.

## Getting Started

To get started with Denosoar, execute the following command in the terminal. 

    deno install --allow-read --allow-write --allow-net --allow-env --allow-run --name denosoar https://deno.land/x/denosoar@v1.0.0/mod.ts
    
This command will give access to Denosoars' CLI command suite. 

## Tutorial

Now that you have the CLI tools installed, an example has been provided to try out denosoar via the command line. Simply execute: 

    denosoar --example
    
Denosoar will then begin generating its own memory data details. This can be recorded to a .csv file, or accessed via the live tracking GUI.


## Open the GUI

Now that you have an example server generating data, navigate to the GUI. This can be done by opening denosoar.deno.dev in a browser of your choice or by executing the command: 
    
    denosoar --gui
    
To get started, type in 3000 where it says Enter port number and click on the 'Connect' button. 
The memory graph will begin to generate live data. Always make sure that the port you enter matches the port that you intialize a Denosoar server with. This is the only port Denosoar will stream data to. 


## Changing the Sampling Frequency 

The sampling frequency will default to report one memory snapshot per second. To change the sampling frequency, either use the GUI or the command line. For our example, execute the following command: 

    denosoar --freq 3000 2000
    
The command will change the frequency for the Denosoar server that is listening on 3000 to one data collection every 2000 milliseconds (2 seconds). The command template is as follows: 

    denosoar --freq port-number milliseconds-between-data-collection
    
The command will fail if you have not initialized a Denosoar server on an application to the port you are accessing. 


## Start Recording

To start recording your data to a .csv file, you can  navigate to the GUI, connect to the appropriate port, and click the 'Start Recording' button, or you can type directly into the CLI: 

    denosoar --start-recording port-number
    
For the example, this would be: 
    
    denosoar --start-recording 3000
    
This command will record the data that the server is generating to a .csv file. The first line of the file will be headers for the columns. The headers will appear as follows: 

    x,committed,heapTotal,heapUsed,external,rss
    
Where x is the number of seconds Denosoar started recording in this file. The headers must appear in this exact order to be analyzed by the Denosoar GUI. The GUI cannot analyze a .csv file of another style. Do not alter the .csv file generated by Denosoar if you plan to process them in the GUI. 

To process the data, navigate to denosoar.deno.dev and click on the Upload your CSV section. Then, drag and drop your Denosoar generated CSV into the upload box and your memory graph will be generated below. 


## Stop Recording

To stop recording to a .csv file, either click the 'Stop Recording' button in the GUI or enter the following command directly into the terminal: 

    denosoar --stop-recording port-number
    
For the example, this will be: 
    
    denosoar --stop-recording 3000
   
## Load Test 

Our load testing tool is in very early beta stages. Right now, the tool can deliver a large number of concurrent GET requests to your endpoint. In our use case, the load tester is designed to strain your system to help identify memory leaks. To use a more complex and customizable load testing tool, please look up Siege, wrk, or another tool that is compatible with your set up.

To initialize a load test, you can either navigate to the GUI and utilize the load testing section of the Home page, or type the following command in ther terminal: 

    denosoar --lt url concurrency rps duration
    
Let's try it. Make sure the example is listening on port 3000 and type the following command into the terminal: 

    denosoar --lt https://localhost:3000 1000 20 10000
    
This would effectively result in sending 1,000 concurrent requests, 20 times per second, for 10 seconds. (*1,000 x 20 x 10* = 20,000 GET Requests)
You should see an increase in the heap and rss statistics on the live graph.

## Initializing Denosoar

Now that you've downloaded the CLI functionality and made it through the tutorial, let us move on to your project. In your entrypoint server file, add the following import: 

    import { init } as denosoar from "https://deno.land/x/denosoar@v1.0.0/mod.ts";
    
init() is a function that accepts one parameter, an unused port to which our server will stream memory data directly from your process. Invoke init(port: number) and the server will be spun up in your application and begin generating data. The default frequency for data generation is 10 seconds. 

When you start your server, you can then navigate to the GUI and type in the port that you passed into the init invocation. You should immediately see data generated on the live graph. If you receive an error, it's likely that your ports do not match.

Please see the GUI readme and Docs page for more information.
