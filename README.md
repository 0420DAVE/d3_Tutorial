# A beginner's guide on D3 by a beginner 

This is a basic guide on drawing graphs with D3 (a javscript library that helps data visualization: https://d3js.org/). As a beginner myself, I know the pain of going through many "basic guide to D3" that are just not basic enough for people like me. I have limited coding skills in python and R, and have never played with javascript or HTML before.

In this tutorial, I offer samples for 4 graphs: scatter plot, line chart, barchart, network.

### Install D3 and its packages
To use D3 library, you don't need to download or install anything. Instead, you can source it directly by passing the following code to the html page ( which is webpage.html in the folder):
<script src="http://d3js.org/d3.v4.min.js"></script>
** Note that this tutorial use version 4. 

Other than the code above, the html page also host the following three lines of code:
```javascript
<script src="packages/bboxCollide.js"></script>
<script src="https://cdn.rawgit.com/susielu/d3-annotation/master/d3-annotation.js"></script>    
```
``bboxCollide`` and ``d3-annotation`` are two D3 packages. You can call a package either by referring to its URL address or to its local path after downloading it. 
 ```javascript
<script src="barchat_dual.js"></script>  // this is sourced to a D3 script I wrote on plotting a barchart. 
```
### You can skip many basics by but have to understand ``canvas`` and ``scale``
A good explaination on canvas:
http://www.d3noob.org/2012/12/adding-svg-canvas-in-d3js.html
Read section ``Starting with a basic graph`` from the book [**tricks and tips with d3**](https://leanpub.com/D3-Tips-and-Tricks).

### How to debug code?
After open the webPage.html  in a browser, you can press F12 (or fn+F12 if using Mac) to see where the code went wrong. Click Console for more debugging information. 

### How to set up working environment?
I use sublime 3. 
Install [D3js package](https://packagecontrol.io/packages/D3js%20v4) will help you a bit by offering convenient code completion.
Install by cmd+shift+p to initiate command palette, then type package control: install package, then search for the package you need.
Importantly, many code samples offered online are written in version 3 or earlier. We are using version 4 in this project. 
The package I mentioned above provide code snippets for changes from v3 to v4. The function is accessible from the command pallette (Mac: cmd+shift+p)


### What's in this reposiroty
This repository has following files/folders:
1. ``data``: xxx.js file takes data from this folder. 
2. ``packages``: xx.html file calls package from this folder. ALternatively, packages can be called by directly referring to their URL address
3. ``xxx.html``: Contains a section to host xxx.js file. Open this file in browser to see the plot.
4. ``xxx.js``: The d3 code
5. ``tricks and tips with d3``: A tutorial book (by Malcolm Maclean) to lookup for basic functions, sample codes and data; plus a useful cheetsheat. Link to download is here: https://leanpub.com/D3-Tips-and-Tricks

In this plot, you can:
	•	Cmd + Click a label to remove it
	•	Click a point to add back the removed label
	•	Labels are draggable
	•	Shift + Click a label to edit text

### Additional information
Some d3 tutorial links (we are using Version 4):
coloured scatter plot with annotation: 
https://bl.ocks.org/cmpolis/f9805a98b8a455aaccb56e5ee59964f8
https://bl.ocks.org/emeeks/625641430adead4bd7dbc9c1ab3f5102



