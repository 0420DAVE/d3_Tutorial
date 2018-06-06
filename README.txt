READ ME

This folder has following files:
1. d3-annotate.js
2. testOption_p6.js
3. testOption.csv
4. webPage.html

This is an illustration on a very beginning-level guide of plotting using d3 (what is d3?: https://d3js.org/)
You can visualise the sample graph by open webPage.html in a browser. It shows a semantic drift analysis of option from 1850 to 2000. 
 
In this plot, you can:
	•	Cmd + Click a label to remove it
	•	Click a point to add back the removed label
	•	Labels are draggable
	•	Shift + Click a label to edit text

How it can be done?
You don’t need to install d3. Instead, you can source it directly by passing the following code to the html page ( which is webpage.html in the folder):

<script src="http://d3js.org/d3.v4.min.js"></script>

Other than the code above, the html page also host the following two lines of code:

<script src="d3-annotate.js"></script>     // an open-source java script that allows annotation function. It is a plug-in to D3
<script src="testOption_p6.js"></script>  // this is sourced to the D3 script I wrote. 

I have made as detailed comments as I can to the testOption_p6.js. The testOption.csv file have to be under the same directory/folder for the js code to work. 

How to debug code?
After open the webPage.html  in a browser, you can press F12 (or fn+F12 if using Mac) to see where the code went wrong. Click Console for more debugging information. 

How to set up working environment?
I use sublime 3. 
Install d3 package will help you a bit by offering convenient code completion :https://packagecontrol.io/packages/D3js%20v4
Install by cmd+shift+p to initiate command palette, then type package control: install package, then search for the package you need.

Importantly, many code samples offered online are written in version 3 or earlier. We are using version 4 in this project. 
The package I mentioned above provide code snippets for changes from v3 to v4. The function is accessible from the command pallette (Mac: cmd+shift+p)

Additional information

Some d3 tutorial links (we are using Version 4):
coloured scatter plot with annotation: 
https://bl.ocks.org/cmpolis/f9805a98b8a455aaccb56e5ee59964f8

https://bl.ocks.org/emeeks/625641430adead4bd7dbc9c1ab3f5102



