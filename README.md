# Using TypeScript with JSX
You can now use JSX syntax (https://facebook.github.io/jsx/) in TypeScript. JSX
is a popular syntactic extension to JavaScript that lets you write blocks of expressions
similar to XML or HTML.

In this walkthrough, we'll be using React (https://facebook.github.io/react/docs/getting-started.html)
to show off how using JSX in TypeScript works.

# React, JSX, and TypeScript: A Full Walkthrough
In this walkthrough, we're going to make a small application that shows some
data from GitHub using React. We'll write some React components using JSX
and also use some useful tools to get our development set up.

## Getting Library Files
First, we'll need `react.js`. We can use bower (http://bower.io/) to install it
to a local directory. jQuery is also useful, so let's install it as well.

 > `npm install -g bower`

 > `bower init` <- Accept defaults other than 'mark as private'

 > `bower install react jquery --save`

## Our First HTML page
Next, we need an HTML page. Since we're going to be doing most of our rendering
in code, this can be very simple. This file won't change in the course of this
walkthrough:

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
  	<title>JSX and TypeScript</title>
    <script src="bower_components/react/react.js"></script>
    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="app.js"></script>
  </head>
  <body>
  	<div id="output"></div>
  </body>
</html>
```

## Getting Definition Files
The TypeScript compiler needs definition files (.d.ts) to understand the shapes of
third-party libraries. The tsd tool (http://definitelytyped.org/tsd/) makes
it easy to find and install .d.ts files. We'll create a config file with
`tsd init` and then get the definition files for the two libraries we'll be using:

 > `npm install -g tsd`

 > `tsd init`

 > `tsd query react --save --action install`

 > `tsd query jquery --save --action install`


## Our First tsconfig file
We could manually provide a list of files to `tsc`, but providing a `tsconfig.json`
file makes it easier to see what the compiler settings are. Let's write a basic
config file that specifies our implementation file (app.tsx), the definition file
(tsd.d.ts), and configures our JSX output to be React-compatible:

#### tsconfig.json
```js
{
	"files": ["app.tsx", "typings/tsd.d.ts"],
	"compilerOptions": {
		"jsx": "react"
	}
}
```

## Our First TypeScript file
#### app.tsx
It's time to write some code. We start with the basic Hello World:
```ts
var content = <div>Hello, world!</div>;

$(() => {
	let target = document.getElementById('output');
	React.render(content, target);
});
```

## Running the Compiler
Let's run the compiler in "watch" mode. This will monitor for changes, recompile automatically,
and notify us of any errors. Once we start this, we won't need to explicitly invoke the compiler
again. It's a fire-and-forget service.

 > `npm install -g typescript`

 > `tsc -w`

## Developing Locally
Now we have an app.js on disk and we can see our webpage. The `http-server` npm package
provides a simple static HTTP server.
 
 > `npm install -g http-server`

 > `http-server`

Now we open a browser to `http://localhost:8080` and see our
text rendered. Not terribly exciting, but now we're all set
up to do more interesting things.

## Error Checking in TypeScript
Let's take a brief tour of how TypeScript is helping out here. Because we have
a React JSX definition file, TypeScript knows what kind of tag names and attribute
names are valid, and can issue errors when we make mistakes. Here are some examples
of things that TypeScript will warn you about:
```ts
// Error, attribute "class-name" does not exist (it's "className")
var span = <span class-name="bold">!</span>;

// Error, attribute "rowspan" does not exist (it's "rowSpan")
var table = <table><tr rowspan={2} /></table>;

// Error, function is not compatible with boolean (forgot parentheses to invoke)
function shouldAutoComplete(): boolean { /* ... */ }
var input = <input autoComplete={shouldAutoComplete} />;

// Error, no property 'timestamp' on MouseEvent (it's "timeStamp")
var test = <div onClick={e => console.log('Was clicked at time = ' + e.timestamp) }  />;

// Error, no element 'blockQuote' exists (it's "blockquote")
var quot = <blockQuote />;

// Error, no element 'radialgradient' exists (it's "radialGradient")
var background = <radialgradient />;
```

## Reusable Components
Let's write a React component using an ES6 class. The end goal is to
display a flat list of GitHub repositories, so we'll start with a
component that displays a single repo.

#### Definition
```ts
interface RepoProps extends React.Props<any> {
	name: string;
	url: string;
	description: string;
}
class RepoDisplay extends React.Component<RepoProps, {}> {
	render() {
		return <div>
			<span style={{'fontWeight': 'bold'}}><a href={this.props.url}>{this.props.name}</a>: </span>
			<span>{this.props.description}</span>
		</div>;
	}
}
```
Here we started by defining the shape of `props`. This lets TypeScript know what properties
are supported and required by the class. If we wanted to forgo checking of this object, we
could have specified the base type as `React.Component<any, {}>` instead (the second `{}` refers
to the shape of `state`, which we're not using in this example).

The class definition is simple - we consume the properties provided via `this.props` and
return a JSX element that will later be rendered into HTML.

#### Consumption

To consume the class, we just use it as part of a JSX tag:
```ts
var content = <RepoDisplay
	name="TypeScript"
	url="https://github.com/Microsoft/Typescript"
	description="TypeScript is a superset of JavaScript that compiles to clean JavaScript output."/>;
```

Take a few minutes to play with the code and see how TypeScript is providing type safety
in these expressions. What happens if you misspell `description`, or forget to provide
a `name`? If you're using an editor like Sublime Text, Atom, or VS Code, try using the
"Rename" command to rename one of the properties like `name` and see how it gets updated everywhere
in the file automatically.

## Pulling Live Data

Let's get some live data from GitHub to show what it looks like to display a list
of items. We'll use the list of repos under the Microsoft organization, which is
available at https://api.github.com/users/microsoft/repos?sort=updated.

```ts
let settings = { url: 'https://api.github.com/users/microsoft/repos?sort=updated' };
$.ajax(settings).then((data) => {
	let content = <div>{data.map((entry, i) => <RepoDisplay key={i} {...entry} url={entry.html_url} />) }</div>;
	let target = document.getElementById('output');
	React.render(content, target);
});
```

In this code, we get the data from the website, then display it in a div. Note that
we need to provide a `key` property to React, and that we want to use the `html_url`
field instead of the `url` field. Because the other property names the `RepoDisplay`
component are the same as in the JSON data we get, we can spread in (`{...entry}`)
the entry.
