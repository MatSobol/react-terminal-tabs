### Instalation 
```
npm i react-terminal-tabs
```
### Features
- handle async functions
- run multiple commands at the same time
- use arrows or click on text to move carot
- use up and down arrow to access previous commands
- paste text with `ctrl + v`
- use `tab` to auto complete
- download response
### Usage
#### Example
```
import Terminal from "react-terminal-tabs";

function App() {
  const commands = {
    hello: () => {
      return "Hello World!!!";
    },
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "700px", height: "500px" }}>
        <Terminal commands={commands} />
      </div>
    </div>
  );
}
export default App;
```
#### Default Commands
- `help` prints all available commands (can be override)
- `clear`/`cls` clear terminal
  
#### Commands
You can access the tab index and abortSignal, which is triggered when pressing Ctrl + C, 
by passing the parameters idx and signal. 
These parameters must be the first arguments, with idx before signal.
```
const commands = {
  hello: () => {
    return "Hello World!!!";
  },
  sleep: async (time: number) => {
    await new Promise((r) => setTimeout(r, time * 1000));
    return `slept for ${time}s`;
  }, 
  tabNum: (idx: number) => {
    return idx;
  },
  curl: async (signal: AbortSignal, url: string) => {
    await fetch(url, { signal });
    return "fetch complete";
  },
};
```
#### Commands on tabs change
```
<Terminal
  commands={commands}
  executeOnNewTab={() => console.log("new tab opened")}
  executeOnRemoveTab={(idx: number) => console.log(`closed tab ${idx}`)}
/>
```
#### Download
If commands response is to big or it can't be parsed to string, like image, you can download it
<img src="https://github.com/user-attachments/assets/535235c2-b5c8-41ad-961e-78a79426fe9c" width="100%">

<p align="center">
  <img src="https://github.com/user-attachments/assets/39d5c453-b856-4e45-87c1-c49484d6b3ad" />
</p>

#### Stylize
<img src="https://github.com/user-attachments/assets/0a2def94-6f9d-4e49-8d40-7073e9bde661" width="100%">

```
const terminalStyle = {
"--background-default": "#fff",
"--active-color": "pink",
"--active-color-hover": "#00cad1",
"--header-background-color": "lightblue",
"--header-background-color-hover": "blue",
"--text-color": "#000",
} as React.CSSProperties;

<Terminal commands={commands} terminalStyle={terminalStyle} />
```
#### Change tab name
Just double click on tab and press enter when finished.
<img src="https://github.com/user-attachments/assets/2e4188ab-d73c-4532-9d9c-489b7066344d" width="100%">

### Props
| name | description
|--|--
| `commands` | List of commands
| `executeOnNewTab` | Function that gets called when new tab is opened
| `executeOnRemoveTab` | Function that gets called when tab is close
| `terminalStyle` | Pass CSSProperties to chagne style


