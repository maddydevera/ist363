//global variable = every component will be able to see it
const myGlobalVariable = "I'm global baby!";

function App () {
  //local variable - only works inside the component
  const myLocalVariable = "I'm local hoe";
  return (
    <div>
      <h1 className="purple">Hello World!</h1>
      <p>{myGlobalVariable}</p>
      <p>seperate lines with br tag that needs a trailending slash</p>
      <br/>
      <p>{myLocalVariable}</p>
    </div>
  );
}

export default App;

//class = className
//for = htmlFor